/**
 * dom.js — utilitário para criar elementos HTML de forma segura.
 * Usa textContent (nunca innerHTML), evitando injeção de HTML.
 */

/**
 * Cria um elemento.
 * @param {string} tag
 * @param {Object} [options]
 * @param {string} [options.className]
 * @param {string} [options.text]                     conteúdo de texto
 * @param {Record<string, string|number|boolean>} [options.attrs]  atributos (true = atributo vazio; false/null = omitido)
 * @param {Record<string, string>} [options.dataset]  atributos data-*
 * @param {Node | Node[]} [children]
 * @returns {HTMLElement}
 */
export function el(tag, { className, text, attrs = {}, dataset = {} } = {}, children = []) {
  const node = document.createElement(tag);

  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;

  Object.entries(attrs).forEach(([name, value]) => {
    if (value === false || value === null || value === undefined) return;
    node.setAttribute(name, value === true ? '' : String(value));
  });

  Object.assign(node.dataset, dataset);
  node.append(...[].concat(children).filter(Boolean));

  return node;
}
