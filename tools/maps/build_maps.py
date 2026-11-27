# Gera js/data/world/maps/{house,neighborhood,school}.js e prévias dos mapas inteiros.
# Uso, na pasta do projeto: python tools/maps/build_maps.py . <pasta-das-previas> tools/maps/maps_design.py
# Os mapas são desenhados em tools/maps/maps_design.py; depois de gerar, não edite os .js à mão.
import sys, json, re, random, math
from PIL import Image

PROJECT, OUT = sys.argv[1], sys.argv[2]
T = 16
atlas = Image.open(f'{PROJECT}/assets/images/world/atlas.png').convert('RGBA')
FR = {m.group(1): tuple(map(int, m.group(2).split(','))) for m in
      re.finditer(r'^\s+"?([\w-]+)"?: \[([\d, ]+)\]', open(f'{PROJECT}/js/data/world/atlas.js', encoding='utf-8').read(), re.M)}

def js_value(v, indent=2, level=1):
    pad = ' ' * (indent * level); end = ' ' * (indent * (level - 1))
    if isinstance(v, dict):
        if not v: return '{}'
        inline = all(not isinstance(x, (dict, list)) for x in v.values()) and len(v) <= 6
        items = [f"{k if re.match(r'^[A-Za-z_$][\w$]*$', str(k)) else json.dumps(str(k))}: {js_value(x, indent, level + 1)}" for k, x in v.items()]
        s = '{ ' + ', '.join(items) + ' }'
        if inline and len(s) < 110: return s
        return '{\n' + ',\n'.join(pad + i for i in items) + ',\n' + end + '}'
    if isinstance(v, list):
        if not v: return '[]'
        items = [js_value(x, indent, level + 1) for x in v]
        s = '[' + ', '.join(items) + ']'
        if len(s) < 100 and not any(isinstance(x, (dict)) and len(x) > 4 for x in v): return s
        return '[\n' + ',\n'.join(pad + i for i in items) + ',\n' + end + ']'
    if isinstance(v, str): return "'" + v.replace("'", "\\'") + "'"
    if v is True: return 'true'
    if v is False: return 'false'
    return json.dumps(v)

# ---------- prévia (mesmas regras do motor) ----------
def frame(name):
    x, y, w, h = FR[name]; return atlas.crop((x, y, x + w, y + h))
def terrain_piece(t, up, down, left, right):
    v, h = up or down, left or right
    if not v and not h: return f'{t}Dot'
    if not h: return f"{t}V{'Mid' if up and down else 'Bottom' if up else 'Top'}"
    if not v: return f"{t}H{'Mid' if left and right else 'Right' if left else 'Left'}"
    row = 'T' if not up else 'B' if not down else ''
    col = 'L' if not left else 'R' if not right else ''
    return f'{t}9{row + col or "C"}'
def size_of(art):
    _, _, w, h = FR[art]; return w, h, math.ceil(w / T), math.ceil(h / T)

