/**
 * Jogo "Bairro do Noa": a tela principal do Mundo do Aprender.
 *
 * Noa anda livremente pela casa, pelo bairro e pela escola. Lugares com balão
 * têm desafios que acontecem no próprio mapa (./world/quest/): conversas de
 * RPG, procurar coisas, pegar e levar itens, ou uma cena de perto
 * (./world/closeup/) em que a criança faz cada passo com as mãos. O que não vira missão abre na
 * mesa sobre o mapa. O mapa é desenhado pelo Phaser; falas e botões em HTML.
 *
 * Formas de jogar, todas completas: tocar no mapa; setas/WASD e Enter;
 * botões "Ir até um lugar" e "Começar".
 */

import { el } from '../components/dom.js';
import { createButton, createLinkButton } from '../components/button.js';
import { createGameStage } from '../components/gameStage.js';
import { createCompanion } from '../components/companion.js';
import { createSoundToggle } from '../components/soundToggle.js';
import { fillTemplate } from '../components/text.js';
import { worldData } from '../data/world/world.js';
import { closeups } from '../data/world/closeups/index.js';
import { TILE_SIZE } from '../data/world/atlas.js';
import { createWorldScene } from './world/worldScene.js';
import { totalStars } from './world/stars.js';
import { openChallenge, challengeProgress, nextActivity } from './world/challengePanel.js';
import { bindWorldKeys } from './world/keyboard.js';
import { loadWorldState, saveWorldState } from './world/worldState.js';
import { createDialogBox } from './world/quest/dialogBox.js';
import { createQuestHud } from './world/quest/questHud.js';
import { createQuestRunner } from './world/quest/questRunner.js';
import { buildQuest } from './world/quest/adapters/index.js';
import { animalLine } from './world/quest/adapters/animals.js';
import { createCloseup, createCloseupHost } from './world/closeup/closeup.js';

const { texts } = worldData;

/** O que Noa diz ao chegar num lugar fora de uma missão. */
function promptOf(spot, firstUse) {
  if (spot.animal && !spot.challenge) return animalLine(spot.animal, texts);
  return !firstUse && spot.donePrompt ? spot.donePrompt : spot.prompt;
}

