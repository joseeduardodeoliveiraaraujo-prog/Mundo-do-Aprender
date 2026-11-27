"""Desenha a cena de perto da pia (pixel art, paleta do mapa).

Uso, na pasta do projeto: python tools/closeup/draw_sink.py . <pasta-para-a-previa>
Gera assets/images/world/closeup/sink/*.png (tamanho real, 1 px = 1 px do jogo).
"""
import sys
from pathlib import Path
import sys as _sys
from PIL import Image, ImageDraw

ROOT = Path(sys.argv[1])
PREVIEW = Path(sys.argv[2])
OUT = ROOT / 'assets/images/world/closeup/sink'
OUT.mkdir(parents=True, exist_ok=True)

W, H = 192, 128
OUTLINE = (107, 75, 91, 255)
SKIN = ((227, 163, 119), (196, 128, 98), (242, 192, 152))
METAL = ((203, 211, 222), (159, 170, 187), (255, 255, 255))
WOOD = ((196, 154, 108), (170, 121, 89), (220, 185, 138))
WOOD_LIGHT = ((232, 207, 166), (220, 185, 138), (243, 229, 194))
TEAL = ((108, 153, 155), (84, 122, 128), (138, 182, 180))
WATER = (163, 205, 216, 255)
WATER_DARK = (108, 153, 155, 255)
WHITE = (255, 255, 255, 255)
MUD = (146, 104, 88, 255)
MUD_LIGHT = (170, 121, 89, 255)
TOWEL = ((170, 206, 170), (128, 170, 140), (206, 230, 198))
SOAP = ((232, 176, 196), (204, 140, 168), (248, 214, 226))
TILE = ((214, 230, 228), (190, 210, 212), (232, 242, 240))


def rgba(c):
    return (*c, 255) if len(c) == 3 else c


def mask_of(w, h, draw_fn):
    m = Image.new('1', (w, h), 0)
    draw_fn(ImageDraw.Draw(m))
    return {(x, y) for y in range(h) for x in range(w) if m.getpixel((x, y))}


def paint(img, cells, colors, outline=True):
    """Preenche uma forma com sombra embaixo/direita, luz em cima/esquerda e contorno por dentro."""
    fill, shade, light = (rgba(c) for c in colors)
    for (x, y) in cells:
        out = lambda dx, dy: (x + dx, y + dy) not in cells
        if outline and (out(1, 0) or out(-1, 0) or out(0, 1) or out(0, -1)):
            color = OUTLINE
        elif out(1, 1) or out(0, 2) or out(2, 0):
            color = shade
        elif out(-1, -1) or out(0, -2):
            color = light
        else:
            color = fill
        img.putpixel((x, y), color)


def shape(img, colors, *parts, outline=True):
    w, h = img.size
    cells = set()
    for part in parts:
        cells |= mask_of(w, h, part)
    paint(img, cells, colors, outline)
    return cells


def rrect(box, r):
    return lambda d: d.rounded_rectangle(box, r, fill=1)


def rect(box):
    return lambda d: d.rectangle(box, fill=1)


def ellipse(box):
    return lambda d: d.ellipse(box, fill=1)


def save(img, name):
    img.save(OUT / f'{name}.png')
    return img


