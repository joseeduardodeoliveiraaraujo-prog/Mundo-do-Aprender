/**
 * Minha prancha de comunicação: os cartões ganhos nas atividades concluídas.
 * Só aparecem os cartões já ganhos, para a tela ficar limpa. Tocar em um cartão
 * mostra o que ele diz em destaque (e lê, com os sons ligados).
 * Calculada do progresso salvo.
 */

import { el } from '../../components/dom.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { getCompletedActivityIds } from '../../progress.js';
import { speak } from '../../speech.js';
import { communicationData } from '../../data/communication.js';

const { moduleId, cards, activities, messages } = communicationData;
const texts = messages.myBoard;

export function createMyBoard() {
  const done = new Set(getCompletedActivityIds(moduleId));
  const earned = activities.filter(({ id }) => done.has(id));
  const display = el('p', { className: 'my-board__display', attrs: { 'aria-live': 'polite' }, text: earned.length ? texts.hint : texts.empty });

  const items = earned.map(({ prize }) => {
    const card = cards[prize];
    const button = el('button', { className: 'my-board__card', attrs: { type: 'button' } }, [
      el('img', { attrs: { src: card.image, alt: '', width: 64, height: 64 } }),
      el('span', { text: card.label }),
    ]);
    button.addEventListener('click', () => {
      display.textContent = `${texts.showing} ${card.label}`;
      speak(card.label);
    });
    return el('li', { className: 'my-board__item' }, [button]);
  });

  return el('section', { className: 'my-board', attrs: { 'aria-label': texts.title } }, [
    el('h3', { className: 'my-board__title', text: texts.title }),
    el('p', { className: 'my-board__count', text: fillTemplate(texts.count, { done: earned.length, total: activities.length }) }),
    display,
    el('ul', { className: 'my-board__grid', attrs: { role: 'list' } }, items),
  ]);
}
