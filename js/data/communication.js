/**
 * Dados do módulo "Eu Me Comunico" (somente dados, sem lógica).
 *
 * Catálogo (pessoas, cenários, cartões, partes): communication/catalog.js.
 * Atividades e descrição de cada tipo: communication/activities.js.
 * Este arquivo reúne tudo e guarda os textos do módulo.
 */

import { people, scenes, cards, parts } from './communication/catalog.js';
import { activities } from './communication/activities.js';

const messages = Object.freeze({
  progress: 'Você fez {completed} de {total} atividades.',
  intro: {
    title: 'Vamos nos comunicar',
    text: 'Noa precisa da sua ajuda para conversar em quatro lugares. Escolha um lugar ou comece pelo primeiro.',
    note: 'Existem muitos jeitos de se comunicar: fala, cartões, gestos e imagens. Todos valem.',
    soundHint: 'Para ouvir as frases em voz alta, ligue os sons em Configurações.',
    start: 'Começar',
    resume: 'Continuar de onde parei',
    restart: 'Começar do início',
  },
  completion: {
    title: 'Você chegou ao fim de Eu Me Comunico!',
    text: 'Você ajudou Noa a pedir, cumprimentar, escolher, contar o que sente e dizer não.',
    pending: 'Algumas atividades ainda podem ser feitas, quando você quiser.',
    doPending: 'Fazer as que faltam',
    again: 'Fazer tudo de novo',
  },
  journey: {
    label: 'Lugares da comunicação',
    stars: 'Estrelas: {completed} de {total}',
    stop: '{title}: atividades feitas, {done} de {total}',
    mapLabel: 'Lugares para conversar',
    mapPending: 'Estrelas: {done} de {total}',
    mapWon: 'Figurinha: {label}',
    starWon: 'Você ganhou uma estrela e um cartão novo!',
    stickerWon: 'Figurinha nova: {label}!',
  },
  sceneAlt: '{scene} Noa está com {listener}.',
  heard: '{listener} entendeu!',
  talkCard: {
    balloon: 'Balão de Noa',
  },
  sentence: {
    show: 'Mostrar a frase',
    ready: 'Agora toque em "Mostrar a frase".',
    missing: 'Ainda falta uma peça. Vamos completar a frase?',
  },
  dialogue: {
    logLabel: 'Conversa',
    options: 'Cartões para Noa responder',
    keepGoing: 'Boa! O que eu respondo agora?',
    doneTitle: 'Conversa completa!',
  },
  match: {
    count: 'Cartões no lugar: {done} de {total}',
    successTitle: 'Todos os cartões ajudaram!',
  },
  board: {
    tray: 'Cartões',
    trayReturn: 'Devolver para a caixa',
    dropHere: 'Solte aqui',
    emptySlot: 'Lugar vazio: {target}',
    placeHere: 'Colocar {piece} em: {target}',
    pieceInSlot: '{piece}, em: {target}',
    chosen: '{piece}. Agora toque no lugar.',
    chooseFirst: 'Primeiro, escolha um cartão.',
    placed: '{piece}.',
    returned: '{piece} voltou para a caixa.',
    outside: '{piece} voltou. Solte dentro de um lugar.',
    rejected: '{piece} voltou para a caixa.',
  },
  myBoard: {
    title: 'Minha prancha de comunicação',
    hint: 'Toque em um cartão para mostrar o que ele diz.',
    empty: 'Faça uma atividade para ganhar o primeiro cartão.',
    count: 'Cartões ganhos: {done} de {total}',
    showing: 'Noa mostra:',
  },
});

export const communicationData = Object.freeze({
  moduleId: 'communication',
  version: 2,
  people,
  scenes,
  cards,
  parts,
  activities,
  messages,
});
