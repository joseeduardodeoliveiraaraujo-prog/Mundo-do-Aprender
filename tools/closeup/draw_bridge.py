"""Desenha a cena de perto da ponte quebrada (quebra-cabeça que abre o caminho para a ilha do rio).

Uso, na pasta do projeto: python tools/closeup/draw_bridge.py . <pasta-para-a-previa>
Desenha em 96×64 e salva cada peça ampliada 2× (cena final 192×128):
  assets/images/world/closeup/bridge/*.png
O rio corre de cima para baixo; a ponte atravessa de lado, com tábuas em pé (5 px cada).
Faltam tábuas em três buracos de tamanhos diferentes (1, 2 e 3 tábuas). Nas margens ficam
as peças: 1 tábua, 2 tábuas pregadas, 3 tábuas pregadas e uma tábua rachada (não serve).
As posições das peças na cena ficam em js/data/world/closeups/bridge.js (em px da cena).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pixkit import *  # noqa

ROOT = Path(sys.argv[1])
PREVIEW = Path(sys.argv[2])
OUT = ROOT / 'assets/images/world/closeup/bridge'
OUT.mkdir(parents=True, exist_ok=True)
SCALE = 2
W, H = 96, 64
PLANK = ((206, 164, 116), (176, 132, 96), (226, 192, 146))
GRASS = ((192, 212, 112), (164, 190, 96), (212, 228, 150))
DECK_X, DECK_Y, PLANK_W, PLANK_H, COUNT = 20, 22, 5, 20, 11
HOLES = {'hole-1': (2, 1), 'hole-2': (4, 2), 'hole-3': (7, 3)}   # primeira tábua que falta, quantas
parts = {}


def save(img, name):
    parts[name] = img
    img.resize((img.width * SCALE, img.height * SCALE), Image.NEAREST).save(OUT / f'{name}.png')
    return img


def missing():
    return {first + i for first, n in HOLES.values() for i in range(n)}


def planks(n, cracked=False):
    """Tábuas em pé pregadas juntas (n tábuas), do tamanho de um buraco."""
    img = Image.new('RGBA', (n * PLANK_W, PLANK_H))
    d = ImageDraw.Draw(img)
    for i in range(n):
        shape(img, PLANK, rect((i * PLANK_W, 0, i * PLANK_W + PLANK_W - 1, PLANK_H - 1)))
    if n > 1:  # travessas que prendem as tábuas
        for y in (4, PLANK_H - 5):
            d.line([(1, y), (n * PLANK_W - 2, y)], fill=rgba(WOOD[1]))
    for i in range(n):  # pregos
        d.point((i * PLANK_W + 2, 4), fill=rgba(METAL[1]))
        d.point((i * PLANK_W + 2, PLANK_H - 5), fill=rgba(METAL[1]))
    if cracked:  # rachadura de ponta a ponta: não segura o peso
        d.line([(2, 1), (1, 6), (3, 10), (1, 14), (2, 18)], fill=OUTLINE)
    return img


def hole(n):
    """Contorno tracejado claro onde falta tábua (mostra o tamanho do buraco)."""
    img = Image.new('RGBA', (n * PLANK_W, PLANK_H))
    d = ImageDraw.Draw(img)
    w = n * PLANK_W - 1
    for x in range(0, w + 1, 2):
        d.point((x, 0), fill=WHITE)
        d.point((x, PLANK_H - 1), fill=WHITE)
    for y in range(0, PLANK_H, 2):
        d.point((0, y), fill=WHITE)
        d.point((w, y), fill=WHITE)
    return img


def background():
    img = Image.new('RGBA', (W, H), rgba(GRASS[0]))
    d = ImageDraw.Draw(img)
    for x, y in ((6, 50), (14, 58), (4, 30), (84, 28), (90, 52), (78, 58), (12, 16), (88, 12)):   # tufos
        d.line([(x, y), (x - 1, y - 3)], fill=rgba(GRASS[1]))
        d.line([(x + 2, y), (x + 3, y - 3)], fill=rgba(GRASS[1]))
    shape(img, ((163, 205, 216), (140, 184, 200), (196, 226, 234)), rect((26, -1, 71, H)))   # rio
    for x, y in ((32, 6), (50, 12), (40, 52), (60, 58), (36, 46), (64, 8)):                   # correnteza
        d.line([(x, y), (x + 4, y)], fill=rgba((196, 226, 234)))
    for i in range(COUNT):                                                                   # tabuleiro
        if i not in missing():
            x = DECK_X + i * PLANK_W
            shape(img, PLANK, rect((x, DECK_Y, x + PLANK_W - 1, DECK_Y + PLANK_H - 1)))
    end = DECK_X + COUNT * PLANK_W - 1
    for y in (DECK_Y - 3, DECK_Y + PLANK_H):                                                 # corrimãos
        shape(img, WOOD, rrect((DECK_X - 2, y, end + 2, y + 2), 1))
    for x in (DECK_X - 3, end):                                                              # postes
        shape(img, WOOD, rrect((x, DECK_Y - 5, x + 3, DECK_Y - 1), 1), rrect((x, DECK_Y + PLANK_H, x + 3, DECK_Y + PLANK_H + 4), 1))
    return save(img, 'background')


background()
for name, (_, n) in HOLES.items():
    save(hole(n), name)
for n in (1, 2, 3):
    save(planks(n), f'planks-{n}')
save(planks(1, cracked=True), 'plank-cracked')

# Prévia: a cena montada, com as peças no lugar inicial (posições de bridge.js divididas por 2).
scene = parts['background'].copy()
for name, (first, _) in HOLES.items():
    scene.alpha_composite(parts[name], (DECK_X + first * PLANK_W, DECK_Y))
for name, (x, y) in (('planks-3', (4, 1)), ('planks-1', (12, 41)), ('planks-2', (78, 1)), ('plank-cracked', (84, 41))):
    scene.alpha_composite(parts[name], (x, y))
scene.resize((W * 6, H * 6), Image.NEAREST).save(PREVIEW / 'bridge-preview.png')
print('ok', sorted(parts), {n: (DECK_X + f * PLANK_W) * 2 for n, (f, _) in HOLES.items()}, 'y', DECK_Y * 2)
