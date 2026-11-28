# Mundo do Aprender

Plataforma educativa digital para crianças de **8 a 12 anos com Transtorno do Espectro Autista (TEA)**, pensada para diferentes necessidades de suporte.

## O jogo: Bairro do Noa

O app abre na **tela inicial** do jogo, com o menu clássico: **Continuar** (só quando há jogo salvo; mostra onde o Noa está e as estrelas), **Novo jogo** (com jogo salvo, pede confirmação antes de apagar as estrelas e a posição; as opções continuam), **Opções** e **Como jogar**. Dentro do jogo, o botão **Tela inicial** volta ao menu.

O jogo é **2D em pixel art, visto de cima** (estilo RPG). A criança leva o Noa livremente pela **casa** (quarto, banheiro, cozinha e sala), pelo **bairro** (praça, fazendinha, zoológico e rio) e pela **escola** (sala de aula) e pela **casa da Lia**, a vizinha. Pessoas e objetos com um balão **!** têm um desafio; quando tudo ali foi feito, o balão vira uma estrela.

| Onde | Desafio (parte do módulo) |
| --- | --- |
| Casa: despertador, cama, pia, mesa, sofá, mochila | Minha Rotina: Acordar, Hora de dormir, Higiene, Alimentação, Lazer, Escola |
| Casa: Gabi (na cozinha) · gato | Eu Me Comunico: Em casa · Explorando os Animais: Em casa |
| Casa da Lia: Lia · Ilha do rio: Davi · Praça: banco | Mundo das Emoções: Reconhecer, Detetive, Expressar |
| Praça: Caio brincando · Fim da rua sul: Bia · Escola: professora Ana | Eu Me Comunico: Brincando, O que eu sinto · Na escola |
| Fazendinha, placa, zoológico, rio | Explorando os Animais: Fazenda, Cada um no seu lugar, Savana, Rio e floresta |

- **Animais pelo bairro:** vaca, cavalo, galinha e pato na fazendinha; leão, elefante e girafa no zoológico; peixe e tartaruga no rio; macaco na árvore e cachorro perto de casa. Tocar num animal faz o Noa dizer o nome, o som e uma curiosidade (dados de `js/data/animals/catalog.js`).
- **Cada região tem a sua pessoa:** a praça é o lugar de brincar (Caio) e de se acalmar (banco); a Lia recebe o Noa na casa dela; o Davi, detetive, fica na ilha do rio; a Bia, num cantinho calmo no fim da rua sul.
- **Gabi** fica na cozinha da casa do Noa: é com ela que o Noa conversa nos desafios "Em casa" (pedir água, pedir ajuda, escolher o lanche).
- **Escola por dentro:** a porta da escola leva à sala de aula, com quadro, carteiras, a professora Ana (desafio) e o colega Téo, que conversa com o Noa.
- **Quem fala é quem está ali:** ao chegar perto de uma pessoa, o balão mostra o rosto e o nome dela; nas conversas, quem responde é a pessoa do lugar (Gabi na cozinha, Caio na praça, Bia no fim da rua sul, a professora Ana e o Téo na escola). As personagens das histórias de emoções (Malu, Leo, Tom, Nina, Pedro) têm nomes diferentes das pessoas do mapa.
- **Rostos das emoções em pixel art** (`assets/images/emotions/faces/*.png`, desenhados por `tools/art/draw_faces.py`).
- **Formas de jogar:** tocar no mapa (Noa encontra o caminho); setas ou W A S D a qualquer momento (sem rolar a página) e Enter ou Espaço com o mapa focado; ou os botões **Ir até um lugar** e **Começar**.
- **Tela:** o mapa é o maior possível na altura da janela; em telas largas, a fala do Noa e os botões ficam numa coluna ao lado.
- **Cenas de perto:** algumas atividades abrem o lugar visto de perto, sobre o mapa, e a criança faz cada passo com as mãos. Na pia: tocar na torneira (a água cai e molha as mãos), arrastar o sabão até as mãos, esfregar passando o dedo de um lado para o outro (a espuma cresce), enxaguar e secar com a toalha. No **quarto**, de manhã: desligar o despertador, abrir a cortina (a luz entra) e acordar o Noa; à noite: guardar os brinquedos na caixa, fechar a cortina, levar o Noa até a cama e apagar o abajur (o quarto escurece). Na **mochila**, os objetos vão para dentro da mochila aberta; o que não serve volta com uma pista. No **quadro da rotina**, os cartões do dia (com os pictogramas da rotina) vão para as casas numeradas, seguindo as regras de cada atividade. Ação fora de ordem recebe uma pista e uma setinha parada mostra onde mexer. Botões fazem as mesmas ações (teclado e quem não arrasta).
- **Quebra-cabeça da ponte:** a ponte do rio está quebrada e esconde a ilha (Davi, macaco, tartaruga, peixe e a placa do rio). Na cena de perto, a criança encaixa cada peça no buraco do mesmo tamanho (1, 2 ou 3 tábuas); a tábua rachada não serve e volta com uma explicação; peça no buraco errado volta com uma pista. Sem tempo e sem erro. Consertada, a ponte fica assim para sempre ("Novo jogo" quebra de novo). Para quem precisa de menos etapas: **Configurações → Caminhos sempre abertos**.
- **Desafios:** cada visita a um lugar abre **uma** atividade daquela parte: a próxima que falta (ou, se tudo já foi feito, uma para repetir). Ao terminar, **Voltar a explorar** retorna ao mapa. O progresso e a posição do Noa ficam salvos.
- **Sem tempo, sem inimigos, sem punição.** Com "Reduzir animações", Noa chega direto e as portas trocam de mapa sem transição.
- **Visual:** pixel art no estilo aconchegante do **Sprout Lands** (Cup Nooble; uso não comercial, com crédito), com Noa e pessoas do **Ninja Adventure** (CC0) e peças próprias. Grama, terra, paredes e cercas se encaixam sozinhas; o Noa anda animado nas 4 direções, tem sombra e passa atrás das copas das árvores. Créditos e licenças em `assets/images/world/CREDITS.md`.
- Mapas em `js/data/world/maps/` (uma letra por bloco + objetos, casas e cercas), gerados a partir de `tools/maps/maps_design.py`. As imagens ficam num atlas único (`assets/images/world/atlas.png` + `js/data/world/atlas.js`), gerado por `tools/atlas/build_atlas.py`. Cada ambiente tem seu piso (madeira na casa, lajotas na cozinha, piso claro na escola), e o mapa, a caixa de fala e o painel têm molduras em pixel art. As pessoas viram para o Noa quando ele chega perto. Em telas largas a câmera fica mais longe (mostra mais do mapa); no celular o mapa vem primeiro e a fala do Noa logo abaixo. No alto contraste, os marcadores ganham contorno preto grosso. Paleta e regras da pixel art: `assets/images/world/PALETTE.md`. Ferramentas e testes: `tools/README.md`.

