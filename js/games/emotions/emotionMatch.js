/**
 * Missão "Cada um com seu sentimento" (tipo matchEmotions).
 *
 * Mecânica: ARRASTAR E SOLTAR (mouse ou dedo). A criança segura um rosto, ele
 * acompanha o ponteiro, o balão embaixo fica destacado ("Solte aqui") e:
 *   - rosto que combina → encaixa no balão deslizando; o amigo diz "É isso…";
 *   - rosto que não combina → volta deslizando para a caixa; o amigo responde
 *     com gentileza ("Hum… acho que não…") e a resposta fica visível;
 *   - solto fora de um balão → volta para a caixa, com uma frase de orientação.
 * Um toque simples no rosto lembra: "Segure o rosto e arraste…".
 * Teclado/leitor de tela: Enter no rosto e Enter no balão (alternativa acessível).
 *
 * Organização da tela (de cima para baixo, sempre igual):
 *   1. Passos "① Segure um rosto → ② Arraste até o balão de um amigo" (o passo
 *      atual fica destacado) e a mensagem do último movimento.
 *   2. Caixa de rostos — presa no topo ao rolar; durante o arrasto, a página
 *      rola sozinha perto da borda para alcançar os amigos de baixo.
 *   3. "Amigos ajudados: X de 3" e um cartão por amigo: retrato, nome,
 *      o que aconteceu e o balão de pensamento saindo do retrato.
 *
 * A missão termina quando todos têm um rosto que combina. Sobrar um rosto é esperado.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { createButton } from '../../components/button.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createHistory } from '../../undoHistory.js';
import { speak } from '../../speech.js';
import { emotionsData } from '../../data/emotions.js';
import { createClueZoom } from './clueZoom.js';

const { emotions, messages } = emotionsData;
const texts = messages.missions;
const SCENE_RATIO = 160 / 240;

const faceOn = (placement, cardId) => Object.keys(placement).find((pieceId) => placement[pieceId] === cardId);
const replyOf = (card, faceId) => (card.accepts.includes(faceId) ? card.fits[faceId] : card.otherwise);

/** Faixa de passos ① → ②. O passo atual ganha destaque (número preenchido + borda). */
function createSteps() {
  const step = (number, text) => el('li', { className: 'mission-steps__step' }, [
    el('span', { className: 'mission-steps__number', attrs: { 'aria-hidden': 'true' }, text: String(number) }),
    el('span', { text }),
  ]);
  const pick = step(1, texts.stepPick);
  const place = step(2, texts.stepPlace);
  return {
    element: el('ol', { className: 'mission-steps', attrs: { role: 'list' } }, [pick, place]),
    show(hasPiece) {
      pick.classList.toggle('is-current', !hasPiece);
      place.classList.toggle('is-current', hasPiece);
      pick.toggleAttribute('aria-current', !hasPiece);
      place.toggleAttribute('aria-current', hasPiece);
    },
  };
}

