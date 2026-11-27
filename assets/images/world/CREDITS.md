# Créditos: imagens do jogo "Bairro do Noa"

O jogo usa uma única imagem, `atlas.png`, que junta peças de pixel art de várias origens. O índice com o nome e a posição de cada peça fica em `js/data/world/atlas.js`.

## Sprout Lands (Basic pack): Cup Nooble

**Assets: Sprout Lands, por Cup Nooble.** Página: <https://cupnooble.itch.io/sprout-lands-asset-pack>

Peças usadas: grama, terra, água, cercas, paredes e piso da casa, telhado, porta, móveis (camas, mesa, cadeiras, cômoda, relógios, tapetes, abajures, plantas, quadros), árvores, arbustos, flores, cogumelos, pedras, plantação, girassol, galinheiro, ponte, vaca e galinha.

Termos da licença do Basic pack, resumidos do arquivo `read_me.txt` do pacote:

- É permitido modificar as imagens.
- O uso é permitido **somente em projetos não comerciais**. NFT e treinamento de IA não são permitidos.
- **Não é permitido redistribuir ou revender o pacote em si**, mesmo modificado. É permitido distribuir projetos feitos com ele, inclusive em código aberto, com esta nota de autoria e os termos da licença.
- **O crédito é obrigatório:** Cup Nooble.

Se o Mundo do Aprender passar a ter uso comercial, é preciso falar com a autora sobre outra licença ou trocar essas imagens.

## Ninja Adventure: Pixel-boy e AAA

Página: <https://pixel-boy.itch.io/ninja-adventure-asset-pack>. Licença **CC0 1.0** (domínio público).

Peças usadas, com as cores suavizadas para combinar com o Sprout Lands:
- **Noa:** personagem "Boy", com cabelo castanho e camiseta azul-clara. Tem 4 direções e 4 passos.
- **Pessoas:** Woman, Villager, Villager2 a Villager5, OldMan, Hunter e Child.
- **Animais:** gato, cachorro, cavalo, peixe, macaco e leão.
- **Sombra** dos personagens.

## Kenney: Tiny Town

Página: <https://kenney.nl/assets/tiny-town>. Licença **CC0 1.0**. Peças usadas, com as cores suavizadas: mochila e placa.

## Peças próprias do projeto

Desenhadas para o Mundo do Aprender e suavizadas na paleta do Sprout Lands: pia, geladeira, sofá, TV, banco da praça, azulejo do banheiro, quadro-negro (3 partes), brinquedos, pato, elefante, girafa, tartaruga e os marcadores de desafio ("!" e estrela). O despertador "tocando" é o relógio do Sprout Lands com traços acrescentados.

## Pisos e molduras próprios

Desenhados para o Mundo do Aprender na paleta do Sprout Lands: os pisos de madeira, da cozinha e da escola (`floorWood`, `floorKitchen`, `floorSchool` no atlas; `tools/atlas/build_atlas.py`) e as molduras da interface em `ui/` (`frame-wood.png`, `frame-panel.png`; `tools/draw_ui.py`).

## Tela inicial (`title.png`)

Montada com peças do próprio atlas (mesmas origens e licenças acima: grama, árvores, flores e placa do Sprout Lands; Noa, Gabi, gato e cachorro do Ninja Adventure) pelo script `tools/draw_title.py`.

## Cenas de perto (`closeup/`)

Imagens próprias do projeto, desenhadas para o Mundo do Aprender na paleta do Sprout Lands e do Ninja Adventure, sem peças copiadas de pacotes: a pia do banheiro (`closeup/sink/`: parede, espelho, bancada, torneira, água, mãos de Noa, sabão, toalha, espuma e brilho), o quarto do Noa de manhã e à noite (`closeup/bedroom/`), a mochila aberta e os objetos da escola (`closeup/backpack/`), o quadro da rotina com as casas numeradas (`closeup/board/`) e a setinha de ajuda (`closeup/common/`). No quarto, o Noa de pé é o mesmo personagem do mapa (Ninja Adventure, CC0), e o Noa dormindo usa a cabeça dele com os olhos fechados.
