/**
 * Cena em camadas: uma imagem de fundo e imagens do mesmo tamanho por cima.
 * Mostrar ou esconder uma camada faz a troca suave (opacidade, no CSS) e é o
 * que dá a sensação de que a cena responde à criança.
 */

import { el } from './dom.js';

/**
 * @param {{ src: string, alt: string, width: number, height: number }} scene
 * @param {ReadonlyArray<string>} sources  camadas, de baixo para cima
 * @returns {{ element: HTMLElement, toggle: (src: string, visible: boolean) => void }}
 */
export function createSceneLayers(scene, sources) {
  const layers = new Map(sources.map((src) => [src, el('img', {
    className: 'scene-layers__layer',
    attrs: { src, alt: '', width: scene.width, height: scene.height, draggable: 'false' },
  })]));

  return {
    element: el('div', { className: 'scene-layers' }, [
      el('img', { className: 'scene-layers__base', attrs: { src: scene.src, alt: scene.alt, width: scene.width, height: scene.height, draggable: 'false' } }),
      ...layers.values(),
    ]),
    toggle(src, visible) {
      layers.get(src).classList.toggle('is-visible', visible);
    },
  };
}
