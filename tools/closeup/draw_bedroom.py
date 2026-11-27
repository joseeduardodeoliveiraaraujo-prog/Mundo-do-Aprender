"""Desenha a cena de perto do quarto do Noa (vista de frente, pixels 2x).

Uso, na pasta do projeto: python tools/closeup/draw_bedroom.py . <pasta-para-a-previa>
Desenha em 96x64 e salva cada peça ampliada 2x (cena final 192x128).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pixkit import *  # noqa

ROOT = Path(sys.argv[1])
PREVIEW = Path(sys.argv[2])
OUT = ROOT / 'assets/images/world/closeup/bedroom'
OUT.mkdir(parents=True, exist_ok=True)
SCALE = 2
W, H = 96, 64

WALL = ((236, 214, 178), (222, 196, 156), (244, 228, 200))
PINK = ((232, 176, 196), (204, 140, 168), (248, 214, 226))
MINT = ((170, 206, 170), (128, 170, 140), (206, 230, 198))
SHEET = ((243, 237, 242), (213, 205, 222), (255, 255, 255))
GOLD = ((246, 214, 120), (226, 176, 90), (255, 240, 190))
RED = ((222, 128, 112), (190, 98, 92), (240, 170, 150))
BLUE = ((150, 190, 222), (110, 150, 190), (196, 222, 240))
SKY_DAY = (196, 226, 236, 255)
SKY_NIGHT = (64, 76, 124, 255)

atlas = Image.open(ROOT / 'assets/images/world/atlas.png').convert('RGBA')
NOA = atlas.crop((96, 96, 112, 112))
parts = {}


def save(img, name):
    parts[name] = img
    img.resize((img.width * SCALE, img.height * SCALE), Image.NEAREST).save(OUT / f'{name}.png')
    return img


def background(night):
    img = Image.new('RGBA', (W, H), rgba(WALL[0]))
    d = ImageDraw.Draw(img)
    for x in range(3, W, 6):  # papel de parede listrado, bem suave
        d.line([(x, 0), (x, 43)], fill=rgba(WALL[2]))
    # janela com o céu
    shape(img, WOOD, rrect((7, 5, 34, 29), 2))
    d.rectangle((10, 8, 31, 26), fill=SKY_NIGHT if night else SKY_DAY)
    if night:
        d.ellipse((24, 10, 29, 15), fill=rgba((243, 237, 200)))
        d.ellipse((26, 9, 30, 14), fill=SKY_NIGHT)
        for x, y in ((13, 11), (17, 21), (22, 13), (28, 22), (14, 24)):
            d.point((x, y), fill=rgba((243, 237, 200)))
    else:
        shape(img, GOLD, ellipse((12, 10, 18, 16)), outline=False)
        shape(img, SHEET, ellipse((21, 18, 30, 22)), ellipse((24, 16, 29, 21)), outline=False)
    d.rectangle((20, 8, 21, 26), fill=rgba(WOOD[0]))
    d.rectangle((10, 17, 31, 18), fill=rgba(WOOD[0]))
    shape(img, WOOD, rrect((4, 3, 37, 5), 1))  # varão da cortina
    # quadro na parede
    shape(img, WOOD, rect((48, 6, 64, 19)))
    d.rectangle((50, 8, 62, 17), fill=SKY_DAY)
    d.polygon([(50, 17), (55, 11), (59, 15), (62, 12), (62, 17)], fill=rgba(MINT[1]))
    # rodapé e chão
    shape(img, WOOD, rect((-2, 43, W + 1, 46)))
    d.rectangle((0, 46, W, H), fill=rgba(WOOD[0]))
    for y in (51, 57, 63):
        d.line([(0, y), (W, y)], fill=rgba(WOOD[1]))
    for i, y in enumerate((46, 51, 57)):
        for x in range(7 + i * 9, W, 26):
            d.line([(x, y + 1), (x, y + 4)], fill=rgba(WOOD[1]))
    # tapete
    shape(img, BLUE, ellipse((40, 54, 82, 63)))
    # criado-mudo
    shape(img, WOOD, rect((80, 36, 95, 50)))
    d.line([(81, 43), (94, 43)], fill=OUTLINE)
    d.rectangle((86, 39, 88, 40), fill=OUTLINE)
    d.rectangle((86, 46, 88, 47), fill=OUTLINE)
    return save(img, 'background-night' if night else 'background-day')


def curtains(is_open):
    img = Image.new('RGBA', (32, 27))
    if is_open:
        shape(img, PINK, rrect((0, 0, 6, 26), 2))
        shape(img, PINK, rrect((25, 0, 31, 26), 2))
        d = ImageDraw.Draw(img)
        for x in (1, 26):
            d.line([(x, 14), (x + 4, 14)], fill=rgba(GOLD[1]))
    else:
        shape(img, PINK, rrect((0, 0, 16, 26), 2))
        shape(img, PINK, rrect((15, 0, 31, 26), 2))
        d = ImageDraw.Draw(img)
        for x in (5, 10, 21, 26):
            d.line([(x, 2), (x, 24)], fill=rgba(PINK[1]))
    return save(img, 'curtain-open' if is_open else 'curtain-closed')


def sleepy_head():
    head = NOA.crop((0, 0, 16, 12)).copy()
    skin, dark = (227, 163, 119, 255), (107, 75, 91, 255)
    for x in range(3, 13):  # olhos fechados: linha um pouco abaixo
        if head.getpixel((x, 8))[:3] in ((107, 75, 91), (163, 205, 216)):
            head.putpixel((x, 8), skin)
    for x in (5, 6, 9, 10):
        head.putpixel((x, 9), dark)
    return head


def bed(with_noa):
    img = Image.new('RGBA', (46, 31))
    shape(img, WOOD, rrect((0, 4, 6, 30), 2))     # cabeceira
    shape(img, WOOD, rrect((40, 13, 45, 30), 2))  # pé da cama
    shape(img, SHEET, rect((6, 19, 40, 24)))      # colchão
    shape(img, SHEET, rrect((6, 13, 16, 19), 3))  # travesseiro
    if with_noa:
        img.alpha_composite(sleepy_head(), (3, 4))
        shape(img, MINT, rrect((16, 15, 40, 24), 3), ellipse((19, 11, 38, 21)))
    else:
        shape(img, MINT, rect((16, 16, 40, 24)))
    d = ImageDraw.Draw(img)
    d.line([(18, 18) if not with_noa else (19, 19), (39, 18 if not with_noa else 19)], fill=rgba(MINT[2]))
    return save(img, 'bed-noa' if with_noa else 'bed-empty')


def alarm(ringing):
    img = Image.new('RGBA', (12, 11))
    shape(img, RED, ellipse((2, 2, 10, 10)))
    d = ImageDraw.Draw(img)
    d.ellipse((4, 4, 8, 8), fill=rgba(SHEET[0]))
    d.line([(6, 5), (6, 6), (7, 6)], fill=OUTLINE)
    shape(img, GOLD, ellipse((1, 0, 4, 3)), ellipse((8, 0, 11, 3)))
    if ringing:  # tracinhos de som, parados
        for x, y in ((0, 6), (11, 6)):
            d.point((x, y), fill=OUTLINE)
        d.point((0, 8), fill=OUTLINE)
        d.point((11, 8), fill=OUTLINE)
    return save(img, 'alarm-ringing' if ringing else 'alarm-quiet')


def lamp(on):
    img = Image.new('RGBA', (10, 14))
    shape(img, GOLD if on else ((222, 206, 170), (196, 178, 140), (236, 226, 200)), lambda d: d.polygon([(1, 7), (8, 7), (6, 0), (3, 0)], fill=1))
    shape(img, WOOD, rect((4, 7, 5, 11)), rrect((1, 11, 8, 13), 1))
    return save(img, 'lamp-on' if on else 'lamp-off')


def glow():
    img = Image.new('RGBA', (30, 30))
    d = ImageDraw.Draw(img)
    d.ellipse((0, 0, 29, 29), fill=(255, 236, 160, 50))
    d.ellipse((5, 5, 24, 24), fill=(255, 236, 160, 70))
    return save(img, 'glow')


def toys():
    img = Image.new('RGBA', (18, 9))
    shape(img, RED, ellipse((0, 1, 7, 8)))
    ImageDraw.Draw(img).point((2, 3), fill=WHITE)
    shape(img, BLUE, rect((9, 2, 15, 8)))
    shape(img, GOLD, rect((12, 0, 17, 5)))
    return save(img, 'toys')


def box(full):
    img = Image.new('RGBA', (18, 14))
    if full:
        shape(img, RED, ellipse((3, 0, 9, 6)))
        shape(img, GOLD, rect((10, 1, 15, 6)))
    shape(img, ((150, 190, 160), (120, 160, 136), (190, 220, 196)), rect((0, 4, 17, 13)))
    ImageDraw.Draw(img).line([(2, 7), (15, 7)], fill=rgba((120, 160, 136)))
    return save(img, 'box-full' if full else 'box-empty')


def overlay(name, color):
    return save(Image.new('RGBA', (W, H), color), name)


def noa():
    return save(NOA.copy(), 'noa')


for night in (False, True):
    background(night)
for flag in (False, True):
    curtains(flag); bed(flag); alarm(flag); lamp(flag); box(flag)
glow(); toys(); noa()
overlay('dim', (40, 40, 70, 80))
overlay('night', (30, 34, 72, 120))

# Prévia: manhã (cortina fechada, Noa dormindo) e noite (abajur aceso, Noa de pé).
def compose(items):
    img = Image.new('RGBA', (W, H))
    for name, x, y in items:
        img.alpha_composite(parts[name], (x, y))
    return img


LAYOUT = {'curtain': (5, 4), 'bed': (36, 23), 'alarm': (80, 26), 'lamp': (86, 23), 'glow': (76, 15), 'noa': (58, 42), 'toys': (20, 52), 'box': (2, 47)}
morning = compose([('background-day', 0, 0), ('curtain-closed', *LAYOUT['curtain']), ('bed-noa', *LAYOUT['bed']),
                   ('alarm-ringing', *LAYOUT['alarm']), ('lamp-off', *LAYOUT['lamp']), ('box-full', *LAYOUT['box']), ('dim', 0, 0)])
night = compose([('background-night', 0, 0), ('curtain-open', *LAYOUT['curtain']), ('bed-empty', *LAYOUT['bed']),
                 ('alarm-quiet', *LAYOUT['alarm']), ('glow', *LAYOUT['glow']), ('lamp-on', *LAYOUT['lamp']),
                 ('box-empty', *LAYOUT['box']), ('toys', *LAYOUT['toys']), ('noa', *LAYOUT['noa'])])
sheet = Image.new('RGBA', (W * 2 + 4, H), (40, 40, 40, 255))
sheet.alpha_composite(morning, (0, 0))
sheet.alpha_composite(night, (W + 4, 0))
sheet.resize((sheet.width * 6, sheet.height * 6), Image.NEAREST).save(PREVIEW / 'bedroom-preview.png')
print('ok', sorted(parts))
