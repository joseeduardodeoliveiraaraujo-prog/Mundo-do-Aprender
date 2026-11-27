/**
 * Objetos de missão na cena: itens para pegar, pistas e o item que Noa
 * carrega sobre a cabeça. Usado por worldScene.js; quem decide o que fazer
 * com eles é o executor de missões (quest/questRunner.js).
 */

import { ATLAS_KEY } from './mapView.js';

const CARRY_HEIGHT = 19; // pixels acima dos pés de Noa
const IMAGE_SIZE = 32;   // figuras SVG são convertidas neste tamanho e mostradas em 16×16

const imageKeyOf = (src) => `quest-image:${src}`;

/**
 * @param {{ scene: () => Object, model: () => Object, view: () => Object, walker: () => Object }} get
 */
export function createQuestObjects(get) {
  const added = new Set();
  let carried = null;

  /** Carrega as figuras SVG que ainda não estão na cena. */
  function loadImages(sources) {
    const scene = get.scene();
    const missing = [...new Set(sources)].filter((src) => !scene.textures.exists(imageKeyOf(src)));
    if (!missing.length) return Promise.resolve();
    return new Promise((resolve) => {
      missing.forEach((src) => scene.load.svg(imageKeyOf(src), src, { width: IMAGE_SIZE, height: IMAGE_SIZE }));
      scene.load.once('complete', resolve);
      scene.load.start();
    });
  }

  return {
    /**
     * Coloca lugares temporários no mapa.
     * @param {Array<{ id: string, label: string, x: number, y: number, art?: string, image?: string }>} spots
     */
    async add(spots) {
      await loadImages(spots.filter(({ image }) => image).map(({ image }) => image));
      return spots.map((spot) => {
        const placed = get.model().addSpot({ ...spot, imageKey: spot.image ? imageKeyOf(spot.image) : undefined });
        get.view().drawSpot(placed);
        added.add(placed.id);
        return placed;
      });
    },
    remove(id) {
      get.model().removeSpot(id);
      get.view().eraseSpot(id);
      added.delete(id);
    },
    removeAll() {
      [...added].forEach((id) => this.remove(id));
      this.carry(null);
    },
    /** Mostra (ou tira) o item sobre a cabeça de Noa. */
    carry(item) {
      carried?.destroy();
      carried = null;
      if (!item) return;
      const scene = get.scene();
      carried = item.image
        ? scene.add.image(0, 0, imageKeyOf(item.image)).setDisplaySize(16, 16)
        : scene.add.image(0, 0, ATLAS_KEY, item.art);
      carried.setOrigin(0.5, 1);
    },
    update() {
      if (!carried) return;
      const { x, y } = get.walker().position;
      carried.setPosition(Math.round(x), Math.round(y) - CARRY_HEIGHT).setDepth(y + 1);
    },
    /** A cena foi refeita (troca de mapa): os objetos antigos não existem mais. */
    reset() {
      added.clear();
      carried = null;
    },
  };
}
