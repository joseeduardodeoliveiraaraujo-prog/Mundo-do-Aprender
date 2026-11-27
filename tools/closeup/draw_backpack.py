"""Desenha a cena de perto da mochila (mesa do quarto, pixels 2x) e os objetos.

Uso, na pasta do projeto: python tools/closeup/draw_backpack.py . <pasta-para-a-previa>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pixkit import *  # noqa

ROOT = Path(sys.argv[1])
PREVIEW = Path(sys.argv[2])
OUT = ROOT / 'assets/images/world/closeup/backpack'
OUT.mkdir(parents=True, exist_ok=True)
SCALE = 2
W, H = 96, 64

WALL = ((236, 214, 178), (222, 196, 156), (244, 228, 200))
DESK = ((214, 172, 124), (186, 140, 98), (232, 196, 150))
PINK = ((232, 176, 196), (204, 140, 168), (248, 214, 226))
MINT = ((170, 206, 170), (128, 170, 140), (206, 230, 198))
SHEET = ((243, 237, 242), (213, 205, 222), (255, 255, 255))
GOLD = ((246, 214, 120), (226, 176, 90), (255, 240, 190))
RED = ((222, 128, 112), (190, 98, 92), (240, 170, 150))
BLUE = ((150, 190, 222), (110, 150, 190), (196, 222, 240))
GRAY = ((190, 196, 210), (150, 158, 176), (222, 226, 236))
BAG = ((120, 170, 196), (92, 136, 166), (160, 202, 220))
DARK = (70, 60, 80, 255)
parts = {}


def save(img, name):
    parts[name] = img
    img.resize((img.width * SCALE, img.height * SCALE), Image.NEAREST).save(OUT / f'{name}.png')
    return img


def background():
    img = Image.new('RGBA', (W, H), rgba(WALL[0]))
    d = ImageDraw.Draw(img)
    for x in range(3, W, 6):
        d.line([(x, 0), (x, 20)], fill=rgba(WALL[2]))
    # prateleira com livros e planta
    shape(img, WOOD, rect((8, 13, 40, 15)))
    for i, color in enumerate((RED, BLUE, GOLD, MINT)):
        shape(img, color, rect((11 + i * 4, 4 + (i % 2), 14 + i * 4, 13)))
    shape(img, ((214, 150, 120), (190, 124, 100), (232, 180, 150)), rect((30, 8, 37, 13)))
    shape(img, MINT, ellipse((28, 2, 39, 10)))
    # janela pequena
    shape(img, WOOD, rrect((64, 2, 86, 19), 2))
    d.rectangle((66, 4, 84, 17), fill=(196, 226, 236, 255))
    d.line([(75, 4), (75, 17)], fill=rgba(WOOD[0]))
    # mesa: tampo visto um pouco de cima
    shape(img, DESK, rect((-2, 21, W + 1, H + 1)))
    for y in (34, 48):
        d.line([(1, y), (W - 2, y)], fill=rgba(DESK[1]))
    return save(img, 'background')


def bag():
    img = Image.new('RGBA', (34, 34))
    shape(img, BAG, rrect((6, 0, 27, 8), 4))            # alça de cima
    d = ImageDraw.Draw(img)
    d.rectangle((10, 3, 23, 8), fill=(0, 0, 0, 0))
    shape(img, BAG, rrect((1, 5, 32, 33), 6))           # corpo
    shape(img, ((60, 52, 72), (50, 44, 60), (80, 70, 92)), ellipse((5, 6, 28, 14)))  # boca aberta
    shape(img, BAG, rrect((7, 19, 26, 31), 3))          # bolso da frente
    d.line([(8, 22), (25, 22)], fill=rgba(GOLD[1]))
    d.rectangle((16, 21, 17, 23), fill=rgba(GOLD[0]))
    return save(img, 'bag')


def item(name, draw):
    img = Image.new('RGBA', (16, 16))
    draw(img, ImageDraw.Draw(img))
    return save(img, name)


def notebook(img, d):
    shape(img, PINK, rrect((3, 1, 14, 15), 1))
    d.rectangle((6, 5, 12, 7), fill=rgba(SHEET[0]))
    for y in range(3, 15, 3):
        d.point((3, y), fill=rgba(GRAY[0]))


def pillow(img, d):
    shape(img, SHEET, rrect((0, 3, 15, 13), 4))
    d.line([(3, 8), (12, 8)], fill=rgba(SHEET[1]))


def colored_pencils(img, d):
    for i, color in enumerate((RED, BLUE, GOLD)):
        x = 3 + i * 4
        shape(img, color, rect((x, 3, x + 3, 13)))
        shape(img, WOOD_LIGHT, lambda dd, x=x: dd.polygon([(x, 13), (x + 3, 13), (x + 1.5, 16)], fill=1))


def water_bottle(img, d):
    shape(img, BLUE, rrect((4, 3, 11, 15), 2))
    shape(img, GRAY, rect((5, 0, 10, 3)))
    d.line([(5, 8), (10, 8)], fill=rgba(SHEET[2]))


def videogame(img, d):
    shape(img, GRAY, rrect((0, 4, 15, 13), 4))
    d.rectangle((3, 7, 5, 9), fill=DARK)
    d.point((4, 6), fill=DARK)
    d.point((4, 10), fill=DARK)
    d.point((11, 7), fill=rgba(RED[0]))
    d.point((12, 9), fill=rgba(BLUE[0]))


def pencil(img, d):
    cells = mask_of(16, 16, lambda dd: dd.line([(3, 12), (12, 3)], fill=1, width=3))
    paint(img, cells, GOLD)
    d.point((2, 13), fill=DARK)
    d.point((13, 2), fill=rgba(PINK[0]))


def cap(img, d):
    shape(img, RED, ellipse((2, 3, 13, 13)), rect((2, 8, 13, 12)))
    shape(img, RED, rrect((9, 10, 15, 13), 1))
    d.point((7, 4), fill=rgba(RED[2]))


def sneakers(img, d):
    shape(img, SHEET, rrect((1, 6, 9, 14), 2), rrect((1, 10, 15, 14), 2))
    d.line([(2, 12), (14, 12)], fill=rgba(BLUE[1]))
    d.point((4, 8), fill=rgba(BLUE[1]))
    d.point((6, 8), fill=rgba(BLUE[1]))


def towel(img, d):
    shape(img, MINT, rrect((1, 4, 14, 13), 1))
    d.line([(2, 10), (13, 10)], fill=rgba(WOOD_LIGHT[2]))
    d.line([(2, 7), (13, 7)], fill=rgba(MINT[1]))


background()
bag()
ITEMS = {'notebook': notebook, 'pillow': pillow, 'colored-pencils': colored_pencils, 'water-bottle': water_bottle,
         'videogame': videogame, 'pencil': pencil, 'cap': cap, 'sneakers': sneakers, 'towel': towel}
for name, fn in ITEMS.items():
    item(name, fn)

SPOTS = [(6, 26), (24, 26), (6, 44), (24, 44), (78, 26), (78, 44)]
scene = parts['background'].copy()
scene.alpha_composite(parts['bag'], (40, 24))
for (x, y), name in zip(SPOTS, ITEMS):
    scene.alpha_composite(parts[name], (x, y))
sheet = Image.new('RGBA', (W + 4 + 9 * 18, H), (40, 40, 40, 255))
sheet.alpha_composite(scene, (0, 0))
for i, name in enumerate(ITEMS):
    sheet.alpha_composite(parts[name], (W + 4 + i * 18, 4))
sheet.resize((sheet.width * 5, sheet.height * 5), Image.NEAREST).save(PREVIEW / 'backpack-preview.png')
print('ok', sorted(parts))
