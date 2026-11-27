# Ferramentas de desenvolvimento

Nada aqui é carregado pelo app. São scripts para servir, desenhar e testar o jogo.
Execute sempre **na pasta do projeto**.

| Ferramenta | Para que serve | Como usar |
| --- | --- | --- |
| `serve.py` | Servidor local sem cache (mudanças aparecem ao recarregar) | `python tools/serve.py` → <http://localhost:8123> |
| `draw_title.py` | Imagem da tela inicial (`assets/images/world/title.png`) | `python tools/draw_title.py` |
| `draw_ui.py` | Molduras em pixel art da interface (`assets/images/world/ui/`) | `python tools/draw_ui.py` |
| `closeup/` | Cenas de perto (pia, quarto, mochila, quadro). `pixkit.py` tem a paleta e o contorno automático | `python tools/closeup/draw_bedroom.py . <pasta-da-previa>` |
| `atlas/build_atlas.py` | Atlas do mapa (`atlas.png` + `js/data/world/atlas.js`) | `python tools/atlas/build_atlas.py <pasta-dos-pacotes> tools/atlas/sources/home.png .` |
| `maps/` | Mapas (`js/data/world/maps/*.js`), desenhados em `maps_design.py` | `python tools/maps/build_maps.py . <pasta-da-previa> tools/maps/maps_design.py` |
| `test/` | Testes no Chrome sem janela (DevTools Protocol, Node.js): jogam missões, clicam, arrastam e tiram fotos | ver abaixo |

## Atlas e licenças

`build_atlas.py` precisa dos pacotes **Sprout Lands Basic** (pasta `sprout/`) e **Ninja Adventure**
(pasta `ninja/`) numa pasta fora do projeto: a licença do Sprout Lands não permite redistribuir o
pacote. Links em `assets/images/world/CREDITS.md`. `atlas/sources/` tem só peças próprias (`home.png`)
e o Kenney Tiny Town (`town.png`, CC0).

Ao mudar o atlas, confira que nenhuma peça antiga mudou: o atlas é montado por nome e o índice é
gerado de novo, então peças novas mudam as posições, mas não os nomes.

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

No Git Bash, use `MSYS_NO_PATHCONV=1` antes do comando quando passar uma rota como `#/`
(senão o Bash troca por um caminho do Windows).
