# Desenho dos mapas (executado por build_maps.py).
import random

ROOM_LEGEND = {
    '#': {'room': True, 'solid': True},
    'w': {'room': True, 'solid': True, 'tile': 'roomWindow'},
    'E': {'room': True, 'tile': 'door'},
    '.': {'floor': 'floorWood'},
    '_': {'floor': 'bathFloor'},
    'k': {'floor': 'floorKitchen'},
}

def room(cols, rows, windows=(), door=None, extra=None):
    g = []
    for y in range(rows):
        line = ''
        for x in range(cols):
            edge = y in (0, rows - 1) or x in (0, cols - 1)
            ch = '#' if edge else '.'
            if y == 0 and x in windows: ch = 'w'
            if y == rows - 1 and x == door: ch = 'E'
            if extra and (x, y) in extra: ch = extra[(x, y)]
            line += ch
        g.append(line)
    return g

# =====================================================================
# Casa do Noa (16 × 11): quarto à esquerda, banheiro no meio, cozinha e sala à direita
# =====================================================================
bath = {(x, y): '_' for x in range(6, 10) for y in range(1, 4)}
kitchen = {(x, y): 'k' for x in range(10, 15) for y in range(1, 5)}
house = {
    'id': 'house', 'name': 'Casa do Noa', 'background': '#5c4452',
    'welcome': 'Estou em casa. Os balões mostram onde tem desafio.',
    'ground': room(16, 11, windows=(3, 11), door=8, extra={**bath, **kitchen}),
    'legend': ROOM_LEGEND,
    'objects': [
        {'art': 'painting0', 'x': 1, 'y': 0, 'solid': 'none'},
        {'art': 'painting2', 'x': 13, 'y': 0, 'solid': 'none'},
        {'art': 'wallClock', 'x': 8, 'y': 0, 'solid': 'none'},
        {'art': 'cabinet', 'x': 2, 'y': 1},
        {'art': 'drawers', 'x': 4, 'y': 1},
        {'art': 'plantPot', 'x': 5, 'y': 1},
        {'art': 'rugWideBlue', 'x': 2, 'y': 4, 'solid': 'none'},
        # banheiro: vaso sanitário e banheira ao lado da pia; cozinha: bancada e fogão embaixo da janela
        {'art': 'toilet', 'x': 6, 'y': 1}, {'art': 'bathtub', 'x': 8, 'y': 1},
        {'art': 'kitchenCounter', 'x': 10, 'y': 1}, {'art': 'stove', 'x': 11, 'y': 1}, {'art': 'kitchenCounter', 'x': 12, 'y': 1},
        {'art': 'cabinet', 'x': 14, 'y': 1},
        {'art': 'chairLeft', 'x': 11, 'y': 3},
        {'art': 'chairRight', 'x': 13, 'y': 3},
        {'art': 'tv', 'x': 12, 'y': 6},
        {'art': 'rugWidePink', 'x': 11, 'y': 7, 'solid': 'none'},
        {'art': 'lampGreen', 'x': 14, 'y': 8},
        {'art': 'rugGreen', 'x': 8, 'y': 8, 'solid': 'none'},
        # canto de estudo no meio da casa e um tapete grande (composição: o miolo da sala não fica vazio)
        {'art': 'table', 'x': 7, 'y': 5}, {'art': 'chairBack', 'x': 7, 'y': 6},
        {'art': 'rugWideGreen', 'x': 4, 'y': 8, 'solid': 'none'},
        {'art': 'plantPot', 'x': 1, 'y': 5},
        {'art': 'painting1', 'x': 6, 'y': 0, 'solid': 'none'},
        # quarto: prateleira na parede e estante; sala: poltrona perto do abajur
        {'art': 'wallShelf', 'x': 4, 'y': 0, 'solid': 'none'}, {'art': 'bookshelf', 'x': 1, 'y': 6},
        {'art': 'armchair', 'x': 14, 'y': 7},
    ],
    'doors': [{'x': 8, 'y': 10, 'to': 'neighborhood', 'spawn': {'x': 6, 'y': 7}, 'facing': 'down', 'label': 'Sair para o bairro'}],
    'spots': [
        {'id': 'house-alarm', 'label': 'Despertador', 'art': 'alarmRinging', 'usedArt': 'alarmQuiet', 'x': 2, 'y': 1, 'lift': 7,
         'prompt': 'Desliguei o despertador. Bom dia! Vamos começar a manhã?', 'challenge': {'module': 'routine', 'part': 'wake'}},
        {'id': 'house-bed', 'label': 'Cama', 'art': 'bedBlue', 'x': 1, 'y': 1, 'solid': 'all',
         'prompt': 'Esta é a minha cama. Vamos preparar a hora de dormir?', 'challenge': {'module': 'routine', 'part': 'sleep'}},
        {'id': 'house-toys', 'label': 'Brinquedos', 'art': 'toys', 'x': 4, 'y': 6,
         'prompt': 'Meus brinquedos: uma bola e um bloco.'},
        {'id': 'house-window', 'label': 'Janela do quarto', 'cells': [{'x': 3, 'y': 0}],
         'prompt': 'A janela do meu quarto. Dá para ver o bairro lá fora.'},
        {'id': 'house-lamp', 'label': 'Abajur', 'art': 'lampBlue', 'x': 1, 'y': 9,
         'prompt': 'O abajur ilumina o quarto à noite.'},
        {'id': 'house-dog', 'label': 'Cachorro', 'art': 'dog', 'x': 3, 'y': 8, 'animal': 'dog'},
        {'id': 'house-sink', 'label': 'Pia do banheiro', 'art': 'sink', 'x': 7, 'y': 1,
         'prompt': 'Aqui eu lavo as mãos. Vamos aprender o passo a passo?', 'challenge': {'module': 'routine', 'part': 'hygiene'}},
        {'id': 'house-fridge', 'label': 'Geladeira', 'art': 'fridge', 'x': 13, 'y': 1,
         'prompt': 'A geladeira. Quando eu quero alguma coisa, eu mostro para a Gabi.'},
        {'id': 'house-gabi', 'label': 'Gabi', 'name': 'Gabi', 'art': 'personGabi', 'x': 14, 'y': 4,
         'prompt': 'Oi, Noa! Se você precisar de alguma coisa, é só me mostrar.', 'challenge': {'module': 'communication', 'part': 'home'}},
        {'id': 'house-table', 'label': 'Mesa da cozinha', 'art': 'table', 'x': 12, 'y': 3,
         'prompt': 'Hora do lanche! Antes de comer, o que eu faço?', 'challenge': {'module': 'routine', 'part': 'food'}},
        {'id': 'house-sofa', 'label': 'Sofá', 'art': 'sofa', 'x': 12, 'y': 8,
         'prompt': 'Depois da escola eu descanso. Vamos escolher o que fazer?', 'challenge': {'module': 'routine', 'part': 'leisure'}},
        {'id': 'house-backpack', 'label': 'Mochila', 'art': 'backpack', 'x': 10, 'y': 9,
         'prompt': 'Minha mochila da escola. Vamos arrumar?', 'challenge': {'module': 'routine', 'part': 'school'}},
        {'id': 'house-cat', 'label': 'Gato', 'art': 'cat', 'x': 5, 'y': 8, 'animal': 'cat',
         'prompt': 'Este é o meu gato. Vamos conhecer os animais que moram com a gente?', 'challenge': {'module': 'animals', 'part': 'house'}},
    ],
}