# ---------- fundo: parede de azulejos, espelho, bancada e pia ----------
def background():
    img = Image.new('RGBA', (W, H), rgba(TILE[0]))
    d = ImageDraw.Draw(img)
    for y in range(0, 70, 12):  # rejunte
        d.line([(0, y), (W, y)], fill=rgba(TILE[1]))
    for row, y in enumerate(range(0, 70, 12)):
        for x in range(-6 if row % 2 else 0, W, 12):
            d.line([(x, y), (x, y + 11)], fill=rgba(TILE[1]))
            d.point((x + 2, y + 2), fill=rgba(TILE[2]))
    # espelho
    shape(img, WOOD, rrect((68, 4, 123, 37), 3))
    shape(img, ((196, 222, 230), (163, 205, 216), (226, 240, 244)), rect((72, 8, 119, 33)), outline=False)
    for i in range(6):
        d.point((80 + i, 26 - i), fill=WHITE)
        d.point((85 + i, 26 - i), fill=WHITE)
        d.point((104 + i, 16 - i // 2), fill=rgba((226, 240, 244)))
    # cabide da toalha
    shape(img, WOOD, rrect((148, 24, 185, 28), 2))
    # rodapé da parede e bancada
    shape(img, WOOD, rect((-2, 68, W + 1, 74)))
    shape(img, WOOD_LIGHT, rect((-2, 74, W + 1, 96)))
    shape(img, WOOD, rect((-2, 96, W + 1, H + 1)))
    for x in (4, 66, 128):  # portas do armário
        shape(img, ((184, 140, 98), WOOD[1], WOOD[2]), rrect((x, 101, x + 58, H + 3), 2))
        d.rectangle((x + 27, 108, x + 30, 110), fill=OUTLINE)
        d.rectangle((x + 28, 108, x + 29, 109), fill=rgba(METAL[0]))
    # cuba
    shape(img, ((243, 237, 242), METAL[0], (255, 255, 255)), ellipse((46, 76, 146, 98)))
    shape(img, ((203, 211, 222), (184, 194, 208), (220, 226, 234)), ellipse((54, 80, 138, 95)))
    d.ellipse((93, 88, 98, 91), fill=OUTLINE)
    d.point((95, 89), fill=rgba(METAL[1]))
    # saboneteira
    shape(img, METAL, rrect((20, 80, 44, 86), 2))
    # copo com escova
    shape(img, ((210, 226, 238), (184, 200, 216), (236, 244, 250)), rrect((154, 72, 164, 87), 2))
    shape(img, ((150, 200, 214), WATER_DARK[:3], (196, 230, 236)), rect((158, 58, 160, 73)))
    shape(img, ((255, 255, 255), METAL[0], (255, 255, 255)), rrect((156, 55, 162, 61), 1))
    # planta
    shape(img, ((214, 150, 120), (190, 124, 100), (232, 180, 150)), rrect((172, 76, 184, 88), 2))
    for leaf in ((168, 64, 176, 77), (176, 60, 184, 76), (180, 66, 189, 78)):
        shape(img, ((150, 196, 120), (110, 160, 100), (190, 220, 150)), ellipse(leaf))
    return save(img, 'background')


# ---------- torneira (fechada e aberta) ----------
def faucet(is_open):
    img = Image.new('RGBA', (34, 42))
    shape(img, METAL,
          rrect((14, 34, 25, 41), 2),        # base
          rect((17, 6, 21, 35)),             # pescoço
          rrect((4, 2, 21, 7), 2),           # arco
          rect((4, 4, 9, 12)))               # bico
    d = ImageDraw.Draw(img)
    d.line([(5, 12), (8, 12)], fill=rgba(METAL[1]))
    if is_open:  # alavanca para cima
        lever = [(22, 30), (24, 28), (26, 26), (28, 24)]
        for x, y in lever:
            d.rectangle((x - 1, y - 1, x + 1, y + 1), fill=OUTLINE)
        for x, y in lever:
            d.point((x, y), fill=rgba(METAL[0]))
        shape(img, ((163, 205, 216), WATER_DARK[:3], (206, 232, 238)), ellipse((27, 19, 33, 25)))
    else:  # alavanca deitada
        d.rectangle((21, 29, 29, 31), fill=OUTLINE)
        d.line([(22, 30), (28, 30)], fill=rgba(METAL[0]))
        shape(img, ((163, 205, 216), WATER_DARK[:3], (206, 232, 238)), ellipse((27, 27, 33, 33)))
    return save(img, 'faucet-open' if is_open else 'faucet-closed')


def water():
    img = Image.new('RGBA', (6, 30))
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 5, 29), fill=WATER_DARK)
    d.rectangle((1, 0, 4, 29), fill=WATER)
    for y in range(0, 30, 5):
        d.line([(2, y), (2, y + 2)], fill=WHITE)
    return save(img, 'water')


def splash():
    img = Image.new('RGBA', (16, 6))
    d = ImageDraw.Draw(img)
    for x, y in ((1, 4), (3, 2), (5, 1), (10, 1), (12, 2), (14, 4)):
        d.rectangle((x - 1, y - 1, x + 1, y + 1), fill=WATER_DARK)
        d.point((x, y), fill=WATER)
    return save(img, 'splash')


# ---------- mãos ----------
FINGERS = ((4, 4), (8, 1), (12, 2), (16, 5))  # (x, topo) de cada dedo


def hand_cells():
    img = Image.new('1', (28, 36))
    parts = [rrect((4, 12, 19, 28), 4), rrect((15, 12, 26, 21), 4)]  # palma e polegar
    parts += [rrect((x, top, x + 4, 18), 2) for x, top in FINGERS]
    cells = set()
    for part in parts:
        cells |= mask_of(28, 36, part)
    cuff = mask_of(28, 36, rect((3, 28, 20, 35)))
    return cells - cuff, cuff


def draw_hand(img, ox, mirror, state):
    cells, cuff = hand_cells()
    flip = (lambda x: 27 - x) if mirror else (lambda x: x)
    layer = Image.new('RGBA', img.size)
    move = lambda c: {(flip(x) + ox, y) for x, y in c}
    paint(layer, move(cells), SKIN)
    paint(layer, move(cuff), TEAL)
    for x, _ in FINGERS[1:]:  # linhas entre os dedos
        for y in range(6, 13):
            if (x, y) in cells and (x - 1, y) in cells:
                layer.putpixel((flip(x) + ox, y), rgba(SKIN[1]))
    marks = []
    if state in ('dirty', 'wet'):
        marks += [((7, 16), MUD), ((8, 16), MUD), ((7, 17), MUD_LIGHT), ((13, 21), MUD), ((14, 21), MUD),
                  ((14, 22), MUD), ((9, 6), MUD), ((10, 25), MUD_LIGHT), ((11, 25), MUD), ((17, 9), MUD)]
    if state in ('wet', 'rinsed'):
        marks += [((6, 13), WATER), ((6, 14), WHITE), ((15, 17), WATER), ((15, 18), WHITE), ((11, 4), WATER), ((20, 18), WATER)]
    for (x, y), color in marks:
        if (x, y) in cells:
            layer.putpixel((flip(x) + ox, y), color)
    img.alpha_composite(layer)


