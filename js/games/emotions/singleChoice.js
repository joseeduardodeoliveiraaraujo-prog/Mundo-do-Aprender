/**
 * Alternativas de uma única resposta, com feedback imediato.
 * Usado por "recognize", "express" e pela pergunta final de "investigate".
 */

import { createChoiceButton, createChoiceGroup, setSelectedChoice } from '../../components/choiceButton.js';
import { showResult } from '../../components/activityFrame.js';

/**
 * @param {Object} options
 * @param {{ feedbackSlot: HTMLElement }} options.frame
 * @param {string} options.label  nome acessível do grupo
 * @param {Array<{ id: string, label: string, image?: string, icon?: string }>} options.choices
 * @param {(choiceId: string) => { completes: boolean, tone: string, title: string, message?: string }} options.evaluate
 * @param {() => void} options.complete
 * @returns {HTMLElement} o grupo de alternativas
 */
export function createSingleChoice({ frame, label, choices, evaluate, complete }) {
  let group;
  const buttons = choices.map(({ id, ...choice }) => createChoiceButton({
    ...choice,
    onSelect: (button) => {
      setSelectedChoice(group, button);
      showResult(frame, evaluate(id), complete);
    },
  }));
  group = createChoiceGroup({ label, choices: buttons });
  return group;
}
