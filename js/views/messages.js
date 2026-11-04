/**
 * messages.js — telas simples de aviso (página não encontrada e erro).
 * Linguagem calma e direta, sempre com um caminho claro de volta.
 */

import { el } from '../components/dom.js';
import { createLinkButton } from '../components/button.js';

function renderMessage(view, title, text) {
  view.append(
    el('section', { className: 'message-screen panel' }, [
      el('h1', { className: 'message-screen__title', text: title }),
      el('p', { className: 'message-screen__text', text }),
      createLinkButton({ href: '#/', label: 'Voltar ao início', icon: 'arrowLeft' }),
    ]),
  );
}

/** @param {HTMLElement} view */
export function renderNotFound(view) {
  renderMessage(view, 'Página não encontrada', 'Este caminho não existe. Vamos voltar ao início?');
}

/** @param {HTMLElement} view */
export function renderLoadError(view) {
  renderMessage(view, 'Não foi possível abrir', 'Algo não funcionou. Vamos voltar ao início e tentar de novo?');
}
