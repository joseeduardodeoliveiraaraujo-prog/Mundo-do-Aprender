/**
 * Módulo "Explorando os Animais": a criança visita lugares e descobre os animais.
 *
 * As atividades abrem como desafios no jogo (js/games/world/challengePanel.js).
 * Conteúdo e textos: ../data/animals.js. Cada mecânica fica em ./animals/:
 *
 *   explore          tocar nos animais e ver as fichas     explore.js
 *   identify, sound  procurar no cenário por pista ou som  seek.js
 *   habitat          arrastar cada animal até onde vive    habitatDrop.js
 *   learn            arrastar a comida até o animal        feed.js
 *
 * Sons nunca tocam sozinhos; todas as atividades funcionam sem áudio.
 */

import { renderExplore } from './animals/explore.js';
import { renderSeek } from './animals/seek.js';
import { renderHabitat } from './animals/habitatDrop.js';
import { renderFeed } from './animals/feed.js';

const RENDER_BY_TYPE = Object.freeze({
  explore: renderExplore,
  identify: renderSeek,
  sound: renderSeek,
  habitat: renderHabitat,
  learn: renderFeed,
});

/** Uma atividade avulsa, para os desafios do jogo (js/games/world/challengePanel.js). */
export function renderChallengeActivity(activity, navigation, complete) {
  const frame = RENDER_BY_TYPE[activity.type](activity, navigation, complete);
  return { element: frame.element, focusTarget: frame.heading };
}
