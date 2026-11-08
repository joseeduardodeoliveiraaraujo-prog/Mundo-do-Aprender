/**
 * Atividades "identify" e "sound": a criança procura um animal no cenário,
 * a partir de uma pista escrita ou de um som (que também pode ser lido).
 *
 * Ao tocar em outro animal, ele se apresenta ("Esse é o leão.") e vem uma pista
 * sobre o que procurar. Nenhuma tentativa é punida.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createSoundPlayer } from '../../components/soundPlayer.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { animalsData } from '../../data/animals.js';
import { articleOf, createAnimalScene, createGuide } from './explorerKit.js';

const { animals, messages } = animalsData;
const texts = messages.seek;

function createClue(activity) {
  if (activity.type === 'sound') return createSoundPlayer({ sound: animals[activity.animal].sound });
  return el('div', { className: 'explorer-clue' }, [
    createIcon('search'),
    el('p', {}, [el('strong', { className: 'animal-card__label', text: texts.clue }), activity.clue]),
  ]);
}

export function renderSeek(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const guide = createGuide();
  let found = false;

  const scene = createAnimalScene(activity.region, (id) => {
    scene.hop(id);
    const other = fillTemplate(texts.other, articleOf(id));
    if (id !== activity.animal) {
      guide.say(found ? other : `${other} ${activity.hint}`);
      return;
    }
    found = true;
    scene.mark(id);
    const title = fillTemplate(texts.success, articleOf(id));
    guide.say(title);
    showResult(frame, { completes: true, tone: 'success', title, message: animals[id].fact }, complete);
  });

  frame.choicesSlot.append(guide.element, el('div', { className: 'explorer-clue-panel' }, [createClue(activity)]), scene.element);
  guide.show(texts.start);
  return frame;
}
