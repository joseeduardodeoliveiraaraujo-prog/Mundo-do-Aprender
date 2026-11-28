/**
 * Casa da Lia, a vizinha (entrada pela porta da casa ao lado da casa do Noa).
 * Somente dados. Formato dos mapas: ver js/data/world/world.js.
 * Gerado a partir de um rascunho; pode ser editado à mão.
 */

export const neighborMap = Object.freeze({
  id: 'neighbor',
  name: 'Casa da Lia',
  background: '#5c4452',
  welcome: 'Esta é a casa da Lia, a minha vizinha. A Lia está na sala.',
  ground: [
    '###w####w###',
    '#......kkkk#',
    '#......kkkk#',
    '#......kkkk#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '######E#####',
  ],
  legend: {
    "#": { room: true, solid: true },
    w: { room: true, solid: true, tile: 'roomWindow' },
    E: { room: true, tile: 'door' },
    ".": { floor: 'floorWood' },
    _: { floor: 'bathFloor' },
    k: { floor: 'floorKitchen' },
  },
  objects: [
    { art: 'painting2', x: 1, y: 0, solid: 'none' },
    { art: 'wallShelf', x: 5, y: 0, solid: 'none' },
    { art: 'wallClock', x: 10, y: 0, solid: 'none' },
    { art: 'plantPot', x: 4, y: 1 },
    { art: 'kitchenCounter', x: 7, y: 1 },
    { art: 'stove', x: 8, y: 1 },
    { art: 'kitchenCounter', x: 9, y: 1 },
    { art: 'fridge', x: 10, y: 1 },
    { art: 'chairLeft', x: 7, y: 4 },
    { art: 'table', x: 8, y: 4 },
    { art: 'chairRight', x: 9, y: 4 },
    { art: 'rugWidePink', x: 2, y: 4, solid: 'none' },
    { art: 'armchair', x: 1, y: 5 },
    { art: 'sofa', x: 3, y: 6 },
    { art: 'lampGreen', x: 5, y: 6 },
    { art: 'tv', x: 3, y: 3 },
    { art: 'drawers', x: 10, y: 5 },
    { art: 'plantSmall', x: 10, y: 7 },
    { art: 'rugGreen', x: 8, y: 6, solid: 'none' },
  ],
  doors: [
    {
      x: 6,
      y: 8,
      to: 'neighborhood',
      spawn: { x: 11, y: 7 },
      facing: 'down',
      label: 'Sair para o bairro',
    },
  ],
  spots: [
    {
      id: 'hood-neighbor',
      label: 'Vizinha Lia',
      art: 'personLia',
      x: 6,
      y: 4,
      prompt: 'Oi, eu sou a Lia. Que bom que você veio! Você consegue ver o que o meu rosto mostra?',
      challenge: { module: 'emotions', part: 'recognize' },
    },
    {
      id: 'neighbor-aquarium',
      label: 'Aquário',
      art: 'aquarium',
      x: 2,
      y: 1,
      prompt: 'O aquário da Lia. O peixinho nada devagar.',
    },
    {
      id: 'neighbor-books',
      label: 'Estante',
      art: 'bookshelf',
      x: 1,
      y: 1,
      prompt: 'A estante da Lia. Ela gosta de livros de bichos.',
    },
  ],
});
