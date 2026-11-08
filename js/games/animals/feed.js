/**
 * Atividade "learn": a criança arrasta até o animal a comida que ele come.
 * Comida que ele não come volta para a caixa com uma pista. Quando o animal
 * come, ele dá um pulinho e as informações sobre ele aparecem.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { animalsData } from '../../data/animals.js';
import { articleOf, createGuide } from './explorerKit.js';

const { animals, messages } = animalsData;
const texts = messages.learn;
const MOUTH = 'mouth';

export function renderFeed(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const { article, animal } = articleOf(activity.animal);

  const portrait = el('img', {
    className: 'feed-stage__animal',
    attrs: { src: animals[activity.animal].image, alt: `Ilustração ${article === 'a' ? 'da' : 'do'} ${animal}.`, width: 200, height: 200 },
  });
  const facts = el('ul', {
    className: 'animal-facts', attrs: { role: 'list', 'aria-label': texts.factsLabel, hidden: true },
  }, activity.facts.map((fact) => el('li', { className: 'animal-fact' }, [
    fact.image
      ? el('img', { className: 'animal-fact__image', attrs: { src: fact.image, alt: '', width: 48, height: 48 } })
      : el('span', { className: 'animal-fact__icon' }, [createIcon('info')]),
    el('p', { text: fact.text }),
  ])));

  const board = createPlacementBoard({
    pieces: activity.options.map(({ id, label, image }) => ({ id, label, image })),
    targets: [{ id: MOUTH, label: fillTemplate(texts.target, { animal: animals[activity.animal].name }) }],
    texts: texts.board,
    accepts: (foodId) => foodId === activity.answer,
    onReject: () => guide.say(activity.hint),
    onPlace: (placement) => {
      const eaten = placement[activity.answer] === MOUTH;
      facts.hidden = !eaten;
      if (!eaten) {
        frame.feedbackSlot.replaceChildren();
        guide.show(texts.start);
        return;
      }
      portrait.classList.remove('is-hopping');
      void portrait.offsetWidth; // reinicia o pulinho
      portrait.classList.add('is-hopping');
      guide.say(texts.successTitle);
      showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.explanation }, complete);
    },
  });
  const guide = createGuide({ status: board.status });

  frame.choicesSlot.append(
    guide.element,
    el('div', { className: 'feed-stage' }, [portrait, board.slots.get(MOUTH)]),
    board.tray,
    facts,
  );
  guide.show(texts.start);
  return frame;
}
