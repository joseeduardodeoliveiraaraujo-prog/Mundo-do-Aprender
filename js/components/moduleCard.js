/**
 * moduleCard.js — cartão de um módulo na tela inicial (usa o cartão genérico).
 */

import { el } from './dom.js';
import { createCard } from './card.js';
import { createLinkButton } from './button.js';

/**
 * @param {import('../modules.js').ModuleInfo} module
 * @returns {HTMLElement}
 */
export function createModuleCard(module) {
  return createCard({
    moduleId: module.id,
    className: 'module-card',
    headingLevel: 3,
    title: module.title,
    text: module.description,
    media: el('img', {
      className: 'module-card__art',
      attrs: { src: module.illustration, alt: '', width: 240, height: 160 },
    }),
    footer: createLinkButton({
      href: `#${module.route}`,
      label: 'Começar',
      variant: 'module',
      icon: 'arrowRight',
      iconPosition: 'end',
      className: 'card__action',
      attrs: { 'aria-label': `Começar ${module.title}` },
    }),
  });
}
