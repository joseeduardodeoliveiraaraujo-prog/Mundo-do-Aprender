/**
 * Cena de perto da mochila aberta em cima da mesa (pixels 2x), para as
 * atividades de arrumar a mochila. Os objetos mudam a cada atividade: o
 * tradutor (js/games/world/quest/adapters/routine.js) põe cada um num
 * lugar de `itemSpots`. Formato descrito em ./sink.js.
 */

export const backpackCloseup = Object.freeze({
  id: 'backpack',
  folder: 'assets/images/world/closeup/backpack',
  images: [
    'background', 'bag', 'notebook', 'pillow', 'colored-pencils', 'water-bottle', 'videogame', 'pencil', 'cap',
    'sneakers', 'towel',
  ],
  label: 'A mochila do Noa aberta em cima da mesa, com objetos em volta.',
  pieces: [{ id: 'bag', image: 'bag', x: 80, y: 48, label: 'Mochila' }],
  /** Imagem de cada objeto do catálogo da rotina (js/data/routine/catalog.js). */
  itemImages: {
    notebook: 'notebook', pillow: 'pillow', coloredPencils: 'colored-pencils', waterBottle: 'water-bottle',
    videogame: 'videogame', pencil: 'pencil', cap: 'cap', sneakers: 'sneakers', towel: 'towel',
  },
  itemSpots: [{ x: 12, y: 52 }, { x: 48, y: 52 }, { x: 12, y: 88 }, { x: 48, y: 88 }, { x: 156, y: 52 }, { x: 156, y: 88 }],
  /** Onde o objeto entra (canto de cima da imagem do objeto, 32×32). */
  bagMouth: { x: 96, y: 52 },
  how: 'Arraste até a mochila.',
});
