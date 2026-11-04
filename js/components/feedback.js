/**
 * feedback.js — mensagens de feedback calmas e positivas.
 *
 * Tons:
 *   success    acertou / concluiu   (ícone estrela)
 *   encourage  tentar de novo       (ícone coração) — nunca punitivo
 *   info       aviso neutro         (ícone "i")
 *
 * Para anunciar feedback que surge durante um jogo, insira a mensagem em
 * um contêiner que JÁ esteja na página com role="status" (é ele que o leitor
 * de tela anuncia) e crie a mensagem com `announce: false`, para não haver
 * duas regiões de anúncio aninhadas.
 */

import { el } from './dom.js';
import { createIcon } from './icons.js';

const TONE_ICONS = Object.freeze({
  success: 'star',
  encourage: 'heart',
  info: 'info',
});

/**
 * @param {Object} options
 * @param {'success'|'encourage'|'info'} [options.tone='info']
 * @param {string} options.title
 * @param {string} [options.message]
 * @param {boolean} [options.announce=true]  false quando já está dentro de uma região role="status"
 * @returns {HTMLElement}
 */
export function createFeedback({ tone = 'info', title, message, announce = true }) {
  const icon = TONE_ICONS[tone] ?? TONE_ICONS.info;

  return el('div', { className: `feedback feedback--${tone}`, attrs: { role: announce ? 'status' : null } }, [
    el('span', { className: 'feedback__icon' }, [createIcon(icon)]),
    el('div', { className: 'feedback__content' }, [
      el('p', { className: 'feedback__title', text: title }),
      message && el('p', { className: 'feedback__message', text: message }),
    ]),
  ]);
}
