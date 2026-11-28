# Ferramentas de desenvolvimento

Nada aqui é carregado pelo app. São scripts para servir, desenhar e testar o jogo.
Execute sempre **na pasta do projeto**.

| Ferramenta | Para que serve | Como usar |
| --- | --- | --- |
| `serve.py` | Servidor local sem cache (mudanças aparecem ao recarregar) | `python tools/serve.py` → <http://localhost:8123> |
| `art/` | Arte avulsa em pixel art: `draw_title.py` (tela inicial: `title.png`, `title-logo.png`), `draw_faces.py` (rostos das emoções, `assets/images/emotions/faces/*.png`) e `draw_ui.py` (molduras da interface, `assets/images/world/ui/`) | `python tools/art/draw_ui.py` (rostos: `python tools/art/draw_faces.py [previa.png]`) |
| `closeup/` | Cenas de perto (pia, quarto, mochila, quadro, ponte quebrada). `pixkit.py` tem a paleta e o contorno automático | `python tools/closeup/draw_bedroom.py . <pasta-da-previa>` |
| `atlas/build_atlas.py` | Atlas do mapa (`atlas.png` + `js/data/world/atlas.js`). Peças próprias desenhadas em código ficam em `atlas/own_art.py` e as casas do bairro, cada uma inteira, em `atlas/buildings.py`, e a natureza (árvores grandes, pedras da rua, canteiros, tufos) em `atlas/nature.py` e os objetos do bairro (barril, caixote, vaso, poste, caixa de correio, feno, canteiro da horta) em `atlas/props.py` e os móveis dos interiores em `atlas/furniture.py` (prévia de cada um: `python tools/atlas/<arquivo>.py previa.png`) | `python tools/atlas/build_atlas.py <pasta-dos-pacotes> tools/atlas/sources/home.png .` |
| `atlas/compare_atlas.py` | Compara dois atlas peça por peça (faltando, novas, diferentes) | `python tools/atlas/compare_atlas.py <pasta-do-projeto-antes> .` |
| `maps/` | Mapas (`js/data/world/maps/*.js`), desenhados em `maps_design.py` | `python tools/maps/build_maps.py . <pasta-da-previa> tools/maps/maps_design.py` |
| `test/` | Testes no Chrome sem janela (DevTools Protocol, Node.js): jogam missões, clicam, arrastam e tiram fotos | ver abaixo |

## Atlas e licenças

`build_atlas.py` precisa dos pacotes **Sprout Lands Basic** (pasta `sprout/`) e **Ninja Adventure**
(pasta `ninja/`) numa pasta fora do projeto: a licença do Sprout Lands não permite redistribuir o
pacote. Links em `assets/images/world/CREDITS.md`. `atlas/sources/` tem só peças próprias (`home.png`)
e o Kenney Tiny Town (`town.png`, CC0).

Ao mudar o atlas, confira que só as peças desejadas mudaram (`compare_atlas.py`, com uma cópia do
`atlas.png` e do `atlas.js` de antes): o atlas é montado por nome e o índice é gerado de novo, então
peças novas mudam as posições, mas não os nomes.

## Testes (`test/`)

Precisam do servidor ligado (`python tools/serve.py`) e do Google Chrome. Rode numa pasta de saída
temporária; as fotos e o log ficam em `<saida>/`.

- `cdpquest.mjs <saida> <largura> "<Lugar 1>,<Lugar 2>" [mapa] [progresso-json]`: jogador automático das missões.
- `cdpclose.mjs <saida> <largura> "<Lugar>" <mapa> <progresso-json> "<ações>"`: cenas de perto
  (`btn:Rótulo`, `tap:x,y`, `drag:x,y>x,y`, `rub:x,y`, `shot:nome`, `stop:x`). Quadro da rotina: `SCENE_W=384`.
- `cdpsink.mjs <saida> <largura>`: a pia inteira (erro de propósito, botão, arrastar, esfregar).
- `cdptitle.mjs <saida> <largura>`: tela inicial (Continuar, Novo jogo, Opções).
- `cdpaudit.mjs <saida> <largura> <posição-json> [preferências-json] [nome] [rota]`: foto de uma tela
  com posição e preferências (alto contraste, tamanho do texto).
- `cdpreach.mjs <saida> <mapa> <x> <y> [salvos-json]`: confere que o Noa chega a todos os lugares do mapa pelo
  "Ir até" (rode depois de mudar um mapa). Caminhos fechados ficam fechados; para abrir:
  `'{"gates":["bridge"]}'` (ponte consertada) ou `'{"settings":{"openPaths":true}}'` (todos).

No Git Bash, use `MSYS_NO_PATHCONV=1` antes do comando quando passar uma rota como `#/`
(senão o Bash troca por um caminho do Windows).
