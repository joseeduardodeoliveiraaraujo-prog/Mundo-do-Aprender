/**
 * Dados do módulo "Explorando os Animais" (somente dados, sem lógica).
 *
 * Catálogo (animais, habitats, regiões): animals/catalog.js.
 * Atividades e descrição de cada tipo: animals/activities.js.
 * Este arquivo reúne tudo e guarda os textos do módulo.
 */

import { animals, articles, habitats, regions, parts } from './animals/catalog.js';
import { activities } from './animals/activities.js';

const messages = Object.freeze({
  progress: 'Você fez {completed} de {total} atividades.',
  intro: {
    title: 'Vamos explorar os animais',
    text: 'Visite cinco lugares, encontre os animais e descubra como eles vivem. Escolha um lugar ou comece pelo primeiro.',
    note: 'Todas as atividades podem ser feitas sem som. Nenhum som toca sozinho: só quando você tocar no botão.',
    soundHint: 'Para ouvir os sons e as instruções, ligue os sons em Configurações.',
    start: 'Começar',
    resume: 'Continuar de onde parei',
    restart: 'Começar do início',
  },
  completion: {
    title: 'Você chegou ao fim de Explorando os Animais!',
    text: 'Você conheceu doze animais, seus sons, onde vivem e o que comem.',
    pending: 'Algumas atividades ainda podem ser feitas, quando você quiser.',
    doPending: 'Fazer as que faltam',
    again: 'Fazer tudo de novo',
  },
  journey: {
    label: 'Lugares da exploração',
    stars: 'Estrelas: {completed} de {total}',
    stop: '{title}: atividades feitas, {done} de {total}',
    mapLabel: 'Lugares para explorar',
    mapPending: 'Estrelas: {done} de {total}',
    mapWon: 'Figurinha: {label}',
    starWon: 'Você ganhou uma estrela!',
    stickerWon: 'Figurinha nova: {label}!',
  },
  notebook: {
    label: 'Caderno de animais',
    locked: 'Ainda não visto',
  },
  explore: {
    start: 'Toque em um animal.',
    count: 'Animais conhecidos: {done} de {total}',
    done: 'Você conheceu todos daqui!',
    empty: 'A ficha do animal aparece aqui.',
    successTitle: 'Passeio completo!',
    home: 'Onde vive',
    food: 'O que come',
    fact: 'Curiosidade',
    another: 'Ver outro animal',
  },
  seek: {
    start: 'Procure no cenário.',
    clue: 'Pista',
    other: '{pronoun} é {article} {animal}.',
    success: 'Isso! É {article} {animal}.',
  },
  habitat: {
    start: 'Segure um animal e leve até um lugar.',
    count: 'Animais no lugar: {done} de {total}',
    successTitle: 'Todos chegaram!',
    board: {
      tray: 'Animais',
      trayReturn: 'Devolver para a caixa',
      dropHere: 'Solte aqui',
      emptySlot: 'Lugar vazio: {target}',
      placeHere: 'Levar {piece} para: {target}',
      pieceInSlot: '{piece}, em: {target}',
      chosen: '{piece}. Agora toque em um lugar.',
      chooseFirst: 'Primeiro, escolha um animal.',
      placed: '{piece} chegou: {target}.',
      returned: '{piece} voltou para a caixa.',
      outside: '{piece} voltou. Solte dentro de um lugar.',
      rejected: '{piece} voltou para a caixa.',
    },
  },
  learn: {
    start: 'Segure uma comida e leve até o animal.',
    successTitle: 'Comeu tudo!',
    factsLabel: 'Informações',
    target: 'Comida para: {animal}',
    board: {
      tray: 'Comidas',
      trayReturn: 'Devolver para a caixa',
      dropHere: 'Solte aqui',
      emptySlot: 'Lugar vazio: {target}',
      placeHere: 'Dar {piece}. {target}',
      pieceInSlot: '{piece}, com o animal',
      chosen: '{piece}. Agora toque no espaço perto do animal.',
      chooseFirst: 'Primeiro, escolha uma comida.',
      placed: '{piece}.',
      returned: '{piece} voltou para a caixa.',
      outside: '{piece} voltou. Solte perto do animal.',
      rejected: '{piece} voltou para a caixa.',
    },
  },
});

export const animalsData = Object.freeze({
  moduleId: 'animals',
  version: 3,
  animals,
  articles,
  habitats,
  regions,
  parts,
  activities,
  messages,
});