def hands(state, together=False):
    img = Image.new('RGBA', (64, 36))
    gap = 8 if together else 0
    draw_hand(img, 6 + gap, False, state)
    draw_hand(img, 30 - gap, True, state)
    return save(img, f'hands-rub-{state}' if together else f'hands-{state}')


# ---------- objetos que a criança usa ----------
def soap():
    img = Image.new('RGBA', (18, 10))
    shape(img, SOAP, rrect((1, 1, 16, 9), 3))
    ImageDraw.Draw(img).line([(5, 4), (11, 4)], fill=rgba(SOAP[2]))
    return save(img, 'soap')


def towel():
    img = Image.new('RGBA', (24, 34))
    shape(img, TOWEL, rrect((1, 0, 22, 33), 2))
    d = ImageDraw.Draw(img)
    for y in (24, 27):
        d.line([(2, y), (21, y)], fill=rgba((243, 229, 194)))
    d.line([(2, 4), (21, 4)], fill=rgba(TOWEL[1]))
    return save(img, 'towel')


def bubble(size, name):
    img = Image.new('RGBA', (size, size))
    d = ImageDraw.Draw(img)
    d.ellipse((0, 0, size - 1, size - 1), fill=rgba(METAL[1]))
    d.ellipse((1, 1, size - 2, size - 2), fill=WHITE)
    d.point((size // 2 + 1, size // 2 + 1), fill=rgba((214, 230, 240)))
    d.point((2, 2) if size > 5 else (1, 1), fill=rgba((214, 230, 240)))
    return save(img, name)


def sparkle():
    img = Image.new('RGBA', (9, 9))
    d = ImageDraw.Draw(img)
    gold = rgba((246, 214, 120))
    d.line([(4, 0), (4, 8)], fill=gold)
    d.line([(0, 4), (8, 4)], fill=gold)
    d.rectangle((3, 3, 5, 5), fill=gold)
    d.point((4, 4), fill=WHITE)
    return save(img, 'sparkle')


def pointer():
    """Setinha que mostra onde mexer (fica parada; não pisca)."""
    img = Image.new('RGBA', (13, 15))
    cells = mask_of(13, 15, lambda d: d.polygon([(0, 6), (12, 6), (6, 14)], fill=1)) | mask_of(13, 15, rect((3, 0, 9, 7)))
    paint(img, cells, ((255, 236, 160), (240, 200, 110), (255, 250, 220)))
    common = ROOT / 'assets/images/world/closeup/common'
    common.mkdir(parents=True, exist_ok=True)
    img.save(common / 'pointer.png')
    return img


bg = background()
parts = {
    'faucet-closed': faucet(False), 'faucet-open': faucet(True), 'water': water(), 'splash': splash(),
    'soap': soap(), 'towel': towel(), 'bubble': bubble(7, 'bubble'), 'bubble-small': bubble(5, 'bubble-small'),
    'sparkle': sparkle(), 'pointer': pointer(),
}
for state in ('dirty', 'wet', 'rinsed', 'clean'):
    parts[f'hands-{state}'] = hands(state)
parts['hands-rub-wet'] = hands('wet', together=True)

# Prévia ampliada: a cena montada e as peças soltas.
scene = bg.copy()
scene.alpha_composite(parts['faucet-open'], (88, 38))
scene.alpha_composite(parts['water'], (93, 48))
scene.alpha_composite(parts['hands-wet'], (64, 62))
scene.alpha_composite(parts['soap'], (23, 73))
scene.alpha_composite(parts['towel'], (155, 27))
for x, y in ((70, 70), (84, 66), (100, 72), (114, 68)):
    scene.alpha_composite(parts['bubble'], (x, y))
scene.alpha_composite(parts['pointer'], (26, 56))
sheet = Image.new('RGBA', (W * 2 + 8, H), (40, 40, 40, 255))
sheet.alpha_composite(scene, (0, 0))
x, y = W + 8, 0
for name, img in parts.items():
    if x + img.width > sheet.width:
        x, y = W + 8, y + 40
    sheet.alpha_composite(img, (x, y))
    x += img.width + 4
sheet.resize((sheet.width * 4, sheet.height * 4), Image.NEAREST).save(PREVIEW / 'sink-preview.png')
print('ok', sorted(p.name for p in OUT.iterdir()))
