/**
 * Dados do módulo "Minha Rotina" (somente dados, sem lógica).
 *
 * Cuidados pedagógicos refletidos no conteúdo:
 * - Sequências são EXEMPLOS flexíveis: cada uma tem poucas regras
 *   (ex.: "acordar vem primeiro") em vez de uma única ordem certa.
 *   Uma das sequências não tem regra nenhuma.
 * - Objetos da mochila têm três níveis: essential (ajuda muito),
 *   optional (pode ajudar — aceito com ou sem) e notNeeded (pode ficar em casa).
 * - Nenhuma mensagem diz "errado"; sempre há uma pista e um convite.
 *
 * Tipos de atividade (a lógica está em js/games/routine.js):
 *   sequence  cards: ids de `cards`; initialOrder; rules: first | last | before
 *   pack      items: [{ id, need, hint? }] (ids de `objects`)
 *   choice    options: [{ id, label, image, fit: likely|possible|unlikely, message }]
 *
 * Caminhos de imagem são relativos ao index.html.
 */

const IMG = 'assets/images/routine';
const image = (name) => `${IMG}/${name}.svg`;

/** Cartões de atividades do dia (conteúdos do módulo). */
const cards = Object.freeze({
  wakeUp: { label: 'Acordar', image: image('wake-up') },
  hygiene: { label: 'Fazer a higiene', image: image('wash') },
  brushTeeth: { label: 'Escovar os dentes', image: image('toothbrush') },
  breakfast: { label: 'Tomar café', image: image('breakfast') },
  clothes: { label: 'Escolher a roupa', image: image('clothes') },
  school: { label: 'Ir à escola', image: image('school') },
  materials: { label: 'Organizar os materiais', image: image('materials') },
  homework: { label: 'Fazer a tarefa da escola', image: image('homework') },
  rest: { label: 'Descansar', image: image('rest') },
  backpack: { label: 'Preparar a mochila para amanhã', image: image('backpack') },
  play: { label: 'Brincar', image: image('play') },
  tidy: { label: 'Arrumar o quarto', image: image('tidy') },
  shower: { label: 'Tomar banho', image: image('shower') },
});

/** Objetos que podem ir (ou não) na mochila. */
const objects = Object.freeze({
  notebook: { label: 'Caderno de desenho', image: image('notebook') },
  pencil: { label: 'Lápis', image: image('pencil') },
  coloredPencils: { label: 'Lápis de cor', image: image('colored-pencils') },
  pencilCase: { label: 'Estojo', image: image('pencil-case') },
  waterBottle: { label: 'Garrafa de água', image: image('water-bottle') },
  snack: { label: 'Lanche', image: image('snack') },
  pillow: { label: 'Travesseiro', image: image('pillow') },
  videogame: { label: 'Controle de videogame', image: image('videogame') },
  sneakers: { label: 'Tênis', image: image('sneakers') },
  towel: { label: 'Toalhinha', image: image('towel') },
  cap: { label: 'Boné', image: image('cap') },
});

const parts = Object.freeze([
  { id: 'day', title: 'Organizando meu dia', description: 'Coloque os cartões na ordem que faz sentido para você.' },
  { id: 'backpack', title: 'Preparando minha mochila', description: 'Escolha o que pode ajudar em cada aula.' },
  { id: 'what', title: 'O que preciso fazer?', description: 'Pense no que pode ajudar em situações do dia a dia.' },
  { id: 'tasks', title: 'Organizando minhas tarefas', description: 'Monte a sua lista de tarefas, do seu jeito.' },
]);

