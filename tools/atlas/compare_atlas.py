import re, sys
from PIL import Image
def load(root):
    img = Image.open(f'{root}/assets/images/world/atlas.png').convert('RGBA')
    fr = {m.group(1): tuple(map(int, m.group(2).split(','))) for m in re.finditer(r'^\s+"?([\w-]+)"?: \[([\d, ]+)\]', open(f'{root}/js/data/world/atlas.js', encoding='utf-8').read(), re.M)}
    return img, fr
a, fa = load(sys.argv[1]); b, fb = load(sys.argv[2])
missing = sorted(set(fa) - set(fb)); added = sorted(set(fb) - set(fa))
diff = [n for n in fa if n in fb and (fa[n][2:] != fb[n][2:] or a.crop((fa[n][0], fa[n][1], fa[n][0]+fa[n][2], fa[n][1]+fa[n][3])).tobytes() != b.crop((fb[n][0], fb[n][1], fb[n][0]+fb[n][2], fb[n][1]+fb[n][3])).tobytes())]
print(f'peças: {len(fa)} → {len(fb)} | faltando: {missing} | novas: {added} | diferentes: {diff}')