# =====================================================================
# Bairro (40 × 28): ilha de grama com ruas de pedra, praça de terra, rio à direita
# =====================================================================
random.seed(11)
W, H = 40, 28
g = [['~'] * W for _ in range(H)]
def fill(x0, y0, x1, y1, ch):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1): g[y][x] = ch
# ilha principal e margem do rio, com contorno irregular
fill(1, 1, 32, 26, 'g'); fill(35, 1, 38, 26, 'g')
for y in range(1, 27):
    for x in list(range(1, 3)) + list(range(31, 33)) + list(range(35, 37)) + list(range(37, 39)):
        if random.random() < 0.18 and g[y][x] == 'g' and x in (1, 32, 35, 38): g[y][x] = '~'
for x in range(1, 39):
    for y in (1, 26):
        if random.random() < 0.2 and g[y][x] == 'g': g[y][x] = '~'
# ponte sobre o rio
for x in range(33, 35):
    g[8][x] = g[9][x] = 'B'      # ponte da largura da rua (2 linhas)
# ruas de pedra (a grama aparece entre as pedras) e praça de terra
fill(3, 8, 32, 9, 's')               # rua principal até a ponte
fill(35, 8, 37, 9, 's')              # chegada do outro lado da ponte
fill(6, 7, 6, 7, 's')                # porta da casa do Noa
fill(27, 7, 27, 7, 's')              # porta da escola
fill(11, 7, 11, 7, 's')              # porta da casa da Lia
fill(17, 10, 18, 25, 's')            # rua para o sul
fill(7, 10, 8, 15, 's')              # caminho da fazendinha
fill(26, 10, 27, 17, 's')            # caminho do zoológico
fill(12, 12, 23, 17, 'p')            # praça
ground = [''.join(r) for r in g]

