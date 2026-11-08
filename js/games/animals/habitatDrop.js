/**
 * Atividade "habitat": a criança arrasta cada animal até o lugar onde ele vive.
 *
 * Um animal levado a um lugar que não é o dele volta para a caixa com uma pista.
 * Há uma vaga em cada lugar para cada animal que pode viver ali. A atividade
 * termina sozinha, quando todos chegam (não há botão "Conferir").
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createHistory } from '../../undoHistory.js';
import { animalsData } from '../../data/animals.js';
import { createGuide } from './explorerKit.js';

const { animals, habitats, messages } = animalsData;
const texts = messages.habitat;

export function renderHabitat(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const animalById = new Map(activity.animals.map((item) => [item.id, item]));
  const total = activity.animals.length;
  const history = createHistory(Object.fromEntries(activity.animals.map(({ id }) => [id, null])));
  const counter = el('p', { className: 'habitat-drop__count' });

  // Uma vaga por animal que pode viver em cada lugar.
  const spots = activity.habitats.flatMap((habitatId) => activity.animals
    .filter(({ accepts }) => accepts.includes(habitatId))
    .map((_, index) => ({ id: `${habitatId}-${index}`, habitatId, label: habitats[habitatId].name })));
  const habitatOf = new Map(spots.map(({ id, habitatId }) => [id, habitatId]));

  const board = createPlacementBoard({
    pieces: activity.animals.map(({ id }) => ({ id, label: animals[id].name, image: animals[id].image })),
    targets: spots.map(({ id, label }) => ({ id, label })),
    texts: texts.board,
    accepts: (animalId, spotId) => animalById.get(animalId).accepts.includes(habitatOf.get(spotId)),
    onReject: (animalId) => guide.say(animalById.get(animalId).hint),
    onPlace: (placement) => {
      history.push(placement);
      refresh(placement);
    },
  });
  const guide = createGuide({ status: board.status });

  function refresh(placement) {
    const done = Object.values(placement).filter(Boolean).length;
    counter.textContent = fillTemplate(texts.count, { done, total });
    controls.setUndoEnabled(history.canUndo);
    if (done === total) showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.success }, complete);
    else frame.feedbackSlot.replaceChildren();
  }

  const resetTo = (placement) => {
    board.setPlacement(placement);
    refresh(placement);
    guide.show(texts.start);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
  });

  const places = activity.habitats.map((habitatId) => el('section', {
    className: 'habitat-place', attrs: { 'aria-label': habitats[habitatId].name }, dataset: { habitat: habitatId },
  }, [
    el('img', { className: 'habitat-place__image', attrs: { src: habitats[habitatId].image, alt: '', width: 240, height: 160 } }),
    el('h3', { className: 'habitat-place__name', text: habitats[habitatId].name }),
    el('div', { className: 'habitat-place__spots' }, spots.filter((spot) => spot.habitatId === habitatId).map(({ id }) => board.slots.get(id))),
  ]));

  const placesGrid = el('div', { className: 'habitat-places' }, places);
  placesGrid.style.setProperty('--habitat-count', String(activity.habitats.length));
  frame.choicesSlot.append(guide.element, board.tray, counter, placesGrid, controls.element);
  refresh(history.current);
  guide.show(texts.start);
  return frame;
}
