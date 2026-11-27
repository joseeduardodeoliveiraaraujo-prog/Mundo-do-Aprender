"""Ferramentas de pixel art das cenas de perto (paleta do mapa, contorno automático)."""
from PIL import Image, ImageDraw

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