trees = []
def tree(art, x, y): trees.append({'art': art, 'x': x, 'y': y})
# fileira no topo (atrás): árvores grandes; em cima da escola, menores (a escola começa na linha 2)
for x in range(1, 20, 3):
    tree('treeOakFruit' if x % 2 else 'treeOak', x, 0)
for (x, a) in [(22, 'treePine'), (24, 'treeBig'), (27, 'treeApple'), (30, 'treePine')]:
    tree(a, x, 0)
for (x, y, a) in [(1, 10, 'treeTall'), (1, 13, 'treeBig'), (21, 3, 'treeApple'), (15, 3, 'treeTall'), (29, 10, 'treeOak'),
                  (10, 11, 'treeTall'), (24, 11, 'treeTall'), (13, 18, 'treeOak'), (19, 20, 'treeOakFruit'), (14, 23, 'treeTall'),
                  (36, 3, 'treeBig'), (38, 6, 'treeTall'), (35, 16, 'treeOakFruit'), (37, 21, 'treeBig'), (35, 23, 'treePine'),
                  (30, 24, 'treeTall'), (19, 4, 'bush')]:
    tree(a, x, y)
decor = []
def d(art, x, y, solid='none'): decor.append({'art': art, 'x': x, 'y': y, 'solid': solid})
for (x, y, a) in [(4, 11, 'flowerPink'), (5, 12, 'flowersYellow'), (11, 7, 'flowerBlue'), (13, 6, 'flowersPink'), (20, 6, 'flowerYellow'),
                  (23, 10, 'mushroom'), (29, 6, 'flowersYellow'), (3, 6, 'sprouts'), (31, 15, 'flowerPink'), (12, 18, 'flowersYellow'),
                  (22, 18, 'flowerBlue'), (16, 21, 'mushroomBig'), (16, 22, 'flowersPink'), (24, 15, 'leaves'), (10, 9, 'leaves'),
                  (37, 11, 'mushroomPurple'), (36, 19, 'flowersPink'), (38, 15, 'flowerBlue'),
                  # canteiros nos gramados vazios (entre as casas e dos lados da praça)
                  (16, 5, 'flowersYellow'), (19, 5, 'flowerPink'), (17, 6, 'flowerBlue'),
                  (3, 9, 'flowersYellow'), (6, 10, 'flowerBlue'), (9, 12, 'flowersPink'), (11, 12, 'flowersPink'),
                  (25, 9, 'flowersPink'), (28, 12, 'flowersYellow'), (29, 9, 'flowerBlue'), (24, 12, 'flowersYellow')]:
    d(a, x, y)
# objetos do bairro (tools/atlas/props.py): bloqueiam só o bloco de baixo
props = [{'art': a, 'x': x, 'y': y} for (a, x, y) in [
    ('mailbox', 5, 7), ('barrel', 3, 5), ('crate', 9, 6), ('barrel', 14, 6), ('pot', 14, 5),   # casas
    ('pot', 26, 7), ('pot', 28, 7),                                                            # porta da escola
    ('lampPost', 16, 6), ('lampPost', 30, 6), ('lampPost', 12, 11), ('lampPost', 23, 11),      # rua e praça
    ('barrel', 31, 7), ('hayBale', 4, 24), ('hayBale', 5, 24),                                  # ponte e fazendinha
]]
# flores em canteiros (grupos), no lugar das flores soltas
PATCHES = {'flowerPink': 'flowerPatchPink', 'flowersPink': 'flowerPatchMix', 'flowerYellow': 'flowerPatchYellow',
           'flowersYellow': 'flowerPatchYellow', 'flowerBlue': 'flowerPatchBlue'}
