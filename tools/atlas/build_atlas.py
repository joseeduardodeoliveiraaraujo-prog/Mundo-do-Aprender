# Monta assets/images/world/atlas.png e js/data/world/atlas.js a partir de:
#
# Uso, na pasta do projeto:
#   python tools/atlas/build_atlas.py <pasta-dos-pacotes> tools/atlas/sources/home.png .
# <pasta-dos-pacotes> tem as pastas sprout/ (Sprout Lands Basic, Cup Nooble) e ninja/
# (Ninja Adventure); eles não ficam no projeto (licença). Links em assets/images/world/CREDITS.md.
# tools/atlas/sources/: home.png (peças próprias) e town.png (Kenney Tiny Town, CC0).
#
#   Sprout Lands (Cup Nooble) — cenário, casa, móveis, natureza, vaca, galinha
#   Ninja Adventure (CC0) — Noa e pessoas (cores suavizadas), alguns animais
#   home.png (peças próprias do projeto) — o que falta nos pacotes
import sys, json, colorsys, os
from PIL import Image, ImageDraw

ART, HOME, PROJECT = sys.argv[1], sys.argv[2], sys.argv[3]
SP = f'{ART}/sprout/Sprout Lands - Sprites - Basic pack'
NJ = f'{ART}/ninja/Ninja Adventure - Asset Pack'
T = 16

def load(path):
    return Image.open(path).convert('RGBA')

sheets = {
    'grass': load(f'{SP}/Tilesets/Grass.png'),
    'dirt': load(f'{SP}/Tilesets/Tilled_Dirt.png'),
    'water': load(f'{SP}/Tilesets/Water.png'),
    'fence': load(f'{SP}/Tilesets/Fences.png'),
    'walls': load(f'{SP}/Tilesets/Wooden_House_Walls_Tilset.png'),
    'roof': load(f'{SP}/Tilesets/Wooden_House_Roof_Tilset.png'),
    'house': load(f'{SP}/Tilesets/Wooden House.png'),
    'doors': load(f'{SP}/Tilesets/Doors.png'),
    'furn': load(f'{SP}/Objects/Basic_Furniture.png'),
    'biome': load(f'{SP}/Objects/Basic_Grass_Biom_things.png'),
    'plants': load(f'{SP}/Objects/Basic_Plants.png'),
    'chickenHouse': load(f'{SP}/Objects/Free_Chicken_House.png'),
    'cow': load(f'{SP}/Characters/Free Cow Sprites.png'),
    'chicken': load(f'{SP}/Characters/Free Chicken Sprites.png'),
    'bridge': load(f'{SP}/Objects/Wood_Bridge.png'),
    'home': load(HOME),
}

OUTLINE = (0x6b, 0x4b, 0x5b)

def soften(im, outline=True):
    """Aproxima da paleta do Sprout Lands: contorno marrom-arroxeado, cores mais claras e menos saturadas."""
    im = im.copy(); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0: continue
            h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if outline and l < 0.2:
                px[x, y] = OUTLINE + (a,); continue
            l = min(1, l * 0.85 + 0.15); s *= 0.8
            r, g, b = colorsys.hls_to_rgb(h, l, s)
            px[x, y] = (int(r * 255), int(g * 255), int(b * 255), a)
    return im

def recolor(im, mapping):
    im = im.copy(); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            key = '#%02x%02x%02x' % (r, g, b)
            if a and key in mapping:
                c = mapping[key]; px[x, y] = (int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16), a)
    return im

pieces = {}  # nome -> imagem

def tile(name, sheet, col, row, w=1, h=1):
    pieces[name] = sheets[sheet].crop((col * T, row * T, (col + w) * T, (row + h) * T))

def nine(prefix, sheet, c0, r0, cols=(0, 1, 2), rows=(0, 1, 2)):
    names = [['TL', 'T', 'TR'], ['L', 'C', 'R'], ['BL', 'B', 'BR']]
    for ri, r in enumerate(rows):
        for ci, c in enumerate(cols):
            tile(f'{prefix}{names[ri][ci]}', sheet, c0 + c, r0 + r)

# ---------- Terrenos (encaixe automático) ----------
for terrain in ('grass', 'dirt'):
    nine(f'{terrain}9', terrain, 0, 0)
    tile(f'{terrain}VTop', terrain, 3, 0); tile(f'{terrain}VMid', terrain, 3, 1); tile(f'{terrain}VBottom', terrain, 3, 2)
    tile(f'{terrain}HLeft', terrain, 0, 3); tile(f'{terrain}HMid', terrain, 1, 3); tile(f'{terrain}HRight', terrain, 2, 3)
    tile(f'{terrain}Dot', terrain, 3, 3)
