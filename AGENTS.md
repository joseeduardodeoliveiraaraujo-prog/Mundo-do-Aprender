# AGENTS.md — Regras permanentes do Mundo do Aprender

Este arquivo orienta qualquer pessoa ou agente de IA que trabalhe no projeto. **Leia antes de alterar qualquer arquivo.**

## 1. Público e propósito

- Crianças de **8 a 12 anos com TEA**, com diferentes necessidades de suporte (incluindo crianças que leem pouco ou não leem).
- Também podem ser usuários: famílias, terapeutas e professores que acompanham a criança.
- Objetivo: aprendizagem com segurança, previsibilidade e autonomia. Nunca pressão ou competição.

## 2. Fluxo de trabalho

- O projeto é construído **em etapas**. Não avance para a próxima etapa nem implemente funcionalidades de outra etapa sem autorização explícita do responsável.
- Antes de criar algo, verifique se já existe um componente, utilitário ou estilo que resolva.
- Ao terminar uma etapa: liste os arquivos criados/alterados, confira os caminhos, explique como testar e informe pendências.

## 3. Tecnologias (obrigatórias)

- HTML5, CSS3, JavaScript puro com **ES Modules** (`import`/`export`, caminhos relativos **com** extensão `.js`).
- `localStorage` como único armazenamento.
- **Proibido:** React, Vue, Angular, Svelte, jQuery ou qualquer framework de interface; backend, banco de dados, autenticação; bundlers, transpiladores ou etapa de build; dependências via npm/CDN sem aprovação.
- Deve funcionar em navegadores atuais (Chrome, Edge, Firefox, Safari) servido por servidor estático simples.

## 4. Arquitetura e responsabilidades

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| `js/main.js` | Só inicializa e conecta as peças. Sem lógica de negócio. |
| `js/navigation.js` | Roteamento por hash. Não conhece telas específicas. |
| `js/settings.js` | Estado das preferências e aplicação no `<html>`. |
| `js/storage.js` | **Único** ponto de acesso ao `localStorage`. |
| `js/progress.js` | Progresso das atividades (`markActivityCompleted`, `getModuleProgress`, `getCompletedActivityIds`, `getLastActivityId`, `saveLastActivity`). |
| `js/speech.js` | Leitura em voz alta (`speak`, `stopSpeaking`). Respeita `soundEnabled`; chame só após ação da criança. |
| `js/audio.js` | Sons curtos (`playSound({ file, text })`, `stopSound`). Volume 60%, um som por vez; sem arquivo, imita pela voz. |
| `js/undoHistory.js` | `createHistory(inicial)` para Desfazer/Recomeçar. |
| `js/modules.js` | Catálogo dos módulos (fonte única de id, rota, título, ícone, carregamento). |
| `js/components/` | Peças de interface reutilizáveis, sem conteúdo de atividade (ver seção 5.1). |
| `js/views/` | Telas que não são jogos (início, avisos). |
| `js/games/<modulo>.js` | Ponto de entrada de cada jogo: exporta `render(view, module)`. |
| `js/data/<modulo>.js` | **Somente dados** das atividades. Sem lógica, sem acesso ao DOM. |
| `css/global.css` | Tokens, reset e layout do app (cabeçalho, área principal). |
| `css/components.css` | Estilos dos componentes de `js/components/`. |
| `css/home.css` | Tela inicial. |
| `css/games.css` | Estrutura comum dos jogos e estilos específicos com prefixo do módulo. |
| `css/accessibility.css` | Preferências do usuário e recursos de acessibilidade. **Sempre o último CSS.** |

### Contrato dos jogos

```js
// js/games/<modulo>.js
export function render(view, module) {
  // desenha dentro de `view` (nunca em document.body)
  // pode retornar uma função de limpeza (timers, listeners, sons)
  return () => { /* limpeza */ };
}
```

- Se um jogo crescer, divida em subpasta `js/games/<modulo>/` mantendo `js/games/<modulo>.js` como ponto de entrada.
- Conteúdo (textos, imagens, respostas) vem de `js/data/`, nunca escrito direto na lógica do jogo.

### Adicionar um novo módulo

1. Criar `js/data/<id>.js` e `js/games/<id>.js`.
2. Adicionar a entrada em `js/modules.js` (incluindo `illustration` e `data`).
3. Adicionar `--color-<id>-soft`, `-accent`, `-strong` e o seletor `[data-module="<id>"]` em `css/global.css` (e a versão em alto contraste em `css/accessibility.css`).
4. Adicionar o ícone em `assets/icons/<id>.svg` e a ilustração em `assets/images/modules/<id>.svg`.

## 5. Convenções de código