for item in decor:
    item['art'] = PATCHES.get(item['art'], item['art'])
# tufos de grama e pedrinhas espalhados na grama livre (sorteio fixo: o mapa é sempre igual)
taken = {(o['x'], o['y']) for o in decor + trees + props} | {(o['x'], o['y'] + 1) for o in props}
for y in range(2, 26):
    for x in range(2, 32):
        if g[y][x] == 'g' and (x, y) not in taken and random.random() < 0.06:
            d(random.choice(['grassTuft0', 'grassTuft1', 'grassTuft0', 'pebbles']), x, y)
decor[:] = [o for o in decor if g[o['y']][o['x']] != 's']   # nada de flor em cima das pedras da rua
for (x, y, a) in [(20, 23, 'rockBig'), (31, 20, 'rockSmall'), (2, 23, 'rock'), (11, 23, 'stump'), (33, 4, 'lily'), (34, 20, 'lilyBig'),
                  (33, 23, 'lily')]:
    d(a, x, y, 'base' if a in ('rockBig', 'stump') else 'none')
d('bridge', 33, 8)   # tools/atlas/props.py: cobre só a água (colunas 33 e 34)
farm_objects = [
    {'art': 'gardenBed', 'x': 9, 'y': 18, 'solid': 'none'},   # canteiro embaixo das plantas
    {'art': 'chickenHouse', 'x': 3, 'y': 21},
    {'art': 'cropWheat', 'x': 9, 'y': 18}, {'art': 'cropWheat', 'x': 10, 'y': 18}, {'art': 'cropCorn', 'x': 11, 'y': 18},
    {'art': 'cropCorn', 'x': 9, 'y': 19}, {'art': 'cropSprout', 'x': 10, 'y': 19}, {'art': 'cropSprout', 'x': 11, 'y': 19},
    {'art': 'cropSprout', 'x': 9, 'y': 20}, {'art': 'cropWheat', 'x': 10, 'y': 20}, {'art': 'cropCorn', 'x': 11, 'y': 20},
    {'art': 'sunflower', 'x': 11, 'y': 22},
]
zoo_objects = [{'art': 'rockLarge', 'x': 30, 'y': 21}, {'art': 'treeTall', 'x': 23, 'y': 22}, {'art': 'bush', 'x': 29, 'y': 24}]

