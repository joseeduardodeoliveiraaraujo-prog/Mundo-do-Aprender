/**
 * Atividade "sentence": a criança monta uma frase arrastando peças e, quando
 * quiser, toca em "Mostrar a frase". Noa diz a frase e a pessoa da cena responde.
 *
 * São escolhas pessoais, então nenhuma combinação é recusada. Aparece um grupo
 * de peças por vez (o do primeiro lugar vazio), para não haver muitas opções.
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { occupantOf } from '../../components/companion.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createHistory } from '../../undoHistory.js';
import { speak } from '../../speech.js';
import { communicationData } from '../../data/communication.js';
import { createNoa, createTalkScene, heardTitle, pieceOf } from './talkKit.js';

const { cards, messages } = communicationData;
const texts = messages.sentence;

export function renderSentence(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const pieceByCard = new Map(activity.pieces.map((piece) => [piece.card, piece]));
  const slots = activity.lines.flat().filter(({ slot }) => slot);
  const history = createHistory(Object.fromEntries(activity.pieces.map(({ card }) => [card, null])));
  const scene = createTalkScene(activity, { banner: true });

  const board = createPlacementBoard({
    pieces: activity.pieces.map(({ card }) => pieceOf(card)),
    targets: slots.map(({ slot, label }) => ({ id: slot, label })),
    texts: messages.board,
    accepts: (card, slot) => pieceByCard.get(card).group === slot,
    onReject: () => noa.say(activity.greeting, 'thinking'),
    onPlace: (placement) => {
      history.push(placement);
      refresh(placement);
    },
  });
  const noa = createNoa({ status: board.status, mood: activity.mood });

  const cardIn = (placement, slot) => occupantOf(placement, slot);
  const firstEmpty = (placement) => slots.find(({ slot }) => !cardIn(placement, slot))?.slot;
  const wordOf = (card) => cards[card].label.toLowerCase();

  function sentenceFrom(placement) {
    return activity.lines.map((line) => {
      const words = line.map(({ text, slot }) => text ?? wordOf(cardIn(placement, slot))).join(' ').toLowerCase();
      return `${words.charAt(0).toUpperCase()}${words.slice(1)}.`;
    }).join(' ');
  }

  /** Mostra só as peças do lugar da vez (com tudo preenchido, as do último, para poder trocar). */
  function refresh(placement) {
    const next = firstEmpty(placement);
    const group = next ?? slots.at(-1).slot;
    activity.pieces.forEach(({ card, group: pieceGroup }) => {
      board.tray.querySelector(`[data-piece="${card}"]`)?.toggleAttribute('hidden', pieceGroup !== group);
    });
    board.slots.forEach((slot, id) => slot.classList.toggle('is-next', id === next));
    controls.setUndoEnabled(history.canUndo);
    scene.setDone(false);
    frame.feedbackSlot.replaceChildren();
    noa.show(next ? activity.greeting : texts.ready, next ? activity.mood : 'neutral');
  }

  function showSentence() {
    const placement = history.current;
    if (firstEmpty(placement)) {
      noa.say(texts.missing, 'thinking');
      return;
    }
    const chosen = slots.map(({ slot }) => pieceByCard.get(cardIn(placement, slot)));
    const values = Object.fromEntries(chosen.map(({ card, group }) => [group, wordOf(card)]));
    const reply = fillTemplate(chosen.find((piece) => piece.reply)?.reply ?? activity.reply, values);
    const sentence = sentenceFrom(placement);
    scene.setDone(true);
    noa.show(sentence, 'happy');
    speak(`${sentence} ${reply}`);
    showResult(frame, { completes: true, tone: 'success', title: heardTitle(activity.listener), message: `${reply} ${activity.success}` }, complete);
  }

  const resetTo = (placement) => {
    board.setPlacement(placement);
    refresh(placement);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
    onCheck: showSentence,
    checkLabel: texts.show,
  });

  const strip = el('div', { className: 'sentence-strip' }, activity.lines.map((line) => el('div', { className: 'sentence-strip__line' }, line.map(
    ({ text, slot }) => (text ? el('p', { className: 'sentence-strip__text', text }) : board.slots.get(slot)),
  ))));

  frame.choicesSlot.append(
    el('div', { className: 'mission' }, [scene.element, noa.element, strip, board.tray]),
    controls.element,
  );
  refresh(history.current);
  return frame;
}