## Tecnologias

- HTML5, CSS3 e JavaScript puro (ES Modules).
- `localStorage` para preferências e progresso.
- Sem frameworks, sem backend, sem etapa de build.
- **Phaser 4** (motor de jogos 2D), copiado em `js/vendor/` (sem npm). Origem e licença em `js/vendor/CREDITS.md`.

## Como executar

Os navegadores bloqueiam ES Modules abertos direto do disco (`file://`). Por isso, é preciso servir a pasta com um servidor estático local. Escolha **uma** das opções:

**Opção 1: VS Code + Live Server**
1. Instale a extensão *Live Server* (Ritwick Dey).
2. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

**Opção 2: Python** (se estiver instalado). Recomendada durante o desenvolvimento:
```bash
python tools/serve.py
```
Depois acesse <http://localhost:8123>. Esse servidor manda o navegador sempre buscar a versão nova dos arquivos, então uma mudança no código aparece ao recarregar a página. (`python -m http.server 8000` também funciona, mas o navegador pode mostrar arquivos antigos do cache; nesse caso, use Ctrl+F5.)

**Opção 3: Node.js** (se estiver instalado)
```bash
npx serve .
```

Execute os comandos na pasta do projeto (onde fica o `index.html`).

## Estrutura

```
Mundo do Aprender/
├── index.html              # Cabeçalho, área principal e diálogos (ajuda, configurações)
├── README.md
├── AGENTS.md               # Regras permanentes do projeto
├── css/
│   ├── global.css          # Tokens de design (cores, tipografia, espaços), reset, layout do app
│   ├── components.css      # Botão, painel, cartão, cabeçalho de tela, progresso, feedback, diálogos
│   ├── games.css           # Estrutura comum: atividade, alternativas, lista reordenável, fluxo
│   ├── emotions.css        # Mundo das Emoções: rostos e "Monte o rosto"
│   ├── emotions-detective.css  # Mundo das Emoções: Detetive (lupa, pistas, desafio)
│   ├── emotions-missions.css   # Mundo das Emoções: missões com peças
│   ├── companion.css       # Personagem com balão de fala (Noa)
│   ├── routine-missions.css # Minha Rotina: mecânicas (trilha, mochila, cenas)
│   ├── world.css           # Jogo "Bairro do Noa" e painel de desafio
│   ├── animals.css         # Estilos específicos de Explorando os Animais e do painel de som
│   ├── communication.css   # Eu Me Comunico: cenário, balão e frase
│   ├── communication-talk.css # Eu Me Comunico: conversa e associação
│   └── accessibility.css   # Foco, contraste, tamanho de texto, animações (sempre por último)
├── js/
│   ├── main.js             # Ponto de entrada: liga configurações, diálogos, ícones e rotas
│   ├── navigation.js       # Roteador por hash (#/rota)
│   ├── settings.js         # Preferências de acessibilidade
│   ├── storage.js          # Acesso centralizado ao localStorage
│   ├── progress.js         # Progresso real e última atividade aberta
│   ├── speech.js           # Leitura em voz alta (só com sons ligados)
│   ├── audio.js            # Sons curtos (arquivo local ou imitação pela voz)
│   ├── undoHistory.js      # Histórico para Desfazer/Recomeçar
│   ├── modules.js          # Catálogo dos quatro módulos
│   ├── components/         # Peças de interface reutilizáveis
│   │   ├── dom.js              # el(): cria elementos com segurança
│   │   ├── icons.js            # Ícones de interface (SVG embutido)
│   │   ├── button.js           # createButton / createLinkButton
│   │   ├── activityFrame.js    # Moldura padrão de atividade (instrução, repetir, navegação)
│   │   ├── choiceButton.js     # Alternativas de resposta
│   │   ├── sortableList.js     # Cartões reordenáveis (arrastar e soltar + setas)
│   │   ├── placementBoard.js   # Quebra-cabeça peça → lugar (tocar e tocar, arrastar, teclado)
│   │   ├── activityControls.js # Desfazer · Recomeçar · Conferir
│   │   ├── soundPlayer.js      # "Ouvir o som" / "Ver o som escrito"
│   │   ├── companion.js        # Personagem com balão de fala
│   │   ├── sceneLayers.js      # Cena em camadas
│   │   ├── gameStage.js        # Palco de jogo 2D (Phaser) dentro da tela
│   │   ├── feedback.js         # Mensagens de feedback (sucesso, incentivo, aviso)
│   │   ├── dialog.js           # Abre/fecha diálogos
│   │   ├── settingsPanel.js    # Formulário de configurações
│   │   └── text.js             # fillTemplate: textos com valores
│   ├── views/              # Telas que não são jogos
│   │   └── messages.js
│   ├── vendor/             # Bibliotecas de terceiros, sem alteração (Phaser; ver CREDITS.md)
│   ├── games/              # Um ponto de entrada por módulo
│   │   ├── world.js        # Tela principal: o jogo "Bairro do Noa"
│   │   └── world/          # Motor do jogo (cena, Noa andando, portas, missões em quest/, cenas de perto em closeup/)
│   └── data/               # Conteúdo das atividades (somente dados)
└── assets/
    ├── icons/              # logo.svg + ícones dos módulos
    ├── images/modules/     # Ilustrações dos cartões dos módulos
    ├── images/emotions/    # Rostos (faces/), peças para montar rostos (parts/) e cenas (scenes/)
    ├── images/routine/     # Minha Rotina: pictogramas, Noa (noa/) e cenas em camadas (scenes/)
    ├── images/animals/     # Animais, habitats e alimentos (originais; ver CREDITS.md)
    ├── images/communication/ # Pessoas, cartões, cenários e camadas de Eu Me Comunico
    ├── images/world/       # Atlas de pixel art do Bairro do Noa (Sprout Lands, Ninja Adventure, Kenney e peças próprias; ver CREDITS.md), rostos (faces/) e cenas de perto (closeup/)
    └── sounds/
        └── animals/        # Espaço preparado para os sons (ver README.md da pasta)
```

