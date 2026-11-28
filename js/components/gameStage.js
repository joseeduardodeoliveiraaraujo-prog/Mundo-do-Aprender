/**
 * gameStage.js — palco de jogo 2D (Phaser) dentro de um elemento da tela.
 *
 * O Phaser só desenha a cena. Textos, botões e instruções continuam em HTML,
 * fora do canvas, para funcionar com leitor de tela, teclado e tamanho de texto.
 *
 * - O Phaser (js/vendor/) só é baixado quando o primeiro palco é criado.
 * - A cena se ajusta à largura disponível, mantendo a proporção.
 * - "Reduzir animações" fica em `scene.registry.get('reduceMotion')` e "Alto
 *   contraste" em `scene.registry.get('highContrast')`; os dois são atualizados
 *   quando a preferência muda (eventos 'changedata-reduceMotion' e
 *   'changedata-highContrast' em `scene.registry.events`).
 * - O Phaser não toca sons (os sons passam por js/audio.js) e não captura o
 *   teclado da página.
 * - O jogo se destrói sozinho quando o palco sai da tela, porque o fluxo
 *   dos módulos troca as atividades sem avisar. Chamar `destroy()` também funciona.
 */

import { el } from './dom.js';
import { getSettings, onSettingsChange } from '../settings.js';

const PHASER_URL = '../vendor/phaser.esm.min.js';
let phaserPromise = null;

/** Carrega o Phaser uma única vez, mesmo com vários palcos. */
function loadPhaser() {
  phaserPromise ??= import(PHASER_URL).then((module) => module.default);
  phaserPromise.catch(() => { phaserPromise = null; }); // permite tentar de novo
  return phaserPromise;
}

/**
 * @param {Object} options
 * @param {number} options.width   largura interna da cena (em pixels do jogo)
 * @param {number} options.height  altura interna da cena
 * @param {string} options.label   descrição da cena para leitor de tela
 * @param {boolean} [options.pixelArt=false]  true: pixel art ampliado sem borrar
 * @param {boolean} [options.interactive=false]  true: o palco recebe foco do
 *   teclado (role="application") e a tela trata as teclas em `surface`
 * @param {{ loading: string, error: string }} options.texts
 * @param {(Phaser: any) => Object} options.createScene  devolve a configuração
 *   de uma cena Phaser ({ key, preload, create, update... })
 * @returns {{ element: HTMLElement, surface: HTMLElement, ready: Promise<any>, destroy: () => void }}
 */
export function createGameStage({
  width, height, label, texts, createScene, interactive = false, pixelArt = false,
}) {
  const status = el('p', { className: 'game-stage__status', text: texts.loading });
  const canvasHost = el('div', {
    className: 'game-stage__canvas',
    attrs: interactive ? { role: 'application', 'aria-label': label, tabindex: 0 } : { role: 'img', 'aria-label': label },
  });
  const element = el('div', { className: `game-stage is-loading${pixelArt ? ' game-stage--pixel' : ''}` }, [canvasHost, status]);
  element.style.aspectRatio = `${width} / ${height}`;

  let game = null;
  let isDestroyed = false;
  let stopListening = () => {};

  function destroy() {
    if (isDestroyed) return;
    isDestroyed = true;
    stopListening();
    game?.destroy(true);
    game = null;
  }

  function showScene() {
    element.classList.remove('is-loading');
    status.remove();
  }

  const ready = loadPhaser().then((Phaser) => {
    if (isDestroyed) return null;
    const sceneConfig = createScene(Phaser);
    const create = sceneConfig.create;
    // A cena só aparece depois que as imagens carregaram e ela foi montada.
    sceneConfig.create = function createAndShow(...args) {
      create?.apply(this, args);
      showScene();
    };
    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: canvasHost,
      width,
      height,
      transparent: true,
      pixelArt,
      banner: false,
      audio: { noAudio: true },
      input: { keyboard: false, touch: { capture: false } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      callbacks: {
        preBoot: (bootingGame) => {
          const { reduceMotion, highContrast } = getSettings();
          bootingGame.registry.set('reduceMotion', reduceMotion);
          bootingGame.registry.set('highContrast', highContrast);
        },
      },
      scene: sceneConfig,
    });

    const stopSettings = onSettingsChange(({ reduceMotion, highContrast }) => {
      game?.registry.set('reduceMotion', reduceMotion);
      game?.registry.set('highContrast', highContrast);
    });
    // O Phaser mede o espaço só ao iniciar: quando o palco muda de tamanho
    // (layout, giro do tablet, tamanho do texto, cena de perto abrindo e fechando),
    // ele precisa medir de novo. `refresh()` sozinho usa a medida antiga do palco:
    // primeiro `getParentBounds()` lê o tamanho novo (como o Phaser faz ao iniciar).
    const resizeObserver = new ResizeObserver(() => {
      if (!game) return;
      game.scale.getParentBounds();
      game.scale.refresh();
    });
    resizeObserver.observe(canvasHost);
    stopListening = () => {
      stopSettings();
      resizeObserver.disconnect();
    };
    game.events.on('poststep', () => {
      if (!element.isConnected) destroy();
    });
    return game;
  }).catch((error) => {
    console.error('Não foi possível carregar a cena do jogo.', error);
    element.classList.replace('is-loading', 'has-error');
    status.textContent = texts.error;
    return null;
  });

  return { element, surface: canvasHost, ready, destroy };
}
