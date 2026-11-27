/**
 * Noa andando livremente (em pixels), nas 8 direções, sem atravessar paredes
 * e móveis. Com as setas ele anda enquanto a tecla está apertada; com um
 * toque ele segue um caminho de blocos (calculado fora daqui).
 *
 * Quadros no atlas: noa-<direção>-<passo> (direção: down, up, left, right;
 * passo 0 a 3). A profundidade acompanha os pés, para Noa passar atrás das
 * copas e na frente dos troncos. Com "Reduzir animações": no caminho
 * automático Noa chega direto e as pernas não se movem.
 */

import { ATLAS_KEY } from './mapView.js';

const SPEED = 56;          // pixels por segundo (calmo)
const STEP_FRAME_MS = 150; // troca de passo
const FEET_HALF_WIDTH = 5; // caixa dos pés (o que colide com as paredes)
const FEET_HEIGHT = 5;
const STEPS = 4;

/**
 * @param {Object} scene
 * @param {Object} options
 * @param {{x:number,y:number}} options.position  pés de Noa, em pixels
 * @param {string} [options.facing='down']
 * @param {(x: number, y: number) => boolean} options.isBlockedAt  ponto em pixels bloqueado?
 * @param {() => boolean} options.isReduced
 */
export function createFreeWalker(scene, { position, facing = 'down', isBlockedAt, isReduced }) {
  const pos = { ...position };
  const sprite = scene.add.sprite(0, 0, ATLAS_KEY, `noa-${facing}-0`).setOrigin(0.5, 1);
  const shadow = scene.add.image(0, 0, ATLAS_KEY, 'shadow').setOrigin(0.5, 0.5);
  let currentFacing = facing;
  let held = { x: 0, y: 0 };
  let waypoints = [];
  let onArrive = null;
  let stuckTime = 0;

  const collides = (x, y) => (
    isBlockedAt(x - FEET_HALF_WIDTH, y - FEET_HEIGHT) || isBlockedAt(x + FEET_HALF_WIDTH, y - FEET_HEIGHT)
    || isBlockedAt(x - FEET_HALF_WIDTH, y - 1) || isBlockedAt(x + FEET_HALF_WIDTH, y - 1));

  /** Move separando os eixos (desliza nas paredes). Devolve quanto andou. */
  function move(dx, dy) {
    const before = { ...pos };
    if (dx && !collides(pos.x + dx, pos.y)) pos.x += dx;
    if (dy && !collides(pos.x, pos.y + dy)) pos.y += dy;
    return Math.hypot(pos.x - before.x, pos.y - before.y);
  }

  function faceTowards(dx, dy) {
    if (!dx && !dy) return;
    currentFacing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  }

  function draw(moving) {
    const step = moving && !isReduced() ? Math.floor(scene.time.now / STEP_FRAME_MS) % STEPS : 0;
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);
    sprite.setPosition(x, y).setFrame(`noa-${currentFacing}-${step}`).setDepth(y + 0.5);
    shadow.setPosition(x, y - 1).setDepth(y + 0.4);
  }

  function finishPath() {
    const callback = onArrive;
    waypoints = [];
    onArrive = null;
    stuckTime = 0;
    callback?.();
  }

  draw(false);

  return {
    sprite,
    get position() { return { ...pos }; },
    get facing() { return currentFacing; },
    get isMoving() { return waypoints.length > 0 || Boolean(held.x || held.y); },
    update(delta) {
      const distance = (SPEED * delta) / 1000;
      if (held.x || held.y) {
        const length = Math.hypot(held.x, held.y);
        faceTowards(held.x, held.y);
        draw(move((held.x / length) * distance, (held.y / length) * distance) > 0);
        return;
      }
      if (!waypoints.length) { draw(false); return; }
      const target = waypoints[0];
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const length = Math.hypot(dx, dy);
      if (length <= distance) {
        Object.assign(pos, target);
        waypoints.shift();
        if (!waypoints.length) finishPath();
        draw(waypoints.length > 0);
        return;
      }
      faceTowards(dx, dy);
      const moved = move((dx / length) * distance, (dy / length) * distance);
      stuckTime = moved > 0 ? 0 : stuckTime + delta;
      if (stuckTime > 400) { waypoints = []; onArrive = null; stuckTime = 0; } // algo bloqueou: desiste
      draw(moved > 0);
    },
    /** Segue pontos (em pixels) e avisa ao chegar. */
    follow(points, onEnd) {
      held = { x: 0, y: 0 };
      if (isReduced() && points.length) {
        const last = points[points.length - 1];
        const before = points[points.length - 2] ?? pos;
        faceTowards(last.x - before.x, last.y - before.y);
        Object.assign(pos, last);
        waypoints = [];
        onArrive = null;
        draw(false);
        onEnd?.();
        return;
      }
      waypoints = [...points];
      onArrive = onEnd ?? null;
      if (!waypoints.length) finishPath();
    },
    /** Setas: -1, 0 ou 1 em cada eixo. Cancelam o caminho automático. */
    hold(x, y) {
      held = { x, y };
      if (x || y) { waypoints = []; onArrive = null; }
    },
    face(direction) {
      currentFacing = direction;
      draw(false);
    },
  };
}
