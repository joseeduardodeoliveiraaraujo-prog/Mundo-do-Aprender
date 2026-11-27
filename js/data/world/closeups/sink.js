/**
 * Cena de perto da pia do banheiro (atividade "Lavar as mãos").
 *
 * Formato de uma cena de perto (usado por js/games/world/closeup/):
 *   folder, images   pasta e nomes das imagens (PNG em pixel art 2×: 1 px de arte = 2 px da
 *                    cena, que tem 192×128; desenhadas por tools/closeup/); a setinha
 *                    de ajuda vem de closeup/common/
 *   background?      imagem de fundo (padrão: 'background')
 *   label            descrição da cena para leitor de tela
 *   goal             o que fazer, em uma frase
 *   pieces           peças em ordem de profundidade: { id, image, x, y, label?, draggable?, hidden?, exact? }
 *                    (exact: o toque só conta onde há desenho, não no retângulo inteiro)
 *                    (sem `label` = enfeite, não responde ao toque)
 *   foam             área onde a espuma aparece
 *   actions          botões que fazem as mesmas ações do toque (teclado e quem não arrasta)
 *   width, height?   tamanho da cena em pixels do jogo (padrão 192×128)
 *   svgs?            imagens SVG extras: [{ id, src, width, height, card? }] (card: vira cartão com moldura)
 *   tasks            por id de passo da atividade: o que a criança faz (`do`), como (`how`,
 *                    dito junto com a pista) e as animações (`effects`). Esfregar (`rub`)
 *                    conta `times` passadas, cada uma com os efeitos de `each`.
 *                    Os tradutores (js/games/world/quest/adapters/) juntam isso aos textos da atividade.
 */

export const sinkCloseup = Object.freeze({
  id: 'sink',
  folder: 'assets/images/world/closeup/sink',
  images: [
    'background', 'faucet-closed', 'faucet-open', 'water', 'splash', 'soap', 'towel', 'bubble', 'bubble-small',
    'sparkle', 'hands-dirty', 'hands-wet', 'hands-rub-wet', 'hands-rinsed', 'hands-clean',
  ],
  label: 'A pia do banheiro vista de perto: a torneira, as mãos de Noa, o sabão e a toalha.',
  goal: 'Lave as mãos de Noa: toque e arraste as coisas da pia.',
  pieces: [
    { id: 'water', image: 'water', x: 94, y: 50, hidden: true },
    { id: 'faucet', image: 'faucet-closed', x: 90, y: 38, label: 'Torneira' },
    { id: 'hands', image: 'hands-dirty', x: 64, y: 58, label: 'Mãos de Noa', exact: true },
    { id: 'soap', image: 'soap', x: 24, y: 72, label: 'Sabão', draggable: true },
    { id: 'towel', image: 'towel', x: 152, y: 28, label: 'Toalha', draggable: true },
  ],
  foam: { x: 70, y: 62, width: 50, height: 24 },
  actions: [
    { label: 'Usar a torneira', do: { tap: 'faucet' } },
    { label: 'Levar o sabão até as mãos', do: { drag: 'soap', to: 'hands' } },
    { label: 'Esfregar as mãos', do: { rub: 'hands' } },
    { label: 'Levar a toalha até as mãos', do: { drag: 'towel', to: 'hands' } },
  ],
  tasks: {
    faucet: {
      do: { tap: 'faucet' },
      how: 'Toque na torneira.',
      effects: [
        { frame: 'faucet', image: 'faucet-open' },
        { show: 'water', grow: true },
        { drops: 4, on: 'hands' },
        { frame: 'hands', image: 'hands-wet' },
        { wait: 400 },
        { hide: 'water' },
        { frame: 'faucet', image: 'faucet-closed' },
      ],
    },
    soap: {
      do: { drag: 'soap', to: 'hands' },
      how: 'Arraste o sabão até as mãos.',
      effects: [{ bubbles: 3 }],
    },
    scrub: {
      do: { rub: 'hands', times: 6 },
      how: 'Passe o dedo nas mãos, de um lado para o outro.',
      each: [{ nudge: 'hands', image: 'hands-rub-wet' }, { bubbles: 1 }],
      effects: [{ settle: 'hands', image: 'hands-wet' }, { bubbles: 3 }],
    },
    rinse: {
      do: { tap: 'faucet' },
      how: 'Toque na torneira.',
      effects: [
        { frame: 'faucet', image: 'faucet-open' },
        { show: 'water', grow: true },
        { together: [{ popBubbles: true }, { drops: 4, on: 'hands' }] },
        { frame: 'hands', image: 'hands-rinsed' },
        { wait: 300 },
        { hide: 'water' },
        { frame: 'faucet', image: 'faucet-closed' },
      ],
    },
    towel: {
      do: { drag: 'towel', to: 'hands' },
      how: 'Arraste a toalha até as mãos.',
      effects: [{ frame: 'hands', image: 'hands-clean' }, { sparkles: 3, on: 'hands' }],
    },
  },
});
