/**
 * Executor de missões: roda, em ordem, os passos que um tradutor (./adapters/)
 * montou a partir de uma atividade.
 *
 *   say     fala na caixa de diálogo                     { speaker, text, image? }
 *   choose  pergunta com cartões; repete até um válido  { speaker, text, image?, options: [{ label, image?, icon?, ok, reply? }] }
 *   order   montar uma sequência escolhendo cartões      { speaker, text ({n}), cards, check(ids, id) → { ok, reply? } }
 *   find    Noa anda até os alvos no mapa                { goal, targets: [{ spotId, label, reply, image?, needs?, wait? }], others? }
 *   carry   pegar itens no chão e levar até um lugar     { goal, near, to, items: [{ id, label, art|image, ok, reply }], required }
 *   clues   lupas espalhadas perto de `near`; cada uma conta uma pista e some { goal, near, clues: [{ id, label, reply, image? }] }
 *   closeup cena de perto: a criança faz a atividade com as mãos { def, tasks, ordered?, goal?, actions?, checklist? } (ver closeup/closeup.js)
 *
 * Nada depende de tempo; resposta que não serve recebe uma pista e a criança
 * tenta de novo. "Parar o desafio" interrompe a qualquer momento.
 */

import { fillTemplate } from '../../../components/text.js';
import { markActivityCompleted } from '../../../progress.js';

const STOPPED = Symbol('missão parada');
/** Textos podem ser calculados na hora (ex.: a frase que está sendo montada). */
const textOf = (text) => (typeof text === 'function' ? text() : text);

/**
 * @param {Object} options
 * @param {Object} options.world   createWorldScene(...)
 * @param {Object} options.dialog  createDialogBox(...)
 * @param {Object} options.hud     createQuestHud(...)
 * @param {Object} options.closeup createCloseup(...)
 * @param {Object} options.texts   worldData.texts.quest
 * @param {(completed: boolean) => void} options.onEnd
 */
