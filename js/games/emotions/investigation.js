/**
 * "Detetive das emoções" — investigar a cena com a lupa.
 *
 *   1. A criança toca em "Usar a lupa": a cena entra no modo de investigação
 *      e as pessoas/objetos investigáveis ganham borda tracejada.
 *   2. Ela toca nesses elementos (na própria cena). Cada um vira uma pista:
 *      aparece logo abaixo, aumentada pela lupa, com uma frase curta
 *      (anunciada para leitores de tela e lida em voz alta se os sons estiverem ligados).
 *   3. Elementos encontrados ficam com borda contínua e ✓; o caderno guarda as
 *      pistas e permite vê-las de novo.
 *   4. "Preciso de uma dica" mostra onde está a próxima pista ("Olhe aqui").
 *   5. Com todas as pistas, aparece o desafio do detetive (detectiveChallenge.js).
 *
 * Nada acontece sozinho: tudo muda só depois de um toque da criança.
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { createButton } from '../../components/button.js';
import { createActivityFrame, showResult } from '../../components/activityFrame.js';
import { fillTemplate } from '../../components/moduleFlow.js';
import { speak } from '../../speech.js';
import { emotionsData } from '../../data/emotions.js';
import { createClueZoom } from './clueZoom.js';
import { createDetectiveChallenge } from './detectiveChallenge.js';

const { messages } = emotionsData;
const texts = messages.investigate;

const SCENE_WIDTH = 240;
const SCENE_HEIGHT = 160;
const RATIO = SCENE_HEIGHT / SCENE_WIDTH;

const placeIn = (node, { x, y, w, h }) => {
  Object.assign(node.style, { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` });
};

export function renderInvestigate(activity, navigation, complete) {
  const frame = createActivityFrame({ ...navigation, title: activity.title, instruction: activity.instruction });
  const { clues } = activity;
  const total = clues.length;
  const found = new Set();
  let toolOn = false;
  let hinted = null;

  // ---------- Mensagens curtas (visíveis e anunciadas) ----------
  const status = el('p', { className: 'investigation__status', attrs: { 'aria-live': 'polite' }, text: texts.toolStart });
  // Leitor de tela e voz recebem a pista inteira; na tela, a frase curta
  // (o texto completo já está no painel logo abaixo da cena).
  const announcer = el('p', { className: 'visually-hidden', attrs: { 'aria-live': 'polite' } });
  const say = (text, { read = false } = {}) => {
    status.textContent = text;
    if (read) speak(text);
  };
  const tellClue = (clue) => {
    status.textContent = fillTemplate(texts.discoveredShort, clue);
    const full = fillTemplate(texts.discovered, clue);
    announcer.textContent = '';
    window.requestAnimationFrame(() => { announcer.textContent = full; });
    speak(full);
  };
  const counter = el('p', { className: 'investigation__count' });
  const updateCounter = () => { counter.textContent = fillTemplate(texts.count, { found: found.size, total }); };

  // ---------- Painel da pista (logo abaixo da cena) ----------
  const panel = el('div', { className: 'investigation__panel' }, [
    el('p', { className: 'investigation__panel-empty', text: texts.panelEmpty }),
  ]);
  const showInPanel = (index) => {
    const clue = clues[index];
    panel.classList.add('has-clue');
    panel.replaceChildren(
      createClueZoom({ src: activity.image.src, area: clue.focus ?? clue.area, ratio: RATIO, className: 'clue-zoom--panel' }),
      el('div', { className: 'investigation__panel-text' }, [
        el('p', { className: 'investigation__panel-number', text: fillTemplate(texts.panelNumber, { number: index + 1, total }) }),
        el('h3', { className: 'investigation__panel-title', text: clue.label }),
        el('p', { text: clue.text }),
      ]),
    );
  };

  // ---------- Caderno de pistas ----------
  const notes = clues.map((_, index) => el('li', { className: 'investigation__note' }, [
    el('span', { className: 'investigation__note-mark', attrs: { 'aria-hidden': 'true' }, text: '?' }),
    el('span', { className: 'investigation__note-text', text: fillTemplate(texts.notebookHidden, { number: index + 1 }) }),
  ]));
  const fillNote = (index) => {
    const clue = clues[index];
    const reopen = el('button', {
      className: 'investigation__note-button',
      attrs: { type: 'button', 'aria-label': fillTemplate(texts.reopen, { label: clue.label }) },
    }, [
      createClueZoom({ src: activity.image.src, area: clue.focus ?? clue.area, ratio: RATIO, className: 'clue-zoom--note' }),
      el('span', { className: 'investigation__note-text', text: clue.label }),
    ]);
    reopen.addEventListener('click', () => {
      showInPanel(index);
      tellClue(clue);
    });
    notes[index].classList.add('is-found');
    notes[index].replaceChildren(reopen);
  };

  // ---------- Desafio final ----------
  const challenge = createDetectiveChallenge({ activity, frame, complete, ratio: RATIO });

  // ---------- Cena e elementos investigáveis ----------
  const scene = el('div', { className: 'investigation__scene', attrs: { role: 'group', 'aria-label': texts.sceneLabel } });
  const sceneImage = el('img', {
    className: 'investigation__image',
    attrs: { src: activity.image.src, alt: activity.image.alt, width: SCENE_WIDTH, height: SCENE_HEIGHT, draggable: 'false' },
  });
  // Tocar na cena com a lupa guardada: lembra como começar (dica, não erro).
  sceneImage.addEventListener('click', () => { if (!toolOn) say(texts.toolStart); });

  const spots = clues.map((clue, index) => {
    const spot = el('button', {
      className: 'investigation__spot',
      attrs: { type: 'button', hidden: true, 'aria-label': fillTemplate(texts.investigate, clue) },
    }, [
      el('span', { className: 'investigation__spot-badge', attrs: { 'aria-hidden': 'true' } }, [createIcon('search')]),
      el('span', { className: 'investigation__spot-tag', attrs: { 'aria-hidden': 'true' }, text: texts.hintTag }),
    ]);
    placeIn(spot, clue.area);
    spot.addEventListener('click', () => discover(index));
    return spot;
  });
  scene.append(sceneImage, ...spots);

  function discover(index) {
    const clue = clues[index];
    const isNew = !found.has(index);
    found.add(index);
    if (hinted === index) hinted = null;
    const spot = spots[index];
    spot.classList.remove('is-hinted');
    spot.classList.add('is-found');
    spot.setAttribute('aria-label', fillTemplate(texts.found, clue));
    spot.firstElementChild.replaceChildren(el('span', { text: String(index + 1) }), createIcon('check'));
    showInPanel(index);
    tellClue(clue);
    if (!isNew) return;
    fillNote(index);
    updateCounter();
    if (found.size === total) {
      challenge.hidden = false;
      showResult(frame, { completes: false, tone: 'info', title: texts.allFound }, complete);
    }
  }

  // ---------- Ferramentas: lupa e dica ----------
  const toolButton = createButton({
    label: texts.toolOn,
    variant: 'module',
    icon: 'search',
    className: 'investigation__tool',
    attrs: { 'aria-pressed': 'false' },
    onClick: () => setTool(!toolOn),
  });

  function setTool(on) {
    toolOn = on;
    toolButton.setAttribute('aria-pressed', String(on));
    toolButton.querySelector('.button__label').textContent = on ? texts.toolOff : texts.toolOn;
    scene.classList.toggle('is-investigating', on);
    spots.forEach((spot) => { spot.hidden = !on; });
    say(on ? texts.modeOn : texts.modeOff);
  }

  const hintButton = createButton({
    label: texts.hintButton,
    variant: 'secondary',
    icon: 'help',
    className: 'investigation__hint',
    onClick: () => {
      const next = clues.findIndex((_, index) => !found.has(index));
      if (next < 0) { say(texts.allHintsUsed); return; }
      if (!toolOn) setTool(true); // a dica já liga a lupa: um passo a menos para quem tem dificuldade
      hinted = next;
      spots.forEach((spot, index) => spot.classList.toggle('is-hinted', index === next));
      say(clues[next].hint, { read: true });
    },
  });

  frame.choicesSlot.append(
    el('div', { className: 'investigation' }, [
      el('div', { className: 'investigation__toolbar' }, [toolButton, hintButton, counter]),
      status,
      announcer,
      el('div', { className: 'investigation__board' }, [
        scene,
        el('div', { className: 'investigation__side' }, [
          panel,
          el('div', { className: 'investigation__notebook' }, [
            el('h3', { className: 'investigation__notebook-title', text: texts.notebookTitle }),
            el('ol', { className: 'investigation__notes', attrs: { role: 'list' } }, notes),
          ]),
        ]),
      ]),
    ]),
    challenge,
  );
  updateCounter();
  return frame;
}
