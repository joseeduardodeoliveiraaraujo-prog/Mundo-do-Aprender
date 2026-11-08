/**
 * companion.js — personagem que acompanha a criança na atividade: uma imagem
 * que muda de pose e um balão de fala.
 *
 * O balão usa a própria região de status do tabuleiro (`status`), então existe
 * uma única mensagem na tela e um único anúncio para o leitor de tela.
 *
 *   say(texto, pose)   resposta a uma ação da criança (também lê em voz alta)
 *   show(texto, pose)  mensagem inicial ou depois de Desfazer/Recomeçar (sem voz)
 */

import { el } from './dom.js';
import { speak } from '../speech.js';

/** Peça que está em um lugar do tabuleiro, ou undefined. */
export const occupantOf = (placement, targetId) => Object.keys(placement).find((id) => placement[id] === targetId);

/**
 * @param {Object} options
 * @param {{ name: string, poses: Record<string, string> }} options.character
 * @param {HTMLElement} [options.status]  região aria-live do tabuleiro; sem ela, cria uma
 * @param {string} [options.mood='neutral']
 * @param {HTMLElement} [options.slot]    lugar de soltar ao lado da personagem
 */
export function createCompanion({ character, status, mood = 'neutral', slot }) {
  const { name, poses } = character;
  const speech = status ?? el('p', { attrs: { 'aria-live': 'polite' } });
  speech.classList.add('companion__speech');
  const image = el('img', { className: 'companion__image', attrs: { src: poses[mood], alt: '', width: 120, height: 140 } });

  const setMood = (next) => {
    image.src = poses[next];
    image.classList.remove('is-happy');
    if (next === 'happy') {
      void image.offsetWidth; // reinicia o pulinho
      image.classList.add('is-happy');
    }
  };
  const write = (text) => {
    speech.textContent = '';
    window.requestAnimationFrame(() => { speech.textContent = text; });
  };

  const element = el('aside', { className: `companion${slot ? ' companion--stage' : ''}`, attrs: { 'aria-label': name } }, [
    el('div', { className: 'companion__who' }, [image, el('p', { className: 'companion__name', text: name })]),
    el('div', { className: 'companion__bubble' }, [speech]),
    slot,
  ]);

  return {
    element,
    setMood,
    show(text, next = 'neutral') { setMood(next); write(text); },
    say(text, next = 'neutral') { setMood(next); write(text); speak(text); },
  };
}
