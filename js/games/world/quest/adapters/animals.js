/**
 * Explorando os Animais → missões no mapa (os animais já estão no mapa).
 *   explore          ir até cada animal da região e conhecer (o do lugar do desafio
 *                    já está na frente de Noa: ele é apresentado na hora)
 *   identify, sound  achar o animal pela pista ou pelo som; se o animal é o próprio
 *                    lugar do desafio, vira uma pergunta com cartões de animais
 *   learn            levar a comida certa até o animal; depois, curiosidades
 *   habitat          conversa: onde cada animal vive?
 */

import { fillTemplate } from '../../../../components/text.js';
import { animalsData } from '../../../../data/animals.js';
import { NOA } from './common.js';

const { animals, regions, habitats } = animalsData;
/** Completam as alternativas quando a região tem poucos animais. */
const OTHER_ANIMALS = ['cow', 'duck', 'lion'];

/** Fala de um animal: nome, som e curiosidade (o mesmo texto de quando Noa encontra o animal passeando). */
export function animalLine(id, texts) {
  const animal = animals[id];
  const sound = animal.sound.text.replace(/^\((.*)\)$/, '$1');
  return fillTemplate(sound === animal.sound.text ? texts.animalSays : texts.animalQuiet, { name: animal.name, sound, fact: animal.fact });
}

/** Animais da região que estão no mapa atual (lugares com `animal`). */
function regionSpots(region, world) {
  const ids = regions[region].animals.map(({ id }) => id);
  return world.spotsWhere((spot) => ids.includes(spot.animal));
}

/** Pergunta com cartões quando o animal procurado já está na frente de Noa. */
function chooseAnimal(activity, { speaker, texts }, question) {
  const ids = [...new Set([activity.animal, ...regions[activity.region].animals.map(({ id }) => id), ...OTHER_ANIMALS])]
    .slice(0, 3)
    .sort((a, b) => animals[a].name.localeCompare(animals[b].name));
  return [{
    kind: 'choose', speaker, text: question,
    options: ids.map((id) => ({
      label: animals[id].name, image: animals[id].image, ok: id === activity.animal,
      reply: id === activity.animal ? fillTemplate(texts.foundAnimal, animals[id]) : activity.hint,
    })),
  }];
}

function findAnimal(activity, context, goal, question = goal) {
  const { world, spot, speaker, texts } = context;
  const spots = regionSpots(activity.region, world);
  const target = spots.find((item) => item.animal === activity.animal);
  if (!target) return null;
  if (target.id === spot.id) return chooseAnimal(activity, context, question);
  return [
    { kind: 'say', speaker, text: goal },
    {
      kind: 'find', speaker, goal, hideList: true,
      targets: [{ spotId: target.id, label: animals[activity.animal].name, reply: fillTemplate(texts.foundAnimal, animals[activity.animal]) }],
      others: (spot) => (spot.animal ? activity.hint : null),
    },
  ];
}

export const animalsAdapters = {
  explore: (activity, { world, spot, speaker, texts }) => {
    const spots = regionSpots(activity.region, world);
    if (!spots.length) return null;
    const here = spots.find((item) => item.id === spot.id);
    const others = spots.filter((item) => item !== here);
    return [
      ...(here ? [{ kind: 'say', speaker: NOA, text: animalLine(here.animal, texts) }] : []),
      ...(others.length ? [
        { kind: 'say', speaker, text: here ? texts.exploreMore : texts.exploreIntro },
        {
          kind: 'find', speaker: NOA, goal: activity.title,
          targets: others.map((item) => ({ spotId: item.id, label: animals[item.animal].name, reply: animalLine(item.animal, texts) })),
        },
      ] : []),
    ];
  },

  identify: (activity, context) => findAnimal(activity, context, activity.clue),

  sound: (activity, context) => findAnimal(activity, context,
    fillTemplate(context.texts.whoMakesSound, { sound: animals[activity.animal].sound.text }),
    fillTemplate(context.texts.whoMakesSoundHere, { sound: animals[activity.animal].sound.text })),

  learn: (activity, { world, spot, speaker, texts }) => {
    const target = world.spotsWhere((item) => item.animal === activity.animal)[0];
    if (!target) return null;
    const name = animals[activity.animal].name.toLowerCase();
    return [
      { kind: 'say', speaker, text: fillTemplate(texts.feedIntro, { name }) },
      {
        kind: 'carry', speaker, goal: fillTemplate(texts.feedGoal, { name }), near: spot.cells[0], to: target.id,
        emptyHint: texts.bringFood,
        items: activity.options.map((option) => ({
          id: option.id, label: option.label, image: option.image,
          ok: option.id === activity.answer, reply: option.id === activity.answer ? activity.explanation : activity.hint,
        })),
        required: [activity.answer],
      },
      ...activity.facts.map((fact) => ({ kind: 'say', speaker, text: fact.text, image: fact.image ? { src: fact.image, alt: '' } : undefined })),
    ];
  },

  habitat: (activity, { speaker, texts }) => activity.animals.map((item) => ({
    kind: 'choose', speaker,
    text: fillTemplate(texts.whereLives, animals[item.id]), image: { src: animals[item.id].image, alt: animals[item.id].name },
    options: activity.habitats.map((id) => ({
      label: habitats[id].name, image: habitats[id].image, ok: item.accepts.includes(id),
      reply: item.accepts.includes(id) ? fillTemplate(texts.livesThere, { name: animals[item.id].name, place: habitats[id].name.toLowerCase() }) : item.hint,
    })),
  })),
};