export function createQuestRunner({ world, dialog, hud, closeup, texts, onEnd }) {
  let active = null; // { stopped, waiter }

  const check = (value) => {
    if (value === null || !active || active.stopped) throw STOPPED;
    return value;
  };
  const say = async (speaker, text, image) => check(await dialog.say({ speaker, text: textOf(text), image }));
  const waitArrive = () => new Promise((resolve) => { active.waiter = resolve; }).then(check);

  async function choose(step) {
    for (;;) {
      const option = step.options[check(await dialog.choose({ ...step, text: textOf(step.text) }))];
      if (option.reply) await say(option.speaker ?? step.speaker, option.reply, option.replyImage);
      if (option.ok) {
        option.onPick?.();
        return option;
      }
    }
  }

  async function order(step) {
    const chosen = [];
    const remaining = [...step.cards];
    while (remaining.length) {
      const index = check(await dialog.choose({
        speaker: step.speaker, text: fillTemplate(step.text, { n: chosen.length + 1 }), picked: chosen, options: remaining,
      }));
      const card = remaining[index];
      const result = step.check(chosen.map(({ id }) => id), card.id);
      if (result.reply) await say(step.speaker, result.reply);
      if (result.ok) { chosen.push(card); remaining.splice(index, 1); }
    }
  }

  async function find(step) {
    const found = new Set();
    const showHud = () => hud.show({
      goal: step.goal,
      items: step.hideList ? [] : step.targets.map((t) => ({ label: t.label, done: found.has(t.spotId) })),
      actions: step.hideList ? [] : step.targets.filter((t) => !found.has(t.spotId))
        .map((t) => ({ label: fillTemplate(texts.goTo, t), onClick: () => world.goToSpot(t.spotId) })),
    });
    dialog.hide();
    showHud();
    while (found.size < step.targets.length) {
      const spot = await waitArrive();
      const target = step.targets.find(({ spotId }) => spotId === spot.id);
      if (target && found.has(target.spotId)) await say(step.speaker, texts.alreadyFound);
      else if (target && target.needs?.some((id) => !found.has(id))) await say(step.speaker, target.wait);
      else if (target) {
        found.add(target.spotId);
        target.onFound?.();
        await say(target.speaker ?? step.speaker, target.reply, target.image);
      } else {
        await say(step.speaker, step.others?.(spot) ?? texts.notThis);
      }
      dialog.hide();
      showHud();
    }
    hud.hide();
  }

  async function clues(step) {
    const cells = world.freeCellsNear(step.near, step.clues.length);
    await world.quest.add(step.clues.map((clue, index) => ({ id: `quest-${clue.id}`, label: clue.label, art: 'clue', ...cells[index] })));
    await find({
      ...step,
      targets: step.clues.map((clue) => ({ ...clue, spotId: `quest-${clue.id}`, onFound: () => world.quest.remove(`quest-${clue.id}`) })),
    });
  }

  async function carry(step) {
    const cells = world.freeCellsNear(step.near, step.items.length);
    const origin = new Map(step.items.map((item, index) => [item.id, cells[index] ?? step.near]));
    const toSpot = (item) => ({ id: `quest-${item.id}`, label: item.label, art: item.art, image: item.image, ...origin.get(item.id) });
    await world.quest.add(step.items.map(toSpot));
    const delivered = new Set();
    const tried = new Set(); // itens já levados e recusados vão para o fim da lista de botões
    let holding = null;
    const putBack = async () => {
      if (holding) await world.quest.add([toSpot(holding)]);
      holding = null;
      world.quest.carry(null);
    };
    const showHud = () => hud.show({
      goal: step.goal,
      items: step.required.map((id) => ({ label: step.items.find((item) => item.id === id).label, done: delivered.has(id) })),
      carrying: holding ? fillTemplate(texts.carrying, holding) : texts.handsFree,
      actions: [
        ...step.items.filter((item) => !delivered.has(item.id) && item !== holding)
          .sort((a, b) => Number(tried.has(a.id)) - Number(tried.has(b.id)))
          .map((item) => ({ label: fillTemplate(texts.pick, item), onClick: () => world.goToSpot(`quest-${item.id}`) })),
        ...(holding ? [{ label: fillTemplate(texts.bringTo, { label: world.spotById(step.to)?.label ?? '' }), onClick: () => world.goToSpot(step.to) }] : []),
      ],
    });
    dialog.hide();
    showHud();
    while (step.required.some((id) => !delivered.has(id))) {
      const spot = await waitArrive();
      const picked = step.items.find((item) => spot.id === `quest-${item.id}`);
      if (picked) {
        await putBack();
        world.quest.remove(spot.id);
        holding = picked;
        world.quest.carry(picked);
      } else if (spot.id === step.to && !holding) {
        await say(step.speaker, step.emptyHint);
      } else if (spot.id === step.to) {
        const item = holding;
        await say(item.speaker ?? step.speaker, item.reply);
        if (item.ok) {
          delivered.add(item.id);
          holding = null;
          world.quest.carry(null);
        } else {
          tried.add(item.id);
          await putBack();
        }
      } else {
        await say(step.speaker, step.emptyHint);
      }
      dialog.hide();
      showHud();
    }
    world.quest.removeAll();
    hud.hide();
  }

  async function openCloseup(step) {
    dialog.hide();
    const last = check(await closeup.open(step));
    // A reação da última tarefa aparece na caixa de fala (o painel já saiu).
    if (step.speaker && typeof last === 'string') await say(step.speaker, last);
  }

  const RUN = { say: (step) => say(step.speaker, step.text, step.image), choose, order, find, carry, clues, closeup: openCloseup };

  function cleanup() {
    closeup.close();
    world.quest.removeAll();
    world.lockDoors(false);
    hud.hide();
    dialog.hide();
    active = null;
  }

  return {
    get isActive() { return Boolean(active); },
    /**
     * @param {{ moduleId?: string, activity?: { id: string }, speaker: Object, steps: Object[], success?: string,
     *   onComplete?: () => void }} quest  sem `activity` (caminho fechado), não registra progresso
     */
    async start(quest) {
      active = { stopped: false, waiter: null };
      world.lockDoors(true);
      let completed = false;
      try {
        for (const step of quest.steps) await RUN[step.kind](step);
        if (quest.activity) markActivityCompleted(quest.moduleId, quest.activity.id);
        quest.onComplete?.();
        completed = true;
        await say(quest.speaker, quest.success ?? texts.done);
      } catch (error) {
        if (error !== STOPPED) throw error;
      } finally {
        cleanup();
        onEnd(completed);
      }
    },
    /** Noa chegou num lugar durante a missão. @returns {boolean} true se a missão cuidou disso */
    handleArrive(spot) {
      if (!active) return false;
      const waiter = active.waiter;
      active.waiter = null;
      waiter?.(spot);
      return true;
    },
    stop() {
      if (!active) return;
      active.stopped = true;
      active.waiter?.(null);
      dialog.cancel();
      closeup.close();
    },
  };
}
