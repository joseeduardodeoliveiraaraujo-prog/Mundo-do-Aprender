/**
 * Leitura de um mapa do mundo (sem desenhar nada): o que bloqueia, onde ficam
 * as portas e os lugares que Noa usa. Formato dos dados: js/data/world/world.js.
 */

const sameTile = (a, b) => a.x === b.x && a.y === b.y;

/** Blocos ocupados por um lugar (tiles desenhados ou só células). */
export const cellsOf = (spot) => spot.cells ?? spot.tiles.map(({ x, y }) => ({ x, y }));

/**
 * @param {Object} map
 * @param {(spotId: string) => boolean} isRemoved  lugares que sumiram do mapa
 */
export function createMapModel(map, isRemoved) {
  const cols = map.ground[0].length;
  const rows = map.ground.length;
  const spots = map.spots.map((spot) => ({ ...spot, cells: cellsOf(spot) }));

  const inside = ({ x, y }) => x >= 0 && y >= 0 && x < cols && y < rows;
  const legendAt = ({ x, y }) => map.legend[map.ground[y][x]];
  const spotAt = (tile) => spots.find((spot) => !isRemoved(spot.id) && spot.cells.some((cell) => sameTile(cell, tile))) ?? null;
  const doorAt = (tile) => map.doors.find((door) => sameTile(door, tile)) ?? null;

  function isWalkable(tile) {
    if (!inside(tile) || legendAt(tile).solid) return false;
    return !map.furniture.some((item) => sameTile(item, tile)) && !spotAt(tile);
  }

  return {
    cols,
    rows,
    spots,
    inside,
    legendAt,
    spotAt,
    doorAt,
    isWalkable,
    /** Distância (em pixels) de um ponto até o bloco mais próximo do lugar. */
    distanceToSpot(spot, point, tileSize) {
      return Math.min(...spot.cells.map(({ x, y }) => {
        const dx = Math.max(x * tileSize - point.x, 0, point.x - (x + 1) * tileSize);
        const dy = Math.max(y * tileSize - point.y, 0, point.y - (y + 1) * tileSize);
        return Math.hypot(dx, dy);
      }));
    },
  };
}
