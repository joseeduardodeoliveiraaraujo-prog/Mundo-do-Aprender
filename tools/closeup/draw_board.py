"""Desenha a cena de perto do quadro da rotina (parede com quadro de cortiça e prateleira).

Uso, na pasta do projeto: python tools/closeup/draw_board.py . <pasta-para-a-previa>
Desenha em 96x64 e amplia 4x (cena 384x256, o dobro das outras, para os pictogramas ficarem nítidos).
As casas numeradas são desenhadas em 13x15 e ampliadas 4x (52x60).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pixkit import *  # noqa

ROOT = Path(sys.argv[1])
PREVIEW = Path(sys.argv[2])
OUT = ROOT / 'assets/images/world/closeup/board'
OUT.mkdir(parents=True, exist_ok=True)
SCALE = 4
W, H = 96, 64
WALL = ((236, 214, 178), (222, 196, 156), (244, 228, 200))
CORK = ((214, 172, 124), (192, 148, 104), (226, 190, 146))
parts = {}

DIGITS = {  # fonte 3x5
    '1': ['.#.', '##.', '.#.', '.#.', '###'], '2': ['##.', '..#', '.#.', '#..', '###'],
    '3': ['##.', '..#', '.#.', '..#', '##.'], '4': ['#.#', '#.#', '###', '..#', '..#'],
    '5': ['###', '#..', '##.', '..#', '##.'], '6': ['.##', '#..', '###', '#.#', '###'],
}


def save(img, name):
    parts[name] = img
    img.resize((img.width * SCALE, img.height * SCALE), Image.NEAREST).save(OUT / f'{name}.png')
    return img


def background():
    img = Image.new('RGBA', (W, H), rgba(WALL[0]))
    d = ImageDraw.Draw(img)
    for x in range(3, W, 6):
        d.line([(x, 0), (x, 40)], fill=rgba(WALL[2]))
    # prateleira onde ficam os cartões
    shape(img, WOOD, rect((2, 58, 93, 61)))
    shape(img, WOOD, rect((6, 61, 9, 64)), rect((86, 61, 89, 64)))
    return save(img, 'background')


def board():
    img = Image.new('RGBA', (90, 34))
    shape(img, WOOD, rrect((0, 0, 89, 33), 2))
    d = ImageDraw.Draw(img)
    d.rectangle((2, 2, 87, 31), fill=rgba(CORK[0]))
    for i in range(60):  # pontinhos da cortiça, fixos
        x, y = 3 + (i * 37) % 84, 3 + (i * 23) % 28
        d.point((x, y), fill=rgba(CORK[1] if i % 3 else CORK[2]))
    return save(img, 'board')


def slot(n):
    img = Image.new('RGBA', (13, 15))
    d = ImageDraw.Draw(img)
    for x in range(0, 13, 2):  # borda tracejada
        d.point((x, 0), fill=OUTLINE)
        d.point((x, 14), fill=OUTLINE)
    for y in range(0, 15, 2):
        d.point((0, y), fill=OUTLINE)
        d.point((12, y), fill=OUTLINE)
    d.rectangle((1, 1, 11, 13), fill=(243, 229, 194, 150))
    for y, row in enumerate(DIGITS[str(n)]):
        for x, c in enumerate(row):
            if c == '#':
                d.point((5 + x, 5 + y), fill=OUTLINE)
    return save(img, f'slot-{n}')


background()
board()
for n in range(1, 7):
    slot(n)
preview = parts['background'].copy()
preview.alpha_composite(parts['board'], (3, 3))
for i in range(6):
    preview.alpha_composite(parts[f'slot-{i + 1}'], (6 + i * 14, 12))
preview.resize((W * 4, H * 4), Image.NEAREST).save(PREVIEW / 'board-preview.png')
print('ok', sorted(parts))
