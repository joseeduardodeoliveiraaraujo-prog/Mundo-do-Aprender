"""Desenha a imagem da tela inicial com peças do atlas do jogo.

Uso, na pasta do projeto:  python tools/draw_title.py
Gera assets/images/world/title.png (pixel art, 192x96; a tela amplia sem borrar).
"""
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
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
