/**
 * Cena de perto do quadro da rotina: um quadro de cortiça com casas numeradas
 * e os cartões do dia numa prateleira. A criança arrasta cada cartão até o
 * quadro; ele vai para a próxima casa livre e fica preso. Serve para as
 * atividades de ordenar o dia (tipo `sequence`), com 4 a 6 cartões.
 *
 * Esta cena tem o dobro da resolução (384×256) para os pictogramas ficarem
 * nítidos. Formato geral descrito em ./sink.js.
 */

export const boardCloseup = Object.freeze({
  id: 'board',
  folder: 'assets/images/world/closeup/board',
  images: ['background', 'board', 'slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5', 'slot-6'],
  width: 384,
  height: 256,
  label: 'O quadro da rotina na parede, com casas numeradas, e os cartões do dia numa prateleira.',
  pieces: [{ id: 'board', image: 'board', x: 12, y: 12, label: 'Quadro da rotina' }],
  /** Pictograma dentro do cartão (px). */
  pictureSize: 40,
  /** Casas do quadro (canto de cima), pelo número de cartões. */
  slots: {
    4: [52, 128, 204, 280].map((x) => ({ x, y: 50 })),
    5: [38, 102, 166, 230, 294].map((x) => ({ x, y: 50 })),
    6: [26, 82, 138, 194, 250, 306].map((x) => ({ x, y: 50 })),
  },
  /** Cartões na prateleira, pelo número de cartões. */
  tray: {
    4: [51, 129, 207, 285].map((x) => ({ x, y: 172 })),
    5: [32, 100, 168, 236, 304].map((x) => ({ x, y: 172 })),
    6: [18, 78, 138, 198, 258, 318].map((x) => ({ x, y: 172 })),
  },
  /** Distância do canto da casa até o canto do cartão. */
  inset: 2,
  how: 'Arraste o cartão até o quadro.',
});
