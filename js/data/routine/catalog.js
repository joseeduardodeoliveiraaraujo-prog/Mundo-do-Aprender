/**
 * Catálogo do módulo "Minha Rotina" (somente dados): imagens, cartões, objetos,
 * poses da Noa e momentos do dia. Caminhos relativos ao index.html.
 */

const IMG = 'assets/images/routine';
export const image = (name) => `${IMG}/${name}.svg`;
export const scene = (name) => `${IMG}/scenes/${name}.svg`;

/** Noa acompanha a criança: cada pose mostra como Noa está se sentindo. */
export const companion = Object.freeze({
  name: 'Noa',
  poses: Object.freeze({
    neutral: `${IMG}/noa/neutral.svg`,
    happy: `${IMG}/noa/happy.svg`,
    thinking: `${IMG}/noa/thinking.svg`,
    sleepy: `${IMG}/noa/sleepy.svg`,
  }),
});

/** Cartões de atividades do dia. */
export const cards = Object.freeze({
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
  sleep: { label: 'Dormir', image: image('sleep') },
});

/** Objetos que podem ir (ou não) na mochila. */
export const objects = Object.freeze({
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

/** Momentos do dia. Terminar todas as atividades de um momento dá a figurinha. */
export const parts = Object.freeze([
  { id: 'wake', title: 'Acordar', description: 'Comece o dia com Noa.', sticker: { label: 'Bom dia', image: image('wake-up') } },
  { id: 'hygiene', title: 'Higiene', description: 'Cuide do corpo, passo a passo.', sticker: { label: 'Mãos limpas', image: image('wash') } },
  { id: 'food', title: 'Alimentação', description: 'Prepare-se para comer.', sticker: { label: 'Hora de comer', image: image('breakfast') } },
  { id: 'school', title: 'Escola', description: 'Arrume a mochila e tire dúvidas.', sticker: { label: 'Mochila pronta', image: image('school') } },
  { id: 'leisure', title: 'Lazer', description: 'Descanse e escolha o que fazer.', sticker: { label: 'Hora de brincar', image: image('play') } },
  { id: 'sleep', title: 'Hora de dormir', description: 'Prepare o quarto e a noite.', sticker: { label: 'Boa noite', image: image('sleep') } },
]);
