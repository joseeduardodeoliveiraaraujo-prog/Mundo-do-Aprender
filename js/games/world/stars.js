/**
 * Estrelas do jogo: uma por atividade feita, somando todos os módulos.
 * Vem sempre do progresso salvo (getModuleProgress), nunca de números fixos.
 */

import { MODULES } from '../../modules.js';
import { getModuleProgress } from '../../progress.js';

/** @returns {{ completed: number, total: number }} */
export function totalStars() {
  return MODULES.reduce((sum, module) => {
    const { completed, total } = getModuleProgress(module.id, module.data.activities);
    return { completed: sum.completed + completed, total: sum.total + total };
  }, { completed: 0, total: 0 });
}
