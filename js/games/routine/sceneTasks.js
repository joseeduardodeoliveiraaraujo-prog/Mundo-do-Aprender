/**
 * Atividade "sceneTasks": a criança toca nos elementos da cena e cada um muda
 * (o despertador para de tocar, a cortina abre, Noa levanta).
 *
 * Uma tarefa com `needs` espera outras: Noa explica o que vem antes, sem punir.
 * A lista ao lado mostra o objetivo e o que já foi feito.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createHistory } from '../../undoHistory.js';
import { routineData } from '../../data/routine.js';
import { createCompanion } from './companion.js';
import { createSceneLayers } from '../../components/sceneLayers.js';

const texts = routineData.messages.sceneTasks;
const asList = (value) => (Array.isArray(value) ? value : [value]);

export function renderSceneTasks(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const companion = createCompanion({ mood: activity.mood });
  const history = createHistory([]);
  const layers = createSceneLayers(activity.scene, [
    ...activity.fixedLayers,
    ...activity.tasks.flatMap(({ before, after }) => [...asList(before), ...asList(after)]),
  ]);
  activity.fixedLayers.forEach((src) => layers.toggle(src, true));

  const items = activity.tasks.map((task) => {
    const spot = el('button', {
      className: 'scene-spot',
      attrs: { type: 'button', 'aria-label': task.label, 'aria-pressed': 'false' },
      dataset: { task: task.id },
    }, [createIcon('hand')]);
    Object.assign(spot.style, {
      left: `${task.area.x}%`, top: `${task.area.y}%`, width: `${task.area.w}%`, height: `${task.area.h}%`,
    });
    spot.addEventListener('click', () => act(task));
    const row = el('li', { className: 'scene-checklist__item' }, [
      el('span', { className: 'scene-checklist__mark', attrs: { 'aria-hidden': 'true' } }),
      el('span', { text: task.label }),
    ]);
    layers.element.append(spot);
    return { task, spot, row };
  });

  function refresh(done) {
    items.forEach(({ task, spot, row }) => {
      const isDone = done.includes(task.id);
      asList(task.before).forEach((src) => layers.toggle(src, !isDone));
      asList(task.after).forEach((src) => layers.toggle(src, isDone));
      spot.setAttribute('aria-pressed', String(isDone));
      spot.replaceChildren(createIcon(isDone ? 'star' : 'hand'));
      row.classList.toggle('is-done', isDone);
      row.firstElementChild.replaceChildren(...(isDone ? [createIcon('check')] : []));
    });
    controls.setUndoEnabled(history.canUndo);
    return done.length === activity.tasks.length;
  }

  function finishIfDone(allDone) {
    if (allDone) showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.success }, complete);
    else frame.feedbackSlot.replaceChildren();
    return allDone;
  }

  function act(task) {
    const done = history.current;
    if (done.includes(task.id)) { companion.say(task.reaction, 'happy'); return; }
    if (task.needs?.some((id) => !done.includes(id))) { companion.say(task.wait, 'thinking'); return; }
    history.push([...done, task.id]);
    companion.say(task.reaction, 'happy');
    finishIfDone(refresh(history.current));
  }

  const resetTo = (done) => {
    finishIfDone(refresh(done));
    companion.show(activity.greeting, activity.mood);
  };
  const controls = createActivityControls({
    onUndo: () => resetTo(history.undo()),
    onRestart: () => resetTo(history.reset()),
  });

  frame.choicesSlot.append(
    companion.element,
    el('div', { className: 'scene-mission' }, [
      layers.element,
      el('ul', { className: 'scene-checklist', attrs: { role: 'list', 'aria-label': texts.checklist } }, items.map(({ row }) => row)),
    ]),
    controls.element,
  );
  refresh(history.current);
  companion.show(activity.greeting, activity.mood);
  return frame;
}
