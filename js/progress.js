/**
 * progress.js — progresso real da criança nas atividades.
 *
 * Formato salvo (chave STORAGE_KEYS.PROGRESS):
 *   { [moduleId]: { completed: string[], lastActivityId: string|null, updatedAt: string } }
 *
 * O progresso é sempre calculado a partir das atividades que EXISTEM nos
 * dados do módulo: ids antigos/removidos não contam, e um módulo sem
 * atividades nunca exibe progresso inventado.
 */

import { readValue, writeValue, STORAGE_KEYS } from './storage.js';

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readAllProgress() {
  const raw = readValue(STORAGE_KEYS.PROGRESS, {});
  return isPlainObject(raw) ? raw : {};
}

function readModuleEntry(moduleId) {
  const entry = readAllProgress()[moduleId];
  return isPlainObject(entry) ? entry : {};
}

function updateModuleEntry(moduleId, changes) {
  const allProgress = readAllProgress();
  const current = isPlainObject(allProgress[moduleId]) ? allProgress[moduleId] : {};
  allProgress[moduleId] = { ...current, ...changes, updatedAt: new Date().toISOString() };
  writeValue(STORAGE_KEYS.PROGRESS, allProgress);
}

/**
 * Ids das atividades concluídas (como foram salvos; filtre pelas existentes).
 * @param {string} moduleId
 * @returns {string[]}
 */
export function getCompletedActivityIds(moduleId) {
  const { completed } = readModuleEntry(moduleId);
  return Array.isArray(completed) ? completed.filter((id) => typeof id === 'string') : [];
}

/**
 * Registra uma atividade como concluída (sem duplicar).
 * @param {string} moduleId
 * @param {string} activityId
 */
export function markActivityCompleted(moduleId, activityId) {
  const completed = new Set(getCompletedActivityIds(moduleId));
  if (completed.has(activityId)) return;
  completed.add(activityId);
  updateModuleEntry(moduleId, { completed: [...completed] });
}

/**
 * @param {string} moduleId
 * @param {ReadonlyArray<{ id: string }>} activities  atividades existentes no módulo
 * @returns {{ completed: number, total: number }}
 */
export function getModuleProgress(moduleId, activities) {
  const existingIds = new Set(activities.map((activity) => activity.id));
  const completed = getCompletedActivityIds(moduleId).filter((id) => existingIds.has(id)).length;
  return { completed, total: activities.length };
}

/**
 * Última atividade aberta (para "Continuar de onde parei").
 * @param {string} moduleId
 * @returns {string|null}
 */
export function getLastActivityId(moduleId) {
  const { lastActivityId } = readModuleEntry(moduleId);
  return typeof lastActivityId === 'string' ? lastActivityId : null;
}

/**
 * Guarda a atividade aberta. Use null ao concluir o módulo.
 * @param {string} moduleId
 * @param {string|null} activityId
 */
export function saveLastActivity(moduleId, activityId) {
  updateModuleEntry(moduleId, { lastActivityId: activityId ?? null });
}
