/**
 * Monta a missão de um caminho fechado (lugar com `gate`): Noa explica o que aconteceu, a cena de
 * perto do quebra-cabeça abre e, no fim, o caminho fica aberto. Não é atividade de módulo:
 * não registra progresso nem estrela (a missão não tem `activity`).
 */

import { gatePuzzles } from '../../data/world/gates.js';
import { NOA } from './quest/adapters/common.js';
import { openGate } from './gates.js';

/**
 * @param {Object} spot   lugar com `gate`
 * @param {Object} world  createWorldScene(...)
 * @returns {Object|null} missão para o questRunner (null se o quebra-cabeça não existir)
 */
export function buildGateQuest(spot, world) {
  const puzzle = gatePuzzles[spot.gate];
  if (!puzzle) {
    console.warn(`Caminho "${spot.gate}" sem quebra-cabeça em gatePuzzles.`);
    return null;
  }
  return {
    speaker: NOA,
    success: puzzle.success,
    steps: [
      { kind: 'say', speaker: NOA, text: puzzle.intro },
      {
        kind: 'closeup', speaker: NOA, def: puzzle.closeup, goal: puzzle.goal, checklist: 'done',
        tasks: puzzle.tasks, actions: puzzle.actions,
      },
    ],
    onComplete: () => {
      openGate(spot.gate);
      world.openGate(spot.id);
    },
  };
}
