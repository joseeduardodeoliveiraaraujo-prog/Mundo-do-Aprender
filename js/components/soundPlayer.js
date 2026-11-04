/**
 * soundPlayer.js — painel de som opcional de uma atividade.
 *
 * - "Ouvir o som" (vira "Ouvir de novo" depois da primeira vez). Nunca toca sozinho.
 * - "Ver o som escrito" mostra/esconde a forma escrita (ex.: "Muuu!"), para
 *   que a atividade possa ser feita totalmente sem áudio.
 * - Uma mensagem curta explica quando o som está desligado, quando é uma
 *   imitação feita pela voz do aparelho ou quando não pôde tocar.
 */

import { el } from './dom.js';
import { createButton } from './button.js';
import { playSound } from '../audio.js';

let playerCount = 0;

const STATUS_TEXT = Object.freeze({
  file: '',
  voice: 'Este som é uma imitação feita pela voz do aparelho.',
  muted: 'Os sons estão desligados. Você pode ligá-los em Configurações ou ver o som escrito.',
  unavailable: 'Não foi possível tocar o som neste aparelho. Você pode ver o som escrito.',
});

/**
 * @param {Object} options
 * @param {{ file: string|null, text: string }} options.sound
 * @returns {HTMLElement}
 */
export function createSoundPlayer({ sound }) {
  const status = el('p', { className: 'sound-player__status', attrs: { 'aria-live': 'polite' } });
  const written = el('p', { className: 'sound-player__written', text: sound.text, attrs: { id: `som-escrito-${++playerCount}` } });
  written.hidden = true;

  const play = createButton({
    label: 'Ouvir o som',
    variant: 'module',
    size: 'lg',
    icon: 'speaker',
    className: 'sound-player__play',
    onClick: async () => {
      const result = await playSound(sound);
      play.querySelector('.button__label').textContent = 'Ouvir de novo';
      status.textContent = STATUS_TEXT[result];
    },
  });

  const reveal = createButton({
    label: 'Ver o som escrito',
    variant: 'secondary',
    className: 'sound-player__reveal',
    attrs: { 'aria-expanded': 'false', 'aria-controls': written.id },
    onClick: () => {
      written.hidden = !written.hidden;
      reveal.setAttribute('aria-expanded', String(!written.hidden));
      reveal.querySelector('.button__label').textContent = written.hidden ? 'Ver o som escrito' : 'Esconder o som escrito';
    },
  });

  return el('div', { className: 'sound-player' }, [play, reveal, written, status]);
}
