// ✏️ Seus dados pessoais: aparecem no site todo.
export const site = {
  name: 'Bruno Pezzolato',
  handle: 'brpezzolato',
  role: 'Desenvolvedor de produto',
  location: 'Brasil',
  headline: 'Construo produtos digitais claros, rápidos e bem acabados.',
  intro:
    'Aqui eu publico o que estou construindo, o que lancei e o que aprendi no caminho. Do primeiro rascunho até a versão em produção.',
  now: 'Construindo o Vetra, um app que mostra seu dinheiro por inteiro.',
  email: 'contato@exemplo.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/brpezzolato' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/seu-usuario' },
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

export const nav = [
  { label: 'Início', href: '/' },
  { label: 'Projetos', href: '/projetos' },
  { label: 'Novidades', href: '/novidades' },
] as const;
