/**
 * Visão da lupa: um círculo que mostra, ampliada, uma parte da cena.
 *
 * Não cria uma imagem nova: usa a própria ilustração da cena, maior e
 * deslocada dentro de um círculo com overflow escondido. Sem animação.
 */

import { el } from '../../components/dom.js';

const MARGIN = 0.85; // a área ocupa 85% do círculo, para sobrar um respiro em volta

/**
 * @param {Object} options
 * @param {string} options.src     ilustração da cena
 * @param {{ x: number, y: number, w: number, h: number }} options.area  em % da cena
 * @param {number} options.ratio   altura / largura da cena
 * @param {string} [options.className]
 * @returns {HTMLElement}
 */
export function createClueZoom({ src, area, ratio, className = '' }) {
  // Tudo em frações da LARGURA da cena (o círculo é quadrado).
  const width = area.w / 100;
  const height = (area.h / 100) * ratio;
  const scale = Math.max(width, height) / MARGIN; // fração da cena que cabe no círculo
  const centerX = (area.x + area.w / 2) / 100;
  const centerY = ((area.y + area.h / 2) / 100) * ratio;

  const image = el('img', { className: 'clue-zoom__image', attrs: { src, alt: '', draggable: 'false' } });
  image.style.width = `${100 / scale}%`;
  image.style.left = `${50 - (100 * centerX) / scale}%`;
  image.style.top = `${50 - (100 * centerY) / scale}%`;

  return el('span', { className: `clue-zoom ${className}`.trim(), attrs: { 'aria-hidden': 'true' } }, [image]);
}