for i, (c, r) in enumerate([(0, 5), (1, 5), (2, 5), (0, 6), (1, 6), (2, 6), (3, 5), (5, 5), (5, 6)]):
    tile(f'grassVar{i}', 'grass', c, r)
for i, (c, r) in enumerate([(0, 5), (1, 5), (2, 5), (0, 6), (1, 6), (2, 6)]):
    tile(f'dirtVar{i}', 'dirt', c, r)
tile('water', 'water', 0, 0)
for col in range(4):
    for row in range(4):
        tile(f'fence{col}{row}', 'fence', col, row)

# ---------- Casa (interior e exterior) ----------
nine('room9', 'walls', 0, 0)
tile('roomWindow', 'house', 1, 0)
tile('frontWall', 'walls', 3, 1); tile('frontWall2', 'walls', 4, 1); tile('frontWindow', 'walls', 3, 2)
tile('roofTL', 'roof', 3, 2); tile('roofT', 'roof', 4, 2); tile('roofTR', 'roof', 6, 2)
tile('roofL', 'roof', 3, 3); tile('roofC', 'roof', 4, 3); tile('roofR', 'roof', 6, 3)
tile('roofBL', 'roof', 3, 4); tile('roofB', 'roof', 4, 4); tile('roofBR', 'roof', 6, 4)
tile('chimney', 'roof', 5, 0)
tile('door', 'doors', 0, 1)

# ---------- Móveis ----------
for i, c in enumerate(range(3)): tile(f'painting{i}', 'furn', c, 0)
tile('plantPot', 'furn', 3, 0); tile('plantSmall', 'furn', 4, 0); tile('plantFlower', 'furn', 5, 0)
tile('lampGreen', 'furn', 3, 1); tile('lampBlue', 'furn', 4, 1); tile('lampPink', 'furn', 5, 1)
tile('bedGreen', 'furn', 0, 1, 1, 2); tile('bedBlue', 'furn', 1, 1, 1, 2); tile('bedPink', 'furn', 2, 1, 1, 2)
tile('drawers', 'furn', 3, 2); tile('chairLeft', 'furn', 4, 2); tile('chairRight', 'furn', 5, 2)
tile('chairBack', 'furn', 6, 2); tile('cabinet', 'furn', 7, 2)
tile('table', 'furn', 3, 3); tile('stool', 'furn', 4, 3)
tile('alarmClock', 'furn', 5, 3); tile('wallClock', 'furn', 6, 3); tile('smallClock', 'furn', 7, 3)
tile('rugGreen', 'furn', 0, 5); tile('rugPink', 'furn', 1, 5); tile('rugBlue', 'furn', 2, 5)
tile('rugWideGreen', 'furn', 3, 5, 2, 1); tile('rugWidePink', 'furn', 5, 5, 2, 1); tile('rugWideBlue', 'furn', 7, 5, 2, 1)

# ---------- Natureza ----------
tile('treeTall', 'biome', 0, 0, 1, 2); tile('treeBig', 'biome', 1, 0, 2, 2); tile('treeApple', 'biome', 3, 0, 2, 2)
tile('mushroomBig', 'biome', 5, 0); tile('mushroom', 'biome', 6, 0); tile('mushroomPurple', 'biome', 7, 0)
tile('leaves', 'biome', 5, 1); tile('sprouts', 'biome', 6, 1); tile('rockSmall', 'biome', 7, 1); tile('rockBig', 'biome', 8, 1)
tile('stump', 'biome', 4, 2); tile('log', 'biome', 5, 2)
tile('flowerYellow', 'biome', 6, 2); tile('flowersYellow', 'biome', 7, 2); tile('sunflower', 'biome', 8, 2, 1, 2)
tile('berryBush', 'biome', 0, 3); tile('bush', 'biome', 1, 3)
tile('flowerBlue', 'biome', 5, 3); tile('flowerPink', 'biome', 6, 3); tile('flowersPink', 'biome', 7, 3)
tile('bushLong', 'biome', 0, 4, 2, 1); tile('rockLarge', 'biome', 5, 4); tile('rock', 'biome', 6, 4)
tile('lily', 'biome', 7, 4); tile('lilyBig', 'biome', 8, 4)
tile('cropWheat', 'plants', 3, 0); tile('cropCorn', 'plants', 4, 0); tile('cropSprout', 'plants', 1, 0)
tile('chickenHouse', 'chickenHouse', 0, 0, 3, 3)
tile('bridgeH', 'bridge', 2, 0, 3, 1)

