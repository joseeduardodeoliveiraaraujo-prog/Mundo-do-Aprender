/**
 * Atividade "pack": a criança arrasta objetos da mesa até os bolsos da mochila.
 *
 * - Objeto que pode ficar em casa volta para a mesa, e Noa explica por quê.
 * - Quando tudo o que é essencial entra, a mochila fica pronta (sem "Conferir").
 * - Objetos opcionais podem entrar ou não; há um bolso para cada um.
 */

import { el } from '../../components/dom.js';
import { createButton } from '../../components/button.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createHistory } from '../../undoHistory.js';
import { routineData } from '../../data/routine.js';
import { createCompanion } from './companion.js';

const { cards, objects, messages } = routineData;
const texts = messages.pack;

export function renderPack(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const itemById = new Map(activity.items.map((item) => [item.id, item]));
  const history = createHistory(Object.fromEntries(activity.items.map(({ id }) => [id, null])));
  const pockets = activity.items.filter(({ need }) => need !== 'notNeeded').map((_, index) => ({
    id: `pocket-${index + 1}`, label: `${texts.pocket} ${index + 1}`,
  }));
  const counter = el('p', { className: 'routine-bag__count' });

  const board = createPlacementBoard({
    pieces: activity.items.map(({ id }) => ({ id, ...objects[id] })),
    targets: pockets,
    texts: texts.board,
    accepts: (pieceId) => itemById.get(pieceId).need !== 'notNeeded',
    onReject: (pieceId) => companion.say(itemById.get(pieceId).hint, 'thinking'),
    onPlace: (placement) => {
      history.push(placement);
      companion.setMood('neutral');
      refresh(placement);
      if (!missingFrom(placement)) companion.say(texts.successTitle, 'happy');
    },
  });
  const companion = createCompanion({ status: board.status });

  const missingFrom = (placement) => activity.items.find(({ id, need }) => need === 'essential' && !placement[id]);

  function refresh(placement) {
    counter.textContent = fillTemplate(texts.bagCount, { count: Object.values(placement).filter(Boolean).length });
    board.slots.forEach((slot) => slot.classList.remove('is-hinted'));
    controls.setUndoEnabled(history.canUndo);
    if (missingFrom(placement)) {
      frame.feedbackSlot.replaceChildren();
    } else {
      showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.success }, complete);
      companion.setMood('happy');
    }
  }

  const hintButton = createButton({
    label: messages.hintButton,
    variant: 'secondary',
    icon: 'help',
    className: 'mission__hint',
    onClick: () => {
      const placement = history.current;
      const missing = missingFrom(placement);
      companion.say(missing ? missing.hint : texts.hintDone, missing ? 'thinking' : 'happy');
    },
  });

  const resetTo = (placement) => {
    board.setPlacement(placement);
    refresh(placement);
    companion.show(activity.greeting);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
  });

  board.tray.prepend(el('p', { className: 'placement-tray__title', attrs: { 'aria-hidden': 'true' }, text: texts.table }));

  frame.choicesSlot.append(
    companion.element,
    el('div', { className: 'mission' }, [
      el('div', { className: 'mission__toolbar' }, [hintButton]),
      board.tray,
      el('section', { className: 'routine-bag', attrs: { 'aria-label': texts.bag } }, [
        el('div', { className: 'routine-bag__header' }, [
          el('img', { className: 'routine-bag__image', attrs: { src: cards.backpack.image, alt: '', width: 56, height: 56 } }),
          counter,
        ]),
        el('div', { className: 'routine-bag__pockets' }, pockets.map(({ id }) => board.slots.get(id))),
      ]),
    ]),
    controls.element,
  );
  refresh(history.current);
  companion.show(activity.greeting);
  return frame;
}
