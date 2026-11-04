/**
 * Dados do módulo "Explorando os Animais" (somente dados, sem lógica).
 *
 * Tipos de atividade (a lógica está em js/games/animals.js):
 *   identify  animal: id; options: ids de animais (resposta = animal)
 *   sound     animal: id; options: ids de animais (resposta = animal)
 *   habitat   habitats: ids; animals: [{ id, accepts: [habitats], hint }]
 *   learn     animal; facts: [{ text, image? }]; question; options: [{ id, label, image? }]; answer
 *
 * SONS: nenhum arquivo de som está incluído ainda (ver assets/sounds/animals/README.md).
 * Enquanto `sound.file` for null, o botão "Ouvir o som" usa a voz do aparelho
 * para imitar o som (`sound.text`), e "Ver o som escrito" mostra o texto.
 * Para usar uma gravação, coloque o arquivo na pasta e preencha `file`.
 *
 * Caminhos são relativos ao index.html. Ilustrações: originais do projeto
 * (ver assets/images/animals/CREDITS.md).
 */

const IMG = 'assets/images/animals';
const SND = 'assets/sounds/animals';
const animalImage = (id) => `${IMG}/animals/${id}.svg`;
const habitatImage = (id) => `${IMG}/habitats/${id}.svg`;
const foodImage = (id) => `${IMG}/foods/${id}.svg`;

/**
 * Os 12 animais do módulo.
 * - fact: explicação curta mostrada ao reconhecer o animal.
 * - sound.file: caminho do arquivo quando existir (hoje: null, ver acima).
 * - sound.expectedFile: nome esperado do arquivo (documentação para quem for incluir).
 */
const animals = Object.freeze({
  dog: {
    name: 'Cachorro', image: animalImage('dog'),
    fact: 'O cachorro tem um olfato muito bom: sente cheiros de longe.',
    sound: { text: 'Au au!', file: null, expectedFile: `${SND}/dog.mp3` },
  },
  cat: {
    name: 'Gato', image: animalImage('cat'),
    fact: 'O gato usa os bigodes para sentir o que está perto dele.',
    sound: { text: 'Miau!', file: null, expectedFile: `${SND}/cat.mp3` },
  },
  cow: {
    name: 'Vaca', image: animalImage('cow'),
    fact: 'A vaca vive na fazenda e passa boa parte do dia comendo capim.',
    sound: { text: 'Muuu!', file: null, expectedFile: `${SND}/cow.mp3` },
  },
  horse: {
    name: 'Cavalo', image: animalImage('horse'),
    fact: 'O cavalo é forte e corre muito rápido. Ele come capim e feno.',
    sound: { text: 'Iiirrí!', file: null, expectedFile: `${SND}/horse.mp3` },
  },
  chicken: {
    name: 'Galinha', image: animalImage('chicken'),
    fact: 'A galinha bota ovos e come milho e sementes.',
    sound: { text: 'Có, có, có!', file: null, expectedFile: `${SND}/chicken.mp3` },
  },
  duck: {
    name: 'Pato', image: animalImage('duck'),
    fact: 'O pato tem penas que não deixam a água entrar. Ele nada muito bem.',
    sound: { text: 'Quá, quá!', file: null, expectedFile: `${SND}/duck.mp3` },
  },
  lion: {
    name: 'Leão', image: animalImage('lion'),
    fact: 'O leão vive em grupos chamados bandos.',
    sound: { text: 'Roarr!', file: null, expectedFile: `${SND}/lion.mp3` },
  },
  elephant: {
    name: 'Elefante', image: animalImage('elephant'),
    fact: 'O elefante tem uma tromba comprida e orelhas bem grandes.',
    sound: { text: 'Fuuu!', file: null, expectedFile: `${SND}/elephant.mp3` },
  },
  monkey: {
    name: 'Macaco', image: animalImage('monkey'),
    fact: 'O macaco usa as mãos e os pés para segurar os galhos das árvores.',
    sound: { text: 'Uh, uh, ah, ah!', file: null, expectedFile: `${SND}/monkey.mp3` },
  },
  giraffe: {
    name: 'Girafa', image: animalImage('giraffe'),
    fact: 'A girafa tem um pescoço muito comprido.',
    sound: { text: '(A girafa quase não faz barulho.)', file: null, expectedFile: null },
  },
  fish: {
    name: 'Peixe', image: animalImage('fish'),
    fact: 'O peixe respira dentro da água usando as guelras.',
    sound: { text: '(O peixe não faz barulho que a gente escute.)', file: null, expectedFile: null },
  },
  turtle: {
    name: 'Tartaruga', image: animalImage('turtle'),
    fact: 'A tartaruga tem um casco duro que protege o corpo.',
    sound: { text: '(A tartaruga quase não faz barulho.)', file: null, expectedFile: null },
  },
});

