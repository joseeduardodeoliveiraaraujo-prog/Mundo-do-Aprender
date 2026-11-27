/**
 * Cena de perto (Phaser): um lugar da casa visto de perto, com peças que a
 * criança toca, arrasta e esfrega. A cena não decide nada: avisa cada ação em
 * `onAction` e toca as animações que o controlador (closeup.js) pedir.
 *
 * Ações: { tap: peça } · { drag: peça, to: peça|null } · { rub: peça }
 * Efeitos (em ordem; `together` roda vários ao mesmo tempo):
 *   { frame, image }  troca a imagem de uma peça
 *   { show, grow?, fade? } / { hide, fade? }   mostra (crescendo de cima para baixo
 *                     ou clareando) ou esconde
 *   { moveTo, x, y } / { lock }  leva uma peça até um ponto / ela fica presa ali
 *   { bubbles: n }    espuma aparece na área `foam`; { popBubbles: true } some
 *   { drops: n, on }  gotas caem uma vez; { sparkles: n, on } brilho que some
 *   { nudge, image } / { settle, image }  balança a peça para um lado e volta
 *   { wait: ms }
 * Nenhuma animação se repete sozinha; com "Reduzir animações" tudo é instantâneo.
 *
 * `def.svgs` com `card: true` viram cartões: moldura clara com o pictograma
 * dentro (imagem `card:<id>`), montados uma vez ao abrir a cena.
 */

import { makeCard } from './closeupCard.js';

const RUB_DISTANCE = 6; // px do jogo para contar uma esfregada
const COMMON = 'assets/images/world/closeup/common';

