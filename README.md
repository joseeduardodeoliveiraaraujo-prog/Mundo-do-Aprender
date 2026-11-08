# Mundo do Aprender

Plataforma educativa digital para crianças de **8 a 12 anos com Transtorno do Espectro Autista (TEA)**, pensada para diferentes necessidades de suporte.

## Módulos

| Módulo | Rota | Situação |
| --- | --- | --- |
| Mundo das Emoções | `#/emocoes` | **Pronto** (13 atividades, em expansão) |
| Minha Rotina | `#/rotina` | **Pronto** (12 atividades) |
| Explorando os Animais | `#/animais` | **Pronto** (15 atividades; sons: ver abaixo) |
| Eu Me Comunico | `#/comunicacao` | **Pronto** (14 atividades) |

## Tecnologias

- HTML5, CSS3 e JavaScript puro (ES Modules).
- `localStorage` para preferências e progresso.
- Sem frameworks, sem backend, sem dependências, sem etapa de build.

## Como executar

Os navegadores bloqueiam ES Modules abertos direto do disco (`file://`). Por isso, é preciso servir a pasta com um servidor estático local. Escolha **uma** das opções:

**Opção 1: VS Code + Live Server**
1. Instale a extensão *Live Server* (Ritwick Dey).
2. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

**Opção 2: Python** (se estiver instalado)
```bash
python -m http.server 8000
```
Depois acesse <http://localhost:8000>.

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
│   ├── home.css            # Tela inicial
│   ├── games.css           # Estrutura comum: atividade, alternativas, lista reordenável, fluxo
│   ├── emotions.css        # Mundo das Emoções: rostos e "Monte o rosto"
│   ├── emotions-detective.css  # Mundo das Emoções: Detetive (lupa, pistas, desafio)
│   ├── emotions-missions.css   # Mundo das Emoções: missões com peças
│   ├── companion.css       # Personagem com balão de fala (Noa)
│   ├── routine-missions.css # Minha Rotina: mecânicas (trilha, mochila, cenas)
│   ├── animals.css         # Estilos específicos de Explorando os Animais e do painel de som
│   ├── communication.css   # Eu Me Comunico: cenário, balão e frase
│   ├── communication-talk.css # Eu Me Comunico: conversa, associação e prancha
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
│   │   ├── backButton.js       # Botão "Voltar" padrão
│   │   ├── card.js             # Cartão genérico
│   │   ├── moduleCard.js       # Cartão de módulo da tela inicial
│   │   ├── screenHeader.js     # Cabeçalho das telas internas
│   │   ├── progressIndicators.js # Barra de progresso e indicador de passos
│   │   ├── activityFrame.js    # Moldura padrão de atividade (instrução, repetir, navegação)
│   │   ├── choiceButton.js     # Alternativas de resposta
│   │   ├── sortableList.js     # Cartões reordenáveis (arrastar e soltar + setas)
│   │   ├── placementBoard.js   # Quebra-cabeça peça → lugar (tocar e tocar, arrastar, teclado)
│   │   ├── activityControls.js # Desfazer · Recomeçar · Conferir
│   │   ├── soundPlayer.js      # "Ouvir o som" / "Ver o som escrito"
│   │   ├── companion.js        # Personagem com balão de fala
│   │   ├── sceneLayers.js      # Cena em camadas
│   │   ├── moduleFlow.js       # Fluxo comum: apresentação → atividades → conclusão
│   │   ├── feedback.js         # Mensagens de feedback (sucesso, incentivo, aviso)
│   │   ├── dialog.js           # Abre/fecha diálogos
│   │   ├── settingsPanel.js    # Formulário de configurações
│   │   └── comingSoon.js       # Tela provisória dos módulos
│   ├── views/              # Telas que não são jogos
│   │   ├── home.js
│   │   └── messages.js
│   ├── games/              # Um ponto de entrada por módulo
│   └── data/               # Conteúdo das atividades (somente dados)
└── assets/
    ├── icons/              # logo.svg + ícones dos módulos
    ├── images/modules/     # Ilustrações dos cartões dos módulos
    ├── images/emotions/    # Rostos (faces/), peças para montar rostos (parts/) e cenas (scenes/)
    ├── images/routine/     # Minha Rotina: pictogramas, Noa (noa/) e cenas em camadas (scenes/)
    ├── images/animals/     # Animais, habitats e alimentos (originais; ver CREDITS.md)
    ├── images/communication/ # Pessoas, cartões, cenários e camadas de Eu Me Comunico
    └── sounds/
        └── animals/        # Espaço preparado para os sons (ver README.md da pasta)
