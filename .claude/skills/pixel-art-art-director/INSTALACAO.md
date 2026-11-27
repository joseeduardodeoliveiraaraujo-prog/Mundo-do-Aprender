# Guia rápido — Pixel Art Art Director

A Skill já está instalada neste projeto, em `.claude/skills/pixel-art-art-director/`
(a pasta `.claude/skills/` é a que o Claude Code reconhece). Para usar, peça:

```text
Use a Skill pixel-art-art-director para fazer uma auditoria visual do jogo.
Não altere nenhum arquivo ainda. Inspecione a estrutura, identifique os principais
problemas de direção de arte, consistência da pixel art, interface, responsividade
e acessibilidade. Apresente prioridades e um plano incremental, preservando
todas as funcionalidades e a arquitetura atual.
```

Para uma melhoria específica:

```text
Use a Skill pixel-art-art-director para melhorar visualmente [tela/cena/componente].
Antes de editar, inspecione os arquivos e explique o plano. Preserve a lógica,
os dados, as interações, o suporte a toque e teclado e a identidade visual existente.
Faça apenas as alterações necessárias e valide o resultado.
```

A Skill orienta o comportamento do Claude; ela não instala ferramentas nem cria assets
sozinha. As regras de arte do jogo ficam em `assets/images/world/PALETTE.md` e os
geradores em `tools/` (ver `tools/README.md`).
