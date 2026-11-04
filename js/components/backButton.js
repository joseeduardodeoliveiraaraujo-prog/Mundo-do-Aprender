/**
 * backButton.js — botão "Voltar" padrão de todas as telas internas.
 */

import { createLinkButton } from './button.js';

/**
 * @param {Object} [options]
 * @param {string} [options.href='#/']
 * @param {string} [options.label='Voltar ao início']
 * @returns {HTMLAnchorElement}
 */
export function createBackButton({ href = '#/', label = 'Voltar ao início' } = {}) {
  return createLinkButton({
    href,
    label,
    variant: 'secondary',
    icon: 'arrowLeft',
    className: 'back-button',
  });
}
