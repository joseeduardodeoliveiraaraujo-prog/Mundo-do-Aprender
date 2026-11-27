/**
 * text.js — utilitários de texto.
 */

/** Preenche "{chave}" com valores. Ex.: fillTemplate('Oi, {name}!', { name: 'Noa' }). */
export function fillTemplate(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}
