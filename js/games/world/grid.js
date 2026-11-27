/**
 * Utilitários da grade do mapa (blocos de 16×16): direções e caminho mais curto.
 */

export const DIRECTIONS = Object.freeze({
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
});

const NEIGHBORS = Object.values(DIRECTIONS);
const keyOf = ({ x, y }) => `${x},${y}`;

/** Blocos vizinhos (cima, baixo, esquerda, direita). */
export const neighborsOf = ({ x, y }) => NEIGHBORS.map((step) => ({ x: x + step.x, y: y + step.y }));

/** Direção de um bloco até um bloco vizinho. */
export function directionBetween(from, to) {
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  return Object.keys(DIRECTIONS).find((name) => DIRECTIONS[name].x === dx && DIRECTIONS[name].y === dy) ?? 'down';
}

/**
 * Caminho mais curto (busca em largura) até o primeiro bloco que satisfaz `isGoal`.
 * @param {{x:number,y:number}} start
 * @param {(tile: {x:number,y:number}) => boolean} isGoal
 * @param {(tile: {x:number,y:number}) => boolean} isWalkable
 * @returns {Array<{x:number,y:number}> | null}  blocos depois do início; [] se já está no objetivo
 */
export function findPath(start, isGoal, isWalkable) {
  if (isGoal(start)) return [];
  const cameFrom = new Map([[keyOf(start), null]]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    for (const next of neighborsOf(current)) {
      const key = keyOf(next);
      if (cameFrom.has(key) || !isWalkable(next)) continue;
      cameFrom.set(key, current);
      if (isGoal(next)) {
        const path = [next];
        for (let step = current; step && keyOf(step) !== keyOf(start); step = cameFrom.get(keyOf(step))) path.unshift(step);
        return path;
      }
      queue.push(next);
    }
  }
  return null;
}