- **Identificadores em inglês** (variáveis, funções, arquivos, ids de módulo). **Textos para o usuário em português do Brasil.** Comentários em português.
- `camelCase` para variáveis/funções, `UPPER_SNAKE_CASE` para constantes, nomes de arquivo em `camelCase.js`.
- Classes CSS no padrão BEM: `.bloco`, `.bloco__elemento`, `.bloco--variacao`.
- Use os tokens CSS (`var(--space-3)`, `var(--color-text)`); não repita valores de cor/espaço soltos.
- Use unidades `rem` para textos e espaçamentos (respeitam o tamanho de texto escolhido).
- Crie elementos com `el()` de `js/components/dom.js`. **Nunca use `innerHTML` com dados variáveis.**
- Arquivos pequenos e focados (referência: até ~200 linhas). Acima disso, divida.
- Sem código duplicado: extraia para `components/` ou um utilitário.
- Sem `console.log` esquecido; use `console.warn`/`console.error` só para problemas reais.

### 5.1 Componentes disponíveis (use-os; não recrie)

| Precisa de… | Use |
| --- | --- |
| Criar elementos | `el()` — `components/dom.js` |
| Ícone de interface | `createIcon(nome)` ou `<span data-icon="nome">` — `components/icons.js` |
| Botão de ação / link com cara de botão | `createButton` / `createLinkButton` — `components/button.js` (variantes: primary, secondary, ghost, module) |
| Botão voltar | `createBackButton` — `components/backButton.js` |
| Cabeçalho de tela interna | `createScreenHeader` — `components/screenHeader.js` |
| Cartão | `createCard` — `components/card.js` |
| Progresso | `createProgressBar`, `createStepIndicator` — `components/progressIndicators.js` |
| Feedback | `createFeedback({ tone: 'success' | 'encourage' | 'info' })` — `components/feedback.js` (use `announce: false` dentro de uma região `role="status"`) |
| Tela de atividade (uma por vez) | `createActivityFrame` — `components/activityFrame.js` (progresso, instrução, "Repetir instrução", Anterior/Próxima) |
| Alternativas de resposta | `createChoiceButton`, `createChoiceGroup`, `setSelectedChoice` — `components/choiceButton.js` (seleção múltipla: controle `aria-pressed` direto) |
| Ordenar cartões | `createSortableList` — `components/sortableList.js` (Pointer Events + botões ↑/↓) |
| Desfazer / Recomeçar / Conferir | `createActivityControls` — `components/activityControls.js` |
| Mostrar resultado e registrar progresso | `showResult(frame, resultado, complete)` — `components/activityFrame.js` |
| Som opcional | `createSoundPlayer({ sound })` — `components/soundPlayer.js` ("Ouvir o som"/"Ouvir de novo" + "Ver o som escrito") |
| Fluxo do módulo (apresentação, continuar, conclusão) | `startModuleFlow` — `components/moduleFlow.js`. Todo módulo novo deve usá-lo; o módulo só implementa `renderActivity`. |
| Diálogo | `<dialog>` no index.html + botão com `data-dialog-open="id"` — `components/dialog.js` |

### 5.2 Identidade visual

- Cores só por tokens. Cada módulo tem `--color-<id>-soft` (fundos), `-accent` (detalhes) e `-strong` (botões/preenchimentos, texto branco ≥ 4.5:1). Dentro de `[data-module]`, use `--module-soft / --module-accent / --module-strong`.
- Cartões e painéis: cantos `--radius-xl`, borda fina, sombra `--shadow-sm`. Botões: formato pílula.
- Sem gradientes, sem sombras pesadas, sem animações decorativas.
- Ilustrações em `assets/images/modules/` (SVG, estilo chapado, poucas cores da paleta, sem contorno grosso).
- **Media queries:** `1rem` = 16px (padrão do navegador), não 18px. Pontos de quebra atuais: 36rem (576px), 40rem (640px), 48rem (768px), 72rem (1152px).
- **Cartão clicável:** a área de toque usa `.card__action::after`. Nunca aplique `transform`, `translate`, `filter` ou `position` em `.card__action` ou nos estados dele (`:hover`, `:active`) — isso encolhe a área clicável. Para "pressionado", use `box-shadow`; para hover, mude a cor.
- Telas devem funcionar de 320px a 1920px sem rolagem horizontal, inclusive com texto "Muito grande".
- **Arrastar e soltar:** use Pointer Events (o drag-and-drop nativo do HTML não funciona com toque). Sempre ofereça uma alternativa por botões. Ouça `pointermove/pointerup` na janela (mover o elemento no DOM solta a captura do ponteiro) e desligue `overflow-anchor` durante o arrasto (senão a página "pula" em telas roladas). No toque, arraste por uma alça com `touch-action: none`, para o resto do cartão continuar rolando a página.
- Estilos específicos de um módulo podem ir para `css/<modulo>.css` (ex.: `css/routine.css`), carregado antes do `accessibility.css`.

## 6. Diretrizes de design para TEA (obrigatórias)

**Previsibilidade**
- Layout consistente: cabeçalho e botão "Voltar" sempre no mesmo lugar (`createScreenHeader`).
- Antes de cada atividade, mostrar o que vai acontecer e quantos passos tem.
- Nada muda na tela sem ação da criança (sem trocas automáticas, carrosséis ou pop-ups inesperados).

