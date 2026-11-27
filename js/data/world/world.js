/**
 * O jogo "Bairro do Noa" (somente dados): mapas, ponto de partida e textos.
 *
 * Formato de um mapa (js/data/world/maps/):
 *   id, name            identificador e nome mostrado como título da tela
 *   welcome             fala de Noa ao chegar no mapa
 *   ground: string[]    uma letra por bloco de 16×16, lida pela `legend`
 *   legend              letra → { tile, solid?, base? } (base: chão desenhado embaixo)
 *   furniture           [{ tile, x, y }] objetos fixos (bloqueiam a passagem)
 *   doors               [{ x, y, to, spawn: {x,y}, facing, label }] passagem para outro mapa
 *   spots               lugares que Noa usa:
 *     { id, label, tiles?: [{ tile, x, y }] | cells?: [{x,y}], prompt,
 *       challenge?: { module, part }   abre as atividades daquela parte do módulo
 *       usedTiles?: [tile]             troca as imagens no primeiro uso
 *       removeOnUse?, donePrompt?      objeto que some ao ser usado }
 * Coordenadas em blocos: x = coluna, y = linha, começando em 0.
 * Nomes de tiles: js/data/world/tiles.js.
 */

import { houseMap } from './maps/house.js';
import { neighborhoodMap } from './maps/neighborhood.js';

export const worldData = Object.freeze({
  version: 1,
  maps: Object.freeze({ house: houseMap, neighborhood: neighborhoodMap }),
  start: Object.freeze({ map: 'house', x: 2, y: 4, facing: 'down' }),
  /** Tamanho da janela do jogo, em blocos (a câmera segue Noa em mapas maiores). */
  view: Object.freeze({ cols: 15, rows: 10 }),
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
    challenge: {
      progress: 'Atividades feitas: {completed} de {total}',
      back: 'Voltar a explorar',
      next: 'Próxima',
      finish: 'Voltar a explorar',
      allDone: 'Você já fez tudo aqui! Pode fazer de novo, se quiser.',
    },
  }),
});
