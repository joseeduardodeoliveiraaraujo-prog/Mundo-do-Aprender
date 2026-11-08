/**
 * Atividades de "Explorando os Animais" (somente dados). Lógica em js/games/animals/.
 *
 * Tipos de atividade (campos comuns: id, type, part, title, instruction):
 *   explore   tocar em cada animal da região e ver sua ficha. region; success
 *   identify  ler a pista e encontrar o animal na região. region; animal; clue; hint
 *   sound     ouvir (opcional) ou ler o som e encontrar o animal. region; animal; hint
 *   habitat   levar cada animal até onde ele vive.
 *             habitats: ids; animals: [{ id, accepts: [habitats], hint }]; success
 *   learn     dar ao animal a comida certa; depois, ver as informações.
 *             animal; options: [{ id, label, image }]; answer; hint; explanation; facts: [{ text, image? }]
 *
 * Nunca mude o id de uma atividade publicada: o progresso salvo depende dele.
 * Para criar outra atividade, acrescente um objeto com um destes tipos.
 */

import { foodImage } from './catalog.js';

const FIND_LOOK = 'Leia a pista e toque no animal que combina com ela.';
const FIND_SOUND = 'Ouça ou leia o som. Depois, toque no animal que faz esse som.';
const EXPLORE = 'Toque em cada animal para conhecer.';
const FEED = 'Arraste até o animal a comida que ele come.';
const TAKE_HOME = 'Arraste cada animal até o lugar onde ele vive.';