# ---------- Animais ----------
pieces['cow'] = sheets['cow'].crop((0, 0, 32, 32))
pieces['chicken'] = sheets['chicken'].crop((0, 0, 16, 16))
def ninja_animal(name, path, w=16, h=16):
    pieces[name] = soften(load(f'{NJ}/Actor/Animal/{path}').crop((0, 0, w, h)))
ninja_animal('cat', 'Cat/SpriteSheet.png')
ninja_animal('dog', 'Dog/SpriteSheet.png')
ninja_animal('horse', 'Horse/SpriteSheetBrown.png')
ninja_animal('fish', 'Fish/SpriteSheetYellow.png')
ninja_animal('monkey', 'Monkey/SpriteSheetBrown.png')
ninja_animal('lion', 'Lion/SpriteSheetYellow.png', 16, 23)
pieces['shadow'] = soften(load(f'{NJ}/Actor/Character/Shadow.png'), outline=False)

# ---------- Peças próprias (home.png), suavizadas ----------
def own(name, index):
    pieces[name] = soften(sheets['home'].crop((index * T, 0, (index + 1) * T, T)))
for name, index in [('markTodo', 12), ('markDone', 13), ('sink', 14), ('fridge', 15), ('sofa', 16), ('tv', 18),
                    ('bench', 20), ('bathFloor', 21), ('duck', 26), ('elephant', 28), ('giraffe', 29), ('turtle', 30),
                    ('boardLeft', 34), ('boardMiddle', 35), ('boardRight', 36), ('toys', 10)]:
    own(name, index)
# despertador tocando = relógio do Sprout com traços em cima
ring = pieces['alarmClock'].copy(); d = ImageDraw.Draw(ring)
for x0, y0, x1, y1 in [(2, 3, 4, 1), (8, 2, 8, 0), (14, 3, 12, 1)]:
    d.line([(x0, y0), (x1, y1)], fill=(0xe3, 0x86, 0x28, 255))
pieces['alarmRinging'] = ring
pieces['alarmQuiet'] = pieces.pop('alarmClock')

