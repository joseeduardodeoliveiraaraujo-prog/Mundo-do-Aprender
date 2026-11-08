/**
 * Peças usadas pelas mecânicas de "Eu Me Comunico":
 *
 *   createNoa        Noa com o balão de fala
 *   createTalkScene  cenário com Noa, a pessoa que escuta e as camadas que mudam
 *   heardTitle       título do retorno ("Gabi entendeu!")
 *   pieceOf          dados de um cartão no formato do tabuleiro
 */

import { el } from '../../components/dom.js';
import { createCompanion } from '../../components/companion.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { createSceneLayers } from '../../components/sceneLayers.js';
import { communicationData } from '../../data/communication.js';

const { people, scenes, cards, messages } = communicationData;

export const createNoa = (options) => createCompanion({ character: people.noa, ...options });
export const heardTitle = (listenerId) => fillTemplate(messages.heard, { listener: people[listenerId].name });
export const pieceOf = (cardId) => ({ id: cardId, label: cards[cardId].label, image: cards[cardId].image });

/** @param {boolean} [options.banner]  faixa baixa, para sobrar espaço para a conversa */
export function createTalkScene(activity, { banner = false } = {}) {
  const { poses, name } = people[activity.listener];
  const before = activity.before ?? [];
  const after = activity.after ?? [];
  const layers = createSceneLayers(
    { ...scenes[activity.scene], alt: fillTemplate(messages.sceneAlt, { scene: scenes[activity.scene].alt, listener: name }) },
    [...before, ...after],
  );
  const figure = (src, side) => el('img', {
    className: `talk-scene__person talk-scene__person--${side}`,
    attrs: { src, alt: '', width: 120, height: 140, draggable: 'false' },
  });
  const noaMood = activity.mood ?? 'neutral';
  const noa = figure(people.noa.poses[noaMood], 'noa');
  const listener = figure(poses.neutral, 'listener');
  const { element } = layers;
  element.classList.add('talk-scene');
  element.classList.toggle('talk-scene--banner', banner);
  element.append(noa, listener);

  function setDone(done) {
    before.forEach((src) => layers.toggle(src, !done));
    after.forEach((src) => layers.toggle(src, done));
    noa.src = people.noa.poses[done ? 'happy' : noaMood];
    listener.src = done ? poses.happy : poses.neutral;
    listener.classList.remove('is-happy');
    if (done) {
      void listener.offsetWidth; // reinicia o pulinho
      listener.classList.add('is-happy');
    }
  }
  setDone(false);
  return { element, setDone };
}