Ajustes em relação à estrutura sugerida:
- **`js/modules.js`**: catálogo único dos módulos (título, dados, carregamento). O jogo e o roteador leem dele, sem repetir títulos e rotas.
- **`js/progress.js`** e **`css/components.css`** (Etapa 2): progresso separado do armazenamento genérico; estilos de componentes separados do `global.css`.
- **`js/views/`**: telas que não são jogos (avisos de erro) ficam separadas de `games/` e `components/`.
- **Projeto na raiz da pasta atual**: a pasta "Mundo do Aprender" já é a raiz, então não foi criada uma subpasta `mundo-do-aprender/`.

## Interface

- **Cabeçalho:** logotipo (volta ao jogo), **Ajuda** e **Configurações**. Em telas estreitas, os botões mostram só o ícone.
- **Tela do jogo:** nome do lugar, **Estrelas: X de 54** (progresso real), botão de som, fala do Noa, mapa, aviso "Perto de você" com **Começar** e a lista **Ir até um lugar**.
- **Desafio:** nome do módulo e da parte, atividades feitas ali, **Voltar a explorar** no topo e, ao concluir, também embaixo da atividade.
- **Responsivo:** de 320px a 1920px; o mapa cabe na altura da janela.

> As seções abaixo descrevem as atividades de cada módulo. Elas abrem como desafios dentro do jogo.

