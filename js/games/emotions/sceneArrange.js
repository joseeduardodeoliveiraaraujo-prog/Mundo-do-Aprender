/**
 * Missão de arrumar uma cena (tipo arrangeScene), ex.: "O cantinho da calma".
 *
 * A criança leva objetos até os lugares com + na cena (tocar → tocar, ou
 * arrastar). Cada objeto RESPONDE ao ser colocado: uma frase curta sobre como
 * ele pode ajudar (ou, no caso de um objeto barulhento, um convite a trocar).
 * A missão termina quando todos os lugares têm objetos que ajudam a acalmar.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { createButton } from '../../components/button.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createPlacementBoard } from '../../components/placementBoard.js';
import { createHistory } from '../../undoHistory.js';
import { speak } from '../../speech.js';
import { emotionsData } from '../../data/emotions.js';

const texts = emotionsData.messages.missions;

export function renderArrangeScene(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const itemById = new Map(activity.items.map((item) => [item.id, item]));
  const history = createHistory(Object.fromEntries(activity.items.map(({ id }) => [id, null])));
  const reaction = el('div', { className: 'arrange-reaction', attrs: { hidden: true } });

  const showReaction = (item) => {
    reaction.hidden = false;
    reaction.classList.toggle('is-noisy', !item.helps);
    reaction.replaceChildren(
      el('img', { className: 'arrange-reaction__image', attrs: { src: item.image, alt: '', width: 64, height: 64 } }),
      el('p', {}, [el('strong', { text: `${item.label}: ` }), item.reaction]),
    );
  };

  const board = createPlacementBoard({
    pieces: activity.items.map(({ id, label, image }) => ({ id, label, image })),
    targets: activity.spots.map(({ id, label }) => ({ id, label })),
    texts: { tray: texts.objects },
    onPlace: (placement, { pieceId, targetId }) => {
      history.push(placement);
      refresh(placement);
      if (targetId) {
        const item = itemById.get(pieceId);
        showReaction(item);
        speak(item.reaction);
      } else {
        reaction.hidden = true;
      }
    },
  });

  const scene = el('div', { className: 'arrange-scene' }, [
    el('img', {
      className: 'arrange-scene__image',
      attrs: { src: activity.scene.src, alt: activity.scene.alt, width: activity.scene.width, height: activity.scene.height },
    }),
  ]);
  activity.spots.forEach((spot) => {
    const slot = board.slots.get(spot.id);
    slot.style.left = `${spot.x}%`;
    slot.style.top = `${spot.y}%`;
    // O objeto colocado mostra se ajuda a acalmar (ícone + borda, não só cor).
    slot.append(el('span', { className: 'arrange-scene__mark', attrs: { 'aria-hidden': 'true' } }));
    scene.append(slot);
  });

  const occupantOf = (placement, spotId) => Object.keys(placement).find((id) => placement[id] === spotId);

  function refresh(placement) {
    let ready = true;
    activity.spots.forEach(({ id }) => {
      const slot = board.slots.get(id);
      const item = itemById.get(occupantOf(placement, id));
      slot.classList.toggle('is-calm', Boolean(item?.helps));
      slot.classList.toggle('is-noisy', Boolean(item) && !item.helps);
      slot.classList.remove('is-hinted');
      slot.lastElementChild.replaceChildren(...(item ? [createIcon(item.helps ? 'heart' : 'speaker')] : []));
      ready &&= Boolean(item?.helps);
    });
    controls.setUndoEnabled(history.canUndo);
    if (ready) showResult(frame, { completes: true, tone: 'success', title: texts.successTitle, message: activity.success }, complete);
    else frame.feedbackSlot.replaceChildren();
  }

  const hintButton = createButton({
    label: texts.hintButton,
    variant: 'secondary',
    icon: 'help',
    className: 'mission__hint',
    onClick: () => {
      const placement = history.current;
      const noisy = activity.spots.find(({ id }) => itemById.get(occupantOf(placement, id))?.helps === false);
      const empty = activity.spots.find(({ id }) => !occupantOf(placement, id));
      const spot = noisy ?? empty;
      activity.spots.forEach(({ id }) => board.slots.get(id).classList.toggle('is-hinted', id === spot?.id));
      const message = noisy ? activity.hints.noisy : (empty ? activity.hints.empty : texts.hintDone);
      showResult(frame, { completes: false, tone: 'info', title: texts.hintButton, message }, complete);
      speak(message);
    },
  });

  const controls = createActivityControls({
    onUndo: () => { board.setPlacement(history.undo()); reaction.hidden = true; refresh(history.current); },
    onRestart: () => { board.setPlacement(history.reset()); reaction.hidden = true; refresh(history.current); },
  });

  frame.choicesSlot.append(
    el('div', { className: 'mission' }, [
      el('div', { className: 'mission__toolbar' }, [hintButton]),
      board.tray,
      scene,
      reaction,
    ]),
    controls.element,
  );
  refresh(history.current);
  return frame;
}
