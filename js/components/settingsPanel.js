/**
 * settingsPanel.js — liga o formulário de configurações (definido no
 * index.html) ao estado de preferências de js/settings.js.
 * As mudanças são aplicadas imediatamente, sem botão "Salvar".
 * A abertura/fechamento do diálogo fica em components/dialog.js.
 */

import { getSettings, updateSettings, resetSettings, onSettingsChange } from '../settings.js';

/** @param {HTMLFormElement} form */
export function initSettingsPanel(form) {
  const { fontSize, highContrast, reduceMotion, soundEnabled } = form.elements;

  const syncForm = (settings) => {
    fontSize.value = settings.fontSize;
    highContrast.checked = settings.highContrast;
    reduceMotion.checked = settings.reduceMotion;
    soundEnabled.checked = settings.soundEnabled;
  };

  syncForm(getSettings());
  onSettingsChange(syncForm);

  form.addEventListener('change', (event) => {
    const { name, type, checked, value } = event.target;
    if (!name) return;
    updateSettings({ [name]: type === 'checkbox' ? checked : value });
  });

  form.querySelector('[data-action="reset"]').addEventListener('click', resetSettings);
}
