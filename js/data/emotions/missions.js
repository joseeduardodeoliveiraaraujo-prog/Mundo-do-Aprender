/**
 * Missões com peças (somente dados) — quebra-cabeça "peça → lugar"
 * (components/placementBoard.js). Lógica em js/games/emotions/.
 *
 *   matchEmotions  levar rostos até o balão de cada personagem.
 *                  pieces: ids de emoção; cards: [{ id, name, image, portrait, situation,
 *                  accepts, fits: { [emoção]: fala }, otherwise, hint }]
 *                  portrait: parte da cena (em %) mostrada como retrato do personagem.
 *                  Cada personagem RESPONDE quando recebe um rosto. Só fica no balão
 *                  um rosto de `accepts`; os outros voltam para a caixa.
 *   arrangeScene   arrumar uma cena: levar objetos até lugares vazios.
 *                  spots: [{ id, label, x, y }] (centro do lugar, em % da cena)
 *                  items: [{ id, label, image, helps, reaction }]
 *                  Cada objeto RESPONDE quando é colocado (reaction).
 *
 * Não há limite de missões: para criar outra, acrescente um objeto com um
 * desses tipos e inclua-o na lista de atividades em ../emotions.js.
 */

const FACES = 'assets/images/emotions/faces';
const SCENES = 'assets/images/emotions/scenes';
const OBJECTS = 'assets/images/emotions/objects';

export const matchFeelingsMission = Object.freeze({
  id: 'emotions-match-feelings',
  type: 'matchEmotions',
  part: 'situation',
  title: 'Cada um com seu sentimento',
  instruction: 'Segure um rosto e arraste até o balão de um amigo. Solte e veja o que ele responde.',
  pieces: ['sadness', 'fear', 'calm', 'happiness'],
  cards: [
    {
      id: 'marina',
      name: 'Marina',
      image: `${SCENES}/lost-toy.svg`,
      portrait: { x: 23, y: 18, w: 19, h: 32 },
      situation: 'Perdeu o ursinho favorito.',
      accepts: ['sadness'],
      fits: { sadness: 'É isso. Estou triste porque meu ursinho sumiu.' },
      otherwise: 'Hum... acho que não. Meu ursinho favorito sumiu.',
      hint: 'Marina perdeu algo de que gostava muito.',
    },
    {
      id: 'davi',
      name: 'Davi',
      image: `${SCENES}/loud-noise.svg`,
      portrait: { x: 34, y: 12, w: 19, h: 32 },
      situation: 'Ouviu um BUM no meio da noite.',
      accepts: ['fear'],
      fits: { fear: 'É isso. Aquele barulho me deu medo.' },
      otherwise: 'Hum... acho que não. O barulho foi muito alto e de repente.',
      hint: 'Davi ouviu um barulho muito alto, no escuro.',
    },
    {
      id: 'pedro',
      name: 'Pedro',
      image: `${SCENES}/calm-music.svg`,
      portrait: { x: 17, y: 40, w: 22, h: 30 },
      situation: 'Ouve sua música preferida, bem baixinho.',
      accepts: ['calm', 'happiness'],
      fits: {
        calm: 'É isso. Estou calmo, descansando com a minha música.',
        happiness: 'É isso também. Fico feliz ouvindo a música de que gosto.',
      },
      otherwise: 'Hum... acho que não. Estou descansando e ouvindo música.',
      hint: 'Pedro está descansando e ouvindo a música de que mais gosta.',
    },
  ],
  success: 'Você ajudou cada amigo a mostrar o que sente. Um rosto ficou sobrando: tudo bem!',
});

export const calmCornerMission = Object.freeze({
  id: 'emotions-calm-corner',
  type: 'arrangeScene',
  part: 'express',
  title: 'O cantinho da calma',
  instruction: 'Arrume o cantinho da calma. Toque em um objeto e depois em um lugar com +.',
  scene: {
    src: `${SCENES}/calm-corner.svg`,
    alt: 'Um cantinho de uma sala, com janela, pufe verde, mesinha e estante. Há quatro lugares vazios.',
    width: 480,
    height: 300,
  },
  spots: [
    { id: 'window', label: 'Perto da janela', x: 23, y: 37 },
    { id: 'puff', label: 'No pufe', x: 25, y: 74 },
    { id: 'table', label: 'Na mesinha', x: 55, y: 58 },
    { id: 'shelf', label: 'Na estante', x: 82, y: 25 },
  ],
  items: [
    { id: 'cushion', label: 'Almofada', image: `${OBJECTS}/cushion.svg`, helps: true, reaction: 'A almofada é macia. Dá para abraçar quando o coração fica apertado.' },
    { id: 'headphones', label: 'Fones', image: `${OBJECTS}/headphones.svg`, helps: true, reaction: 'Os fones deixam os barulhos mais baixinhos.' },
    { id: 'drum', label: 'Tambor', image: `${OBJECTS}/drum.svg`, helps: false, reaction: 'O tambor faz muito barulho. Para se acalmar, sons baixinhos ajudam mais. Você pode devolvê-lo para a caixa.' },
    { id: 'book', label: 'Livro', image: `${OBJECTS}/book.svg`, helps: true, reaction: 'Olhar um livro devagar ajuda a respirar com calma.' },
    { id: 'squeezeBall', label: 'Bolinha de apertar', image: `${OBJECTS}/squeeze-ball.svg`, helps: true, reaction: 'Apertar e soltar a bolinha ajuda o corpo a relaxar.' },
  ],
  hints: {
    noisy: 'Tem um objeto barulhento no cantinho. Toque nele e depois em "Devolver para a caixa".',
    empty: 'Ainda tem lugar com +. Escolha algo que ajuda a ficar calmo.',
  },
  success: 'O cantinho da calma está pronto! Quando precisar, um cantinho assim pode ajudar você a se acalmar.',
});
