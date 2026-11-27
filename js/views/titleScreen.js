/**
 * Tela inicial do jogo "Bairro do Noa" (rota `/`): imagem do jogo e o menu
 * clássico — Continuar, Novo jogo, Opções e Como jogar.
 *
 * - "Continuar" só aparece quando há um jogo salvo e mostra onde o Noa está
 *   e quantas estrelas já foram ganhas.
 * - "Novo jogo" com jogo salvo pede confirmação no próprio lugar (sem janela
 *   inesperada): explica o que vai ser apagado e oferece voltar.
 * - "Opções" e "Como jogar" abrem os diálogos de Configurações e Ajuda.
 */

import { el } from '../components/dom.js';
import { createButton } from '../components/button.js';
import { fillTemplate } from '../components/text.js';
import { connectDialogs } from '../components/dialog.js';
import { navigateTo } from '../navigation.js';
import { resetProgress } from '../progress.js';
import { worldData } from '../data/world/world.js';
import { totalStars } from '../games/world/stars.js';
import { hasWorldState, loadWorldState, resetWorldState } from '../games/world/worldState.js';

const texts = worldData.texts.title;
const GAME_ROUTE = '/jogo';

/** Botão que abre um dos diálogos do index.html (Configurações, Ajuda). */
function dialogButton(label, icon, dialogId) {
  const button = createButton({ label, icon, variant: 'secondary', className: 'title-screen__button' });
  button.dataset.dialogOpen = dialogId;
  button.setAttribute('aria-haspopup', 'dialog');
  return button;
}

export function render(view) {
  const stars = totalStars();
  const hasSave = hasWorldState() || stars.completed > 0;
  const play = () => navigateTo(GAME_ROUTE);

  const menu = el('div', { className: 'title-screen__menu', attrs: { role: 'group', 'aria-label': texts.heading } });
  const confirm = el('section', {
    className: 'title-screen__confirm', attrs: { hidden: true, 'aria-labelledby': 'title-confirm-heading', tabindex: -1 },
  });

  function showMenu(focusLabel) {
    confirm.hidden = true;
    menu.hidden = false;
    const target = [...menu.querySelectorAll('button')].find((b) => b.textContent.trim() === focusLabel);
    (target ?? menu.querySelector('button'))?.focus();
  }

  function askNewGame() {
    menu.hidden = true;
    confirm.hidden = false;
    confirm.focus();
  }

  function startNewGame() {
    resetProgress();
    resetWorldState();
    play();
  }

  confirm.append(
    el('h2', { className: 'title-screen__confirm-title', attrs: { id: 'title-confirm-heading' }, text: texts.confirmTitle }),
    el('p', { text: texts.confirmText }),
    el('div', { className: 'title-screen__confirm-actions' }, [
      createButton({ label: texts.confirmNo, variant: 'secondary', icon: 'arrowLeft', onClick: () => showMenu(texts.newGame) }),
      createButton({ label: texts.confirmYes, variant: 'primary', icon: 'restart', onClick: startNewGame }),
    ]),
  );

  const place = worldData.maps[loadWorldState(worldData).map]?.name ?? '';
  menu.append(...[
    hasSave && el('div', { className: 'title-screen__continue' }, [
      createButton({ label: texts.continue, icon: 'arrowRight', iconPosition: 'end', className: 'title-screen__button', onClick: play }),
      el('p', { className: 'title-screen__info', text: fillTemplate(texts.continueInfo, { place, ...stars }) }),
    ]),
    createButton({
      label: texts.newGame, icon: 'plus', variant: hasSave ? 'secondary' : 'primary', className: 'title-screen__button',
      onClick: () => (hasSave ? askNewGame() : startNewGame()),
    }),
    dialogButton(texts.options, 'settings', 'settings-dialog'),
    dialogButton(texts.help, 'help', 'help-dialog'),
  ].filter(Boolean));
  connectDialogs(menu);

  view.append(el('section', { className: 'title-screen' }, [
    el('img', {
      className: 'title-screen__image',
      attrs: { src: 'assets/images/world/title.png', alt: texts.imageAlt, width: 192, height: 96 },
    }),
    el('div', { className: 'title-screen__panel' }, [
      // Título em pixel art (tools/art/draw_title.py); o texto vai no alt, para o leitor de tela.
      el('h1', { className: 'title-screen__heading', dataset: { pageTitle: texts.heading } }, [
        el('img', {
          className: 'title-screen__logo',
          attrs: { src: 'assets/images/world/title-logo.png', alt: texts.heading, width: 140, height: 18 },
        }),
      ]),
      el('p', { className: 'title-screen__subtitle', text: texts.subtitle }),
      menu,
      confirm,
    ]),
  ]));
}
