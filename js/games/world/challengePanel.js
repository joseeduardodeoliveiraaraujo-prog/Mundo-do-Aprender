/**
 * Painel de desafio: mostra, no lugar do mapa, as atividades de uma parte de
 * um módulo (ex.: "Higiene" da Minha Rotina), uma por vez.
 *
 * Começa pela primeira atividade ainda não feita. "Anterior"/"Próxima" andam
 * dentro da parte; na última, o botão leva de volta ao jogo. O progresso é
 * salvo como antes (progress.js), então estrelas e marcadores continuam valendo.
 */

import { el } from '../../components/dom.js';
import { createButton } from '../../components/button.js';
import { fillTemplate } from '../../components/text.js';
import { MODULES } from '../../modules.js';
import { getCompletedActivityIds, markActivityCompleted } from '../../progress.js';
import { stopSound } from '../../audio.js';

/** Atividades de uma parte e quantas já foram feitas. */
export function challengeProgress({ module: moduleId, part }) {
  const module = MODULES.find(({ id }) => id === moduleId);
  const activities = module.data.activities.filter((activity) => activity.part === part);
  const done = new Set(getCompletedActivityIds(moduleId));
  return { module, activities, completed: activities.filter(({ id }) => done.has(id)).length, total: activities.length };
}

/**
 * @param {Object} options
 * @param {HTMLElement} options.container  onde o painel é desenhado
 * @param {{ module: string, part: string }} options.challenge
 * @param {Object} options.texts  worldData.texts.challenge
 * @param {() => void} options.onClose
 * @returns {Promise<void>}
 */
export async function openChallenge({ container, challenge, texts, onClose }) {
  const { module, activities, completed, total } = challengeProgress(challenge);
  const part = module.data.parts.find(({ id }) => id === challenge.part);
  const game = await module.load();

  const heading = el('h2', { className: 'challenge__title', text: part.title });
  const progressText = el('p', { className: 'challenge__progress' });
  const body = el('div', { className: 'challenge__body' });

  function close() {
    stopSound();
    container.replaceChildren();
    onClose();
  }

  function refreshProgress() {
    const progress = challengeProgress(challenge);
    progressText.textContent = fillTemplate(texts.progress, progress);
  }

  function show(index) {
    stopSound();
    const activity = activities[index];
    const isLast = index === activities.length - 1;
    const { element, focusTarget } = game.renderChallengeActivity(activity, {
      partTitle: part.title,
      current: index + 1,
      total: activities.length,
      onPrevious: index > 0 ? () => show(index - 1) : null,
      onNext: isLast ? close : () => show(index + 1),
      nextLabel: isLast ? texts.finish : texts.next,
    }, () => {
      markActivityCompleted(module.id, activity.id);
      refreshProgress();
    });
    body.replaceChildren(element);
    refreshProgress();
    return focusTarget;
  }

  container.replaceChildren(el('section', { className: 'challenge', dataset: { module: module.id } }, [
    el('div', { className: 'challenge__header panel' }, [
      el('div', { className: 'challenge__heading' }, [
        el('p', { className: 'challenge__module', text: module.title }),
        heading,
        progressText,
        completed === total && el('p', { className: 'challenge__note', text: texts.allDone }),
      ]),
      createButton({ label: texts.back, variant: 'secondary', icon: 'arrowLeft', onClick: close }),
    ]),
    body,
  ]));

  const done = new Set(getCompletedActivityIds(module.id));
  const firstPending = activities.findIndex(({ id }) => !done.has(id));
  show(firstPending >= 0 ? firstPending : 0);
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  container.scrollIntoView({ block: 'start' });
}
