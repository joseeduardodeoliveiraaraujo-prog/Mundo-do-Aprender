"""Prédios do bairro vistos de fora, cada um desenhado inteiro (paleta do Sprout Lands).

Usado por build_atlas.py. Cada imagem tem a largura da casa no mapa (w × 16 px) e a base
alinhada embaixo da casa; a parte de cima (chaminé, sino) pode passar do espaço da casa.
A porta fica no centro da coluna `door` da última linha, a mesma de tools/maps/maps_design.py:
mudar a porta lá exige mudar aqui. Mesmas regras de tools/closeup/pixkit.py (contorno
#6b4b5b por dentro, luz em cima/esquerda, sombra embaixo/direita, 3 tons por material).

Prévia ampliada:  python tools/atlas/buildings.py <arquivo.png>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'closeup'))
from pixkit import Image, ImageDraw, shape, rect, rrect, ellipse, rgba, OUTLINE, WHITE, WOOD  # noqa: E402

T = 16
PLASTER = ((240, 226, 196), (222, 202, 168), (250, 242, 222))
BRICK = ((196, 132, 112), (168, 108, 96), (220, 160, 136))
GLASS = ((176, 212, 222), (140, 184, 200), (226, 242, 246))
STONE = ((196, 196, 200), (164, 162, 172), (222, 222, 226))
FLOWERS = ((232, 160, 180, 255), (246, 214, 120, 255))
LEAF = ((150, 196, 120), (110, 160, 100), (190, 220, 150))
ROOFS = {
    'blue': ((122, 160, 204), (96, 128, 178), (160, 194, 226)),
    'red': ((204, 120, 98), (174, 94, 82), (228, 156, 128)),
    'green': ((134, 180, 146), (104, 148, 122), (172, 210, 172)),
}
DOORS = {'red': ((196, 98, 92), (164, 74, 76), (222, 134, 120)), 'wood': WOOD}


def inner(cells):
    """Blocos de dentro da forma (sem o contorno)."""
    return {(x, y) for x, y in cells if all((x + dx, y + dy) in cells for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}


def shingles(img, cells, colors, row=4):
    """Telhas: fileiras de `row` px com a borda de baixo escura e cortes alternados."""
    _, shade, light = (rgba(c) for c in colors)
    for x, y in inner(cells):
        top = min(yy for xx, yy in cells if xx == x)
        k = (y - top) % row
        band = (y - top) // row
        if k == row - 1 or (x + band * 3) % 6 == 0 and k > 0:
            img.putpixel((x, y), shade)
        elif k == 0 and (x + band) % 5 == 0:
            img.putpixel((x, y), light)


def roof(img, box, colors):
    x0, y0, x1, y1 = box
    cells = shape(img, colors, rrect(box, 2))
    shingles(img, cells, colors)
    d = ImageDraw.Draw(img)
    d.line([(x0 + 2, y0 + 1), (x1 - 2, y0 + 1)], fill=rgba(colors[2]))          # cumeeira com luz
    d.line([(x0 + 2, y0 + 2), (x1 - 2, y0 + 2)], fill=rgba(colors[2]))
    shape(img, (colors[1], colors[1], colors[0]), rect((x0, y1 - 3, x1, y1)))   # beiral com espessura
    return cells


def moss(img, spots):
    """Tufinhos de musgo no telhado (3 tons de verde, sem contorno)."""
    d = ImageDraw.Draw(img)
    for x, y in spots:
        for dx, dy, tone in ((0, 0, 0), (1, 0, 0), (2, 0, 1), (1, -1, 2), (0, 1, 1), (1, 1, 1)):
            d.point((x + dx, y + dy), fill=rgba(LEAF[tone]))


def wall(img, box, beams=True):
    x0, y0, x1, y1 = box
    shape(img, PLASTER, rect(box))
    d = ImageDraw.Draw(img)
    d.line([(x0 + 1, y0 + 1), (x1 - 1, y0 + 1)], fill=rgba(PLASTER[1]))   # sombra do beiral
    d.line([(x0 + 1, y0 + 2), (x1 - 1, y0 + 2)], fill=rgba(PLASTER[1]))
    if beams:  # vigas de madeira nos cantos
        shape(img, WOOD, rect((x0, y0, x0 + 2, y1)), rect((x1 - 2, y0, x1, y1)))
    shape(img, STONE, rect((x0, y1 - 2, x1, y1)))                               # base de pedra


def door(img, cx, bottom, colors, width=10, height=17):
    x0 = cx - width // 2
    shape(img, WOOD, rrect((x0 - 1, bottom - height - 1, x0 + width, bottom), 5))   # batente em arco
    cells = shape(img, colors, rrect((x0 + 1, bottom - height + 1, x0 + width - 2, bottom), 4))
    d = ImageDraw.Draw(img)
    for x in range(x0 + 3, x0 + width - 3, 2):                                     # tábuas
        d.line([(x, bottom - height + 4), (x, bottom - 1)], fill=rgba(colors[1]))
    d.point((x0 + width - 4, bottom - height // 2 + 1), fill=rgba((246, 214, 120)))   # maçaneta
    return cells


def window(img, x, y, w=10, h=9, flowers=True):
    shape(img, WOOD, rect((x, y, x + w - 1, y + h - 1)))
    shape(img, GLASS, rect((x + 2, y + 2, x + w - 3, y + h - 3)), outline=False)
    d = ImageDraw.Draw(img)
    d.line([(x + w // 2, y + 2), (x + w // 2, y + h - 3)], fill=rgba(WOOD[1]))
    d.line([(x + 2, y + h // 2), (x + w - 3, y + h // 2)], fill=rgba(WOOD[1]))
    d.point((x + 3, y + 3), fill=WHITE)
    if flowers:  # floreira embaixo da janela
        shape(img, WOOD, rect((x - 1, y + h, x + w, y + h + 2)))
        for i, px in enumerate(range(x, x + w, 2)):
            d.point((px, y + h - 1), fill=FLOWERS[i % 2])
            d.point((px + 1, y + h - 1), fill=rgba(LEAF[1]))


def round_window(img, cx, cy, r=4):
    shape(img, WOOD, ellipse((cx - r, cy - r, cx + r, cy + r)))
    shape(img, GLASS, ellipse((cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2)), outline=False)
    ImageDraw.Draw(img).line([(cx - r + 2, cy), (cx + r - 2, cy)], fill=rgba(WOOD[1]))


def chimney(img, x, top, bottom):
    shape(img, BRICK, rect((x, top, x + 6, bottom)))
    d = ImageDraw.Draw(img)
    for y in range(top + 3, bottom, 3):
        d.line([(x + 1, y), (x + 5, y)], fill=rgba(BRICK[1]))
    shape(img, STONE, rect((x - 1, top, x + 7, top + 2)))


def pot(img, x, bottom):
    shape(img, ((214, 150, 120), (190, 124, 100), (232, 180, 150)), rrect((x, bottom - 5, x + 6, bottom), 1))
    shape(img, LEAF, ellipse((x - 1, bottom - 11, x + 7, bottom - 4)))
    ImageDraw.Draw(img).point((x + 3, bottom - 9), fill=FLOWERS[0])


def canvas(cols, rows, extra=0):
    return Image.new('RGBA', (cols * T, rows * T + extra)), extra


def house_noa():
    """Casa do Noa (5 × 4, porta na coluna 2): telhado azul, frontão com janela redonda, porta em arco."""
    img, top = canvas(5, 4, 8)
    b = img.height - 1
    chimney(img, 60, 0, 22)
    roof(img, (0, top + 4, 79, top + 34), ROOFS['blue'])
    moss(img, ((10, top + 13), (62, top + 22), (16, top + 25)))
    wall(img, (3, top + 32, 76, b))
    gable = shape(img, ROOFS['blue'], lambda d: d.polygon([(22, top + 33), (40, top + 6), (57, top + 33)], fill=1))
    shingles(img, gable, ROOFS['blue'])
    shape(img, PLASTER, lambda d: d.polygon([(28, top + 33), (40, top + 15), (51, top + 33)], fill=1))
    round_window(img, 40, top + 26)
    door(img, 40, b - 1, DOORS['red'])
    window(img, 9, top + 40)
    window(img, 61, top + 40)
    pot(img, 50, b - 2)
    return img


def house_neighbor():
    """Casa da vizinha (4 × 4, porta na coluna 1): telhado vermelho, toldo listrado e lenha."""
    img, top = canvas(4, 4, 6)
    b = img.height - 1
    chimney(img, 8, 0, 18)
    roof(img, (0, top + 4, 63, top + 34), ROOFS['red'])
    moss(img, ((42, top + 12), (12, top + 22), (52, top + 26)))
    wall(img, (3, top + 32, 60, b))
    door(img, 24, b - 1, DOORS['wood'])
    window(img, 39, top + 37, flowers=False)
    d = ImageDraw.Draw(img)   # toldo listrado em cima da janela
    awning = shape(img, ((248, 240, 230), (226, 214, 204), (255, 252, 246)), rect((36, top + 33, 61, top + 38)))
    for x, y in awning:
        if (x // 3) % 2 and (x, y) in inner(awning):
            d.point((x, y), fill=rgba((214, 124, 120)))
    for i, y in enumerate(range(b - 9, b - 1, 3)):   # lenha empilhada
        for x in range(40 + (i % 2) * 2, 58, 5):
            shape(img, WOOD, ellipse((x, y, x + 4, y + 3)))
            d.point((x + 2, y + 1), fill=rgba(WOOD[2]))
    return img


def school():
    """Escola (6 × 5, porta na coluna 3): telhado verde, torre com sino, porta dupla e placa."""
    img, top = canvas(6, 5, 14)
    b = img.height - 1
    shape(img, PLASTER, rect((40, 2, 55, top + 14)))                     # torre do sino
    shape(img, ROOFS['green'], rrect((37, 0, 58, 5), 2))
    shape(img, ((246, 214, 120), (214, 168, 90), (250, 236, 170)), ellipse((44, 6, 51, 13)))
    roof(img, (0, top + 6, 95, top + 44), ROOFS['green'])
    moss(img, ((14, top + 16), (78, top + 30), (30, top + 34)))
    wall(img, (3, top + 42, 92, b))
    shape(img, WOOD, rect((42, top + 44, 69, top + 51)))                 # placa com livro
    shape(img, ((248, 244, 236), (222, 214, 204), WHITE[:3]), rect((50, top + 45, 61, top + 50)), outline=False)
    ImageDraw.Draw(img).line([(55, top + 45), (55, top + 50)], fill=OUTLINE)
    door(img, 56, b - 1, DOORS['wood'], width=16, height=19)
    ImageDraw.Draw(img).line([(56, b - 17), (56, b - 1)], fill=OUTLINE)
    for x in (8, 22, 70, 82):
        window(img, x, top + 50)
    return img


BUILDINGS = {'houseNoa': house_noa, 'houseNeighbor': house_neighbor, 'school': school}


def draw_buildings():
    return {name: fn() for name, fn in BUILDINGS.items()}


if __name__ == '__main__':
    art = draw_buildings()
    sheet = Image.new('RGBA', (sum(im.width + 8 for im in art.values()) + 8, 110), (190, 214, 140, 255))
    x = 8
    for im in art.values():
        sheet.alpha_composite(im, (x, 100 - im.height))
        x += im.width + 8
    sheet.resize((sheet.width * 5, sheet.height * 5), Image.NEAREST).save(sys.argv[1])
    print('ok', {n: im.size for n, im in art.items()})