## Mundo das Emoções (Etapa 3, gameplay revisado)

Três partes, com ilustração, alternativas e "Repetir instrução":

| Parte | Atividades | Como funciona |
| --- | --- | --- |
| Reconhecendo expressões | 2 de olhar (felicidade, tristeza) + 2 de **montar o rosto** (surpresa, raiva) | Olhar: uma resposta esperada, com pista gentil. Montar: a criança escolhe sobrancelhas, olhos e boca, vê o rosto mudar e aperta "Conferir o rosto". Mais de uma peça pode combinar; a pista fala só da peça a trocar. Desfazer/Recomeçar. |
| Detetive das emoções | 4 cenas (inclui medo e calma) | **Usar a lupa** liga o modo de investigação: pessoas e objetos da cena ganham borda tracejada. Tocar neles revela a pista, mostrada aumentada pela lupa logo abaixo da cena (borda contínua + ✓ nos já encontrados; caderno para ver de novo). **Preciso de uma dica** mostra onde olhar. Com as 3 pistas, o **Desafio do detetive**: pôr um rosto no balão de pensamento do personagem (mais de uma emoção aceita) e mostrar qual pista ajudou. |
| Detetive das emoções (cont.) | Missão **Cada um com seu sentimento** | **Arrastar e soltar** (mouse ou dedo): segurar um rosto e levar até o balão de Marina, Davi ou Pedro. O balão sob o rosto fica destacado ("Solte aqui"). Rosto que combina encaixa e o amigo diz "É isso…"; o que não combina volta para a caixa e o amigo responde com gentileza ("Hum… acho que não"). No celular a página rola sozinha perto da borda. Teclado: Enter no rosto e no balão. Pedro aceita calma ou felicidade; sobra um rosto. Dica, Desfazer, Recomeçar. |
| Como posso me expressar? | Missão **O cantinho da calma** + 3 | Cantinho: cena maior (480×300) com 4 lugares. Cada objeto responde ao ser colocado; o tambor convida a trocar por algo mais silencioso. Pronto quando os 4 lugares têm objetos que acalmam. Depois, 3 situações em que todas as formas de se expressar são válidas. |

- Uma atividade conta como feita quando recebe uma resposta válida.
- O desafio começa pela primeira atividade que ainda falta.
- Instruções em voz alta usam a voz do navegador e só tocam com **Sons ligados** e ao tocar em "Repetir instrução".

## Minha Rotina

Um dia inteiro ao lado de **Noa**, que reage a cada ação em um balão de fala. São seis momentos; a criança pode ir a qualquer um, a qualquer hora.

| Momento | Atividades | Como funciona |
| --- | --- | --- |
| Acordar | Bom dia, Noa! · Minha manhã | Tocar na cena (despertador, cortina, levantar) · arrastar cartões até os números |
| Higiene | Lavar as mãos | Arrastar cada passo, na ordem; a pia mostra água, espuma e mãos limpas |
| Alimentação | Hora do lanche | Arrastar até Noa o que pode ajudar |
| Escola | Aula de desenho · Educação física · E agora? | Arrastar objetos até os bolsos da mochila · ajudar Noa |
| Lazer | Depois da escola · Tarde · Sábado | Ajudar Noa · arrastar cartões (no sábado, qualquer ordem) |
| Hora de dormir | Minha noite · Boa noite, Noa! | Arrastar cartões · tocar na cena para preparar o quarto |

- **Sem "Conferir":** Noa responde quando a criança termina. As regras continuam flexíveis (só o que tem ordem de verdade, como lavar as mãos, tem ordem fixa).
- **Recompensas:** cada atividade feita soma uma estrela no jogo; quando o momento inteiro está feito, o balão do lugar vira estrela. Nada fica bloqueado.
- **Formas de jogar:** arrastar com mouse ou dedo, tocar no cartão e depois no lugar, ou usar o teclado (Enter). Todas as atividades têm **Desfazer** e **Recomeçar**.
- **Para criar outra atividade:** acrescente um objeto em `js/data/routine/activities.js` com um dos tipos descritos no início do arquivo.

## Explorando os Animais

A criança visita cinco lugares e descobre 12 animais. Pode ir a qualquer lugar, a qualquer hora.

