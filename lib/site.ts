// ✏️ Seus dados pessoais: aparecem no site todo.
export const site = {
  name: 'Bruno Pezzolato',
  handle: 'brpezzolato',
  role: 'Ciência de Dados & IA',
  location: 'Brasil',
  tagline: 'Dados que viram decisão.',
  short: 'Estudante de Ciência de Dados e assistente de dados no Instituto Conhecimento Liberta.',
  intro:
    'Estudante de Ciência de Dados e assistente de dados no Instituto Conhecimento Liberta. Aqui eu publico o que estou construindo e aprendendo.',
  manifesto:
    'Sou o Bruno. Estudo Ciência de Dados e trabalho como assistente de dados no Instituto Conhecimento Liberta. Gosto de pegar dados bagunçados e transformar em algo que ajuda alguém a decidir: um gráfico, um modelo, um produto.',
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
