"""Desenha as molduras em pixel art da interface do jogo (9 partes, para `border-image`).

Uso, na pasta do projeto:  python tools/draw_ui.py
Gera, em assets/images/world/ui/ (12×12 px; cortes de 4 px; o CSS mostra 2×):
  frame-wood.png   moldura de madeira em volta do mapa (meio transparente)
  frame-panel.png  painel creme com relevo, para a caixa de fala e o painel de objetivo

Mesma paleta das cenas de perto (tools/closeup/pixkit.py): contorno #6b4b5b,
luz de cima/esquerda e sombra embaixo/direita.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets/images/world/ui'
OUT.mkdir(parents=True, exist_ok=True)
SIZE = 12
LAST = SIZE - 1
OUTLINE = (107, 75, 91, 255)


def ring_of(x, y):
    """Distância até a borda (0 = borda de fora), ou None no cantinho de fora (canto em degrau)."""
    corner = min(x, LAST - x) + min(y, LAST - y)
    if corner == 0:
        return None
    if corner == 1:
        return 0
    return min(x, y, LAST - x, LAST - y)


def frame(colors_by_ring, fill=None, bevel=None):
    img = Image.new('RGBA', (SIZE, SIZE))
    for y in range(SIZE):
        for x in range(SIZE):
            ring = ring_of(x, y)
            if ring is None:
                continue
            if bevel and ring == 1:
                light, shade = bevel
                color = light if (y == 1 or x == 1) and not (y == LAST - 1 or x == LAST - 1) else shade
            elif ring < len(colors_by_ring):
                color = colors_by_ring[ring]
            else:
                color = fill
            if color:
                img.putpixel((x, y), color)
    return img


wood = frame([OUTLINE, (220, 185, 138, 255), (196, 154, 108, 255), (144, 98, 93, 255)])
panel = frame([OUTLINE], fill=(255, 250, 240, 255), bevel=((255, 255, 255, 255), (234, 217, 192, 255)))
wood.save(OUT / 'frame-wood.png')
panel.save(OUT / 'frame-panel.png')
print('ok', sorted(p.name for p in OUT.iterdir()))
