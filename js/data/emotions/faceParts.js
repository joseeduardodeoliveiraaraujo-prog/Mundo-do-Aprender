/**
 * Peças do rosto para as atividades "Monte o rosto" (somente dados).
 *
 * Cada peça é um SVG cujo viewBox é a região dela no rosto de 200×200
 * (sobrancelhas, olhos ou boca). A mesma imagem serve de miniatura no
 * botão e de camada sobre a base do rosto (posição definida em css/emotions.css).
 *
 * Os nomes descrevem a forma (não a emoção), para a criança observar o
 * traço e decidir o que ele pode mostrar.
 */

const PARTS = 'assets/images/emotions/parts';

/** Regiões do rosto, na ordem em que aparecem na tela. */
export const faceSlots = Object.freeze([
  { id: 'brows', label: 'Sobrancelhas' },
  { id: 'eyes', label: 'Olhos' },
  { id: 'mouth', label: 'Boca' },
]);

export const faceParts = Object.freeze({
  brows: {
    raised: { label: 'Bem levantadas', image: `${PARTS}/brows-raised.svg` },
    lowered: { label: 'Baixas, apontando para o meio', image: `${PARTS}/brows-lowered.svg` },
    worried: { label: 'Levantadas no meio', image: `${PARTS}/brows-worried.svg` },
    relaxed: { label: 'Relaxadas', image: `${PARTS}/brows-relaxed.svg` },
  },
  eyes: {
    open: { label: 'Abertos', image: `${PARTS}/eyes-open.svg` },
    wide: { label: 'Bem abertos', image: `${PARTS}/eyes-wide.svg` },
    closed: { label: 'Fechados', image: `${PARTS}/eyes-closed.svg` },
  },
  mouth: {
    smile: { label: 'Sorriso grande', image: `${PARTS}/mouth-smile.svg` },
    soft: { label: 'Sorriso leve', image: `${PARTS}/mouth-soft.svg` },
    frown: { label: 'Curvada para baixo', image: `${PARTS}/mouth-frown.svg` },
    open: { label: 'Aberta em O', image: `${PARTS}/mouth-open.svg` },
    straight: { label: 'Reta', image: `${PARTS}/mouth-straight.svg` },
  },
});

/** Bases (cabeça e cabelo, sem sobrancelhas, olhos e boca). */
export const faceBases = Object.freeze({
  julia: { name: 'Júlia', image: `${PARTS}/base-julia.svg` },
  rafa: { name: 'Rafa', image: `${PARTS}/base-rafa.svg` },
});