```

Ajustes em relação à estrutura sugerida:
- **`js/modules.js`**: catálogo único dos módulos. A tela inicial e o roteador leem dele, sem repetir títulos e rotas.
- **`js/progress.js`** e **`css/components.css`** (Etapa 2): progresso separado do armazenamento genérico; estilos de componentes separados do `global.css`.
- **`js/views/`**: telas que não são jogos (início, aviso de erro) ficam separadas de `games/` e `components/`.
- **Projeto na raiz da pasta atual**: a pasta "Mundo do Aprender" já é a raiz, então não foi criada uma subpasta `mundo-do-aprender/`.

## Interface (Etapa 2)

- **Tela inicial:** boas-vindas com apresentação, quatro cartões (ilustração, título, descrição, cor própria e botão **Começar**; o cartão inteiro é clicável) e a área **Meu progresso**.
- **Cabeçalho:** logotipo (volta ao início), **Ajuda** e **Configurações**. Em telas estreitas, os botões mostram só o ícone.
- **Telas dos módulos:** botão **Voltar ao início**, título com ícone, apresentação do módulo e aviso de que está em preparação.
- **Progresso:** calculado só a partir de atividades que existem. Enquanto não houver atividades, mostra "Atividades em preparação"; nenhum número é inventado.
- **Responsivo:** celular (1 coluna), tablet retrato e paisagem (2 colunas), computador ≥ 1152px (4 colunas).

## Mundo das Emoções (Etapa 3, gameplay revisado)

Três partes, uma atividade por vez, com ilustração, alternativas, "Repetir instrução", "Anterior"/"Próxima" e tela de conclusão:

| Parte | Atividades | Como funciona |
| --- | --- | --- |
| Reconhecendo expressões | 2 de olhar (felicidade, tristeza) + 2 de **montar o rosto** (surpresa, raiva) | Olhar: uma resposta esperada, com pista gentil. Montar: a criança escolhe sobrancelhas, olhos e boca, vê o rosto mudar e aperta "Conferir o rosto". Mais de uma peça pode combinar; a pista fala só da peça a trocar. Desfazer/Recomeçar. |
| Detetive das emoções | 4 cenas (inclui medo e calma) | **Usar a lupa** liga o modo de investigação: pessoas e objetos da cena ganham borda tracejada. Tocar neles revela a pista, mostrada aumentada pela lupa logo abaixo da cena (borda contínua + ✓ nos já encontrados; caderno para ver de novo). **Preciso de uma dica** mostra onde olhar. Com as 3 pistas, o **Desafio do detetive**: pôr um rosto no balão de pensamento do personagem (mais de uma emoção aceita) e mostrar qual pista ajudou. |
| Detetive das emoções (cont.) | Missão **Cada um com seu sentimento** | **Arrastar e soltar** (mouse ou dedo): segurar um rosto e levar até o balão de Marina, Davi ou Pedro. O balão sob o rosto fica destacado ("Solte aqui"). Rosto que combina encaixa e o amigo diz "É isso…"; o que não combina volta para a caixa e o amigo responde com gentileza ("Hum… acho que não"). No celular a página rola sozinha perto da borda. Teclado: Enter no rosto e no balão. Pedro aceita calma ou felicidade; sobra um rosto. Dica, Desfazer, Recomeçar. |
| Como posso me expressar? | Missão **O cantinho da calma** + 3 | Cantinho: cena maior (480×300) com 4 lugares. Cada objeto responde ao ser colocado; o tambor convida a trocar por algo mais silencioso. Pronto quando os 4 lugares têm objetos que acalmam. Depois, 3 situações em que todas as formas de se expressar são válidas. |

- Uma atividade conta como feita quando recebe uma resposta válida.
- A posição é guardada: ao voltar, a criança pode "Continuar de onde parei".
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
- **Recompensas:** uma estrela por atividade e uma figurinha por momento completo, calculadas do progresso salvo. Nada fica bloqueado.
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
- **Recompensas:** uma estrela por atividade, uma figurinha por lugar completo e o caderno com os animais já vistos, tudo calculado do progresso salvo.
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
- **Recompensas:** uma estrela e um cartão por atividade, uma figurinha por lugar completo e a **prancha de comunicação** na tela final, tudo calculado do progresso salvo.
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

Nenhum dado sai do computador.

## Próximas etapas

Os quatro jogos serão implementados em etapas futuras, uma de cada vez. Veja o `AGENTS.md` para as regras de desenvolvimento.
