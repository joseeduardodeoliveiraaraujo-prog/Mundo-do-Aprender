/**
 * Noa em Minha Rotina: o componente de personagem com os dados deste módulo.
 */

import { createCompanion as createBaseCompanion, occupantOf } from '../../components/companion.js';
import { routineData } from '../../data/routine.js';

export { occupantOf };

export const createCompanion = (options) => createBaseCompanion({ character: routineData.companion, ...options });
