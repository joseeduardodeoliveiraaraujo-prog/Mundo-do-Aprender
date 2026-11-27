/**
 * Leitura de um mapa do mundo (sem desenhar nada): o que bloqueia, onde ficam
 * as portas e os lugares que Noa usa. Formato dos dados: js/data/world/world.js.
 */

import { ATLAS_FRAMES, TILE_SIZE } from '../../data/world/atlas.js';

const keyOf = ({ x, y }) => `${x},${y}`;
const sameTile = (a, b) => a.x === b.x && a.y === b.y;

/** Tamanho de uma imagem do atlas em blocos. */
export function sizeOf(art) {
  const [, , w, h] = ATLAS_FRAMES[art];
  return { w, h, cols: Math.ceil(w / TILE_SIZE), rows: Math.ceil(h / TILE_SIZE) };
}

/**
 * Blocos ocupados por um objeto colocado com (x, y) no canto superior esquerdo.
 * solid: 'base' (só a última linha: árvores, pessoas), 'all' (cama) ou 'none' (tapete, flor).
 */
export function footprintOf({ art, x, y, solid = 'base' }) {
  if (solid === 'none') return [];
  const { cols, rows } = sizeOf(art);
  const cells = [];
  for (let row = solid === 'all' ? 0 : rows - 1; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) cells.push({ x: x + col, y: y + row });
  }
  return cells;
}

/** Blocos de uma cerca retangular, sem as aberturas (porteiras). */
export function fenceCells({ x, y, w, h, gaps = [] }) {
  const cells = [];
  for (let col = x; col < x + w; col += 1) cells.push({ x: col, y }, { x: col, y: y + h - 1 });
  for (let row = y + 1; row < y + h - 1; row += 1) cells.push({ x, y: row }, { x: x + w - 1, y: row });
  return cells.filter((cell) => !gaps.some(([gx, gy]) => gx === cell.x && gy === cell.y));
}

/** Blocos de uma casa vista de fora (telhado + parede), menos a porta. */
export function buildingCells({ x, y, w, h, door }) {
  const cells = [];
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      if (!(row === y + h - 1 && col === x + door)) cells.push({ x: col, y: row });
    }
  }
  return cells;
}

/**
 * @param {Object} map
 * @param {(spotId: string) => boolean} isRemoved  lugares que sumiram do mapa
 */
export function createMapModel(map, isRemoved) {
  const cols = map.ground[0].length;
  const rows = map.ground.length;
  const spots = map.spots.map((spot) => ({
    ...spot,
    cells: spot.cells ?? footprintOf({ ...spot, solid: spot.solid ?? 'base' }),
  }));

  const blocked = new Set([
    ...(map.objects ?? []).flatMap(footprintOf),
    ...(map.buildings ?? []).flatMap(buildingCells),
    ...(map.fences ?? []).flatMap(fenceCells),
  ].map(keyOf));

  const inside = ({ x, y }) => x >= 0 && y >= 0 && x < cols && y < rows;
  const legendAt = ({ x, y }) => map.legend[map.ground[y][x]];
  const spotAt = (tile) => spots.find((spot) => !isRemoved(spot.id) && spot.cells.some((cell) => sameTile(cell, tile))) ?? null;
  const doorAt = (tile) => map.doors.find((door) => sameTile(door, tile)) ?? null;

  return {
    cols,
    rows,
    spots,
    inside,
    legendAt,
    spotAt,
    doorAt,
    isWalkable(tile) {
      if (!inside(tile) || legendAt(tile).solid || blocked.has(keyOf(tile))) return false;
      return !spotAt(tile);
    },
    /** Distância (em pixels) de um ponto até o bloco mais próximo do lugar. */
    distanceToSpot(spot, point) {
      return Math.min(...spot.cells.map(({ x, y }) => {
        const dx = Math.max(x * TILE_SIZE - point.x, 0, point.x - (x + 1) * TILE_SIZE);
        const dy = Math.max(y * TILE_SIZE - point.y, 0, point.y - (y + 1) * TILE_SIZE);
        return Math.hypot(dx, dy);
      }));
    },
  };
}