hood = {
    'id': 'neighborhood', 'name': 'Bairro do Noa',
    'welcome': 'Este é o meu bairro. Vamos passear e conhecer as pessoas?',
    'base': 'water',
    'ground': ground,
    'legend': {
        '~': {'solid': True},
        'B': {},
        'g': {'terrains': ['grass']},
        'p': {'terrains': ['grass', 'dirt']},
        's': {'terrains': ['grass'], 'tile': ['pathStone0', 'pathStone1', 'pathStone2']},
    },
    'buildings': [
        {'x': 4, 'y': 3, 'w': 5, 'h': 4, 'door': 2, 'art': 'houseNoa'},     # casa do Noa: porta em (6, 6)
        {'x': 10, 'y': 3, 'w': 4, 'h': 4, 'door': 1, 'art': 'houseNeighbor'},    # casa do vizinho
        {'x': 24, 'y': 2, 'w': 6, 'h': 5, 'door': 3, 'art': 'school'},    # escola: porta em (27, 6)
    ],
    'fences': [
        {'x': 2, 'y': 16, 'w': 11, 'h': 10, 'gaps': [[7, 16], [8, 16]]},
        {'x': 22, 'y': 18, 'w': 11, 'h': 8, 'gaps': [[26, 18], [27, 18]]},
    ],
    'objects': trees + decor + props + farm_objects + zoo_objects,
    'doors': [
        {'x': 6, 'y': 6, 'to': 'house', 'spawn': {'x': 8, 'y': 9}, 'facing': 'up', 'label': 'Entrar em casa'},
        {'x': 11, 'y': 6, 'to': 'neighbor', 'spawn': {'x': 6, 'y': 7}, 'facing': 'up', 'label': 'Entrar na casa da Lia'},
        {'x': 27, 'y': 6, 'to': 'school', 'spawn': {'x': 8, 'y': 8}, 'facing': 'up', 'label': 'Entrar na escola'},
    ],
    'spots': [
        {'id': 'hood-detective', 'label': 'Amigo Davi', 'art': 'personDavi', 'x': 37, 'y': 14,
         'prompt': 'Oi, eu sou o Davi. Vamos ser detetives e descobrir como as pessoas se sentem?', 'challenge': {'module': 'emotions', 'part': 'situation'}},
        {'id': 'hood-bench', 'label': 'Banco da praça', 'art': 'bench', 'x': 13, 'y': 16,
         'prompt': 'Um banco calmo para sentar. Vamos pensar em jeitos de mostrar o que sentimos?', 'challenge': {'module': 'emotions', 'part': 'express'}},
        {'id': 'hood-play', 'label': 'Amigo Caio', 'name': 'Caio', 'art': 'personKid', 'x': 15, 'y': 15,
         'prompt': 'Oi, eu sou o Caio. Estou brincando. Vamos aprender a entrar na brincadeira?', 'challenge': {'module': 'communication', 'part': 'play'}},
        {'id': 'hood-friend', 'label': 'Amiga Bia', 'art': 'personBia', 'x': 19, 'y': 24,
         'prompt': 'Oi, eu sou a Bia. Vamos contar o que a gente sente?', 'challenge': {'module': 'communication', 'part': 'feelings'}},
        {'id': 'hood-farmer', 'label': 'Fazendeiro Zé', 'art': 'personFarmer', 'x': 6, 'y': 15,
         'prompt': 'Bem-vindo à fazendinha! Vamos conhecer os animais daqui?', 'challenge': {'module': 'animals', 'part': 'farm'}},
        {'id': 'hood-farm-sign', 'label': 'Placa dos animais', 'art': 'sign', 'x': 10, 'y': 15,
         'prompt': 'A placa mostra onde cada animal vive. Vamos ajudar os animais?', 'challenge': {'module': 'animals', 'part': 'homes'}},
        {'id': 'hood-zoo', 'label': 'Tratador Rui', 'name': 'Rui', 'art': 'personKeeper', 'x': 25, 'y': 17,
         'prompt': 'Oi, eu sou o Rui, tratador do zoológico. Vamos ver os animais da savana?', 'challenge': {'module': 'animals', 'part': 'savanna'}},
        # Caminho fechado: a ponte quebrada (quebra-cabeça em js/data/world/closeups/bridge.js).
        # Fica por cima da ponte inteira e bloqueia a passagem até ser consertada.
        {'id': 'hood-bridge', 'label': 'Ponte quebrada', 'art': 'bridgeBroken', 'x': 33, 'y': 8, 'solid': 'all', 'gate': 'bridge',
         'prompt': 'A ponte quebrou. Faltam tábuas. Não dá para atravessar o rio.'},
        {'id': 'hood-river', 'label': 'Placa do rio', 'art': 'sign', 'x': 36, 'y': 10,
         'prompt': 'O rio e as árvores. Vamos procurar os animais que vivem aqui?', 'challenge': {'module': 'animals', 'part': 'river'}},
        # Animais: tocar mostra o nome, o som e uma curiosidade (dados do módulo de animais).
        {'id': 'hood-animal-cow', 'label': 'Vaca', 'art': 'cow', 'x': 4, 'y': 17, 'animal': 'cow'},
        {'id': 'hood-animal-horse', 'label': 'Cavalo', 'art': 'horse', 'x': 7, 'y': 19, 'animal': 'horse'},
        {'id': 'hood-animal-chicken', 'label': 'Galinha', 'art': 'chicken', 'x': 7, 'y': 23, 'animal': 'chicken'},
        {'id': 'hood-animal-duck', 'label': 'Pato', 'art': 'duck', 'x': 10, 'y': 23, 'animal': 'duck'},
        {'id': 'hood-animal-lion', 'label': 'Leão', 'art': 'lion', 'x': 24, 'y': 20, 'animal': 'lion'},
        {'id': 'hood-animal-elephant', 'label': 'Elefante', 'art': 'elephant', 'x': 28, 'y': 20, 'animal': 'elephant'},
        {'id': 'hood-animal-giraffe', 'label': 'Girafa', 'art': 'giraffe', 'x': 26, 'y': 23, 'animal': 'giraffe'},
        {'id': 'hood-animal-fish', 'label': 'Peixe', 'art': 'fish', 'x': 34, 'y': 5, 'animal': 'fish'},
        {'id': 'hood-animal-turtle', 'label': 'Tartaruga', 'art': 'turtle', 'x': 36, 'y': 12, 'animal': 'turtle'},
        {'id': 'hood-animal-monkey', 'label': 'Macaco', 'art': 'monkey', 'x': 37, 'y': 5, 'animal': 'monkey'},
        {'id': 'hood-animal-dog', 'label': 'Cachorro', 'art': 'dog', 'x': 9, 'y': 7, 'animal': 'dog'},
    ],
}

