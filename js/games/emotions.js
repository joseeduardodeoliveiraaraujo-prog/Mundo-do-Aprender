/**
 * Módulo "Mundo das Emoções".
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Conteúdo e textos: ../data/emotions.js. Tipos de atividade:
 *
 *   recognize    olhar um rosto e escolher a emoção            (aqui)
 *   buildFace    montar um rosto peça por peça e conferir      (emotions/faceBuilder.js)
 *   investigate  encontrar pistas na cena e escolher a emoção  (emotions/investigation.js)
 *   express      escolher uma forma de se expressar            (aqui)
 *   matchEmotions  levar rostos ao balão de cada amigo       (emotions/emotionMatch.js)
 *   arrangeScene   arrumar uma cena levando objetos          (emotions/sceneArrange.js)
 *
 * - O progresso é salvo ao dar uma resposta válida.
 * - "Anterior" e "Próxima" ficam sempre disponíveis: a criança decide o ritmo.
 */

import { el } from '../components/dom.js';
import { createActivityFrame } from '../components/activityFrame.js';
import { startModuleFlow, fillTemplate } from '../components/moduleFlow.js';
import { emotionsData } from '../data/emotions.js';
import { createSingleChoice } from './emotions/singleChoice.js';
import { renderBuildFace } from './emotions/faceBuilder.js';
import { renderInvestigate } from './emotions/investigation.js';
import { renderMatchEmotions } from './emotions/emotionMatch.js';
import { renderArrangeScene } from './emotions/sceneArrange.js';

const { emotions, expressions, parts, activities, messages } = emotionsData;

/** Atividades de uma resposta: como montar as alternativas e responder a cada escolha. */
const SINGLE_CHOICE_TYPES = Object.freeze({
  recognize: {
    choices: (activity) => activity.options.map((id) => ({ id, label: emotions[id].name })),
    evaluate: (activity, choiceId) => (choiceId === activity.answer
      ? {
        completes: true,
        tone: 'success',
        title: fillTemplate(messages.recognize.success, { emotion: emotions[choiceId].name.toLowerCase() }),
        message: messages.notes.faces,
      }
      : { completes: false, tone: 'encourage', title: messages.recognize.retry, message: activity.hint }),
  },
  express: {
    choices: (activity) => activity.options.map((id) => ({ id, label: expressions[id].label, icon: expressions[id].icon })),
    evaluate: (_, choiceId) => ({
      completes: true,
      tone: 'success',
      title: messages.express.success,
      message: `${expressions[choiceId].feedback} ${messages.notes.expression}`,
    }),
  },
});

function renderSingleChoice(activity, navigation, complete) {
  const type = SINGLE_CHOICE_TYPES[activity.type];
  const frame = createActivityFrame({
    ...navigation,
    title: activity.title,
    instruction: activity.instruction,
    media: el('img', {
      className: 'activity__image',
      attrs: { src: activity.image.src, alt: activity.image.alt, width: 240, height: 200 },
    }),
  });
  frame.choicesSlot.append(createSingleChoice({
    frame,
    label: messages.choicesLabel,
    choices: type.choices(activity),
    evaluate: (choiceId) => type.evaluate(activity, choiceId),
    complete,
  }));
  return frame;
}

const RENDER_BY_TYPE = Object.freeze({
  recognize: renderSingleChoice,
  express: renderSingleChoice,
  buildFace: renderBuildFace,
  investigate: renderInvestigate,
  matchEmotions: renderMatchEmotions,
  arrangeScene: renderArrangeScene,
});

function renderActivity(activity, index, { navigation, complete }) {
  const frame = RENDER_BY_TYPE[activity.type](activity, navigation, complete);
  return { element: frame.element, focusTarget: frame.heading };
}

function createEmotionsList() {
  return el('ul', { className: 'emotions-faces', attrs: { role: 'list' } },
    Object.values(emotions).map((emotion) => el('li', { className: 'emotions-face' }, [
      el('img', { attrs: { src: emotion.face, alt: '', width: 72, height: 72 } }),
      el('span', { text: emotion.name }),
    ])));
}

export function render(view, module) {
  return startModuleFlow({
    view,
    module,
    parts,
    activities,
    texts: messages,
    renderActivity,
    renderCompletionExtra: createEmotionsList,
  });
}