const activities = Object.freeze([
  // ---------- Parte 1: Organizando meu dia ----------
  {
    id: 'routine-sequence-morning',
    type: 'sequence',
    part: 'day',
    title: 'Minha manhã',
    instruction: 'Coloque os cartões na ordem em que você faria estas atividades de manhã. Você pode arrastar os cartões ou usar as setas.',
    cards: ['brushTeeth', 'school', 'breakfast', 'wakeUp', 'clothes', 'hygiene'],
    rules: [
      { type: 'first', card: 'wakeUp', hint: 'Pense no começo da manhã: o que acontece antes de tudo?' },
      { type: 'last', card: 'school', hint: 'Pense no fim da manhã: o que a gente faz depois de estar pronto?' },
    ],
    success: 'Escovar os dentes antes ou depois do café, por exemplo, depende de cada pessoa. Esta é só uma forma de organizar.',
  },

  // ---------- Parte 2: Preparando minha mochila ----------
  {
    id: 'routine-pack-drawing',
    type: 'pack',
    part: 'backpack',
    title: 'Aula de desenho',
    instruction: 'Hoje tem aula de desenho. Toque nos objetos que você colocaria na mochila. Para tirar, toque de novo.',
    items: [
      { id: 'notebook', need: 'essential', hint: 'Onde você vai fazer o desenho?' },
      { id: 'pillow', need: 'notNeeded', hint: 'O travesseiro pode ficar em casa hoje.' },
      { id: 'coloredPencils', need: 'essential', hint: 'Para colorir o desenho, o que pode ajudar?' },
      { id: 'waterBottle', need: 'optional' },
      { id: 'videogame', need: 'notNeeded', hint: 'O controle de videogame pode ficar em casa hoje.' },
      { id: 'pencil', need: 'optional' },
    ],
    success: 'Você escolheu o que ajuda na aula de desenho. Outros objetos, como água ou lápis, também podem ser úteis.',
  },
  {
    id: 'routine-pack-sports',
    type: 'pack',
    part: 'backpack',
    title: 'Aula de educação física',
    instruction: 'Hoje tem aula de educação física. Toque nos objetos que você colocaria na mochila. Para tirar, toque de novo.',
    items: [
      { id: 'cap', need: 'optional' },
      { id: 'sneakers', need: 'essential', hint: 'Para correr e pular, o que vai nos pés?' },
      { id: 'videogame', need: 'notNeeded', hint: 'O controle de videogame pode ficar em casa hoje.' },
      { id: 'waterBottle', need: 'essential', hint: 'Depois de se mexer bastante, dá sede. O que pode ajudar?' },
      { id: 'towel', need: 'optional' },
      { id: 'pillow', need: 'notNeeded', hint: 'O travesseiro pode ficar em casa hoje.' },
    ],
    success: 'Você escolheu o que ajuda na educação física. Toalhinha e boné também podem ser úteis, se você quiser.',
  },

  // ---------- Parte 3: O que preciso fazer? ----------
  {
    id: 'routine-choice-dirty-hands',
    type: 'choice',
    part: 'what',
    title: 'Hora do lanche',
    instruction: 'Está na hora do lanche e suas mãos estão sujas. O que você pode fazer?',
    options: [
      { id: 'eat', label: 'Comer assim mesmo', image: image('snack'), fit: 'unlikely', message: 'Com as mãos sujas, a sujeira pode ir para a comida. Você pode escolher outra resposta.' },
      { id: 'washHands', label: 'Lavar as mãos', image: image('wash-hands'), fit: 'likely', message: 'Lavar as mãos com água e sabão deixa as mãos limpas para comer.' },
      { id: 'gel', label: 'Usar álcool em gel', image: image('gel'), fit: 'possible', message: 'Quando não tem pia por perto, o álcool em gel pode ajudar.' },
    ],
  },
  {
    id: 'routine-choice-tired',
    type: 'choice',
    part: 'what',
    title: 'Depois da escola',
    instruction: 'Você chegou da escola e está muito cansado. O que pode ajudar?',
    options: [
      { id: 'rest', label: 'Descansar um pouco', image: image('rest'), fit: 'likely', message: 'Descansar um pouco ajuda o corpo a recuperar a energia.' },
      { id: 'water', label: 'Beber água', image: image('water-bottle'), fit: 'possible', message: 'Beber água também pode ajudar quando estamos cansados.' },
      { id: 'hurry', label: 'Fazer tudo bem rápido', image: image('hurry'), fit: 'unlikely', message: 'Quando estamos cansados, fazer tudo correndo pode ficar mais difícil. Você pode escolher outra resposta.' },
    ],
  },
  {
    id: 'routine-choice-next-activity',
    type: 'choice',
    part: 'what',
    title: 'E agora?',
    instruction: 'Você não lembra qual é a próxima atividade do dia. O que você pode fazer?',
    options: [
      { id: 'wait', label: 'Esperar e observar', image: image('hourglass'), fit: 'possible', message: 'Esperar e observar também pode ajudar. Se a dúvida continuar, você pode perguntar.' },
      { id: 'board', label: 'Olhar o quadro da rotina', image: image('board'), fit: 'likely', message: 'O quadro da rotina mostra o que vem depois. Ele está ali para ajudar.' },
      { id: 'ask', label: 'Perguntar a um adulto', image: image('ask'), fit: 'likely', message: 'Perguntar é uma ótima forma de tirar a dúvida.' },
    ],
  },

  // ---------- Parte 4: Organizando minhas tarefas ----------
  {
    id: 'routine-sequence-afternoon',
    type: 'sequence',
    part: 'tasks',
    title: 'Minhas tarefas da tarde',
    instruction: 'Monte a sua lista de tarefas para a tarde. Arraste os cartões ou use as setas para escolher a ordem.',
    cards: ['homework', 'backpack', 'materials', 'rest'],
    rules: [
      { type: 'before', card: 'materials', other: 'homework', hint: 'Para fazer a tarefa, ajuda ter os materiais organizados antes.' },
    ],
    success: 'Descansar pode vir antes, no meio ou no fim: você escolhe o que funciona melhor.',
  },
  {
    id: 'routine-sequence-weekend',
    type: 'sequence',
    part: 'tasks',
    title: 'Meu sábado',
    instruction: 'Escolha a ordem das suas atividades de sábado. Aqui, você decide tudo.',
    cards: ['play', 'tidy', 'shower', 'rest'],
    rules: [],
    success: 'No fim de semana, cada pessoa organiza o dia do seu jeito.',
  },
]);

