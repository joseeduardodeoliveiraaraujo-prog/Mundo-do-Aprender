/**
 * Atividades do módulo "Minha Rotina" (somente dados). Lógica em js/games/routine/.
 *
 * Cuidados pedagógicos refletidos no conteúdo:
 * - Sequências são EXEMPLOS flexíveis: poucas regras em vez de uma única ordem
 *   certa. Uma delas não tem regra nenhuma. Só tem ordem fixa o que depende
 *   dela de verdade (lavar as mãos).
 * - Objetos da mochila têm três níveis: essential, optional e notNeeded.
 * - Nenhuma mensagem diz "errado"; sempre há uma pista e um convite.
 *
 * Tipos de atividade (campos comuns: id, type, part, title, instruction, greeting, success):
 *   sceneTasks  tocar nos elementos de uma cena; cada um muda ao ser tocado.
 *               scene: { src, alt, width, height }, fixedLayers: [src],
 *               tasks: [{ id, label, area: {x,y,w,h} em %, before, after, reaction, needs?, wait? }]
 *   stepByStep  arrastar cada passo, na ordem, e ver a cena mudar.
 *               steps: [{ id, label, image, reaction, hint }], trayOrder: [ids],
 *               scene: { src, alt, width, height }, layers: [{ src, atSteps: [números] }]
 *   sequence    arrastar cartões até os números. cards: ids; rules: first | last | before
 *   pack        arrastar objetos até a mochila. items: [{ id, need, hint? }]
 *   choice      arrastar até Noa o que pode ajudar.
 *               options: [{ id, label, image, fit: likely|possible|unlikely, message }]
 *
 * Nunca mude o id de uma atividade publicada: o progresso salvo depende dele.
 */

import { image, scene } from './catalog.js';

const BEDROOM = { src: scene('bedroom'), width: 480, height: 300 };

