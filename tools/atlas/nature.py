"""Natureza do bairro desenhada em código (paleta do Sprout Lands): árvores grandes, pedras do
caminho, canteiros de flores, tufos de grama e pedrinhas.

Usado por build_atlas.py. Árvores seguem as regras de tools/closeup/pixkit.py (contorno #6b4b5b
por dentro, luz em cima/esquerda, sombra embaixo/direita). O chão (pedras, flores, tufos) usa
contorno suave, sem o roxo, para continuar calmo: o chão nunca compete com pessoas e objetos.

Prévia ampliada:  python tools/atlas/nature.py <arquivo.png>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'closeup'))
from pixkit import Image, ImageDraw, mask_of, paint, rect, rrect, ellipse, rgba, WOOD  # noqa: E402

T = 16
CANOPY = ((140, 190, 122), (104, 156, 108), (182, 216, 152))
PINE = ((112, 168, 128), (86, 136, 112), (150, 198, 156))
TRUNK = ((170, 121, 89), (138, 96, 76), WOOD[0])
FRUIT = (232, 128, 134, 255)
SHADOW = (80, 64, 134, 64)
STONES = (((226, 216, 194), (206, 194, 172), (240, 234, 218)),
          ((210, 214, 210), (188, 194, 194), (228, 232, 230)))
STONE_EDGE = (178, 166, 150, 255)
GRASS_DARK = ((128, 170, 96, 255), (150, 190, 108, 255), (190, 214, 140, 255))
PETALS = {'pink': (236, 164, 184, 255), 'yellow': (246, 214, 120, 255), 'blue': (156, 180, 226, 255),
          'white': (250, 246, 238, 255)}


def cells_of(size, *parts):
    cells = set()
    for part in parts:
        cells |= mask_of(*size, part)
    return cells


def inner(cells):
    return {(x, y) for x, y in cells if all((x + dx, y + dy) in cells for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}


def soft_paint(img, cells, colors):
    """Como pixkit.paint, mas com contorno suave (chão)."""
    fill, shade, light = (rgba(c) for c in colors)
    for x, y in cells:
        out = lambda dx, dy: (x + dx, y + dy) not in cells
        color = STONE_EDGE if out(1, 0) or out(-1, 0) or out(0, 1) or out(0, -1) else (
            shade if out(1, 1) or out(0, 2) else light if out(-1, -1) else fill)
        img.putpixel((x, y), color)


def volume(img, cells, colors, shift=(4, 5)):
    """Volume da copa: perto da borda de baixo/direita fica na sombra; perto da borda de cima/esquerda, na luz."""
    _, shade, light = (rgba(c) for c in colors)
    sx, sy = shift
    for x, y in inner(cells):
        if (x + sx, y + sy) not in cells:
            img.putpixel((x, y), shade)
        elif (x - 2, y - 2) not in cells:
            img.putpixel((x, y), light)


def clumps(img, cells, centers, colors, r=4):
    """Tufos de folhas: o arco de baixo de cada tufo, escuro (como escamas)."""
    import math
    shade = rgba(colors[1])
    ok = inner(cells)
    for cx, cy in centers:
        for step in range(0, 9):
            angle = math.radians(20 + step * 17.5)
            x, y = round(cx + r * math.cos(angle)), round(cy + r * 0.7 * math.sin(angle))
            if (x, y) in ok:
                img.putpixel((x, y), shade)


def ground_shadow(img, box):
    layer = Image.new('RGBA', img.size)
    ImageDraw.Draw(layer).ellipse(box, fill=SHADOW)
    img.alpha_composite(layer)


def tree_oak(fruit=False):
    """Árvore grande e redonda (3 × 3 blocos); o tronco fica no bloco do meio de baixo."""
    img = Image.new('RGBA', (3 * T, 3 * T))
    ground_shadow(img, (7, 40, 41, 47))
    paint(img, cells_of(img.size, rect((21, 30, 26, 44)), rect((19, 42, 28, 45))), TRUNK)       # tronco e raízes
    canopy = cells_of(img.size, ellipse((2, 12, 24, 34)), ellipse((22, 10, 45, 34)), ellipse((9, 1, 39, 26)), ellipse((12, 18, 36, 37)))
    paint(img, canopy, CANOPY)
    volume(img, canopy, CANOPY)
    clumps(img, canopy, ((16, 9), (28, 7), (35, 16), (9, 21), (23, 17), (38, 26), (17, 29), (29, 28)), CANOPY)
    if fruit:
        for x, y in ((12, 14), (25, 11), (35, 20), (19, 24), (30, 30), (9, 27)):
            img.putpixel((x, y), FRUIT)
            img.putpixel((x + 1, y), FRUIT)
            img.putpixel((x, y - 1), (250, 200, 200, 255))
    return img


def tree_pine():
    """Pinheiro (2 × 3 blocos): três andares de galhos."""
    img = Image.new('RGBA', (2 * T, 3 * T))
    ground_shadow(img, (6, 41, 26, 47))
    paint(img, cells_of(img.size, rect((14, 36, 18, 45))), TRUNK)
    tiers = [((16, 1), 7, 14), ((16, 10), 11, 26), ((16, 20), 14, 38)]
    canopy = cells_of(img.size, *[lambda d, t=t: d.polygon([(t[0][0], t[0][1]), (t[0][0] - t[1], t[2]), (t[0][0] + t[1], t[2])], fill=1) for t in tiers])
    paint(img, canopy, PINE)
    d = ImageDraw.Draw(img)
    for (cx, top), half, bottom in tiers[1:]:   # beirada de cada andar
        d.line([(cx - half + 3, bottom - 1), (cx + half - 3, bottom - 1)], fill=rgba(PINE[1]))
    return img


STONE_LAYOUTS = (
    ((1, 1, 14, 14),),
    ((1, 1, 14, 14),),
    ((1, 1, 14, 6), (1, 8, 14, 14)),
)


def path_stone(index):
    """Lajota do caminho: uma pedra grande por bloco (calma, sem padrão miúdo); a grama aparece nas juntas."""
    img = Image.new('RGBA', (T, T))
    for box in STONE_LAYOUTS[index]:
        soft_paint(img, cells_of(img.size, rrect(box, 2)), STONES[index % 2])
    if index == 1:   # uma rachadura pequena para variar
        d = ImageDraw.Draw(img)
        d.line([(9, 4), (10, 6), (10, 7)], fill=rgba(STONES[1][1]))
    return img


def flower_patch(colors):
    """Canteiro: flores pequenas em grupo, com folhas."""
    img = Image.new('RGBA', (T, T))
    d = ImageDraw.Draw(img)
    for x, y in ((3, 12), (7, 13), (11, 12), (5, 9), (10, 8), (13, 10)):
        d.line([(x, y), (x + 1, y - 1)], fill=GRASS_DARK[0])
    for i, (x, y) in enumerate(((4, 5), (9, 3), (12, 7), (3, 10), (8, 9), (13, 12))):
        petal = PETALS[colors[i % len(colors)]]
        for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1)):
            d.point((x + dx, y + dy), fill=petal)
        d.point((x, y), fill=(246, 200, 96, 255) if colors[i % len(colors)] != 'yellow' else (214, 150, 90, 255))
        d.point((x + 1, y + 1), fill=STONE_EDGE)
    return img


def tuft(index):
    """Tufo de grama alta (sem contorno)."""
    img = Image.new('RGBA', (T, T))
    d = ImageDraw.Draw(img)
    blades = (((4, 14, 3, 9), (6, 14, 7, 7), (8, 14, 9, 10), (10, 14, 12, 9)),
              ((5, 14, 4, 10), (7, 14, 8, 8), (9, 14, 11, 11)))[index]
    for x0, y0, x1, y1 in blades:
        d.line([(x0, y0), (x1, y1)], fill=GRASS_DARK[0])
        d.point((x1, y1), fill=GRASS_DARK[2])
    return img


def pebbles():
    img = Image.new('RGBA', (T, T))
    for i, box in enumerate(((3, 9, 7, 12), (9, 10, 13, 13), (7, 4, 10, 7))):
        soft_paint(img, cells_of(img.size, rrect(box, 1)), STONES[1 - i % 2])
    return img


PIECES = {
    'treeOak': tree_oak, 'treeOakFruit': lambda: tree_oak(fruit=True), 'treePine': tree_pine,
    'pathStone0': lambda: path_stone(0), 'pathStone1': lambda: path_stone(1), 'pathStone2': lambda: path_stone(2),
    'flowerPatchPink': lambda: flower_patch(['pink', 'white']), 'flowerPatchYellow': lambda: flower_patch(['yellow', 'white']),
    'flowerPatchBlue': lambda: flower_patch(['blue', 'white']), 'flowerPatchMix': lambda: flower_patch(['pink', 'yellow', 'blue']),
    'grassTuft0': lambda: tuft(0), 'grassTuft1': lambda: tuft(1), 'pebbles': pebbles,
}


def draw_nature():
    return {name: fn() for name, fn in PIECES.items()}


if __name__ == '__main__':
    art = draw_nature()
    sheet = Image.new('RGBA', (sum(im.width + 6 for im in art.values()) + 6, 60), (192, 212, 128, 255))
    x = 6
    for im in art.values():
        sheet.alpha_composite(im, (x, 54 - im.height))
        x += im.width + 6
    sheet.resize((sheet.width * 4, sheet.height * 4), Image.NEAREST).save(sys.argv[1])
    print('ok', len(art), 'peças')
