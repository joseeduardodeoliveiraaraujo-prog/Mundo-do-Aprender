/**
 * screenHeader.js — cabeçalho padrão das telas internas.
 * O botão "Voltar" fica sempre no mesmo lugar, para dar previsibilidade.
 */

import { el } from './dom.js';
import { createBackButton } from './backButton.js';

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} [options.icon]       caminho de um ícone de módulo (assets/icons)
 * @param {string} [options.backHref]
 * @param {string} [options.backLabel]
 * @returns {HTMLElement}
 */
export function createScreenHeader({ title, icon, backHref, backLabel }) {
  return el('header', { className: 'screen-header' }, [
    createBackButton({ href: backHref, label: backLabel }),
    el('div', { className: 'screen-header__heading' }, [
      icon && el('img', {
        className: 'screen-header__icon',
        attrs: { src: icon, alt: '', width: 56, height: 56 },
      }),
      el('h1', { className: 'screen-header__title', text: title }),
    ]),
  ]);
}
