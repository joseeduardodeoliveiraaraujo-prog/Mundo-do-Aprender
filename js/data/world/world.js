/**
 * O jogo "Bairro do Noa" (somente dados): mapas, ponto de partida e textos.
 *
 * Formato de um mapa (js/data/world/maps/):
 *   id, name, welcome   identificador, título da tela e fala de Noa ao chegar
 *   base?               imagem embaixo de tudo (ex.: 'water' no bairro)
 *   background?         cor atrás do mapa (fora das paredes dos cômodos)
 *   ground: string[]    uma letra por bloco de 16×16, lida pela `legend`:
 *     { terrains?: ['grass', 'dirt'] (encaixe automático), room?: true (parede de cômodo),
 *       floor?: imagem de piso, tile?: imagem por cima, solid?: true }
 *   objects             [{ art, x, y, solid?: 'base'|'all'|'none', lift? }] (x, y = canto superior esquerdo;
 *                       'base' bloqueia só a linha de baixo, então Noa passa atrás das copas)
 *   buildings           [{ x, y, w, h, door }] casa vista de fora: telhado + parede com porta
 *   fences              [{ x, y, w, h, gaps: [[x, y]] }] cerca retangular com porteiras
 *   doors               [{ x, y, to, spawn: {x,y}, facing, label }] passagem para outro mapa
 *   spots               lugares que Noa usa:
 *     { id, label, art + x + y (ou cells: [{x,y}]), prompt, solid?, lift?,
 *       challenge?: { module, part }   abre uma atividade daquela parte do módulo
 *       usedArt?                       troca a imagem no primeiro uso
 *       removeOnUse?, donePrompt?      objeto que some ao ser usado
 *       animal?                        id em js/data/animals/catalog.js: Noa diz nome, som e curiosidade }
 * Coordenadas em blocos: x = coluna, y = linha, começando em 0.
 * Nomes das imagens: js/data/world/atlas.js.
 */

import { houseMap } from './maps/house.js';
import { neighborhoodMap } from './maps/neighborhood.js';
import { schoolMap } from './maps/school.js';

export const worldData = Object.freeze({
  version: 1,
  maps: Object.freeze({ house: houseMap, neighborhood: neighborhoodMap, school: schoolMap }),
  start: Object.freeze({ map: 'house', x: 3, y: 5, facing: 'down' }),
  /** Tamanho da janela do jogo, em blocos (a câmera segue Noa em mapas maiores). */
  view: Object.freeze({ cols: 12, rows: 8 }),
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
    challenge: {
      progress: 'Atividades feitas aqui: {completed} de {total}',
      back: 'Voltar a explorar',
      finish: 'Voltar a explorar',
      allDone: 'Você já fez tudo aqui! Esta é para fazer de novo, se quiser.',
    },
  }),
});
