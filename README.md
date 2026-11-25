# Portfólio — Bruno Pezzolato

Site pessoal para publicar projetos e novidades. Mesmo DNA visual do Vetra:
monocromático, Geist, liquid glass só em controles.

## Stack

- **Next.js 16** (App Router, Cache Components, `proxy.ts`)
- **Tailwind CSS v4** + **shadcn/ui** (`base-nova`, sobre Base UI) com variantes próprias
  (`glass`, `glass-quiet`, `pill` no Button; `mono`, `signal` no Badge)
- **Supabase** (Auth + Postgres com RLS)
- Motion, Lucide, date-fns, react-markdown, Zod

## Rodando

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev
```

Sem `.env.local` o site funciona com o conteúdo de exemplo de `lib/seed.ts`.

## Segurança (três barreiras, nenhuma confia na anterior)

1. **`proxy.ts`** — CSP com nonce novo a cada pedido; `/admin` responde **404**
   para quem não é um e-mail de `ADMIN_EMAILS` logado (a rota "não existe").
2. **Server Components / Actions** — o painel confere a sessão de novo;
   login com Zod, mensagem de erro genérica (sem enumerar e-mails).
3. **Postgres (RLS)** — público só lê o que está publicado; só usuários da
   tabela `admins` escrevem. A `service_role` key **não** é usada no app.

Mais: HSTS, `X-Frame-Options: DENY`, COOP/CORP, Permissions-Policy fechada,
`poweredByHeader: false`, Markdown sem HTML cru, `robots` bloqueando `/admin`.

## Supabase

1. Rode `supabase/migrations/0001_init.sql` no SQL Editor.
2. Crie seu usuário em Authentication → Users (senha com 12+ caracteres).
3. `insert into public.admins (user_id) values ('<seu id>');`
4. Desative cadastro público: Authentication → Providers → Email → *Allow new users to sign up* off.
