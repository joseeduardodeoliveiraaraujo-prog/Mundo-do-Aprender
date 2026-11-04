/**
 * settings.js — preferências de acessibilidade do usuário.
 *
 * Mantém o estado das preferências, salva no localStorage (via storage.js)
 * e aplica cada uma como atributo data-* no elemento <html>, que o
 * css/accessibility.css usa para ajustar a interface.
 */

import { readValue, writeValue, STORAGE_KEYS } from './storage.js';

const FONT_SIZES = Object.freeze(['normal', 'large', 'xlarge']);

function systemPrefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * @typedef {Object} Settings
 * @property {'normal'|'large'|'xlarge'} fontSize
 * @property {boolean} highContrast
 * @property {boolean} reduceMotion
 * @property {boolean} soundEnabled  Sons desligados por padrão (sensibilidade auditiva).
 */

/** @type {Readonly<Settings>} */
export const DEFAULT_SETTINGS = Object.freeze({
  fontSize: 'normal',
  highContrast: false,
  reduceMotion: systemPrefersReducedMotion(),
  soundEnabled: false,
});

const listeners = new Set();
let currentSettings = sanitize(readValue(STORAGE_KEYS.SETTINGS, {}));

/** Garante que somente valores válidos sejam usados, mesmo com dados antigos ou corrompidos. */
function sanitize(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const pickBoolean = (key) =>
    typeof source[key] === 'boolean' ? source[key] : DEFAULT_SETTINGS[key];

  return {
    fontSize: FONT_SIZES.includes(source.fontSize) ? source.fontSize : DEFAULT_SETTINGS.fontSize,
    highContrast: pickBoolean('highContrast'),
    reduceMotion: pickBoolean('reduceMotion'),
    soundEnabled: pickBoolean('soundEnabled'),
  };
}

/** @returns {Settings} cópia das preferências atuais */
export function getSettings() {
  return { ...currentSettings };
}

/** Aplica as preferências como atributos no <html>. */
export function applySettings(settings = currentSettings) {
  const root = document.documentElement;
  root.dataset.fontSize = settings.fontSize;
  root.dataset.contrast = settings.highContrast ? 'high' : 'normal';
  root.dataset.motion = settings.reduceMotion ? 'reduced' : 'normal';
}

/**
 * Atualiza uma ou mais preferências, salva e aplica.
 * @param {Partial<Settings>} changes
 */
export function updateSettings(changes) {
  currentSettings = sanitize({ ...currentSettings, ...changes });
  writeValue(STORAGE_KEYS.SETTINGS, currentSettings);
  applySettings();
  listeners.forEach((listener) => listener(getSettings()));
}

/** Volta todas as preferências ao padrão. */
export function resetSettings() {
  updateSettings(DEFAULT_SETTINGS);
}

/**
 * Registra uma função chamada sempre que as preferências mudarem.
 * @param {(settings: Settings) => void} listener
 * @returns {() => void} função para cancelar o registro
 */
export function onSettingsChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
