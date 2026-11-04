/**
 * sortableList.js — lista de cartões que a criança pode reordenar.
 *
 * Duas formas equivalentes (a criança escolhe):
 * 1. Arrastar e soltar (Pointer Events: funciona com dedo, caneta e mouse).
 *    - Toque/caneta: arraste pela alça numerada (à esquerda), para que o
 *      resto do cartão continue rolando a página normalmente.
 *    - Mouse: arraste o cartão inteiro.
 * 2. Botões ↑ / ↓ em cada cartão (teclado, leitor de tela, coordenação fina).
 *
 * A cada mudança, a nova posição é anunciada para leitores de tela e
 * `onReorder(ordem)` é chamado.
 */

import { el } from './dom.js';
import { createIcon } from './icons.js';

const EDGE_SCROLL_ZONE = 64; // px perto da borda da tela que fazem a página rolar ao arrastar
const EDGE_SCROLL_STEP = 14;

function midpoint(node) {
  const rect = node.getBoundingClientRect();
  return rect.top + rect.height / 2;
}

/**
 * @param {Object} options
 * @param {ReadonlyArray<{ id: string, label: string, image: string }>} options.items  na ordem inicial
 * @param {string} options.label  nome acessível da lista
 * @param {(order: string[]) => void} [options.onReorder]
 * @returns {{ element: HTMLElement, getOrder: () => string[], setOrder: (order: string[]) => void }}
 */
export function createSortableList({ items, label, onReorder }) {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const nodesById = new Map();
  const list = el('ol', { className: 'sortable', attrs: { 'aria-label': label } });
  const announcer = el('p', { className: 'visually-hidden', attrs: { 'aria-live': 'polite' } });

  const getOrder = () => [...list.children].map((node) => node.dataset.id);

  function refresh() {
    const nodes = [...list.children];
    nodes.forEach((node, index) => {
      node.querySelector('.sortable__position').textContent = String(index + 1);
      node.querySelector('[data-move="up"]').disabled = index === 0;
      node.querySelector('[data-move="down"]').disabled = index === nodes.length - 1;
    });
  }

  function commit(node) {
    refresh();
    const position = getOrder().indexOf(node.dataset.id) + 1;
    announcer.textContent = `${itemsById.get(node.dataset.id).label}: posição ${position} de ${items.length}.`;
    onReorder?.(getOrder());
  }

  // ---------- Botões ↑ / ↓ ----------
  function moveWithButton(node, direction, button) {
    const sibling = direction === 'up' ? node.previousElementSibling : node.nextElementSibling;
    if (!sibling) return;
    if (direction === 'up') list.insertBefore(node, sibling);
    else list.insertBefore(sibling, node);
    commit(node);
    // Se o botão ficou desativado (chegou à ponta), o foco vai para o outro botão.
    const opposite = node.querySelector(`[data-move="${direction === 'up' ? 'down' : 'up'}"]`);
    (button.disabled ? opposite : button).focus();
  }

  // ---------- Arrastar e soltar ----------
  function startDrag(node, event) {
    const { pointerId } = event;
    const orderBefore = getOrder().join();
    const grabOffset = event.clientY - node.getBoundingClientRect().top;
    // Sem isso, o navegador "corrige" a rolagem a cada troca de lugar
    // (ancoragem de rolagem) e o cartão foge do dedo em páginas roladas.
    const root = document.documentElement;
    const previousAnchor = root.style.overflowAnchor;
    root.style.overflowAnchor = 'none';
    node.classList.add('is-dragging');
    list.classList.add('is-sorting');

    const place = (clientY) => {
      node.style.transform = '';
      const desiredTop = clientY - grabOffset;
      const height = node.offsetHeight;
      // Troca de lugar quando o topo passa do meio do cartão de cima,
      // ou a base passa do meio do cartão de baixo (repete se o dedo pulou vários).
      let moved = true;
      while (moved) {
        moved = false;
        const previous = node.previousElementSibling;
        const next = node.nextElementSibling;
        if (previous && desiredTop < midpoint(previous)) {
          list.insertBefore(node, previous);
          moved = true;
        } else if (next && desiredTop + height > midpoint(next)) {
          list.insertBefore(next, node);
          moved = true;
        }
      }
      const layoutTop = node.getBoundingClientRect().top;
      node.style.transform = `translateY(${desiredTop - layoutTop}px)`;
    };

    // Os eventos são ouvidos na janela (e não no cartão): ao mover o cartão no
    // DOM, o navegador solta a "captura" do ponteiro, e o dedo poderia escapar.
    const onMove = (moveEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      moveEvent.preventDefault();
      if (moveEvent.clientY < EDGE_SCROLL_ZONE) window.scrollBy(0, -EDGE_SCROLL_STEP);
      else if (moveEvent.clientY > window.innerHeight - EDGE_SCROLL_ZONE) window.scrollBy(0, EDGE_SCROLL_STEP);
      place(moveEvent.clientY);
    };

    const onEnd = (endEvent) => {
      if (endEvent.pointerId !== pointerId) return;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      root.style.overflowAnchor = previousAnchor;
      node.style.transform = '';
      node.classList.remove('is-dragging');
      list.classList.remove('is-sorting');
      if (getOrder().join() !== orderBefore) commit(node);
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
  }

  function enableDrag(node) {
    node.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.target.closest('button')) return;
      const fromHandle = Boolean(event.target.closest('.sortable__handle'));
      if (event.pointerType !== 'mouse' && !fromHandle) return; // toque fora da alça = rolar a página
      event.preventDefault();
      startDrag(node, event);
    });
  }

  function createItem(item) {
    const up = el('button', {
      className: 'sortable__move',
      attrs: { type: 'button', 'data-move': 'up', 'aria-label': `Mover ${item.label} para cima` },
    }, [createIcon('arrowUp')]);
    const down = el('button', {
      className: 'sortable__move',
      attrs: { type: 'button', 'data-move': 'down', 'aria-label': `Mover ${item.label} para baixo` },
    }, [createIcon('arrowDown')]);

    const node = el('li', { className: 'sortable__item', dataset: { id: item.id } }, [
      el('span', { className: 'sortable__handle', attrs: { 'aria-hidden': 'true' } }, [
        el('span', { className: 'sortable__position' }),
        createIcon('grip'),
      ]),
      el('img', { className: 'sortable__image', attrs: { src: item.image, alt: '', width: 64, height: 64, draggable: 'false' } }),
      el('span', { className: 'sortable__label', text: item.label }),
      el('span', { className: 'sortable__buttons' }, [up, down]),
    ]);

    up.addEventListener('click', () => moveWithButton(node, 'up', up));
    down.addEventListener('click', () => moveWithButton(node, 'down', down));
    enableDrag(node);
    nodesById.set(item.id, node);
    return node;
  }

  items.forEach((item) => list.append(createItem(item)));
  refresh();

  return {
    element: el('div', { className: 'sortable-wrapper' }, [list, announcer]),
    getOrder,
    /** Reorganiza sem chamar onReorder (usado por Desfazer/Recomeçar). */
    setOrder(order) {
      list.replaceChildren(...order.map((id) => nodesById.get(id)));
      refresh();
    },
  };
}
