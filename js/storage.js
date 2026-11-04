/**
 * storage.js — acesso centralizado ao localStorage.
 *
 * Regras:
 * - Todo acesso ao localStorage do projeto passa por aqui.
 * - As chaves recebem o prefixo do app para não colidir com outros sites/apps.
 * - Valores são salvos como JSON.
 * - Se o localStorage estiver indisponível (modo privado, bloqueio do
 *   navegador), os dados ficam apenas em memória durante a sessão.
 */

const KEY_PREFIX = 'mundo-do-aprender:';

/** Chaves conhecidas. Adicione novas chaves aqui em vez de usar strings soltas. */
export const STORAGE_KEYS = Object.freeze({
  SETTINGS: 'settings',
  PROGRESS: 'progress',
});

const memoryFallback = new Map();
const isStorageAvailable = checkStorageAvailability();

function checkStorageAvailability() {
  try {
    const testKey = `${KEY_PREFIX}__test__`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function buildKey(key) {
  return `${KEY_PREFIX}${key}`;
}

/**
 * Lê um valor salvo.
 * @template T
 * @param {string} key
 * @param {T} [fallback=null] valor retornado se não houver dado ou se ele estiver corrompido
 * @returns {T}
 */
export function readValue(key, fallback = null) {
  const fullKey = buildKey(key);
  const raw = isStorageAvailable
    ? window.localStorage.getItem(fullKey)
    : memoryFallback.get(fullKey) ?? null;

  if (raw === null) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    console.warn(`[storage] Valor inválido em "${fullKey}". Usando o padrão.`);
    return fallback;
  }
}

/**
 * Salva um valor (qualquer dado serializável em JSON).
 * @param {string} key
 * @param {unknown} value
 * @returns {boolean} true se salvou com sucesso
 */
export function writeValue(key, value) {
  const fullKey = buildKey(key);
  const raw = JSON.stringify(value);

  if (!isStorageAvailable) {
    memoryFallback.set(fullKey, raw);
    return true;
  }

  try {
    window.localStorage.setItem(fullKey, raw);
    return true;
  } catch (error) {
    console.warn(`[storage] Não foi possível salvar "${fullKey}".`, error);
    return false;
  }
}

/** Remove um valor salvo. */
export function removeValue(key) {
  const fullKey = buildKey(key);
  if (isStorageAvailable) {
    window.localStorage.removeItem(fullKey);
  } else {
    memoryFallback.delete(fullKey);
  }
}

/** Remove todos os dados do Mundo do Aprender (somente chaves com o prefixo do app). */
export function clearAppData() {
  if (!isStorageAvailable) {
    memoryFallback.clear();
    return;
  }

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(KEY_PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
}
