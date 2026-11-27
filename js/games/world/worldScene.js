/**
 * Cena Phaser do Bairro do Noa: desenha o mapa atual, Noa andando livremente,
 * lugares com marcadores de desafio e portas para outros mapas.
 *
 * Nenhum texto é desenhado aqui; a tela (js/games/world.js) recebe os avisos
 * (`onMapChange`, `onNearChange`, `onArrive`) e mostra falas e botões em HTML.
 */

import { TILESETS, TILES, TILE_SIZE } from '../../data/world/tiles.js';
import { findPath, neighborsOf, directionBetween } from './grid.js';
import { createMapModel } from './mapModel.js';
import { createFreeWalker } from './freeWalker.js';

const MAX_STEP_MS = 100;  // evita saltos depois de uma pausa da aba
const REACH = 10;         // pixels entre os pés de Noa e o lugar para valer "perto"
const FADE_MS = 200;

const sameTile = (a, b) => a.x === b.x && a.y === b.y;
const feetPoint = ({ x, y }) => ({ x, y: y - 3 });
const tileOf = ({ x, y }) => ({ x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) });
const centerOf = ({ x, y }) => ({ x: x * TILE_SIZE + TILE_SIZE / 2, y: y * TILE_SIZE + 12 });

/**
 * @param {Object} options
 * @param {Object} options.data      worldData (js/data/world/world.js)
 * @param {{ map: string, x: number, y: number, facing: string }} options.state  onde Noa começa
 * @param {(spot: Object) => 'todo'|'done'|null} options.statusOf  marcador do lugar
 * @param {(map: Object) => void} options.onMapChange
 * @param {(spot: Object|null) => void} options.onNearChange
 * @param {(spot: Object) => void} options.onArrive  Noa chegou num lugar (toque, botão ou Enter)
 */
