/**
 * Desenho de um mapa do mundo na cena Phaser: chão, móveis, lugares,
 * marcadores de desafio ("!" pendente, estrela feito) e destaque do lugar perto.
 * Usado por worldScene.js, que cuida do movimento e das regras.
 */

import { TILES, TILE_SIZE } from '../../data/world/tiles.js';

const DEPTH = Object.freeze({ ground: 0, furniture: 1, spot: 2, marker: 15, highlight: 20 });
const MARKER_OFFSET = 11; // o marcador fica um pouco acima do lugar

/**
 * @param {Object} scene  cena Phaser
 * @param {Object} options
 * @param {Object} options.map    dados do mapa
 * @param {Object} options.model  createMapModel(map)
 * @param {Set<string>} options.used     lugares já usados (mostram `usedTiles`)
 * @param {Set<string>} options.removed  lugares que sumiram
 * @param {(spot: Object) => 'todo'|'done'|null} options.statusOf
 */
export function createMapView(scene, { map, model, used, removed, statusOf }) {
  const draw = (name, x, y, depth) => scene.add.image(x * TILE_SIZE, y * TILE_SIZE, ...TILES[name]).setOrigin(0).setDepth(depth);
  const spotImages = new Map();
  const markers = new Map();
  const highlight = scene.add.graphics().setDepth(DEPTH.highlight);

  // Cor do destaque vem do token do módulo (respeita alto contraste).
  let highlightColor = 0x1d6479;
  const token = getComputedStyle(scene.game.canvas).getPropertyValue('--module-strong').trim();
  if (/^#[0-9a-f]{6}$/i.test(token)) highlightColor = Number.parseInt(token.slice(1), 16);

  map.ground.forEach((line, y) => [...line].forEach((char, x) => {
    const legend = map.legend[char];
    if (legend.base) draw(legend.base, x, y, DEPTH.ground);
    draw(legend.tile, x, y, DEPTH.ground);
  }));
  map.furniture.forEach(({ tile, x, y }) => draw(tile, x, y, DEPTH.furniture));

  model.spots.forEach((spot) => {
    if (removed.has(spot.id)) return;
    spotImages.set(spot.id, (spot.tiles ?? []).map(({ tile, x, y }, index) => (
      draw(used.has(spot.id) && spot.usedTiles ? spot.usedTiles[index] ?? tile : tile, x, y, DEPTH.spot))));
    if (spot.challenge) {
      const top = Math.min(...spot.cells.map(({ y }) => y));
      const left = Math.min(...spot.cells.map(({ x }) => x));
      markers.set(spot.id, scene.add.image(left * TILE_SIZE, top * TILE_SIZE - MARKER_OFFSET, ...TILES.markTodo)
        .setOrigin(0).setDepth(DEPTH.marker));
    }
  });

  function refreshMarkers() {
    markers.forEach((image, id) => {
      const status = statusOf(model.spots.find((spot) => spot.id === id));
      image.setVisible(Boolean(status));
      if (status) image.setTexture(...TILES[status === 'done' ? 'markDone' : 'markTodo']);
    });
  }

  refreshMarkers();

  return {
    refreshMarkers,
    /** Contorno fixo (sem piscar) em volta do lugar; null apaga. */
    drawHighlight(spot) {
      highlight.clear();
      if (!spot || removed.has(spot.id)) return;
      const xs = spot.cells.map(({ x }) => x);
      const ys = spot.cells.map(({ y }) => y);
      const left = Math.min(...xs) * TILE_SIZE;
      const top = Math.min(...ys) * TILE_SIZE;
      const width = (Math.max(...xs) + 1) * TILE_SIZE - left;
      const height = (Math.max(...ys) + 1) * TILE_SIZE - top;
      highlight.lineStyle(1, highlightColor, 1);
      highlight.strokeRect(left + 0.5, top + 0.5, width - 1, height - 1);
    },
    /** Mostra o lugar usado: troca as imagens ou tira do mapa. */
    showUsed(spot) {
      const images = spotImages.get(spot.id) ?? [];
      if (spot.removeOnUse) images.forEach((image) => image.destroy());
      else if (spot.usedTiles) images.forEach((image, index) => image.setTexture(...TILES[spot.usedTiles[index]]));
    },
  };
}
