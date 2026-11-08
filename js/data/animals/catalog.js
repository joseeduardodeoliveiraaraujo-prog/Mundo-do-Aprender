/**
 * Catálogo de "Explorando os Animais" (somente dados): animais, habitats,
 * cenários e regiões da exploração. Caminhos relativos ao index.html.
 *
 * SONS: nenhum arquivo de som está incluído ainda (ver assets/sounds/animals/README.md).
 * Enquanto `sound.file` for null, o botão "Ouvir o som" usa a voz do aparelho
 * para imitar o som (`sound.text`), e "Ver o som escrito" mostra o texto.
 * Para usar uma gravação, coloque o arquivo na pasta e preencha `file`.
 *
 * Ilustrações: originais do projeto (ver assets/images/animals/CREDITS.md).
 */

const IMG = 'assets/images/animals';
const SND = 'assets/sounds/animals';
export const animalImage = (id) => `${IMG}/animals/${id}.svg`;
export const habitatImage = (id) => `${IMG}/habitats/${id}.svg`;
export const foodImage = (id) => `${IMG}/foods/${id}.svg`;
const sceneImage = (id) => `${IMG}/scenes/${id}.svg`;

/**
 * Os 12 animais do módulo.
 * - fact: explicação curta. home: onde vive (com imagem). food: o que come (com imagem).
 * - sound.file: caminho do arquivo quando existir (hoje: null, ver acima).
 * - sound.expectedFile: nome esperado do arquivo (documentação para quem for incluir).
 */
export const animals = Object.freeze({
  dog: {
    name: 'Cachorro', image: animalImage('dog'),
    fact: 'O cachorro tem um olfato muito bom: sente cheiros de longe.',
    home: { text: 'Em casa, com as pessoas', image: habitatImage('house') },
    food: { text: 'Ração', image: foodImage('pet-food') },
    sound: { text: 'Au au!', file: null, expectedFile: `${SND}/dog.mp3` },
  },
  cat: {
    name: 'Gato', image: animalImage('cat'),
    fact: 'O gato usa os bigodes para sentir o que está perto dele.',
    home: { text: 'Em casa, com as pessoas', image: habitatImage('house') },
    food: { text: 'Ração', image: foodImage('pet-food') },
    sound: { text: 'Miau!', file: null, expectedFile: `${SND}/cat.mp3` },
  },
  cow: {
    name: 'Vaca', image: animalImage('cow'),
    fact: 'A vaca vive na fazenda e passa boa parte do dia comendo capim.',
    home: { text: 'Na fazenda', image: habitatImage('farm') },
    food: { text: 'Capim', image: foodImage('grass') },
    sound: { text: 'Muuu!', file: null, expectedFile: `${SND}/cow.mp3` },
  },
  horse: {
    name: 'Cavalo', image: animalImage('horse'),
    fact: 'O cavalo é forte e corre muito rápido.',
    home: { text: 'Na fazenda', image: habitatImage('farm') },
    food: { text: 'Capim e feno', image: foodImage('grass') },
    sound: { text: 'Iiirrí!', file: null, expectedFile: `${SND}/horse.mp3` },
  },
  chicken: {
    name: 'Galinha', image: animalImage('chicken'),
    fact: 'A galinha bota ovos.',
    home: { text: 'Na fazenda', image: habitatImage('farm') },
    food: { text: 'Milho e sementes', image: foodImage('corn') },
    sound: { text: 'Có, có, có!', file: null, expectedFile: `${SND}/chicken.mp3` },
  },
  duck: {
    name: 'Pato', image: animalImage('duck'),
    fact: 'O pato tem penas que não deixam a água entrar. Ele nada muito bem.',
    home: { text: 'Na água e perto dela', image: habitatImage('water') },
    food: { text: 'Plantas e sementes', image: foodImage('water-plants') },
    sound: { text: 'Quá, quá!', file: null, expectedFile: `${SND}/duck.mp3` },
  },
  lion: {
    name: 'Leão', image: animalImage('lion'),
    fact: 'O leão vive em grupos chamados bandos.',
    home: { text: 'Na savana', image: habitatImage('savanna') },
    food: { text: 'Carne', image: foodImage('meat') },
    sound: { text: 'Roarr!', file: null, expectedFile: `${SND}/lion.mp3` },
  },
  elephant: {
    name: 'Elefante', image: animalImage('elephant'),
    fact: 'O elefante tem uma tromba comprida e orelhas bem grandes.',
    home: { text: 'Na savana', image: habitatImage('savanna') },
    food: { text: 'Capim, folhas e frutas', image: foodImage('grass') },
    sound: { text: 'Fuuu!', file: null, expectedFile: `${SND}/elephant.mp3` },
  },
  monkey: {
    name: 'Macaco', image: animalImage('monkey'),
    fact: 'O macaco usa as mãos e os pés para segurar os galhos das árvores.',
    home: { text: 'Na floresta', image: habitatImage('forest') },
    food: { text: 'Frutas', image: foodImage('banana') },
    sound: { text: 'Uh, uh, ah, ah!', file: null, expectedFile: `${SND}/monkey.mp3` },
  },
  giraffe: {
    name: 'Girafa', image: animalImage('giraffe'),
    fact: 'A girafa tem um pescoço muito comprido.',
    home: { text: 'Na savana', image: habitatImage('savanna') },
    food: { text: 'Folhas das árvores', image: foodImage('leaves') },
    sound: { text: '(A girafa quase não faz barulho.)', file: null, expectedFile: null },
  },
  fish: {
    name: 'Peixe', image: animalImage('fish'),
    fact: 'O peixe respira dentro da água usando as guelras.',
    home: { text: 'Na água', image: habitatImage('water') },
    food: { text: 'Plantas e bichinhos da água', image: foodImage('water-plants') },
    sound: { text: '(O peixe não faz barulho que a gente escute.)', file: null, expectedFile: null },
  },
  turtle: {
    name: 'Tartaruga', image: animalImage('turtle'),
    fact: 'A tartaruga tem um casco duro que protege o corpo.',
    home: { text: 'Na água ou na terra', image: habitatImage('water') },
    food: { text: 'Plantas e bichinhos', image: foodImage('leaves') },
    sound: { text: '(A tartaruga quase não faz barulho.)', file: null, expectedFile: null },
  },
});

