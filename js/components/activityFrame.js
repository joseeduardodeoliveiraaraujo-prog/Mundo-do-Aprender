/**
 * activityFrame.js — moldura padrão de uma atividade (uma por vez).
 *
 * Estrutura sempre igual, para dar previsibilidade:
 *   parte + "Atividade X de Y"
 *   ilustração | título, instrução, botão "Repetir instrução"
 *   alternativas (choicesSlot)
 *   feedback (feedbackSlot — região role="status", anunciada ao mudar)
 *   Anterior | Próxima
 *
 * "Repetir instrução" destaca o texto, anuncia para leitores de tela e,
 * se os sons estiverem ligados, lê em voz alta (js/speech.js).
 */

import { el } from './dom.js';
import { createButton } from './button.js';
import { createStepIndicator } from './progressIndicators.js';
import { speak } from '../speech.js';
import { createFeedback } from './feedback.js';

const HIGHLIGHT_DURATION_MS = 2000;

/**
 * Mostra o resultado de uma resposta no feedbackSlot da moldura e, se for
 * uma resposta válida, registra a atividade como concluída.
 * @param {{ feedbackSlot: HTMLElement }} frame
 * @param {{ completes: boolean, tone: string, title: string, message?: string }} result
 * @param {() => void} complete
 */
export function showResult(frame, result, complete) {
  const { completes, ...feedback } = result;
  frame.feedbackSlot.replaceChildren(createFeedback({ ...feedback, announce: false }));
  if (completes) complete();
}

/**
 * @param {Object} options
 * @param {string} [options.partTitle]
 * @param {number} options.current          posição da atividade (começa em 1)
 * @param {number} options.total
 * @param {string} options.title
 * @param {string} options.instruction
 * @param {Node} [options.media]
 * @param {(() => void) | null} [options.onPrevious]  null desativa "Anterior"
 * @param {() => void} options.onNext
 * @param {string} [options.nextLabel='Próxima']
 * @returns {{ element: HTMLElement, heading: HTMLElement, choicesSlot: HTMLElement, feedbackSlot: HTMLElement }}
 */
export function createActivityFrame({
  partTitle, current, total, title, instruction, media, onPrevious, onNext, nextLabel = 'Próxima',
}) {
  const heading = el('h2', { className: 'activity__title', text: title });
  const instructionText = el('p', { className: 'activity__instruction', text: instruction });
  const announcer = el('p', { className: 'visually-hidden', attrs: { 'aria-live': 'polite' } });
  let highlightTimer;

  const repeatInstruction = () => {
    instructionText.classList.add('is-highlighted');
    instructionText.scrollIntoView({ block: 'nearest' });
    window.clearTimeout(highlightTimer);
    highlightTimer = window.setTimeout(
      () => instructionText.classList.remove('is-highlighted'),
      HIGHLIGHT_DURATION_MS,
    );
    // Esvazia e preenche de novo para o leitor de tela repetir o anúncio.
    announcer.textContent = '';
    window.requestAnimationFrame(() => { announcer.textContent = instruction; });
    speak(instruction);
  };

  const choicesSlot = el('div', { className: 'activity__choices' });
  const feedbackSlot = el('div', { className: 'activity__feedback', attrs: { role: 'status' } });

  const element = el('section', { className: 'activity' }, [
    el('div', { className: 'activity__progress' }, [
      partTitle && el('p', { className: 'activity__part', text: partTitle }),
      createStepIndicator({ current, total, label: 'Atividade' }),
    ]),
    el('div', { className: 'activity__card panel' }, [
      media && el('div', { className: 'activity__media' }, [media]),
      el('div', { className: 'activity__prompt' }, [
        heading,
        instructionText,
        createButton({
          label: 'Repetir instrução',
          variant: 'secondary',
          icon: 'speaker',
          className: 'activity__repeat',
          onClick: repeatInstruction,
        }),
        announcer,
      ]),
    ]),
    choicesSlot,
    feedbackSlot,
    el('nav', { className: 'activity__nav', attrs: { 'aria-label': 'Navegar entre as atividades' } }, [
      createButton({
        label: 'Anterior',
        variant: 'secondary',
        icon: 'arrowLeft',
        className: 'activity__previous',
        onClick: onPrevious ?? undefined,
        attrs: { disabled: !onPrevious },
      }),
      createButton({
        label: nextLabel,
        variant: 'module',
        icon: 'arrowRight',
        iconPosition: 'end',
        className: 'activity__next',
        onClick: onNext,
      }),
    ]),
  ]);

  return { element, heading, choicesSlot, feedbackSlot };
}
