"""Peças próprias do atlas desenhadas em código (16×16, paleta do Sprout Lands).

Usado por build_atlas.py. Mesmas regras das cenas de perto (tools/closeup/pixkit.py):
contorno #6b4b5b por dentro da forma, luz em cima/esquerda, sombra embaixo/direita,
3 tons por material. Tamanho igual ao das peças antigas (o espaço no mapa não muda).

Prévia ampliada:  python tools/atlas/own_art.py <arquivo.png>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'closeup'))
from pixkit import Image, ImageDraw, shape, rect, rrect, ellipse, rgba, OUTLINE, WHITE  # noqa: E402

T = 16
GRAY = ((178, 186, 202), (140, 148, 172), (208, 214, 226))
YELLOW = ((240, 204, 120), (214, 168, 90), (250, 226, 164))
SPOT = (190, 128, 84, 255)
SHELL = ((150, 188, 112), (112, 150, 92), (190, 218, 150))
SKIN_GREEN = ((200, 214, 150), (166, 184, 120), (222, 232, 180))
DUCK = ((243, 237, 242), (213, 205, 222), (255, 255, 255))
ORANGE = ((240, 164, 88), (214, 128, 72), (250, 196, 130))
BLUE = ((150, 190, 222), (110, 150, 190), (196, 222, 240))
WOOD = ((196, 154, 108), (170, 121, 89), (220, 185, 138))
SCREEN = ((96, 112, 146), (74, 86, 120), (140, 160, 190))
FRAME = ((190, 196, 210), (150, 158, 176), (222, 226, 236))
EYE = OUTLINE


def canvas():
    return Image.new('RGBA', (T, T))


def elephant():
    img = canvas()
    shape(img, GRAY, rect((5, 13, 7, 15)), rect((11, 13, 13, 15)))       # pernas de trás (mais escuras)
    shape(img, GRAY, ellipse((4, 4, 15, 13)))                              # corpo
    shape(img, GRAY, rect((6, 12, 8, 15)), rect((12, 12, 14, 15)))         # pernas da frente
    shape(img, GRAY, ellipse((0, 3, 8, 11)), rect((0, 8, 2, 14)))          # cabeça e tromba
    shape(img, ((160, 168, 190), GRAY[1], GRAY[0]), ellipse((5, 4, 9, 9)))           # orelha
    d = ImageDraw.Draw(img)
    d.point((2, 6), fill=EYE)
    d.point((3, 10), fill=WHITE)                                           # presa
    d.point((15, 8), fill=OUTLINE)                                         # rabinho
    return img


def giraffe():
    img = canvas()
    d = ImageDraw.Draw(img)
    for x in (7, 9, 12, 14):  # pernas finas (1 px), com casquinho escuro
        d.line([(x, 11), (x, 14)], fill=rgba(YELLOW[1]))
        d.point((x, 15), fill=OUTLINE)
    # corpo, pescoço e cabeça numa forma só (um contorno contínuo)
    shape(img, YELLOW, ellipse((6, 7, 15, 12)),
          lambda dd: dd.polygon([(2, 3), (7, 2), (11, 8), (6, 10)], fill=1),
          rrect((0, 0, 7, 5), 1))
    for x, y in ((10, 9), (13, 9), (12, 10), (6, 6), (8, 8)):
        d.point((x, y), fill=SPOT)
    d.point((2, 2), fill=EYE)
    d.point((4, 0), fill=SPOT)                                             # chifrinho
    return img


def turtle():
    img = canvas()
    shape(img, SKIN_GREEN, rect((3, 12, 5, 14)), rect((10, 12, 12, 14)))  # patas
    shape(img, SKIN_GREEN, ellipse((11, 7, 15, 11)))                       # cabeça
    shape(img, SHELL, ellipse((1, 5, 13, 13)))                             # casco
    d = ImageDraw.Draw(img)
    d.line([(4, 9), (10, 9)], fill=rgba(SHELL[1]))
    d.line([(7, 6), (7, 9)], fill=rgba(SHELL[1]))                          # desenho do casco
    d.point((13, 8), fill=EYE)
    return img


def duck():
    img = canvas()
    shape(img, ORANGE, rect((6, 13, 7, 15)), rect((9, 13, 10, 15)))       # patas
    shape(img, DUCK, ellipse((2, 7, 13, 14)))                              # corpo
    shape(img, DUCK, ellipse((7, 1, 13, 8)))                               # cabeça
    shape(img, ORANGE, rrect((12, 4, 15, 6), 1))                           # bico
    d = ImageDraw.Draw(img)
    d.line([(5, 10), (9, 10)], fill=rgba(DUCK[1]))                         # asa
    d.point((10, 3), fill=EYE)
    return img


def tv():
    img = canvas()
    shape(img, WOOD, rect((1, 10, 14, 15)))                                # móvel
    d = ImageDraw.Draw(img)
    d.line([(2, 12), (13, 12)], fill=rgba(WOOD[1]))
    shape(img, FRAME, rrect((2, 1, 13, 10), 1))                            # televisão
    shape(img, SCREEN, rect((4, 3, 11, 8)), outline=False)                 # tela
    d.line([(5, 7), (8, 4)], fill=rgba(SCREEN[2]))                         # reflexo
    return img


def sofa():
    img = canvas()
    shape(img, BLUE, rrect((2, 2, 13, 9), 2))                              # encosto
    shape(img, BLUE, rect((2, 8, 13, 13)))                                 # assento
    shape(img, BLUE, rrect((0, 5, 3, 14), 1), rrect((12, 5, 15, 14), 1))  # braços
    d = ImageDraw.Draw(img)
    d.line([(7, 9), (7, 12)], fill=rgba(BLUE[1]))                          # almofadas
    d.rectangle((1, 15, 2, 15), fill=OUTLINE)
    d.rectangle((13, 15, 14, 15), fill=OUTLINE)                            # pés
    return img


BLACK = (0, 0, 0, 255)


def mark_todo_hc():
    """Balão "!" para o alto contraste: contorno preto de 2 px, fundo branco, "!" preto."""
    img = canvas()
    d = ImageDraw.Draw(img)
    d.rectangle((2, 0, 13, 12), fill=BLACK)
    d.rectangle((4, 2, 11, 10), fill=WHITE)
    d.polygon([(5, 12), (9, 12), (5, 15)], fill=BLACK)          # rabinho do balão
    d.rectangle((7, 3, 8, 7), fill=BLACK)
    d.rectangle((7, 9, 8, 9), fill=BLACK)                       # "!"
    return img


def mark_done_hc():
    """Estrela para o alto contraste: contorno preto grosso, amarelo forte."""
    img = canvas()
    star = [(8, 0), (10, 5), (15, 5), (11, 9), (13, 15), (8, 11), (3, 15), (5, 9), (1, 5), (6, 5)]
    d = ImageDraw.Draw(img)
    d.polygon(star, fill=BLACK)
    inner = [(8, 3), (9, 7), (12, 7), (10, 9), (11, 12), (8, 10), (5, 12), (6, 9), (4, 7), (7, 7)]
    d.polygon(inner, fill=(255, 214, 0, 255))
    return img


PIECES = {'elephant': elephant, 'giraffe': giraffe, 'turtle': turtle, 'duck': duck, 'tv': tv, 'sofa': sofa,
          'markTodoHc': mark_todo_hc, 'markDoneHc': mark_done_hc}


def draw_all():
    return {name: fn() for name, fn in PIECES.items()}


if __name__ == '__main__':
    art = draw_all()
    sheet = Image.new('RGBA', (len(art) * 20, 20), (150, 190, 120, 255))
    for i, im in enumerate(art.values()):
        sheet.alpha_composite(im, (i * 20 + 2, 2))
    sheet.resize((sheet.width * 6, sheet.height * 6), Image.NEAREST).save(sys.argv[1])
    print('ok', list(art))
