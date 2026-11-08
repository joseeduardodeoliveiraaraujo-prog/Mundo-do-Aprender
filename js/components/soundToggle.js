/**
 * soundToggle.js — botão "Sons: ligados / desligados", para mudar a preferência
 * sem sair da atividade. É a mesma opção de Configurações: os dois ficam iguais.
 */

import { el } from './dom.js';
import { createIcon } from './icons.js';
import { getSettings, updateSettings, onSettingsChange } from '../settings.js';

/** @returns {{ element: HTMLElement, destroy: () => void }} */
export function createSoundToggle({ onLabel = 'Sons: ligados', offLabel = 'Sons: desligados' } = {}) {
  const button = el('button', { className: 'button button--secondary sound-toggle', attrs: { type: 'button' } });

  function sync({ soundEnabled }) {
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.replaceChildren(
      createIcon(soundEnabled ? 'speaker' : 'quiet'),
      el('span', { className: 'button__label', text: soundEnabled ? onLabel : offLabel }),
    );
  }

  button.addEventListener('click', () => updateSettings({ soundEnabled: !getSettings().soundEnabled }));
  sync(getSettings());
  return { element: button, destroy: onSettingsChange(sync) };
}
