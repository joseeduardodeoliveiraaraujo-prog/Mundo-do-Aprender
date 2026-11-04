/**
 * home.js — tela inicial: boas-vindas, escolha do módulo e progresso.
 */

import { el } from '../components/dom.js';
import { createModuleCard } from '../components/moduleCard.js';
import { createProgressBar } from '../components/progressIndicators.js';
import { getModuleProgress } from '../progress.js';

function createWelcome() {
  return el('section', { className: 'welcome panel', attrs: { 'aria-labelledby': 'welcome-title' } }, [
    el('div', { className: 'welcome__content' }, [
      el('h1', {
        className: 'welcome__title',
        text: 'Olá! Que bom ter você aqui.',
        attrs: { id: 'welcome-title' },
        dataset: { pageTitle: 'Início' },
      }),
      el('p', {
        className: 'welcome__text',
        text: 'No Mundo do Aprender você conhece emoções, organiza sua rotina, descobre animais e pratica formas de se comunicar.',
      }),
      el('p', {
        className: 'welcome__text',
        text: 'Escolha um mundo e aprenda no seu ritmo. Não tem tempo nem pontuação.',
      }),
    ]),
    el('img', {
      className: 'welcome__art',
      attrs: { src: 'assets/icons/logo.svg', alt: '', width: 160, height: 160 },
    }),
  ]);
}

function createModulesSection(modules) {
  return el('section', { className: 'home-section', attrs: { 'aria-labelledby': 'modules-title' } }, [
    el('h2', { className: 'home-section__title', text: 'Escolha um mundo', attrs: { id: 'modules-title' } }),
    el('ul', { className: 'module-grid', attrs: { role: 'list' } },
      modules.map((module) => el('li', { className: 'module-grid__item' }, [createModuleCard(module)]))),
  ]);
}

function describeProgress({ completed, total }) {
  if (total === 0) return 'Atividades em preparação';
  if (completed === 0) return `${total} atividades para fazer`;
  return `${completed} de ${total} atividades concluídas`;
}

function createProgressItem({ module, completed, total }) {
  return el('li', { className: 'progress-item', dataset: { module: module.id } }, [
    el('img', { className: 'progress-item__icon', attrs: { src: module.icon, alt: '', width: 40, height: 40 } }),
    el('div', { className: 'progress-item__info' }, [
      el('p', { className: 'progress-item__name', text: module.title }),
      el('p', { className: 'progress-item__status', text: describeProgress({ completed, total }) }),
    ]),
    total > 0 && createProgressBar({ value: completed, max: total, label: `Progresso em ${module.title}` }),
  ]);
}

function createProgressSection(modules) {
  const entries = modules.map((module) => ({
    module,
    ...getModuleProgress(module.id, module.data.activities),
  }));
  const hasProgress = entries.some((entry) => entry.completed > 0);

  return el('section', { className: 'home-section', attrs: { 'aria-labelledby': 'progress-title' } }, [
    el('h2', { className: 'home-section__title', text: 'Meu progresso', attrs: { id: 'progress-title' } }),
    el('div', { className: 'progress-panel panel' }, [
      el('p', {
        className: 'progress-panel__intro',
        text: hasProgress
          ? 'Veja o que você já fez em cada mundo.'
          : 'Quando você terminar atividades, seu progresso vai aparecer aqui.',
      }),
      el('ul', { className: 'progress-list', attrs: { role: 'list' } }, entries.map(createProgressItem)),
    ]),
  ]);
}

/**
 * @param {HTMLElement} view
 * @param {ReadonlyArray<import('../modules.js').ModuleInfo>} modules
 */
export function renderHome(view, modules) {
  view.append(
    el('div', { className: 'home' }, [
      createWelcome(),
      createModulesSection(modules),
      createProgressSection(modules),
    ]),
  );
}
