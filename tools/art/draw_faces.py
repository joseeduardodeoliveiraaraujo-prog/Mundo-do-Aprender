"""Desenha os rostos das emoções em pixel art (28×28, mesma paleta e contorno do jogo).

Uso, na pasta do projeto:  python tools/art/draw_faces.py [pasta-para-a-previa]
Gera assets/images/emotions/faces/<emocao>.png. Cada rosto é uma pessoa diferente
(Ana, Caio...) e mostra os detalhes que os textos alternativos descrevem
(js/data/emotions.js): boca, sobrancelhas, olhos, lágrima, bochechas.
Mostrados em 2× (56 px) nos cartões e maiores na caixa de diálogo, sempre sem borrar.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'closeup'))
from pixkit import Image, ImageDraw, shape, ellipse, rect, rrect, rgba, OUTLINE, WHITE  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/images/emotions/faces'
S = 28
BG = ((240, 236, 226), (226, 218, 204), (248, 246, 240))
MOUTH = (150, 56, 66, 255)
TONGUE = (222, 120, 120, 255)
CHEEK = (238, 150, 140, 255)
TEAR = (163, 205, 216, 255)

SKINS = {
    'light': ((244, 202, 150), (222, 172, 122), (252, 222, 184)),
    'fair': ((250, 220, 176), (232, 192, 146), (255, 236, 206)),
    'tan': ((226, 172, 112), (200, 144, 92), (240, 198, 144)),
    'medium': ((198, 130, 76), (170, 106, 62), (216, 154, 100)),
    'brown': ((164, 102, 64), (136, 82, 52), (188, 126, 86)),
    'dark': ((140, 88, 52), (112, 68, 42), (164, 110, 72)),
}
HAIRS = {
    'brown': ((112, 72, 50), (88, 56, 42), (140, 96, 66)),
    'black': ((60, 48, 58), (44, 36, 46), (86, 72, 82)),
    'red': ((186, 82, 52), (154, 62, 44), (214, 116, 74)),
    'dark': ((74, 54, 50), (56, 40, 40), (100, 76, 70)),
    'blonde': ((230, 182, 84), (206, 150, 64), (244, 210, 122)),
}


def base(skin, hair, style):
    img = Image.new('RGBA', (S, S))
    shape(img, BG, ellipse((0, 0, S - 1, S - 1)), outline=False)
    hair_c, skin_c = HAIRS[hair], SKINS[skin]
    if style == 'long':   # cabelo comprido: desce dos dois lados do rosto
        shape(img, hair_c, rrect((2, 4, 25, 26), 6))
    if style == 'bob':    # chanel: até a altura do queixo
        shape(img, hair_c, rrect((3, 4, 24, 21), 6))
    if style == 'curly':  # crespo: cachos em volta da cabeça
        shape(img, hair_c, ellipse((4, 2, 23, 17)),
              *[ellipse(box) for box in ((2, 6, 9, 14), (18, 6, 25, 14), (8, 1, 15, 7), (13, 1, 20, 7))])
    shape(img, skin_c, ellipse((5, 6, 22, 25)))                              # cabeça (o cabelo cobre as orelhas)
    d = ImageDraw.Draw(img)
    if style in ('bob', 'long'):  # franja
        shape(img, hair_c, rrect((6, 5, 21, 10), 3))
    if style == 'spiky':
        shape(img, hair_c, rrect((6, 5, 21, 10), 3))
        for x in (8, 12, 16):
            d.polygon([(x, 6), (x + 2, 3), (x + 4, 6)], fill=rgba(hair_c[0]))
            d.point((x + 2, 3), fill=OUTLINE)
    if style == 'curly':
        shape(img, hair_c, rrect((7, 6, 20, 9), 2))
    if style == 'curl':  # topete
        shape(img, hair_c, rrect((6, 5, 21, 10), 3))
        d.line([(14, 4), (15, 2), (17, 2)], fill=OUTLINE)
    return img, d


def eyes_dots(d, y=15):
    d.rectangle((10, y, 11, y + 1), fill=OUTLINE)
    d.rectangle((16, y, 17, y + 1), fill=OUTLINE)


def eyes_wide(d, y=14):
    for x in (9, 15):
        d.rectangle((x, y, x + 3, y + 3), fill=OUTLINE)
        d.rectangle((x + 1, y + 1, x + 2, y + 2), fill=WHITE)
        d.point((x + 1, y + 1), fill=OUTLINE)


def cheeks(d, y=19):
    d.rectangle((7, y, 8, y), fill=CHEEK)
    d.rectangle((19, y, 20, y), fill=CHEEK)


def happiness():  # Ana: boca aberta curvada para cima, bochechas rosadas
    img, d = base('light', 'brown', 'bob')
    eyes_dots(d)
    d.line([(9, 13), (11, 12)], fill=OUTLINE)
    d.line([(16, 12), (18, 13)], fill=OUTLINE)
    d.polygon([(10, 19), (17, 19), (16, 22), (11, 22)], fill=MOUTH)
    d.line([(12, 21), (15, 21)], fill=TONGUE)
    cheeks(d)
    return img


def sadness():  # Caio: boca para baixo, sobrancelhas levantadas no meio, lágrima
    img, d = base('dark', 'black', 'curly')
    eyes_dots(d)
    d.line([(9, 13), (11, 12)], fill=OUTLINE)
    d.line([(16, 12), (18, 13)], fill=OUTLINE)
    d.line([(11, 22), (12, 21), (15, 21), (16, 22)], fill=OUTLINE)
    d.point((10, 18), fill=TEAR)
    d.rectangle((10, 19, 10, 20), fill=TEAR)
    return img


def anger():  # sobrancelhas baixas em "V", boca fechada para baixo
    img, d = base('tan', 'red', 'spiky')
    eyes_dots(d, 16)
    d.line([(9, 13), (12, 15)], fill=OUTLINE)
    d.line([(15, 15), (18, 13)], fill=OUTLINE)
    d.line([(11, 22), (12, 21), (15, 21), (16, 22)], fill=OUTLINE)
    return img


def fear():  # olhos arregalados, boca tremida, gota de suor
    img, d = base('medium', 'dark', 'long')
    eyes_wide(d)
    d.line([(9, 12), (11, 11)], fill=OUTLINE)
    d.line([(16, 11), (18, 12)], fill=OUTLINE)
    for i, x in enumerate(range(10, 18)):
        d.point((x, 21 + (i % 2)), fill=OUTLINE)
    d.point((21, 10), fill=TEAR)
    d.rectangle((21, 11, 21, 12), fill=TEAR)
    return img


def surprise():  # sobrancelhas levantadas, olhos arregalados, boca em "O"
    img, d = base('fair', 'blonde', 'curl')
    eyes_wide(d)
    d.line([(9, 11), (12, 11)], fill=OUTLINE)
    d.line([(15, 11), (18, 11)], fill=OUTLINE)
    shape(img, ((150, 56, 66), (124, 44, 56), (176, 80, 88)), ellipse((12, 19, 15, 23)))
    return img


def calm():  # olhos fechados, sorriso leve
    img, d = base('brown', 'dark', 'long')
    for x in (9, 15):
        d.line([(x, 15), (x + 1, 16), (x + 2, 16), (x + 3, 15)], fill=OUTLINE)
    d.line([(11, 20), (12, 21), (15, 21), (16, 20)], fill=OUTLINE)
    cheeks(d, 18)
    return img


FACES = {'happiness': happiness, 'sadness': sadness, 'anger': anger, 'fear': fear, 'surprise': surprise, 'calm': calm}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    drawn = {name: fn() for name, fn in FACES.items()}
    for name, img in drawn.items():
        img.save(OUT / f'{name}.png')
    if len(sys.argv) > 1:
        sheet = Image.new('RGBA', (len(drawn) * 32, 32), (255, 255, 255, 255))
        for i, img in enumerate(drawn.values()):
            sheet.alpha_composite(img, (i * 32 + 2, 2))
        sheet.resize((sheet.width * 5, sheet.height * 5), Image.NEAREST).save(sys.argv[1])
    print('ok', list(drawn))
