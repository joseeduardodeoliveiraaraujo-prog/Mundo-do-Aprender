/**
 * Módulo "Minha Rotina".
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Conteúdo e textos: ../data/routine.js. Este arquivo só contém a lógica
 * dos três tipos de atividade:
 *
 *   sequence  ordenar cartões (arrastar e soltar ou setas) e conferir
 *   pack      escolher vários objetos para a mochila e conferir
 *   choice    escolher uma opção (feedback imediato)
 *
 * Todas têm Desfazer e Recomeçar. Mudar algo depois de conferir apaga a
 * mensagem anterior, para o feedback sempre corresponder ao que está na tela.
 */

import { el } from '../components/dom.js';
import { createActivityFrame, showResult } from '../components/activityFrame.js';
import { createActivityControls } from '../components/activityControls.js';
import { createSortableList } from '../components/sortableList.js';
import { createChoiceButton, createChoiceGroup, setSelectedChoice } from '../components/choiceButton.js';
import { startModuleFlow } from '../components/moduleFlow.js';
import { createHistory } from '../undoHistory.js';
import { routineData } from '../data/routine.js';

const { cards, objects, parts, activities, messages } = routineData;

// ---------- Avaliação (sem "errado": sempre pista + convite) ----------

/** Primeira regra da sequência que ainda não foi cumprida, ou null. */
function findBrokenRule(order, rules) {
  return rules.find((rule) => {
    const position = order.indexOf(rule.card);
    if (rule.type === 'first') return position !== 0;
    if (rule.type === 'last') return position !== order.length - 1;
    if (rule.type === 'before') return position > order.indexOf(rule.other);
    return false;
  }) ?? null;
}

function evaluateSequence(activity, order) {
  const broken = findBrokenRule(order, activity.rules);
  if (broken) {
    return { completes: false, tone: 'encourage', title: messages.sequence.retryTitle, message: `${broken.hint} ${messages.sequence.retryEnd}` };
  }
  return {
    completes: true,
    tone: 'success',
    title: activity.rules.length > 0 ? messages.sequence.successTitle : messages.sequence.freeTitle,
    message: activity.success,
  };
}

function evaluatePack(activity, selectedIds) {
  if (selectedIds.length === 0) {
    return { completes: false, tone: 'encourage', title: messages.pack.retryTitle, message: messages.pack.emptyMessage };
  }
  const missing = activity.items.find((item) => item.need === 'essential' && !selectedIds.includes(item.id));
  const extra = activity.items.find((item) => item.need === 'notNeeded' && selectedIds.includes(item.id));
  if (!missing && !extra) {
    return { completes: true, tone: 'success', title: messages.pack.successTitle, message: activity.success };
  }
  const hints = [missing?.hint, extra?.hint].filter(Boolean).join(' ');
  return { completes: false, tone: 'encourage', title: messages.pack.retryTitle, message: `${hints} ${messages.pack.retryEnd}` };
}

function evaluateChoice(option) {
  return {
    completes: option.fit !== 'unlikely',
    tone: option.fit === 'unlikely' ? 'encourage' : 'success',
    title: messages.choice[option.fit],
    message: option.message,
  };
}

// ---------- Montagem de cada tipo ----------

function setupSequence(activity, frame, complete) {
  const clearFeedback = () => frame.feedbackSlot.replaceChildren();
  const history = createHistory([...activity.cards]);

  const list = createSortableList({
    items: activity.cards.map((id) => ({ id, ...cards[id] })),
    label: `Cartões de ${activity.title}`,
    onReorder: (order) => {
      history.push(order);
      controls.setUndoEnabled(true);
      clearFeedback();
    },
  });

  const controls = createActivityControls({
    checkLabel: messages.sequence.check,
    onCheck: () => showResult(frame, evaluateSequence(activity, list.getOrder()), complete),
    onUndo: () => {
      list.setOrder(history.undo());
      controls.setUndoEnabled(history.canUndo);
      clearFeedback();
    },
    onRestart: () => {
      list.setOrder(history.reset());
      controls.setUndoEnabled(false);
      clearFeedback();
    },
  });

  frame.choicesSlot.append(list.element, controls.element);
}

function setupPack(activity, frame, complete) {
  const clearFeedback = () => frame.feedbackSlot.replaceChildren();
  const history = createHistory([]);
  const buttons = new Map();
  const bagText = el('p', { className: 'routine-bag__text', attrs: { 'aria-live': 'polite' } });

  const showSelection = (selectedIds) => {
    buttons.forEach((button, id) => button.setAttribute('aria-pressed', String(selectedIds.includes(id))));
    bagText.textContent = selectedIds.length > 0
      ? `${messages.pack.bag} (${selectedIds.length}): ${selectedIds.map((id) => objects[id].label).join(', ')}.`
      : messages.pack.empty;
  };

  const change = (selectedIds) => {
    showSelection(selectedIds);
    controls.setUndoEnabled(history.canUndo);
    clearFeedback();
  };

  activity.items.forEach(({ id }) => {
    buttons.set(id, createChoiceButton({
      ...objects[id],
      onSelect: () => {
        const current = history.current;
        history.push(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
        change(history.current);
      },
    }));
  });

  const controls = createActivityControls({
    checkLabel: messages.pack.check,
    onCheck: () => showResult(frame, evaluatePack(activity, history.current), complete),
    onUndo: () => change(history.undo()),
    onRestart: () => change(history.reset()),
  });

  frame.choicesSlot.append(
    el('div', { className: 'routine-pack' }, [createChoiceGroup({ label: messages.objectsLabel, choices: [...buttons.values()] })]),
    el('div', { className: 'routine-bag' }, [
      el('img', { className: 'routine-bag__image', attrs: { src: cards.backpack.image, alt: '', width: 56, height: 56 } }),
      bagText,
    ]),
    controls.element,
  );
  showSelection([]);
}

function setupChoice(activity, frame, complete) {
  const history = createHistory(null);
  let group;

  const select = (optionId) => {
    const index = activity.options.findIndex((option) => option.id === optionId);
    setSelectedChoice(group, buttons[index] ?? null);
    if (index < 0) frame.feedbackSlot.replaceChildren();
    else showResult(frame, evaluateChoice(activity.options[index]), complete);
    controls.setUndoEnabled(history.canUndo);
  };

  const buttons = activity.options.map((option) => createChoiceButton({
    label: option.label,
    image: option.image,
    onSelect: () => {
      history.push(option.id);
      select(option.id);
    },
  }));
  group = createChoiceGroup({ label: messages.choicesLabel, choices: buttons });

  const controls = createActivityControls({
    onUndo: () => select(history.undo()),
    onRestart: () => select(history.reset()),
  });

  frame.choicesSlot.append(group, controls.element);
}

const SETUP_BY_TYPE = Object.freeze({ sequence: setupSequence, pack: setupPack, choice: setupChoice });

function renderActivity(activity, index, { navigation, complete }) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  SETUP_BY_TYPE[activity.type](activity, frame, complete);
  return { element: frame.element, focusTarget: frame.heading };
}

export function render(view, module) {
  return startModuleFlow({ view, module, parts, activities, texts: messages, renderActivity });
}
