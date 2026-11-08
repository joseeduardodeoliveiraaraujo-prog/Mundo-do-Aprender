/**
 * Atividade "match": a criança leva cada cartão até a situação em que ele ajuda.
 *
 * O cartão levado a outra situação volta para a caixa, e Noa explica para que
 * ele serve. A atividade termina quando todos chegam (não há botão "Conferir").
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createHistory } from '../../undoHistory.js';
import { speak } from '../../speech.js';
import { communicationData } from '../../data/communication.js';
import { createNoa, pieceOf } from './talkKit.js';

const { messages } = communicationData;
const texts = messages.match;

export function renderMatch(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const itemByCard = new Map(activity.items.map((item) => [item.card, item]));
  const total = activity.items.length;
  const history = createHistory(Object.fromEntries(activity.items.map(({ card }) => [card, null])));
  const counter = el('p', { className: 'talk-match__count' });

  const board = createPlacementBoard({
    pieces: activity.items.map(({ card }) => pieceOf(card)),
    targets: activity.situations.map(({ id, label }) => ({ id, label })),
    texts: messages.board,
    accepts: (card, situation) => itemByCard.get(card).situation === situation,
    onReject: (card) => noa.say(itemByCard.get(card).hint, 'thinking'),
    onPlace: (placement) => {
      history.push(placement);
      if (refresh(placement)) speak(activity.success);
    },
  });
  const noa = createNoa({ status: board.status });

  /** @returns true quando todos os cartões chegaram */
  function refresh(placement) {
    const done = Object.values(placement).filter(Boolean).length;
    const finished = done === total;
    counter.textContent = fillTemplate(texts.count, { done, total });
    controls.setUndoEnabled(history.canUndo);
    noa.show(finished ? activity.success : activity.greeting, finished ? 'happy' : 'neutral');
    if (finished) showResult(frame, { completes: true, tone: 'success', title: texts.successTitle }, complete);
    else frame.feedbackSlot.replaceChildren();
    return finished;
  }

  const resetTo = (placement) => {
    board.setPlacement(placement);
    refresh(placement);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
  });

  const situations = el('div', { className: 'talk-match' }, activity.situations.map(({ id, label, image }) => el('section', {
    className: 'talk-match__situation', attrs: { 'aria-label': label }, dataset: { situation: id },
  }, [
    el('img', { className: 'talk-match__image', attrs: { src: image, alt: '', width: 80, height: 80 } }),
    el('h3', { className: 'talk-match__label', text: label }),
    board.slots.get(id),
  ])));

  frame.choicesSlot.append(
    el('div', { className: 'mission' }, [noa.element, board.tray, counter, situations]),
    controls.element,
  );
  refresh(history.current);
  return frame;
}
