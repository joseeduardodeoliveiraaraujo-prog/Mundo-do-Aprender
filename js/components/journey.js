/**
 * journey.js — progresso visual e recompensas de um módulo em forma de jornada.
 *
 *   createTrail   trilha compacta no topo de cada atividade
 *   createMap     mapa das partes do módulo (apresentação e conclusão)
 *   wrapActivity  desenha a atividade com a trilha e entrega as recompensas
 *
 * Tudo é calculado a partir do progresso salvo (atividades concluídas): não há
 * outra informação guardada. Uma estrela por atividade; uma figurinha por parte
 * completa (`part.sticker: { label, image }`). Nenhuma parte fica bloqueada: a
 * criança pode ir a qualquer uma, a qualquer hora.
 */

import { el } from './dom.js';
import { createIcon } from './icons.js';
import { fillTemplate } from './moduleFlow.js';
import { getCompletedActivityIds, getModuleProgress } from '../progress.js';

/**
 * @param {Object} options
 * @param {string} options.moduleId
 * @param {ReadonlyArray<{ id: string, title: string, sticker: { label: string, image: string } }>} options.parts
 * @param {ReadonlyArray<{ id: string, part: string }>} options.activities
 * @param {Record<string, string>} options.texts  label, stars, stop, mapLabel, mapPending, mapWon, starWon, stickerWon
 * @param {string} [options.mapArt]  imagem ao lado das estrelas, no mapa
 */
export function createJourney({ moduleId, parts, activities, texts, mapArt }) {
  const completedIds = () => new Set(getCompletedActivityIds(moduleId));
  const activitiesOf = (partId) => activities.filter(({ part }) => part === partId);
  const progressOf = (partId, done = completedIds()) => {
    const list = activitiesOf(partId);
    return { done: list.filter(({ id }) => done.has(id)).length, total: list.length };
  };
  const starsText = () => fillTemplate(texts.stars, getModuleProgress(moduleId, activities));

  function createTrail(currentPartId) {
    const starLabel = el('span');
    const stars = el('p', { className: 'journey-trail__stars' }, [createIcon('star'), starLabel]);

    const stops = parts.map((part) => {
      const element = el('li', { className: 'journey-trail__stop' }, [
        el('img', { className: 'journey-trail__image', attrs: { src: part.sticker.image, alt: '', width: 48, height: 48 } }),
        el('span', { className: 'journey-trail__label', attrs: { 'aria-hidden': 'true' }, text: part.title }),
        el('span', { className: 'journey-trail__mark', attrs: { 'aria-hidden': 'true' } }, [createIcon('star')]),
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

    const list = el('ol', { className: 'journey-trail__stops', attrs: { role: 'list' } }, stops.map(({ element }) => element));
    list.style.setProperty('--journey-stops', String(parts.length));
    return { element: el('nav', { className: 'journey-trail', attrs: { 'aria-label': texts.label } }, [list, stars]), refresh };
  }

  /** Cada parte é um botão e mostra as estrelas ou a figurinha ganha. */
  function createMap({ goToActivity }) {
    const done = completedIds();
    const openPart = (partId) => {
      const list = activitiesOf(partId);
      goToActivity(activities.indexOf(list.find(({ id }) => !done.has(id)) ?? list[0]));
    };

    return el('div', { className: 'journey-map' }, [
      el('div', { className: 'journey-map__header' }, [
        mapArt && el('img', { className: 'journey-map__art', attrs: { src: mapArt, alt: '', width: 120, height: 140 } }),
        el('p', { className: 'journey-map__stars' }, [createIcon('star'), el('span', { text: starsText() })]),
      ]),
      el('ol', { className: 'journey-map__stops', attrs: { role: 'list', 'aria-label': texts.mapLabel } }, parts.map((part) => {
        const progress = progressOf(part.id, done);
        const won = progress.done === progress.total;
        const button = el('button', { className: `journey-map__stop${won ? ' is-won' : ''}`, attrs: { type: 'button' } }, [
          el('img', { className: 'journey-map__image', attrs: { src: part.sticker.image, alt: '', width: 64, height: 64 } }),
          el('span', { className: 'journey-map__title', text: part.title }),
          el('span', { className: 'journey-map__status', text: won ? fillTemplate(texts.mapWon, part.sticker) : fillTemplate(texts.mapPending, progress) }),
        ]);
        button.addEventListener('click', () => openPart(part.id));
        return el('li', {}, [button]);
      })),
    ]);
  }

  /** Registra a atividade e informa a recompensa nova, se houver. */
  function completeWithReward(activity, complete) {
    const before = completedIds();
    complete();
    if (before.has(activity.id)) return null;
    const progress = progressOf(activity.part);
    return progress.done === progress.total
      ? { type: 'sticker', sticker: parts.find(({ id }) => id === activity.part).sticker }
      : { type: 'star' };
  }

  function createReward(reward) {
    const isSticker = reward.type === 'sticker';
    return el('div', { className: `journey-reward${isSticker ? ' journey-reward--sticker' : ''}` }, [
      isSticker
        ? el('img', { className: 'journey-reward__image', attrs: { src: reward.sticker.image, alt: '', width: 64, height: 64 } })
        : el('span', { className: 'journey-reward__star', attrs: { 'aria-hidden': 'true' } }, [createIcon('star')]),
      el('p', { className: 'journey-reward__text', text: isSticker ? fillTemplate(texts.stickerWon, reward.sticker) : texts.starWon }),
    ]);
  }

  /**
   * Desenha uma atividade com a trilha no topo e a recompensa ao concluir.
   * @param {Object} activity
   * @param {() => void} complete
   * @param {(onComplete: () => void) => { element: HTMLElement, heading: HTMLElement, feedbackSlot: HTMLElement }} renderFrame
   * @param {Node} [extra]  elemento entre a trilha e a atividade (ex.: botão de som)
   */
  function wrapActivity(activity, complete, renderFrame, extra) {
    const trail = createTrail(activity.part);
    const frame = renderFrame(() => {
      const reward = completeWithReward(activity, complete);
      if (!reward) return;
      trail.refresh();
      frame.feedbackSlot.append(createReward(reward));
    });
    return { element: el('div', { className: 'journey-game' }, [trail.element, extra, frame.element]), focusTarget: frame.heading };
  }

  return { createTrail, createMap, wrapActivity };
}