# =====================================================================
# Sala de aula (16 × 10)
# =====================================================================
school = {
    'id': 'school', 'name': 'Escola do Noa', 'background': '#5c4452',
    'welcome': 'Esta é a minha sala de aula. A professora está perto do quadro.',
    'ground': room(16, 10, windows=(2, 13), door=8, extra={(6, 0): 'L', (7, 0): 'M', (8, 0): 'M', (9, 0): 'R'}),
    'legend': {**ROOM_LEGEND,
               '.': {'floor': 'floorSchool'},
               'L': {'room': True, 'solid': True, 'tile': 'boardLeft'},
               'M': {'room': True, 'solid': True, 'tile': 'boardMiddle'},
               'R': {'room': True, 'solid': True, 'tile': 'boardRight'}},
    'objects': [
        {'art': 'bookshelf', 'x': 14, 'y': 1}, {'art': 'plantPot', 'x': 13, 'y': 1},
        {'art': 'painting1', 'x': 11, 'y': 0, 'solid': 'none'},
        {'art': 'schoolDesk', 'x': 3, 'y': 4}, {'art': 'chairBack', 'x': 3, 'y': 5},
        {'art': 'schoolDesk', 'x': 5, 'y': 4},
        {'art': 'schoolDesk', 'x': 10, 'y': 4},
        {'art': 'schoolDesk', 'x': 12, 'y': 4}, {'art': 'chairBack', 'x': 12, 'y': 5},
        {'art': 'schoolDesk', 'x': 3, 'y': 7}, {'art': 'chairBack', 'x': 3, 'y': 8},
        {'art': 'schoolDesk', 'x': 12, 'y': 7}, {'art': 'chairBack', 'x': 12, 'y': 8},
        {'art': 'rugWideGreen', 'x': 7, 'y': 3, 'solid': 'none'},
        {'art': 'lampPink', 'x': 1, 'y': 8},
        # cadeira que faltava, mesa da professora e um cantinho de leitura
        {'art': 'chairBack', 'x': 5, 'y': 5},
        {'art': 'teacherDesk', 'x': 10, 'y': 1},
        {'art': 'rugWideBlue', 'x': 12, 'y': 6, 'solid': 'none'}, {'art': 'cabinet', 'x': 14, 'y': 6},
        {'art': 'plantSmall', 'x': 14, 'y': 8},
        {'art': 'posterAbc', 'x': 4, 'y': 0, 'solid': 'none'}, {'art': 'wallClock', 'x': 12, 'y': 0, 'solid': 'none'},
        {'art': 'bookshelf', 'x': 1, 'y': 5},
    ],
    'doors': [{'x': 8, 'y': 9, 'to': 'neighborhood', 'spawn': {'x': 27, 'y': 7}, 'facing': 'down', 'label': 'Sair para o bairro'}],
    'spots': [
        {'id': 'school-teacher', 'label': 'Professora Ana', 'art': 'personTeacher', 'x': 8, 'y': 2,
         'prompt': 'Bom dia! Eu sou a professora Ana. Vamos treinar como falar na sala de aula?', 'challenge': {'module': 'communication', 'part': 'school'}},
        {'id': 'school-board', 'label': 'Quadro', 'cells': [{'x': 6, 'y': 0}, {'x': 7, 'y': 0}, {'x': 8, 'y': 0}, {'x': 9, 'y': 0}],
         'prompt': 'No quadro está escrito: hoje tem aula de desenho.'},
        {'id': 'school-classmate', 'label': 'Colega Téo', 'name': 'Téo', 'art': 'personTeo', 'x': 10, 'y': 5,
         'prompt': 'Oi, Noa! Eu sou o Téo. Eu gosto de desenhar carros.'},
        {'id': 'school-drawers', 'label': 'Armário da turma', 'art': 'drawers', 'x': 1, 'y': 1,
         'prompt': 'Aqui ficam os cadernos e os lápis da turma.'},
    ],
}

