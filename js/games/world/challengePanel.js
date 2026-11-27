/**
 * Painel de desafio: mostra, no lugar do mapa, UMA atividade da parte de um
 * módulo ligada ao lugar (ex.: "Higiene" da Minha Rotina).
 *
 * Abre a primeira atividade ainda não feita; quando todas já foram feitas,
 * abre uma de cada vez, em ordem, para repetir. Ao concluir, aparece
 * "Voltar a explorar". O progresso é salvo como antes (progress.js), então
 * estrelas e marcadores continuam valendo.
 */

import { el } from '../../components/dom.js';
import { createButton } from '../../components/button.js';
import { fillTemplate } from '../../components/text.js';
import { MODULES } from '../../modules.js';
import { getCompletedActivityIds, markActivityCompleted } from '../../progress.js';
import { stopSound } from '../../audio.js';

/** Última atividade aberta em cada parte já completa (para repetir em ordem). */
const replayIndex = new Map();

/** Atividades de uma parte e quantas já foram feitas. */
export function challengeProgress({ module: moduleId, part }) {
  const module = MODULES.find(({ id }) => id === moduleId);
  const activities = module.data.activities.filter((activity) => activity.part === part);
  const done = new Set(getCompletedActivityIds(moduleId));
  return { module, activities, completed: activities.filter(({ id }) => done.has(id)).length, total: activities.length };
}

function pickActivity(challenge, activities) {
  const done = new Set(getCompletedActivityIds(challenge.module));
  const pending = activities.findIndex(({ id }) => !done.has(id));
  if (pending >= 0) return { activity: activities[pending], isReplay: false };
  const key = `${challenge.module}:${challenge.part}`;
  const next = ((replayIndex.get(key) ?? -1) + 1) % activities.length;
  replayIndex.set(key, next);
  return { activity: activities[next], isReplay: true };
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
  const { module, activities } = challengeProgress(challenge);
  const part = module.data.parts.find(({ id }) => id === challenge.part);
  const game = await module.load();
  const { activity, isReplay } = pickActivity(challenge, activities);

  const heading = el('h2', { className: 'challenge__title', text: part.title });
  const progressText = el('p', { className: 'challenge__progress' });
  const refreshProgress = () => { progressText.textContent = fillTemplate(texts.progress, challengeProgress(challenge)); };

  function close() {
    stopSound();
    container.replaceChildren();
    onClose();
  }

  const finish = el('div', { className: 'challenge__finish', attrs: { hidden: true } }, [
    createButton({ label: texts.finish, variant: 'module', size: 'lg', icon: 'arrowRight', iconPosition: 'end', onClick: close }),
  ]);
  const { element } = game.renderChallengeActivity(activity, {}, () => {
    markActivityCompleted(module.id, activity.id);
    refreshProgress();
    finish.hidden = false;
  });

  container.replaceChildren(el('section', { className: 'challenge', dataset: { module: module.id } }, [
    el('div', { className: 'challenge__header panel' }, [
      el('div', { className: 'challenge__heading' }, [
        el('p', { className: 'challenge__module', text: module.title }),
        heading,
        progressText,
        isReplay && el('p', { className: 'challenge__note', text: texts.allDone }),
      ]),
      createButton({ label: texts.back, variant: 'secondary', icon: 'arrowLeft', onClick: close }),
    ]),
    element,
    finish,
  ]));
  refreshProgress();
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  container.scrollIntoView({ block: 'start' });
}
