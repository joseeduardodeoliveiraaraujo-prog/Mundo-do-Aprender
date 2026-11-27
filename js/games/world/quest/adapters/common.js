/**
 * Partes comuns dos tradutores de atividade → missão: quem fala e o rosto.
 */

const FACES = 'assets/images/world/faces';

export const NOA = Object.freeze({ name: 'Noa', face: `${FACES}/noa.png` });

/** Rosto de uma pessoa do mapa (art "personLia" → faces/personLia.png). */
export const faceOf = (art) => (art?.startsWith('person') ? `${FACES}/${art}.png` : null);

/** Quem fala num lugar: a pessoa do lugar, ou Noa (objetos e animais). */
export function speakerOf(spot) {
  const face = faceOf(spot?.art);
  if (!face) return NOA;
  return { name: spot.name ?? spot.label.split(' ').pop(), face };
}

/** "likely" e "possible" servem; "unlikely" recebe uma pista e a criança tenta de novo. */
export const fits = (fit) => fit !== 'unlikely';
