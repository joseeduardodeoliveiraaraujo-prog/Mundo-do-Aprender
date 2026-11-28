/**
 * Cena de perto da ponte quebrada: o quebra-cabeça que abre o caminho para a ilha do rio
 * (lugar com `gate: 'bridge'` no mapa do bairro). Não é uma atividade de módulo: não dá
 * estrela; resolvido uma vez, a ponte fica consertada (js/games/world/gates.js).
 *
 * A criança encaixa cada peça no buraco do mesmo tamanho (1, 2 e 3 tábuas). A tábua
 * rachada não serve em nenhum buraco: volta com uma explicação. Peça no buraco errado
 * volta para a margem com uma pista (que diz qual peça cabe onde). Sem tempo e sem erro.
 *
 * Formato de uma cena: ./sink.js. Aqui a cena já traz as tarefas e os textos
 * (montados por js/games/world/gateQuest.js). Imagens: tools/closeup/draw_bridge.py.
 */

const HOLE_Y = 44;
const HOLES = Object.freeze({ 'hole-1': 60, 'hole-2': 80, 'hole-3': 110 });
const how = 'Compare o tamanho da peça com o tamanho do buraco.';
const crackedHint = 'Esta tábua está rachada. Ela não segura o Noa. Escolha outra peça.';

/** Encaixar uma peça boa: ela vai para o buraco e fica presa. */
const fit = (piece, hole, label, holeName) => ({
  id: piece, label, do: { drag: piece, to: hole }, how,
  reaction: `Encaixou! ${label} no ${holeName}.`,
  hint: `Experimente ${label.toLowerCase()} no ${holeName}.`,
  effects: [{ moveTo: piece, x: HOLES[hole], y: HOLE_Y }, { lock: piece }, { sparkles: 2, on: piece }],
});

/** A tábua rachada em qualquer buraco: não serve (volta para a margem). */
const cracked = (hole) => ({ id: `cracked-${hole}`, label: 'Tábua rachada', do: { drag: 'plank-cracked', to: hole }, ok: false, hint: crackedHint });

export const bridgeGate = Object.freeze({
  intro: 'A ponte quebrou e faltam tábuas. Vamos consertar? Cada buraco tem um tamanho.',
  success: 'Pronto! A ponte está firme. Agora dá para atravessar o rio.',
  goal: 'Conserte a ponte: arraste cada peça até o buraco do mesmo tamanho.',
  closeup: Object.freeze({
    id: 'bridge',
    folder: 'assets/images/world/closeup/bridge',
    images: ['background', 'hole-1', 'hole-2', 'hole-3', 'planks-1', 'planks-2', 'planks-3', 'plank-cracked'],
    label: 'A ponte do rio vista de perto: faltam tábuas em três buracos de tamanhos diferentes. Nas margens há peças de madeira.',
    pieces: [
      { id: 'hole-1', image: 'hole-1', x: HOLES['hole-1'], y: HOLE_Y, label: 'Buraco pequeno' },
      { id: 'hole-2', image: 'hole-2', x: HOLES['hole-2'], y: HOLE_Y, label: 'Buraco médio' },
      { id: 'hole-3', image: 'hole-3', x: HOLES['hole-3'], y: HOLE_Y, label: 'Buraco grande' },
      { id: 'planks-3', image: 'planks-3', x: 8, y: 2, label: '3 tábuas pregadas', draggable: true },
      { id: 'planks-2', image: 'planks-2', x: 156, y: 2, label: '2 tábuas pregadas', draggable: true },
      { id: 'planks-1', image: 'planks-1', x: 24, y: 82, label: '1 tábua', draggable: true },
      { id: 'plank-cracked', image: 'plank-cracked', x: 168, y: 82, label: 'Tábua rachada', draggable: true },
    ],
  }),
  tasks: [
    fit('planks-1', 'hole-1', '1 tábua', 'buraco pequeno'),
    fit('planks-2', 'hole-2', '2 tábuas', 'buraco médio'),
    fit('planks-3', 'hole-3', '3 tábuas', 'buraco grande'),
    cracked('hole-1'), cracked('hole-2'), cracked('hole-3'),
  ],
  /** Botões que fazem o mesmo que arrastar (teclado e quem não arrasta). */
  actions: [
    { label: 'Levar 1 tábua até a ponte', do: { drag: 'planks-1', to: 'hole-1' }, task: 'planks-1' },
    { label: 'Levar 2 tábuas até a ponte', do: { drag: 'planks-2', to: 'hole-2' }, task: 'planks-2' },
    { label: 'Levar 3 tábuas até a ponte', do: { drag: 'planks-3', to: 'hole-3' }, task: 'planks-3' },
  ],
});

