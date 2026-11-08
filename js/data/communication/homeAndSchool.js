/** Atividades das partes "Em casa" e "Na escola". Tipos descritos em activities.js. */

import { layer, situationImages } from './catalog.js';

const DRAG = 'Arraste um cartão até o balão de Noa.';
const TAP = 'Toque em um cartão para Noa responder.';
const BUILD = 'Arraste as peças para montar a frase.';

export const homeAndSchool = [
  // ---------- Em casa ----------
  {
    id: 'communication-home-thirst',
    type: 'talkCard',
    part: 'home',
    prize: 'water',
    title: 'Noa está com sede',
    instruction: DRAG,
    greeting: 'Estou com sede. Como eu mostro isso para Gabi?',
    mood: 'worried',
    scene: 'kitchen',
    listener: 'gabi',
    after: [layer('glass')],
    options: [
      { card: 'water', fit: 'likely', reply: 'Você quer água. Aqui está o copo.' },
      { card: 'pointBottle', fit: 'possible', reply: 'Você apontou para a garrafa. Entendi! Aqui está a água.' },
      { card: 'wantSleep', fit: 'unlikely', message: 'Esse cartão fala de sono. Eu estou com sede. Vamos tentar outro?' },
    ],
    success: 'Agora tenho água! Um cartão ou um gesto mostram o que eu preciso.',
  },
  {
    id: 'communication-home-jar',
    type: 'talkCard',
    part: 'home',
    prize: 'help',
    title: 'O pote não abre',
    instruction: DRAG,
    greeting: 'Não consigo abrir este pote. Como eu peço ajuda para Gabi?',
    mood: 'worried',
    scene: 'kitchen',
    listener: 'gabi',
    before: [layer('jar-closed')],
    after: [layer('jar-open')],
    options: [
      { card: 'help', fit: 'likely', reply: 'Claro, eu ajudo. Pronto, abri o pote.' },
      { card: 'showJar', fit: 'possible', reply: 'Você me mostrou o pote. Entendi! Pronto, abri.' },
      { card: 'bye', fit: 'unlikely', message: 'Esse cartão serve para se despedir. Eu quero abrir o pote. Vamos tentar outro?' },
    ],
    success: 'O pote abriu! Pedir ajuda é uma boa ideia.',
  },
  {
    id: 'communication-home-snack',
    type: 'sentence',
    part: 'home',
    prize: 'iWant',
    title: 'Hora do lanche',
    instruction: BUILD,
    greeting: 'Gabi perguntou o que eu quero comer. Você me ajuda a responder?',
    scene: 'kitchen',
    listener: 'gabi',
    lines: [[{ slot: 'start', label: 'Começo da frase' }, { slot: 'food', label: 'Comida' }]],
    pieces: [
      { card: 'iWant', group: 'start', reply: 'Entendi: você quer {food}. Aqui está.' },
      { card: 'iDontWant', group: 'start', reply: 'Entendi: você não quer {food}. Tudo bem.' },
      { card: 'apple', group: 'food' },
      { card: 'bread', group: 'food' },
      { card: 'banana', group: 'food' },
    ],
    success: 'Eu posso dizer o que quero e o que não quero.',
  },
  {
    id: 'communication-home-day',
    type: 'dialogue',
    part: 'home',
    prize: 'later',
    title: 'Conversa depois da escola',
    instruction: TAP,
    greeting: 'Gabi quer conversar comigo. O que eu respondo?',
    scene: 'livingRoom',
    listener: 'gabi',
    turns: [
      {
        say: 'Oi, Noa! Como foi a escola?',
        options: [
          { card: 'wentWell', fit: 'likely', reply: 'Que bom! Fico contente.' },
          { card: 'wasHard', fit: 'likely', reply: 'Entendi. Que bom que você me contou.' },
          { card: 'later', fit: 'likely', reply: 'Tudo bem. A gente conversa depois.' },
        ],
      },
      {
        say: 'O que você quer fazer agora?',
        options: [
          { card: 'rest', fit: 'likely', reply: 'Combinado. Pode descansar.' },
          { card: 'playNow', fit: 'likely', reply: 'Combinado. Pode brincar.' },
          { card: 'eat', fit: 'likely', reply: 'Combinado. Vou pegar o lanche.' },
        ],
      },
    ],
    success: 'Você ajudou Noa a contar como foi o dia e a escolher o que fazer.',
  },

  // ---------- Na escola ----------
  {
    id: 'communication-school-hello',
    type: 'dialogue',
    part: 'school',
    prize: 'hello',
    title: 'Encontrei o Téo',
    instruction: TAP,
    greeting: 'Téo chegou na escola. O que eu faço?',
    scene: 'classroom',
    listener: 'teo',
    turns: [
      {
        say: 'Oi, Noa!',
        options: [
          { card: 'hello', fit: 'likely', reply: 'Que bom ver você!' },
          { card: 'wave', fit: 'likely', reply: 'Vi você acenar. Oi!' },
          { card: 'smile', fit: 'likely', reply: 'Vi seu sorriso. Oi!' },
        ],
      },
      {
        say: 'Quer brincar comigo no recreio?',
        options: [
          { card: 'yes', fit: 'likely', reply: 'Legal! Nos vemos no recreio.' },
          { card: 'notNow', fit: 'likely', reply: 'Tudo bem. Fica para outro dia.' },
          { card: 'later', fit: 'likely', reply: 'Combinado. Depois você me fala.' },
        ],
      },
      {
        say: 'Vou para a minha mesa. Tchau!',
        options: [
          { card: 'bye', fit: 'likely', reply: 'Até mais!' },
          { card: 'wave', fit: 'likely', reply: 'Vi você acenar. Até mais!' },
        ],
      },
    ],
    success: 'Noa cumprimentou, respondeu e se despediu. Cada um desses jeitos vale.',
  },
  {
    id: 'communication-school-pencil',
    type: 'talkCard',
    part: 'school',
    prize: 'raiseHand',
    title: 'O lápis quebrou',
    instruction: DRAG,
    greeting: 'A ponta do meu lápis quebrou. Como eu mostro isso para Lia?',
    mood: 'worried',
    scene: 'classroom',
    listener: 'lia',
    before: [layer('pencil-broken')],
    after: [layer('pencil-new')],
    options: [
      { card: 'needPencil', fit: 'likely', reply: 'Aqui está outro lápis.' },
      { card: 'raiseHand', fit: 'likely', reply: 'Vi sua mão levantada. O lápis quebrou? Aqui está outro.' },
      { card: 'wantPlay', fit: 'unlikely', message: 'Esse cartão fala de brincar. Agora eu preciso escrever. Vamos tentar outro?' },
    ],
    success: 'Agora posso escrever! Levantar a mão é um jeito de chamar a professora.',
  },
  {
    id: 'communication-school-noise',
    type: 'talkCard',
    part: 'school',
    prize: 'needBreak',
    title: 'Muito barulho',
    instruction: DRAG,
    greeting: 'Tem muito barulho na sala. Está difícil para mim. O que eu mostro para Lia?',
    mood: 'worried',
    scene: 'classroom',
    listener: 'lia',
    before: [layer('noise')],
    after: [layer('headphones')],
    options: [
      { card: 'needBreak', fit: 'likely', reply: 'Claro. Pode usar os fones e descansar um pouco.' },
      { card: 'coverEars', fit: 'likely', reply: 'Vi você cobrir os ouvidos. O barulho incomoda. Aqui estão os fones.' },
      { card: 'wantSnack', fit: 'unlikely', message: 'Esse cartão fala de comida. O que está difícil agora é o barulho. Vamos tentar outro?' },
    ],
    success: 'Agora ficou melhor. Posso pedir uma pausa quando o barulho incomoda.',
  },
  {
    id: 'communication-school-gestures',
    type: 'match',
    part: 'school',
    prize: 'point',
    title: 'Para que serve cada gesto?',
    instruction: 'Leve cada cartão até a situação em que ele ajuda.',
    greeting: 'Um gesto também comunica. Qual gesto ajuda em cada situação?',
    situations: [
      { id: 'class', label: 'Quero falar na aula', image: situationImages.board },
      { id: 'friend', label: 'Encontrei um amigo', image: situationImages.friend },
      { id: 'far', label: 'Quero mostrar uma coisa longe', image: situationImages.far },
    ],
    items: [
      { card: 'raiseHand', situation: 'class', hint: 'Levantar a mão serve para pedir a vez de falar.' },
      { card: 'wave', situation: 'friend', hint: 'Acenar serve para cumprimentar alguém.' },
      { card: 'point', situation: 'far', hint: 'Apontar serve para mostrar onde uma coisa está.' },
    ],
    success: 'Levantar a mão, acenar e apontar: cada gesto ajuda em um momento.',
  },
];
