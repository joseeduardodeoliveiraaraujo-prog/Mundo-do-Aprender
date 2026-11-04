/**
 * Dados do módulo "Mundo das Emoções" (somente dados, sem lógica).
 *
 * Cuidados pedagógicos refletidos no conteúdo:
 * - Rostos são tratados como PISTAS, nunca como prova do que alguém sente.
 * - Nas situações, mais de uma emoção pode ser aceita ("likely" e "possible").
 * - Em "Como posso me expressar?", todas as alternativas são válidas.
 * - Nenhuma mensagem diz "errado"; respostas menos prováveis recebem um
 *   convite gentil para pensar de novo ("unlikely").
 * - Nada exige contato visual ou expressão facial da criança.
 *
 * Tipos de atividade (a lógica está em js/games/emotions.js):
 *   recognize  options: ids de emoção; answer: id esperado; hint: pista visual
 *   situation  options: [{ emotion, fit: 'likely'|'possible'|'unlikely', message }]
 *   express    options: ids de `expressions` (todas válidas)
 *
 * Textos com {chave} são preenchidos pela lógica do jogo.
 * Caminhos de imagem são relativos ao index.html.
 */

const FACES = 'assets/images/emotions/faces';
const SCENES = 'assets/images/emotions/scenes';

/** As seis emoções trabalhadas no módulo. */
const emotions = Object.freeze({
  happiness: { name: 'Felicidade', face: `${FACES}/happiness.svg` },
  sadness: { name: 'Tristeza', face: `${FACES}/sadness.svg` },
  anger: { name: 'Raiva', face: `${FACES}/anger.svg` },
  fear: { name: 'Medo', face: `${FACES}/fear.svg` },
  surprise: { name: 'Surpresa', face: `${FACES}/surprise.svg` },
  calm: { name: 'Calma', face: `${FACES}/calm.svg` },
});

/** Formas de comunicar o que sente (parte 3). Todas são válidas. */
const expressions = Object.freeze({
  talk: {
    label: 'Quero conversar',
    icon: 'chat',
    feedback: 'Conversar com alguém de confiança pode ajudar a entender o que você sente.',
  },
  help: {
    label: 'Preciso de ajuda',
    icon: 'hand',
    feedback: 'Pedir ajuda é uma forma importante de cuidar de você.',
  },
  quiet: {
    label: 'Quero ficar um pouco em silêncio',
    icon: 'quiet',
    feedback: 'Ficar em silêncio por um tempo é um jeito válido de se acalmar.',
  },
  pause: {
    label: 'Preciso de uma pausa',
    icon: 'pause',
    feedback: 'Fazer uma pausa ajuda o corpo e a cabeça a descansar.',
  },
});

const EXPRESSION_OPTIONS = Object.freeze(['talk', 'help', 'quiet', 'pause']);

const parts = Object.freeze([
  {
    id: 'recognize',
    title: 'Reconhecendo expressões',
    description: 'Olhe um rosto e pense em qual emoção ele pode estar mostrando.',
  },
  {
    id: 'situation',
    title: 'Situações do dia a dia',
    description: 'Leia uma pequena história e pense em como a pessoa pode se sentir.',
  },
  {
    id: 'express',
    title: 'Como posso me expressar?',
    description: 'Escolha uma forma de mostrar o que você sente.',
  },
]);

