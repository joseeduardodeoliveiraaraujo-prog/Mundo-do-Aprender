/**
 * Desenho de um mapa do mundo na cena Phaser: chão com encaixe automático,
 * casas, cercas, objetos, lugares, sombras, marcadores de desafio e destaque.
 *
 * Profundidade: o chão fica embaixo; objetos, pessoas e Noa são ordenados pela
 * linha de baixo (quem está mais abaixo na tela aparece na frente). Assim Noa
 * passa atrás das copas das árvores e na frente dos troncos.
 */

import { TILE_SIZE } from '../../data/world/atlas.js';
import { terrainPiece, roomPiece, fencePiece, variantOf } from './autotile.js';
import { sizeOf, fenceCells } from './mapModel.js';

export const ATLAS_KEY = 'world-atlas';
const TERRAINS = ['grass', 'dirt'];
const CENTER_VARIANTS = Object.freeze({
  grass: ['grass9C', 'grass9C', 'grass9C', 'grass9C', 'grassVar0', 'grassVar1', 'grassVar2', 'grassVar3', 'grassVar4', 'grassVar5', 'grassVar6', 'grassVar7', 'grassVar8'],
  dirt: ['dirt9C', 'dirt9C', 'dirt9C', 'dirtVar0', 'dirtVar1', 'dirtVar2', 'dirtVar3', 'dirtVar4', 'dirtVar5'],
});
const DEPTH = Object.freeze({ base: 0, terrain: 1, flat: 3, marker: 100000, highlight: 100001 });
const MARKER_OFFSET = 11;

/** Pessoas e animais ganham sombra no chão. */
const hasShadow = (spot) => spot.art?.startsWith('person') || Boolean(spot.animal);

/**
 * @param {Object} scene  cena Phaser (com o atlas carregado)
 * @param {Object} options
 * @param {Object} options.map
 * @param {Object} options.model  createMapModel(map)
 * @param {Set<string>} options.used     lugares já usados (mostram `usedArt`)
 * @param {Set<string>} options.removed  lugares que sumiram
 * @param {(spot: Object) => 'todo'|'done'|null} options.statusOf
 */
