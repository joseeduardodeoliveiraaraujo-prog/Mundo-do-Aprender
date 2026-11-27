/**
 * Mundo das Emoções → missões no mapa.
 *   recognize      conversa: que emoção o rosto mostra?
 *   express        conversa: o que você poderia fazer ou dizer? (todas valem)
 *   investigate    procurar pistas (lupas) no mapa; depois, como a pessoa se sente?
 *   matchEmotions  conversa com cada amigo: como ele se sente?
 *   arrangeScene   levar objetos que acalmam até o banco (o tambor volta)
 *   buildFace      sem tradução: abre na mesa sobre o mapa
 */

import { fillTemplate } from '../../../../components/text.js';
import { emotionsData } from '../../../../data/emotions.js';
import { NOA, fits } from './common.js';

const { emotions, expressions, messages } = emotionsData;
const emotionCard = (id) => ({ label: emotions[id].name, image: emotions[id].face });

export const emotionsAdapters = {
  recognize: (activity, { speaker }) => [{
    kind: 'choose', speaker, text: activity.instruction, image: activity.image,
    options: activity.options.map((id) => ({
      ...emotionCard(id),
      ok: id === activity.answer,
      reply: id === activity.answer
        ? `${fillTemplate(messages.recognize.success, { emotion: emotions[id].name.toLowerCase() })} ${messages.notes.faces}`
        : activity.hint,
    })),
  }],

  express: (activity, { speaker }) => [{
    kind: 'choose', speaker, text: activity.instruction, image: activity.image,
    options: activity.options.map((id) => ({
      label: expressions[id].label, icon: expressions[id].icon, ok: true, reply: expressions[id].feedback,
    })),
  }],

  investigate: (activity, { speaker, spot, texts }) => {
    const ids = activity.clues.map((_, index) => `clue-${index}`);
    return [
      { kind: 'say', speaker, text: activity.instruction.replace('Use a lupa para investigar a cena.', texts.cluesIntro), image: activity.image },
      {
        kind: 'clues', speaker, near: spot.cells[0], goal: texts.findClues,
        clues: activity.clues.map((clue, index) => ({ id: ids[index], label: clue.label, reply: clue.text, image: activity.image })),
      },
      {
        kind: 'choose', speaker, text: activity.question,
        options: activity.options.map((o) => ({ ...emotionCard(o.emotion), ok: fits(o.fit), reply: o.message })),
      },
    ];
  },

  matchEmotions: (activity, { speaker, texts }) => activity.cards.map((friend) => ({
    kind: 'choose', speaker, image: { src: friend.image, alt: friend.situation },
    text: fillTemplate(texts.howFeels, { name: friend.name, situation: friend.situation }),
    options: activity.pieces.map((id) => ({
      ...emotionCard(id), ok: friend.accepts.includes(id), reply: friend.fits[id] ?? `${friend.otherwise} ${friend.hint}`,
    })),
  })),

  arrangeScene: (activity, { spot, texts }) => [
    { kind: 'say', speaker: NOA, text: texts.calmCorner },
    {
      kind: 'carry', speaker: NOA, goal: texts.calmCornerGoal, near: spot.cells[0], to: spot.id, emptyHint: texts.bringSomething,
      items: activity.items.map((item) => ({ id: item.id, label: item.label, image: item.image, ok: item.helps, reply: item.reaction })),
      required: activity.items.filter((item) => item.helps).map((item) => item.id),
    },
  ],
};