const activities = Object.freeze([
  // ---------- Parte 1: Reconhecendo expressões ----------
  {
    id: 'emotions-recognize-happiness',
    type: 'recognize',
    part: 'recognize',
    title: 'O rosto de Ana',
    instruction: 'Olhe o rosto de Ana. Que emoção ele pode estar mostrando?',
    image: {
      src: `${FACES}/happiness.svg`,
      alt: 'Rosto de Ana. A boca está aberta e curvada para cima. As bochechas estão rosadas.',
    },
    options: ['sadness', 'happiness', 'anger'],
    answer: 'happiness',
    hint: 'Veja a boca: ela está curvada para cima. Você pode escolher de novo.',
  },
  {
    id: 'emotions-recognize-sadness',
    type: 'recognize',
    part: 'recognize',
    title: 'O rosto de Caio',
    instruction: 'Olhe o rosto de Caio. Que emoção ele pode estar mostrando?',
    image: {
      src: `${FACES}/sadness.svg`,
      alt: 'Rosto de Caio. A boca está curvada para baixo, as sobrancelhas estão levantadas no meio e há uma lágrima perto do olho.',
    },
    options: ['surprise', 'calm', 'sadness'],
    answer: 'sadness',
    hint: 'Veja a boca curvada para baixo e a lágrima perto do olho. Você pode escolher de novo.',
  },
  {
    id: 'emotions-recognize-anger',
    type: 'recognize',
    part: 'recognize',
    title: 'O rosto de Rafa',
    instruction: 'Olhe o rosto de Rafa. Que emoção ele pode estar mostrando?',
    image: {
      src: `${FACES}/anger.svg`,
      alt: 'Rosto de Rafa. As sobrancelhas estão baixas e apontam para o meio do rosto. A boca está curvada para baixo.',
    },
    options: ['anger', 'happiness', 'fear'],
    answer: 'anger',
    hint: 'Veja as sobrancelhas: elas estão baixas e apontam para o meio do rosto. Você pode escolher de novo.',
  },
  {
    id: 'emotions-recognize-surprise',
    type: 'recognize',
    part: 'recognize',
    title: 'O rosto de Júlia',
    instruction: 'Olhe o rosto de Júlia. Que emoção ele pode estar mostrando?',
    image: {
      src: `${FACES}/surprise.svg`,
      alt: 'Rosto de Júlia. Os olhos estão bem abertos, as sobrancelhas estão bem levantadas e a boca está aberta em forma de O.',
    },
    options: ['calm', 'anger', 'surprise'],
    answer: 'surprise',
    hint: 'Veja os olhos bem abertos e a boca em forma de O. Você pode escolher de novo.',
  },

  // ---------- Parte 2: Situações do dia a dia ----------
  {
    id: 'emotions-situation-lost-toy',
    type: 'situation',
    part: 'situation',
    title: 'O brinquedo de Marina',
    instruction: 'Marina perdeu seu brinquedo favorito. Como ela poderia estar se sentindo?',
    image: {
      src: `${SCENES}/lost-toy.svg`,
      alt: 'Marina está em pé perto de uma caixa de brinquedos aberta e vazia. Acima da caixa, o contorno de um ursinho e um ponto de interrogação.',
    },
    options: [
      { emotion: 'sadness', fit: 'likely', message: 'Perder algo de que gostamos muito pode deixar a gente triste.' },
      { emotion: 'happiness', fit: 'unlikely', message: 'Pense no que aconteceu: o brinquedo favorito dela sumiu. Você pode escolher outra resposta.' },
      { emotion: 'anger', fit: 'possible', message: 'Algumas pessoas sentem raiva quando perdem algo importante.' },
    ],
  },
  {
    id: 'emotions-situation-loud-noise',
    type: 'situation',
    part: 'situation',
    title: 'O barulho da noite',
    instruction: 'Davi ouviu um barulho muito alto no meio da noite. Como ele poderia estar se sentindo?',
    image: {
      src: `${SCENES}/loud-noise.svg`,
      alt: 'À noite, Davi está sentado na cama. Perto da porta aparecem ondas de som e a palavra BUM.',
    },
    options: [
      { emotion: 'calm', fit: 'unlikely', message: 'Pense no que aconteceu: o barulho foi muito alto e veio de repente. Você pode escolher outra resposta.' },
      { emotion: 'fear', fit: 'likely', message: 'Barulhos altos e inesperados podem dar medo.' },
      { emotion: 'surprise', fit: 'possible', message: 'Um barulho que vem de repente também pode causar surpresa.' },
    ],
  },
  {
    id: 'emotions-situation-surprise-party',
    type: 'situation',
    part: 'situation',
    title: 'A festa de Lia',
    instruction: 'Os amigos de Lia prepararam uma festa surpresa para ela. Como ela poderia estar se sentindo?',
    image: {
      src: `${SCENES}/surprise-party.svg`,
      alt: 'Uma sala com bandeirinhas e balões. Lia está em pé e dois amigos estão ao lado dela.',
    },
    options: [
      { emotion: 'surprise', fit: 'likely', message: 'Ela não sabia da festa, então pode ter ficado surpresa.' },
      { emotion: 'happiness', fit: 'possible', message: 'Muitas pessoas ficam felizes com uma festa feita para elas.' },
      { emotion: 'fear', fit: 'possible', message: 'Algumas pessoas não gostam de surpresas ou de muito barulho e podem se sentir assustadas. Tudo bem sentir assim.' },
    ],
  },
  {
    id: 'emotions-situation-music',
    type: 'situation',
    part: 'situation',
    title: 'A música de Pedro',
    instruction: 'Pedro está deitado, ouvindo bem baixinho a sua música preferida. Como ele poderia estar se sentindo?',
    image: {
      src: `${SCENES}/calm-music.svg`,
      alt: 'Pedro está deitado no sofá com fones de ouvido. Ao lado, notas musicais.',
    },
    options: [
      { emotion: 'anger', fit: 'unlikely', message: 'Pense no que aconteceu: Pedro está descansando e ouvindo a música de que mais gosta. Você pode escolher outra resposta.' },
      { emotion: 'happiness', fit: 'possible', message: 'Ouvir a música preferida pode deixar a gente feliz.' },
      { emotion: 'calm', fit: 'likely', message: 'Descansar ouvindo uma música de que gostamos pode trazer calma.' },
    ],
  },

  // ---------- Parte 3: Como posso me expressar? ----------
  {
    id: 'emotions-express-sad-school',
    type: 'express',
    part: 'express',
    title: 'Tristeza na escola',
    instruction: 'Imagine que você está triste na escola. O que você poderia fazer ou dizer?',
    image: {
      src: `${SCENES}/sad-school.svg`,
      alt: 'Uma criança sentada na carteira, em frente ao quadro da sala de aula. Ao lado, uma pequena nuvem de chuva.',
    },
    options: EXPRESSION_OPTIONS,
  },
  {
    id: 'emotions-express-noisy-room',
    type: 'express',
    part: 'express',
    title: 'Muito barulho',
    instruction: 'Imagine que a sala está muito barulhenta e isso está incomodando você. O que você poderia fazer ou dizer?',
    image: {
      src: `${SCENES}/noisy-room.svg`,
      alt: 'Uma criança cobre as orelhas com as mãos. Em volta dela, muitas ondas de som. Ao fundo, outras crianças.',
    },
    options: EXPRESSION_OPTIONS,
  },
  {
    id: 'emotions-express-new-activity',
    type: 'express',
    part: 'express',
    title: 'Uma atividade nova',
    instruction: 'Imagine que você vai fazer uma atividade nova e está com medo. O que você poderia fazer ou dizer?',
    image: {
      src: `${SCENES}/new-activity.svg`,
      alt: 'Uma criança em pé ao lado de uma mesa. Na mesa, uma caixa com um ponto de interrogação.',
    },
    options: EXPRESSION_OPTIONS,
  },
]);

