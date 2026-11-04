/**
 * undoHistory.js — histórico de estados para "Desfazer" e "Recomeçar".
 *
 *   const history = createHistory([]);
 *   history.push(novoEstado);   // registra uma mudança
 *   history.undo();             // volta um passo (retorna o estado atual)
 *   history.reset();            // volta ao estado inicial
 *
 * Os estados devem ser tratados como imutáveis (crie um novo a cada mudança).
 */

/**
 * @template T
 * @param {T} initial
 */
export function createHistory(initial) {
  const past = [];
  let current = initial;
  return {
    /** @returns {T} */
    get current() { return current; },
    get canUndo() { return past.length > 0; },
    /** @param {T} state */
    push(state) { past.push(current); current = state; },
    undo() { if (past.length > 0) current = past.pop(); return current; },
    reset() { past.length = 0; current = initial; return current; },
  };
}
