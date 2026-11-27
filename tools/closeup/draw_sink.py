"""Desenha a cena de perto da pia (pixel art 2×, como o quarto e a mochila) e a setinha de ajuda.

Uso, na pasta do projeto: python tools/closeup/draw_sink.py . <pasta-para-a-previa>
Desenha em 96×64 e salva cada peça ampliada 2× (cena final 192×128):
  assets/images/world/closeup/sink/*.png  e  assets/images/world/closeup/common/pointer.png
As posições das peças na cena ficam em js/data/world/closeups/sink.js (em px da cena, 192×128).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pixkit import *  # noqa

ROOT = Path(sys.argv[1])
PREVIEW = Path(sys.argv[2])
OUT = ROOT / 'assets/images/world/closeup/sink'
COMMON = ROOT / 'assets/images/world/closeup/common'
OUT.mkdir(parents=True, exist_ok=True)
COMMON.mkdir(parents=True, exist_ok=True)
SCALE = 2
W, H = 96, 64
parts = {}


def save(img, name, folder=OUT):
    parts[name] = img
    img.resize((img.width * SCALE, img.height * SCALE), Image.NEAREST).save(folder / f'{name}.png')
    return img


# ---------- fundo: azulejos, espelho, bancada, cuba, saboneteira, copo e planta ----------
def background():
    img = Image.new('RGBA', (W, H), rgba(TILE[0]))
    d = ImageDraw.Draw(img)
    for y in range(0, 35, 6):
        d.line([(0, y), (W, y)], fill=rgba(TILE[1]))
    for row, y in enumerate(range(0, 35, 6)):
        for x in range(-3 if row % 2 else 0, W, 6):
            d.line([(x, y), (x, y + 5)], fill=rgba(TILE[1]))
    shape(img, WOOD, rrect((34, 2, 61, 18), 2))                               # espelho
    shape(img, ((196, 222, 230), (163, 205, 216), (226, 240, 244)), rect((36, 4, 59, 16)), outline=False)
    for i in range(3):
        d.point((40 + i, 13 - i), fill=WHITE)
        d.point((43 + i, 13 - i), fill=WHITE)
    shape(img, WOOD, rrect((74, 12, 92, 14), 1))                              # cabide da toalha
    shape(img, WOOD, rect((-1, 34, W, 37)))                                   # rodapé
    shape(img, WOOD_LIGHT, rect((-1, 37, W, 48)))                             # bancada
    shape(img, WOOD, rect((-1, 48, W, H)))                                    # armário
    for x in (2, 33, 64):
        shape(img, ((184, 140, 98), WOOD[1], WOOD[2]), rrect((x, 50, x + 29, H + 2), 1))
        d.point((x + 14, 55), fill=OUTLINE)
    shape(img, ((243, 237, 242), METAL[0], WHITE[:3]), ellipse((23, 38, 73, 49)))   # cuba
    shape(img, ((203, 211, 222), (184, 194, 208), (220, 226, 234)), ellipse((27, 40, 69, 48)))
    d.rectangle((47, 44, 48, 45), fill=OUTLINE)                               # ralo
    shape(img, METAL, rrect((10, 40, 22, 43), 1))                             # saboneteira
    shape(img, ((150, 200, 214), WATER_DARK[:3], (196, 230, 236)), rect((79, 29, 80, 37)))   # escova
    shape(img, (WHITE[:3], METAL[0], WHITE[:3]), rrect((78, 27, 81, 30), 1))
    shape(img, ((210, 226, 238), (184, 200, 216), (236, 244, 250)), rrect((76, 35, 83, 44), 1))  # copo
    shape(img, ((214, 150, 120), (190, 124, 100), (232, 180, 150)), rrect((86, 38, 93, 44), 1))  # vaso
    for leaf in ((84, 32, 89, 39), (88, 29, 93, 38), (91, 33, 95, 39)):
        shape(img, ((150, 196, 120), (110, 160, 100), (190, 220, 150)), ellipse(leaf))
    return save(img, 'background')


# ---------- torneira, água e respingo ----------
def faucet(is_open):
    img = Image.new('RGBA', (17, 21))
    shape(img, METAL, rrect((7, 17, 13, 20), 1), rect((8, 3, 10, 18)), rrect((2, 1, 10, 4), 1), rect((2, 2, 4, 6)))
    d = ImageDraw.Draw(img)
    knob = ((163, 205, 216), WATER_DARK[:3], (206, 232, 238))
    if is_open:  # alavanca para cima
        d.line([(11, 15), (13, 13)], fill=OUTLINE)
        shape(img, knob, ellipse((12, 9, 16, 13)))
    else:        # alavanca deitada
        d.line([(11, 15), (13, 15)], fill=OUTLINE)
        shape(img, knob, ellipse((12, 13, 16, 17)))
    return save(img, 'faucet-open' if is_open else 'faucet-closed')


def water():
    img = Image.new('RGBA', (3, 15))
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 2, 14), fill=WATER)
    d.line([(0, 0), (0, 14)], fill=WATER_DARK)
    for y in range(1, 15, 4):
        d.point((1, y), fill=WHITE)
    return save(img, 'water')


def splash():
    img = Image.new('RGBA', (8, 3))
    d = ImageDraw.Draw(img)
    for x, y in ((0, 2), (2, 1), (5, 1), (7, 2)):
        d.point((x, y), fill=WATER)
    d.point((3, 0), fill=WHITE)
    return save(img, 'splash')


# ---------- mãos de Noa (uma mão desenhada; a outra espelhada) ----------
FINGERS = ((2, 2), (5, 0), (8, 1), (11, 3))  # (x, topo); cada dedo tem 3 px de largura


def hand_cells():
    parts_ = [rrect((2, 7, 13, 15), 2), rrect((11, 8, 15, 12), 2)]          # palma e polegar
    parts_ += [rrect((x, top, x + 2, 10), 1) for x, top in FINGERS]
    cells = set()
    for part in parts_:
        cells |= mask_of(16, 20, part)
    cuff = mask_of(16, 20, rect((1, 15, 14, 19)))
    return cells - cuff, cuff


def draw_hand(img, ox, mirror, state):
    cells, cuff = hand_cells()
    flip = (lambda x: 15 - x) if mirror else (lambda x: x)
    layer = Image.new('RGBA', img.size)
    move = lambda c: {(flip(x) + ox, y) for x, y in c}
    paint(layer, move(cells), SKIN)
    paint(layer, move(cuff), TEAL)
    for x, top in FINGERS[1:]:  # linhas entre os dedos
        for y in range(top + 1, 8):
            if (x, y) in cells and (x - 1, y) in cells:
                layer.putpixel((flip(x) + ox, y), rgba(SKIN[1]))
    marks = []
    if state in ('dirty', 'wet'):
        marks += [((x, y), MUD) for x, y in ((4, 9), (5, 9), (4, 10), (5, 10), (9, 12), (10, 12), (9, 13),
                                             (6, 2), (6, 3), (11, 5), (7, 13), (8, 13), (3, 12))]
        marks += [((10, 13), MUD_LIGHT), ((6, 10), MUD_LIGHT), ((12, 6), MUD_LIGHT)]
    if state in ('wet', 'rinsed'):
        marks += [((4, 11), WATER), ((9, 9), WATER), ((6, 3), WHITE), ((12, 10), WATER)]
    for (x, y), color in marks:
        if (x, y) in cells:
            layer.putpixel((flip(x) + ox, y), color)
    img.alpha_composite(layer)


def hands(state, together=False):
    img = Image.new('RGBA', (32, 20))
    gap = 2 if together else 0
    draw_hand(img, gap, False, state)
    draw_hand(img, 16 - gap, True, state)
    return save(img, f'hands-rub-{state}' if together else f'hands-{state}')


# ---------- objetos que a criança usa e efeitos ----------
def soap():
    img = Image.new('RGBA', (9, 5))
    shape(img, SOAP, rrect((0, 0, 8, 4), 1))
    ImageDraw.Draw(img).line([(3, 2), (5, 2)], fill=rgba(SOAP[2]))
    return save(img, 'soap')


def towel():
    img = Image.new('RGBA', (12, 17))
    shape(img, TOWEL, rrect((0, 0, 11, 16), 1))
    d = ImageDraw.Draw(img)
    d.line([(1, 12), (10, 12)], fill=rgba((243, 229, 194)))
    d.line([(1, 2), (10, 2)], fill=rgba(TOWEL[1]))
    return save(img, 'towel')


def bubble(size, name):
    img = Image.new('RGBA', (size, size))
    d = ImageDraw.Draw(img)
    d.ellipse((0, 0, size - 1, size - 1), fill=rgba(METAL[1]))
    d.ellipse((1, 1, size - 2, size - 2), fill=WHITE)
    if size > 3:
        d.point((1, 1), fill=rgba((214, 230, 240)))
    return save(img, name)


def sparkle():
    img = Image.new('RGBA', (5, 5))
    d = ImageDraw.Draw(img)
    gold = rgba((246, 214, 120))
    d.line([(2, 0), (2, 4)], fill=gold)
    d.line([(0, 2), (4, 2)], fill=gold)
    d.point((2, 2), fill=WHITE)
    return save(img, 'sparkle')


def pointer():
    """Setinha parada que mostra onde mexer (não pisca). Compartilhada pelas cenas."""
    img = Image.new('RGBA', (9, 10))
    cells = mask_of(9, 10, lambda d: d.polygon([(0, 4), (8, 4), (4, 9)], fill=1)) | mask_of(9, 10, rect((2, 0, 6, 4)))
    paint(img, cells, ((255, 236, 160), (240, 200, 110), (255, 250, 220)))
    return save(img, 'pointer', COMMON)


background()
for flag in (False, True):
    faucet(flag)
water(); splash(); soap(); towel(); sparkle(); pointer()
bubble(4, 'bubble'); bubble(3, 'bubble-small')
for state in ('dirty', 'wet', 'rinsed', 'clean'):
    hands(state)
hands('wet', together=True)

# Prévia: a cena montada (posições de sink.js, divididas por 2).
scene = parts['background'].copy()
for name, (x, y) in (('water', (47, 25)), ('faucet-open', (45, 19)), ('hands-wet', (32, 29)),
                     ('soap', (12, 36)), ('towel', (76, 14)), ('pointer', (12, 25))):
    scene.alpha_composite(parts[name], (x, y))
for x, y in ((36, 33), (42, 31), (50, 35), (56, 33)):
    scene.alpha_composite(parts['bubble'], (x, y))
scene.resize((W * 6, H * 6), Image.NEAREST).save(PREVIEW / 'sink-preview.png')
print('ok', sorted(parts))