export function renderMatchEmotions(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const history = createHistory(Object.fromEntries(activity.pieces.map((id) => [id, null])));
  const steps = createSteps();
  const counter = el('p', { className: 'match-cards__count' });

  // Última tentativa com um rosto que não combinava: o rosto voltou para a caixa,
  // mas a resposta do amigo continua visível até a próxima ação nele.
  const attempts = new Map();
  const cardById = new Map(activity.cards.map((card) => [card.id, card]));

  const board = createPlacementBoard({
    pieces: activity.pieces.map((id) => ({ id, label: emotions[id].name, image: emotions[id].face })),
    targets: activity.cards.map(({ id, name }) => ({ id, label: name })),
    texts: texts.matchBoard,
    tapToPlace: false, // a forma de jogar é segurar e arrastar (o teclado continua funcionando)
    accepts: (faceId, cardId) => cardById.get(cardId).accepts.includes(faceId),
    onSelect: (pieceId) => steps.show(Boolean(pieceId)),
    onPlace: (placement, { targetId }) => {
      history.push(placement);
      if (targetId) attempts.delete(targetId);
      refresh(placement);
      const card = cardById.get(targetId);
      if (card) speak(`${card.name}: ${replyOf(card, faceOn(placement, card.id))}`);
    },
    onReject: (faceId, cardId) => {
      const card = cardById.get(cardId);
      attempts.set(cardId, faceId);
      refresh(history.current);
      speak(`${card.name}: ${card.otherwise}`);
    },
  });

  const cards = activity.cards.map((card) => {
    const reply = el('p', { className: 'match-card__reply' });
    const element = el('li', { className: 'match-card', dataset: { card: card.id } }, [
      el('div', { className: 'match-card__who' }, [
        createClueZoom({ src: card.image, area: card.portrait, ratio: SCENE_RATIO, className: 'match-card__portrait' }),
        el('div', { className: 'match-card__about' }, [
          el('h3', { className: 'match-card__name', text: card.name }),
          el('p', { className: 'match-card__situation', text: card.situation }),
        ]),
      ]),
      el('div', { className: 'match-card__bubble' }, [board.slots.get(card.id)]),
      reply,
    ]);
    return { card, element, reply };
  });

  function refresh(placement) {
    let done = 0;
    cards.forEach(({ card, element, reply }) => {
      const faceId = faceOn(placement, card.id); // só fica no balão um rosto que combina
      const tried = faceId ? null : attempts.get(card.id);
      if (faceId) done += 1;
      element.classList.toggle('is-matched', Boolean(faceId));
      element.classList.toggle('is-unsure', Boolean(tried));
      element.classList.remove('is-hinted');
      reply.classList.toggle('is-answer', Boolean(faceId || tried));
      reply.replaceChildren(...(faceId || tried
        ? [createIcon(faceId ? 'star' : 'heart'), el('span', { text: `“${replyOf(card, faceId || tried)}”` })]
        : [el('span', { text: fillTemplate(texts.ask, card) })]));
    });
    counter.textContent = fillTemplate(texts.friendsCount, { done, total: cards.length });
    controls.setUndoEnabled(history.canUndo);
    if (done === cards.length) {
      showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.success }, complete);
    } else {
      frame.feedbackSlot.replaceChildren();
    }
  }

  const hintButton = createButton({
    label: texts.hintButton,
    variant: 'secondary',
    icon: 'help',
    className: 'mission__hint',
    onClick: () => {
      const placement = history.current;
      const next = cards.find(({ card }) => !card.accepts.includes(faceOn(placement, card.id)));
      cards.forEach(({ element }) => element.classList.toggle('is-hinted', element === next?.element));
      const message = next ? next.card.hint : texts.hintDone;
      showResult(frame, { completes: false, tone: 'info', title: texts.hintButton, message }, complete);
      speak(message);
    },
  });

  const controls = createActivityControls({
    onUndo: () => { attempts.clear(); board.setPlacement(history.undo()); refresh(history.current); },
    onRestart: () => { attempts.clear(); board.setPlacement(history.reset()); refresh(history.current); },
  });

  // Mensagem curta e visível logo abaixo dos passos (ex.: "Medo voltou para a caixa…").
  board.status.classList.add('match-mission__status');
  board.tray.prepend(el('p', { className: 'placement-tray__title', attrs: { 'aria-hidden': 'true' }, text: texts.faces }));

  frame.choicesSlot.append(
    el('div', { className: 'mission match-mission' }, [
      el('div', { className: 'mission__toolbar' }, [steps.element, hintButton]),
      board.status,
      board.tray,
      el('section', { className: 'match-cards', attrs: { 'aria-label': 'Amigos' } }, [
        counter,
        el('ul', { className: 'match-cards__list', attrs: { role: 'list' } }, cards.map(({ element }) => element)),
      ]),
    ]),
    controls.element,
  );
  steps.show(false);
  refresh(history.current);
  return frame;
}
