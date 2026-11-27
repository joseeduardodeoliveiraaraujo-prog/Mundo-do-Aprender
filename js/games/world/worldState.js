/**
 * Onde Noa está no mundo (mapa, bloco e direção), salvo para continuar depois.
 * Dados ausentes ou inválidos voltam ao ponto de partida.
 */

import { readValue, writeValue, STORAGE_KEYS } from '../../storage.js';

const FACINGS = Object.freeze(['up', 'down', 'left', 'right']);

/** @returns {{ map: string, x: number, y: number, facing: string }} */
export function loadWorldState(worldData) {
  const saved = readValue(STORAGE_KEYS.WORLD, null);
  const map = worldData.maps[saved?.map];
  if (!map || !Number.isInteger(saved.x) || !Number.isInteger(saved.y)) return { ...worldData.start };
  const row = map.ground[saved.y];
  const legend = row && map.legend[row[saved.x]];
  if (!legend || legend.solid) return { ...worldData.start };
  return { map: saved.map, x: saved.x, y: saved.y, facing: FACINGS.includes(saved.facing) ? saved.facing : 'down' };
}

export function saveWorldState(state) {
  writeValue(STORAGE_KEYS.WORLD, state);
}
