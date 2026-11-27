/**
 * Módulo "Eu Me Comunico": a criança ajuda Noa a se comunicar no dia a dia.
 *
 * As atividades abrem como desafios no jogo (js/games/world/challengePanel.js).
 * Conteúdo e textos: ../data/communication.js. Cada mecânica fica em ./communication/:
 *
 *   talkCard  arrastar um cartão até o balão de Noa   talkCard.js
 *   sentence  montar uma frase com peças              sentenceStrip.js
 *   dialogue  conversar em turnos, escolhendo cartões dialogue.js
 *   match     levar cada cartão até a situação        matchCards.js
 *
 * Tudo funciona sem som; a voz só toca depois de uma ação da criança.
 */

import { renderTalkCard } from './communication/talkCard.js';
import { renderSentence } from './communication/sentenceStrip.js';
import { renderDialogue } from './communication/dialogue.js';
import { renderMatch } from './communication/matchCards.js';

const RENDER_BY_TYPE = Object.freeze({
  talkCard: renderTalkCard,
  sentence: renderSentence,
  dialogue: renderDialogue,
  match: renderMatch,
});

/** Uma atividade avulsa, para os desafios do jogo (js/games/world/challengePanel.js). */
export function renderChallengeActivity(activity, navigation, complete) {
  const frame = RENDER_BY_TYPE[activity.type](activity, navigation, complete);
  return { element: frame.element, focusTarget: frame.heading };
}
