/**
 * Catálogo de tiles do Bairro do Noa (somente dados).
 *
 * Folhas em assets/images/world/ (origem e licença em CREDITS.md da pasta).
 * Cada tile tem um nome e aponta para [folha, número do quadro]; os mapas em
 * js/data/world/maps/ usam só os nomes, nunca os números.
 */

export const TILE_SIZE = 16;

export const TILESETS = Object.freeze({
  town: 'assets/images/world/town.png',
  dungeon: 'assets/images/world/dungeon.png',
  home: 'assets/images/world/home.png',
});

export const TILES = Object.freeze({
  // Interior: paredes, pisos e portas
  void: ['home', 11],
  woodWall: ['town', 73],
  woodWindow: ['town', 84],
  woodDoor: ['town', 86],
  floor: ['dungeon', 48],
  floorDots: ['dungeon', 49],
  bathFloor: ['home', 21],
  rug: ['home', 22],
  // Interior: móveis e objetos
  bedTop: ['home', 6],
  bedBottom: ['home', 7],
  nightstandRinging: ['home', 8],
  nightstandQuiet: ['home', 9],
  toys: ['home', 10],
  sink: ['home', 14],
  fridge: ['home', 15],
  sofa: ['home', 16],
  cat: ['home', 17],
  tv: ['home', 18],
  drawers: ['dungeon', 63],
  shelf: ['dungeon', 75],
  table: ['dungeon', 72],
  stool: ['dungeon', 73],
  chest: ['dungeon', 89],
  backpack: ['town', 107],
  // Marcadores de desafio (acima do lugar)
  markTodo: ['home', 12],
  markDone: ['home', 13],
  // Exterior: chão
  grass: ['town', 0],
  grassTufts: ['town', 1],
  grassFlowers: ['town', 2],
  path: ['town', 25],
  plaza: ['town', 109],
  stones: ['town', 43],
  water: ['home', 19],
  // Exterior: natureza e objetos
  tree: ['town', 16],
  pine: ['town', 28],
  bush: ['town', 5],
  sign: ['town', 83],
  bench: ['home', 20],
  beehive: ['town', 94],
  // Exterior: casa de telhado vermelho
  roofRedTopLeft: ['town', 52],
  roofRedTop: ['town', 53],
  roofRedTopRight: ['town', 54],
  roofRedLeft: ['town', 64],
  roofRed: ['town', 65],
  roofRedRight: ['town', 66],
  houseWall: ['town', 72],
  houseDoor: ['town', 86],
  houseWindow: ['town', 84],
  // Exterior: escola (telhado cinza, parede de pedra)
  roofGreyTopLeft: ['town', 48],
  roofGreyTop: ['town', 49],
  roofGreyTopRight: ['town', 50],
  roofGreyLeft: ['town', 60],
  roofGrey: ['town', 61],
  roofGreyRight: ['town', 62],
  stoneWall: ['town', 76],
  stoneDoor: ['town', 90],
  stoneWindow: ['town', 88],
  // Exterior: cerca
  fenceTopLeft: ['town', 44],
  fenceTop: ['town', 45],
  fenceTopRight: ['town', 46],
  fenceLeft: ['town', 56],
  fenceRight: ['town', 58],
  fenceBottomLeft: ['town', 68],
  fenceBottom: ['town', 69],
  fenceBottomRight: ['town', 70],
  // Animais (desenhados para o projeto; dados em js/data/animals/catalog.js)
  cow: ['home', 23],
  horse: ['home', 24],
  chicken: ['home', 25],
  duck: ['home', 26],
  lion: ['home', 27],
  elephant: ['home', 28],
  giraffe: ['home', 29],
  turtle: ['home', 30],
  monkey: ['home', 31],
  fish: ['home', 32],
  dog: ['home', 33],
  // Pessoas (Tiny Dungeon)
  personGirl: ['dungeon', 99],
  personBoy: ['dungeon', 88],
  personFarmer: ['dungeon', 98],
  personKeeper: ['dungeon', 85],
  personTeacher: ['dungeon', 100],
  personFriend: ['dungeon', 112],
  personKid: ['dungeon', 86],
});