def preview(m, path):
    rows, cols = len(m['ground']), len(m['ground'][0])
    img = Image.new('RGBA', (cols * T, rows * T), (40, 40, 40, 255))
    layers = []  # (depth, image, x, y)
    def has(t, x, y): return 0 <= x < cols and 0 <= y < rows and t in m['legend'][m['ground'][y][x]].get('terrains', [])
    for y, line in enumerate(m['ground']):
        for x, ch in enumerate(line):
            lg = m['legend'][ch]
            if m.get('base'): layers.append((0, frame(m['base']), x * T, y * T))
            if lg.get('room'):
                r = 'T' if y == 0 else 'B' if y == rows - 1 else ''; c = 'L' if x == 0 else 'R' if x == cols - 1 else ''
                layers.append((0, frame(f'room9{r + c or "C"}'), x * T, y * T))
            if lg.get('floor'): layers.append((0, frame(lg['floor']), x * T, y * T))
            for i, t in enumerate(lg.get('terrains', [])):
                layers.append((1 + i * .1, frame(terrain_piece(t, has(t, x, y - 1), has(t, x, y + 1), has(t, x - 1, y), has(t, x + 1, y))), x * T, y * T))
            if lg.get('tile'): layers.append((1.5, frame(lg['tile']), x * T, y * T))
    for b in m.get('buildings', []):
        x, y, w, h, door = b['x'], b['y'], b['w'], b['h'], b['door']; d = (y + h) * T
        for r in range(h - 1):
            rr = 'T' if r == 0 else 'B' if r == h - 2 else ''
            for c in range(w):
                cc = 'L' if c == 0 else 'R' if c == w - 1 else ''
                layers.append((d, frame(f'roof{rr + cc or "C"}'), (x + c) * T, (y + r) * T))
        for c in range(w):
            layers.append((d, frame('frontWindow' if abs(c - door) == 1 else 'frontWall'), (x + c) * T, (y + h - 1) * T))
            if c == door: layers.append((d + .1, frame('door'), (x + c) * T, (y + h - 1) * T))
    fences = set()
    for f in m.get('fences', []):
        x, y, w, h = f['x'], f['y'], f['w'], f['h']; gaps = {tuple(g) for g in f.get('gaps', [])}
        cells = [(c, y) for c in range(x, x + w)] + [(c, y + h - 1) for c in range(x, x + w)] + [(x, r) for r in range(y + 1, y + h - 1)] + [(x + w - 1, r) for r in range(y + 1, y + h - 1)]
        fences |= {c for c in cells if c not in gaps}
    for (x, y) in fences:
        l, r, u, d = (x - 1, y) in fences, (x + 1, y) in fences, (x, y - 1) in fences, (x, y + 1) in fences
        col = 2 if l and r else 1 if r else 3 if l else 0; row = 1 if u and d else 0 if d else 2 if u else 3
        layers.append(((y + 1) * T, frame(f'fence{col}{row}'), x * T, y * T))
    for o in m.get('objects', []) + [s for s in m['spots'] if s.get('art')]:
        w, h, c, r = size_of(o['art']); bottom = (o['y'] + r) * T
        depth = 3 if o.get('solid') == 'none' else bottom
        layers.append((depth, frame(o['art']), o['x'] * T + (c * T - w) // 2, bottom - h - o.get('lift', 0)))
        if o.get('challenge'): layers.append((99999, frame('markTodo'), o['x'] * T + (c * T - T) // 2, bottom - h - 11))
    for depth, im, x, y in sorted(layers, key=lambda l: l[0]):
        img.alpha_composite(im, (x, y))
    img = img.resize((img.width * 2, img.height * 2), Image.NEAREST)
    img.save(path)

# ---------- validação ----------
def validate(m, all_ids):
    cols = len(m['ground'][0])
    assert all(len(r) == cols for r in m['ground']), m['id']
    for ch in set(''.join(m['ground'])): assert ch in m['legend'], (m['id'], ch)
    for lg in m['legend'].values():
        for k in ('tile', 'floor'):
            if lg.get(k): assert lg[k] in FR, lg[k]
    for o in m.get('objects', []) + m['spots']:
        for k in ('art', 'usedArt'):
            if o.get(k): assert o[k] in FR, (m['id'], o[k])
    for d in m['doors']: assert d['to'] in all_ids

def write(m, var, comment):
    body = js_value(m)
    js = f"/**\n * {comment}\n * Somente dados. Formato dos mapas: ver js/data/world/world.js.\n * Gerado a partir de um rascunho; pode ser editado à mão.\n */\n\nexport const {var} = Object.freeze({body});\n"
    open(f'{PROJECT}/js/data/world/maps/{m["id"]}.js', 'w', encoding='utf-8').write(js)

exec(open(sys.argv[3], encoding='utf-8').read())  # define MAPS = [(map, var, comment), ...]
ids = {m['id'] for m, _, _ in MAPS}
for m, var, comment in MAPS:
    validate(m, ids); write(m, var, comment); preview(m, f'{OUT}/preview-{m["id"]}.png')
    print('ok', m['id'], len(m['ground'][0]), 'x', len(m['ground']))
