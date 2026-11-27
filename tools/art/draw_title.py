"""Desenha a imagem e o título em pixel art da tela inicial.

Uso, na pasta do projeto:  python tools/art/draw_title.py
Gera (pixel art; a tela amplia sem borrar):
  assets/images/world/title.png        cena com peças do atlas do jogo (192×96)
  assets/images/world/title-logo.png   "Bairro do Noa" numa fonte de pixels própria
"""
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
atlas = Image.open(ROOT / 'assets/images/world/atlas.png').convert('RGBA')
index = (ROOT / 'js/data/world/atlas.js').read_text(encoding='utf-8')


def frame(name):
    match = re.search(r'["\s]' + re.escape(name) + r'"?: \[(\d+), (\d+), (\d+), (\d+)\]', index)
    x, y, w, h = map(int, match.groups())
    return atlas.crop((x, y, x + w, y + h))


W, H = 192, 96
img = Image.new('RGBA', (W, H))
variants = ['grass9C'] * 6 + [f'grassVar{i}' for i in range(9)]
for ty in range(H // 16):
    for tx in range(W // 16):
        img.alpha_composite(frame(variants[(tx * 7 + ty * 5) % len(variants)]), (tx * 16, ty * 16))

# Peças em ordem de profundidade (de trás para a frente): (nome, x, y, com sombra)
PIECES = [
    ('treeBig', -6, -8, False), ('treeApple', 24, -12, False), ('treeTall', 58, -14, False),
    ('treeBig', 140, -10, False), ('treeTall', 172, -6, False), ('bushLong', 100, 2, False),
    ('sunflower', 124, 8, False), ('bush', 4, 28, False), ('flowersYellow', 40, 30, False),
    ('flowerBlue', 150, 30, False), ('sign', 168, 36, False), ('flowersPink', 22, 58, False),
    ('mushroom', 8, 72, False), ('rock', 176, 70, False), ('flowerYellow', 150, 74, False),
    ('dog', 64, 54, False), ('personGabi', 104, 48, True), ('noa-down-0', 86, 50, True), ('cat', 122, 54, False),
    ('flowersYellow', 96, 78, False), ('flowerBlue', 134, 80, False),
]
shadow = frame('shadow')
for name, x, y, has_shadow in PIECES:
    piece = frame(name)
    if has_shadow:
        img.alpha_composite(shadow, (x + 2, y + piece.height - 5))
    img.alpha_composite(piece, (x, y))

img.save(ROOT / 'assets/images/world/title.png')
print('ok', img.size)


# ---------- Título "Bairro do Noa" ----------
GLYPHS = {  # fonte de pixels própria, 7 linhas; só as letras do título
    'B': ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
    'N': ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
    'a': ['.....', '.....', '.###.', '....#', '.####', '#...#', '.####'],
    'i': ['.#.', '...', '##.', '.#.', '.#.', '.#.', '###'],
    'r': ['.....', '.....', '#.##.', '##..#', '#....', '#....', '#....'],
    'o': ['.....', '.....', '.###.', '#...#', '#...#', '#...#', '.###.'],
    'd': ['....#', '....#', '.####', '#...#', '#...#', '#...#', '.####'],
    ' ': ['..'] * 7,
}
OUTLINE = (107, 75, 91, 255)
SHADOW = (80, 64, 134, 255)
TOP, BOTTOM = (255, 246, 222, 255), (246, 206, 116, 255)  # creme em cima, dourado embaixo
PX = 2  # cada pixel da fonte vira 2×2


def logo(text):
    cells = set()
    x = 0
    for char in text:
        glyph = GLYPHS[char]
        for gy, row in enumerate(glyph):
            for gx, c in enumerate(row):
                if c == '#':
                    for dy in range(PX):
                        for dx in range(PX):
                            cells.add((x + gx * PX + dx, gy * PX + dy))
        x += (len(glyph[0]) + 1) * PX
    pad = 1
    w, h = x - PX + pad * 2, 7 * PX + pad * 2 + 2
    img = Image.new('RGBA', (w, h))
    moved = {(cx + pad, cy + pad) for cx, cy in cells}
    ring = {(cx + dx, cy + dy) for cx, cy in moved for dx in (-1, 0, 1) for dy in (-1, 0, 1)} - moved
    for cx, cy in ring | moved:  # sombra: contorno inteiro 2 px abaixo
        if 0 <= cy + 2 < h:
            img.putpixel((cx, cy + 2), SHADOW)
    for point in ring:
        img.putpixel(point, OUTLINE)
    for cx, cy in moved:
        img.putpixel((cx, cy), TOP if cy - pad < 4 * PX else BOTTOM)
    return img


title_logo = logo('Bairro do Noa')
title_logo.save(ROOT / 'assets/images/world/title-logo.png')
print('ok título', title_logo.size)
