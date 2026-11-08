/**
 * Atividade "sequence": a criança arrasta cada cartão até um número da trilha.
 *
 * Não há botão "Conferir": quando o último cartão entra, Noa responde sozinha.
 * As regras são poucas (first, last, before), porque cada pessoa organiza o dia
 * do seu jeito. Se uma regra não foi cumprida, Noa dá uma pista e destaca o
 * cartão; os cartões trocam de lugar ao soltar um sobre o outro.
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createHistory } from '../../undoHistory.js';
import { routineData } from '../../data/routine.js';
import { createCompanion, occupantOf } from './companion.js';

const { cards, messages } = routineData;
const texts = messages.sequence;
const slotId = (index) => `step-${index + 1}`;

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

export function renderSequence(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const total = activity.cards.length;
  const history = createHistory(Object.fromEntries(activity.cards.map((id) => [id, null])));
  const counter = el('p', { className: 'day-track__count' });

  const board = createPlacementBoard({
    pieces: activity.cards.map((id) => ({ id, ...cards[id] })),
    targets: activity.cards.map((_, index) => ({ id: slotId(index), label: `${texts.stepName} ${index + 1}` })),
    texts: texts.board,
    onPlace: (placement) => {
      history.push(placement);
      refresh(placement, true);
    },
  });
  const companion = createCompanion({ status: board.status, mood: activity.mood });

  const track = el('ol', { className: 'day-track', attrs: { role: 'list' }, dataset: { count: String(total) } },
    activity.cards.map((_, index) => el('li', { className: 'day-track__stop' }, [
      el('span', { className: 'day-track__number', attrs: { 'aria-hidden': 'true' }, text: String(index + 1) }),
      board.slots.get(slotId(index)),
    ])));

  /** @param {boolean} acted  true quando a mudança veio de um movimento de cartão */
  function refresh(placement, acted = false) {
    const order = activity.cards.map((_, index) => occupantOf(placement, slotId(index)));
    const filled = order.filter(Boolean).length;
    counter.textContent = fillTemplate(texts.placedCount, { done: filled, total });
    controls.setUndoEnabled(history.canUndo);
    board.slots.forEach((slot) => slot.classList.remove('is-hinted'));
    const tell = acted ? companion.say : companion.show;

    if (filled < total) {
      frame.feedbackSlot.replaceChildren();
      if (acted) companion.setMood('neutral');
      else companion.show(activity.greeting, activity.mood);
      return;
    }
    const broken = findBrokenRule(order, activity.rules);
    if (broken) {
      frame.feedbackSlot.replaceChildren();
      board.slots.get(slotId(order.indexOf(broken.card))).classList.add('is-hinted');
      tell(`${broken.hint} ${texts.retryEnd}`, 'thinking');
      return;
    }
    const title = activity.rules.length > 0 ? texts.successTitle : texts.freeTitle;
    showResult(frame, { completes: true, tone: 'success', title, message: activity.success }, complete);
    tell(title, 'happy');
  }

  const resetTo = (placement) => {
    board.setPlacement(placement);
    refresh(placement);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
  });

  frame.choicesSlot.append(
    companion.element,
    el('div', { className: 'mission' }, [board.tray, counter, track]),
    controls.element,
  );
  refresh(history.current);
  return frame;
}
