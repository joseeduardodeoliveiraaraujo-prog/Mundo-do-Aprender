/**
 * Desafio do detetive — aparece depois que todas as pistas foram encontradas.
 * Não é uma pergunta solta: a criança interpreta a cena em dois passos.
 *
 *   Passo 1: escolhe um rosto e o coloca no balão de pensamento do personagem
 *            (o balão mostra o rosto escolhido ao lado do personagem ampliado).
 *            Mais de uma emoção pode combinar; "unlikely" convida a lembrar das pistas.
 *   Passo 2: mostra qual pista ajudou a pensar assim. Qualquer pista encontrada
 *            é aceita — o objetivo é ligar a emoção ao que se observou.
 *
 * A atividade só conta como feita no fim do passo 2.
 */

import { el } from '../../components/dom.js';
import { showResult } from '../../components/activityFrame.js';
import { createChoiceButton, createChoiceGroup, setSelectedChoice } from '../../components/choiceButton.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { emotionsData } from '../../data/emotions.js';
import { createClueZoom } from './clueZoom.js';

const { emotions, messages } = emotionsData;
const texts = messages.investigate;

/**
 * @param {Object} options
 * @param {Object} options.activity
 * @param {{ feedbackSlot: HTMLElement }} options.frame
 * @param {() => void} options.complete
 * @param {number} options.ratio  altura / largura da cena
 * @returns {HTMLElement}  a seção do desafio (começa escondida)
 */
export function createDetectiveChallenge({ activity, frame, complete, ratio }) {
  const { name, clue: characterClue } = activity.character;
  const characterArea = activity.clues[characterClue].focus ?? activity.clues[characterClue].area;

  const bubble = el('div', { className: 'detective-bubble', attrs: { role: 'img' } });
  const showBubble = (emotionId) => {
    if (emotionId) {
      const emotion = emotions[emotionId];
      bubble.classList.add('is-filled');
      bubble.replaceChildren(
        el('img', { className: 'detective-bubble__face', attrs: { src: emotion.face, alt: '', width: 72, height: 72 } }),
        el('span', { className: 'detective-bubble__name', text: emotion.name }),
      );
      bubble.setAttribute('aria-label', fillTemplate(texts.bubbleFull, { name, emotion: emotion.name }));
    } else {
      bubble.classList.remove('is-filled');
      bubble.replaceChildren(el('span', { className: 'detective-bubble__empty', text: '?' }));
      bubble.setAttribute('aria-label', fillTemplate(texts.bubbleEmpty, { name }));
    }
  };

  // ---------- Passo 2: qual pista ajudou ----------
  let clueGroup;
  const clueButtons = activity.clues.map((clue) => createChoiceButton({
    label: clue.label,
    onSelect: (button) => {
      setSelectedChoice(clueGroup, button);
      showResult(frame, {
        completes: true,
        tone: 'success',
        title: texts.whyTitle,
        message: `${fillTemplate(texts.whyMessage, { clue: clue.label, name })} ${messages.notes.feelings}`,
      }, complete);
    },
  }));
  clueGroup = createChoiceGroup({ label: texts.clueChoices, choices: clueButtons });
  const whyStep = el('div', { className: 'detective-challenge__step', attrs: { hidden: true } }, [
    el('p', { className: 'detective-challenge__step-title', text: texts.challengeWhy }),
    clueGroup,
  ]);

  // ---------- Passo 1: rosto no balão ----------
  let faceGroup;
  const faceButtons = activity.options.map((option) => createChoiceButton({
    label: emotions[option.emotion].name,
    image: emotions[option.emotion].face,
    onSelect: (button) => {
      setSelectedChoice(faceGroup, button);
      setSelectedChoice(clueGroup, null);
      showBubble(option.emotion);
      const fits = option.fit !== 'unlikely';
      whyStep.hidden = !fits;
      showResult(frame, fits
        ? { completes: false, tone: 'success', title: messages.situation[option.fit], message: `${option.message} ${texts.feelNext}` }
        : { completes: false, tone: 'encourage', title: messages.situation.unlikely, message: option.message }, complete);
    },
  }));
  faceGroup = createChoiceGroup({ label: texts.faceChoices, choices: faceButtons });

  showBubble(null);
  return el('section', { className: 'detective-challenge', attrs: { hidden: true, 'aria-label': texts.challengeTitle } }, [
    el('h3', { className: 'detective-challenge__title', text: texts.challengeTitle }),
    el('div', { className: 'detective-challenge__thought' }, [
      createClueZoom({ src: activity.image.src, area: characterArea, ratio, className: 'clue-zoom--character' }),
      bubble,
    ]),
    el('div', { className: 'detective-challenge__step' }, [
      el('p', { className: 'detective-challenge__step-title', text: fillTemplate(texts.challengeFeel, { name }) }),
      faceGroup,
    ]),
    whyStep,
  ]);
}
