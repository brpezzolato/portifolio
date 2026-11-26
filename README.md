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

## Painel administrativo (rota escondida)

Tudo o que aparece no site é editado pelo painel: conteúdo (textos PT/EN, links,
cartões, jornada, etiquetas), projetos, novidades (com rascunho e data) e as
mensagens do formulário de contato.

- **Endereço secreto:** o painel abre só em `/<ADMIN_PATH>`. `/admin` e qualquer
  outro caminho respondem 404. Sem `ADMIN_PATH`, o painel fica desligado.
- **Entrada em duas etapas, obrigatória:** senha (12+ caracteres) e código de app
  autenticador (TOTP). No primeiro acesso o painel mostra o QR code para cadastrar.
- **Limite de tentativas:** 5 por endereço a cada 15 minutos (login e código).
- **Banco:** RLS em todas as tabelas; escrita só para quem está na tabela `admins`
  **e** com sessão de dois fatores (`aal2`). A `service_role` não é usada.
- **Sem rastro:** painel com `no-store`, `noindex` e `no-referrer`; cookies `SameSite=Strict`.

### Onde está o banco

O banco roda no projeto Supabase **Synapse** (o plano gratuito permite só dois
projetos). Por isso todas as tabelas e funções do portfólio têm prefixo `pf_`
(`supabase/migrations/0001_portfolio_pf.sql`) e nada do Synapse é tocado.
As configurações de autenticação do projeto também não foram mudadas (o Synapse
precisa delas): o painel exige estar em `pf_admins`, estar em `ADMIN_EMAILS` e
ter o código do autenticador.

Variáveis na Vercel: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `ADMIN_EMAILS` e `ADMIN_PATH`.
Para trocar o endereço secreto, mude `ADMIN_PATH` na Vercel e refaça o deploy.

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
