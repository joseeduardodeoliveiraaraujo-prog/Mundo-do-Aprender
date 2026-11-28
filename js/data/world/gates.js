/**
 * Quebra-cabeças que abrem caminhos fechados (somente dados): id do `gate` de um lugar
 * no mapa → quebra-cabeça { intro, success, goal, closeup, tasks, actions }.
 * Formato de um quebra-cabeça: ./closeups/bridge.js. Lógica: js/games/world/gates.js e gateQuest.js.
 */

import { bridgeGate } from './closeups/bridge.js';

export const gatePuzzles = Object.freeze({ bridge: bridgeGate });
