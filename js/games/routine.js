/**
 * Módulo "Minha Rotina": um dia inteiro ao lado de Noa.
 *
 * As atividades abrem como desafios no jogo (js/games/world/challengePanel.js).
 * Conteúdo e textos: ../data/routine.js. Cada mecânica fica em ./routine/:
 *
 *   sceneTasks  tocar nos elementos da cena         sceneTasks.js
 *   stepByStep  arrastar passos que têm ordem fixa  stepByStep.js
 *   sequence    arrastar cartões até os números     dayTrack.js
 *   pack        arrastar objetos até a mochila      packBag.js
 *   choice      arrastar até Noa o que pode ajudar  helpNoa.js
 */

import { renderSceneTasks } from './routine/sceneTasks.js';
import { renderStepByStep } from './routine/stepByStep.js';
import { renderSequence } from './routine/dayTrack.js';
import { renderPack } from './routine/packBag.js';
import { renderChoice } from './routine/helpNoa.js';

const RENDER_BY_TYPE = Object.freeze({
  sceneTasks: renderSceneTasks,
  stepByStep: renderStepByStep,
  sequence: renderSequence,
  pack: renderPack,
  choice: renderChoice,
});

/** Uma atividade avulsa, para os desafios do jogo (js/games/world/challengePanel.js). */
export function renderChallengeActivity(activity, navigation, complete) {
  const frame = RENDER_BY_TYPE[activity.type](activity, navigation, complete);
  return { element: frame.element, focusTarget: frame.heading };
}
