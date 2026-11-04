/**
 * Módulo "Mundo das Emoções".
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Conteúdo e textos: ../data/emotions.js. Este arquivo só contém a lógica
 * de cada tipo de atividade.
 *
 * - O progresso é salvo ao dar uma resposta válida.
 * - "Anterior" e "Próxima" ficam sempre disponíveis: a criança decide o ritmo.
 */

import { el } from '../components/dom.js';
import { createActivityFrame, showResult } from '../components/activityFrame.js';
import { createChoiceButton, createChoiceGroup, setSelectedChoice } from '../components/choiceButton.js';
import { startModuleFlow, fillTemplate } from '../components/moduleFlow.js';
import { emotionsData } from '../data/emotions.js';

const { emotions, expressions, parts, activities, messages } = emotionsData;

/**
 * Para cada tipo de atividade: como montar as alternativas e como
 * responder a cada escolha. `completes` indica resposta válida.
 */
const ACTIVITY_TYPES = Object.freeze({
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
  situation: {
    choices: (activity) => activity.options.map(({ emotion }) => ({
      id: emotion, label: emotions[emotion].name, image: emotions[emotion].face,
    })),
    evaluate: (activity, choiceId) => {
      const option = activity.options.find(({ emotion }) => emotion === choiceId);
      if (option.fit === 'unlikely') {
        return { completes: false, tone: 'encourage', title: messages.situation.unlikely, message: option.message };
      }
      return {
        completes: true,
        tone: 'success',
        title: messages.situation[option.fit],
        message: `${option.message} ${messages.notes.feelings}`,
      };
    },
  },
  express: {
    choices: (activity) => activity.options.map((id) => ({
      id, label: expressions[id].label, icon: expressions[id].icon,
    })),
    evaluate: (_, choiceId) => ({
      completes: true,
      tone: 'success',
      title: messages.express.success,
      message: `${expressions[choiceId].feedback} ${messages.notes.expression}`,
    }),
  },
});

function createEmotionsList() {
  return el('ul', { className: 'emotions-faces', attrs: { role: 'list' } },
    Object.values(emotions).map((emotion) => el('li', { className: 'emotions-face' }, [
      el('img', { attrs: { src: emotion.face, alt: '', width: 72, height: 72 } }),
      el('span', { text: emotion.name }),
    ])));
}

function renderActivity(activity, index, { navigation, complete }) {
  const type = ACTIVITY_TYPES[activity.type];
  const frame = createActivityFrame({
    ...navigation,
    title: activity.title,
    instruction: activity.instruction,
    media: el('img', {
      className: 'activity__image',
      attrs: { src: activity.image.src, alt: activity.image.alt, width: 240, height: 200 },
    }),
  });

  let group;
  const choices = type.choices(activity).map((choice) => createChoiceButton({
    ...choice,
    onSelect: (button) => {
      setSelectedChoice(group, button);
      showResult(frame, type.evaluate(activity, choice.id), complete);
    },
  }));
  group = createChoiceGroup({ label: messages.choicesLabel, choices });
  frame.choicesSlot.append(group);

  return { element: frame.element, focusTarget: frame.heading };
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
