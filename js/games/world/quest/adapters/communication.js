/**
 * Eu Me Comunico → conversas no mapa (quem responde é a pessoa da cena).
 *   talkCard  Noa mostra um cartão; a pessoa responde
 *   dialogue  conversa em turnos
 *   sentence  montar a frase escolhendo uma peça para cada parte
 *   match     conversa: em que situação cada cartão ajuda?
 */

import { fillTemplate } from '../../../../components/text.js';
import { communicationData } from '../../../../data/communication.js';
import { NOA, fits } from './common.js';

const { cards, people } = communicationData;
/** Pessoa dos dados → personagem do mapa (mesma imagem no atlas e no rosto da conversa). */
const ART_BY_PERSON = Object.freeze({
  gabi: 'personGabi', lia: 'personLia', teo: 'personTeo', caio: 'personKid', bia: 'personBia', ana: 'personTeacher',
});

/**
 * Quem responde: a pessoa da atividade, ou quem está no lugar. Ela precisa estar
 * no mapa (de preferência no próprio lugar), senão a conversa mostraria alguém
 * que a criança não vê: aí avisa no console, para corrigir os dados.
 */
function listenerOf(activity, speaker, world) {
  const person = people[activity.listener];
  if (!person) return speaker;
  const art = ART_BY_PERSON[activity.listener];
  if (world && !world.spotsWhere((spot) => spot.art === art).length) {
    console.warn(`[comunicação] "${activity.id}": ${person.name} responde, mas não está neste mapa.`);
  }
  return { name: person.name, face: `assets/images/world/faces/${art}.png` };
}

const cardOption = (option, listener) => ({
  label: cards[option.card].label, image: cards[option.card].image, ok: fits(option.fit),
  reply: option.reply ?? option.message, speaker: option.reply ? listener : NOA,
});

export const communicationAdapters = {
  talkCard: (activity, { speaker, world }) => {
    const listener = listenerOf(activity, speaker, world);
    return [{ kind: 'choose', speaker: NOA, text: activity.greeting, options: activity.options.map((o) => cardOption(o, listener)) }];
  },

  dialogue: (activity, { speaker, world }) => {
    const listener = listenerOf(activity, speaker, world);
    return [
      { kind: 'say', speaker: NOA, text: activity.greeting },
      ...activity.turns.map((turn) => ({
        kind: 'choose', speaker: listener, text: turn.say, options: turn.options.map((o) => cardOption(o, listener)),
      })),
    ];
  },

  sentence: (activity, { speaker, texts, world }) => {
    const listener = listenerOf(activity, speaker, world);
    const chosen = {};
    const slots = activity.lines.flat().filter((part) => part.slot);
    // A frase aparece sendo montada: "Eu quero brincar de ___".
    const lower = (text) => text.charAt(0).toLowerCase() + text.slice(1);
    const preview = () => `${activity.lines.map((line) => line
      .map((part) => part.text ?? (chosen[part.slot] ? lower(cards[chosen[part.slot].card].label) : '___')).join(' ')).join('. ')}.`;
    return [
      { kind: 'say', speaker: NOA, text: activity.greeting },
      ...slots.map((slot) => ({
        kind: 'choose', speaker: NOA,
        text: () => fillTemplate(texts.sentencePart, { sentence: preview(), label: slot.label }),
        options: activity.pieces.filter((piece) => piece.group === slot.slot).map((piece) => ({
          label: cards[piece.card].label, image: cards[piece.card].image, ok: true,
          onPick: () => { chosen[slot.slot] = piece; },
        })),
      })),
      { kind: 'say', speaker: NOA, text: () => fillTemplate(texts.sentenceDone, { sentence: preview() }) },
      { kind: 'say', speaker: listener, text: () => sentenceReply({ activity, chosen }) },
    ];
  },

  match: (activity, { speaker, texts }) => activity.items.map((item) => ({
    kind: 'choose', speaker, text: fillTemplate(texts.whereHelps, cards[item.card]),
    image: { src: cards[item.card].image, alt: cards[item.card].label },
    options: activity.situations.map((situation) => ({
      label: situation.label, image: situation.image, ok: situation.id === item.situation,
      reply: situation.id === item.situation ? fillTemplate(texts.helpsThere, { card: cards[item.card].label, situation: situation.label.toLowerCase() }) : item.hint,
    })),
  })),
};

/** Resposta final de "montar a frase": a peça de começo traz o modelo ("Entendi: você quer {food}"). */
export function sentenceReply({ activity, chosen }) {
  const start = Object.values(chosen).find((piece) => piece.reply) ?? activity.pieces.find((piece) => piece.reply);
  const values = Object.fromEntries(Object.entries(chosen).map(([slot, piece]) => [slot, cards[piece.card].label.toLowerCase()]));
  return fillTemplate(start?.reply ?? activity.reply ?? activity.success, values);
}
