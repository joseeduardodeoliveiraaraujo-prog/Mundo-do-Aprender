"""Móveis dos interiores desenhados em código (paleta do Sprout Lands): estante, bancada, fogão,
vaso sanitário, banheira, prateleira de parede, aquário, poltrona, carteira escolar, mesa da
professora e cartaz do ABC.

Usado por build_atlas.py. Mesmas regras de tools/closeup/pixkit.py: contorno #6b4b5b por dentro,
luz em cima/esquerda, sombra embaixo/direita, 3 tons por material. Peças "de parede"
(prateleira, cartaz) são usadas com solid: 'none' na linha da parede.

Prévia ampliada:  python tools/atlas/furniture.py <arquivo.png>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'closeup'))
from pixkit import (Image, ImageDraw, shape, rect, rrect, ellipse, rgba, OUTLINE, WHITE,  # noqa: E402
                    WOOD, WOOD_LIGHT, METAL, WATER)

T = 16
PORCELAIN = ((243, 240, 244), (212, 208, 222), (255, 255, 255))
BOOKS = ((214, 124, 120, 255), (122, 160, 204, 255), (246, 214, 120, 255), (134, 180, 146, 255), (200, 160, 210, 255))
COUNTER = ((226, 232, 236), (196, 204, 214), (246, 248, 250))
CABINET = ((170, 206, 196), (138, 178, 172), (200, 228, 218))
DARK = (112, 104, 124, 255)
GLASS = ((176, 212, 222), (140, 184, 200), (226, 242, 246))
CHAIR = ((232, 176, 160), (204, 140, 130), (246, 206, 190))
PAPER = ((250, 246, 236), (226, 218, 204), WHITE[:3])


def canvas(cols=1, rows=1):
    img = Image.new('RGBA', (cols * T, rows * T))
    return img, ImageDraw.Draw(img)


def books(d, x0, x1, y, height=5, seed=0):
    """Fileira de livros em pé (cores alternadas, alturas um pouco diferentes)."""
    for i, x in enumerate(range(x0, x1, 2)):
        top = y - height + (i + seed) % 2
        d.rectangle((x, top, x, y), fill=BOOKS[(i + seed) % len(BOOKS)])


def bookshelf():
    img, d = canvas(1, 2)
    shape(img, WOOD, rect((1, 2, 14, 31)))
    shape(img, (WOOD[1], WOOD[1], WOOD[0]), rect((3, 4, 12, 28)), outline=False)   # fundo
    for y in (11, 19, 27):                                                       # prateleiras
        d.line([(3, y), (12, y)], fill=rgba(WOOD[2]))
    books(d, 3, 13, 10, seed=0)
    books(d, 3, 9, 18, seed=2)
    d.rectangle((10, 16, 12, 18), fill=rgba((214, 150, 120)))                    # vasinho
    d.point((11, 15), fill=rgba((150, 196, 120)))
    books(d, 5, 13, 26, seed=4)
    return img


def kitchen_counter():
    img, d = canvas()
    shape(img, CABINET, rect((0, 5, 15, 15)))
    shape(img, COUNTER, rect((0, 2, 15, 6)))                                     # tampo
    d.line([(7, 7), (7, 14)], fill=OUTLINE)
    d.point((5, 10), fill=OUTLINE)
    d.point((9, 10), fill=OUTLINE)                                               # puxadores
    shape(img, ((214, 150, 120), (190, 124, 100), (232, 180, 150)), rrect((10, 0, 13, 4), 1))   # pote
    return img


def stove():
    img, d = canvas()
    shape(img, PORCELAIN, rect((0, 2, 15, 15)))
    for x, y in ((3, 4), (9, 4)):                                                # bocas
        shape(img, ((150, 146, 162), (120, 116, 134), (176, 172, 186)), ellipse((x, y, x + 3, y + 2)))
    shape(img, GLASS, rect((3, 9, 12, 13)))                                      # porta do forno
    d.line([(4, 8), (11, 8)], fill=DARK)
    return img


def toilet():
    img, d = canvas()
    shape(img, PORCELAIN, rrect((3, 0, 12, 5), 1))                               # caixa
    shape(img, PORCELAIN, ellipse((2, 4, 13, 14)))                               # assento
    shape(img, (WATER[:3], (140, 184, 200), (206, 232, 238)), ellipse((5, 7, 10, 11)), outline=False)
    d.point((10, 2), fill=rgba(METAL[1]))
    return img


def bathtub():
    img, d = canvas(2, 1)
    shape(img, PORCELAIN, rrect((0, 1, 31, 15), 3))
    shape(img, (WATER[:3], (140, 184, 200), (206, 232, 238)), rrect((3, 4, 28, 12), 2), outline=False)
    for x, y in ((8, 6), (18, 8), (24, 6)):                                      # espuma
        d.point((x, y), fill=WHITE)
        d.point((x + 1, y), fill=WHITE)
    shape(img, METAL, rect((27, 0, 29, 3)))                                      # torneira
    return img


def wall_shelf():
    """Prateleira de parede com livros e uma plantinha (vai na linha da parede)."""
    img, d = canvas()
    shape(img, WOOD, rect((1, 10, 14, 12)))
    books(d, 2, 9, 9, height=4, seed=1)
    shape(img, ((214, 150, 120), (190, 124, 100), (232, 180, 150)), rect((10, 7, 13, 9)), outline=False)
    shape(img, ((150, 196, 120), (110, 160, 100), (190, 220, 150)), ellipse((9, 3, 14, 8)))
    return img


def aquarium():
    img, d = canvas()
    shape(img, WOOD, rect((1, 11, 14, 15)))                                      # móvel
    shape(img, GLASS, rect((1, 1, 14, 11)))
    shape(img, ((150, 196, 210), (120, 170, 190), (196, 226, 234)), rect((3, 4, 12, 10)), outline=False)
    d.line([(5, 10), (5, 6)], fill=rgba((110, 160, 100)))                         # planta
    d.line([(11, 10), (10, 7)], fill=rgba((110, 160, 100)))
    d.rectangle((7, 6, 8, 7), fill=rgba((240, 164, 88)))                         # peixinho
    d.point((9, 6), fill=rgba((240, 164, 88)))
    d.point((4, 3), fill=WHITE)
    return img


def armchair():
    img, _ = canvas()
    shape(img, CHAIR, rrect((2, 1, 13, 10), 2), rect((2, 8, 13, 13)))
    shape(img, CHAIR, rrect((0, 5, 3, 14), 1), rrect((12, 5, 15, 14), 1))
    return img


def school_desk():
    """Carteira com caderno e lápis (a cadeira fica embaixo, com chairBack)."""
    img, d = canvas()
    shape(img, WOOD_LIGHT, rect((1, 3, 14, 10)))
    d.line([(3, 11), (3, 15)], fill=OUTLINE)
    d.line([(12, 11), (12, 15)], fill=OUTLINE)
    shape(img, PAPER, rect((3, 4, 8, 8)), outline=False)                          # caderno
    d.line([(4, 6), (7, 6)], fill=rgba(PAPER[1]))
    d.line([(10, 8), (12, 5)], fill=rgba((246, 214, 120)))                       # lápis
    return img


def teacher_desk():
    img, d = canvas(2, 1)
    shape(img, WOOD, rect((0, 4, 31, 15)))
    d.line([(15, 8), (15, 14)], fill=rgba(WOOD[1]))
    books(d, 3, 9, 5, height=4)
    shape(img, ((214, 104, 98), (182, 82, 84), (236, 146, 132)), ellipse((22, 0, 27, 5)))   # maçã
    d.point((24, 0), fill=rgba((110, 160, 100)))
    shape(img, ((122, 170, 210), (96, 140, 186), (170, 206, 232)), ellipse((12, 0, 18, 6)))  # globo
    d.point((14, 2), fill=rgba((150, 196, 120)))
    return img


GLYPHS = {'A': ('010', '101', '111', '101', '101'), 'B': ('110', '101', '110', '101', '110'),
          'C': ('011', '100', '100', '100', '011')}


def poster_abc():
    """Cartaz do ABC (vai na linha da parede)."""
    img, d = canvas()
    shape(img, PAPER, rect((1, 2, 14, 12)))
    for i, (letter, color) in enumerate(zip('ABC', BOOKS)):
        for row, bits in enumerate(GLYPHS[letter]):
            for col, bit in enumerate(bits):
                if bit == '1':
                    d.point((3 + i * 4 + col, 5 + row), fill=color)
    return img


PIECES = {'bookshelf': bookshelf, 'kitchenCounter': kitchen_counter, 'stove': stove, 'toilet': toilet,
          'bathtub': bathtub, 'wallShelf': wall_shelf, 'aquarium': aquarium, 'armchair': armchair,
          'schoolDesk': school_desk, 'teacherDesk': teacher_desk, 'posterAbc': poster_abc}


def draw_furniture():
    return {name: fn() for name, fn in PIECES.items()}


if __name__ == '__main__':
    art = draw_furniture()
    sheet = Image.new('RGBA', (sum(im.width + 6 for im in art.values()) + 6, 40), (226, 192, 146, 255))
    x = 6
    for im in art.values():
        sheet.alpha_composite(im, (x, 36 - im.height))
        x += im.width + 6
    sheet.resize((sheet.width * 5, sheet.height * 5), Image.NEAREST).save(sys.argv[1])
    print('ok', len(art), 'peças')