const messages = Object.freeze({
  progress: 'Você fez {completed} de {total} atividades.',
  choicesLabel: 'Escolha uma resposta',
  objectsLabel: 'Objetos que podem ir na mochila',
  intro: {
    title: 'Vamos organizar o dia',
    text: 'Você vai organizar cartões, preparar a mochila e pensar no que fazer em algumas situações. São quatro partes, com uma atividade de cada vez.',
    note: 'Cada pessoa e cada família organiza a rotina do seu jeito. Os exemplos daqui são só ideias.',
    soundHint: 'Para ouvir as instruções em voz alta, ligue os sons em Configurações.',
    start: 'Começar',
    resume: 'Continuar de onde parei',
    restart: 'Começar do início',
  },
  sequence: {
    check: 'Conferir a ordem',
    successTitle: 'Essa ordem funciona!',
    freeTitle: 'Essa é a sua ordem!',
    retryTitle: 'Vamos pensar juntos.',
    retryEnd: 'Você pode mudar a ordem e conferir de novo.',
  },
  pack: {
    check: 'Conferir a mochila',
    bag: 'Na mochila',
    empty: 'A mochila ainda está vazia.',
    successTitle: 'Mochila pronta!',
    retryTitle: 'Quase lá! Vamos conferir juntos.',
    emptyMessage: 'Toque nos objetos para colocá-los na mochila.',
    retryEnd: 'Você pode mudar e conferir de novo.',
  },
  choice: {
    likely: 'Boa ideia!',
    possible: 'Pode ajudar, sim!',
    unlikely: 'Vamos pensar juntos.',
  },
  completion: {
    title: 'Você chegou ao fim de Minha Rotina!',
    text: 'Você organizou atividades, preparou a mochila e pensou no que fazer em situações do dia a dia.',
    pending: 'Algumas atividades ainda podem ser feitas, quando você quiser.',
    doPending: 'Fazer as que faltam',
    again: 'Fazer tudo de novo',
  },
});

export const routineData = Object.freeze({
  moduleId: 'routine',
  version: 2,
  cards,
  objects,
  parts,
  activities,
  messages,
});
