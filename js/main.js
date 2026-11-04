/**
 * main.js — ponto de entrada da aplicação.
 * Apenas conecta as peças: preferências, diálogos, ícones e rotas.
 */

import { applySettings } from './settings.js';
import { registerRoute, startRouter } from './navigation.js';
import { MODULES } from './modules.js';
import { hydrateIcons } from './components/icons.js';
import { connectDialogs } from './components/dialog.js';
import { initSettingsPanel } from './components/settingsPanel.js';
import { renderHome } from './views/home.js';
import { renderNotFound, renderLoadError } from './views/messages.js';

function setupSkipLink(link, target) {
  // Evita que o link altere o hash (o que seria interpretado pelo roteador).
  link.addEventListener('click', (event) => {
    event.preventDefault();
    target.focus();
  });
}

function registerRoutes() {
  registerRoute('/', (view) => renderHome(view, MODULES));

  MODULES.forEach((module) => {
    registerRoute(module.route, async (view) => {
      const game = await module.load();
      return game.render(view, module);
    });
  });
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