/** Artigo de cada animal ("o" leão, "a" vaca), usado nas mensagens. */
export const articles = Object.freeze({
  dog: 'o', cat: 'o', cow: 'a', horse: 'o', chicken: 'a', duck: 'o',
  lion: 'o', elephant: 'o', monkey: 'o', giraffe: 'a', fish: 'o', turtle: 'a',
});

export const habitats = Object.freeze({
  farm: { name: 'Fazenda', image: habitatImage('farm') },
  savanna: { name: 'Savana', image: habitatImage('savanna') },
  water: { name: 'Água', image: habitatImage('water') },
  house: { name: 'Casa', image: habitatImage('house') },
  forest: { name: 'Floresta', image: habitatImage('forest') },
});

/**
 * Regiões da exploração. Cada animal fica em (x, y): centro, em % do cenário.
 * Para colocar outro animal em uma região, acrescente uma linha em `animals`.
 */
export const regions = Object.freeze({
  farm: {
    scene: { src: sceneImage('farm'), alt: 'Fazenda com celeiro, cerca, pasto e um laguinho.' },
    animals: [{ id: 'cow', x: 16, y: 72 }, { id: 'horse', x: 40, y: 72 }, { id: 'chicken', x: 64, y: 54 }, { id: 'duck', x: 86, y: 58 }],
  },
  savanna: {
    scene: { src: sceneImage('savanna'), alt: 'Savana com capim seco, sol e árvores espalhadas.' },
    animals: [{ id: 'lion', x: 20, y: 72 }, { id: 'elephant', x: 50, y: 62 }, { id: 'giraffe', x: 80, y: 66 }],
  },
  river: {
    scene: { src: sceneImage('river'), alt: 'Floresta com árvores e um rio passando na frente.' },
    animals: [{ id: 'monkey', x: 20, y: 34 }, { id: 'turtle', x: 48, y: 74 }, { id: 'fish', x: 80, y: 74 }],
  },
  house: {
    scene: { src: sceneImage('house'), alt: 'Sala de uma casa com sofá, janela, mesa e tapete.' },
    animals: [{ id: 'cat', x: 22, y: 42 }, { id: 'dog', x: 52, y: 74 }],
  },
});

/** Regiões do mapa. Terminar todas as atividades de uma região dá a figurinha. */
export const parts = Object.freeze([
  { id: 'farm', title: 'Fazenda', description: 'Conheça quem vive na fazenda.', sticker: { label: 'Amigos da fazenda', image: animalImage('cow') } },
  { id: 'savanna', title: 'Savana', description: 'Encontre e alimente os animais.', sticker: { label: 'Amigos da savana', image: animalImage('lion') } },
  { id: 'river', title: 'Rio e floresta', description: 'Procure quem está entre as árvores e na água.', sticker: { label: 'Amigos do rio', image: animalImage('turtle') } },
  { id: 'house', title: 'Em casa', description: 'Descubra quem mora com as pessoas.', sticker: { label: 'Amigos de casa', image: animalImage('dog') } },
  { id: 'homes', title: 'Cada um no seu lugar', description: 'Ajude os animais a chegar onde vivem.', sticker: { label: 'Guia dos animais', image: animalImage('monkey') } },
]);
