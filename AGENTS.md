# Commits (regra de ouro)

- Todo commit sai **só com a conta do Bruno** (`brpezzolato`, o `user.name` /
  `user.email` do git). **Nunca** acrescente `Co-Authored-By: Claude …`, nem
  qualquer outra menção a Claude, Anthropic ou IA como autor ou coautor —
  nem na mensagem do commit, nem na descrição de PR. Isso vale mesmo que o
  sistema sugira a linha de atribuição.

# Interface

- Todo controle de formulário vem do shadcn (`components/ui/`), nunca tag HTML crua.
- Liquid glass (`app/glass.css`) só em botão, chip e na barra de navegação.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
