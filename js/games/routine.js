/**
 * Módulo "Minha Rotina": um dia inteiro ao lado de Noa, em seis momentos.
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Conteúdo e textos: ../data/routine.js. Cada mecânica fica em ./routine/:
 *
 *   sceneTasks  tocar nos elementos da cena         sceneTasks.js
 *   stepByStep  arrastar passos que têm ordem fixa  stepByStep.js
 *   sequence    arrastar cartões até os números     dayTrack.js
 *   pack        arrastar objetos até a mochila      packBag.js
 *   choice      arrastar até Noa o que pode ajudar  helpNoa.js
 *
 * Este arquivo só escolhe a mecânica e liga cada atividade à trilha do dia
 * e às recompensas (./routine/dayJourney.js).
 */

import { el } from '../components/dom.js';
import { startModuleFlow } from '../components/moduleFlow.js';
import { routineData } from '../data/routine.js';
import { renderSceneTasks } from './routine/sceneTasks.js';
import { renderStepByStep } from './routine/stepByStep.js';
import { renderSequence } from './routine/dayTrack.js';
import { renderPack } from './routine/packBag.js';
import { renderChoice } from './routine/helpNoa.js';
import { createDayTrail, createDayMap, completeWithReward, createReward } from './routine/dayJourney.js';

const { parts, activities, messages } = routineData;

const RENDER_BY_TYPE = Object.freeze({
  sceneTasks: renderSceneTasks,
  stepByStep: renderStepByStep,
  sequence: renderSequence,
  pack: renderPack,
  choice: renderChoice,
});

function renderActivity(activity, index, { navigation, complete }) {
  const trail = createDayTrail(activity.part);
  const frame = RENDER_BY_TYPE[activity.type](activity, navigation, () => {
    const reward = completeWithReward(activity, complete);
    if (!reward) return;
    trail.refresh();
    frame.feedbackSlot.append(createReward(reward));
  });
  return { element: el('div', { className: 'routine-game' }, [trail.element, frame.element]), focusTarget: frame.heading };
}

export function render(view, module) {
  return startModuleFlow({
    view,
    module,
    parts,
    activities,
    texts: messages,
    renderActivity,
    renderPartsOverview: createDayMap,
    renderCompletionExtra: createDayMap,
  });
}
