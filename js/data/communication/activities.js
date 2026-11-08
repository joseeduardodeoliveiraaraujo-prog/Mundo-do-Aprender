/**
 * Atividades do módulo "Eu Me Comunico" (somente dados). Lógica em js/games/communication/.
 *
 * Cuidados pedagógicos refletidos no conteúdo:
 * - Fala, cartões, gestos e imagens são formas igualmente válidas de se comunicar.
 * - Dizer "não" ou "agora não" é sempre aceito e respeitado por quem responde.
 * - Escolhas pessoais não têm resposta certa. Só volta o cartão que não combina
 *   com a situação, com uma explicação calma.
 * - Noa é uma personagem de gênero neutro: evite "cansado/a", "obrigado/a".
 *
 * Campos comuns: id, type, part, title, instruction, greeting, success, prize (id do
 * cartão ganho na prancha). Com cena: scene, listener, mood.
 *
 * Tipos de atividade:
 *   talkCard  arrastar um cartão até o balão de Noa; a cena responde.
 *             before / after: camadas da cena antes e depois.
 *             options: [{ card, fit: likely|possible|unlikely, reply | message }]
 *   sentence  montar uma frase com peças e tocar em "Mostrar a frase".
 *             lines: [[{ text } | { slot, label }]],
 *             pieces: [{ card, group (= slot), reply? }], reply: modelo com {slot}
 *   dialogue  conversa em turnos; cada cartão escolhido muda a resposta.
 *             turns: [{ say, options: [{ card, fit, reply | message }] }]
 *   match     levar cada cartão até a situação em que ele ajuda.
 *             situations: [{ id, label, image }], items: [{ card, situation, hint }]
 *
 * Nunca mude o id de uma atividade publicada: o progresso salvo depende dele.
 */

import { homeAndSchool } from './homeAndSchool.js';
import { playAndFeelings } from './playAndFeelings.js';

export const activities = Object.freeze([...homeAndSchool, ...playAndFeelings]);
