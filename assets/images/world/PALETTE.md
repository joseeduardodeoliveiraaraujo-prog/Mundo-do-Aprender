# Direção de arte do Bairro do Noa: paleta, escala e regras

Guia para desenhar ou ajustar qualquer imagem do jogo sem quebrar a unidade visual.
A referência é o pacote **Sprout Lands** (tons pastel, contorno arroxeado, luz suave).
As cores abaixo saem do código dos geradores (`tools/closeup/pixkit.py`, `tools/atlas/`,
`tools/art/draw_ui.py`, `tools/art/draw_title.py`). Se mudar uma cor lá, atualize aqui.

## Escala (tamanho do pixel)

| Onde | Resolução de desenho | Na tela | 1 pixel de arte = |
| --- | --- | --- | --- |
| Mapa (atlas) | blocos de 16×16 | câmera de 12×8 a 18×12 blocos | 1 px do jogo |
| Cenas de perto: pia, quarto, mochila | 96×64 | 192×128 | **2 px** da cena |
| Quadro da rotina | 96×64 | 384×256 (resolução dobrada, para os pictogramas) | **4 px** da cena |
| Molduras da interface (`ui/`) | 12×12, cortes de 4 px | `border-image` de 8 px | 2 px de tela |
| Rostos (`faces/`) | 38×38 | 76 px (2×); 38 px no celular | 2 ou 1 px de tela |
| Rostos das emoções (`emotions/faces/*.png`) | 28×28 | 56 px nos cartões (2×), 112 px na conversa (4×) | 2 ou 4 px de tela |

Regras:

- Nunca misture tamanhos de pixel numa mesma cena. Peça nova de cena de perto: desenhe em
  96×64 e salve ampliada com vizinho mais próximo (`Image.NEAREST`).
- Imagens em pixel art usam `image-rendering: pixelated` no CSS e `pixelArt: true` no Phaser.
  Nunca use filtros ou redimensionamento suave.
- Exceção consciente: os **pictogramas dos cartões** (SVG da rotina) ficam lisos, dentro de uma
  moldura em pixel art, para continuarem legíveis.

## Contorno, luz e sombra

- **Contorno:** `#6b4b5b` (roxo-acinzentado), 1 pixel de arte, **por dentro** da forma
  (`pixkit.paint`/`shape` fazem isso sozinhos). Nunca preto puro, exceto no alto contraste.
- **Luz** vem de cima e da esquerda; **sombra**, de baixo e da direita. Cada material tem 3 tons:
  base, sombra e luz.
- **Sombra no chão** (personagens e animais): `#504086` com 25% de opacidade (alfa 64), como as
  sombras do Sprout Lands. Nunca uma mancha escura opaca.
- Cantos arredondados em degrau (pixel a pixel), nunca com suavização.

## Materiais (base / sombra / luz)

| Material | Base | Sombra | Luz | Onde aparece |
| --- | --- | --- | --- | --- |
| Pele (Noa) | `#e3a377` | `#c48062` | `#f2c098` | mãos na pia |
| Roupa do Noa | `#6c999b` | `#547a80` | `#8ab6b4` | punhos, camiseta |
| Metal / louça | `#cbd3de` | `#9faabb` | `#ffffff` | torneira, cuba, saboneteira |
| Madeira | `#c49a6c` | `#aa7959` | `#dcb98a` | móveis, molduras, rodapé |
| Madeira clara | `#e8cfa6` | `#dcb98a` | `#f3e5c2` | bancada, piso da cena |
| Piso de madeira (mapa) | `#e2c092` | `#cca678` (frestas) | `#eccea4` | casa |
| Azulejo | `#d6e6e4` | `#bed2d4` | `#e8f2f0` | banheiro |
| Toalha / verde suave | `#aaceaa` | `#80aa8c` | `#cee6c6` | toalha, cobertor |
| Rosa (sabonete, cortina) | `#e8b0c4` | `#cc8ca8` | `#f8d6e2` | |
| Água | `#a3cdd8` | `#6c999b` | `#ffffff` | jato, gotas |
| Barro | `#926858` | `#aa7959` | | mãos sujas |
| Reboco (paredes de fora) | `#f0e2c4` | `#decaa8` | `#faf2de` | casas do bairro |
| Telhado azul / vermelho / verde | `#7aa0cc` / `#cc7862` / `#86b492` | `#6080b2` / `#ae5e52` / `#68947a` | `#a0c2e2` / `#e49c80` / `#acd2ac` | casa do Noa / vizinha / escola |

