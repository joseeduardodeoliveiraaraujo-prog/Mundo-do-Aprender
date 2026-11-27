/**
 * Cena Phaser do Bairro do Noa: desenha o mapa atual, Noa andando livremente,
 * lugares com marcadores de desafio e portas para outros mapas.
 *
 * Nenhum texto é desenhado aqui; a tela (js/games/world.js) recebe os avisos
 * (`onMapChange`, `onNearChange`, `onArrive`) e mostra falas e botões em HTML.
 */

import { ATLAS_SRC, ATLAS_FRAMES, TILE_SIZE } from '../../data/world/atlas.js';
import { findPath, neighborsOf, directionBetween } from './grid.js';
import { createMapModel } from './mapModel.js';
import { createFreeWalker } from './freeWalker.js';
import { createMapView, ATLAS_KEY } from './mapView.js';
import { createQuestObjects } from './questObjects.js';

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
  let view = null;
  let near = null;
  let hovered = null;
  let lastTile = null;
  let lastTime = 0;
  let changingMap = false;
  let doorsLocked = false;
  const questObjects = createQuestObjects({ scene: () => scene, model: () => model, view: () => view, walker: () => walker });

  const isReduced = () => scene?.registry.get('reduceMotion') === true;
  const map = () => data.maps[current.map];

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
    if (model.distanceToSpot(spot, feetPoint(walker.position)) <= REACH) { arriveAt(spot); return; }
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
      .map((spot) => ({ spot, distance: model.distanceToSpot(spot, feet) }))
      .filter(({ distance }) => distance <= REACH)
      .sort((a, b) => a.distance - b.distance);
    const next = walker.isMoving ? null : candidates[0]?.spot ?? null;
    if (next !== near) { near = next; onNearChange(near); }
  }

  function createScene() {
    return {
      key: 'world',
      preload() {
        if (!this.textures.exists(ATLAS_KEY)) this.load.image(ATLAS_KEY, ATLAS_SRC);
      },
      create() {
        scene = this;
        // Registra cada peça do atlas pelo nome (uma vez por jogo).
        const texture = this.textures.get(ATLAS_KEY);
        Object.entries(ATLAS_FRAMES).forEach(([name, [x, y, w, h]]) => {
          if (!texture.has(name)) texture.add(name, 0, x, y, w, h);
        });
        changingMap = false;
        near = null;
        hovered = null;
        questObjects.reset();
        model = createMapModel(map(), (id) => removed.has(id));
        view = createMapView(this, { map: map(), model, used, removed, statusOf });

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

        const camera = this.cameras.main;
        if (map().background) camera.setBackgroundColor(map().background);
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
          const door = doorsLocked ? null : model.doorAt(tile);
          if (door) { changeMap(door); return; }
        }
        questObjects.update();
        updateNear();
        view.drawHighlight(hovered ?? near);
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
    /** Primeiro uso: troca a imagem (usedArt) ou tira o objeto do mapa (removeOnUse). */
    markUsed(id) {
      const spot = model?.spots.find((item) => item.id === id);
      if (!spot || used.has(id)) return;
      used.add(id);
      view.showUsed(spot);
      if (spot.removeOnUse) {
        removed.add(id);
        if (near === spot) { near = null; onNearChange(null); }
      }
    },
    isUsed: (id) => used.has(id),
    /** Objetos de missão (itens, pistas, item carregado). */
    quest: questObjects,
    /** Durante uma missão, as portas não trocam de mapa. */
    lockDoors(locked) { doorsLocked = locked; },
    spotById: (id) => model?.spots.find((spot) => spot.id === id) ?? null,
    spotsWhere: (test) => model?.spots.filter(test) ?? [],
    freeCellsNear: (origin, count) => model?.freeCellsNear(origin, count) ?? [],
    refreshMarkers() { view?.refreshMarkers(); },
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
