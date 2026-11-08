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
 * Tipos de atividade (a lógica está em js/games/emotions.js e js/games/emotions/):
 *   recognize    options: ids de emoção; answer: id esperado; hint: pista visual
 *   buildFace    monta um rosto peça por peça (sobrancelhas, olhos, boca)
 *                base: id de `faceBases`; emotion: id de emoção
 *                slots: { [região]: { options, accepts, hint } } — `accepts`
 *                lista as peças que combinam (pode haver mais de uma)
 *   investigate  liga a lupa, toca nos elementos da cena para achar pistas e,
 *                no desafio final, coloca um rosto no balão do personagem e
 *                mostra qual pista ajudou
 *                character: { name, clue }; clues: [{ label, area, focus?, text, hint }]
 *                question; options: [{ emotion, fit: 'likely'|'possible'|'unlikely', message }]
 *   express      options: ids de `expressions` (todas válidas)
 *   matchEmotions, arrangeScene  missões com peças: ver ./emotions/missions.js
 *
 * Textos com {chave} são preenchidos pela lógica do jogo.
 * Caminhos de imagem são relativos ao index.html.
 */

import { faceSlots, faceParts, faceBases } from './emotions/faceParts.js';
import { matchFeelingsMission, calmCornerMission } from './emotions/missions.js';

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
    description: 'Olhe rostos e monte rostos peça por peça.',
  },
  {
    id: 'situation',
    title: 'Detetive das emoções',
    description: 'Investigue cenas com a lupa e ajude cada amigo a mostrar o que sente.',
  },
  {
    id: 'express',
    title: 'Como posso me expressar?',
    description: 'Arrume um cantinho da calma e escolha formas de mostrar o que você sente.',
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
    id: 'emotions-build-surprise',
    type: 'buildFace',
    part: 'recognize',
    title: 'Monte o rosto de Júlia',
    instruction: 'Júlia ganhou um presente que não esperava. Monte um rosto que mostre surpresa.',
    base: 'julia',
    emotion: 'surprise',
    slots: {
      brows: {
        options: ['relaxed', 'raised', 'lowered'],
        accepts: ['raised'],
        hint: 'Na surpresa, as sobrancelhas costumam subir bem alto.',
      },
      eyes: {
        options: ['closed', 'wide', 'open'],
        accepts: ['wide', 'open'],
        hint: 'Na surpresa, os olhos costumam ficar abertos, às vezes bem abertos.',
      },
      mouth: {
        options: ['frown', 'open', 'soft'],
        accepts: ['open'],
        hint: 'Na surpresa, a boca costuma abrir, em forma de O.',
      },
    },
    success: 'Sobrancelhas levantadas, olhos abertos e boca em O são pistas de surpresa.',
  },
  {
    id: 'emotions-build-anger',
    type: 'buildFace',
    part: 'recognize',
    title: 'Monte o rosto de Rafa',
    instruction: 'Rafa está com raiva porque o jogo dele quebrou. Monte um rosto que mostre raiva.',
    base: 'rafa',
    emotion: 'anger',
    slots: {
      brows: {
        options: ['lowered', 'raised', 'relaxed'],
        accepts: ['lowered'],
        hint: 'Na raiva, as sobrancelhas costumam descer e apontar para o meio do rosto.',
      },
      eyes: {
        options: ['open', 'closed', 'wide'],
        accepts: ['open', 'wide'],
        hint: 'Na raiva, os olhos costumam ficar abertos.',
      },
      mouth: {
        options: ['smile', 'straight', 'frown'],
        accepts: ['straight', 'frown'],
        hint: 'Na raiva, a boca costuma ficar reta ou curvada para baixo.',
      },
    },
    success: 'Sobrancelhas baixas e boca sem sorriso são pistas de raiva.',
  },

  // ---------- Parte 2: Detetive das emoções ----------
  // area: retângulo do elemento investigável, em % da cena (x, y = canto superior esquerdo).
  // focus (opcional): parte do elemento mostrada ampliada na lupa (padrão: a própria área).
  // character.clue: índice da pista que é o personagem (aparece no desafio final).
  {
    id: 'emotions-investigate-lost-toy',
    type: 'investigate',
    part: 'situation',
    title: 'O brinquedo de Marina',
    instruction: 'Use a lupa para investigar a cena. Encontre 3 pistas sobre o que aconteceu com Marina.',
    image: {
      src: `${SCENES}/lost-toy.svg`,
      alt: 'Marina está em pé perto de uma caixa de brinquedos aberta e vazia. Acima da caixa, o contorno de um ursinho e um ponto de interrogação.',
    },
    character: { name: 'Marina', clue: 0 },
    clues: [
      {
        label: 'Marina',
        area: { x: 22, y: 16, w: 21, h: 68 },
        focus: { x: 23, y: 21, w: 19, h: 30 },
        text: 'Marina está olhando para a caixa. A boca dela está reta: ela não está sorrindo.',
        hint: 'Olhe para a menina.',
      },
      {
        label: 'A caixa de brinquedos',
        area: { x: 57, y: 45, w: 31, h: 38 },
        text: 'A caixa de brinquedos está aberta e vazia.',
        hint: 'Olhe para a caixa roxa.',
      },
      {
        label: 'O lugar do ursinho',
        area: { x: 63, y: 6, w: 30, h: 32 },
        text: 'O ursinho aparece só em pontilhado: ele sumiu. Era o brinquedo favorito de Marina.',
        hint: 'Olhe em cima da caixa, perto do ponto de interrogação.',
      },
    ],
    question: 'O que Marina pode estar sentindo?',
    options: [
      { emotion: 'sadness', fit: 'likely', message: 'Perder algo de que gostamos muito pode deixar a gente triste.' },
      { emotion: 'happiness', fit: 'unlikely', message: 'Lembre das pistas: o brinquedo favorito dela sumiu. Você pode escolher outro rosto.' },
      { emotion: 'anger', fit: 'possible', message: 'Algumas pessoas sentem raiva quando perdem algo importante.' },
    ],
  },
  {
    id: 'emotions-investigate-loud-noise',
    type: 'investigate',
    part: 'situation',
    title: 'O barulho da noite',
    instruction: 'Use a lupa para investigar a cena. Encontre 3 pistas sobre o que aconteceu com Davi.',
    image: {
      src: `${SCENES}/loud-noise.svg`,
      alt: 'À noite, Davi está sentado na cama. Perto da porta aparecem ondas de som e a palavra BUM.',
    },
    character: { name: 'Davi', clue: 2 },
    clues: [
      {
        label: 'A janela',
        area: { x: 8, y: 10, w: 24, h: 30 },
        text: 'Pela janela, dá para ver a lua. É de noite.',
        hint: 'Olhe para a janela, no alto, à esquerda.',
      },
      {
        label: 'O barulho',
        area: { x: 56, y: 11, w: 24, h: 50 },
        text: 'As ondas e a palavra BUM mostram um barulho muito alto, que veio de repente.',
        hint: 'Olhe para a palavra BUM.',
      },
      {
        label: 'Davi',
        area: { x: 33, y: 14, w: 21, h: 62 },
        focus: { x: 34, y: 14, w: 19, h: 30 },
        text: 'Davi acordou e se sentou na cama, no meio da noite.',
        hint: 'Olhe para o menino na cama.',
      },
    ],
    question: 'O que Davi pode estar sentindo?',
    options: [
      { emotion: 'calm', fit: 'unlikely', message: 'Lembre das pistas: o barulho foi muito alto e veio de repente. Você pode escolher outro rosto.' },
      { emotion: 'fear', fit: 'likely', message: 'Barulhos altos e inesperados podem dar medo.' },
      { emotion: 'surprise', fit: 'possible', message: 'Um barulho que vem de repente também pode causar surpresa.' },
    ],
  },
  {
    id: 'emotions-investigate-surprise-party',
    type: 'investigate',
    part: 'situation',
    title: 'A festa de Lia',
    instruction: 'Use a lupa para investigar a cena. Encontre 3 pistas sobre o que aconteceu com Lia.',
    image: {
      src: `${SCENES}/surprise-party.svg`,
      alt: 'Uma sala com bandeirinhas e balões. Lia está em pé e dois amigos estão ao lado dela.',
    },
    character: { name: 'Lia', clue: 2 },
    clues: [
      {
        label: 'Os enfeites',
        area: { x: 8, y: 6, w: 84, h: 22 },
        text: 'A sala está enfeitada com bandeirinhas e balões.',
        hint: 'Olhe para o alto da sala.',
      },
      {
        label: 'Os amigos',
        area: { x: 48, y: 36, w: 38, h: 53 },
        text: 'Os amigos de Lia prepararam a festa para ela, em segredo.',
        hint: 'Olhe para as duas crianças à direita.',
      },
      {
        label: 'Lia',
        area: { x: 20, y: 35, w: 22, h: 54 },
        focus: { x: 21, y: 34, w: 20, h: 28 },
        text: 'Lia acabou de entrar na sala. Ela não sabia da festa.',
        hint: 'Olhe para a menina de cabelo amarelo.',
      },
    ],
    question: 'O que Lia pode estar sentindo?',
    options: [
      { emotion: 'surprise', fit: 'likely', message: 'Ela não sabia da festa, então pode ter ficado surpresa.' },
      { emotion: 'happiness', fit: 'possible', message: 'Muitas pessoas ficam felizes com uma festa feita para elas.' },
      { emotion: 'fear', fit: 'possible', message: 'Algumas pessoas não gostam de surpresas ou de muito barulho e podem se sentir assustadas. Tudo bem sentir assim.' },
    ],
  },
  {
    id: 'emotions-investigate-music',
    type: 'investigate',
    part: 'situation',
    title: 'A música de Pedro',
    instruction: 'Use a lupa para investigar a cena. Encontre 3 pistas sobre o que Pedro está fazendo.',
    image: {
      src: `${SCENES}/calm-music.svg`,
      alt: 'Pedro está deitado no sofá com fones de ouvido. Ao lado, notas musicais.',
    },
    character: { name: 'Pedro', clue: 0 },
    clues: [
      {
        label: 'Pedro',
        area: { x: 17, y: 40, w: 22, h: 30 },
        text: 'Pedro está usando fones de ouvido.',
        hint: 'Olhe para o menino deitado, à esquerda.',
      },
      {
        label: 'As notas musicais',
        area: { x: 57, y: 10, w: 30, h: 34 },
        text: 'As notas mostram que está tocando a música preferida dele, bem baixinho.',
        hint: 'Olhe para o alto, à direita.',
      },
      {
        label: 'O sofá',
        area: { x: 41, y: 50, w: 48, h: 34 },
        text: 'Pedro está deitado no sofá, descansando.',
        hint: 'Olhe para o sofá verde.',
      },
    ],
    question: 'O que Pedro pode estar sentindo?',
    options: [
      { emotion: 'anger', fit: 'unlikely', message: 'Lembre das pistas: Pedro está descansando e ouvindo a música de que mais gosta. Você pode escolher outro rosto.' },
      { emotion: 'happiness', fit: 'possible', message: 'Ouvir a música preferida pode deixar a gente feliz.' },
      { emotion: 'calm', fit: 'likely', message: 'Descansar ouvindo uma música de que gostamos pode trazer calma.' },
    ],
  },

  matchFeelingsMission,

  // ---------- Parte 3: Como posso me expressar? ----------
  calmCornerMission,
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
    text: 'Você vai olhar e montar rostos, procurar pistas em cenas e pensar em formas de mostrar o que sente. Também vai cumprir missões, levando peças para o lugar certo. São três partes, com uma atividade de cada vez.',
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
  buildFace: {
    faceLabel: 'Rosto de {name}',
    notChosen: 'ainda sem escolher',
    check: 'Conferir o rosto',
    missingTitle: 'O rosto ainda não está pronto.',
    missing: 'Falta escolher: {slots}.',
    retryTitle: 'Vamos olhar com calma.',
    retryEnd: 'Você pode trocar a peça e conferir de novo.',
    successTitle: 'Isso! Este rosto pode mostrar {emotion}.',
  },
  investigate: {
    toolOn: 'Usar a lupa',
    toolOff: 'Guardar a lupa',
    toolStart: 'Toque em "Usar a lupa" para começar a investigar.',
    modeOn: 'A lupa está ligada. Toque em uma pessoa ou objeto com borda tracejada.',
    modeOff: 'A lupa está guardada.',
    sceneLabel: 'Cena para investigar',
    hintButton: 'Preciso de uma dica',
    hintTag: 'Olhe aqui',
    allHintsUsed: 'Você já encontrou todas as pistas.',
    count: 'Pistas encontradas: {found} de {total}',
    investigate: 'Investigar: {label}',
    found: '{label}: pista encontrada',
    panelEmpty: 'As pistas que você encontrar vão aparecer aqui, aumentadas pela lupa.',
    panelNumber: 'Pista {number} de {total}',
    discovered: 'Pista encontrada: {label}. {text}',
    discoveredShort: 'Você encontrou: {label}.',
    notebookTitle: 'Caderno de pistas',
    notebookHidden: 'Pista {number}: ainda escondida',
    reopen: 'Ver de novo: {label}',
    allFound: 'Você encontrou todas as pistas! Agora faça o desafio do detetive.',
    challengeTitle: 'Desafio do detetive',
    challengeFeel: 'Passo 1: escolha um rosto para o balão de pensamento de {name}.',
    challengeWhy: 'Passo 2: qual pista ajudou você a pensar isso?',
    bubbleEmpty: 'Balão de pensamento de {name}, ainda vazio',
    bubbleFull: 'Balão de pensamento de {name}: {emotion}',
    faceChoices: 'Rostos para o balão',
    clueChoices: 'Pistas encontradas',
    feelNext: 'Agora faça o passo 2.',
    whyTitle: 'Ótima investigação!',
    whyMessage: 'A pista "{clue}" ajuda a entender o que aconteceu com {name}.',
  },
  missions: {
    hintButton: 'Preciso de uma dica',
    faces: 'Rostos',
    objects: 'Objetos',
    says: '{name} diz:',
    stepPick: 'Segure um rosto',
    stepPlace: 'Arraste até o balão de um amigo',
    matchBoard: {
      tray: 'Rostos',
      dropHere: 'Solte aqui',
      emptySlot: 'Balão de {target}, vazio',
      placeHere: 'Colocar {piece} no balão de {target}',
      pieceInSlot: '{piece}, no balão de {target}',
      chosen: '{piece} escolhido. Agora escolha o balão de um amigo.',
      chooseFirst: 'Primeiro, escolha um rosto.',
      tapHint: 'Segure o rosto e arraste até o balão de um amigo.',
      placed: '{piece} encaixou no balão de {target}.',
      rejected: '{piece} voltou para a caixa. Veja o que {target} respondeu.',
      outside: '{piece} voltou para a caixa. Solte o rosto dentro de um balão.',
    },
    ask: 'Qual rosto combina com {name}?',
    friendsCount: 'Amigos ajudados: {done} de {total}',
    hintDone: 'Está tudo pronto. Você pode olhar e trocar o que quiser.',
    successTitle: 'Missão cumprida!',
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
    text: 'Você conheceu seis emoções, montou rostos, investigou pistas e pensou em formas de mostrar o que sente.',
    pending: 'Algumas atividades ainda podem ser feitas, quando você quiser.',
    doPending: 'Fazer as que faltam',
    again: 'Fazer tudo de novo',
  },
});

export const emotionsData = Object.freeze({
  moduleId: 'emotions',
  version: 5,
  emotions,
  expressions,
  faceSlots,
  faceParts,
  faceBases,
  parts,
  activities,
  messages,
});
