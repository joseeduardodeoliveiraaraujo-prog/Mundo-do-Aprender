/**
 * placementBoard.js — quebra-cabeça "peça → lugar", com arrastar e soltar de verdade.
 *
 * Arrastar (mouse, dedo ou caneta — Pointer Events):
 * - Ao segurar e mover a peça, uma cópia flutuante (position: fixed) segue o
 *   ponteiro; a peça original fica "levantada" (apagadinha) no lugar de onde saiu.
 * - O lugar sob o ponteiro fica destacado ("Solte aqui").
 * - Perto da borda de cima/baixo da tela, a página rola sozinha (para alcançar
 *   lugares fora da tela no celular).
 * - Ao soltar num lugar aceito, a peça desliza da posição do dedo até encaixar.
 *   Fora de um lugar, ou num lugar que não aceita a peça, ela desliza de volta.
 *
 * Alternativas (AGENTS.md: sempre oferecer botões):
 * - Teclado / leitor de tela: Enter/Espaço na peça e depois no lugar.
 * - Toque simples na peça: com `tapToPlace` (padrão) escolhe a peça e o próximo
 *   toque num lugar a coloca. Com `tapToPlace: false`, o toque só mostra a dica
 *   "segure e arraste" — o arrasto é a forma de jogar.
 *
 * Regras:
 * - Cada lugar recebe uma peça; soltar num lugar ocupado troca as duas.
 * - `accepts(peça, lugar)` (opcional) decide se o lugar aceita a peça; se não
 *   aceitar, a peça volta para onde estava e o módulo é avisado em `onReject`.
 * - O deslocamento dura ~250ms e some com "Reduzir animações".
 *
 * O componente não conhece conteúdo: o módulo posiciona os lugares (`slots`)
 * e reage em `onPlace` / `onReject` / `onSelect`.
 */

import { el } from './dom.js';
import { createIcon } from './icons.js';

const DRAG_THRESHOLD = 4; // px até o movimento virar arrasto (abaixo disso é um toque)
const EDGE_SCROLL_ZONE = 72; // px perto da borda que fazem a página rolar durante o arrasto
const EDGE_SCROLL_STEP = 12;

const DEFAULT_TEXTS = Object.freeze({
  tray: 'Peças',
  trayReturn: 'Devolver para a caixa',
  emptySlot: 'Lugar vazio: {target}',
  dropHere: 'Solte aqui',
  placeHere: 'Colocar {piece} aqui: {target}',
  pieceInTray: '{piece}',
  pieceInSlot: '{piece}, em: {target}',
  chosen: '{piece} escolhido. Agora toque no lugar.',
  chooseFirst: 'Primeiro, escolha uma peça.',
  tapHint: 'Segure a peça e arraste até um lugar.',
  placed: '{piece} foi para: {target}.',
  returned: '{piece} voltou para a caixa.',
  outside: '{piece} voltou. Solte dentro de um lugar.',
  rejected: '{piece} voltou.',
});

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));

/**
 * @param {Object} options
 * @param {ReadonlyArray<{ id: string, label: string, image: string }>} options.pieces
 * @param {ReadonlyArray<{ id: string, label: string }>} options.targets
 * @param {boolean} [options.tapToPlace=true]  toque simples escolhe a peça (false: só arrastar ou teclado)
 * @param {(pieceId: string, targetId: string) => boolean} [options.accepts]
 * @param {(placement: Record<string, string|null>, move: { pieceId: string, targetId: string|null }) => void} [options.onPlace]
 * @param {(pieceId: string, targetId: string) => void} [options.onReject]  soltou num lugar que não aceita
 * @param {(pieceId: string|null) => void} [options.onSelect]  peça escolhida/arrastada mudou
 * @param {Partial<typeof DEFAULT_TEXTS>} [options.texts]
 * @returns {{ tray: HTMLElement, status: HTMLElement, slots: Map<string, HTMLElement>,
 *   getPlacement: () => Record<string, string|null>, setPlacement: (placement: Record<string, string|null>) => void,
 *   say: (text: string) => void }}
 */
