/**
 * Dados do módulo "Minha Rotina" (somente dados, sem lógica).
 *
 * Catálogo (imagens, cartões, objetos, Noa, momentos do dia): routine/catalog.js.
 * Atividades e descrição de cada tipo: routine/activities.js.
 * Este arquivo reúne tudo e guarda os textos do módulo.
 */

import { cards, objects, parts, companion } from './routine/catalog.js';
import { activities } from './routine/activities.js';

const messages = Object.freeze({
  progress: 'Você fez {completed} de {total} atividades.',
  intro: {
    title: 'Vamos organizar o dia',
    text: 'Noa precisa de ajuda em seis momentos do dia. Escolha um momento ou comece pelo primeiro.',
    note: 'Cada pessoa e cada família organiza a rotina do seu jeito. Os exemplos daqui são só ideias.',
    soundHint: 'Para ouvir as instruções em voz alta, ligue os sons em Configurações.',
    start: 'Começar',
    resume: 'Continuar de onde parei',
    restart: 'Começar do início',
  },
  completion: {
    title: 'Você chegou ao fim de Minha Rotina!',
    text: 'Você ajudou Noa a passar o dia, do bom-dia ao boa-noite.',
    pending: 'Algumas atividades ainda podem ser feitas, quando você quiser.',
    doPending: 'Fazer as que faltam',
    again: 'Fazer tudo de novo',
  },
  journey: {
    label: 'Trilha do dia',
    stars: 'Estrelas: {completed} de {total}',
    stop: '{title}: atividades feitas, {done} de {total}',
    mapLabel: 'Momentos do dia',
    mapPending: 'Estrelas: {done} de {total}',
    mapWon: 'Figurinha: {label}',
    starWon: 'Você ganhou uma estrela!',
    stickerWon: 'Figurinha nova: {label}!',
  },
  hintButton: 'Quero uma dica',
  sceneTasks: {
    checklist: 'O que fazer',
    successTitle: 'Tudo pronto!',
  },
  stepByStep: {
    successTitle: 'Mãos limpas!',
    wrongSlot: 'Esse passo vai no número destacado.',
    board: {
      tray: 'Passos',
      dropHere: 'Solte aqui',
      emptySlot: 'Passo vazio: {target}',
      placeHere: 'Colocar {piece} em: {target}',
      pieceInSlot: '{piece}, em: {target}',
      chosen: '{piece}. Agora toque no número destacado.',
      chooseFirst: 'Primeiro, escolha um cartão.',
      returned: '{piece} voltou para a caixa.',
      outside: '{piece} voltou. Solte no número destacado.',
    },
  },
  sequence: {
    successTitle: 'Essa ordem funciona!',
    freeTitle: 'Essa é a sua ordem!',
    retryEnd: 'Você pode trocar os cartões de lugar.',
    placedCount: 'Cartões colocados: {done} de {total}',
    stepName: 'Número',
    board: {
      tray: 'Cartões',
      dropHere: 'Solte aqui',
      emptySlot: 'Lugar vazio: {target}',
      placeHere: 'Colocar {piece} em: {target}',
      pieceInSlot: '{piece}, em: {target}',
      chosen: '{piece}. Agora toque em um número.',
      chooseFirst: 'Primeiro, escolha um cartão.',
      placed: '{piece}: {target}.',
      returned: '{piece} voltou para a caixa.',
      outside: '{piece} voltou. Solte em um número.',
    },
  },
  pack: {
    table: 'Em cima da mesa',
    bag: 'Mochila',
    pocket: 'Bolso',
    successTitle: 'Mochila pronta!',
    bagCount: 'Na mochila: {count}',
    hintDone: 'A mochila já tem o que precisa. Você pode levar mais alguma coisa, se quiser.',
    hintEmpty: 'Arraste um objeto até um bolso da mochila.',
    board: {
      tray: 'Objetos em cima da mesa',
      trayReturn: 'Devolver para a mesa',
      dropHere: 'Solte aqui',
      emptySlot: 'Bolso vazio: {target}',
      placeHere: 'Colocar {piece} em: {target}',
      pieceInSlot: '{piece}, na mochila',
      chosen: '{piece}. Agora toque em um bolso.',
      chooseFirst: 'Primeiro, escolha um objeto.',
      placed: '{piece} está na mochila.',
      returned: '{piece} voltou para a mesa.',
      outside: '{piece} voltou. Solte em um bolso.',
      rejected: '{piece} voltou para a mesa.',
    },
  },
  choice: {
    likely: 'Boa ideia!',
    possible: 'Pode ajudar, sim!',
    forNoa: 'Para Noa',
    board: {
      tray: 'Cartões para ajudar Noa',
      trayReturn: 'Devolver para a caixa',
      dropHere: 'Solte aqui',
      emptySlot: 'Espaço vazio: {target}',
      placeHere: 'Dar {piece} para Noa',
      pieceInSlot: '{piece}, com Noa',
      chosen: '{piece}. Agora toque no espaço perto de Noa.',
      chooseFirst: 'Primeiro, escolha um cartão.',
      placed: '{piece}.',
      returned: '{piece} voltou para a caixa.',
      outside: '{piece} voltou. Solte no espaço perto de Noa.',
      rejected: '{piece} voltou para a caixa.',
    },
  },
});

export const routineData = Object.freeze({
  moduleId: 'routine',
  version: 3,
  companion,
  cards,
  objects,
  parts,
  activities,
  messages,
});