export function createWorldScene({ data, state, statusOf, onMapChange, onNearChange, onArrive }) {
  let current = { ...state };
  const used = new Set();
  const removed = new Set();
  let scene = null;
  let model = null;
  let walker = null;
  let highlight = null;
  let spotImages = new Map();
  let markers = new Map();
  let near = null;
  let hovered = null;
  let lastTile = null;
  let lastTime = 0;
  let changingMap = false;
  let highlightColor = 0x1d6479;

  const isReduced = () => scene?.registry.get('reduceMotion') === true;
  const map = () => data.maps[current.map];
  const draw = (name, x, y, depth) => scene.add.image(x * TILE_SIZE, y * TILE_SIZE, ...TILES[name]).setOrigin(0).setDepth(depth);

  function drawMap() {
    map().ground.forEach((line, y) => [...line].forEach((char, x) => {
      const legend = map().legend[char];
      if (legend.base) draw(legend.base, x, y, 0);
      draw(legend.tile, x, y, 0);
    }));
    map().furniture.forEach(({ tile, x, y }) => draw(tile, x, y, 1));
    spotImages = new Map();
    markers = new Map();
    model.spots.forEach((spot) => {
      if (removed.has(spot.id)) return;
      const tiles = spot.tiles ?? [];
      spotImages.set(spot.id, tiles.map(({ tile, x, y }, index) => (
        draw(used.has(spot.id) && spot.usedTiles ? spot.usedTiles[index] ?? tile : tile, x, y, 2))));
      if (spot.challenge) {
        const top = Math.min(...spot.cells.map(({ y }) => y));
        const left = Math.min(...spot.cells.map(({ x }) => x));
        markers.set(spot.id, scene.add.image(left * TILE_SIZE, top * TILE_SIZE - 11, ...TILES.markTodo).setOrigin(0).setDepth(15));
      }
    });
    refreshMarkers();
  }

  function refreshMarkers() {
    markers.forEach((image, id) => {
      const status = statusOf(model.spots.find((spot) => spot.id === id));
      image.setVisible(Boolean(status));
      if (status) image.setTexture(...TILES[status === 'done' ? 'markDone' : 'markTodo']);
    });
  }

  function walkTo(isGoal, finalPoint, onEnd) {
    const path = findPath(tileOf(feetPoint(walker.position)), isGoal, model.isWalkable);
    if (!path) return;
    const points = path.map(centerOf);
    if (finalPoint) points.push(finalPoint);
    walker.follow(points, onEnd);
  }

  function arriveAt(spot) {
    const here = tileOf(feetPoint(walker.position));
    const cell = spot.cells.find((item) => neighborsOf(here).some((tile) => sameTile(tile, item))) ?? spot.cells[0];
    if (!sameTile(cell, here)) walker.face(directionBetween(here, cell));
    onArrive(spot);
  }

  function goToSpot(spot) {
    if (model.distanceToSpot(spot, feetPoint(walker.position), TILE_SIZE) <= REACH) { arriveAt(spot); return; }
    const isBeside = (tile) => spot.cells.some((cell) => neighborsOf(tile).some((item) => sameTile(item, cell)));
    walkTo(isBeside, null, () => arriveAt(spot));
  }

  function handleTap(pointer) {
    const tile = tileOf({ x: pointer.worldX, y: pointer.worldY });
    if (!model.inside(tile) || changingMap) return;
    const spot = model.spotAt(tile);
    if (spot) { goToSpot(spot); return; }
    if (model.isWalkable(tile)) {
      const y = Math.min(Math.max(pointer.worldY, tile.y * TILE_SIZE + 7), tile.y * TILE_SIZE + 15);
      walkTo((item) => sameTile(item, tile), { x: pointer.worldX, y }, null);
    } else {
      walkTo((item) => neighborsOf(tile).some((beside) => sameTile(beside, item)), null, null);
    }
  }

  function changeMap(door) {
    changingMap = true;
    current = { map: door.to, ...door.spawn, facing: door.facing };
    const restart = () => scene.scene.restart();
    if (isReduced()) restart();
    else {
      scene.cameras.main.once('camerafadeoutcomplete', restart);
      scene.cameras.main.fadeOut(FADE_MS);
    }
  }

  function updateNear() {
    const feet = feetPoint(walker.position);
    const candidates = model.spots
      .filter((spot) => !removed.has(spot.id))
      .map((spot) => ({ spot, distance: model.distanceToSpot(spot, feet, TILE_SIZE) }))
      .filter(({ distance }) => distance <= REACH)
      .sort((a, b) => a.distance - b.distance);
    const next = walker.isMoving ? null : candidates[0]?.spot ?? null;
    if (next !== near) { near = next; onNearChange(near); }
  }

  function drawHighlight() {
    highlight.clear();
    const spot = hovered ?? near;
    if (!spot || removed.has(spot.id)) return;
    const xs = spot.cells.map(({ x }) => x);
    const ys = spot.cells.map(({ y }) => y);
    const left = Math.min(...xs) * TILE_SIZE;
    const top = Math.min(...ys) * TILE_SIZE;
    highlight.lineStyle(1, highlightColor, 1);
    highlight.strokeRect(left + 0.5, top + 0.5, (Math.max(...xs) + 1) * TILE_SIZE - left - 1, (Math.max(...ys) + 1) * TILE_SIZE - top - 1);
  }

  function createScene() {
    return {
      key: 'world',
      preload() {
        Object.entries(TILESETS).forEach(([key, src]) => {
          if (!this.textures.exists(key)) this.load.spritesheet(key, src, { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
        });
      },
      create() {
        scene = this;
        changingMap = false;
        near = null;
        hovered = null;
        model = createMapModel(map(), (id) => removed.has(id));
        drawMap();
        const token = getComputedStyle(this.game.canvas).getPropertyValue('--module-strong').trim();
        if (/^#[0-9a-f]{6}$/i.test(token)) highlightColor = Number.parseInt(token.slice(1), 16);

        // Se o lugar salvo estiver ocupado (ex.: um objeto voltou), começa no bloco livre mais perto.
        if (!model.isWalkable(current)) Object.assign(current, findPath(current, model.isWalkable, model.inside)?.pop() ?? data.start);
        const start = centerOf(current);
        walker = createFreeWalker(this, {
          position: { x: start.x, y: start.y + 2 },
          facing: current.facing,
          isBlockedAt: (x, y) => !model.isWalkable(tileOf({ x, y })),
          isReduced,
        });
        lastTile = tileOf(feetPoint(walker.position));
        highlight = this.add.graphics().setDepth(20);

        const camera = this.cameras.main;
        camera.setBounds(0, 0, model.cols * TILE_SIZE, model.rows * TILE_SIZE).setRoundPixels(true);
        camera.startFollow(walker.sprite, true, isReduced() ? 1 : 0.2, isReduced() ? 1 : 0.2);
        if (!isReduced()) camera.fadeIn(FADE_MS);

        this.input.on('pointermove', (pointer) => {
          const tile = tileOf({ x: pointer.worldX, y: pointer.worldY });
          hovered = model.inside(tile) ? model.spotAt(tile) : null;
          this.game.canvas.style.cursor = hovered || (model.inside(tile) && model.doorAt(tile)) ? 'pointer' : 'default';
        });
        this.input.on('pointerdown', handleTap);
        onMapChange(map());
        onNearChange(null);
      },
      update() {
        const now = performance.now();
        if (!changingMap) walker.update(Math.min(now - (lastTime || now), MAX_STEP_MS));
        lastTime = now;
        const tile = tileOf(feetPoint(walker.position));
        if (!changingMap && !sameTile(tile, lastTile)) {
          lastTile = tile;
          const door = model.doorAt(tile);
          if (door) { changeMap(door); return; }
        }
        updateNear();
        drawHighlight();
      },
    };
  }

  return {
    createScene,
    goToSpot(id) {
      const spot = model?.spots.find((item) => item.id === id);
      if (spot && !changingMap) goToSpot(spot);
    },
    goToDoor(index) {
      const door = map().doors[index];
      if (door && model && !changingMap) walkTo((tile) => sameTile(tile, door), null, null);
    },
    setDirection(x, y) { walker?.hold(x, y); },
    /** Usa o lugar perto de Noa. @returns {boolean} false se nada estiver perto */
    useNearest() {
      if (!near) return false;
      arriveAt(near);
      return true;
    },
    /** Primeiro uso: troca as imagens (usedTiles) ou tira o objeto do mapa (removeOnUse). */
    markUsed(id) {
      const spot = model?.spots.find((item) => item.id === id);
      if (!spot || used.has(id)) return;
      used.add(id);
      if (spot.removeOnUse) {
        removed.add(id);
        spotImages.get(id)?.forEach((image) => image.destroy());
        if (near === spot) { near = null; onNearChange(null); }
      } else if (spot.usedTiles) {
        spotImages.get(id)?.forEach((image, index) => image.setTexture(...TILES[spot.usedTiles[index]]));
      }
    },
    isUsed: (id) => used.has(id),
    refreshMarkers() { if (model) refreshMarkers(); },
    pause() { walker?.hold(0, 0); scene?.scene.pause(); },
    resume() { scene?.scene.resume(); },
    /** Onde Noa está (para salvar e voltar depois). */
    getState() {
      if (!walker) return current;
      const tile = tileOf(feetPoint(walker.position));
      return { map: current.map, x: tile.x, y: tile.y, facing: walker.facing };
    },
  };
}