export function createPlacementBoard({
  pieces, targets, tapToPlace = true, accepts = () => true, onPlace, onReject, onSelect, texts: customTexts = {},
}) {
  const texts = { ...DEFAULT_TEXTS, ...customTexts };
  const pieceById = new Map(pieces.map((piece) => [piece.id, piece]));
  const targetById = new Map(targets.map((target) => [target.id, target]));
  let placement = new Map(pieces.map(({ id }) => [id, null]));
  let selected = null;
  let suppressClick = false;

  const status = el('p', { className: 'placement__status', attrs: { 'aria-live': 'polite' } });
  const say = (text) => {
    status.textContent = '';
    window.requestAnimationFrame(() => { status.textContent = text; });
  };
  const labelOf = (pieceId, targetId) => ({
    piece: pieceById.get(pieceId).label,
    target: targetId ? targetById.get(targetId).label : '',
  });

  // ---------- Peças ----------
  const pieceNodes = new Map(pieces.map((piece) => {
    const node = el('button', {
      className: 'placement-piece',
      attrs: { type: 'button', 'aria-pressed': 'false', draggable: 'false' },
      dataset: { piece: piece.id },
    }, [
      el('img', { className: 'placement-piece__image', attrs: { src: piece.image, alt: '', width: 64, height: 64, draggable: 'false' } }),
      el('span', { className: 'placement-piece__label', text: piece.label }),
    ]);
    node.addEventListener('click', (event) => onPieceClick(piece.id, event));
    node.addEventListener('contextmenu', (event) => event.preventDefault()); // "segurar" no celular não abre menu
    enableDrag(node, piece.id);
    return [piece.id, node];
  }));

  // ---------- Lugares (o módulo decide onde ficam) ----------
  const emptyButtons = new Map();
  const slots = new Map(targets.map((target) => {
    const empty = el('button', { className: 'placement-slot__empty', attrs: { type: 'button' } }, [
      createIcon('plus'),
      // Aparece só durante a escolha/arrasto (CSS): mostra onde soltar.
      el('span', { className: 'placement-slot__hint', attrs: { 'aria-hidden': 'true' }, text: texts.dropHere }),
    ]);
    empty.addEventListener('click', (event) => {
      if (selected) place(selected, target.id);
      else say(event.detail === 0 || tapToPlace ? texts.chooseFirst : texts.tapHint);
    });
    emptyButtons.set(target.id, empty);
    return [target.id, el('div', { className: 'placement-slot', dataset: { target: target.id } }, [
      el('div', { className: 'placement-slot__dock' }),
    ])];
  }));

  // ---------- Caixa de peças ----------
  const trayDock = el('div', { className: 'placement-tray__dock' });
  const returnButton = el('button', {
    className: 'placement-tray__return button button--secondary',
    attrs: { type: 'button', hidden: true },
  }, [createIcon('undo'), el('span', { className: 'button__label', text: texts.trayReturn })]);
  returnButton.addEventListener('click', () => { if (selected) place(selected, null); });
  const tray = el('div', { className: 'placement-tray', attrs: { role: 'group', 'aria-label': texts.tray } }, [
    trayDock, returnButton, status,
  ]);
  const zones = [tray, ...slots.values()];

  // ---------- Desenho ----------
  function updateLabels() {
    pieceNodes.forEach((node, id) => {
      const targetId = placement.get(id);
      node.setAttribute('aria-label', fill(targetId ? texts.pieceInSlot : texts.pieceInTray, labelOf(id, targetId)));
      node.setAttribute('aria-pressed', String(selected === id));
    });
    emptyButtons.forEach((button, targetId) => {
      const values = { target: targetById.get(targetId).label, piece: selected ? pieceById.get(selected).label : '' };
      button.setAttribute('aria-label', fill(selected ? texts.placeHere : texts.emptySlot, values));
    });
    zones.forEach((zone) => zone.classList.toggle('is-choosing', Boolean(selected)));
    returnButton.hidden = !(selected && placement.get(selected));
    onSelect?.(selected);
  }

  function layout() {
    slots.forEach((slot, targetId) => {
      const occupant = [...placement].find(([, t]) => t === targetId)?.[0];
      slot.firstElementChild.replaceChildren(occupant ? pieceNodes.get(occupant) : emptyButtons.get(targetId));
      slot.classList.toggle('is-filled', Boolean(occupant));
    });
    trayDock.replaceChildren(...pieces.filter(({ id }) => !placement.get(id)).map(({ id }) => pieceNodes.get(id)));
    updateLabels();
  }

  /**
   * Reorganiza e faz cada peça que mudou de lugar deslizar da posição antiga
   * até a nova. `from` permite dizer de onde uma peça "vem" (ex.: do dedo).
   */
  function layoutWithMotion(from = new Map()) {
    const before = new Map([...pieceNodes].map(([id, node]) => [id, from.get(id) ?? node.getBoundingClientRect()]));
    layout();
    pieceNodes.forEach((node, id) => {
      const start = before.get(id);
      const end = node.getBoundingClientRect();
      if (!start.width || !end.width) return;
      const dx = start.left - end.left;
      const dy = start.top - end.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      node.classList.add('is-moving');
      node.style.transition = 'none';
      node.style.transform = `translate(${dx}px, ${dy}px)`;
      node.getBoundingClientRect(); // aplica a posição de partida antes de animar
      node.style.transition = '';
      node.style.transform = '';
      const done = () => node.classList.remove('is-moving');
      node.addEventListener('transitionend', done, { once: true });
      window.setTimeout(done, 400); // caso a transição esteja desligada (Reduzir animações)
    });
  }

  const toObject = () => Object.fromEntries(placement);

  /**
   * Move a peça. `fromRect` = de onde a peça parte visualmente (posição do dedo ao soltar).
   * Num lugar que não aceita a peça, ela volta (deslizando) para onde estava.
   */
  function place(pieceId, targetId, fromRect) {
    const motionFrom = fromRect ? new Map([[pieceId, fromRect]]) : new Map();
    selected = null;
    if (targetId && !accepts(pieceId, targetId)) {
      layoutWithMotion(motionFrom);
      say(fill(texts.rejected, labelOf(pieceId, targetId)));
      onReject?.(pieceId, targetId);
      return;
    }
    const origin = placement.get(pieceId);
    const next = new Map(placement);
    if (targetId) {
      const occupant = [...placement].find(([id, t]) => t === targetId && id !== pieceId)?.[0];
      if (occupant) next.set(occupant, origin); // troca de lugar
    }
    next.set(pieceId, targetId);
    placement = next;
    layoutWithMotion(motionFrom);
    pieceNodes.get(pieceId).focus({ preventScroll: true });
    say(fill(targetId ? texts.placed : texts.returned, labelOf(pieceId, targetId)));
    onPlace?.(toObject(), { pieceId, targetId });
  }

  function onPieceClick(pieceId, event) {
    if (suppressClick) { suppressClick = false; return; }
    // Toque/clique de ponteiro com tapToPlace desligado: orienta a arrastar.
    // (event.detail === 0 é ativação por teclado, que sempre funciona.)
    if (!tapToPlace && event.detail > 0) {
      say(texts.tapHint);
      return;
    }
    if (selected === pieceId) {
      selected = null;
    } else if (selected && placement.get(pieceId)) {
      place(selected, placement.get(pieceId));
      return;
    } else {
      selected = pieceId;
      say(fill(texts.chosen, labelOf(pieceId)));
    }
    updateLabels();
  }

  // ---------- Arrastar e soltar ----------
  function enableDrag(node, pieceId) {
    node.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      // Evita seleção de texto/imagem e o arrasto nativo do navegador.
      // O clique continua acontecendo (é ele que trata o toque simples).
      event.preventDefault();
      const { pointerId } = event;
      const start = { x: event.clientX, y: event.clientY };
      let pointer = { ...start };
      let ghost = null;
      let grab = null; // onde o dedo segurou a peça (para ela não "pular")
      let scrollFrame = 0;
      const root = document.documentElement;
      const previousAnchor = root.style.overflowAnchor;

      const zoneAt = (x, y) => document.elementFromPoint(x, y)?.closest('.placement-slot, .placement-tray');
      const highlight = () => {
        const zone = zoneAt(pointer.x, pointer.y);
        zones.forEach((area) => area.classList.toggle('is-over', area === zone));
      };
      const moveGhost = () => {
        ghost.style.transform = `translate3d(${pointer.x - grab.x}px, ${pointer.y - grab.y}px, 0)`;
      };

      function lift() {
        const rect = node.getBoundingClientRect();
        grab = { x: start.x - rect.left, y: start.y - rect.top };
        ghost = node.cloneNode(true);
        ghost.className = 'placement-piece placement-piece--ghost';
        ghost.removeAttribute('aria-pressed');
        ghost.setAttribute('aria-hidden', 'true');
        // A cópia fica fora da caixa/lugar, então não recebe os estilos de lá:
        // copia as medidas reais para ela ser idêntica à peça segurada.
        const look = getComputedStyle(node);
        const imageRect = node.querySelector('img').getBoundingClientRect();
        Object.assign(ghost.style, {
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          minWidth: '0',
          minHeight: '0',
          padding: look.padding,
          fontSize: look.fontSize,
          borderWidth: look.borderWidth,
          backgroundColor: look.backgroundColor === 'rgba(0, 0, 0, 0)' ? '' : look.backgroundColor,
        });
        Object.assign(ghost.querySelector('img').style, { width: `${imageRect.width}px`, height: `${imageRect.height}px` });
        // Dentro da tela do módulo, para herdar as cores dele (--module-*).
        (node.closest('[data-module]') ?? document.body).append(ghost);
        node.classList.add('is-lifted');
        root.style.overflowAnchor = 'none'; // a página não "pula" enquanto as peças mudam
        root.classList.add('is-dragging-piece');
        selected = pieceId;
        updateLabels();
        moveGhost();
        autoScroll();
      }

      // Rola a página quando o dedo está perto da borda (lugares fora da tela).
      function autoScroll() {
        const step = pointer.y < EDGE_SCROLL_ZONE ? -EDGE_SCROLL_STEP
          : pointer.y > window.innerHeight - EDGE_SCROLL_ZONE ? EDGE_SCROLL_STEP : 0;
        if (step) {
          window.scrollBy(0, step);
          highlight();
        }
        scrollFrame = window.requestAnimationFrame(autoScroll);
      }

      const onMove = (moveEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        pointer = { x: moveEvent.clientX, y: moveEvent.clientY };
        if (!ghost) {
          if (Math.hypot(pointer.x - start.x, pointer.y - start.y) < DRAG_THRESHOLD) return;
          lift();
        }
        moveEvent.preventDefault();
        moveGhost();
        highlight();
      };

      const onEnd = (endEvent) => {
        if (endEvent.pointerId !== pointerId) return;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onEnd);
        window.removeEventListener('pointercancel', onEnd);
        if (!ghost) return; // foi só um toque: o "click" cuida
        window.cancelAnimationFrame(scrollFrame);
        const zone = endEvent.type === 'pointerup' ? zoneAt(endEvent.clientX, endEvent.clientY) : null;
        const dropRect = ghost.getBoundingClientRect();
        ghost.remove();
        node.classList.remove('is-lifted');
        root.classList.remove('is-dragging-piece');
        root.style.overflowAnchor = previousAnchor;
        zones.forEach((area) => area.classList.remove('is-over'));
        suppressClick = true; // o "click" que pode vir depois do arrasto não deve escolher a peça
        window.setTimeout(() => { suppressClick = false; }, 0);

        if (zone?.classList.contains('placement-slot')) {
          place(pieceId, zone.dataset.target, dropRect);
        } else if (zone && placement.get(pieceId)) {
          place(pieceId, null, dropRect); // soltou na caixa: tira do lugar
        } else {
          selected = null;
          layoutWithMotion(new Map([[pieceId, dropRect]])); // volta deslizando
          if (!zone) say(fill(texts.outside, labelOf(pieceId)));
        }
      };

      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onEnd);
      window.addEventListener('pointercancel', onEnd);
    });
  }

  layout();

  return {
    tray,
    /** Mensagens curtas (anunciadas). Fica na caixa; o módulo pode movê-la. */
    status,
    slots,
    say,
    getPlacement: toObject,
    /** Muda as posições (Desfazer/Recomeçar) com o mesmo deslocamento suave, sem chamar onPlace. */
    setPlacement(next) {
      placement = new Map(pieces.map(({ id }) => [id, next[id] ?? null]));
      selected = null;
      layoutWithMotion();
    },
  };
}
