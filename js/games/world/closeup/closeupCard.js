/**
 * Cartão da cena de perto: moldura em pixel art com o pictograma (SVG) no
 * meio, desenhada uma vez num canvas do Phaser (imagem `card:<id>`).
 *
 * A moldura segue a grade da cena do quadro (1 pixel de arte = 4 px do
 * jogo): contorno de 1 pixel, cantos em degrau, sem suavização, e uma faixa
 * de sombra embaixo, como as outras peças do jogo.
 */

const CELL = 4; // 1 pixel de arte, em px do jogo
const COLS = 12; // 48 px
const ROWS = 14; // 56 px
const COLORS = Object.freeze({ outline: '#6b4b5b', fill: '#fffaf0', shade: '#ead9c0' });

/** Cor de cada pixel de arte da moldura (null = transparente). */
function frameColor(col, row) {
  const lastCol = COLS - 1;
  const lastRow = ROWS - 1;
  const edgeX = col === 0 || col === lastCol;
  const edgeY = row === 0 || row === lastRow;
  if (edgeX && edgeY) return null; // canto de fora: vazio
  const innerCorner = (col === 1 || col === lastCol - 1) && (row === 1 || row === lastRow - 1);
  if (edgeX || edgeY || innerCorner) return COLORS.outline;
  return row === lastRow - 1 ? COLORS.shade : COLORS.fill;
}

/**
 * @param {Object} scene  cena Phaser (o SVG `id` já carregado)
 * @param {(name: string) => string} key  nome da imagem na cena
 * @param {{ id: string, width: number }} svg
 */
export function makeCard(scene, key, { id, width }) {
  const texture = scene.textures.createCanvas(key(`card:${id}`), COLS * CELL, ROWS * CELL);
  const context = texture.getContext();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const color = frameColor(col, row);
      if (!color) continue;
      context.fillStyle = color;
      context.fillRect(col * CELL, row * CELL, CELL, CELL);
    }
  }
  const picture = scene.textures.get(key(id)).getSourceImage();
  const x = (COLS * CELL - width) / 2;
  const y = ((ROWS - 1) * CELL - width) / 2; // centrado acima da faixa de sombra
  context.drawImage(picture, x, y, width, width);
  texture.refresh();
}
