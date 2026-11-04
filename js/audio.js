/**
 * audio.js — reprodução de sons curtos (ex.: sons de animais).
 *
 * Regras (AGENTS.md):
 * - Só toca com a preferência "Sons ligados" ativa e após ação da criança.
 * - Volume moderado e um som por vez (o novo interrompe o anterior).
 * - Se não houver arquivo de som, usa a voz do aparelho para IMITAR o som
 *   (texto de apoio, ex.: "Muuu"). Se nada for possível, avisa sem erro.
 */

import { getSettings, onSettingsChange } from './settings.js';
import { speak, stopSpeaking } from './speech.js';

const VOLUME = 0.6;
let currentAudio = null;

/** Interrompe qualquer som ou imitação em andamento. */
export function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  stopSpeaking();
}

/**
 * @param {Object} sound
 * @param {string|null} [sound.file]   arquivo local (relativo ao index.html) ou null
 * @param {string} [sound.text]         imitação falada quando não há arquivo
 * @returns {Promise<'file' | 'voice' | 'muted' | 'unavailable'>}
 */
export async function playSound({ file = null, text } = {}) {
  stopSound();
  if (!getSettings().soundEnabled) return 'muted';

  if (file) {
    try {
      const audio = new Audio(file);
      audio.volume = VOLUME;
      currentAudio = audio;
      await audio.play();
      return 'file';
    } catch {
      currentAudio = null; // arquivo ausente ou bloqueado: tenta a imitação
    }
  }

  if (text && speak(text)) return 'voice';
  return 'unavailable';
}

onSettingsChange((settings) => {
  if (!settings.soundEnabled) stopSound();
});
