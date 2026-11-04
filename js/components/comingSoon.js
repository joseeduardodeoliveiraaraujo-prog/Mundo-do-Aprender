/**
 * comingSoon.js — tela provisória para módulos ainda não implementados.
 */

import { el } from './dom.js';
import { createScreenHeader } from './screenHeader.js';
import { createCard } from './card.js';
import { createFeedback } from './feedback.js';

/**
 * @param {HTMLElement} view
 * @param {import('../modules.js').ModuleInfo} module
 */
export function renderComingSoon(view, module) {
  view.append(
    el('section', { className: 'game-screen', dataset: { module: module.id } }, [
      createScreenHeader({ title: module.title, icon: module.icon }),
      createCard({
        className: 'module-intro',
        title: 'Sobre este mundo',
        text: module.description,
        media: el('img', {
          className: 'module-intro__art',
          attrs: { src: module.illustration, alt: '', width: 240, height: 160 },
        }),
      }),
      createFeedback({
        tone: 'info',
        title: 'Este mundo está em preparação.',
        message: 'Em breve você poderá brincar e aprender aqui. Por enquanto, volte ao início e conheça os outros mundos.',
      }),
    ]),
  );
}
