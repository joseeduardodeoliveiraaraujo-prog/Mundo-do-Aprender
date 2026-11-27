/**
 * Painel de objetivo das missões de procurar e de pegar e levar: fica sobre
 * o topo do mapa enquanto Noa anda. Mostra o objetivo, a lista do que falta
 * (com ✓ no que já foi feito), o que acabou de acontecer, o que Noa está carregando, botões para ir até
 * os itens (para quem não usa o mapa) e "Parar o desafio".
 */

import { el } from '../../../components/dom.js';
import { createButton } from '../../../components/button.js';
import { createIcon } from '../../../components/icons.js';

/**
 * @param {{ texts: { stop: string, goal: string, checklist: string }, onStop: () => void }} options
 */
export function createQuestHud({ texts, onStop }) {
  const goal = el('p', { className: 'quest-hud__goal' });
  const list = el('ul', { className: 'quest-hud__list', attrs: { role: 'list', 'aria-label': texts.checklist } });
  const note = el('p', { className: 'quest-hud__note', attrs: { hidden: true } });
  const carrying = el('p', { className: 'quest-hud__carrying', attrs: { hidden: true } });
  const buttons = el('div', { className: 'quest-hud__buttons', attrs: { role: 'group' } });
  const element = el('section', { className: 'quest-hud', attrs: { hidden: true, 'aria-label': texts.goal, 'aria-live': 'polite' } }, [
    el('div', { className: 'quest-hud__body' }, [goal, list, note, carrying, buttons]),
    createButton({ label: texts.stop, variant: 'ghost', icon: 'pause', className: 'quest-hud__stop', onClick: onStop }),
  ]);

  return {
    element,
    /**
     * @param {{ goal: string, items?: Array<{ label: string, done: boolean }>, note?: string, carrying?: string,
     *   actions?: Array<{ label: string, onClick: () => void }> }} state
     */
    show({ goal: text, items = [], note: noteText, carrying: carried, actions = [] }) {
      element.hidden = false;
      goal.textContent = text;
      list.hidden = items.length === 0;
      list.replaceChildren(...items.map((item) => el('li', { className: `quest-hud__item${item.done ? ' is-done' : ''}` }, [
        el('span', { className: 'quest-hud__mark', attrs: { 'aria-hidden': 'true' } }, item.done ? [createIcon('check')] : []),
        el('span', { text: item.label }),
      ])));
      note.hidden = !noteText;
      note.textContent = noteText ?? '';
      carrying.hidden = !carried;
      carrying.textContent = carried ?? '';
      buttons.hidden = actions.length === 0;
      buttons.replaceChildren(...actions.map((action) => createButton({
        label: action.label, variant: 'secondary', className: 'quest-hud__button', onClick: action.onClick,
      })));
    },
    hide() {
      element.hidden = true;
    },
  };
}
