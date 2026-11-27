/**
 * Teclado do jogo (com o palco focado): setas ou W A S D andam enquanto estão
 * apertadas; Enter ou Espaço usam o que está perto.
 */

const KEYS = Object.freeze({
  ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
  a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1],
});

/**
 * @param {HTMLElement} surface  elemento focável do palco
 * @param {{ onDirection: (x: number, y: number) => void, onUse: () => void }} handlers
 * @returns {() => void} desliga o teclado
 */
export function bindWorldKeys(surface, { onDirection, onUse }) {
  const pressed = new Set();
  const keyOf = (event) => (KEYS[event.key] ? event.key : event.key.toLowerCase());

  const update = () => {
    const [x, y] = [...pressed].reduce(([sumX, sumY], key) => [sumX + KEYS[key][0], sumY + KEYS[key][1]], [0, 0]);
    onDirection(Math.sign(x), Math.sign(y));
  };

  const onKeyDown = (event) => {
    const key = keyOf(event);
    if (KEYS[key]) {
      event.preventDefault();
      pressed.add(key);
      update();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!event.repeat) onUse();
    }
  };
  const onKeyUp = (event) => {
    if (pressed.delete(keyOf(event))) update();
  };
  const onBlur = () => {
    pressed.clear();
    update();
  };

  surface.addEventListener('keydown', onKeyDown);
  surface.addEventListener('keyup', onKeyUp);
  surface.addEventListener('blur', onBlur);
  return () => {
    surface.removeEventListener('keydown', onKeyDown);
    surface.removeEventListener('keyup', onKeyUp);
    surface.removeEventListener('blur', onBlur);
  };
}
