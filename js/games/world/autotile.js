/**
 * Encaixe automático de peças: escolhe a imagem de cada bloco olhando os
 * vizinhos (cima, baixo, esquerda, direita). Funções puras, sem Phaser.
 *
 * Nomes das peças: js/data/world/atlas.js (ex.: grass9TL, dirtHMid, fence21).
 */

/** Peça de terreno (grama, terra) conforme os vizinhos que também são desse terreno. */
export function terrainPiece(terrain, { up, down, left, right }) {
  const vertical = up || down;
  const horizontal = left || right;
  if (!vertical && !horizontal) return `${terrain}Dot`;
  if (!horizontal) return `${terrain}V${up && down ? 'Mid' : up ? 'Bottom' : 'Top'}`;
  if (!vertical) return `${terrain}H${left && right ? 'Mid' : left ? 'Right' : 'Left'}`;
  const row = !up ? 'T' : !down ? 'B' : '';
  const col = !left ? 'L' : !right ? 'R' : '';
  return `${terrain}9${row + col || 'C'}`;
}

/** Parede de cômodo pela posição na borda do mapa (9 pedaços: room9TL … room9BR). */
export function roomPiece(x, y, cols, rows) {
  const row = y === 0 ? 'T' : y === rows - 1 ? 'B' : '';
  const col = x === 0 ? 'L' : x === cols - 1 ? 'R' : '';
  return `room9${row + col || 'C'}`;
}

/** Cerca: coluna pelas ligações laterais, linha pelas ligações de cima/baixo (fence<col><row>). */
export function fencePiece({ up, down, left, right }) {
  const col = left && right ? 2 : right ? 1 : left ? 3 : 0;
  const row = up && down ? 1 : down ? 0 : up ? 2 : 3;
  return `fence${col}${row}`;
}

/** Número estável de 0 a n-1 para um bloco (variação de chão sem sorteio a cada visita). */
export function variantOf(x, y, n) {
  const hash = Math.imul(x * 73856093 ^ y * 19349663, 2654435761) >>> 0;
  return hash % n;
}
