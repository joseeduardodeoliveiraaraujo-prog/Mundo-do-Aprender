/** Atividades das partes "Brincando" e "O que eu sinto". Tipos descritos em activities.js. */

import { layer, situationImages } from './catalog.js';

export const playAndFeelings = [
  // ---------- Brincando ----------
  {
    id: 'communication-play-join',
    type: 'talkCard',
    part: 'play',
    prize: 'canPlay',
    title: 'Quero jogar também',
    instruction: 'Arraste um cartão até o balão de Noa.',
    greeting: 'Téo está com a bola. Eu quero jogar também. Como eu mostro isso?',
    scene: 'playground',
    listener: 'teo',
    before: [layer('ball-far')],
    after: [layer('ball-near')],
    options: [
      { card: 'canPlay', fit: 'likely', reply: 'Pode sim! Vem jogar comigo.' },
      { card: 'showBall', fit: 'possible', reply: 'Você quer jogar? Legal! Toma a bola.' },
      { card: 'wantSleep', fit: 'unlikely', message: 'Esse cartão fala de sono. Eu quero jogar bola. Vamos tentar outro?' },
    ],
    success: 'Agora estamos jogando juntos!',
  },
  {
    id: 'communication-play-choose',
    type: 'sentence',
    part: 'play',
    prize: 'ball',
    title: 'Do que vamos brincar?',
    instruction: 'Arraste uma peça para completar a frase.',
    greeting: 'Téo perguntou do que eu quero brincar. Você escolhe para mim?',
    scene: 'playground',
    listener: 'teo',
    lines: [[{ text: 'Eu quero brincar de' }, { slot: 'game', label: 'Brincadeira' }]],
    pieces: [
      { card: 'ball', group: 'game' },
      { card: 'drawing', group: 'game' },
      { card: 'puzzle', group: 'game' },
    ],
    reply: 'Combinado! Vamos brincar de {game}.',
    success: 'Quem escolhe também pode contar o que quer.',
  },
  {
    id: 'communication-play-toy',
    type: 'dialogue',
    part: 'play',
    prize: 'callAdult',
    title: 'O carrinho de Noa',
    instruction: 'Toque em um cartão para Noa responder.',
    greeting: 'Téo pegou o meu carrinho. O que eu faço?',
    mood: 'worried',
    scene: 'playground',
    listener: 'teo',
    turns: [
      {
        say: 'Posso brincar com o seu carrinho?',
        options: [
          { card: 'yes', fit: 'likely', reply: 'Valeu! Depois eu devolvo.' },
          { card: 'notNow', fit: 'likely', reply: 'Tudo bem. O carrinho é seu. Aqui está.' },
          { card: 'callAdult', fit: 'possible', reply: 'Tudo bem. Vamos chamar a Lia para ajudar.' },
          { card: 'push', fit: 'unlikely', message: 'Empurrar pode machucar. Vamos tentar com um cartão?' },
        ],
      },
      {
        say: 'Quer brincar de outra coisa comigo?',
        options: [
          { card: 'yes', fit: 'likely', reply: 'Oba! Vamos lá.' },
          { card: 'later', fit: 'likely', reply: 'Combinado. Depois a gente brinca.' },
          { card: 'notNow', fit: 'likely', reply: 'Tudo bem. Até mais tarde.' },
        ],
      },
    ],
    success: 'Noa disse o que queria sem machucar ninguém.',
  },

  // ---------- O que eu sinto ----------
  {
    id: 'communication-feelings-tell',
    type: 'sentence',
    part: 'feelings',
    prize: 'hug',
    title: 'Hoje eu sinto',
    instruction: 'Arraste as peças para montar as frases.',
    greeting: 'Eu quero contar o que eu sinto. Você me ajuda?',
    scene: 'livingRoom',
    listener: 'gabi',
    lines: [
      [{ text: 'Eu sinto' }, { slot: 'feeling', label: 'Sentimento' }],
      [{ text: 'Eu preciso de' }, { slot: 'need', label: 'O que ajuda' }],
    ],
    pieces: [
      { card: 'joy', group: 'feeling' },
      { card: 'sadness', group: 'feeling' },
      { card: 'anger', group: 'feeling' },
      { card: 'fear', group: 'feeling' },
      { card: 'hug', group: 'need' },
      { card: 'silence', group: 'need' },
      { card: 'someHelp', group: 'need' },
    ],
    reply: 'Que bom que você me contou. Você sente {feeling} e precisa de {need}. Estou aqui.',
    success: 'Todo sentimento pode ser contado.',
  },
  {
    id: 'communication-feelings-limit',
    type: 'dialogue',
    part: 'feelings',
    prize: 'notNow',
    title: 'Eu posso dizer não',
    instruction: 'Toque em um cartão para Noa responder.',
    greeting: 'Eu posso dizer sim ou não. As duas respostas valem.',
    scene: 'playground',
    listener: 'teo',
    turns: [
      {
        say: 'Oi, Noa! Posso te dar um abraço?',
        options: [
          { card: 'yes', fit: 'likely', reply: 'Legal! Aqui vai o abraço.' },
          { card: 'notNow', fit: 'likely', reply: 'Tudo bem. Eu não abraço.' },
        ],
      },
      {
        say: 'Posso te dar um oi de longe?',
        options: [
          { card: 'wave', fit: 'likely', reply: 'Oi! Vi você acenar.' },
          { card: 'yes', fit: 'likely', reply: 'Então: oi de longe!' },
          { card: 'notNow', fit: 'likely', reply: 'Tudo bem. A gente se fala depois.' },
        ],
      },
    ],
    success: 'Cada pessoa decide sobre o próprio corpo. Téo perguntou e respeitou a resposta.',
  },
  {
    id: 'communication-feelings-match',
    type: 'match',
    part: 'feelings',
    prize: 'silence',
    title: 'O que eu posso mostrar?',
    instruction: 'Leve cada cartão até a situação em que ele ajuda.',
    greeting: 'Qual cartão ajuda em cada situação?',
    situations: [
      { id: 'noise', label: 'O barulho está forte', image: situationImages.noise },
      { id: 'hurt', label: 'Machuquei o joelho', image: situationImages.hurt },
      { id: 'notNow', label: 'Não quero brincar agora', image: situationImages.notNow },
    ],
    items: [
      { card: 'needBreak', situation: 'noise', hint: 'Uma pausa ajuda quando alguma coisa incomoda.' },
      { card: 'help', situation: 'hurt', hint: '"Me ajuda?" serve quando você precisa de alguém.' },
      { card: 'notNow', situation: 'notNow', hint: '"Agora não" serve para dizer que você não quer isso agora.' },
    ],
    success: 'Agora Noa sabe qual cartão mostrar em cada situação.',
  },
];
