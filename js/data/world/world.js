/**
 * O jogo "Bairro do Noa" (somente dados): mapas, ponto de partida e textos.
 *
 * Formato de um mapa (js/data/world/maps/):
 *   id, name, welcome   identificador, título da tela e fala de Noa ao chegar
 *   base?               imagem embaixo de tudo (ex.: 'water' no bairro)
 *   background?         cor atrás do mapa (fora das paredes dos cômodos)
 *   ground: string[]    uma letra por bloco de 16×16, lida pela `legend`:
 *     { terrains?: ['grass', 'dirt'] (encaixe automático), room?: true (parede de cômodo),
 *       floor?: imagem de piso, tile?: imagem por cima (ou lista de variações, escolhida pela posição), solid?: true }
 *   objects             [{ art, x, y, solid?: 'base'|'all'|'none', lift? }] (x, y = canto superior esquerdo;
 *                       'base' bloqueia só a linha de baixo, então Noa passa atrás das copas)
 *   buildings           [{ x, y, w, h, door, art? }] casa vista de fora (bloqueia a área, menos a porta);
 *                       `art`: casa desenhada inteira no atlas; sem ela, telhado + parede com porta
 *   fences              [{ x, y, w, h, gaps: [[x, y]] }] cerca retangular com porteiras
 *   doors               [{ x, y, to, spawn: {x,y}, facing, label }] passagem para outro mapa
 *   spots               lugares que Noa usa:
 *     { id, label, name? (nome de quem fala na conversa), art + x + y (ou cells: [{x,y}]), prompt, solid?, lift?,
 *       challenge?: { module, part }   abre uma atividade daquela parte do módulo
 *       usedArt?                       troca a imagem no primeiro uso
 *       removeOnUse?, donePrompt?      objeto que some ao ser usado
 *       animal?                        id em js/data/animals/catalog.js: Noa diz nome, som e curiosidade }
 * Coordenadas em blocos: x = coluna, y = linha, começando em 0.
 * Nomes das imagens: js/data/world/atlas.js.
 */

import { houseMap } from './maps/house.js';
import { neighborhoodMap } from './maps/neighborhood.js';
import { neighborMap } from './maps/neighbor.js';
import { schoolMap } from './maps/school.js';

