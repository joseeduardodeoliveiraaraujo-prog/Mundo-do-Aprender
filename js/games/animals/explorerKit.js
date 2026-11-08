/**
 * Peças usadas por todas as mecânicas de Explorando os Animais:
 *
 *   createGuide        faixa com a mensagem da vez (uma só região de anúncio)
 *   createAnimalScene  cenário com os animais como botões
 *   articleOf          dados para as frases com "o/a" + nome do animal
 */

import { el } from '../../components/dom.js';
import { createIcon } from '../../components/icons.js';
import { speak } from '../../speech.js';
import { animalsData } from '../../data/animals.js';

const { animals, articles, regions } = animalsData;

export const articleOf = (id) => ({
  article: articles[id],
  animal: animals[id].name.toLowerCase(),
  pronoun: articles[id] === 'a' ? 'Essa' : 'Esse',
});

/**
 * @param {Object} [options]
 * @param {HTMLElement} [options.status]  região aria-live do tabuleiro; sem ela, cria uma
 */
export function createGuide({ status } = {}) {
  const speech = status ?? el('p', { attrs: { 'aria-live': 'polite' } });
  speech.classList.add('explorer-guide__text');
  const write = (text) => {
    speech.textContent = '';
    window.requestAnimationFrame(() => { speech.textContent = text; });
  };
  return {
    element: el('div', { className: 'explorer-guide' }, [createIcon('search'), speech]),
    /** Mensagem sem voz (inicial, ou depois de Desfazer/Recomeçar). */
    show: write,
    /** Resposta a uma ação da criança (também lê em voz alta, se os sons estiverem ligados). */
    say(text) { write(text); speak(text); },
  };
}

/**
 * Cenário de uma região. Os animais se movem de forma curta e única: ao
 * chegar à cena e quando a criança toca neles (nunca em repetição).
 * @param {string} regionId
 * @param {(animalId: string) => void} onTap
 */
export function createAnimalScene(regionId, onTap) {
  const region = regions[regionId];
  const buttons = new Map(region.animals.map(({ id, x, y }, index) => {
    const button = el('button', {
      className: 'explorer-animal',
      attrs: { type: 'button', 'aria-label': animals[id].name },
      dataset: { animal: id },
    }, [
      el('img', { className: 'explorer-animal__image', attrs: { src: animals[id].image, alt: '', width: 200, height: 200, draggable: 'false' } }),
      el('span', { className: 'explorer-animal__mark', attrs: { 'aria-hidden': 'true' } }, [createIcon('star')]),
    ]);
    Object.assign(button.style, { left: `${x}%`, top: `${y}%`, animationDelay: `${index * 80}ms` });
    button.addEventListener('click', () => onTap(id));
    return [id, button];
  }));

  return {
    element: el('div', { className: 'explorer-scene' }, [
      el('img', { className: 'explorer-scene__image', attrs: { src: region.scene.src, alt: region.scene.alt, width: 480, height: 300, draggable: 'false' } }),
      ...buttons.values(),
    ]),
    ids: region.animals.map(({ id }) => id),
    button: (id) => buttons.get(id),
    /** Um pulinho suave, uma vez. */
    hop(id) {
      const button = buttons.get(id);
      button.classList.remove('is-arriving-done', 'is-hopping');
      void button.offsetWidth; // reinicia a animação
      button.classList.add('is-hopping');
    },
    mark(id) {
      buttons.get(id).classList.add('is-found');
    },
  };
}
