/**
 * Teclado do jogo.
 *
 * - Setas ou W A S D: Noa anda enquanto a tecla está apertada. Funcionam com o
 *   mapa na tela, sem precisar clicar nele antes, e não rolam a página.
 * - Enter ou Espaço: usam o que está perto, quando o foco está no mapa (ou em
 *   lugar nenhum). Em botões e links, continuam fazendo o que fazem sempre.
 * - Nada disso vale com uma janela aberta (Ajuda, Configurações), dentro de um
 *   campo de texto ou quando `isActive()` diz que o mapa não está em uso.
 */

const KEYS = Object.freeze({
  ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
  a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1],
});

/** O teclado pertence a outra coisa: janela aberta ou campo de texto. */
function isBusyTarget(target) {
  if (document.querySelector('dialog[open]')) return true;
  return target instanceof HTMLElement
    && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
}

/**
 * @param {HTMLElement} surface  elemento focável do palco
 * @param {{ onDirection: (x: number, y: number) => void, onUse: () => void, isActive: () => boolean }} handlers
 * @returns {() => void} desliga o teclado
 */
export function bindWorldKeys(surface, { onDirection, onUse, isActive }) {
  const pressed = new Set();
  const keyOf = (event) => (KEYS[event.key] ? event.key : event.key.toLowerCase());

  const update = () => {
    const [x, y] = [...pressed].reduce(([sumX, sumY], key) => [sumX + KEYS[key][0], sumY + KEYS[key][1]], [0, 0]);
    onDirection(Math.sign(x), Math.sign(y));
  };
  const release = () => {
    if (!pressed.size) return;
    pressed.clear();
    update();
  };

  const onKeyDown = (event) => {
    if (event.ctrlKey || event.altKey || event.metaKey || !isActive() || isBusyTarget(event.target)) return;
    const key = keyOf(event);
    if (KEYS[key]) {
      event.preventDefault();
      if (!pressed.has(key)) { pressed.add(key); update(); }
      return;
    }
    const onMap = event.target === surface || event.target === document.body;
    if ((event.key === 'Enter' || event.key === ' ') && onMap) {
      event.preventDefault();
      if (!event.repeat) onUse();
    }
  };
  const onKeyUp = (event) => {
    if (pressed.delete(keyOf(event))) update();
  };
  // Clicar ou tocar no mapa dá foco a ele (o Phaser impede o foco automático).
  const onPointerDown = () => surface.focus({ preventScroll: true });

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', release);
  surface.addEventListener('pointerdown', onPointerDown);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', release);
    surface.removeEventListener('pointerdown', onPointerDown);
  };
}
