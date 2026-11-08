/**
 * Progresso visual e recompensas da Minha Rotina. Tudo é calculado a partir do
 * progresso salvo (atividades concluídas): não há outra informação guardada.
 *
 *   createDayTrail  trilha compacta no topo de cada atividade
 *   createDayMap    mapa dos momentos do dia (apresentação e conclusão)
 *   completeWithReward  conclui a atividade e diz o que a criança ganhou
 *   createReward    cartão com a estrela ou a figurinha ganha
 *
 * Uma estrela por atividade; uma figurinha por momento completo. Nenhum momento
 * fica bloqueado: a criança pode ir a qualquer um, a qualquer hora.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { getCompletedActivityIds, getModuleProgress } from '../../progress.js';
import { routineData } from '../../data/routine.js';

const { moduleId, parts, activities, companion, messages } = routineData;
const texts = messages.journey;

const completedIds = () => new Set(getCompletedActivityIds(moduleId));
const activitiesOf = (partId) => activities.filter(({ part }) => part === partId);
const progressOf = (partId, done = completedIds()) => {
  const list = activitiesOf(partId);
  return { done: list.filter(({ id }) => done.has(id)).length, total: list.length };
};

const starsText = () => fillTemplate(texts.stars, getModuleProgress(moduleId, activities));

export function createDayTrail(currentPartId) {
  const stars = el('p', { className: 'day-trail__stars' });
  const starLabel = el('span');
  stars.append(createIcon('star'), starLabel);

  const stops = parts.map((part) => {
    const element = el('li', { className: 'day-trail__stop' }, [
      el('img', { className: 'day-trail__image', attrs: { src: part.sticker.image, alt: '', width: 48, height: 48 } }),
      el('span', { className: 'day-trail__label', attrs: { 'aria-hidden': 'true' }, text: part.title }),
      el('span', { className: 'day-trail__mark', attrs: { 'aria-hidden': 'true' } }, [createIcon('star')]),
    ]);
    if (part.id === currentPartId) {
      element.classList.add('is-current');
      element.setAttribute('aria-current', 'step');
    }
    return { part, element };
  });

  function refresh() {
    const done = completedIds();
    starLabel.textContent = starsText();
    stops.forEach(({ part, element }) => {
      const progress = progressOf(part.id, done);
      element.classList.toggle('is-done', progress.done === progress.total);
      element.setAttribute('aria-label', fillTemplate(texts.stop, { title: part.title, ...progress }));
    });
  }
  refresh();

  return {
    element: el('nav', { className: 'day-trail', attrs: { 'aria-label': texts.label } }, [
      el('ol', { className: 'day-trail__stops', attrs: { role: 'list' } }, stops.map(({ element }) => element)),
      stars,
    ]),
    refresh,
  };
}

/** Mapa do dia: cada momento é um botão e mostra as estrelas ou a figurinha ganha. */
export function createDayMap({ goToActivity }) {
  const done = completedIds();
  const openPart = (partId) => {
    const list = activitiesOf(partId);
    const target = list.find(({ id }) => !done.has(id)) ?? list[0];
    goToActivity(activities.indexOf(target));
  };

  return el('div', { className: 'day-map' }, [
    el('div', { className: 'day-map__header' }, [
      el('img', { className: 'day-map__noa', attrs: { src: companion.poses.happy, alt: '', width: 120, height: 140 } }),
      el('p', { className: 'day-map__stars' }, [createIcon('star'), el('span', { text: starsText() })]),
    ]),
    el('ol', { className: 'day-map__stops', attrs: { role: 'list', 'aria-label': texts.mapLabel } }, parts.map((part) => {
      const progress = progressOf(part.id, done);
      const won = progress.done === progress.total;
      const button = el('button', { className: `day-map__stop${won ? ' is-won' : ''}`, attrs: { type: 'button' } }, [
        el('img', { className: 'day-map__image', attrs: { src: part.sticker.image, alt: '', width: 64, height: 64 } }),
        el('span', { className: 'day-map__title', text: part.title }),
        el('span', { className: 'day-map__status', text: won ? fillTemplate(texts.mapWon, part.sticker) : fillTemplate(texts.mapPending, progress) }),
      ]);
      button.addEventListener('click', () => openPart(part.id));
      return el('li', {}, [button]);
    })),
  ]);
}

/**
 * Registra a atividade e informa a recompensa nova, se houver.
 * @returns {null | { type: 'star' } | { type: 'sticker', sticker: { label: string, image: string } }}
 */
export function completeWithReward(activity, complete) {
  const before = completedIds();
  complete();
  if (before.has(activity.id)) return null;
  const progress = progressOf(activity.part);
  return progress.done === progress.total
    ? { type: 'sticker', sticker: parts.find(({ id }) => id === activity.part).sticker }
    : { type: 'star' };
}

export function createReward(reward) {
  const isSticker = reward.type === 'sticker';
  return el('div', { className: `routine-reward${isSticker ? ' routine-reward--sticker' : ''}` }, [
    isSticker
      ? el('img', { className: 'routine-reward__image', attrs: { src: reward.sticker.image, alt: '', width: 64, height: 64 } })
      : el('span', { className: 'routine-reward__star', attrs: { 'aria-hidden': 'true' } }, [createIcon('star')]),
    el('p', { className: 'routine-reward__text', text: isSticker ? fillTemplate(texts.stickerWon, reward.sticker) : texts.starWon }),
  ]);
}
