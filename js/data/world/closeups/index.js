/**
 * Atividades que acontecem numa cena de perto (id da atividade → cena).
 * O formato de uma cena está descrito em ./sink.js.
 */

import { sinkCloseup } from './sink.js';
import { bedroomMorning, bedroomNight } from './bedroom.js';
import { backpackCloseup } from './backpack.js';
import { boardCloseup } from './board.js';

export const closeups = Object.freeze({
  'routine-steps-handwash': sinkCloseup,
  'routine-scene-wake': bedroomMorning,
  'routine-scene-bedtime': bedroomNight,
  'routine-pack-drawing': backpackCloseup,
  'routine-pack-sports': backpackCloseup,
  'routine-sequence-morning': boardCloseup,
  'routine-sequence-afternoon': boardCloseup,
  'routine-sequence-weekend': boardCloseup,
  'routine-sequence-bedtime': boardCloseup,
});