export function render(view) {
  const place = el('h1', { className: 'world__place' });
  const stars = el('p', { className: 'world__stars' });
  const soundToggle = createSoundToggle();
  const companion = createCompanion({ character: worldData.companion, mood: 'happy' });
  const nearText = el('p', { className: 'world__near', text: texts.nearNothing });
  const startButton = createButton({ label: texts.start, variant: 'module', icon: 'arrowRight', iconPosition: 'end', onClick: () => startChallenge() });
  const placesList = el('div', { className: 'world__places-list' });
  const board = el('div', { className: 'world__board', attrs: { hidden: true } });
  let near = null;
  let selected = null;

  const refreshStars = () => { stars.textContent = fillTemplate(texts.stars, totalStars()); };
  const statusOf = (spot) => {
    if (!spot?.challenge) return null;
    const { completed, total } = challengeProgress(spot.challenge);
    return completed === total ? 'done' : 'todo';
  };

  const world = createWorldScene({
    data: worldData,
    state: loadWorldState(worldData),
    statusOf,
    onMapChange: (map) => {
      if (place.textContent && place.textContent !== map.name) companion.show(map.welcome, 'happy');
      place.textContent = map.name;
      stage.surface.setAttribute('aria-label', fillTemplate(texts.stageLabel, { place: map.name }));
      placesList.replaceChildren(
        ...map.spots.map((spot) => createButton({
          label: fillTemplate(texts.goTo, spot), variant: 'secondary', className: 'world__place-button', onClick: () => world.goToSpot(spot.id),
        })),
        ...map.doors.map((door, index) => createButton({
          label: door.label, variant: 'secondary', className: 'world__place-button', icon: 'arrowRight', iconPosition: 'end', onClick: () => world.goToDoor(index),
        })),
      );
      saveWorldState(world.getState());
    },
    onNearChange: (spot) => {
      near = spot;
      if (spot !== selected) selected = null;
      nearText.textContent = spot ? fillTemplate(texts.nearSpot, spot) : texts.nearNothing;
      startButton.hidden = !spot?.challenge || runner.isActive;
    },
    onArrive: (spot) => {
      if (runner.handleArrive(spot)) return;
      if (spot.challenge && selected === spot) { startChallenge(); return; }
      selected = spot;
      const firstUse = !world.isUsed(spot.id);
      world.markUsed(spot.id);
      companion.say(promptOf(spot, firstUse), 'happy');
    },
  });

  // Câmera mais longe em telas largas (worldData.views).
  const camera = worldData.views.filter(({ minWidth }) => window.innerWidth >= minWidth).at(-1);
  const stage = createGameStage({
    width: camera.cols * TILE_SIZE,
    height: camera.rows * TILE_SIZE,
    label: texts.stageLabel,
    texts,
    interactive: true,
    pixelArt: true,
    createScene: world.createScene,
  });

  const afterChallenge = (message) => {
    selected = null;
    world.refreshMarkers();
    refreshStars();
    startButton.hidden = !near?.challenge;
    companion.show(message, 'happy');
    stage.surface.focus({ preventScroll: true });
  };
  const dialog = createDialogBox({ texts: texts.quest, onStop: () => runner.stop() });
  const hud = createQuestHud({ texts: texts.quest, onStop: () => runner.stop() });
  const closeupHost = createCloseupHost();
  const closeup = createCloseup({
    host: closeupHost, hud, texts, onOpen: () => world.pause(), onClose: () => world.resume(),
  });
  const runner = createQuestRunner({
    world, dialog, hud, closeup, texts: texts.quest,
    onEnd: (completed) => afterChallenge(completed ? texts.quest.finished : texts.quest.stopped),
  });

  /** Começa o desafio do lugar: missão no mapa ou, se não houver tradução, a mesa sobre o mapa. */
  async function startChallenge() {
    const spot = near?.challenge ? near : selected;
    if (!spot?.challenge || runner.isActive || !board.hidden) return;
    saveWorldState(world.getState());
    startButton.hidden = true;
    const pick = nextActivity(spot.challenge);
    const quest = buildQuest(pick.module.id, pick.activity, {
      spot, world, texts: { ...texts.quest, animalSays: texts.animalSays, animalQuiet: texts.animalQuiet },
      bindings: worldData.questBindings[pick.activity.id] ?? {},
      closeup: closeups[pick.activity.id],
    });
    if (quest) { runner.start(quest); return; }
    world.pause();
    board.hidden = false;
    await openChallenge({
      container: board, challenge: spot.challenge, pick, texts: texts.challenge,
      onClose: () => {
        board.hidden = true;
        world.resume();
        afterChallenge(texts.quest.finished);
      },
    });
  }

  const explore = el('div', { className: 'world__explore' }, [
    companion.element,
    el('div', { className: 'world__play' }, [
      el('div', { className: 'world__screen' }, [stage.element, closeupHost, hud.element, dialog.element, board]),
      el('p', { className: 'world__how-to', text: texts.howTo }),
    ]),
    el('div', { className: 'world__actions' }, [nearText, startButton]),
    el('details', { className: 'world__places' }, [el('summary', { text: texts.places }), placesList]),
  ]);

  const unbindKeys = bindWorldKeys(stage.surface, {
    onDirection: (x, y) => world.setDirection(x, y),
    onUse: () => {
      if (!runner.isActive && near?.challenge && selected === near) startChallenge();
      else if (!world.useNearest()) companion.say(texts.notNear, 'thinking');
    },
    isActive: () => !dialog.isOpen && board.hidden && !closeup.isOpen,
  });
  const save = () => saveWorldState(world.getState());
  window.addEventListener('pagehide', save);

  view.append(el('section', { className: 'world', dataset: { module: 'routine' } }, [
    el('div', { className: 'world__top' }, [
      place, stars, soundToggle.element,
      createLinkButton({ href: '#/', label: texts.menu, variant: 'ghost', icon: 'arrowLeft', className: 'world__menu' }),
    ]),
    explore,
  ]));
  startButton.hidden = true;
  place.textContent = worldData.maps[loadWorldState(worldData).map].name;
  refreshStars();
  companion.show(texts.greeting, 'happy');

  return () => {
    runner.stop();
    save();
    window.removeEventListener('pagehide', save);
    unbindKeys();
    soundToggle.destroy();
    stage.destroy();
  };
}
