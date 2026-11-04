/**
 * moduleFlow.js — fluxo padrão de um módulo educativo:
 *   apresentação → atividades (uma por vez) → conclusão.
 *
 * Cuida do que é igual em todos os módulos: cabeçalho, troca de telas com
 * foco no título, "Continuar de onde parei", progresso salvo, tela de
 * conclusão com "Fazer as que faltam" / "Fazer tudo de novo".
 *
 * Cada módulo só informa como desenhar UMA atividade (renderActivity).
 */

import { el } from './dom.js';
import { createButton, createLinkButton } from './button.js';
import { createProgressBar } from './progressIndicators.js';
import { createScreenHeader } from './screenHeader.js';
import {
  getModuleProgress, getCompletedActivityIds, markActivityCompleted, getLastActivityId, saveLastActivity,
} from '../progress.js';
import { getSettings } from '../settings.js';
import { isSpeechAvailable } from '../speech.js';
import { stopSound } from '../audio.js';

/** Preenche "{chave}" com valores. */
export function fillTemplate(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}

/**
 * @typedef {Object} FlowTexts
 * @property {string} progress  ex.: 'Você fez {completed} de {total} atividades.'
 * @property {{ title: string, text: string, note: string, soundHint: string, start: string, resume: string, restart: string }} intro
 * @property {{ title: string, text: string, pending: string, doPending: string, again: string }} completion
 */

/**
 * @typedef {Object} ActivityContext
 * @property {Object} navigation  repasse direto para createActivityFrame (parte, posição, Anterior/Próxima)
 * @property {() => void} complete  registra a atividade como concluída
 */

/**
 * @param {Object} options
 * @param {HTMLElement} options.view
 * @param {import('../modules.js').ModuleInfo} options.module
 * @param {ReadonlyArray<{ id: string, title: string, description: string }>} options.parts
 * @param {ReadonlyArray<{ id: string, part: string }>} options.activities
 * @param {FlowTexts} options.texts
 * @param {(activity: Object, index: number, context: ActivityContext) => { element: HTMLElement, focusTarget: HTMLElement }} options.renderActivity
 * @param {() => Node} [options.renderCompletionExtra]  conteúdo extra na conclusão
 * @returns {() => void} limpeza (para o roteador)
 */
export function startModuleFlow({ view, module, parts, activities, texts, renderActivity, renderCompletionExtra }) {
  const lastIndex = activities.length - 1;
  const stage = el('div', { className: 'flow-stage' });
  view.append(el('section', { className: 'game-screen', dataset: { module: module.id } }, [
    createScreenHeader({ title: module.title, icon: module.icon }),
    stage,
  ]));

  let isFirstScreen = true;

  function show({ element, focusTarget }) {
    stopSound(); // para som e voz ao trocar de tela
    stage.replaceChildren(element);
    if (isFirstScreen) {
      isFirstScreen = false; // na entrada, o roteador já foca o <h1>
      return;
    }
    window.scrollTo(0, 0);
    focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });
  }

  function goToActivity(index) {
    saveLastActivity(module.id, activities[index].id);
    const activity = activities[index];
    show(renderActivity(activity, index, {
      navigation: {
        partTitle: parts.find(({ id }) => id === activity.part)?.title,
        current: index + 1,
        total: activities.length,
        onPrevious: index > 0 ? () => goToActivity(index - 1) : null,
        onNext: index < lastIndex ? () => goToActivity(index + 1) : finish,
        nextLabel: index < lastIndex ? 'Próxima' : 'Concluir',
      },
      complete: () => markActivityCompleted(module.id, activity.id),
    }));
  }

  function finish() {
    saveLastActivity(module.id, null);
    show(createCompletionScreen());
  }

  function createProgressSummary() {
    const { completed, total } = getModuleProgress(module.id, activities);
    return el('div', { className: 'flow-progress' }, [
      el('p', { text: fillTemplate(texts.progress, { completed, total }) }),
      createProgressBar({ value: completed, max: total, label: `Progresso em ${module.title}` }),
    ]);
  }

  function createPartsList() {
    return el('ol', { className: 'flow-parts', attrs: { role: 'list' }, dataset: { count: String(parts.length) } },
      parts.map((part) => {
        const count = activities.filter((activity) => activity.part === part.id).length;
        return el('li', { className: 'flow-part' }, [
          el('p', { className: 'flow-part__count', text: count === 1 ? '1 atividade' : `${count} atividades` }),
          el('h3', { className: 'flow-part__title', text: part.title }),
          el('p', { text: part.description }),
        ]);
      }));
  }

  function createIntroScreen() {
    const { completed } = getModuleProgress(module.id, activities);
    const savedIndex = activities.findIndex((activity) => activity.id === getLastActivityId(module.id));
    const heading = el('h2', { className: 'flow-screen__title', text: texts.intro.title });
    const startButton = (label, index) => createButton({
      label, variant: 'module', size: 'lg', icon: 'arrowRight', iconPosition: 'end', onClick: () => goToActivity(index),
    });

    const actions = savedIndex > 0
      ? [
        startButton(texts.intro.resume, savedIndex),
        createButton({
          label: texts.intro.restart, variant: 'secondary', size: 'lg', icon: 'restart', onClick: () => goToActivity(0),
        }),
      ]
      : [startButton(texts.intro.start, 0)];

    const element = el('div', { className: 'flow-screen panel' }, [
      heading,
      el('p', { className: 'flow-lead', text: texts.intro.text }),
      createPartsList(),
      el('p', { className: 'flow-note', text: texts.intro.note }),
      !getSettings().soundEnabled && isSpeechAvailable() && el('p', { className: 'flow-note', text: texts.intro.soundHint }),
      completed > 0 && createProgressSummary(),
      el('div', { className: 'flow-actions' }, actions),
    ]);
    return { element, focusTarget: heading };
  }

  function createCompletionScreen() {
    const done = new Set(getCompletedActivityIds(module.id));
    const pendingIndex = activities.findIndex((activity) => !done.has(activity.id));
    const hasPending = pendingIndex >= 0;
    const heading = el('h2', { className: 'flow-screen__title', text: texts.completion.title });

    const element = el('div', { className: 'flow-screen flow-screen--done panel' }, [
      el('img', { className: 'flow-screen__art', attrs: { src: module.illustration, alt: '', width: 240, height: 160 } }),
      heading,
      el('p', { className: 'flow-lead', text: texts.completion.text }),
      renderCompletionExtra?.(),
      createProgressSummary(),
      hasPending && el('p', { className: 'flow-note', text: texts.completion.pending }),
      el('div', { className: 'flow-actions' }, [
        hasPending && createButton({
          label: texts.completion.doPending,
          variant: 'module',
          icon: 'arrowRight',
          iconPosition: 'end',
          onClick: () => goToActivity(pendingIndex),
        }),
        createButton({
          label: texts.completion.again, variant: 'secondary', icon: 'restart', onClick: () => goToActivity(0),
        }),
        createLinkButton({
          href: '#/', label: 'Voltar ao início', variant: hasPending ? 'secondary' : 'primary', icon: 'arrowLeft',
        }),
      ]),
    ]);
    return { element, focusTarget: heading };
  }

  show(createIntroScreen());
  return stopSound;
}
