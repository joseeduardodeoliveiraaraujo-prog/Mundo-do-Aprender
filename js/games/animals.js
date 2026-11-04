/**
 * Módulo "Explorando os Animais".
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Conteúdo e textos: ../data/animals.js. Este arquivo só contém a lógica
 * dos quatro tipos de atividade:
 *
 *   identify  ver a ilustração e escolher o nome
 *   sound     ouvir (opcional) ou ler o som e escolher o animal
 *   habitat   escolher onde cada animal vive e conferir (Desfazer/Recomeçar)
 *   learn     ler curiosidades e responder a uma pergunta
 *
 * Sons nunca tocam sozinhos; todas as atividades funcionam sem áudio.
 */

import { el } from '../components/dom.js';
import { createIcon } from '../components/icons.js';
import { createActivityFrame, showResult } from '../components/activityFrame.js';
import { createActivityControls } from '../components/activityControls.js';
import { createChoiceButton, createChoiceGroup, setSelectedChoice } from '../components/choiceButton.js';
import { createSoundPlayer } from '../components/soundPlayer.js';
import { startModuleFlow, fillTemplate } from '../components/moduleFlow.js';
import { createHistory } from '../undoHistory.js';
import { animalsData } from '../data/animals.js';

const { animals, articles, habitats, parts, activities, messages } = animalsData;

const nameWithArticle = (id) => ({ article: articles[id], animal: animals[id].name.toLowerCase() });

function createAnimalImage(id, alt, className = 'activity__image') {
  return el('img', { className, attrs: { src: animals[id].image, alt, width: 200, height: 200 } });
}

/** Atividades de uma única resposta (identify, sound, learn). */
function setupSingleChoice(frame, complete, { choices, answer, success, retry }) {
  let group;
  const buttons = choices.map((choice) => createChoiceButton({
    label: choice.label,
    image: choice.image,
    onSelect: (button) => {
      setSelectedChoice(group, button);
      showResult(frame, choice.id === answer
        ? { completes: true, tone: 'success', ...success }
        : { completes: false, tone: 'encourage', ...retry }, complete);
    },
  }));
  group = createChoiceGroup({ label: messages.choicesLabel, choices: buttons });
  frame.choicesSlot.append(group);
}

const animalChoices = (ids, withImages) => ids.map((id) => ({
  id, label: animals[id].name, image: withImages ? animals[id].image : undefined,
}));

const successForAnimal = (id) => ({
  title: fillTemplate(messages.answer.success, nameWithArticle(id)),
  message: animals[id].fact,
});

// ---------- Tipos de atividade ----------

function renderIdentify(activity, navigation, complete) {
  const frame = createActivityFrame({
    ...navigation, title: activity.title, instruction: activity.instruction,
    media: createAnimalImage(activity.animal, activity.imageAlt),
  });
  // Só os nomes (sem imagens), para a criança associar a ilustração ao nome.
  setupSingleChoice(frame, complete, {
    choices: animalChoices(activity.options, false),
    answer: activity.animal,
    success: successForAnimal(activity.animal),
    retry: { title: messages.answer.retry, message: activity.hint },
  });
  return frame;
}

function renderSound(activity, navigation, complete) {
  const frame = createActivityFrame({
    ...navigation, title: activity.title, instruction: activity.instruction,
    media: createSoundPlayer({ sound: animals[activity.animal].sound }),
  });
  setupSingleChoice(frame, complete, {
    choices: animalChoices(activity.options, true),
    answer: activity.animal,
    success: successForAnimal(activity.animal),
    retry: { title: messages.answer.soundRetry, message: activity.hint },
  });
  return frame;
}

