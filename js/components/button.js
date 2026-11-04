/**
 * button.js — botões padronizados.
 *
 * Variantes (classe .button--<variante> em css/components.css):
 *   primary   ação principal
 *   secondary ação alternativa (contorno)
 *   ghost     ações discretas do cabeçalho
 *   module    usa a cor do módulo atual (--module-strong)
 *
 * Use createButton para AÇÕES e createLinkButton para NAVEGAÇÃO.
 */

import { el } from './dom.js';
import { createIcon } from './icons.js';

function buildClassName({ variant = 'primary', size, className }) {
  return ['button', `button--${variant}`, size && `button--${size}`, className]
    .filter(Boolean)
    .join(' ');
}

function buildContent({ label, icon, iconPosition = 'start' }) {
  const iconNode = icon ? createIcon(icon) : null;
  const labelNode = el('span', { className: 'button__label', text: label });
  return iconPosition === 'end' ? [labelNode, iconNode] : [iconNode, labelNode];
}

/**
 * @typedef {Object} ButtonOptions
 * @property {string} label
 * @property {'primary'|'secondary'|'ghost'|'module'} [variant='primary']
 * @property {'lg'} [size]
 * @property {string} [icon]                     nome de um ícone de icons.js
 * @property {'start'|'end'} [iconPosition='start']
 * @property {string} [className]
 * @property {Record<string, string>} [attrs]
 */

/**
 * @param {ButtonOptions & { onClick?: (event: MouseEvent) => void, type?: 'button'|'submit' }} options
 * @returns {HTMLButtonElement}
 */
export function createButton({ onClick, type = 'button', attrs = {}, ...options }) {
  const button = el('button', {
    className: buildClassName(options),
    attrs: { type, ...attrs },
  }, buildContent(options));

  if (onClick) button.addEventListener('click', onClick);
  return button;
}

/**
 * @param {ButtonOptions & { href: string }} options
 * @returns {HTMLAnchorElement}
 */
export function createLinkButton({ href, attrs = {}, ...options }) {
  return el('a', {
    className: buildClassName(options),
    attrs: { href, ...attrs },
  }, buildContent(options));
}
