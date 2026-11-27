/**
 * Minha Rotina → missões no mapa.
 *   choice      conversa: o que pode ajudar Noa?
 *   stepByStep  ordenar os passos (ordem fixa); com cena de perto, fazer cada passo com as mãos
 *   sequence    ordenar o dia (só as regras first/last/before contam); com cena de perto, no quadro da rotina
 *   pack        pegar objetos pela casa e levar até a mochila; com cena de perto, arrastar até a mochila aberta
 *   sceneTasks  ir até as coisas do quarto; com cena de perto, mexer nelas no quarto visto de frente
 */

import { fillTemplate } from '../../../../components/text.js';
import { routineData } from '../../../../data/routine.js';
import { NOA, fits } from './common.js';

const { cards, objects } = routineData;

/** Valida a próxima carta de uma sequência pelas regras da atividade. */
function sequenceCheck(activity) {
  const total = activity.cards.length;
  return (chosen, id) => {
    const position = chosen.length;
    for (const rule of activity.rules) {
      if (rule.type === 'first' && ((position === 0 && id !== rule.card) || (id === rule.card && position !== 0))) return { ok: false, reply: rule.hint };
      if (rule.type === 'last' && ((id === rule.card && position !== total - 1) || (position === total - 1 && id !== rule.card))) return { ok: false, reply: rule.hint };
      if (rule.type === 'before' && id === rule.other && !chosen.includes(rule.card)) return { ok: false, reply: rule.hint };
    }
    return { ok: true };
  };
}

/** Arrumar a mochila na cena de perto: cada objeto é arrastado até a mochila aberta. */
function packCloseup(activity, closeup, texts) {
  const def = {
    ...closeup,
    pieces: [...closeup.pieces, ...activity.items.map((item, index) => ({
      id: item.id, image: closeup.itemImages[item.id], ...closeup.itemSpots[index], label: objects[item.id].label, draggable: true,
    }))],
  };
  return [
    { kind: 'say', speaker: NOA, text: activity.greeting },
    {
      kind: 'closeup', speaker: NOA, def, checklist: 'done',
      goal: activity.instruction.replace('Arraste para', 'Arraste até'),
      tasks: activity.items.map((item) => ({
        id: item.id, label: objects[item.id].label, do: { drag: item.id, to: 'bag' }, how: closeup.how,
        ok: item.need !== 'notNeeded', required: item.need === 'essential', hint: item.hint,
        reaction: fillTemplate(texts.packed, objects[item.id]),
        effects: [{ moveTo: item.id, ...closeup.bagMouth }, { hide: item.id }],
      })),
      actions: activity.items.map((item) => ({
        label: fillTemplate(texts.putInBag, objects[item.id]), do: { drag: item.id, to: 'bag' }, task: item.id,
      })),
    },
  ];
}

/** Ordenar o dia no quadro da rotina: cada cartão vai para a próxima casa do quadro. */
function boardScene(activity, closeup, texts) {
  const count = activity.cards.length;
  const check = sequenceCheck(activity);
  const place = ({ x, y }) => ({ x: x + closeup.inset, y: y + closeup.inset });
  const def = {
    ...closeup,
    slots: closeup.slots[count].map(place),
    svgs: activity.cards.map((id) => ({ id, src: cards[id].image, width: closeup.pictureSize, height: closeup.pictureSize, card: true })),
    pieces: [
      ...closeup.pieces,
      ...closeup.slots[count].map((at, index) => ({ id: `slot-${index + 1}`, image: `slot-${index + 1}`, ...at })),
      ...activity.cards.map((id, index) => ({
        id, image: `card:${id}`, ...closeup.tray[count][index], label: cards[id].label, draggable: true,
      })),
    ],
  };
  return [
    { kind: 'say', speaker: NOA, text: activity.greeting },
    {
      kind: 'closeup', speaker: NOA, def, checklist: 'none', goal: texts.boardGoal,
      tasks: activity.cards.map((id) => ({
        id, label: cards[id].label, do: { drag: id, to: 'board' }, how: closeup.how,
        check, effects: [{ place: id }],
        reaction: (n) => fillTemplate(texts.onBoard, { n, label: cards[id].label }),
      })),
      actions: activity.cards.map((id) => ({ label: fillTemplate(texts.putOnBoard, cards[id]), do: { drag: id, to: 'board' }, task: id })),
    },
  ];
}

export const routineAdapters = {
  choice: (activity) => [{
    kind: 'choose', speaker: NOA, text: activity.greeting,
    options: activity.options.map((o) => ({ label: o.label, image: o.image, ok: fits(o.fit), reply: o.message })),
  }],

  stepByStep: (activity, { texts, closeup }) => [
    { kind: 'say', speaker: NOA, text: activity.greeting },
    closeup ? {
      kind: 'closeup', speaker: NOA, def: closeup, ordered: true,
      tasks: activity.steps.map((step) => ({ ...closeup.tasks[step.id], ...step })),
    } : {
      kind: 'order', speaker: NOA, text: texts.whatNext,
      // Os cartões aparecem embaralhados (trayOrder), não na ordem certa.
      cards: (activity.trayOrder ?? activity.steps.map((s) => s.id))
        .map((id) => activity.steps.find((s) => s.id === id)).map((s) => ({ id: s.id, label: s.label, image: s.image })),
      check: (chosen, id) => {
        const expected = activity.steps[chosen.length];
        return id === expected.id ? { ok: true, reply: expected.reaction } : { ok: false, reply: expected.hint };
      },
    },
  ],

  sequence: (activity, { texts, closeup }) => (closeup ? boardScene(activity, closeup, texts) : [
    { kind: 'say', speaker: NOA, text: activity.greeting },
    {
      kind: 'order', speaker: NOA, text: texts.whatNext,
      cards: activity.cards.map((id) => ({ id, ...cards[id] })),
      check: sequenceCheck(activity),
    },
  ]),

  pack: (activity, { spot, texts, closeup }) => (closeup ? packCloseup(activity, closeup, texts) : [
    { kind: 'say', speaker: NOA, text: activity.greeting },
    {
      kind: 'carry', speaker: NOA, goal: activity.instruction.replace('Arraste para', 'Leve até'),
      near: spot.cells[0], to: spot.id, emptyHint: texts.bringSomething,
      items: activity.items.map((item) => ({
        id: item.id, label: objects[item.id].label, image: objects[item.id].image,
        ok: item.need !== 'notNeeded',
        reply: item.need === 'notNeeded' ? item.hint : fillTemplate(texts.packed, objects[item.id]),
      })),
      required: activity.items.filter((item) => item.need === 'essential').map((item) => item.id),
    },
  ]),

  sceneTasks: (activity, { world, bindings, closeup }) => {
    if (closeup) {
      return [
        { kind: 'say', speaker: NOA, text: activity.greeting },
        {
          kind: 'closeup', speaker: NOA, def: closeup,
          tasks: activity.tasks.map((task) => ({
            ...closeup.tasks[task.id], id: task.id, label: task.label, reaction: task.reaction, needs: task.needs, wait: task.wait,
          })),
        },
      ];
    }
    const targets = activity.tasks.map((task) => ({
      spotId: bindings[task.id], label: task.label, reply: task.reaction, wait: task.wait,
      needs: task.needs?.map((id) => bindings[id]),
    }));
    if (targets.some(({ spotId }) => !world.spotById(spotId))) return null;
    return [
      { kind: 'say', speaker: NOA, text: activity.greeting },
      { kind: 'find', speaker: NOA, goal: activity.title, targets },
    ];
  },
};
