/**
 * Cena de perto do quarto do Noa, vista de frente (pixels 2x).
 * Duas versões: de manhã ("Bom dia, Noa!") e à noite ("Boa noite, Noa!").
 * Formato descrito em ./sink.js.
 */

const FOLDER = 'assets/images/world/closeup/bedroom';
const IMAGES = [
  'background-day', 'background-night', 'curtain-open', 'curtain-closed', 'bed-noa', 'bed-empty',
  'alarm-ringing', 'alarm-quiet', 'lamp-on', 'lamp-off', 'glow', 'toys', 'box-empty', 'box-full',
  'noa', 'dim', 'night',
];
const AT = Object.freeze({
  curtain: { x: 10, y: 8 }, bed: { x: 72, y: 46 }, alarm: { x: 160, y: 52 }, lamp: { x: 172, y: 46 },
  glow: { x: 152, y: 30 }, noa: { x: 116, y: 84 }, toys: { x: 40, y: 104 }, box: { x: 4, y: 94 },
});

export const bedroomMorning = Object.freeze({
  id: 'bedroom-morning',
  folder: FOLDER,
  images: IMAGES,
  background: 'background-day',
  label: 'O quarto do Noa de manhã: a cortina fechada, Noa dormindo na cama e o despertador tocando.',
  goal: 'Ajude Noa a acordar: toque nas coisas do quarto.',
  pieces: [
    { id: 'curtain', image: 'curtain-closed', ...AT.curtain, label: 'Cortina' },
    { id: 'bed', image: 'bed-noa', ...AT.bed, label: 'Noa na cama' },
    { id: 'lamp', image: 'lamp-off', ...AT.lamp },
    { id: 'alarm', image: 'alarm-ringing', ...AT.alarm, label: 'Despertador' },
    { id: 'box', image: 'box-full', ...AT.box },
    { id: 'noa', image: 'noa', ...AT.noa, hidden: true },
    { id: 'dim', image: 'dim', x: 0, y: 0 },
  ],
  actions: [
    { label: 'Desligar o despertador', do: { tap: 'alarm' }, task: 'alarm' },
    { label: 'Abrir a cortina', do: { tap: 'curtain' }, task: 'curtain' },
    { label: 'Levantar da cama', do: { tap: 'bed' }, task: 'getUp' },
  ],
  tasks: {
    alarm: { do: { tap: 'alarm' }, how: 'Toque no despertador.', effects: [{ frame: 'alarm', image: 'alarm-quiet' }] },
    curtain: {
      do: { tap: 'curtain' },
      how: 'Toque na cortina.',
      effects: [{ frame: 'curtain', image: 'curtain-open' }, { hide: 'dim', fade: true }],
    },
    getUp: {
      do: { tap: 'bed' },
      how: 'Toque no Noa, na cama.',
      effects: [{ frame: 'bed', image: 'bed-empty' }, { show: 'noa', fade: true }],
    },
  },
});

export const bedroomNight = Object.freeze({
  id: 'bedroom-night',
  folder: FOLDER,
  images: IMAGES,
  background: 'background-night',
  label: 'O quarto do Noa à noite: a cortina aberta, o abajur aceso, os brinquedos no chão e Noa de pé.',
  goal: 'Prepare o quarto para Noa dormir: toque e arraste as coisas.',
  pieces: [
    { id: 'glow', image: 'glow', ...AT.glow },
    { id: 'curtain', image: 'curtain-open', ...AT.curtain, label: 'Cortina' },
    { id: 'bed', image: 'bed-empty', ...AT.bed, label: 'Cama' },
    { id: 'alarm', image: 'alarm-quiet', ...AT.alarm },
    { id: 'lamp', image: 'lamp-on', ...AT.lamp, label: 'Abajur' },
    { id: 'box', image: 'box-empty', ...AT.box, label: 'Caixa de brinquedos' },
    { id: 'toys', image: 'toys', ...AT.toys, label: 'Brinquedos', draggable: true },
    { id: 'noa', image: 'noa', ...AT.noa, label: 'Noa', draggable: true },
    { id: 'night', image: 'night', x: 0, y: 0, hidden: true },
  ],
  actions: [
    { label: 'Guardar os brinquedos', do: { drag: 'toys', to: 'box' }, task: 'toys' },
    { label: 'Fechar a cortina', do: { tap: 'curtain' }, task: 'curtain' },
    { label: 'Levar o Noa até a cama', do: { drag: 'noa', to: 'bed' }, task: 'bed' },
    { label: 'Apagar o abajur', do: { tap: 'lamp' }, task: 'lamp' },
  ],
  tasks: {
    toys: {
      do: { drag: 'toys', to: 'box' },
      how: 'Arraste os brinquedos até a caixa.',
      effects: [{ hide: 'toys' }, { frame: 'box', image: 'box-full' }],
    },
    curtain: { do: { tap: 'curtain' }, how: 'Toque na cortina.', effects: [{ frame: 'curtain', image: 'curtain-closed' }] },
    bed: {
      do: { drag: 'noa', to: 'bed' },
      how: 'Arraste o Noa até a cama.',
      effects: [{ hide: 'noa' }, { frame: 'bed', image: 'bed-noa' }],
    },
    lamp: {
      do: { tap: 'lamp' },
      how: 'Toque no abajur.',
      effects: [{ frame: 'lamp', image: 'lamp-off' }, { together: [{ hide: 'glow', fade: true }, { show: 'night', fade: true }] }],
    },
  },
});
