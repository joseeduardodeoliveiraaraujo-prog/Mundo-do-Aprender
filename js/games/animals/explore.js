/**
 * Atividade "explore": a criança toca nos animais do cenário e vê a ficha de
 * cada um (nome, onde vive, o que come, curiosidade e som). Não há resposta:
 * a atividade termina quando todos os animais da região foram conhecidos.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { createButton } from '../../components/button.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createSoundPlayer } from '../../components/soundPlayer.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { stopSound } from '../../audio.js';
import { speak } from '../../speech.js';
import { animalsData } from '../../data/animals.js';
import { createAnimalScene, createGuide } from './explorerKit.js';

const { animals, messages } = animalsData;
const texts = messages.explore;

function createCard(id, onAnother) {
  const animal = animals[id];
  const row = (label, image, text) => el('li', { className: 'animal-fact' }, [
    image
      ? el('img', { className: 'animal-fact__image', attrs: { src: image, alt: '', width: 48, height: 48 } })
      : el('span', { className: 'animal-fact__icon' }, [createIcon('info')]),
    el('p', {}, [el('strong', { className: 'animal-card__label', text: label }), text]),
  ]);
  const heading = el('h3', { className: 'animal-card__name', text: animal.name, attrs: { tabindex: '-1' } });
  return {
    heading,
    element: el('article', { className: 'animal-card', dataset: { animal: id } }, [
      el('div', { className: 'animal-card__top' }, [
        el('img', { className: 'animal-card__image', attrs: { src: animal.image, alt: '', width: 200, height: 200 } }),
        heading,
      ]),
      el('ul', { className: 'animal-facts', attrs: { role: 'list' } }, [
        row(texts.home, animal.home.image, animal.home.text),
        row(texts.food, animal.food.image, animal.food.text),
        row(texts.fact, null, animal.fact),
      ]),
      createSoundPlayer({ sound: animal.sound }),
      createButton({ label: texts.another, variant: 'module', icon: 'arrowLeft', className: 'animal-card__another', onClick: onAnother }),
    ]),
  };
}

export function renderExplore(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const guide = createGuide();
  const known = new Set();
  const cardSlot = el('div', { className: 'animal-card-slot' }, [el('p', { className: 'animal-card-slot__empty', text: texts.empty })]);

  const scene = createAnimalScene(activity.region, (id) => {
    stopSound();
    scene.hop(id);
    scene.mark(id);
    const isNew = !known.has(id);
    known.add(id);
    const card = createCard(id, showScene);
    cardSlot.replaceChildren(card.element);
    cardSlot.scrollIntoView({ block: 'nearest' });
    card.heading.focus({ preventScroll: true });
    speak(`${animals[id].name}. ${animals[id].fact}`);

    const total = scene.ids.length;
    guide.show(known.size === total ? texts.done : fillTemplate(texts.count, { done: known.size, total }));
    if (isNew && known.size === total) {
      showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.success }, complete);
    }
  });

  /** Volta ao cenário, com o foco no próximo animal ainda não conhecido. */
  function showScene() {
    stopSound();
    scene.element.scrollIntoView({ block: 'center' });
    scene.button(scene.ids.find((id) => !known.has(id)) ?? scene.ids[0]).focus({ preventScroll: true });
  }

  frame.choicesSlot.append(
    guide.element,
    el('div', { className: 'explore-mission' }, [scene.element, cardSlot]),
  );
  guide.show(texts.start);
  return frame;
}
