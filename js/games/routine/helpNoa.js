/**
 * Atividade "choice": Noa tem um problema e a criança arrasta até Noa um cartão
 * com o que pode ajudar. Não há uma única resposta certa:
 *   likely / possible  o cartão fica com Noa, que responde e fica contente;
 *   unlikely           o cartão volta, e Noa explica com calma.
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { createHistory } from '../../undoHistory.js';
import { routineData } from '../../data/routine.js';
import { createCompanion, occupantOf } from './companion.js';

const texts = routineData.messages.choice;
const NOA_SLOT = 'noa';

export function renderChoice(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const optionById = new Map(activity.options.map((option) => [option.id, option]));
  const history = createHistory(Object.fromEntries(activity.options.map(({ id }) => [id, null])));

  const board = createPlacementBoard({
    pieces: activity.options.map(({ id, label, image }) => ({ id, label, image })),
    targets: [{ id: NOA_SLOT, label: texts.forNoa }],
    texts: texts.board,
    accepts: (optionId) => optionById.get(optionId).fit !== 'unlikely',
    onReject: (optionId) => companion.say(optionById.get(optionId).message, 'thinking'),
    onPlace: (placement) => {
      history.push(placement);
      const given = refresh(placement);
      if (given) companion.say(given.message, 'happy');
      else companion.show(activity.greeting, activity.mood);
    },
  });
  const companion = createCompanion({ status: board.status, mood: activity.mood, slot: board.slots.get(NOA_SLOT) });

  /** @returns o cartão que está com Noa, ou undefined */
  function refresh(placement) {
    const given = optionById.get(occupantOf(placement, NOA_SLOT));
    controls.setUndoEnabled(history.canUndo);
    if (given) showResult(frame, { completes: true, tone: 'success', title: texts[given.fit], message: given.message }, complete);
    else frame.feedbackSlot.replaceChildren();
    return given;
  }

  const resetTo = (placement) => {
    board.setPlacement(placement);
    const given = refresh(placement);
    if (given) companion.show(given.message, 'happy');
    else companion.show(activity.greeting, activity.mood);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
  });

  frame.choicesSlot.append(
    el('div', { className: 'mission' }, [companion.element, board.tray]),
    controls.element,
  );
  refresh(history.current);
  companion.show(activity.greeting, activity.mood);
  return frame;
}
