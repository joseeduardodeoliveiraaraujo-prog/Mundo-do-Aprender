/**
 * speech.js — leitura em voz alta (Web Speech API, voz do próprio navegador).
 *
 * Regras (AGENTS.md):
 * - Só fala quando a preferência "Sons ligados" está ativa.
 * - Só fala em resposta a uma ação da criança (nunca automaticamente).
 * - Se o navegador não tiver voz disponível, nada acontece (sem erro).
 */

import { getSettings, onSettingsChange } from './settings.js';

const LANGUAGE = 'pt-BR';
const SPEECH_RATE = 0.9; // um pouco mais devagar que o normal

export function isSpeechAvailable() {
  return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
}

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang === LANGUAGE)
    ?? voices.find((voice) => voice.lang?.toLowerCase().startsWith('pt'))
    ?? null;
}

/**
 * Lê um texto em voz alta, se permitido.
 * @param {string} text
 * @returns {boolean} true se a leitura começou
 */
export function speak(text) {
  if (!getSettings().soundEnabled || !isSpeechAvailable()) return false;

  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE;
  utterance.rate = SPEECH_RATE;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
  return true;
}

/** Interrompe qualquer leitura em andamento. */
export function stopSpeaking() {
  if (isSpeechAvailable()) window.speechSynthesis.cancel();
}

// Desligar os sons interrompe a leitura imediatamente.
onSettingsChange((settings) => {
  if (!settings.soundEnabled) stopSpeaking();
});
