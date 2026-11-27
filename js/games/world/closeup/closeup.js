/**
 * Cena de perto: abre sobre o mapa um lugar visto de perto (a pia, o quarto,
 * a mochila, o quadro da rotina) e a criança faz a atividade com as mãos —
 * toca, arrasta, esfrega — em vez de escolher cartões.
 *
 * Uma cena de perto recebe tarefas (montadas pelos tradutores de ../quest/adapters/):
 *   { id, label, do, effects, each?, how?, reaction?, hint?, needs?, wait?, ok?, required?, check? }
 *   do        a ação que faz a tarefa: { tap } · { drag, to } · { rub, times }
 *   ok:false  objeto que não serve: volta para o lugar com a pista (`hint`)
 *   needs     ids que precisam vir antes (senão, `wait`)
 *   check     (ids já feitos, em ordem) → { ok, reply } — regras de uma sequência
 *   effects   animações (closeupScene.js); { place: id } põe a peça na próxima casa do quadro
 * Em `ordered`, as tarefas seguem a ordem da lista.
 *
 * O painel (questHud) mostra o objetivo, o que acabou de acontecer e botões
 * que fazem as mesmas ações (teclado e quem não arrasta). Ação que não serve
 * não é erro: a peça volta, aparece uma pista e uma setinha parada mostra
 * onde mexer. Nada depende de tempo.
 */

import { el } from '../../../components/dom.js';
import { createGameStage } from '../../../components/gameStage.js';
import { speak } from '../../../speech.js';
import { createCloseupScene } from './closeupScene.js';


const same = (want, action) => (want.tap && (action.tap === want.tap))
  || (want.drag && action.drag === want.drag && action.to === want.to)
  // Tocar também esfrega (uma passada por toque).
  || (want.rub && (action.rub === want.rub || action.tap === want.rub));

const targetOf = (task) => task.do.tap ?? task.do.drag ?? task.do.rub;
const hintOf = (task) => `${task.hint ?? ''} ${task.how ?? ''}`.trim();

/**
 * @param {{ host: HTMLElement, hud: Object, texts: { loading: string, error: string },
 *   onOpen: () => void, onClose: () => void }} options
 */
