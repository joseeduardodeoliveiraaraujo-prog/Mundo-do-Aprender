/**
 * Catálogo do módulo "Eu Me Comunico" (somente dados): personagens, cenários,
 * cartões de comunicação e partes. Caminhos relativos ao index.html.
 *
 * Reaproveita imagens de outros módulos (rostos, pictogramas e poses de Noa).
 */

const IMG = 'assets/images/communication';
const pic = (name) => `${IMG}/cards/${name}.svg`;
const routinePic = (name) => `assets/images/routine/${name}.svg`;
const face = (name) => `assets/images/emotions/faces/${name}.svg`;
const person = (id) => ({ neutral: `${IMG}/people/${id}-neutral.svg`, happy: `${IMG}/people/${id}-happy.svg` });
export const layer = (name) => `${IMG}/layers/${name}.svg`;

/** Noa é a mesma personagem de Minha Rotina. As outras pessoas respondem a Noa. */
export const people = Object.freeze({
  noa: {
    name: 'Noa',
    poses: {
      neutral: routinePic('noa/neutral'),
      happy: routinePic('noa/happy'),
      thinking: routinePic('noa/thinking'),
      worried: `${IMG}/people/noa-worried.svg`,
    },
  },
  gabi: { name: 'Gabi', poses: person('gabi') },
  lia: { name: 'Lia', poses: person('lia') },
  teo: { name: 'Téo', poses: person('teo') },
});

const scene = (name, alt) => ({ src: `${IMG}/scenes/${name}.svg`, alt, width: 480, height: 300 });

export const scenes = Object.freeze({
  kitchen: scene('kitchen', 'Cozinha com uma mesa no meio.'),
  livingRoom: scene('living-room', 'Sala com um sofá.'),
  classroom: scene('classroom', 'Sala de aula com lousa e uma mesa.'),
  playground: scene('playground', 'Parquinho com balanço e grama.'),
});

/** Cartões de comunicação. Há cartões de fala e de gesto: todos valem. */
export const cards = Object.freeze({
  // Pedidos
  water: { label: 'Quero água', image: pic('water') },
  help: { label: 'Me ajuda?', image: routinePic('ask') },
  needPencil: { label: 'Preciso de um lápis', image: routinePic('pencil') },
  needBreak: { label: 'Preciso de uma pausa', image: pic('pause') },
  canPlay: { label: 'Posso brincar?', image: routinePic('play') },
  // Gestos e ações
  point: { label: 'Apontar', image: pic('point') },
  pointBottle: { label: 'Apontar para a garrafa', image: pic('point') },
  showJar: { label: 'Mostrar o pote', image: pic('jar') },
  showBall: { label: 'Mostrar a bola', image: pic('ball') },
  raiseHand: { label: 'Levantar a mão', image: pic('raise-hand') },
  coverEars: { label: 'Cobrir os ouvidos', image: pic('cover-ears') },
  wave: { label: 'Acenar', image: pic('wave') },
  smile: { label: 'Sorrir', image: face('happiness') },
  callAdult: { label: 'Chamar um adulto', image: pic('call-adult') },
  push: { label: 'Empurrar', image: pic('push') },
  // Conversa
  hello: { label: 'Oi!', image: pic('hello') },
  bye: { label: 'Tchau', image: pic('wave') },
  yes: { label: 'Sim', image: pic('yes') },
  notNow: { label: 'Agora não', image: pic('stop') },
  later: { label: 'Depois', image: routinePic('hourglass') },
  wentWell: { label: 'Foi bom', image: face('happiness') },
  wasHard: { label: 'Foi difícil', image: face('sadness') },
  rest: { label: 'Descansar', image: routinePic('rest') },
  playNow: { label: 'Brincar', image: routinePic('play') },
  eat: { label: 'Comer um lanche', image: routinePic('snack') },
  // Cartões que não combinam com a situação
  wantSleep: { label: 'Quero dormir', image: routinePic('sleep') },
  wantPlay: { label: 'Quero brincar', image: routinePic('play') },
  wantSnack: { label: 'Quero lanche', image: routinePic('snack') },
  // Peças para montar frases
  iWant: { label: 'Eu quero', image: pic('want') },
  iDontWant: { label: 'Eu não quero', image: pic('stop') },
  apple: { label: 'Maçã', image: pic('apple') },
  bread: { label: 'Pão', image: pic('bread') },
  banana: { label: 'Banana', image: pic('banana') },
  ball: { label: 'Bola', image: pic('ball') },
  drawing: { label: 'Desenho', image: routinePic('colored-pencils') },
  puzzle: { label: 'Quebra-cabeça', image: pic('puzzle') },
  joy: { label: 'Alegria', image: face('happiness') },
  sadness: { label: 'Tristeza', image: face('sadness') },
  anger: { label: 'Raiva', image: face('anger') },
  fear: { label: 'Medo', image: face('fear') },
  hug: { label: 'Um abraço', image: pic('hug') },
  silence: { label: 'Silêncio', image: pic('quiet') },
  someHelp: { label: 'Ajuda', image: routinePic('ask') },
});

/** Imagens das situações nas atividades de associação. */
export const situationImages = Object.freeze({
  board: routinePic('board'),
  friend: `${IMG}/people/teo-happy.svg`,
  far: routinePic('water-bottle'),
  noise: pic('noise'),
  hurt: pic('hurt'),
  notNow: routinePic('rest'),
});

/** Terminar todas as atividades de uma parte dá a figurinha. */
export const parts = Object.freeze([
  { id: 'home', title: 'Em casa', description: 'Pedir o que precisa e fazer escolhas.', sticker: { label: 'Sei pedir', image: pic('water') } },
  { id: 'school', title: 'Na escola', description: 'Cumprimentar e chamar a professora.', sticker: { label: 'Sei levantar a mão', image: pic('raise-hand') } },
  { id: 'play', title: 'Brincando', description: 'Entrar na brincadeira e combinar.', sticker: { label: 'Sei brincar junto', image: pic('ball') } },
  { id: 'feelings', title: 'O que eu sinto', description: 'Contar o que sente e dizer "não".', sticker: { label: 'Sei contar o que sinto', image: pic('hug') } },
]);
