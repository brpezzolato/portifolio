// ✏️ Seus dados: aparecem no site todo. Textos em PT e EN (troca no menu).
// Só fatos confirmados; o que falta está marcado com "TODO" para você completar.

export type Lang = 'pt' | 'en';
type T = Record<Lang, string>;

export const site = {
  name: 'Bruno Pezzolato',
  initials: 'BP',
  email: 'contato@exemplo.com', // TODO: seu e-mail
  links: [
    { label: 'GitHub', href: 'https://github.com/brpezzolato' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/seu-usuario' }, // TODO
  ],
  cv: null as string | null, // TODO: ponha o PDF em /public e escreva '/cv.pdf'
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  status: { pt: 'Construindo o Vetra', en: 'Building Vetra' } as T,
  tagline: { pt: 'Dados que viram decisão.', en: 'Data that becomes decisions.' } as T,
  hook: { pt: 'Transformo dados bagunçados em decisões claras.', en: 'I turn messy data into clear decisions.' } as T,
  chips: [
    { pt: 'Ciência de Dados', en: 'Data Science' },
    { pt: 'Instituto Conhecimento Liberta', en: 'Instituto Conhecimento Liberta' },
    { pt: 'Construindo o Vetra', en: 'Building Vetra' },
  ] as T[],
  short: {
    pt: 'Ciência de Dados · Instituto Conhecimento Liberta',
    en: 'Data Science · Instituto Conhecimento Liberta',
  } as T,
  intro: {
    pt: 'Estudante de Ciência de Dados e assistente de dados no Instituto Conhecimento Liberta. Aqui eu publico o que estou construindo e aprendendo.',
    en: 'Data Science student and data assistant at Instituto Conhecimento Liberta. This is where I share what I build and learn.',
  } as T,
  bio: {
    pt: 'Sou o Bruno. Estudo Ciência de Dados e trabalho como assistente de dados no Instituto Conhecimento Liberta. Gosto de pegar dados bagunçados e transformar em algo que ajuda alguém a decidir: um gráfico, um modelo, um produto. Fora do trabalho, construo o Vetra, um app de finanças pessoais.',
    en: "I'm Bruno. I study Data Science and work as a data assistant at Instituto Conhecimento Liberta. I like taking messy data and turning it into something that helps people decide: a chart, a model, a product. On the side I'm building Vetra, a personal finance app.",
  } as T,

  /* Cartões de competências (Sobre). */
  skills: [
    { title: { pt: 'Ciência de Dados', en: 'Data Science' }, detail: { pt: 'Formação em andamento', en: 'Currently studying' } },
    { title: { pt: 'Dados no dia a dia', en: 'Data at work' }, detail: { pt: 'Assistente de dados no ICL', en: 'Data assistant at ICL' } },
    { title: { pt: 'Produto web', en: 'Web product' }, detail: { pt: 'Next.js, React e Supabase', en: 'Next.js, React & Supabase' } },
    { title: { pt: 'IA', en: 'AI' }, detail: { pt: 'Experimentos e assistentes', en: 'Experiments and assistants' } },
  ] as { title: T; detail: T }[],

  /* Faixa de tecnologias. TODO: acrescente suas ferramentas de dados (Python, SQL…). */
  stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind', 'shadcn/ui', 'three.js'],

  /* Jornada (Experiência + formação). TODO: datas. */
  journey: [
    {
      title: { pt: 'Assistente de dados', en: 'Data assistant' },
      org: 'Instituto Conhecimento Liberta',
      kind: { pt: 'Trabalho', en: 'Work' },
      text: { pt: 'Trabalho com dados no dia a dia do instituto.', en: 'Working with data in the institute’s day-to-day.' }, // TODO: detalhe suas atividades
    },
    {
      title: { pt: 'Ciência de Dados', en: 'Data Science' },
      org: { pt: 'Estudante', en: 'Student' },
      kind: { pt: 'Formação', en: 'Education' },
      text: { pt: 'Estatística, programação e aprendizado de máquina.', en: 'Statistics, programming and machine learning.' },
    },
  ] as { title: T; org: string | T; kind: T; text: T }[],

  /* Fotos de apresentações (Galeria). Fica escondida enquanto vazia.
     Ex.: { src: '/galeria/apresentacao.jpg', caption: { pt: '…', en: '…' } } */
  gallery: [] as { src: string; caption: T }[],
} as const;

/* Textos da interface. */
export const ui = {
  nav: {
    inicio: { pt: 'Início', en: 'Home' },
    sobre: { pt: 'Sobre', en: 'About' },
    projetos: { pt: 'Projetos', en: 'Projects' },
    experiencia: { pt: 'Jornada', en: 'Journey' },
    novidades: { pt: 'Novidades', en: 'News' },
    contato: { pt: 'Contato', en: 'Contact' },
  },
  seeProjects: { pt: 'Ver projetos', en: 'See projects' },
  contact: { pt: 'Contato', en: 'Contact' },
  downloadCv: { pt: 'Baixar CV', en: 'Download CV' },
  statProjects: { pt: 'Projetos publicados', en: 'Published projects' },
  statStack: { pt: 'Tecnologias no dia a dia', en: 'Technologies I use' },
  statNews: { pt: 'Novidades postadas', en: 'Updates posted' },
  aboutTitle: { pt: 'Sobre mim', en: 'About me' },
  projectsTitle: { pt: 'Projetos em destaque', en: 'Featured projects' },
  allProjects: { pt: 'Todos os projetos', en: 'All projects' },
  code: { pt: 'Código', en: 'Code' },
  demo: { pt: 'Ver online', en: 'Live' },
  details: { pt: 'Detalhes', en: 'Details' },
  journeyTitle: { pt: 'Minha jornada', en: 'My journey' },
  galleryTitle: { pt: 'Galeria', en: 'Gallery' },
  newsTitle: { pt: 'Novidades', en: 'News' },
  allNews: { pt: 'Ver tudo', en: 'See all' },
  contactTitle: { pt: 'Vamos conversar?', en: "Let's talk?" },
  contactText: {
    pt: 'Tem um projeto, uma vaga ou um conjunto de dados em mente? Minha caixa de entrada está aberta.',
    en: 'Have a project, a role or a dataset in mind? My inbox is open.',
  },
  formName: { pt: 'Nome', en: 'Name' },
  formEmail: { pt: 'E-mail', en: 'Email' },
  formMessage: { pt: 'Mensagem', en: 'Message' },
  formSend: { pt: 'Enviar mensagem', en: 'Send message' },
  formHint: { pt: 'Todos os campos são obrigatórios.', en: 'All fields are required.' },
  writeMe: { pt: 'Escrever mensagem', en: 'Write a message' },
  madHi: { pt: 'Oi, Bruno! Meu nome é', en: 'Hi Bruno! My name is' },
  madMid: { pt: 'e você pode me responder em', en: 'and you can reach me at' },
  madEnd: { pt: 'Eu queria conversar sobre', en: "I'd like to talk about" },
  phName: { pt: 'seu nome', en: 'your name' },
  phEmail: { pt: 'seu@email.com', en: 'you@email.com' },
  phMessage: { pt: 'um projeto, uma vaga, uma ideia…', en: 'a project, a role, an idea…' },
  orReach: { pt: 'Ou me encontre em', en: 'Or find me on' },
  kineticTop: { pt: 'Ciência de Dados', en: 'Data Science' },
  formSending: { pt: 'Enviando…', en: 'Sending…' },
  formOk: { pt: 'Mensagem enviada. Obrigado! Respondo em breve.', en: 'Message sent. Thank you! I will reply soon.' },
  formFail: { pt: 'Não foi possível enviar agora. Tente o e-mail acima.', en: "Couldn't send right now. Try the email above." },
  formLimit: { pt: 'Muitas mensagens em pouco tempo. Tente de novo mais tarde ou use o e-mail acima.', en: 'Too many messages in a short time. Try again later or use the email above.' },
  formInvalid: { pt: 'Confira os campos: nome, e-mail válido e uma mensagem de pelo menos 10 caracteres.', en: 'Check the fields: name, a valid email and a message of at least 10 characters.' },
  rights: { pt: 'Feito com Next.js, Supabase e three.js.', en: 'Built with Next.js, Supabase and three.js.' },
  theme: { pt: 'Alternar tema', en: 'Toggle theme' },
  menu: { pt: 'Menu', en: 'Menu' },
} satisfies Record<string, unknown>;

export const nav = [
  { key: 'inicio', href: '/#inicio' },
  { key: 'sobre', href: '/#sobre' },
  { key: 'projetos', href: '/#projetos' },
  { key: 'experiencia', href: '/#jornada' },
  { key: 'novidades', href: '/#novidades' },
  { key: 'contato', href: '/#contato' },
] as const;
