/**
 * Jogo "Bairro do Noa": a tela principal do Mundo do Aprender.
 *
 * Noa anda livremente pela casa e pelo bairro. Lugares com balão abrem os
 * desafios (as atividades dos módulos) no painel de desafio. O mapa é
 * desenhado pelo Phaser (./world/worldScene.js); falas, botões e desafios
 * ficam em HTML.
 *
 * Formas de jogar, todas completas: tocar no mapa; setas/WASD + Enter com o
 * palco focado; botões "Ir até um lugar" e "Começar".
 */

import { el } from '../components/dom.js';
import { createButton } from '../components/button.js';
import { createGameStage } from '../components/gameStage.js';
import { createCompanion } from '../components/companion.js';
import { createSoundToggle } from '../components/soundToggle.js';
import { fillTemplate } from '../components/text.js';
import { MODULES } from '../modules.js';
import { getModuleProgress } from '../progress.js';
import { worldData } from '../data/world/world.js';
import { TILE_SIZE } from '../data/world/atlas.js';
import { routineData } from '../data/routine.js';
import { animalsData } from '../data/animals.js';
import { createWorldScene } from './world/worldScene.js';
import { openChallenge, challengeProgress } from './world/challengePanel.js';
import { bindWorldKeys } from './world/keyboard.js';
import { loadWorldState, saveWorldState } from './world/worldState.js';

const { texts } = worldData;

function totalStars() {
  return MODULES.reduce((sum, module) => {
    const { completed, total } = getModuleProgress(module.id, module.data.activities);
    return { completed: sum.completed + completed, total: sum.total + total };
  }, { completed: 0, total: 0 });
}

/** O que Noa diz ao chegar num lugar. Animais usam os dados do módulo de animais. */
function promptOf(spot, firstUse) {
  if (spot.animal) {
    const animal = animalsData.animals[spot.animal];
    // Som entre parênteses é uma explicação (ex.: o peixe), não um som para imitar.
    const sound = animal.sound.text.replace(/^\((.*)\)$/, '$1');
    const template = sound === animal.sound.text ? texts.animalSays : texts.animalQuiet;
    return fillTemplate(template, { name: animal.name, sound, fact: animal.fact });
  }
  return !firstUse && spot.donePrompt ? spot.donePrompt : spot.prompt;
}

export function render(view) {
  const place = el('h1', { className: 'world__place' });
  const stars = el('p', { className: 'world__stars' });
  const soundToggle = createSoundToggle();
  const companion = createCompanion({ character: routineData.companion, mood: 'happy' });
  const nearText = el('p', { className: 'world__near', text: texts.nearNothing });
  const startButton = createButton({ label: texts.start, variant: 'module', icon: 'arrowRight', iconPosition: 'end', onClick: () => startChallenge() });
  const placesList = el('div', { className: 'world__places-list' });
  const challengeArea = el('div', { className: 'world__challenge' });
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
      startButton.hidden = !spot?.challenge;
    },
    onArrive: (spot) => {
      if (spot.challenge && selected === spot) { startChallenge(); return; }
      selected = spot;
      const firstUse = !world.isUsed(spot.id);
      world.markUsed(spot.id);
      companion.say(promptOf(spot, firstUse), 'happy');
    },
  });

  const stage = createGameStage({
    width: worldData.view.cols * TILE_SIZE,
    height: worldData.view.rows * TILE_SIZE,
    label: texts.stageLabel,
    texts,
    interactive: true,
    pixelArt: true,
    createScene: world.createScene,
  });
  const explore = el('div', { className: 'world__explore' }, [
    companion.element,
    el('div', { className: 'world__play' }, [stage.element, el('p', { className: 'world__how-to', text: texts.howTo })]),
    el('div', { className: 'world__actions' }, [nearText, startButton]),
    el('details', { className: 'world__places' }, [el('summary', { text: texts.places }), placesList]),
  ]);

  async function startChallenge() {
    const spot = near?.challenge ? near : selected;
    if (!spot?.challenge) return;
    saveWorldState(world.getState());
    world.pause();
    explore.hidden = true;
    await openChallenge({
      container: challengeArea,
      challenge: spot.challenge,
      texts: texts.challenge,
      onClose: () => {
        explore.hidden = false;
        selected = null;
        world.resume();
        world.refreshMarkers();
        refreshStars();
        stage.surface.focus({ preventScroll: true });
      },
    });
  }

  const unbindKeys = bindWorldKeys(stage.surface, {
    onDirection: (x, y) => world.setDirection(x, y),
    onUse: () => {
      if (near?.challenge && selected === near) startChallenge();
      else if (!world.useNearest()) companion.say(texts.notNear, 'thinking');
    },
  });
  const save = () => saveWorldState(world.getState());
  window.addEventListener('pagehide', save);

  view.append(el('section', { className: 'world', dataset: { module: 'routine' } }, [
    el('div', { className: 'world__top' }, [place, stars, soundToggle.element]),
    explore,
    challengeArea,
  ]));
  startButton.hidden = true;
  place.textContent = worldData.maps[loadWorldState(worldData).map].name;
  refreshStars();
  companion.show(texts.greeting, 'happy');

  return () => {
    save();
    window.removeEventListener('pagehide', save);
    unbindKeys();
    soundToggle.destroy();
    stage.destroy();
  };
}