# ---------- Kenney Tiny Town (CC0), suavizado ----------
town = load(HOME.replace('home.png', 'town.png'))
for name, index in [('backpack', 107), ('sign', 83)]:
    pieces[name] = soften(town.crop(((index % 12) * T, (index // 12) * T, (index % 12 + 1) * T, (index // 12 + 1) * T)))

# ---------- Pessoas (Ninja Adventure): 4 direções × 4 passos ----------
def person_sheet(path, mapping=None):
    im = load(f'{NJ}/Actor/Character/{path}/SpriteSheet.png').crop((0, 0, 64, 64))
    return soften(recolor(im, mapping) if mapping else im)
noa = person_sheet('Boy', {'#d14b34': '#7a5040', '#e3f1f5': '#8cc9da'})
DIRS = ['down', 'up', 'left', 'right']
for row in range(4):
    for col, direction in enumerate(DIRS):
        pieces[f'noa-{direction}-{row}'] = noa.crop((col * T, row * T, (col + 1) * T, (row + 1) * T))
for name, path in [('personTeacher', 'Woman'), ('personLia', 'Villager4'), ('personDavi', 'Villager3'),
                   ('personKid', 'Child'), ('personBia', 'Villager2'), ('personFarmer', 'OldMan'),
                   ('personKeeper', 'Hunter'), ('personTeo', 'Villager'), ('personGabi', 'Villager5')]:
    pieces[name] = person_sheet(path).crop((0, 0, T, T))

# ---------- Rostos para a caixa de diálogo (PNG separados, 38×38) ----------
os.makedirs(f'{PROJECT}/assets/images/world/faces', exist_ok=True)
FACES = [('noa', 'Boy', {'#d14b34': '#7a5040', '#e3f1f5': '#8cc9da'}), ('personTeacher', 'Woman', None),
         ('personLia', 'Villager4', None), ('personDavi', 'Villager3', None), ('personKid', 'Child', None),
         ('personBia', 'Villager2', None), ('personFarmer', 'OldMan', None), ('personKeeper', 'Hunter', None),
         ('personTeo', 'Villager', None), ('personGabi', 'Villager5', None)]
for name, path, mapping in FACES:
    face = load(f'{NJ}/Actor/Character/{path}/Faceset.png')
    soften(recolor(face, mapping) if mapping else face).save(f'{PROJECT}/assets/images/world/faces/{name}.png', optimize=True)

# ---------- Pisos próprios (contraste baixo: o chão não compete com móveis e pessoas) ----------
def floor_wood(offset):
    """Tábuas de madeira na horizontal, 4 px de altura; poucas emendas, desencontradas."""
    im = Image.new('RGBA', (T, T), (0xe2, 0xc0, 0x92, 255)); d = ImageDraw.Draw(im)
    for k in range(4):
        y = k * 4
        d.line((0, y + 3, T - 1, y + 3), fill=(0xcc, 0xa6, 0x78, 255))      # fresta entre tábuas
        d.point(((k * 3 + 2 + offset) % T, y + 1), fill=(0xec, 0xce, 0xa4, 255))  # brilho da madeira
        if k % 2:  # emenda só em uma a cada duas tábuas: tábuas longas, sem cara de tijolo
            seam = (k * 5 + 4 + offset) % T
            d.line((seam, y, seam, y + 2), fill=(0xcc, 0xa6, 0x78, 255))
        else:
            d.point(((k * 5 + 9 + offset) % T, y + 2), fill=(0xd6, 0xb2, 0x86, 255))  # veio
    return im

def floor_checker(light, dark, dot=None):
    """Lajotas 8×8 em xadrez suave."""
    im = Image.new('RGBA', (T, T), light + (255,)); d = ImageDraw.Draw(im)
    d.rectangle((8, 0, 15, 7), fill=dark + (255,)); d.rectangle((0, 8, 7, 15), fill=dark + (255,))
    if dot:
        for x, y in ((2, 3), (12, 5), (5, 12), (11, 13)):
            d.point((x, y), fill=dot + (255,))
    return im

pieces['floorWood'] = floor_wood(0)
pieces['floorKitchen'] = floor_checker((0xf2, 0xe6, 0xcc), (0xe6, 0xd6, 0xb6))
pieces['floorSchool'] = floor_checker((0xd8, 0xe2, 0xd6), (0xcc, 0xd8, 0xcc), dot=(0xe6, 0xee, 0xe4))

# ---------- Pista (lupa) para o detetive ----------
clue = Image.new('RGBA', (16, 16), (0, 0, 0, 0)); d = ImageDraw.Draw(clue)
d.ellipse((2, 1, 11, 10), fill=(0xcb, 0xe0, 0xde, 255), outline=OUTLINE + (255,))
d.ellipse((4, 3, 6, 5), fill=(255, 255, 255, 255))
d.line((10, 9, 14, 13), fill=OUTLINE + (255,), width=3)
d.line((10, 9, 13, 12), fill=(0xc4, 0x9a, 0x6c, 255), width=1)
pieces['clue'] = clue

# ---------- Empacotamento ----------
WIDTH = 512
order = sorted(pieces.items(), key=lambda kv: (-kv[1].height, kv[0]))
x = y = shelf = 0
frames = {}
placed = []
for name, im in order:
    if x + im.width > WIDTH:
        x = 0; y += shelf; shelf = 0
    frames[name] = [x, y, im.width, im.height]
    placed.append((im, x, y))
    x += im.width; shelf = max(shelf, im.height)
height = y + shelf
atlas = Image.new('RGBA', (WIDTH, height), (0, 0, 0, 0))
for im, px, py in placed:
    atlas.alpha_composite(im, (px, py))
atlas.save(f'{PROJECT}/assets/images/world/atlas.png', optimize=True)

lines = ',\n'.join(f"  {json.dumps(n) if not n.isidentifier() else n}: [{', '.join(map(str, frames[n]))}]" for n in sorted(frames))
js = f"""/**
 * Atlas de imagens do Bairro do Noa (somente dados): nome → [x, y, largura, altura]
 * em pixels dentro de assets/images/world/atlas.png.
 *
 * Gerado por script a partir de Sprout Lands (Cup Nooble), Ninja Adventure
 * (CC0) e peças próprias; origem e licenças em assets/images/world/CREDITS.md.
 * Não edite à mão: gere de novo o atlas.
 */

/** Tamanho de um bloco do mapa, em pixels. */
export const TILE_SIZE = 16;

export const ATLAS_SRC = 'assets/images/world/atlas.png';

export const ATLAS_FRAMES = Object.freeze({{
{lines},
}});
"""
open(f'{PROJECT}/js/data/world/atlas.js', 'w', encoding='utf-8').write(js)
print('atlas', WIDTH, height, len(frames), 'peças')