const habitats = Object.freeze({
  farm: { name: 'Fazenda', image: habitatImage('farm') },
  savanna: { name: 'Savana', image: habitatImage('savanna') },
  water: { name: 'Água', image: habitatImage('water') },
  house: { name: 'Casa', image: habitatImage('house') },
  forest: { name: 'Floresta', image: habitatImage('forest') },
});

const parts = Object.freeze([
  { id: 'identify', title: 'Que animal é esse?', description: 'Olhe a ilustração e escolha o nome do animal.' },
  { id: 'sound', title: 'Descobrindo os sons', description: 'Ouça ou leia o som e descubra qual animal faz esse som.' },
  { id: 'habitat', title: 'Onde vive esse animal?', description: 'Escolha o lugar onde cada animal vive.' },
  { id: 'learn', title: 'Conhecendo os animais', description: 'Leia curiosidades sobre os animais e o que eles comem.' },
]);

const activities = Object.freeze([
  // ---------- Parte 1: Que animal é esse? ----------
  {
    id: 'animals-identify-elephant', type: 'identify', part: 'identify',
    title: 'Que animal é esse?',
    instruction: 'Olhe a ilustração. Qual é o nome deste animal?',
    animal: 'elephant',
    imageAlt: 'Um animal cinza com orelhas muito grandes, uma tromba comprida e duas presas brancas.',
    options: ['horse', 'elephant', 'giraffe'],
    hint: 'Veja a tromba comprida no meio do rosto. Você pode escolher de novo.',
  },
  {
    id: 'animals-identify-turtle', type: 'identify', part: 'identify',
    title: 'Que animal é esse?',
    instruction: 'Olhe a ilustração. Qual é o nome deste animal?',
    animal: 'turtle',
    imageAlt: 'Um animal verde com um casco duro nas costas, patas curtas e cabeça pequena.',
    options: ['turtle', 'duck', 'fish'],
    hint: 'Veja o casco duro nas costas. Você pode escolher de novo.',
  },
  {
    id: 'animals-identify-monkey', type: 'identify', part: 'identify',
    title: 'Que animal é esse?',
    instruction: 'Olhe a ilustração. Qual é o nome deste animal?',
    animal: 'monkey',
    imageAlt: 'Um animal marrom com orelhas redondas dos lados da cabeça e o rosto mais claro.',
    options: ['cat', 'lion', 'monkey'],
    hint: 'Veja as orelhas redondas dos lados e o rosto claro. Você pode escolher de novo.',
  },

  // ---------- Parte 2: Descobrindo os sons ----------
  {
    id: 'animals-sound-cow', type: 'sound', part: 'sound',
    title: 'De quem é este som?',
    instruction: 'Toque em "Ouvir o som" ou em "Ver o som escrito". Depois, escolha o animal que faz esse som.',
    animal: 'cow',
    options: ['dog', 'cow', 'chicken'],
    hint: 'Esse som é "Muuu". Pense em um animal grande que vive na fazenda. Você pode escolher de novo.',
  },
  {
    id: 'animals-sound-chicken', type: 'sound', part: 'sound',
    title: 'De quem é este som?',
    instruction: 'Toque em "Ouvir o som" ou em "Ver o som escrito". Depois, escolha o animal que faz esse som.',
    animal: 'chicken',
    options: ['duck', 'chicken', 'cat'],
    hint: 'Esse som é "Có, có, có". Pense em uma ave que bota ovos. Você pode escolher de novo.',
  },
  {
    id: 'animals-sound-cat', type: 'sound', part: 'sound',
    title: 'De quem é este som?',
    instruction: 'Toque em "Ouvir o som" ou em "Ver o som escrito". Depois, escolha o animal que faz esse som.',
    animal: 'cat',
    options: ['cat', 'horse', 'dog'],
    hint: 'Esse som é "Miau". Pense em um animal pequeno que tem bigodes. Você pode escolher de novo.',
  },

  // ---------- Parte 3: Onde vive esse animal? ----------
  {
    id: 'animals-habitat-farm-savanna', type: 'habitat', part: 'habitat',
    title: 'Fazenda ou savana?',
    instruction: 'Para cada animal, escolha onde ele vive. Depois, toque em "Conferir".',
    habitats: ['farm', 'savanna'],
    animals: [
      { id: 'cow', accepts: ['farm'], hint: 'A vaca costuma viver perto das pessoas, em lugares com pasto.' },
      { id: 'lion', accepts: ['savanna'], hint: 'O leão vive solto, em lugares com muito capim e poucas árvores.' },
      { id: 'horse', accepts: ['farm'], hint: 'Muitos cavalos vivem com as pessoas, em lugares com pasto e cerca.' },
      { id: 'giraffe', accepts: ['savanna'], hint: 'A girafa vive solta, perto de árvores altas e espalhadas.' },
    ],
    success: 'A vaca e o cavalo vivem em fazendas, cuidados por pessoas. O leão e a girafa vivem soltos na savana, na África.',
  },
  {
    id: 'animals-habitat-water-house-forest', type: 'habitat', part: 'habitat',
    title: 'Água, casa ou floresta?',
    instruction: 'Para cada animal, escolha onde ele vive. Depois, toque em "Conferir".',
    habitats: ['water', 'house', 'forest'],
    animals: [
      { id: 'fish', accepts: ['water'], hint: 'O peixe respira dentro da água.' },
      { id: 'dog', accepts: ['house'], hint: 'Muitos cachorros vivem junto com as pessoas.' },
      { id: 'monkey', accepts: ['forest'], hint: 'O macaco gosta de subir nos galhos das árvores.' },
      { id: 'turtle', accepts: ['water', 'forest'], hint: 'Algumas tartarugas vivem na água e outras vivem na terra.' },
    ],
    success: 'O peixe vive na água, o cachorro vive em casa com as pessoas e o macaco vive na floresta. Algumas tartarugas vivem na água e outras, como o jabuti, vivem na terra.',
  },

  // ---------- Parte 4: Conhecendo os animais ----------
  {
    id: 'animals-learn-elephant', type: 'learn', part: 'learn',
    title: 'Conhecendo o elefante',
    animal: 'elephant',
    instruction: 'Leia as informações sobre o elefante. Depois, responda: o que o elefante usa para pegar a comida?',
    facts: [
      { text: 'O elefante é o maior animal que vive em terra firme.' },
      { text: 'Ele usa a tromba para pegar a comida e para beber água.' },
      { text: 'Ele come plantas: capim, folhas e frutas.', image: foodImage('grass') },
    ],
    options: [{ id: 'tail', label: 'O rabo' }, { id: 'trunk', label: 'A tromba' }, { id: 'ears', label: 'As orelhas' }],
    answer: 'trunk',
    hint: 'Leia de novo a segunda informação. Você pode escolher de novo.',
    explanation: 'A tromba funciona como uma mão: pega a comida e leva a água até a boca.',
  },
  {
    id: 'animals-learn-giraffe', type: 'learn', part: 'learn',
    title: 'Conhecendo a girafa',
    animal: 'giraffe',
    instruction: 'Leia as informações sobre a girafa. Depois, responda: o que a girafa come?',
    facts: [
      { text: 'A girafa é o animal mais alto do mundo.' },
      { text: 'O pescoço comprido ajuda a girafa a alcançar o alto das árvores.' },
      { text: 'Ela come folhas das árvores.', image: foodImage('leaves') },
    ],
    options: [
      { id: 'meat', label: 'Carne', image: foodImage('meat') },
      { id: 'fish', label: 'Peixe', image: foodImage('fish-food') },
      { id: 'leaves', label: 'Folhas', image: foodImage('leaves') },
    ],
    answer: 'leaves',
    hint: 'Leia de novo a última informação. Você pode escolher de novo.',
    explanation: 'A girafa come folhas, principalmente das árvores altas que outros animais não alcançam.',
  },
  {
    id: 'animals-learn-lion', type: 'learn', part: 'learn',
    title: 'Conhecendo o leão',
    animal: 'lion',
    instruction: 'Leia as informações sobre o leão. Depois, responda: o que o leão come?',
    facts: [
      { text: 'O leão vive na savana, em grupos chamados bandos.' },
      { text: 'Ele come carne de outros animais.', image: foodImage('meat') },
      { text: 'O leão dorme e descansa muitas horas por dia.' },
    ],
    options: [
      { id: 'banana', label: 'Banana', image: foodImage('banana') },
      { id: 'meat', label: 'Carne', image: foodImage('meat') },
      { id: 'grass', label: 'Capim', image: foodImage('grass') },
    ],
    answer: 'meat',
    hint: 'Leia de novo a segunda informação. Você pode escolher de novo.',
    explanation: 'Animais que comem carne são chamados de carnívoros. O leão é um deles.',
  },
]);