const messages = Object.freeze({
  choicesLabel: 'Escolha uma resposta',
  progress: 'Você fez {completed} de {total} atividades.',
  intro: {
    title: 'Vamos conhecer as emoções',
    text: 'Você vai ver rostos e pequenas histórias e pensar em formas de mostrar o que sente. São três partes, com uma atividade de cada vez.',
    note: 'Cada pessoa sente do seu jeito. Você pode voltar, avançar e tentar de novo quando quiser.',
    soundHint: 'Para ouvir as instruções em voz alta, ligue os sons em Configurações.',
    start: 'Começar',
    resume: 'Continuar de onde parei',
    restart: 'Começar do início',
  },
  recognize: {
    success: 'Isso! Este rosto pode estar mostrando {emotion}.',
    retry: 'Vamos olhar com calma mais uma vez.',
  },
  situation: {
    likely: 'Faz sentido!',
    possible: 'Pode ser, sim!',
    unlikely: 'Vamos pensar juntos.',
  },
  express: {
    success: 'Essa é uma boa forma de se expressar.',
  },
  notes: {
    faces: 'O rosto dá pistas, mas só a própria pessoa sabe o que sente. Algumas pessoas sentem muito e mostram pouco no rosto.',
    feelings: 'Cada pessoa pode sentir de um jeito diferente.',
    expression: 'Não existe um único jeito certo. Você pode escolher o que funciona melhor para você.',
  },
  completion: {
    title: 'Você chegou ao fim do Mundo das Emoções!',
    text: 'Você conheceu seis emoções e pensou em formas de mostrar o que sente.',
    pending: 'Algumas atividades ainda podem ser feitas, quando você quiser.',
    doPending: 'Fazer as que faltam',
    again: 'Fazer tudo de novo',
  },
});

export const emotionsData = Object.freeze({
  moduleId: 'emotions',
  version: 2,
  emotions,
  expressions,
  parts,
  activities,
  messages,
});