export const worldData = Object.freeze({
  version: 1,
  maps: Object.freeze({ house: houseMap, neighborhood: neighborhoodMap, neighbor: neighborMap, school: schoolMap }),
  start: Object.freeze({ map: 'house', x: 3, y: 5, facing: 'down' }),
  /**
   * Quantos blocos a câmera mostra, pela largura da janela (sempre 3:2). Em telas
   * largas a câmera fica mais longe (mostra mais do mapa); no celular, mais perto,
   * para pessoas e objetos continuarem fáceis de tocar. Vale a maior `minWidth`
   * que couber; é escolhido ao abrir o jogo.
   */
  views: Object.freeze([
    Object.freeze({ minWidth: 0, cols: 12, rows: 8 }),
    Object.freeze({ minWidth: 640, cols: 15, rows: 10 }),
    Object.freeze({ minWidth: 1024, cols: 18, rows: 12 }),
  ]),
  /** Tarefas das atividades de cena da Rotina → lugares do mapa da casa. */
  questBindings: Object.freeze({
    'routine-scene-wake': { alarm: 'house-alarm', curtain: 'house-window', getUp: 'house-bed' },
    'routine-scene-bedtime': { toys: 'house-toys', curtain: 'house-window', bed: 'house-bed', lamp: 'house-lamp' },
  }),
  /** Noa no balão ao lado do mapa: o mesmo rosto em pixel art da caixa de fala (38×38). */
  companion: Object.freeze({
    name: 'Noa',
    poses: Object.freeze({
      neutral: 'assets/images/world/faces/noa.png',
      happy: 'assets/images/world/faces/noa.png',
      thinking: 'assets/images/world/faces/noa.png',
    }),
  }),
  texts: Object.freeze({
    loading: 'Preparando o mundo…',
    error: 'Não foi possível abrir o jogo. Atualize a página para tentar de novo.',
    stageLabel: '{place}, visto de cima. Use as setas para Noa andar e Enter para usar o que está perto.',
    greeting: 'Oi! Eu sou o Noa. Vamos explorar juntos? Toque no chão para eu andar.',
    howTo: 'Toque no chão para Noa andar. Toque em uma pessoa ou objeto para Noa ir até lá.',
    stars: 'Estrelas: {completed} de {total}',
    nearNothing: 'Chegue perto de uma pessoa ou objeto com um balão.',
    nearSpot: 'Perto de você: {label}',
    start: 'Começar',
    places: 'Ir até um lugar',
    goTo: 'Ir até: {label}',
    notNear: 'Chegue mais perto de alguma coisa para usar.',
    animalSays: '{name}: "{sound}" {fact}',
    animalQuiet: '{name}. {sound} {fact}',
    menu: 'Tela inicial',
    title: {
      heading: 'Bairro do Noa',
      subtitle: 'Explore a casa, o bairro e a escola junto com o Noa.',
      imageAlt: 'Noa e Gabi num gramado com árvores e flores, junto com um cachorro e um gato.',
      continue: 'Continuar',
      continueInfo: 'Noa está em: {place} · Estrelas: {completed} de {total}',
      newGame: 'Novo jogo',
      options: 'Opções',
      help: 'Como jogar',
      confirmTitle: 'Começar um novo jogo?',
      confirmText: 'As estrelas e o lugar onde o Noa estava vão ser apagados. As opções continuam iguais.',
      confirmYes: 'Sim, começar do zero',
      confirmNo: 'Não, voltar',
    },
    challenge: {
      progress: 'Atividades feitas aqui: {completed} de {total}',
      back: 'Voltar a explorar',
      finish: 'Voltar a explorar',
      allDone: 'Você já fez tudo aqui! Esta é para fazer de novo, se quiser.',
    },
    quest: {
      conversation: 'Conversa',
      answers: 'Respostas',
      continue: 'Continuar',
      stop: 'Parar o desafio',
      goal: 'Objetivo do desafio',
      checklist: 'O que falta',
      done: 'Conseguimos! Você ganhou uma estrela.',
      stopped: 'Tudo bem, paramos. Você pode voltar quando quiser.',
      finished: 'Desafio feito! Vamos explorar mais?',
      alreadyFound: 'Esse já foi. Vamos procurar o que falta?',
      notThis: 'Agora estamos fazendo o desafio. Você pode parar quando quiser.',
      carrying: 'Carregando: {label}',
      goTo: 'Ir até: {label}',
      pick: 'Pegar: {label}',
      bringTo: 'Levar até: {label}',
      handsFree: 'Mãos livres: toque em um item no chão para pegar.',
      bringSomething: 'Primeiro, pegue um item no chão e traga até aqui.',
      bringFood: 'Primeiro, pegue uma comida no chão e traga até aqui.',
      whatNext: 'O que vem em {n}º lugar?',
      packed: '{label} está na mochila.',
      putInBag: 'Pôr na mochila: {label}',
      putOnBoard: 'Pôr no quadro: {label}',
      onBoard: '{n}º: {label}.',
      boardGoal: 'Monte o quadro da rotina: arraste os cartões até o quadro, na ordem.',
      cluesIntro: 'Ande pelo bairro e encontre as lupas: cada uma mostra uma pista.',
      findClues: 'Encontre as lupas com as pistas',
      howFeels: '{name}: {situation} Como {name} se sente?',
      calmCorner: 'Vamos montar um cantinho da calma aqui no banco? Os objetos estão no chão.',
      calmCornerGoal: 'Leve até o banco o que ajuda a ficar calmo',
      exploreIntro: 'Vamos conhecer os animais daqui? Ande até cada um.',
      exploreMore: 'Agora vamos conhecer os outros animais daqui? Ande até cada um.',
      foundAnimal: 'Achei: {name}!',
      whoMakesSound: 'Quem faz "{sound}"? Ande até esse animal.',
      whoMakesSoundHere: 'Quem faz "{sound}"? Escolha o animal.',
      feedIntro: 'Hora de comer! As comidas estão no chão. Leve a comida certa até: {name}.',
      feedGoal: 'Leve a comida certa até: {name}',
      whereLives: 'Onde vive: {name}?',
      livesThere: 'Isso! {name}: {place}.',
      sentencePart: '{sentence} — escolha: {label}.',
      sentenceDone: 'Minha frase: {sentence}',
      whereHelps: 'Em que situação o cartão "{label}" ajuda?',
      helpsThere: 'Isso! "{card}" ajuda quando: {situation}.',
    },
  }),
});
