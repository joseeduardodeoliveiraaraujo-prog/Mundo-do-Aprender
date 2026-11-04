/**
 * progressIndicators.js — indicadores de progresso.
 *
 * - createProgressBar: barra contínua (ex.: atividades concluídas no módulo).
 * - createStepIndicator: passos de uma atividade (ex.: "Passo 2 de 4").
 *
 * Ambos têm texto equivalente; a informação nunca depende só da cor.
 */

import { el } from './dom.js';

/**
 * @param {Object} options
 * @param {number} options.value
 * @param {number} options.max
 * @param {string} options.label  nome acessível, ex.: "Progresso em Minha Rotina"
 * @returns {HTMLElement}
 */
export function createProgressBar({ value, max, label }) {
  const safeMax = Math.max(0, max);
  const safeValue = Math.min(Math.max(0, value), safeMax);
  const percent = safeMax > 0 ? Math.round((safeValue / safeMax) * 100) : 0;

  const bar = el('div', {
    className: 'progress-bar',
    attrs: {
      role: 'progressbar',
      'aria-label': label,
      'aria-valuemin': 0,
      'aria-valuemax': safeMax,
      'aria-valuenow': safeValue,
      'aria-valuetext': `${safeValue} de ${safeMax}`,
    },
  }, [el('span', { className: 'progress-bar__fill' })]);

  bar.style.setProperty('--progress', `${percent}%`);
  return bar;
}

/**
 * @param {Object} options
 * @param {number} options.current  passo atual (começa em 1)
 * @param {number} options.total
 * @param {string} [options.label='Passo']
 * @returns {HTMLElement}
 */
export function createStepIndicator({ current, total, label = 'Passo' }) {
  const steps = Array.from({ length: total }, (_, index) => {
    const stepNumber = index + 1;
    const state = stepNumber < current ? 'done' : stepNumber === current ? 'current' : 'todo';
    return el('li', { className: `step-indicator__step step-indicator__step--${state}` });
  });

  return el('div', { className: 'step-indicator' }, [
    el('ol', { className: 'step-indicator__steps', attrs: { 'aria-hidden': 'true' } }, steps),
    el('p', { className: 'step-indicator__text', text: `${label} ${current} de ${total}` }),
  ]);
}