| Lugar | Atividades | Como funciona |
| --- | --- | --- |
| Fazenda | Passeio · 2 sons | Tocar nos animais e ver as fichas · ouvir ou ler o som e achar o animal no cenário |
| Savana | Passeio · Procurar · 3 refeições | Achar o animal pela pista · arrastar até o animal a comida que ele come |
| Rio e floresta | Passeio · 2 procuras | Tocar nos animais · achar pela pista |
| Em casa | Visita · 1 som | Tocar nos animais · achar pelo som |
| Cada um no seu lugar | 2 (fazenda/savana; água/casa/floresta) | Arrastar cada animal até onde vive. A tartaruga aceita água ou terra. |

- **Ficha do animal:** nome, onde vive, o que come, curiosidade e som.
- **Movimento:** os animais chegam à cena e dão um pulinho ao serem tocados, sempre uma vez só (o projeto não permite animação em repetição).
- **Recompensas:** cada atividade feita soma uma estrela no jogo; os animais também aparecem pelo bairro.
- **Som:** botão "Sons" em cada atividade (a mesma opção de Configurações). Nada toca sozinho e tudo funciona sem som.
- **Para criar outra atividade ou região:** edite `js/data/animals/activities.js` e `js/data/animals/catalog.js`.

**Sons:** nenhum arquivo de som foi incluído (não havia gravações com licença verificada).
Enquanto não houver arquivo, "Ouvir o som" usa a voz do aparelho para imitar o som e avisa isso na tela.
Para incluir gravações reais, siga `assets/sounds/animals/README.md` (nomes, volume, duração, licença).
Nada toca sozinho, e todas as atividades funcionam sem áudio.

## Eu Me Comunico

A criança ajuda **Noa** a se comunicar em quatro lugares. Pode ir a qualquer um, a qualquer hora.

| Lugar | Atividades | Como funciona |
| --- | --- | --- |
| Em casa | Sede · Pote · Lanche · Conversa | Arrastar um cartão até o balão de Noa · montar a frase · conversar em turnos |
| Na escola | Oi, Téo · Lápis · Barulho · Gestos | Conversar · arrastar cartão · levar cada gesto até a situação |
| Brincando | Jogar junto · Escolher · Carrinho | Arrastar cartão · montar a frase · conversar |
| O que eu sinto | Hoje eu sinto · Dizer não · Situações | Montar as frases · conversar · levar cada cartão até a situação |

- **Todos os jeitos valem:** fala, cartões, gestos e imagens. Dizer "não" ou "agora não" é sempre aceito e respeitado pela outra pessoa.
- **Sem resposta certa nas escolhas pessoais.** Só volta o cartão que não combina com a situação, e Noa explica com calma.
- **A cena responde:** a água aparece, o pote abre, o barulho para; cada resposta muda o que a outra pessoa diz.
- **Recompensas:** cada atividade feita soma uma estrela no jogo; quando a parte inteira está feita, o balão do lugar vira estrela.
- **Som:** botão "Sons" em cada atividade (a mesma opção de Configurações). A voz só toca depois de uma ação da criança.
- **Formas de jogar:** arrastar com mouse ou dedo, tocar no cartão e depois no lugar, ou teclado (Enter). Todas têm **Desfazer** e **Recomeçar**.
- **Para criar outra atividade:** siga os tipos descritos em `js/data/communication/activities.js`.

## Acessibilidade (já disponível)

Pelo botão **Configurações** no topo:
- Tamanho do texto: normal, grande ou muito grande.
- Alto contraste.
- Reduzir animações (vem ativado se o sistema operacional pedir menos movimento).
- Sons ligados/desligados (**desligados por padrão**).

Também estão prontos: link "Pular para o conteúdo", foco visível, foco movido para o título a cada troca de tela, áreas de toque grandes e textos de interface em português.

## Dados salvos

Tudo fica no `localStorage` do navegador, com o prefixo `mundo-do-aprender:`:

| Chave | Conteúdo |
| --- | --- |
| `mundo-do-aprender:settings` | Preferências de acessibilidade |
| `mundo-do-aprender:progress` | Por módulo: atividades concluídas e última atividade aberta (`js/progress.js`) |
| `mundo-do-aprender:world` | Onde o Noa está no jogo: mapa, bloco e direção (`js/games/world/worldState.js`) |

"Novo jogo" apaga `progress` e `world`; as preferências (`settings`) continuam.

Nenhum dado sai do computador.

## Próximas etapas

Os quatro jogos serão implementados em etapas futuras, uma de cada vez. Veja o `AGENTS.md` para as regras de desenvolvimento.
