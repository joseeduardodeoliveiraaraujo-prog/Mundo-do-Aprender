/**
 * Módulo "Minha Rotina": um dia inteiro ao lado de Noa, em seis momentos.
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Trilha, mapa e recompensas: components/journey.js.
 * Conteúdo e textos: ../data/routine.js. Cada mecânica fica em ./routine/:
 *
 *   sceneTasks  tocar nos elementos da cena         sceneTasks.js
 *   stepByStep  arrastar passos que têm ordem fixa  stepByStep.js
 *   sequence    arrastar cartões até os números     dayTrack.js
 *   pack        arrastar objetos até a mochila      packBag.js
 *   choice      arrastar até Noa o que pode ajudar  helpNoa.js
 */

import { startModuleFlow } from '../components/moduleFlow.js';
import { createJourney } from '../components/journey.js';
import { routineData } from '../data/routine.js';
import { renderSceneTasks } from './routine/sceneTasks.js';
import { renderStepByStep } from './routine/stepByStep.js';
import { renderSequence } from './routine/dayTrack.js';
import { renderPack } from './routine/packBag.js';
import { renderChoice } from './routine/helpNoa.js';

const { moduleId, parts, activities, companion, messages } = routineData;

const RENDER_BY_TYPE = Object.freeze({
  sceneTasks: renderSceneTasks,
  stepByStep: renderStepByStep,
  sequence: renderSequence,
  pack: renderPack,
  choice: renderChoice,
});

const journey = createJourney({ moduleId, parts, activities, texts: messages.journey, mapArt: companion.poses.happy });

function renderActivity(activity, index, { navigation, complete }) {
  return journey.wrapActivity(activity, complete, (onComplete) => RENDER_BY_TYPE[activity.type](activity, navigation, onComplete));
}

export function render(view, module) {
  return startModuleFlow({
    view,
    module,
    parts,
    activities,
    texts: messages,
    renderActivity,
    renderPartsOverview: journey.createMap,
    renderCompletionExtra: journey.createMap,
  });
}
