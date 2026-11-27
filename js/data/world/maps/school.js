/**
 * Sala de aula da escola do Noa (entrada pela porta da escola, no bairro).
 * Somente dados. Formato dos mapas: ver js/data/world/world.js.
 * Gerado a partir de um rascunho; pode ser editado à mão.
 */

export const schoolMap = Object.freeze({
  id: 'school',
  name: 'Escola do Noa',
  background: '#5c4452',
  welcome: 'Esta é a minha sala de aula. A professora está perto do quadro.',
  ground: [
    '##w###LMMR###w##',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '########E#######',
  ],
  legend: {
    "#": { room: true, solid: true },
    w: { room: true, solid: true, tile: 'roomWindow' },
    E: { room: true, tile: 'door' },
    ".": { floor: 'floorSchool' },
    _: { floor: 'bathFloor' },
    k: { floor: 'floorKitchen' },
    L: { room: true, solid: true, tile: 'boardLeft' },
    M: { room: true, solid: true, tile: 'boardMiddle' },
    R: { room: true, solid: true, tile: 'boardRight' },
  },
  objects: [
    { art: 'plantPot', x: 14, y: 1 },
    { art: 'painting1', x: 11, y: 0, solid: 'none' },
    { art: 'table', x: 3, y: 4 },
    { art: 'chairBack', x: 3, y: 5 },
    { art: 'table', x: 5, y: 4 },
    { art: 'table', x: 10, y: 4 },
    { art: 'table', x: 12, y: 4 },
    { art: 'chairBack', x: 12, y: 5 },
    { art: 'table', x: 3, y: 7 },
    { art: 'chairBack', x: 3, y: 8 },
    { art: 'table', x: 12, y: 7 },
    { art: 'chairBack', x: 12, y: 8 },
    { art: 'rugWideGreen', x: 7, y: 3, solid: 'none' },
    { art: 'lampPink', x: 1, y: 8 },
  ],
  doors: [
    {
      x: 8,
      y: 9,
      to: 'neighborhood',
      spawn: { x: 27, y: 7 },
      facing: 'down',
      label: 'Sair para o bairro',
    },
  ],
  spots: [
    {
      id: 'school-teacher',
      label: 'Professora Ana',
      art: 'personTeacher',
      x: 8,
      y: 2,
      prompt: 'Bom dia! Eu sou a professora Ana. Vamos treinar como falar na sala de aula?',
      challenge: { module: 'communication', part: 'school' },
    },
    {
      id: 'school-board',
      label: 'Quadro',
      cells: [{ x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }],
      prompt: 'No quadro está escrito: hoje tem aula de desenho.',
    },
    {
      id: 'school-classmate',
      label: 'Colega Teo',
      art: 'personTeo',
      x: 10,
      y: 5,
      prompt: 'Oi, Noa! Eu sou o Teo. Eu gosto de desenhar carros.',
    },
    {
      id: 'school-drawers',
      label: 'Armário da turma',
      art: 'drawers',
      x: 1,
      y: 1,
      prompt: 'Aqui ficam os cadernos e os lápis da turma.',
    },
  ],
});