Pisos do mapa com contraste baixo (o chão nunca compete com móveis e pessoas): madeira na casa,
lajotas creme `#f2e6cc`/`#e6d6b6` na cozinha, verde-acinzentado `#d8e2d6`/`#ccd8cc` na escola.
No bairro, as ruas são **lajotas grandes** (uma pedra por bloco, creme `#e2d8c2` ou cinza `#d2d6d2`,
contorno suave `#b2a696`, sem o roxo), com a grama aparecendo nas juntas. Nada de pedrinhas miúdas
repetidas: padrão miúdo cansa a vista. Flores ficam em **canteiros** (grupos de 6 flores), nunca em
cima da rua. Tufos de grama e pedrinhas, também com contorno suave, quebram a grama lisa.

## Interface

- **Painel** (caixa de fala, painel de objetivo): fundo `#fffaf0`, contorno `#6b4b5b`, relevo claro
  `#ffffff` em cima/esquerda e `#ead9c0` embaixo/direita (`ui/frame-panel.png`).
- **Moldura do mapa:** madeira `#dcb98a` → `#c49a6c` → filete `#90625d` (`ui/frame-wood.png`).
- **Cartões do quadro:** fundo `#fffaf0`, contorno `#6b4b5b`, faixa de sombra `#ead9c0`.
- **Título** (`title-logo.png`): letras creme `#fff6de` em cima e douradas `#f6ce74` embaixo,
  contorno `#6b4b5b`, sombra `#504086`.
- Textos, botões e cores da interface HTML vêm dos tokens de `css/global.css` (não desta paleta).

## Alto contraste

`css/accessibility.css` troca as molduras de pixel art por bordas pretas lisas. No mapa, os
marcadores viram `markTodoHc` (balão branco com contorno preto de 2 px) e `markDoneHc` (estrela
amarela `#ffd600` com contorno preto), na hora em que a opção é ligada.

## Personagens e animais

- Pessoas e Noa: Ninja Adventure (CC0), com as cores suavizadas para o Sprout Lands; 4 direções.
- Animais próprios (pato, elefante, girafa, tartaruga) e móveis próprios (TV, sofá):
  `tools/atlas/own_art.py`, 16×16, mesmas regras de contorno e luz.
- **Casas do bairro** (`tools/atlas/buildings.py`): cada casa é um desenho inteiro, da largura da casa
  no mapa, com a porta no centro da coluna `door`. Uma cor de telhado por casa, para a criança
  reconhecer cada lugar (a do Noa é azul). Detalhes (telhas, musgo, floreiras) ficam nos prédios;
  o chão por onde o Noa anda continua calmo.
- **Árvores grandes** (`tools/atlas/nature.py`): carvalho 3×3 blocos (com ou sem frutas) e pinheiro 2×3,
  copa com volume (luz em cima/esquerda, sombra embaixo/direita, arcos de folhas) e sombra translúcida
  no chão. Só a linha de baixo bloqueia a passagem; o Noa passa atrás da copa.
- **Objetos do bairro** (`tools/atlas/props.py`): barril, caixote, vaso de barro, poste de luz,
  caixa de correio, fardo de feno, canteiro da horta e a ponte do rio (2 blocos, a largura da rua). Ficam perto das casas, da praça e da
  fazendinha, nunca no meio da rua; bloqueiam só o bloco de baixo. Tudo parado: o poste fica
  aceso com luz suave, sem brilho piscando.
- Animação só quando a criança age, curta e sem repetição. Exemplos: a pessoa vira para o Noa
  ao conversar; a espuma cresce ao esfregar.
