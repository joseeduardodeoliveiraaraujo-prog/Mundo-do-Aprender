/**
 * Caixa de diálogo das missões, no estilo dos jogos de RPG: rosto e nome de
 * quem fala, a fala, uma figura opcional e as respostas em cartões.
 *
 * Fica sobre a parte de baixo do mapa (em telas estreitas, logo abaixo dele).
 * A fala é lida em voz alta só com sons ligados (speech.js) e sempre depois de
 * uma ação da criança. "Parar o desafio" fica sempre à mão.
 */

import { el } from '../../../components/dom.js';
import { createButton } from '../../../components/button.js';
import { createIcon } from '../../../components/icons.js';
import { speak, stopSpeaking } from '../../../speech.js';

/**
 * @param {{ texts: { continue: string, stop: string, conversation: string, answers: string }, onStop: () => void }} options
 */
export function createDialogBox({ texts, onStop }) {
  const face = el('img', { className: 'quest-dialog__face', attrs: { alt: '', width: 64, height: 64 } });
  const name = el('p', { className: 'quest-dialog__name' });
  const text = el('p', { className: 'quest-dialog__text', attrs: { 'aria-live': 'polite' } });
  const picture = el('img', { className: 'quest-dialog__picture', attrs: { alt: '', hidden: true } });
  const strip = el('ol', { className: 'quest-dialog__strip', attrs: { role: 'list', hidden: true } });
  const options = el('div', { className: 'quest-dialog__options', attrs: { role: 'group', 'aria-label': texts.answers } });
  const actions = el('div', { className: 'quest-dialog__actions' });
  const element = el('section', { className: 'quest-dialog', attrs: { hidden: true, 'aria-label': texts.conversation } }, [
    face,
    el('div', { className: 'quest-dialog__body' }, [name, text, picture, strip, options, actions]),
    createButton({ label: texts.stop, variant: 'ghost', icon: 'pause', className: 'quest-dialog__stop', onClick: onStop }),
  ]);

  let pending = null; // resolve da pergunta em aberto

  function show({ speaker, line, image, picked = [] }) {
    element.hidden = false;
    face.src = speaker.face;
    face.hidden = !speaker.face;
    name.textContent = speaker.name;
    text.textContent = line;
    picture.hidden = !image;
    if (image) { picture.src = image.src; picture.alt = image.alt ?? ''; }
    strip.hidden = picked.length === 0;
    strip.replaceChildren(...picked.map((card, index) => el('li', { className: 'quest-dialog__picked' }, [
      el('span', { className: 'quest-dialog__number', text: String(index + 1) }),
      card.image && el('img', { attrs: { src: card.image, alt: '', width: 32, height: 32 } }),
      el('span', { text: card.label }),
    ])));
    speak(line);
  }

  function focusFirst() {
    const target = options.querySelector('button') ?? actions.querySelector('button');
    target?.focus({ preventScroll: true });
    element.scrollIntoView({ block: 'nearest' });
  }

  function settle(value) {
    const resolve = pending;
    pending = null;
    resolve?.(value);
  }

  return {
    element,
    get isOpen() { return !element.hidden; },
    /** Mostra uma fala e espera "Continuar". */
    say({ speaker, text: line, image }) {
      show({ speaker, line, image });
      options.replaceChildren();
      actions.replaceChildren(createButton({
        label: texts.continue, variant: 'module', icon: 'arrowRight', iconPosition: 'end', onClick: () => settle(true),
      }));
      focusFirst();
      return new Promise((resolve) => { pending = resolve; });
    },
    /**
     * Mostra uma pergunta com cartões e devolve o índice escolhido.
     * @param {{ speaker, text, image?, picked?, options: Array<{ label, image?, icon? }> }} question
     */
    choose({ speaker, text: line, image, picked, options: choices }) {
      show({ speaker, line, image, picked });
      actions.replaceChildren();
      options.replaceChildren(...choices.map((choice, index) => {
        const button = el('button', { className: 'quest-option', attrs: { type: 'button' } }, [
          choice.image ? el('img', { className: 'quest-option__image', attrs: { src: choice.image, alt: '', width: 56, height: 56 } })
            : choice.icon && createIcon(choice.icon),
          el('span', { className: 'quest-option__label', text: choice.label }),
        ]);
        button.addEventListener('click', () => settle(index));
        return button;
      }));
      focusFirst();
      return new Promise((resolve) => { pending = resolve; });
    },
    hide() {
      element.hidden = true;
      stopSpeaking();
    },
    /** Interrompe uma pergunta em aberto (missão parada). */
    cancel() {
      settle(null);
      this.hide();
    },
  };
}