export const activities = Object.freeze([
  // ---------- Fazenda ----------
  {
    id: 'animals-explore-farm', type: 'explore', part: 'farm', region: 'farm',
    title: 'Passeio na fazenda', instruction: EXPLORE,
    success: 'Você conheceu a vaca, o cavalo, a galinha e o pato.',
  },
  {
    id: 'animals-sound-cow', type: 'sound', part: 'farm', region: 'farm',
    title: 'De quem é este som?', instruction: FIND_SOUND,
    animal: 'cow',
    hint: 'Esse som é "Muuu". Procure um animal grande que come capim.',
  },
  {
    id: 'animals-sound-chicken', type: 'sound', part: 'farm', region: 'farm',
    title: 'De quem é este som?', instruction: FIND_SOUND,
    animal: 'chicken',
    hint: 'Esse som é "Có, có, có". Procure uma ave que bota ovos.',
  },

  // ---------- Savana ----------
  {
    id: 'animals-explore-savanna', type: 'explore', part: 'savanna', region: 'savanna',
    title: 'Passeio na savana', instruction: EXPLORE,
    success: 'Você conheceu o leão, o elefante e a girafa.',
  },
  {
    id: 'animals-identify-elephant', type: 'identify', part: 'savanna', region: 'savanna',
    title: 'Procure na savana', instruction: FIND_LOOK,
    animal: 'elephant',
    clue: 'Um animal cinza com orelhas muito grandes, uma tromba comprida e duas presas brancas.',
    hint: 'Procure a tromba comprida no meio do rosto.',
  },
  {
    id: 'animals-learn-elephant', type: 'learn', part: 'savanna',
    title: 'Hora de comer: elefante', instruction: FEED,
    animal: 'elephant',
    options: [
      { id: 'meat', label: 'Carne', image: foodImage('meat') },
      { id: 'grass', label: 'Capim', image: foodImage('grass') },
      { id: 'fish', label: 'Peixe', image: foodImage('fish-food') },
    ],
    answer: 'grass',
    hint: 'O elefante come plantas. Procure uma planta.',
    explanation: 'A tromba funciona como uma mão: pega a comida e leva a água até a boca.',
    facts: [
      { text: 'O elefante é o maior animal que vive em terra firme.' },
      { text: 'Ele usa a tromba para pegar a comida e para beber água.' },
      { text: 'Ele come plantas: capim, folhas e frutas.', image: foodImage('grass') },
    ],
  },
  {
    id: 'animals-learn-giraffe', type: 'learn', part: 'savanna',
    title: 'Hora de comer: girafa', instruction: FEED,
    animal: 'giraffe',
    options: [
      { id: 'meat', label: 'Carne', image: foodImage('meat') },
      { id: 'fish', label: 'Peixe', image: foodImage('fish-food') },
      { id: 'leaves', label: 'Folhas', image: foodImage('leaves') },
    ],
    answer: 'leaves',
    hint: 'O pescoço comprido alcança o alto das árvores. O que tem lá em cima?',
    explanation: 'A girafa come folhas, principalmente das árvores altas que outros animais não alcançam.',
    facts: [
      { text: 'A girafa é o animal mais alto do mundo.' },
      { text: 'O pescoço comprido ajuda a girafa a alcançar o alto das árvores.' },
      { text: 'Ela come folhas das árvores.', image: foodImage('leaves') },
    ],
  },
  {
    id: 'animals-learn-lion', type: 'learn', part: 'savanna',
    title: 'Hora de comer: leão', instruction: FEED,
    animal: 'lion',
    options: [
      { id: 'banana', label: 'Banana', image: foodImage('banana') },
      { id: 'meat', label: 'Carne', image: foodImage('meat') },
      { id: 'grass', label: 'Capim', image: foodImage('grass') },
    ],
    answer: 'meat',
    hint: 'O leão come outros animais. Procure a comida que vem deles.',
    explanation: 'Animais que comem carne são chamados de carnívoros. O leão é um deles.',
    facts: [
      { text: 'O leão vive na savana, em grupos chamados bandos.' },
      { text: 'Ele come carne de outros animais.', image: foodImage('meat') },
      { text: 'O leão dorme e descansa muitas horas por dia.' },
    ],
  },

  // ---------- Rio e floresta ----------
  {
    id: 'animals-explore-river', type: 'explore', part: 'river', region: 'river',
    title: 'Passeio no rio e na floresta', instruction: EXPLORE,
    success: 'Você conheceu o macaco, a tartaruga e o peixe.',
  },
  {
    id: 'animals-identify-turtle', type: 'identify', part: 'river', region: 'river',
    title: 'Procure no rio', instruction: FIND_LOOK,
    animal: 'turtle',
    clue: 'Um animal verde com um casco duro nas costas, patas curtas e cabeça pequena.',
    hint: 'Procure o casco duro nas costas.',
  },
  {
    id: 'animals-identify-monkey', type: 'identify', part: 'river', region: 'river',
    title: 'Procure na floresta', instruction: FIND_LOOK,
    animal: 'monkey',
    clue: 'Um animal marrom com orelhas redondas dos lados da cabeça e o rosto mais claro.',
    hint: 'Procure as orelhas redondas dos lados e o rosto claro.',
  },

  // ---------- Em casa ----------
  {
    id: 'animals-explore-house', type: 'explore', part: 'house', region: 'house',
    title: 'Visita em casa', instruction: EXPLORE,
    success: 'Você conheceu o gato e o cachorro.',
  },
  {
    id: 'animals-sound-cat', type: 'sound', part: 'house', region: 'house',
    title: 'De quem é este som?', instruction: FIND_SOUND,
    animal: 'cat',
    hint: 'Esse som é "Miau". Procure um animal pequeno que tem bigodes.',
  },

  // ---------- Cada um no seu lugar ----------
  {
    id: 'animals-habitat-farm-savanna', type: 'habitat', part: 'homes',
    title: 'Fazenda ou savana?', instruction: TAKE_HOME,
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
    id: 'animals-habitat-water-house-forest', type: 'habitat', part: 'homes',
    title: 'Água, casa ou floresta?', instruction: TAKE_HOME,
    habitats: ['water', 'house', 'forest'],
    animals: [
      { id: 'fish', accepts: ['water'], hint: 'O peixe respira dentro da água.' },
      { id: 'dog', accepts: ['house'], hint: 'Muitos cachorros vivem junto com as pessoas.' },
      { id: 'monkey', accepts: ['forest'], hint: 'O macaco gosta de subir nos galhos das árvores.' },
      { id: 'turtle', accepts: ['water', 'forest'], hint: 'Algumas tartarugas vivem na água e outras vivem na terra.' },
    ],
    success: 'O peixe vive na água, o cachorro vive em casa com as pessoas e o macaco vive na floresta. Algumas tartarugas vivem na água e outras, como o jabuti, vivem na terra.',
  },
]);