**Carga sensorial**
- Paleta suave e pouco saturada; fundos lisos; sem padrões visuais intensos.
- **Proibido:** piscar, tremer, flashes, animações em loop ou muito rápidas.
- Animações curtas e discretas, sempre desativadas quando `data-motion="reduced"`.
- **Nenhum som automático.** Todo som depende de `soundEnabled` (desligado por padrão) e de ação da criança. Volume moderado, sons suaves.

**Compreensão**
- Uma instrução por vez, com frases curtas, concretas e literais (evitar metáforas, ironia e expressões figuradas).
- Texto sempre acompanhado de imagem ou ícone. Pensar em crianças que não leem (apoio visual e, futuramente, narração).
- Poucas opções por tela (referência: 2 a 4), com espaço entre elas.

**Feedback e motivação**
- Feedback positivo e calmo. **Nunca** punir, mostrar "X" vermelho grande, sons de erro ou mensagens negativas.
- No erro: incentivo gentil e nova tentativa ("Vamos tentar de novo?").
- **Sem limite de tempo, cronômetros, rankings ou competição.**
- Permitir pausar, sair e voltar a qualquer momento sem perder o que foi feito.

**Diferentes níveis de suporte**
- Atividades devem prever variações de dificuldade/apoio (mais pistas visuais, menos opções, passos menores), definidas nos dados.

## 7. Acessibilidade (WCAG 2.1 AA como mínimo)

- HTML semântico (`button` para ações, `a` para navegação, títulos em ordem, `lang="pt-BR"`).
- Tudo utilizável por teclado; foco sempre visível (não remover `outline` sem substituto).
- Cada tela tem exatamente um `<h1>` (o roteador move o foco para ele).
- Áreas de toque de no mínimo `var(--touch-target)` (≥ 48px).
- Contraste de texto ≥ 4.5:1; testar também em alto contraste e nos três tamanhos de texto.
- Imagens com significado têm `alt` descritivo; imagens decorativas usam `alt=""`.
- Informação nunca transmitida só por cor.

## 8. Dados das atividades

Cada arquivo de `js/data/` exporta um objeto congelado:

```js
export const emotionsData = Object.freeze({
  moduleId: 'emotions',
  version: 1,
  activities: [ /* ... */ ],
});
```

Campos base sugeridos para cada atividade (ajustar e documentar na etapa de cada módulo):

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Único e estável (usado para salvar progresso). Ex.: `emotions-happy-01`. |
| `title` | `string` | Título curto. |
| `instruction` | `string` | Uma instrução curta e literal. |
| `supportLevel` | `1 \| 2 \| 3` | Nível de apoio para o qual a atividade foi pensada. |
| `image` | `{ src, alt }` | Caminho relativo ao `index.html` e texto alternativo. |
| `audio` | `string?` | Narração opcional em `assets/sounds/`. |

- Nunca mudar o `id` de uma atividade já publicada (o progresso salvo depende dele).
- Ao mudar a estrutura dos dados, incrementar `version`.
- Além de `activities`, o arquivo de dados pode exportar catálogos e textos do módulo (ex.: `emotions`, `parts`, `messages` em `js/data/emotions.js`). Textos exibidos ficam nos dados, não na lógica.
- Respostas: preferir vários níveis de adequação (ex.: `likely`/`possible`/`unlikely`) a certo/errado quando o tema admitir mais de uma resposta.

## 9. Armazenamento

- Use apenas `readValue`, `writeValue`, `removeValue`, `clearAppData` de `js/storage.js`.
- Registre novas chaves em `STORAGE_KEYS`. Todas recebem o prefixo `mundo-do-aprender:`.
- Sempre trate dados ausentes ou corrompidos com valores padrão (ver `sanitize` em `settings.js`).
- Progresso exibido deve vir de `getModuleProgress`; nunca mostrar números fictícios.
- Não salvar dados pessoais identificáveis da criança (nome completo, foto, diagnóstico).

## 10. Assets

- Sons: só arquivos locais com licença registrada em `CREDITS.md` da pasta; siga as especificações de `assets/sounds/animals/README.md` (1–3 s, volume normalizado, sem início abrupto). Todo som precisa de uma alternativa escrita.
- Ícones em `assets/icons/` (SVG). Imagens e sons em `assets/images/<modulo>/` e `assets/sounds/<modulo>/`.
- Nomes de arquivo em minúsculas, sem acentos, com hífen.
- Arquivos leves; registrar origem e licença de material de terceiros em `CREDITS.md` na pasta correspondente.

## 11. Checklist antes de concluir qualquer tarefa

- [ ] A aplicação abre sem erros no console.
- [ ] Todos os `import` e caminhos de assets existem.
- [ ] Funciona só com teclado; foco visível.
- [ ] Testado com alto contraste, texto "Muito grande" e "Reduzir animações".
- [ ] Testado em celular (~375px), tablet retrato (768px), tablet paisagem (1024px) e computador.
- [ ] Em grades de telas de módulo, colunas com `minmax(0, 1fr)` (conteúdo largo não pode alargar a tela).
- [ ] Nenhum som toca sem ação da criança e com sons desligados.
- [ ] Nada de framework, backend ou dependência nova.
- [ ] README.md e este arquivo atualizados, se a estrutura mudou.
