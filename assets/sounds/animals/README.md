# assets/sounds/animals — sons dos animais (espaço preparado)

**Situação atual:** nenhum arquivo de som foi incluído. Não havia gravações com licença verificada,
e o projeto não usa links externos. Enquanto não houver arquivo, o botão **"Ouvir o som"** usa a voz
do aparelho para *imitar* o som (ex.: "Muuu!") e a tela avisa que é uma imitação. A atividade
também pode ser feita sem áudio pelo botão **"Ver o som escrito"**.

## Arquivos esperados

| Arquivo | Animal | Usado em atividade? |
| --- | --- | --- |
| `cow.mp3` | Vaca | Sim (Descobrindo os sons) |
| `chicken.mp3` | Galinha | Sim (Descobrindo os sons) |
| `cat.mp3` | Gato | Sim (Descobrindo os sons) |
| `dog.mp3` | Cachorro | Reservado |
| `horse.mp3` | Cavalo | Reservado |
| `duck.mp3` | Pato | Reservado |
| `lion.mp3` | Leão | Reservado (usar rugido suave e baixo) |
| `elephant.mp3` | Elefante | Reservado (usar som suave e baixo) |
| `monkey.mp3` | Macaco | Reservado |

Girafa, peixe e tartaruga quase não fazem sons audíveis e não precisam de arquivo.

## Especificações (cuidado sensorial)

- Formato `.mp3`, mono, 44,1 kHz, 96–128 kbps.
- Duração de **1 a 3 segundos**, com *fade in* e *fade out* curtos (sem início abrupto).
- Volume normalizado (referência: **−16 LUFS**, pico máximo −3 dBFS). O app ainda toca com volume 60%.
- Sem ruído de fundo, ecos, gritos ou sons agudos/estridentes. Rugidos e barridos em versão suave.
- Arquivos leves (até ~100 KB cada).

## Licença (obrigatório)

Use somente gravações próprias ou com licença que permita uso educativo e redistribuição
(ex.: domínio público / CC0, ou CC BY com atribuição). Registre **cada arquivo** em
`CREDITS.md` nesta pasta: nome do arquivo, autor, origem (link), licença e data.

## Como ativar um som

1. Coloque o arquivo nesta pasta com o nome da tabela.
2. Em `js/data/animals.js`, no animal correspondente, troque `file: null` por
   `file: 'assets/sounds/animals/<nome>.mp3'` (o caminho já está em `expectedFile`).
3. Teste com os sons ligados e desligados.
