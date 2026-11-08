/**
 * Atividade "talkCard": Noa precisa de alguma coisa e a criança arrasta um
 * cartão até o balão. A pessoa da cena entende, responde e a cena muda.
 * O cartão que não combina volta para a caixa, com uma explicação calma.
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { occupantOf } from '../../components/companion.js';
import { createHistory } from '../../undoHistory.js';
import { speak } from '../../speech.js';
import { communicationData } from '../../data/communication.js';
import { createNoa, createTalkScene, heardTitle, pieceOf } from './talkKit.js';

const { messages } = communicationData;
const BALLOON = 'balloon';

export function renderTalkCard(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const optionByCard = new Map(activity.options.map((option) => [option.card, option]));
  const history = createHistory(Object.fromEntries(activity.options.map(({ card }) => [card, null])));
  const scene = createTalkScene(activity);

  const board = createPlacementBoard({
    pieces: activity.options.map(({ card }) => pieceOf(card)),
    targets: [{ id: BALLOON, label: messages.talkCard.balloon }],
    texts: messages.board,
    accepts: (card) => optionByCard.get(card).fit !== 'unlikely',
    onReject: (card) => noa.say(optionByCard.get(card).message, 'thinking'),
    onPlace: (placement) => {
      history.push(placement);
      const given = refresh(placement);
      if (given) speak(`${given.reply} ${activity.success}`);
    },
  });
  const balloon = board.slots.get(BALLOON);
  balloon.append(el('p', { className: 'talk-balloon__caption', attrs: { 'aria-hidden': 'true' }, text: messages.talkCard.balloon }));
  const noa = createNoa({ status: board.status, mood: activity.mood, slot: balloon });

  /** Atualiza cena, Noa e retorno. @returns a opção que está no balão, ou undefined */
  function refresh(placement) {
    const given = optionByCard.get(occupantOf(placement, BALLOON));
    controls.setUndoEnabled(history.canUndo);
    scene.setDone(Boolean(given));
    if (given) {
      noa.show(activity.success, 'happy');
      showResult(frame, { completes: true, tone: 'success', title: heardTitle(activity.listener), message: given.reply }, complete);
    } else {
      noa.show(activity.greeting, activity.mood);
      frame.feedbackSlot.replaceChildren();
    }
    return given;
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
    el('div', { className: 'mission' }, [scene.element, noa.element, board.tray]),
    controls.element,
  );
  refresh(history.current);
  return frame;
}