export function createCloseupScene({ def, onAction }) {
  const key = (image) => `closeup:${image}`;
  const sprites = new Map();
  let scene = null;
  let busy = false;
  let bubbles = [];
  let marker = null;
  let nudgeSide = 1;
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });

  const reduce = () => scene.registry.get('reduceMotion');
  const tween = (targets, props, duration = 250) => new Promise((resolve) => {
    if (reduce()) {
      const { y, x, scaleY, scale, alpha, angle } = props;
      Object.entries({ y, x, scaleY, scale, alpha, angle }).forEach(([name, value]) => { if (value !== undefined) targets[name] = value; });
      resolve();
      return;
    }
    scene.tweens.add({ targets, ...props, duration, ease: 'Sine.easeInOut', onComplete: resolve });
  });
  const wait = (ms) => new Promise((resolve) => (reduce() ? resolve() : scene.time.delayedCall(ms, resolve)));
  const center = (sprite) => ({ x: sprite.x + sprite.width / 2, y: sprite.y + sprite.height / 2 });
  const pieceAt = (x, y, except) => [...sprites.values()].reverse()
    .find((s) => s !== except && s.visible && s.getData('piece').label && s.getBounds().contains(x, y));

  async function spawn(image, x, y, appear = true) {
    const sprite = scene.add.image(x, y, key(image)).setDepth(20);
    if (appear) { sprite.setScale(0); await tween(sprite, { scale: 1 }, 180); }
    return sprite;
  }

  const EFFECTS = {
    frame: ({ frame, image }) => sprites.get(frame).setTexture(key(image)),
    show: async ({ show, grow, fade }) => {
      const sprite = sprites.get(show).setVisible(true);
      if (grow) { sprite.scaleY = 0; await tween(sprite, { scaleY: 1 }, 300); }
      if (fade) { sprite.alpha = 0; await tween(sprite, { alpha: 1 }, 500); }
    },
    hide: async ({ hide, fade }) => {
      const sprite = sprites.get(hide);
      await tween(sprite, fade ? { alpha: 0 } : { scaleY: 0 }, fade ? 400 : 200);
      sprite.setVisible(false).setScale(1).setAlpha(1);
    },
    moveTo: ({ moveTo, x, y }) => tween(sprites.get(moveTo).setDepth(25), { x, y }, 250),
    lock: ({ lock }) => sprites.get(lock).disableInteractive().setData('locked', true),
    bubbles: async ({ bubbles: count }) => {
      const { x, y, width, height } = def.foam;
      for (let i = 0; i < count; i++) {
        const image = Math.random() < 0.4 ? 'bubble-small' : 'bubble';
        bubbles.push(await spawn(image, x + Math.random() * width, y + Math.random() * height));
      }
    },
    popBubbles: async () => {
      const gone = bubbles;
      bubbles = [];
      for (const bubble of gone) {
        tween(bubble, { y: bubble.y + 10, alpha: 0 }, 220).then(() => bubble.destroy());
        await wait(60);
      }
      await wait(200);
    },
    drops: async ({ drops: count, on }) => {
      const { x, y } = center(sprites.get(on));
      const falling = [];
      for (let i = 0; i < count; i++) {
        const drop = scene.add.image(x - 12 + i * (24 / count), y - 14, key('splash')).setDepth(20).setScale(0.5);
        falling.push(tween(drop, { y: drop.y + 18, alpha: 0 }, 400).then(() => drop.destroy()));
        await wait(80);
      }
      await Promise.all(falling);
    },
    sparkles: async ({ sparkles: count, on }) => {
      const sprite = sprites.get(on);
      const shown = [];
      for (let i = 0; i < count; i++) {
        shown.push(await spawn('sparkle', sprite.x + 10 + ((i * 37) % (sprite.width - 20)), sprite.y + 6 + ((i * 13) % 18)));
      }
      await wait(500);
      await Promise.all(shown.map((s) => tween(s, { alpha: 0 }, 300).then(() => s.destroy())));
    },
    nudge: async ({ nudge, image }) => {
      const sprite = sprites.get(nudge).setTexture(key(image));
      nudgeSide = -nudgeSide;
      await tween(sprite, { x: sprite.getData('piece').x + 3 * nudgeSide }, 90);
    },
    settle: async ({ settle, image }) => {
      const sprite = sprites.get(settle).setTexture(key(image));
      await tween(sprite, { x: sprite.getData('piece').x }, 120);
    },
    wait: ({ wait: ms }) => wait(ms),
    together: ({ together }) => Promise.all(together.map(run)),
  };
  function run(effect) {
    const type = Object.keys(EFFECTS).find((name) => name in effect);
    return Promise.resolve(EFFECTS[type](effect));
  }

  function bindInput() {
    let press = null; // { sprite, x, y, rubX, side }
    scene.input.on('gameobjectdown', (pointer, sprite) => {
      press = { sprite, x: pointer.worldX, y: pointer.worldY, rubX: pointer.worldX, side: 0, rubbed: false };
    });
    scene.input.on('drag', (pointer, sprite, x, y) => {
      if (!busy) sprite.setPosition(x, y).setDepth(30);
    });
    scene.input.on('pointermove', (pointer) => {
      if (busy || !press || !pointer.isDown || press.sprite.getData('piece').draggable) return;
      const moved = pointer.worldX - press.rubX;
      if (Math.abs(moved) < RUB_DISTANCE) return;
      const side = Math.sign(moved);
      press.rubX = pointer.worldX;
      if (side !== press.side) {
        press.side = side;
        press.rubbed = true;
        onAction({ rub: press.sprite.getData('piece').id });
      }
    });
    const release = (pointer) => {
      const current = press;
      press = null;
      if (!current || busy) return;
      const piece = current.sprite.getData('piece');
      const still = Math.hypot(pointer.worldX - current.x, pointer.worldY - current.y) < 4;
      if (piece.draggable && !still) {
        const target = pieceAt(pointer.worldX, pointer.worldY, current.sprite);
        onAction({ drag: piece.id, to: target?.getData('piece').id ?? null });
      } else if (still && !current.rubbed) {
        if (piece.draggable) current.sprite.setPosition(piece.x, piece.y);
        onAction({ tap: piece.id });
      }
    };
    scene.input.on('pointerup', release);
    scene.input.on('pointerupoutside', release);
  }

  return {
    ready,
    createScene: () => ({
      key: `closeup-${def.id}`,
      preload() {
        def.images.forEach((image) => this.load.image(key(image), `${def.folder}/${image}.png`));
        this.load.image(key('pointer'), `${COMMON}/pointer.png`);
        // Cartões com pictogramas (SVG) desenhados no tamanho certo.
        def.svgs?.forEach(({ id, src, width, height }) => this.load.svg(key(id), src, { width, height }));
      },
      create() {
        scene = this;
        def.svgs?.filter((svg) => svg.card).forEach((svg) => makeCard(this, key, svg));
        this.add.image(0, 0, key(def.background ?? 'background')).setOrigin(0);
        def.pieces.forEach((piece, index) => {
          const sprite = this.add.image(piece.x, piece.y, key(piece.image)).setOrigin(0).setDepth(index + 1);
          sprite.setData('piece', piece).setVisible(!piece.hidden);
          // `exact`: só responde onde há desenho (o toque nas partes transparentes passa para a peça de trás).
          if (piece.label) sprite.setInteractive({ useHandCursor: true, draggable: Boolean(piece.draggable), pixelPerfect: Boolean(piece.exact) });
          sprites.set(piece.id, sprite);
        });
        marker = this.add.image(0, 0, key('pointer')).setOrigin(0.5, 1).setDepth(40).setVisible(false)
          .setScale((def.width ?? 192) / 192);
        bindInput();
        resolveReady();
      },
    }),
    set busy(value) { busy = value; },
    /** Toca efeitos em ordem. */
    async play(effects = []) {
      for (const effect of effects) await run(effect);
    },
    /** Setinha parada em cima da peça que ajuda agora (null esconde). */
    point(id) {
      const sprite = id && sprites.get(id);
      marker.setVisible(Boolean(sprite));
      if (sprite) marker.setPosition(center(sprite).x, sprite.y - 1);
    },
    /** Leva uma peça até outra (alternativa por botão ao arrastar). */
    moveTo(id, targetId) {
      const sprite = sprites.get(id).setDepth(30);
      const target = center(sprites.get(targetId));
      return tween(sprite, { x: target.x - sprite.width / 2, y: target.y - sprite.height / 2 }, 400);
    },
    /** Devolve uma peça arrastável ao lugar dela. */
    async home(id) {
      const sprite = sprites.get(id);
      if (!sprite.visible || sprite.getData('locked')) return;
      const { x, y } = sprite.getData('piece');
      await tween(sprite, { x, y }, 300);
      sprite.setDepth(def.pieces.findIndex((piece) => piece.id === id) + 1);
    },
  };
}
