// ✏️ Seus dados pessoais: aparecem no site todo.
export const site = {
  name: 'Bruno Pezzolato',
  handle: 'brpezzolato',
  role: 'Ciência de Dados & IA',
  location: 'Brasil',
  headline: 'Transformo dados em',
  typed: ['decisões', 'produtos', 'conversas', 'modelos de IA'],
  intro:
    'Estudante de Ciência de Dados e assistente de dados no Instituto Conhecimento Liberta. Aqui eu publico o que estou construindo e aprendendo: projetos, análises e experimentos com IA.',
  study: { label: 'Formação', title: 'Ciência de Dados', detail: 'Estudante' },
  work: {
    label: 'Trabalho',
    title: 'Instituto Conhecimento Liberta',
    detail: 'Assistente de dados',
  },
  /* O que a orbe "fala" na home, uma frase por vez. */
  assistant: [
    'Olá. Eu sou a assistente do Bruno.',
    'Ele estuda Ciência de Dados e é assistente de dados no Instituto Conhecimento Liberta.',
    'Agora ele está construindo o Vetra, um app que mostra seu dinheiro por inteiro.',
    'Quer ver os projetos? É só rolar a página.',
  ],
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
