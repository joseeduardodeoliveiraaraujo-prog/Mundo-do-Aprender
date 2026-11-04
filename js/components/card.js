/**
 * card.js — cartão genérico (mídia + título + texto + rodapé).
 *
 * Se o rodapé tiver um elemento com a classe "card__action", o cartão
 * inteiro fica clicável (área de toque maior), sem aninhar links.
 */

import { el } from './dom.js';

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} [options.text]
 * @param {Node} [options.media]                ilustração exibida no topo
 * @param {Node | Node[]} [options.footer]      botões/ações
 * @param {string} [options.moduleId]           aplica a cor do módulo (data-module)
 * @param {2|3|4} [options.headingLevel=2]
 * @param {string} [options.className]
 * @returns {HTMLElement}
 */
export function createCard({ title, text, media, footer, moduleId, headingLevel = 2, className }) {
  return el('article', {
    className: ['card', className].filter(Boolean).join(' '),
    dataset: moduleId ? { module: moduleId } : {},
  }, [
    media && el('div', { className: 'card__media' }, [media]),
    el('div', { className: 'card__body' }, [
      el(`h${headingLevel}`, { className: 'card__title', text: title }),
      text && el('p', { className: 'card__text', text }),
    ]),
    footer && el('div', { className: 'card__footer' }, footer),
  ]);
}
