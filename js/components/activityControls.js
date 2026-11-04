/**
 * activityControls.js — barra "Desfazer · Recomeçar · Conferir" das atividades.
 *
 * - Desfazer: volta a última mudança (fica desativado quando não há o que desfazer).
 * - Recomeçar: volta a atividade ao estado inicial.
 * - Conferir (opcional): pede o feedback quando a criança decide que terminou.
 */

import { el } from './dom.js';
import { createButton } from './button.js';

/**
 * @param {Object} options
 * @param {() => void} options.onUndo
 * @param {() => void} options.onRestart
 * @param {() => void} [options.onCheck]
 * @param {string} [options.checkLabel='Conferir']
 * @returns {{ element: HTMLElement, setUndoEnabled: (enabled: boolean) => void }}
 */
export function createActivityControls({ onUndo, onRestart, onCheck, checkLabel = 'Conferir' }) {
  const undo = createButton({
    label: 'Desfazer', variant: 'secondary', icon: 'undo', className: 'activity-controls__undo', onClick: onUndo, attrs: { disabled: true },
  });
  const restart = createButton({
    label: 'Recomeçar', variant: 'secondary', icon: 'restart', className: 'activity-controls__restart', onClick: onRestart,
  });
  const check = onCheck && createButton({
    label: checkLabel, variant: 'module', icon: 'check', className: 'activity-controls__check', onClick: onCheck,
  });

  return {
    element: el('div', { className: 'activity-controls' }, [undo, restart, check]),
    setUndoEnabled(enabled) {
      // Não deixa o foco "sumir" quando o botão focado fica desativado.
      if (!enabled && document.activeElement === undo) restart.focus();
      undo.disabled = !enabled;
    },
  };
}