export function createCloseup({ host, hud, texts, onOpen, onClose }) {
  let current = null;

  const pending = (run) => run.tasks.filter((t) => t.ok !== false && !run.done.includes(t.id));
  const requiredLeft = (run) => pending(run).filter((t) => t.required !== false);

  function showHud(focusLabel) {
    const run = current;
    const shown = run.checklist === 'none' ? []
      : run.tasks.filter((t) => t.ok !== false && (run.checklist === 'all' ? t.required !== false : run.done.includes(t.id)));
    hud.show({
      goal: run.goal,
      items: shown.map((t) => ({ label: t.label, done: run.done.includes(t.id) })),
      note: run.note,
      actions: run.actions.filter((a) => !a.task || !run.done.includes(a.task))
        .map((a) => ({ label: a.label, onClick: () => act(a.do, a.label) })),
    });
    if (focusLabel) {
      const buttons = [...hud.element.querySelectorAll('button')];
      (buttons.find((b) => b.textContent.trim() === focusLabel) ?? buttons[0])?.focus({ preventScroll: true });
    }
  }

  function say(note) {
    current.note = note;
    speak(note);
  }

  /** Decide o que acontece com uma ação: { accept } ou { note, point }. */
  function judge(run, task, action) {
    const expected = run.ordered ? requiredLeft(run)[0] : null;
    if (!task) {
      if (action.drag && !action.to) return {}; // soltou no meio do caminho: a peça só volta
      const help = expected ?? requiredLeft(run)[0];
      return help ? { note: hintOf(help), point: targetOf(help) } : {};
    }
    if (expected && task !== expected) return { note: hintOf(expected), point: targetOf(expected) };
    if (task.ok === false) return { note: task.hint };
    if (task.needs?.some((id) => !run.done.includes(id))) return { note: task.wait };
    const checked = task.check?.(run.done, task.id);
    if (checked && !checked.ok) return { note: checked.reply };
    return { accept: true };
  }

  /** Troca { place } pela posição da próxima casa do quadro. */
  const resolve = (run, effects = []) => effects.flatMap((effect) => (effect.place
    ? [{ moveTo: effect.place, ...run.def.slots[run.done.length] }, { lock: effect.place }]
    : [effect]));

  /** Uma ação da criança, pelo toque na cena ou por um botão (`fromButton` = rótulo dele). */
  async function act(action, fromButton) {
    const run = current;
    if (!run || run.busy || run.finished) return;
    const { scene } = run;
    const task = run.tasks.find((t) => !run.done.includes(t.id) && same(t.do, action));
    const verdict = judge(run, task, action);
    // Cada passada de esfregar responde na hora, sem esperar a anterior.
    if (verdict.accept && !fromButton && task.do.rub && run.passes + 1 < task.do.times) {
      run.passes += 1;
      scene.point(null);
      scene.play(task.each);
      return;
    }
    run.busy = true;
    scene.busy = true;
    if (fromButton && action.drag && action.to) await scene.moveTo(action.drag, action.to);

    if (verdict.accept) {
      scene.point(null);
      // Pelo botão, "Esfregar" faz todas as passadas de uma vez.
      for (let i = run.passes; i < (task.do.times ?? 1) - 1 && task.each; i++) await scene.play(task.each);
      await scene.play(resolve(run, task.effects));
      run.passes = 0;
      run.done.push(task.id);
      say((typeof task.reaction === 'function' ? task.reaction(run.done.length) : task.reaction) ?? '');
    } else if (verdict.note) {
      say(verdict.note);
      scene.point(verdict.point ?? null);
    }

    if (action.drag) await scene.home(action.drag);
    if (current !== run) return;
    run.busy = false;
    scene.busy = false;
    if (requiredLeft(run).length) {
      showHud(fromButton);
      return;
    }
    // Pronto: o painel sai e a cena fica à vista durante a fala final.
    run.finished = true;
    hud.hide();
    run.finish(run.note || true);
  }

  return {
    get isOpen() { return Boolean(current); },
    /**
     * Abre a cena e espera a criança fazer todas as tarefas obrigatórias.
     * @param {{ def: Object, tasks: Object[], ordered?: boolean, goal?: string,
     *   actions?: Array<{ label, do, task? }>, checklist?: 'all'|'done'|'none' }} closeup
     * @returns {Promise<string|true|null>} a última fala (ou true) ao terminar; null se a cena
     *   for fechada antes (desafio parado)
     */
    open({ def, tasks, ordered = false, goal, actions, checklist = 'all' }) {
      this.close();
      const scene = createCloseupScene({ def, onAction: (action) => act(action) });
      const stage = createGameStage({
        width: def.width ?? 192, height: def.height ?? 128, label: def.label, texts, pixelArt: true, createScene: scene.createScene,
      });
      host.replaceChildren(stage.element);
      host.hidden = false;
      onOpen();
      return new Promise((finish) => {
        current = {
          def, tasks, ordered, checklist, goal: goal ?? def.goal, actions: actions ?? def.actions ?? [],
          done: [], passes: 0, note: '', scene, busy: true, finished: false, finish,
        };
        showHud();
        scene.ready.then(() => {
          if (current?.scene === scene) current.busy = false;
        });
      });
    },
    /** Fecha a cena (fim da missão ou desafio parado). */
    close() {
      if (!current) return;
      const { finish } = current;
      current = null;
      host.hidden = true;
      host.replaceChildren(); // o palco sai da tela e o Phaser se desliga sozinho
      hud.hide();
      onClose();
      finish(null);
    },
  };
}

/** Elemento onde a cena de perto aparece, por cima do mapa. */
export const createCloseupHost = () => el('div', { className: 'world__closeup', attrs: { hidden: true } });
