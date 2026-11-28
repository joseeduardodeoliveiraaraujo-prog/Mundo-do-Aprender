"""Objetos do bairro desenhados em código (paleta do Sprout Lands): barril, caixote, vaso,
poste de luz, caixa de correio, fardo de feno, canteiro da horta e ponte (inteira e quebrada).

Usado por build_atlas.py. Mesmas regras de tools/closeup/pixkit.py: contorno #6b4b5b por dentro,
luz em cima/esquerda, sombra embaixo/direita, 3 tons por material. Enfeites parados: nada pisca
nem se mexe (o poste fica sempre aceso, com luz suave, sem brilho piscando).

Prévia ampliada:  python tools/atlas/props.py <arquivo.png>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'closeup'))
from pixkit import Image, ImageDraw, shape, rect, rrect, ellipse, rgba, OUTLINE, WHITE, WOOD, METAL  # noqa: E402

T = 16
SHADOW = (80, 64, 134, 64)
HOOP = ((150, 156, 172), (120, 124, 146), (190, 196, 210))
CLAY = ((214, 128, 104), (184, 102, 88), (236, 162, 132))
LEAF = ((150, 196, 120), (110, 160, 100), (190, 220, 150))
LAMP_METAL = ((112, 104, 124), (88, 80, 104), (146, 138, 156))
LAMP_GLASS = ((252, 236, 176), (240, 214, 140), (255, 250, 226))
MAIL = ((122, 160, 204), (96, 128, 178), (160, 194, 226))
HAY = ((236, 204, 120), (212, 172, 92), (248, 228, 160))


def canvas(rows=1):
    return Image.new('RGBA', (T, rows * T))


def shadow(img, box):
    layer = Image.new('RGBA', img.size)
    ImageDraw.Draw(layer).ellipse(box, fill=SHADOW)
    img.alpha_composite(layer)


def barrel():
    img = canvas()
    shadow(img, (2, 12, 14, 15))
    shape(img, WOOD, rrect((3, 1, 12, 14), 3))
    d = ImageDraw.Draw(img)
    for x in (6, 9):                                                    # tábuas
        d.line([(x, 3), (x, 12)], fill=rgba(WOOD[1]))
    for y in (4, 10):                                                   # aros de metal
        d.line([(4, y), (11, y)], fill=rgba(HOOP[1]))
        d.point((5, y), fill=rgba(HOOP[2]))
    shape(img, (WOOD[2], WOOD[0], WOOD[2]), ellipse((4, 1, 11, 3)), outline=False)   # tampa
    return img


def crate():
    img = canvas()
    shadow(img, (1, 12, 15, 15))
    shape(img, WOOD, rect((2, 3, 13, 14)))
    d = ImageDraw.Draw(img)
    d.line([(3, 8), (12, 8)], fill=rgba(WOOD[1]))
    d.line([(3, 4), (12, 13)], fill=rgba(WOOD[1]))                      # travessa em diagonal
    d.line([(3, 5), (11, 13)], fill=rgba(WOOD[2]))
    return img


def pot():
    """Vaso de barro com planta (como o da porta da referência)."""
    img = canvas()
    shadow(img, (2, 12, 14, 15))
    shape(img, LEAF, ellipse((1, 2, 8, 9)), ellipse((7, 2, 14, 9)), ellipse((4, 0, 11, 7)))
    shape(img, CLAY, ellipse((3, 8, 12, 15)), rect((4, 7, 11, 9)))
    d = ImageDraw.Draw(img)
    d.line([(4, 9), (11, 9)], fill=rgba(CLAY[1]))
    d.point((5, 3), fill=(236, 164, 184, 255))
    d.point((10, 4), fill=(246, 214, 120, 255))
    d.point((8, 1), fill=(236, 164, 184, 255))
    return img


def lamp_post():
    """Poste de luz (1 × 2 blocos): só o pé bloqueia."""
    img = canvas(2)
    shadow(img, (3, 27, 13, 31))
    shape(img, LAMP_METAL, rect((7, 9, 8, 29)), rrect((5, 27, 10, 30), 1))
    shape(img, LAMP_METAL, rrect((3, 1, 12, 3), 1))                         # chapéu
    shape(img, LAMP_GLASS, rect((4, 3, 11, 9)))                             # vidro aceso
    d = ImageDraw.Draw(img)
    d.line([(7, 4), (7, 8)], fill=rgba(LAMP_METAL[0]))
    d.point((5, 4), fill=WHITE)
    return img


def mailbox():
    img = canvas()
    shadow(img, (3, 13, 12, 15))
    shape(img, WOOD, rect((7, 8, 9, 14)))
    shape(img, MAIL, rrect((3, 2, 12, 9), 3))
    d = ImageDraw.Draw(img)
    d.line([(5, 5), (8, 5)], fill=OUTLINE)                                  # abertura
    shape(img, ((214, 124, 120), (184, 98, 96), (236, 160, 150)), rect((12, 1, 14, 4)))   # bandeirinha
    shape(img, METAL, rect((13, 4, 13, 7)), outline=False)
    return img


def hay_bale():
    img = canvas()
    shadow(img, (1, 12, 15, 15))
    shape(img, HAY, rrect((1, 4, 14, 14), 2))
    d = ImageDraw.Draw(img)
    for y in (7, 10):                                                       # palha
        d.line([(3, y), (6, y)], fill=rgba(HAY[1]))
        d.line([(8, y + 1), (12, y + 1)], fill=rgba(HAY[1]))
    d.line([(5, 5), (5, 13)], fill=rgba((170, 121, 89)))                    # cordas
    d.line([(10, 5), (10, 13)], fill=rgba((170, 121, 89)))
    return img


SOIL = ((156, 112, 92), (130, 92, 78), (176, 132, 104))


def garden_bed():
    """Canteiro da horta (3 × 3 blocos, fica no chão, embaixo das plantas): moldura de madeira e terra arada."""
    img = Image.new('RGBA', (3 * T, 3 * T))
    shape(img, WOOD, rrect((0, 1, 47, 47), 2))
    shape(img, SOIL, rect((3, 4, 44, 44)), outline=False)
    d = ImageDraw.Draw(img)
    for y in range(8, 44, 5):                                           # sulcos
        d.line([(4, y), (43, y)], fill=rgba(SOIL[1]))
        d.line([(4, y - 1), (43, y - 1)], fill=rgba(SOIL[2]))
    for x in (16, 31):                                                  # tábuas da moldura
        d.point((x, 2), fill=rgba(WOOD[1]))
        d.point((x, 46), fill=rgba(WOOD[1]))
    return img


PLANK = ((206, 164, 116), (176, 132, 96), (226, 192, 146))


RIVER = ((163, 205, 216), (140, 184, 200), (196, 226, 234))


def bridge(broken=False):
    """Ponte de madeira (2 × 2 blocos, a largura da rua): tábuas de lado a lado, corrimão em cima e
    embaixo com postes nas pontas. Fica no chão (o Noa anda por cima); só cobre a água do rio.
    `broken`: faltam tábuas em três buracos (1, 2 e 3 tábuas), como na cena de perto da ponte."""
    img = Image.new('RGBA', (2 * T, 2 * T))
    shape(img, PLANK, rect((0, 3, 31, 28)))                              # tabuleiro
    d = ImageDraw.Draw(img)
    for x in range(4, 31, 4):                                            # tábuas
        d.line([(x, 4), (x, 27)], fill=rgba(PLANK[1]))
        d.point((x + 1, 5), fill=rgba(PLANK[2]))
    d.line([(1, 27), (30, 27)], fill=rgba(PLANK[1]))                     # borda de baixo na sombra
    if broken:                                                           # buracos: aparece a água
        for x0, x1 in ((5, 7), (12, 19), (24, 27)):
            shape(img, RIVER, rect((x0, 3, x1, 28)), outline=False)
            d.line([(x0 + 1, 12), (x0 + 2, 12)], fill=rgba(RIVER[2]))
    for y in (1, 26):                                                    # corrimãos
        shape(img, WOOD, rrect((1, y, 30, y + 3), 1))
    for x in (0, 27):                                                    # postes nas pontas
        shape(img, WOOD, rrect((x, 0, x + 4, 6), 1), rrect((x, 25, x + 4, 31), 1))
        d.point((x + 1, 1), fill=rgba(WOOD[2]))
    return img


PIECES = {'barrel': barrel, 'crate': crate, 'pot': pot, 'lampPost': lamp_post, 'mailbox': mailbox, 'hayBale': hay_bale,
          'gardenBed': garden_bed, 'bridge': bridge,
          'bridgeBroken': lambda: bridge(broken=True)}


def draw_props():
    return {name: fn() for name, fn in PIECES.items()}


if __name__ == '__main__':
    art = draw_props()
    sheet = Image.new('RGBA', (len(art) * 22 + 40, 56), (192, 212, 112, 255))
    for i, im in enumerate(art.values()):
        sheet.alpha_composite(im, (6 + i * 22, 52 - im.height))
    sheet.resize((sheet.width * 6, sheet.height * 6), Image.NEAREST).save(sys.argv[1])
    print('ok', list(art))