# =====================================================================
# Casa da Lia, a vizinha (12 × 9): sala à esquerda, cozinha à direita
# =====================================================================
lia_kitchen = {(x, y): 'k' for x in range(7, 11) for y in range(1, 4)}
neighbor = {
    'id': 'neighbor', 'name': 'Casa da Lia', 'background': '#5c4452',
    'welcome': 'Esta é a casa da Lia, a minha vizinha. A Lia está na sala.',
    'ground': room(12, 9, windows=(3, 8), door=6, extra=lia_kitchen),
    'legend': ROOM_LEGEND,
    'objects': [
        {'art': 'painting2', 'x': 1, 'y': 0, 'solid': 'none'},
        {'art': 'wallShelf', 'x': 5, 'y': 0, 'solid': 'none'},
        {'art': 'wallClock', 'x': 10, 'y': 0, 'solid': 'none'},
        {'art': 'plantPot', 'x': 4, 'y': 1},
        {'art': 'kitchenCounter', 'x': 7, 'y': 1}, {'art': 'stove', 'x': 8, 'y': 1},
        {'art': 'kitchenCounter', 'x': 9, 'y': 1}, {'art': 'fridge', 'x': 10, 'y': 1},
        {'art': 'chairLeft', 'x': 7, 'y': 4}, {'art': 'table', 'x': 8, 'y': 4}, {'art': 'chairRight', 'x': 9, 'y': 4},
        {'art': 'rugWidePink', 'x': 2, 'y': 4, 'solid': 'none'},
        {'art': 'armchair', 'x': 1, 'y': 5}, {'art': 'sofa', 'x': 3, 'y': 6}, {'art': 'lampGreen', 'x': 5, 'y': 6},
        {'art': 'tv', 'x': 3, 'y': 3}, {'art': 'drawers', 'x': 10, 'y': 5},
        {'art': 'plantSmall', 'x': 10, 'y': 7},
        {'art': 'rugGreen', 'x': 8, 'y': 6, 'solid': 'none'},
    ],
    'doors': [{'x': 6, 'y': 8, 'to': 'neighborhood', 'spawn': {'x': 11, 'y': 7}, 'facing': 'down', 'label': 'Sair para o bairro'}],
    'spots': [
        {'id': 'hood-neighbor', 'label': 'Vizinha Lia', 'art': 'personLia', 'x': 6, 'y': 4,
         'prompt': 'Oi, eu sou a Lia. Que bom que você veio! Você consegue ver o que o meu rosto mostra?',
         'challenge': {'module': 'emotions', 'part': 'recognize'}},
        {'id': 'neighbor-aquarium', 'label': 'Aquário', 'art': 'aquarium', 'x': 2, 'y': 1,
         'prompt': 'O aquário da Lia. O peixinho nada devagar.'},
        {'id': 'neighbor-books', 'label': 'Estante', 'art': 'bookshelf', 'x': 1, 'y': 1,
         'prompt': 'A estante da Lia. Ela gosta de livros de bichos.'},
    ],
}

MAPS = [
    (house, 'houseMap', 'Casa do Noa: quarto (esquerda), banheiro (meio), cozinha e sala (direita).'),
    (hood, 'neighborhoodMap', 'O bairro: casa do Noa, escola, praça, fazendinha, zoológico e rio.'),
    (neighbor, 'neighborMap', 'Casa da Lia, a vizinha (entrada pela porta da casa ao lado da casa do Noa).'),
    (school, 'schoolMap', 'Sala de aula da escola do Noa (entrada pela porta da escola, no bairro).'),
]
