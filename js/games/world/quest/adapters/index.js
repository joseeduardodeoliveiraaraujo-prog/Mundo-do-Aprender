/**
 * Monta a missão de uma atividade: escolhe o tradutor pelo módulo e pelo tipo.
 * Sem tradutor (ou sem o que precisa no mapa), devolve null e a atividade abre
 * na mesa sobre o mapa (challengePanel.js).
 */

import { routineAdapters } from './routine.js';
import { emotionsAdapters } from './emotions.js';
import { animalsAdapters } from './animals.js';
import { communicationAdapters } from './communication.js';
import { speakerOf, NOA } from './common.js';

const ADAPTERS = Object.freeze({
  routine: routineAdapters,
  emotions: emotionsAdapters,
  animals: animalsAdapters,
  communication: communicationAdapters,
});

/**
 * @param {string} moduleId
 * @param {Object} activity
 * @param {{ spot: Object, world: Object, texts: Object, bindings: Object, closeup?: Object }} context
 * @returns {{ moduleId, activity, speaker, steps, success } | null}
 */
export function buildQuest(moduleId, activity, context) {
  const speaker = speakerOf(context.spot);
  const steps = ADAPTERS[moduleId]?.[activity.type]?.(activity, { ...context, speaker });
  if (!steps) return null;
  // Na Comunicação, a frase final é de Noa ("Agora tenho água!").
  const successSpeaker = moduleId === 'communication' ? NOA : speaker;
  return { moduleId, activity, speaker: successSpeaker, steps, success: activity.success };
}
