/**
 * Módulo "Explorando os Animais": a criança visita lugares e descobre os animais.
 *
 * Fluxo (apresentação → atividades → conclusão): components/moduleFlow.js.
 * Trilha, mapa e recompensas: components/journey.js.
 * Conteúdo e textos: ../data/animals.js. Cada mecânica fica em ./animals/:
 *
 *   explore          tocar nos animais e ver as fichas     explore.js
 *   identify, sound  procurar no cenário por pista ou som  seek.js
 *   habitat          arrastar cada animal até onde vive    habitatDrop.js
 *   learn            arrastar a comida até o animal        feed.js
 *
 * Sons nunca tocam sozinhos; todas as atividades funcionam sem áudio.
 */

import { el } from '../components/dom.js';
import { createJourney } from '../components/journey.js';
import { createSoundToggle } from '../components/soundToggle.js';
import { startModuleFlow } from '../components/moduleFlow.js';
import { getCompletedActivityIds } from '../progress.js';
import { animalsData } from '../data/animals.js';
import { renderExplore } from './animals/explore.js';
import { renderSeek } from './animals/seek.js';
import { renderHabitat } from './animals/habitatDrop.js';
import { renderFeed } from './animals/feed.js';

const { moduleId, animals, regions, parts, activities, messages } = animalsData;

const RENDER_BY_TYPE = Object.freeze({
  explore: renderExplore,
  identify: renderSeek,
  sound: renderSeek,
  habitat: renderHabitat,
  learn: renderFeed,
});

const journey = createJourney({ moduleId, parts, activities, texts: messages.journey });

/** Caderno: mostra cada animal depois que o passeio da região dele foi concluído. */
function createNotebook() {
  const done = new Set(getCompletedActivityIds(moduleId));
  const seen = new Set(activities
    .filter(({ type, id }) => type === 'explore' && done.has(id))
    .flatMap(({ region }) => regions[region].animals.map(({ id }) => id)));

  return el('ul', { className: 'animal-gallery', attrs: { role: 'list', 'aria-label': messages.notebook.label } },
    Object.entries(animals).map(([id, animal]) => {
      const isSeen = seen.has(id);
      return el('li', { className: `animal-gallery__item${isSeen ? '' : ' is-locked'}` }, [
        el('img', { attrs: { src: animal.image, alt: '', width: 72, height: 72 } }),
        el('span', { text: isSeen ? animal.name : messages.notebook.locked }),
      ]);
    }));
}

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
    renderCompletionExtra: ({ goToActivity }) => el('div', { className: 'animal-completion' }, [journey.createMap({ goToActivity }), createNotebook()]),
  });
  return () => {
    stopFlow();
    soundToggle.destroy();
  };
}
