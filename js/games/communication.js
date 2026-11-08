/**
 * Módulo "Eu Me Comunico": a criança ajuda Noa a se comunicar no dia a dia.
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Trilha, mapa e recompensas: components/journey.js.
 * Conteúdo e textos: ../data/communication.js. Cada mecânica fica em ./communication/:
 *
 *   talkCard  arrastar um cartão até o balão de Noa   talkCard.js
 *   sentence  montar uma frase com peças              sentenceStrip.js
 *   dialogue  conversar em turnos, escolhendo cartões dialogue.js
 *   match     levar cada cartão até a situação        matchCards.js
 *
 * Tudo funciona sem som; a voz só toca depois de uma ação da criança.
 */

import { el } from '../components/dom.js';
import { createJourney } from '../components/journey.js';
import { createSoundToggle } from '../components/soundToggle.js';
import { startModuleFlow } from '../components/moduleFlow.js';
import { communicationData } from '../data/communication.js';
import { renderTalkCard } from './communication/talkCard.js';
import { renderSentence } from './communication/sentenceStrip.js';
import { renderDialogue } from './communication/dialogue.js';
import { renderMatch } from './communication/matchCards.js';
import { createMyBoard } from './communication/myBoard.js';

const { moduleId, people, parts, activities, messages } = communicationData;

const RENDER_BY_TYPE = Object.freeze({
  talkCard: renderTalkCard,
  sentence: renderSentence,
  dialogue: renderDialogue,
  match: renderMatch,
});

const journey = createJourney({ moduleId, parts, activities, texts: messages.journey, mapArt: people.noa.poses.happy });

export function render(view, module) {
  const soundToggle = createSoundToggle();
  const stopFlow = startModuleFlow({
    view,
    module,
    parts,
    activities,
    texts: messages,
    renderActivity: (activity, index, { navigation, complete }) => journey.wrapActivity(
      activity,
      complete,
      (onComplete) => RENDER_BY_TYPE[activity.type](activity, navigation, onComplete),
      soundToggle.element,
    ),
    renderPartsOverview: journey.createMap,
    renderCompletionExtra: ({ goToActivity }) => el('div', { className: 'communication-completion' }, [journey.createMap({ goToActivity }), createMyBoard()]),
  });
  return () => {
    stopFlow();
    soundToggle.destroy();
  };
}
