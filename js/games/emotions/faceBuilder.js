/**
 * "Monte o rosto" — a criança monta um rosto peça por peça
 * (sobrancelhas, olhos, boca) para mostrar uma emoção.
 *
 * - O rosto na tela muda a cada escolha (camadas sobre a base).
 * - A criança decide quando terminou e aperta "Conferir o rosto".
 * - Mais de uma peça pode combinar (ex.: olhos abertos ou bem abertos).
 * - Se uma peça não combina, a pista fala só dela; o resto fica como está.
 * - Desfazer / Recomeçar; mudar algo apaga o feedback anterior.
 */

import { el } from '../../components/dom.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { createActivityControls } from '../../components/activityControls.js';
import { createChoiceButton, createChoiceGroup } from '../../components/choiceButton.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createHistory } from '../../undoHistory.js';
import { emotionsData } from '../../data/emotions.js';

const { emotions, faceSlots, faceParts, faceBases, messages } = emotionsData;
const texts = messages.buildFace;

function evaluateFace(activity, chosen) {
  const missing = faceSlots.filter(({ id }) => !chosen[id]);
  if (missing.length > 0) {
    const slots = missing.map(({ label }) => label.toLowerCase()).join(', ');
    return { completes: false, tone: 'encourage', title: texts.missingTitle, message: fillTemplate(texts.missing, { slots }) };
  }
  const mismatch = faceSlots.find(({ id }) => !activity.slots[id].accepts.includes(chosen[id]));
  if (mismatch) {
    return { completes: false, tone: 'encourage', title: texts.retryTitle, message: `${activity.slots[mismatch.id].hint} ${texts.retryEnd}` };
  }
  return {
    completes: true,
    tone: 'success',
    title: fillTemplate(texts.successTitle, { emotion: emotions[activity.emotion].name.toLowerCase() }),
    message: `${activity.success} ${messages.notes.faces}`,
  };
}

/** Rosto montado: base + uma camada por região (vazia até a escolha). */
function createFacePreview(base) {
  const layers = new Map(faceSlots.map(({ id }) => [id, el('img', {
    className: `face-builder__layer face-builder__layer--${id}`, attrs: { alt: '', hidden: true },
  })]));
  const element = el('div', { className: 'face-builder__face', attrs: { role: 'img' } }, [
    el('img', { className: 'face-builder__base', attrs: { src: base.image, alt: '', width: 200, height: 200 } }),
    ...layers.values(),
  ]);

  const describe = (chosen) => {
    const details = faceSlots.map(({ id, label }) => `${label}: ${chosen[id] ? faceParts[id][chosen[id]].label : texts.notChosen}`);
    return `${fillTemplate(texts.faceLabel, { name: base.name })}. ${details.join('; ')}.`;
  };

  return {
    element,
    show(chosen) {
      layers.forEach((layer, slotId) => {
        const part = chosen[slotId] && faceParts[slotId][chosen[slotId]];
        layer.hidden = !part;
        if (part) layer.src = part.image;
        else layer.removeAttribute('src');
      });
      element.setAttribute('aria-label', describe(chosen));
    },
  };
}

export function renderBuildFace(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const base = faceBases[activity.base];
  const preview = createFacePreview(base);
  const history = createHistory({});
  const buttonsBySlot = new Map();

  const change = (chosen) => {
    preview.show(chosen);
    buttonsBySlot.forEach((buttons, slotId) => {
      buttons.forEach((button, partId) => button.setAttribute('aria-pressed', String(chosen[slotId] === partId)));
    });
    controls.setUndoEnabled(history.canUndo);
    frame.feedbackSlot.replaceChildren();
  };

  const rows = faceSlots.map(({ id: slotId, label }) => {
    const buttons = new Map(activity.slots[slotId].options.map((partId) => [partId, createChoiceButton({
      label: faceParts[slotId][partId].label,
      image: faceParts[slotId][partId].image,
      onSelect: () => {
        history.push({ ...history.current, [slotId]: partId });
        change(history.current);
      },
    })]));
    buttonsBySlot.set(slotId, buttons);
    return el('li', { className: 'face-builder__row', dataset: { slot: slotId } }, [
      el('h3', { className: 'face-builder__row-title', text: label }),
      createChoiceGroup({ label, choices: [...buttons.values()] }),
    ]);
  });

  const controls = createActivityControls({
    checkLabel: texts.check,
    onCheck: () => showResult(frame, evaluateFace(activity, history.current), complete),
    onUndo: () => change(history.undo()),
    onRestart: () => change(history.reset()),
  });

  frame.choicesSlot.append(
    el('div', { className: 'face-builder' }, [
      el('div', { className: 'face-builder__stage' }, [preview.element]),
      el('ol', { className: 'face-builder__rows', attrs: { role: 'list' } }, rows),
    ]),
    controls.element,
  );
  preview.show({});
  return frame;
}
