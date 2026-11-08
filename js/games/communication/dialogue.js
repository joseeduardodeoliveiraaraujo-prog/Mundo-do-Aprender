/**
 * Atividade "dialogue": uma conversa em turnos. A pessoa fala, a criança toca em
 * um cartão para Noa responder e a resposta da pessoa depende do cartão.
 *
 * Cada troca entra na conversa, que cresce na tela. Só o cartão que não combina
 * fica de fora: Noa explica com calma e a conversa continua de onde estava.
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createChoiceButton, createChoiceGroup } from '../../components/choiceButton.js';
import { createHistory } from '../../undoHistory.js';
import { speak } from '../../speech.js';
import { communicationData } from '../../data/communication.js';
import { createNoa, createTalkScene } from './talkKit.js';

const { people, cards, messages } = communicationData;
const texts = messages.dialogue;

export function renderDialogue(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const { turns } = activity;
  const listener = people[activity.listener];
  const history = createHistory(0); // quantos turnos já foram respondidos
  const exchanges = []; // balões acrescentados em cada turno (para Desfazer)
  const noa = createNoa({ mood: activity.mood });
  const scene = createTalkScene(activity, { banner: true });
  const options = el('div', { className: 'talk-options' });

  const bubble = (person, pose, text, image) => el('div', { className: `talk-bubble talk-bubble--${person === people.noa ? 'noa' : 'other'}` }, [
    el('img', { className: 'talk-bubble__person', attrs: { src: person.poses[pose], alt: '', width: 120, height: 140 } }),
    el('div', { className: 'talk-bubble__body' }, [
      el('p', { className: 'talk-bubble__name', text: person.name }),
      image && el('img', { className: 'talk-bubble__card', attrs: { src: image, alt: '', width: 80, height: 80 } }),
      el('p', { text }),
    ]),
  ]);
  const log = el('div', { className: 'talk-log', attrs: { role: 'log', 'aria-live': 'polite', 'aria-label': texts.logLabel } }, [
    bubble(listener, 'neutral', turns[0].say),
  ]);

  function drawOptions() {
    const turn = turns[history.current];
    if (!turn) {
      options.replaceChildren();
      return;
    }
    options.replaceChildren(createChoiceGroup({
      label: texts.options,
      choices: turn.options.map((option) => createChoiceButton({
        label: cards[option.card].label,
        image: cards[option.card].image,
        onSelect: () => choose(option),
      })),
    }));
  }

  function refresh() {
    const finished = history.current === turns.length;
    drawOptions();
    scene.setDone(finished);
    controls.setUndoEnabled(history.canUndo);
    if (finished) {
      noa.show(activity.success, 'happy');
      showResult(frame, { completes: true, tone: 'success', title: texts.doneTitle }, complete);
    } else {
      frame.feedbackSlot.replaceChildren();
    }
    return finished;
  }

  function choose(option) {
    if (option.fit === 'unlikely') {
      noa.say(option.message, 'thinking');
      return;
    }
    const nextTurn = turns[history.current + 1];
    const card = cards[option.card];
    const added = [bubble(people.noa, 'happy', card.label, card.image), bubble(listener, 'happy', option.reply)];
    if (nextTurn) added.push(bubble(listener, 'neutral', nextTurn.say));
    log.append(...added);
    exchanges.push(added);
    history.push(history.current + 1);

    const finished = refresh();
    if (!finished) noa.show(texts.keepGoing, 'happy');
    speak(`${card.label}. ${option.reply} ${nextTurn?.say ?? activity.success}`);
    // O botão tocado saiu da tela: leva o foco para a próxima escolha.
    (options.querySelector('button') ?? frame.element.querySelector('.activity__next')).focus({ preventScroll: true });
    (finished ? frame.feedbackSlot : options).scrollIntoView({ block: 'nearest' });
  }

  function undoTurns(state) {
    while (exchanges.length > state) exchanges.pop().forEach((node) => node.remove());
    if (!refresh()) noa.show(activity.greeting, activity.mood);
  }
  const controls = createActivityControls({
    onUndo: () => undoTurns(history.undo()),
    onRestart: () => undoTurns(history.reset()),
  });

  frame.choicesSlot.append(
    el('div', { className: 'mission' }, [scene.element, log, noa.element, options]),
    controls.element,
  );
  refresh();
  noa.show(activity.greeting, activity.mood);
  return frame;
}
