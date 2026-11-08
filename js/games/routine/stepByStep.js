/**
 * Atividade "stepByStep": a criança arrasta cada passo até o número destacado e
 * a cena mostra o resultado (água, espuma, mãos limpas).
 *
 * Só para o que tem ordem de verdade. Passo fora de hora volta para a caixa e
 * Noa diz qual é o passo da vez, sem punir.
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { createHistory } from '../../undoHistory.js';
import { routineData } from '../../data/routine.js';
import { createCompanion } from './companion.js';
import { createSceneLayers } from '../../components/sceneLayers.js';

const texts = routineData.messages.stepByStep;
const slotId = (index) => `step-${index + 1}`;

export function renderStepByStep(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const { steps } = activity;
  const stepById = new Map(steps.map((step) => [step.id, step]));
  const history = createHistory(Object.fromEntries(steps.map(({ id }) => [id, null])));
  const layers = createSceneLayers(activity.scene, activity.layers.map(({ src }) => src));

  /** Quantos passos seguidos, desde o primeiro, já estão no lugar. */
  const stepsDone = (placement) => {
    const next = steps.findIndex((step, index) => placement[step.id] !== slotId(index));
    return next < 0 ? steps.length : next;
  };

  const board = createPlacementBoard({
    pieces: activity.trayOrder.map((id) => ({ id, label: stepById.get(id).label, image: stepById.get(id).image })),
    targets: steps.map((_, index) => ({ id: slotId(index), label: String(index + 1) })),
    texts: { ...texts.board, placed: '{piece}.', rejected: '{piece} voltou para a caixa.' },
    accepts: (pieceId, targetId) => {
      const current = stepsDone(board.getPlacement());
      return targetId === slotId(current) && pieceId === steps[current]?.id;
    },
    onReject: (pieceId) => {
      const expected = steps[stepsDone(board.getPlacement())];
      // Com todos os passos no lugar, não há passo da vez (ex.: arrastou um passo para outro número).
      companion.say(expected && pieceId !== expected.id ? expected.hint : texts.wrongSlot, 'thinking');
    },
    onPlace: (placement, { pieceId, targetId }) => {
      history.push(placement);
      refresh(placement);
      if (targetId) companion.say(stepById.get(pieceId).reaction, 'happy');
    },
  });
  const companion = createCompanion({ status: board.status });

  const track = el('ol', { className: 'day-track', attrs: { role: 'list' }, dataset: { count: String(steps.length) } },
    steps.map((_, index) => el('li', { className: 'day-track__stop' }, [
      el('span', { className: 'day-track__number', attrs: { 'aria-hidden': 'true' }, text: String(index + 1) }),
      board.slots.get(slotId(index)),
    ])));

  function refresh(placement) {
    const done = stepsDone(placement);
    activity.layers.forEach(({ src, atSteps }) => layers.toggle(src, atSteps.includes(done)));
    steps.forEach((_, index) => board.slots.get(slotId(index)).classList.toggle('is-next', index === done));
    controls.setUndoEnabled(history.canUndo);
    if (done === steps.length) {
      showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.success }, complete);
    } else {
      frame.feedbackSlot.replaceChildren();
    }
  }

  const resetTo = (placement) => {
    board.setPlacement(placement);
    refresh(placement);
    companion.show(activity.greeting);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
  });

  frame.choicesSlot.append(
    companion.element,
    el('div', { className: 'mission' }, [layers.element, board.tray, track]),
    controls.element,
  );
  layers.element.classList.add('scene-layers--small');
  refresh(history.current);
  companion.show(activity.greeting);
  return frame;
}
