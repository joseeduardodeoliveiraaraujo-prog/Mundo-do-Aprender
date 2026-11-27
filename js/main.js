/**
 * main.js — ponto de entrada da aplicação.
 * Apenas conecta as peças: preferências, diálogos, ícones e rotas.
 */

import { applySettings } from './settings.js';
import { registerRoute, startRouter, navigateTo } from './navigation.js';
import { MODULES } from './modules.js';
import { hydrateIcons } from './components/icons.js';
import { connectDialogs } from './components/dialog.js';
import { initSettingsPanel } from './components/settingsPanel.js';
import { renderNotFound, renderLoadError } from './views/messages.js';

function setupSkipLink(link, target) {
  // Evita que o link altere o hash (o que seria interpretado pelo roteador).
  link.addEventListener('click', (event) => {
    event.preventDefault();
    target.focus();
  });
}

function registerRoutes() {
  // O app inteiro é o jogo "Bairro do Noa"; os módulos viraram desafios dentro dele.
  registerRoute('/', async (view) => {
    const game = await import('./games/world.js');
    return game.render(view);
  });
  // Endereços antigos dos módulos levam ao jogo.
  MODULES.forEach((module) => registerRoute(module.route, () => navigateTo('/')));
}

function init() {
  const main = document.getElementById('conteudo');

  applySettings();
  hydrateIcons(document);
  connectDialogs(document);
  initSettingsPanel(document.getElementById('settings-form'));
  setupSkipLink(document.getElementById('skip-link'), main);
  registerRoutes();
  startRouter(main, { notFound: renderNotFound, onError: renderLoadError });
}

init();
