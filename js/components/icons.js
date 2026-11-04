/**
 * icons.js — ícones de interface em SVG embutido.
 *
 * Desenhados com `currentColor`, herdam a cor do texto (funcionam em botões
 * claros, escuros e no alto contraste). Para ilustrações e ícones de módulo
 * use arquivos em assets/.
 *
 * Uso no HTML estático: <span data-icon="help"></span> + hydrateIcons().
 * Uso no JS: createIcon('arrowRight').
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Formas de cada ícone (grade 24×24, traço). */
const ICON_SHAPES = Object.freeze({
  arrowLeft: [['path', { d: 'M19 12H5' }], ['path', { d: 'M12 19l-7-7 7-7' }]],
  arrowRight: [['path', { d: 'M5 12h14' }], ['path', { d: 'M12 5l7 7-7 7' }]],
  check: [['path', { d: 'M20 6L9 17l-5-5' }]],
  help: [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    ['path', { d: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3' }],
    ['path', { d: 'M12 17h.01' }],
  ],
  info: [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    ['path', { d: 'M12 16v-4' }],
    ['path', { d: 'M12 8h.01' }],
  ],
  settings: [
    ['path', { d: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3' }],
    ['path', { d: 'M1 14h6M9 8h6M17 16h6' }],
  ],
  star: [['polygon', { points: '12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2' }]],
  heart: [['path', { d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z' }]],
  speaker: [
    ['path', { d: 'M11 5L6 9H2v6h4l5 4V5z' }],
    ['path', { d: 'M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14' }],
  ],
  restart: [['path', { d: 'M3 4v6h6' }], ['path', { d: 'M3.5 15a9 9 0 1 0 2.1-9.4L3 10' }]],
  chat: [['path', { d: 'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z' }]],
  hand: [
    ['path', { d: 'M7 13V6.5a1.5 1.5 0 0 1 3 0V11M10 10.5V4.5a1.5 1.5 0 0 1 3 0V11M13 11V6a1.5 1.5 0 0 1 3 0v6' }],
    ['path', { d: 'M16 11.5a1.5 1.5 0 0 1 3 0v3a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.6-2.2L4 15.6a1.5 1.5 0 0 1 2.3-1.9L7 14.5' }],
  ],
  quiet: [['path', { d: 'M11 5L6 9H2v6h4l5 4V5z' }], ['path', { d: 'M22 9l-6 6M16 9l6 6' }]],
  pause: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M10 15V9M14 15V9' }]],
  arrowUp: [['path', { d: 'M12 19V5' }], ['path', { d: 'M5 12l7-7 7 7' }]],
  arrowDown: [['path', { d: 'M12 5v14' }], ['path', { d: 'M19 12l-7 7-7-7' }]],
  undo: [['path', { d: 'M9 14L4 9l5-5' }], ['path', { d: 'M4 9h11a5 5 0 0 1 0 10h-3' }]],
  grip: [
    ['circle', { cx: 9, cy: 6, r: 1 }], ['circle', { cx: 15, cy: 6, r: 1 }],
    ['circle', { cx: 9, cy: 12, r: 1 }], ['circle', { cx: 15, cy: 12, r: 1 }],
    ['circle', { cx: 9, cy: 18, r: 1 }], ['circle', { cx: 15, cy: 18, r: 1 }],
  ],
});

/**
 * Cria um ícone decorativo (aria-hidden). O significado deve vir do texto ao lado.
 * @param {keyof typeof ICON_SHAPES} name
 * @returns {SVGSVGElement}
 */
export function createIcon(name) {
  const shapes = ICON_SHAPES[name];
  if (!shapes) throw new Error(`[icons] Ícone desconhecido: "${name}"`);

  const svg = document.createElementNS(SVG_NS, 'svg');
  const attributes = {
    class: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    focusable: 'false',
  };
  Object.entries(attributes).forEach(([key, value]) => svg.setAttribute(key, String(value)));

  shapes.forEach(([tag, shapeAttributes]) => {
    const shape = document.createElementNS(SVG_NS, tag);
    Object.entries(shapeAttributes).forEach(([key, value]) => shape.setAttribute(key, String(value)));
    svg.append(shape);
  });

  return svg;
}

/** Substitui cada <span data-icon="nome"> dentro de `root` pelo ícone correspondente. */
export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((slot) => {
    slot.replaceWith(createIcon(slot.dataset.icon));
  });
}
