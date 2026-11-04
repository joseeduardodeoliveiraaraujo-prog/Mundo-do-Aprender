/**
 * navigation.js — roteador simples baseado em hash (#/rota).
 *
 * Por que hash? Funciona em qualquer servidor estático, sem configuração.
 *
 * Contrato de uma rota:
 *   handler(view) desenha a tela dentro de `view` (um <div> novo) e pode
 *   retornar (ou resolver em) uma função de limpeza, chamada ao sair da tela.
 *   Use a limpeza para parar timers, remover listeners globais, parar sons etc.
 */

const APP_NAME = 'Mundo do Aprender';

/** @typedef {(view: HTMLElement) => (void | (() => void) | Promise<void | (() => void)>)} RouteHandler */

/** @type {Map<string, RouteHandler>} */
const routes = new Map();

let outlet = null;
let notFoundHandler = null;
let errorHandler = null;
let activeCleanup = null;
let renderTicket = 0;
let isFirstRender = true;

function normalizePath(path) {
  const withoutQuery = String(path).split('?')[0];
  const withSlash = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  const trimmed = withSlash.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * Registra uma rota.
 * @param {string} path ex.: '/', '/emocoes'
 * @param {RouteHandler} handler
 */
export function registerRoute(path, handler) {
  routes.set(normalizePath(path), handler);
}

/** @returns {string} rota atual, ex.: '/emocoes' */
export function getCurrentPath() {
  const { hash } = window.location;
  return hash.startsWith('#/') ? normalizePath(hash.slice(1)) : '/';
}

/** Navega para uma rota (ex.: navigateTo('/rotina')). */
export function navigateTo(path) {
  const target = `#${normalizePath(path)}`;
  if (window.location.hash === target) {
    renderCurrentRoute();
  } else {
    window.location.hash = target;
  }
}

/**
 * Inicia o roteador.
 * @param {HTMLElement} container elemento onde as telas serão desenhadas
 * @param {{ notFound?: RouteHandler, onError?: (view: HTMLElement, error: unknown) => void }} [options]
 */
export function startRouter(container, { notFound, onError } = {}) {
  outlet = container;
  notFoundHandler = notFound ?? null;
  errorHandler = onError ?? null;
  window.addEventListener('hashchange', renderCurrentRoute);
  renderCurrentRoute();
}

async function renderCurrentRoute() {
  const { hash } = window.location;
  // Âncoras comuns (ex.: #conteudo) não são rotas.
  if (hash && !hash.startsWith('#/')) return;

  const ticket = ++renderTicket;
  const handler = routes.get(getCurrentPath()) ?? notFoundHandler;
  const view = document.createElement('div');
  view.className = 'view';

  let cleanup;
  try {
    cleanup = handler ? await handler(view) : undefined;
  } catch (error) {
    console.error('[navigation] Erro ao abrir a tela.', error);
    view.replaceChildren();
    errorHandler?.(view, error);
  }

  // Se o usuário navegou de novo enquanto esta tela carregava, descarta esta.
  if (ticket !== renderTicket) {
    if (typeof cleanup === 'function') cleanup();
    return;
  }

  if (typeof activeCleanup === 'function') activeCleanup();
  activeCleanup = typeof cleanup === 'function' ? cleanup : null;

  outlet.replaceChildren(view);
  announceView(view);
}

/** Atualiza o título da aba e move o foco para o título da nova tela. */
function announceView(view) {
  const heading = view.querySelector('h1');
  const pageTitle = heading?.dataset.pageTitle ?? heading?.textContent;
  document.title = pageTitle ? `${pageTitle} · ${APP_NAME}` : APP_NAME;

  if (isFirstRender) {
    isFirstRender = false;
    return;
  }

  window.scrollTo(0, 0);
  if (heading) {
    heading.tabIndex = -1;
    heading.focus();
  }
}
