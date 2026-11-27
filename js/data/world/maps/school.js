/**
 * Sala de aula da escola do Noa (entrada pela porta da escola, no bairro).
 * Somente dados. Formato dos mapas: ver js/data/world/world.js.
 */

export const schoolMap = Object.freeze({
  id: 'school',
  name: 'Escola do Noa',
  welcome: 'Esta é a minha sala de aula. A professora está perto do quadro.',
  ground: [
    'WWJWWW[==]WWWJWW',
    '................',
    '................',
    '................',
    '..,.........,...',
    '................',
    '.....,..........',
    '................',
    '..........,.....',
    'XXXXXXXXEXXXXXXX',
  ],
  legend: {
    W: { tile: 'woodWall', solid: true },
    J: { tile: 'woodWindow', solid: true },
    X: { tile: 'void', solid: true },
    E: { tile: 'woodDoor' },
    '[': { tile: 'boardLeft', solid: true },
    '=': { tile: 'boardMiddle', solid: true },
    ']': { tile: 'boardRight', solid: true },
    '.': { tile: 'floor' },
    ',': { tile: 'floorDots' },
  },
  furniture: [
    { tile: 'drawers', x: 0, y: 1 },
    { tile: 'plant', x: 15, y: 1 },
    { tile: 'table', x: 3, y: 4 }, { tile: 'stool', x: 3, y: 5 },
    { tile: 'table', x: 5, y: 4 }, { tile: 'stool', x: 5, y: 5 },
    { tile: 'table', x: 10, y: 4 }, { tile: 'stool', x: 10, y: 5 },
    { tile: 'table', x: 12, y: 4 }, { tile: 'stool', x: 12, y: 5 },
    { tile: 'table', x: 3, y: 7 }, { tile: 'stool', x: 3, y: 8 },
    { tile: 'table', x: 12, y: 7 }, { tile: 'stool', x: 12, y: 8 },
  ],
  doors: [
    { x: 8, y: 9, to: 'neighborhood', spawn: { x: 23, y: 5 }, facing: 'down', label: 'Sair para o bairro' },
  ],
  spots: [
    {
      id: 'school-teacher',
      label: 'Professora Ana',
      tiles: [{ tile: 'personTeacher', x: 8, y: 2 }],
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
      tiles: [{ tile: 'personKid', x: 10, y: 6 }],
      prompt: 'Oi, Noa! Eu sou o Teo. Eu gosto de desenhar carros.',
    },
    {
      id: 'school-classmate-gabi',
      label: 'Colega Gabi',
      tiles: [{ tile: 'personGirl', x: 5, y: 6 }],
      prompt: 'Oi, Noa! Eu sou a Gabi. Hoje eu trouxe lápis de cor.',
    },
    {
      id: 'school-drawers',
      label: 'Armário da turma',
      cells: [{ x: 0, y: 1 }],
      prompt: 'Aqui ficam os cadernos e os lápis da turma.',
    },
  ],
});
