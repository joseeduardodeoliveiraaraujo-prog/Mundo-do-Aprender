/**
 * Caminhos fechados por um quebra-cabeça (ex.: a ponte quebrada do rio).
 *
 * No mapa, um caminho fechado é um lugar com `gate: '<id>'`: ele bloqueia a passagem até a
 * criança resolver o quebra-cabeça (js/data/world/closeups/bridge.js → gatePuzzles). Resolvido,
 * fica aberto para sempre (salvo no localStorage). Com a preferência "Caminhos sempre abertos"
 * (para quem precisa de menos etapas), todos ficam abertos desde o começo.
 */

import { readValue, writeValue, removeValue, STORAGE_KEYS } from '../../storage.js';
import { getSettings } from '../../settings.js';

/** Ids dos caminhos já abertos (dados corrompidos viram lista vazia). */
function openedIds() {
  const saved = readValue(STORAGE_KEYS.GATES, []);
  return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
}

/** @param {string} id */
export const isGateOpen = (id) => getSettings().openPaths || openedIds().includes(id);

/** Salva o caminho como aberto. @param {string} id */
export function openGate(id) {
  const ids = openedIds();
  if (!ids.includes(id)) writeValue(STORAGE_KEYS.GATES, [...ids, id]);
}

/** Fecha todos os caminhos de novo (novo jogo). */
export function resetGates() {
  removeValue(STORAGE_KEYS.GATES);
}