export const activities = Object.freeze([
  // ---------- Acordar ----------
  {
    id: 'routine-scene-wake',
    type: 'sceneTasks',
    part: 'wake',
    title: 'Bom dia, Noa!',
    instruction: 'Toque nos três círculos para ajudar Noa a acordar.',
    greeting: 'Estou com sono. Você me ajuda a acordar?',
    mood: 'sleepy',
    scene: { ...BEDROOM, alt: 'Quarto de manhã, com janela, cama e mesa de cabeceira.' },
    fixedLayers: [scene('bed-made')],
    tasks: [
      { id: 'alarm', label: 'Desligar o despertador', area: { x: 84, y: 44, w: 14, h: 18 }, before: scene('alarm-ringing'), after: scene('alarm-off'), reaction: 'Pronto, o barulho parou.' },
      { id: 'curtain', label: 'Abrir a cortina', area: { x: 10, y: 9, w: 26, h: 38 }, before: scene('curtain-closed'), after: scene('curtain-open-day'), reaction: 'Agora entrou luz no quarto.' },
      { id: 'getUp', label: 'Levantar da cama', area: { x: 58, y: 46, w: 22, h: 26 }, before: scene('noa-in-bed'), after: scene('noa-standing'), reaction: 'Levantei. Bom dia!', needs: ['alarm'], wait: 'Antes de levantar, vamos desligar o despertador.' },
    ],
    success: 'Noa acordou. Cada pessoa acorda de um jeito. Isto é só um exemplo.',
  },
  {
    id: 'routine-sequence-morning',
    type: 'sequence',
    part: 'wake',
    title: 'Minha manhã',
    instruction: 'Arraste cada cartão até um número para organizar a manhã.',
    greeting: 'O que eu faço primeiro?',
    cards: ['brushTeeth', 'school', 'breakfast', 'wakeUp', 'clothes', 'hygiene'],
    rules: [
      { type: 'first', card: 'wakeUp', hint: 'Pense no começo da manhã: o que acontece antes de tudo?' },
      { type: 'last', card: 'school', hint: 'Pense no fim da manhã: o que a gente faz depois de estar pronto?' },
    ],
    success: 'Escovar os dentes antes ou depois do café, por exemplo, depende de cada pessoa. Esta é só uma forma de organizar.',
  },

  // ---------- Higiene ----------
  {
    id: 'routine-steps-handwash',
    type: 'stepByStep',
    part: 'hygiene',
    title: 'Lavar as mãos',
    instruction: 'Arraste o cartão de cada passo até o número destacado.',
    greeting: 'Minhas mãos estão sujas. O que eu faço primeiro?',
    scene: { src: scene('sink'), alt: 'Duas mãos em cima de uma pia.', width: 240, height: 160 },
    layers: [
      { src: scene('sink-dirt'), atSteps: [0, 1, 2] },
      { src: scene('sink-water'), atSteps: [1, 4] },
      { src: scene('sink-foam-small'), atSteps: [2] },
      { src: scene('sink-foam-big'), atSteps: [3] },
      { src: scene('sink-clean'), atSteps: [5] },
    ],
    trayOrder: ['soap', 'towel', 'faucet', 'rinse', 'scrub'],
    steps: [
      { id: 'faucet', label: 'Abrir a torneira', image: image('faucet'), reaction: 'A água molhou minhas mãos.', hint: 'Primeiro, abrimos a torneira.' },
      { id: 'soap', label: 'Passar sabão', image: image('soap'), reaction: 'O sabão fez um pouco de espuma.', hint: 'Agora, com as mãos molhadas, vem o sabão.' },
      { id: 'scrub', label: 'Esfregar as mãos', image: image('wash-hands'), reaction: 'Esfreguei e fez bastante espuma.', hint: 'Com sabão nas mãos, é hora de esfregar.' },
      { id: 'rinse', label: 'Enxaguar', image: image('rinse'), reaction: 'A água levou a espuma embora.', hint: 'Depois de esfregar, a água tira a espuma.' },
      { id: 'towel', label: 'Secar com a toalha', image: image('towel'), reaction: 'Minhas mãos estão secas e limpas.', hint: 'Por último, secamos as mãos.' },
    ],
    success: 'Com água, sabão e toalha, as mãos ficam limpas.',
  },

  // ---------- Alimentação ----------
  {
    id: 'routine-choice-dirty-hands',
    type: 'choice',
    part: 'food',
    title: 'Hora do lanche',
    instruction: 'As mãos de Noa estão sujas. Arraste até Noa o que pode ajudar.',
    greeting: 'Quero lanchar, mas minhas mãos estão sujas.',
    mood: 'thinking',
    options: [
      { id: 'eat', label: 'Comer assim mesmo', image: image('snack'), fit: 'unlikely', message: 'Com as mãos sujas, a sujeira pode ir para a comida. Você pode escolher outro cartão.' },
      { id: 'washHands', label: 'Lavar as mãos', image: image('wash-hands'), fit: 'likely', message: 'Lavar as mãos com água e sabão deixa as mãos limpas para comer.' },
      { id: 'gel', label: 'Usar álcool em gel', image: image('gel'), fit: 'possible', message: 'Quando não tem pia por perto, o álcool em gel pode ajudar.' },
    ],
  },

  // ---------- Escola ----------
  {
    id: 'routine-pack-drawing',
    type: 'pack',
    part: 'school',
    title: 'Aula de desenho',
    instruction: 'Hoje tem aula de desenho. Arraste para a mochila o que pode ajudar.',
    greeting: 'O que eu levo para desenhar?',
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
    part: 'school',
    title: 'Aula de educação física',
    instruction: 'Hoje tem educação física. Arraste para a mochila o que pode ajudar.',
    greeting: 'O que eu levo para me mexer bastante?',
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
  {
    id: 'routine-choice-next-activity',
    type: 'choice',
    part: 'school',
    title: 'E agora?',
    instruction: 'Noa não lembra qual é a próxima atividade. Arraste até Noa o que pode ajudar.',
    greeting: 'O que vem agora? Eu não lembro.',
    mood: 'thinking',
    options: [
      { id: 'wait', label: 'Esperar e observar', image: image('hourglass'), fit: 'possible', message: 'Esperar e observar também pode ajudar. Se a dúvida continuar, dá para perguntar.' },
      { id: 'board', label: 'Olhar o quadro da rotina', image: image('board'), fit: 'likely', message: 'O quadro da rotina mostra o que vem depois. Ele está ali para ajudar.' },
      { id: 'ask', label: 'Perguntar a um adulto', image: image('ask'), fit: 'likely', message: 'Perguntar é uma ótima forma de tirar a dúvida.' },
    ],
  },

  // ---------- Lazer ----------
  {
    id: 'routine-choice-tired',
    type: 'choice',
    part: 'leisure',
    title: 'Depois da escola',
    instruction: 'Noa chegou da escola sem energia. Arraste até Noa o que pode ajudar.',
    greeting: 'Cheguei da escola e estou sem energia.',
    mood: 'sleepy',
    options: [
      { id: 'rest', label: 'Descansar um pouco', image: image('rest'), fit: 'likely', message: 'Descansar um pouco ajuda o corpo a recuperar a energia.' },
      { id: 'water', label: 'Beber água', image: image('water-bottle'), fit: 'possible', message: 'Beber água também pode ajudar quando sentimos cansaço.' },
      { id: 'hurry', label: 'Fazer tudo bem rápido', image: image('hurry'), fit: 'unlikely', message: 'Com cansaço, fazer tudo correndo pode ficar mais difícil. Você pode escolher outro cartão.' },
    ],
  },
  {
    id: 'routine-sequence-afternoon',
    type: 'sequence',
    part: 'leisure',
    title: 'Minhas tarefas da tarde',
    instruction: 'Arraste cada cartão até um número para montar a tarde.',
    greeting: 'Como eu posso organizar a tarde?',
    cards: ['homework', 'backpack', 'materials', 'rest'],
    rules: [
      { type: 'before', card: 'materials', other: 'homework', hint: 'Para fazer a tarefa, ajuda ter os materiais organizados antes.' },
    ],
    success: 'Descansar pode vir antes, no meio ou no fim: você escolhe o que funciona melhor.',
  },
  {
    id: 'routine-sequence-weekend',
    type: 'sequence',
    part: 'leisure',
    title: 'Meu sábado',
    instruction: 'Arraste cada cartão até um número. Aqui, você decide tudo.',
    greeting: 'No sábado, você escolhe a ordem.',
    cards: ['play', 'tidy', 'shower', 'rest'],
    rules: [],
    success: 'No fim de semana, cada pessoa organiza o dia do seu jeito.',
  },

  // ---------- Hora de dormir ----------
  {
    id: 'routine-sequence-bedtime',
    type: 'sequence',
    part: 'sleep',
    title: 'Minha noite',
    instruction: 'Arraste cada cartão até um número para organizar a noite.',
    greeting: 'O que eu faço antes de dormir?',
    mood: 'sleepy',
    cards: ['sleep', 'brushTeeth', 'shower', 'backpack'],
    rules: [
      { type: 'last', card: 'sleep', hint: 'Pense no fim da noite: o que a gente faz depois de tudo?' },
    ],
    success: 'Banho e mochila podem trocar de lugar. Cada casa tem o seu jeito.',
  },
  {
    id: 'routine-scene-bedtime',
    type: 'sceneTasks',
    part: 'sleep',
    title: 'Boa noite, Noa!',
    instruction: 'Toque nos quatro círculos para preparar o quarto para dormir.',
    greeting: 'Estou com sono. Vamos arrumar o quarto?',
    mood: 'sleepy',
    scene: { ...BEDROOM, alt: 'Quarto à noite, com janela, cama e abajur.' },
    fixedLayers: [scene('bed-made')],
    tasks: [
      { id: 'toys', label: 'Guardar os brinquedos', area: { x: 25, y: 78, w: 16, h: 17 }, before: scene('toys-floor'), after: scene('toys-box'), reaction: 'Os brinquedos estão na caixa.' },
      { id: 'curtain', label: 'Fechar a cortina', area: { x: 10, y: 9, w: 26, h: 38 }, before: scene('curtain-open-night'), after: scene('curtain-closed'), reaction: 'A cortina está fechada.' },
      { id: 'bed', label: 'Deitar na cama', area: { x: 42, y: 36, w: 14, h: 46 }, before: scene('noa-standing'), after: scene('noa-in-bed'), reaction: 'Deitei. A cama está quentinha.' },
      { id: 'lamp', label: 'Apagar o abajur', area: { x: 84, y: 31, w: 14, h: 28 }, before: scene('lamp-on'), after: [scene('lamp-off'), scene('night-dark')], reaction: 'Boa noite!', needs: ['toys', 'curtain', 'bed'], wait: 'O abajur fica aceso até o quarto estar pronto.' },
    ],
    success: 'O quarto está pronto. Noa pode dormir. Amanhã começa um novo dia.',
  },
]);