function renderLearn(activity, navigation, complete) {
  const { article, animal } = nameWithArticle(activity.animal);
  const frame = createActivityFrame({
    ...navigation, title: activity.title, instruction: activity.instruction,
    media: createAnimalImage(activity.animal, `Ilustração ${article === 'a' ? 'da' : 'do'} ${animal}.`),
  });
  frame.choicesSlot.append(el('ul', {
    className: 'animal-facts', attrs: { role: 'list', 'aria-label': messages.learn.factsLabel },
  }, activity.facts.map((fact) => el('li', { className: 'animal-fact' }, [
    fact.image
      ? el('img', { className: 'animal-fact__image', attrs: { src: fact.image, alt: '', width: 48, height: 48 } })
      : el('span', { className: 'animal-fact__icon' }, [createIcon('info')]),
    el('p', { text: fact.text }),
  ]))));
  setupSingleChoice(frame, complete, {
    choices: activity.options,
    answer: activity.answer,
    success: { title: messages.answer.learnSuccess, message: activity.explanation },
    retry: { title: messages.answer.retry, message: activity.hint },
  });
  return frame;
}

function evaluateHabitat(activity, chosen) {
  const { retryTitle, retryEnd } = messages.habitat;
  const missing = activity.animals.filter(({ id }) => !chosen[id]);
  if (missing.length > 0) {
    const names = missing.map(({ id }) => animals[id].name).join(', ');
    return { completes: false, tone: 'encourage', title: retryTitle, message: fillTemplate(messages.habitat.missing, { animals: names }) };
  }
  const mismatch = activity.animals.find(({ id, accepts }) => !accepts.includes(chosen[id]));
  if (mismatch) return { completes: false, tone: 'encourage', title: retryTitle, message: `${mismatch.hint} ${retryEnd}` };
  return { completes: true, tone: 'success', title: messages.habitat.successTitle, message: activity.success };
}

function renderHabitat(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const history = createHistory({});
  const buttonsByAnimal = new Map();

  const showChoices = (chosen) => buttonsByAnimal.forEach((buttons, animalId) => {
    buttons.forEach((button, habitatId) => button.setAttribute('aria-pressed', String(chosen[animalId] === habitatId)));
  });
  const change = (chosen) => {
    showChoices(chosen);
    controls.setUndoEnabled(history.canUndo);
    frame.feedbackSlot.replaceChildren();
  };

  const rows = activity.animals.map(({ id }) => {
    const question = fillTemplate(messages.habitat.question, nameWithArticle(id));
    const buttons = new Map(activity.habitats.map((habitatId) => [habitatId, createChoiceButton({
      label: habitats[habitatId].name,
      image: habitats[habitatId].image,
      onSelect: () => {
        history.push({ ...history.current, [id]: habitatId });
        change(history.current);
      },
    })]));
    buttonsByAnimal.set(id, buttons);
    return el('li', { className: 'habitat-row', dataset: { animal: id } }, [
      createAnimalImage(id, '', 'habitat-row__image'),
      el('p', { className: 'habitat-row__question', text: question }),
      createChoiceGroup({ label: question, choices: [...buttons.values()] }),
    ]);
  });

  const controls = createActivityControls({
    checkLabel: messages.habitat.check,
    onCheck: () => showResult(frame, evaluateHabitat(activity, history.current), complete),
    onUndo: () => change(history.undo()),
    onRestart: () => change(history.reset()),
  });

  frame.choicesSlot.append(el('ul', { className: 'habitat-rows', attrs: { role: 'list' } }, rows), controls.element);
  return frame;
}

const RENDER_BY_TYPE = Object.freeze({
  identify: renderIdentify, sound: renderSound, habitat: renderHabitat, learn: renderLearn,
});

function renderActivity(activity, index, { navigation, complete }) {
  const frame = RENDER_BY_TYPE[activity.type](activity, navigation, complete);
  return { element: frame.element, focusTarget: frame.heading };
}

function createAnimalGallery() {
  return el('ul', { className: 'animal-gallery', attrs: { role: 'list' } },
    Object.values(animals).map((animal) => el('li', { className: 'animal-gallery__item' }, [
      el('img', { attrs: { src: animal.image, alt: '', width: 72, height: 72 } }),
      el('span', { text: animal.name }),
    ])));
}

export function render(view, module) {
  return startModuleFlow({
    view, module, parts, activities, texts: messages, renderActivity, renderCompletionExtra: createAnimalGallery,
  });
}
