/**
 * modules.js — catálogo dos quatro módulos da plataforma.
 *
 * Fonte única de verdade para id, rota, título, descrição, ícone,
 * ilustração, dados e carregamento de cada módulo.
 *
 * - `icon` e `illustration` são relativos ao index.html (usados em <img src>).
 * - `data` é importado de forma estática (são só dados, leves), para que a
 *   tela inicial calcule o progresso real sem carregar o código dos jogos.
 * - `load` usa import() dinâmico: o código do jogo só é baixado quando a
 *   criança abre o módulo.
 */

import { emotionsData } from './data/emotions.js';
import { routineData } from './data/routine.js';
import { animalsData } from './data/animals.js';
import { communicationData } from './data/communication.js';

/**
 * @typedef {Object} ModuleInfo
 * @property {string} id           identificador interno (também usado em data-module no CSS)
 * @property {string} route        rota no roteador, ex.: '/emocoes'
 * @property {string} title
 * @property {string} description  frase curta e concreta exibida no cartão
 * @property {string} icon         ícone pequeno (assets/icons)
 * @property {string} illustration ilustração do cartão (assets/images/modules)
 * @property {{ activities: ReadonlyArray<{ id: string }> }} data
 * @property {() => Promise<{ render: (view: HTMLElement, module: ModuleInfo) => unknown }>} load
 */

/** @type {ReadonlyArray<Readonly<ModuleInfo>>} */
export const MODULES = Object.freeze(
  [
    {
      id: 'emotions',
      route: '/emocoes',
      title: 'Mundo das Emoções',
      description: 'Conhecer e dar nome aos sentimentos.',
      icon: 'assets/icons/emotions.svg',
      illustration: 'assets/images/modules/emotions.svg',
      data: emotionsData,
      load: () => import('./games/emotions.js'),
    },
    {
      id: 'routine',
      route: '/rotina',
      title: 'Minha Rotina',
      description: 'Organizar as atividades do dia.',
      icon: 'assets/icons/routine.svg',
      illustration: 'assets/images/modules/routine.svg',
      data: routineData,
      load: () => import('./games/routine.js'),
    },
    {
      id: 'animals',
      route: '/animais',
      title: 'Explorando os Animais',
      description: 'Descobrir animais e onde eles vivem.',
      icon: 'assets/icons/animals.svg',
      illustration: 'assets/images/modules/animals.svg',
      data: animalsData,
      load: () => import('./games/animals.js'),
    },
    {
      id: 'communication',
      route: '/comunicacao',
      title: 'Eu Me Comunico',
      description: 'Mostrar o que eu quero e o que eu sinto.',
      icon: 'assets/icons/communication.svg',
      illustration: 'assets/images/modules/communication.svg',
      data: communicationData,
      load: () => import('./games/communication.js'),
    },
  ].map((module) => Object.freeze(module)),
);