export function createMapView(scene, { map, model, used, removed, statusOf }) {
  const image = (name, px, py, depth) => scene.add.image(px, py, ATLAS_KEY, name).setOrigin(0).setDepth(depth);
  const spotImages = new Map();
  const markers = new Map();
  const highlight = scene.add.graphics().setDepth(DEPTH.highlight);
  const { cols, rows } = model;

  // Cor do destaque vem do token do módulo (respeita alto contraste).
  let highlightColor = 0x1d6479;
  const token = getComputedStyle(scene.game.canvas).getPropertyValue('--module-strong').trim();
  if (/^#[0-9a-f]{6}$/i.test(token)) highlightColor = Number.parseInt(token.slice(1), 16);

  /**
   * Imagem com a base alinhada embaixo dos seus blocos; devolve [imagem, profundidade, tamanho].
   * `lift` sobe a imagem alguns pixels (ex.: despertador em cima do criado-mudo).
   */
  function placeArt(art, x, y, { flat = false, lift = 0 } = {}) {
    const size = sizeOf(art);
    const bottom = (y + size.rows) * TILE_SIZE;
    const depth = flat ? DEPTH.flat : bottom + (lift ? 0.2 : 0);
    return [image(art, x * TILE_SIZE + (size.cols * TILE_SIZE - size.w) / 2, bottom - size.h - lift, depth), depth, size];
  }

  // ---------- Chão ----------
  const hasTerrain = (terrain, x, y) => (
    x >= 0 && y >= 0 && x < cols && y < rows && (map.legend[map.ground[y][x]].terrains ?? []).includes(terrain));
  map.ground.forEach((line, y) => [...line].forEach((char, x) => {
    const legend = map.legend[char];
    const px = x * TILE_SIZE;
    const py = y * TILE_SIZE;
    if (map.base) image(map.base, px, py, DEPTH.base);
    if (legend.room) image(roomPiece(x, y, cols, rows), px, py, DEPTH.base);
    if (legend.floor) image(legend.floor, px, py, DEPTH.base);
    (legend.terrains ?? []).forEach((terrain, index) => {
      let piece = terrainPiece(terrain, {
        up: hasTerrain(terrain, x, y - 1), down: hasTerrain(terrain, x, y + 1),
        left: hasTerrain(terrain, x - 1, y), right: hasTerrain(terrain, x + 1, y),
      });
      if (piece === `${terrain}9C`) piece = CENTER_VARIANTS[terrain][variantOf(x, y, CENTER_VARIANTS[terrain].length)];
      image(piece, px, py, DEPTH.terrain + index * 0.1);
    });
    if (legend.tile) image(legend.tile, px, py, DEPTH.terrain + 0.5);
  }));

  // ---------- Casas vistas de fora: telhado em 9 pedaços + parede com porta ----------
  (map.buildings ?? []).forEach(({ x, y, w, h, door }) => {
    const depth = (y + h) * TILE_SIZE;
    for (let row = 0; row < h - 1; row += 1) {
      const r = row === 0 ? 'T' : row === h - 2 ? 'B' : '';
      for (let col = 0; col < w; col += 1) {
        const c = col === 0 ? 'L' : col === w - 1 ? 'R' : '';
        image(`roof${r + c || 'C'}`, (x + col) * TILE_SIZE, (y + row) * TILE_SIZE, depth);
      }
    }
    for (let col = 0; col < w; col += 1) {
      const px = (x + col) * TILE_SIZE;
      const py = (y + h - 1) * TILE_SIZE;
      image(Math.abs(col - door) === 1 ? 'frontWindow' : 'frontWall', px, py, depth);
      if (col === door) image('door', px, py, depth + 0.1);
    }
  });

  // ---------- Cercas ----------
  const fences = new Set((map.fences ?? []).flatMap(fenceCells).map(({ x, y }) => `${x},${y}`));
  fences.forEach((key) => {
    const [x, y] = key.split(',').map(Number);
    const piece = fencePiece({
      up: fences.has(`${x},${y - 1}`), down: fences.has(`${x},${y + 1}`),
      left: fences.has(`${x - 1},${y}`), right: fences.has(`${x + 1},${y}`),
    });
    image(piece, x * TILE_SIZE, y * TILE_SIZE, (y + 1) * TILE_SIZE);
  });

  // ---------- Objetos ----------
  (map.objects ?? []).forEach((item) => placeArt(item.art, item.x, item.y, { flat: item.solid === 'none', lift: item.lift }));

  // ---------- Lugares (pessoas, animais, móveis que Noa usa) ----------
  /** Desenha um lugar. Itens de missão podem usar uma figura carregada (imageKey) em vez do atlas. */
  function drawSpot(spot) {
    if (removed.has(spot.id) || (!spot.art && !spot.imageKey)) return;
    let picture;
    let depth;
    let size;
    if (spot.imageKey) {
      size = { cols: 1, rows: 1 };
      depth = (spot.y + 1) * TILE_SIZE;
      picture = scene.add.image(spot.x * TILE_SIZE, spot.y * TILE_SIZE, spot.imageKey)
        .setOrigin(0).setDisplaySize(TILE_SIZE, TILE_SIZE).setDepth(depth);
    } else {
      const art = used.has(spot.id) && spot.usedArt ? spot.usedArt : spot.art;
      [picture, depth, size] = placeArt(art, spot.x, spot.y, { lift: spot.lift });
    }
    const shown = [picture];
    if (hasShadow(spot) || spot.imageKey) {
      shown.push(image('shadow', spot.x * TILE_SIZE + (size.cols * TILE_SIZE - 12) / 2, depth - 5, depth - 0.5));
    }
    spotImages.set(spot.id, shown);
    if (spot.challenge) {
      markers.set(spot.id, image('markTodo', spot.x * TILE_SIZE + (size.cols * TILE_SIZE - TILE_SIZE) / 2,
        picture.y - MARKER_OFFSET, DEPTH.marker));
    }
  }
  model.spots.forEach(drawSpot);

  function refreshMarkers() {
    markers.forEach((marker, id) => {
      const status = statusOf(model.spots.find((spot) => spot.id === id));
      marker.setVisible(Boolean(status));
      if (status) marker.setFrame(status === 'done' ? 'markDone' : 'markTodo');
    });
  }

  refreshMarkers();

  return {
    refreshMarkers,
    drawSpot,
    /** Apaga um lugar temporário da tela. */
    eraseSpot(id) {
      spotImages.get(id)?.forEach((item) => item.destroy());
      spotImages.delete(id);
    },
    /** Contorno fixo (sem piscar) em volta do lugar; null apaga. */
    drawHighlight(spot) {
      highlight.clear();
      if (!spot || removed.has(spot.id)) return;
      const xs = spot.cells.map(({ x }) => x);
      const ys = spot.cells.map(({ y }) => y);
      const left = Math.min(...xs) * TILE_SIZE;
      const top = Math.min(...ys) * TILE_SIZE;
      const width = (Math.max(...xs) + 1) * TILE_SIZE - left;
      const height = (Math.max(...ys) + 1) * TILE_SIZE - top;
      highlight.lineStyle(1, highlightColor, 1);
      highlight.strokeRect(left + 0.5, top + 0.5, width - 1, height - 1);
    },
    /** Mostra o lugar usado: troca a imagem ou tira do mapa. */
    showUsed(spot) {
      const [picture, ...rest] = spotImages.get(spot.id) ?? [];
      if (!picture) return;
      if (spot.removeOnUse) [picture, ...rest].forEach((item) => item.destroy());
      else if (spot.usedArt) picture.setFrame(spot.usedArt);
    },
  };
}