const messages = Object.freeze({
  progress: 'Você fez {completed} de {total} atividades.',
  choicesLabel: 'Escolha uma resposta',
  intro: {
    title: 'Vamos explorar os animais',
    text: 'Você vai reconhecer animais, descobrir seus sons, ver onde eles vivem e aprender curiosidades. São quatro partes, com uma atividade de cada vez.',
    note: 'Todas as atividades podem ser feitas sem som. Nenhum som toca sozinho: só quando você tocar no botão.',
    soundHint: 'Para ouvir os sons e as instruções, ligue os sons em Configurações.',
    start: 'Começar',
    resume: 'Continuar de onde parei',
    restart: 'Começar do início',
  },
  answer: {
    success: 'Isso! É {article} {animal}.',
    retry: 'Vamos olhar com calma mais uma vez.',
    soundRetry: 'Vamos ouvir ou ler o som mais uma vez.',
    learnSuccess: 'Isso mesmo!',
  },
  habitat: {
    question: 'Onde vive {article} {animal}?',
    check: 'Conferir',
    successTitle: 'Muito bem!',
    retryTitle: 'Quase lá! Vamos conferir juntos.',
    missing: 'Ainda falta escolher onde vive: {animals}.',
    retryEnd: 'Você pode mudar e conferir de novo.',
  },
  learn: {
    factsLabel: 'Informações',
  },
  completion: {
    title: 'Você chegou ao fim de Explorando os Animais!',
    text: 'Você conheceu doze animais, seus sons, onde vivem e o que comem.',
    pending: 'Algumas atividades ainda podem ser feitas, quando você quiser.',
    doPending: 'Fazer as que faltam',
    again: 'Fazer tudo de novo',
  },
});

/** Artigo de cada animal ("o" leão, "a" vaca), usado nas mensagens. */
const articles = Object.freeze({
  dog: 'o', cat: 'o', cow: 'a', horse: 'o', chicken: 'a', duck: 'o',
  lion: 'o', elephant: 'o', monkey: 'o', giraffe: 'a', fish: 'o', turtle: 'a',
});

export const animalsData = Object.freeze({
  moduleId: 'animals',
  version: 2,
  animals,
  articles,
  habitats,
  parts,
  activities,
  messages,
});
