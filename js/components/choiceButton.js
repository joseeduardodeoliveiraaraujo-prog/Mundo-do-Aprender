/**
 * choiceButton.js — alternativas de resposta das atividades.
 *
 * Cada alternativa é um <button> com aria-pressed (selecionada ou não).
 * A seleção é indicada por borda, fundo e um sinal de ✓ — nunca só pela cor,
 * e sem cores de "certo/errado".
 */

import { el } from './dom.js';
import { createIcon } from './icons.js';

/**
 * @param {Object} options
 * @param {string} options.label
 * @param {string} [options.image]   imagem decorativa (o texto já diz o significado)
 * @param {string} [options.icon]    nome de um ícone de icons.js
 * @param {(button: HTMLButtonElement) => void} [options.onSelect]
 * @returns {HTMLButtonElement}
 */
export function createChoiceButton({ label, image, icon, onSelect }) {
  const button = el('button', {
    className: 'choice-button',
    attrs: { type: 'button', 'aria-pressed': 'false' },
  }, [
    image && el('img', { className: 'choice-button__image', attrs: { src: image, alt: '', width: 64, height: 64 } }),
    icon && el('span', { className: 'choice-button__icon' }, [createIcon(icon)]),
    el('span', { className: 'choice-button__label', text: label }),
  ]);

  if (onSelect) button.addEventListener('click', () => onSelect(button));
  return button;
}

/**
 * Agrupa alternativas. O número de alternativas ajusta as colunas (CSS).
 * @param {Object} options
 * @param {string} options.label        nome acessível do grupo
 * @param {HTMLButtonElement[]} options.choices
 * @returns {HTMLElement}
 */
export function createChoiceGroup({ label, choices }) {
  return el('div', {
    className: 'choice-group',
    attrs: { role: 'group', 'aria-label': label },
    dataset: { count: String(choices.length) },
  }, choices);
}

/** Marca `selected` como escolhida e desmarca as demais do grupo. */
export function setSelectedChoice(group, selected) {
  group.querySelectorAll('.choice-button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button === selected));
  });
}
