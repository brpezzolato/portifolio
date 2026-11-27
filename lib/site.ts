// ✏️ Seus dados: aparecem no site todo. Textos em PT, EN e ES (troca no menu).
// Estes são os valores padrão; o que você edita no painel tem prioridade.

export type Lang = 'pt' | 'en' | 'es';
export const langs = ['pt', 'en', 'es'] as const;
export type T = Record<Lang, string>;

export const site = {
  name: 'Bruno Pezzolato',
  initials: 'BP',
  email: 'contato@exemplo.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/brpezzolato' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/seu-usuario' },
  ],
  /* Data (ISO) do último envio do currículo pelo painel; null = sem currículo.
     O arquivo é baixado em /curriculo. */
  cv: null as string | null,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  status: { pt: 'Construindo o Vetra', en: 'Building Vetra', es: 'Construyendo Vetra' } as T,
  tagline: { pt: 'Dados que viram decisão.', en: 'Data that becomes decisions.', es: 'Datos que se convierten en decisiones.' } as T,
  hook: {
    pt: 'Transformo dados bagunçados em decisões claras.',
    en: 'I turn messy data into clear decisions.',
    es: 'Convierto datos desordenados en decisiones claras.',
  } as T,
  chips: [
    { pt: 'Ciência de Dados', en: 'Data Science', es: 'Ciencia de Datos' },
    { pt: 'Instituto Conhecimento Liberta', en: 'Instituto Conhecimento Liberta', es: 'Instituto Conhecimento Liberta' },
    { pt: 'Construindo o Vetra', en: 'Building Vetra', es: 'Construyendo Vetra' },
  ] as T[],
  short: {
    pt: 'Ciência de Dados · Instituto Conhecimento Liberta',
    en: 'Data Science · Instituto Conhecimento Liberta',
    es: 'Ciencia de Datos · Instituto Conhecimento Liberta',
  } as T,
  intro: {
    pt: 'Estudante de Ciência de Dados e assistente de dados no Instituto Conhecimento Liberta. Aqui eu publico o que estou construindo e aprendendo.',
    en: 'Data Science student and data assistant at Instituto Conhecimento Liberta. This is where I share what I build and learn.',
    es: 'Estudiante de Ciencia de Datos y asistente de datos en el Instituto Conhecimento Liberta. Aquí comparto lo que construyo y aprendo.',
  } as T,
  bio: {
    pt: 'Sou o Bruno, estudante de Ciência de Dados e assistente de dados no Instituto Conhecimento Liberta. Comecei pelo desenvolvimento: fiz o técnico em Desenvolvimento de Sistemas no SENAI, onde aprendi a construir sistemas de ponta a ponta. Hoje junto os dois lados: uso dados e estatística para encontrar respostas e o desenvolvimento para colocá-las nas mãos de quem decide, em análises, painéis e produtos. Fora do trabalho, construo o Vetra, um app de finanças pessoais.',
    en: "I'm Bruno, a Data Science student and data assistant at Instituto Conhecimento Liberta. I started in development: I took the technical program in Systems Development at SENAI, where I learned to build systems end to end. Today I bring both sides together: I use data and statistics to find answers, and development to put them in the hands of decision-makers, as analyses, dashboards and products. Outside work, I'm building Vetra, a personal finance app.",
    es: 'Soy Bruno, estudiante de Ciencia de Datos y asistente de datos en el Instituto Conhecimento Liberta. Empecé por el desarrollo: hice el curso técnico en Desarrollo de Sistemas en el SENAI, donde aprendí a construir sistemas de principio a fin. Hoy uno los dos lados: uso datos y estadística para encontrar respuestas, y el desarrollo para ponerlas en manos de quien decide, en análisis, paneles y productos. Fuera del trabajo, construyo Vetra, una app de finanzas personales.',
  } as T,

  /* Cartões de competências (Sobre). */
  skills: [
    {
      title: { pt: 'Ciência de Dados', en: 'Data Science', es: 'Ciencia de Datos' },
      detail: { pt: 'Formação em andamento', en: 'Currently studying', es: 'Formación en curso' },
    },
    {
      title: { pt: 'Dados no dia a dia', en: 'Data at work', es: 'Datos en el día a día' },
      detail: { pt: 'Assistente de dados no ICL', en: 'Data assistant at ICL', es: 'Asistente de datos en el ICL' },
    },
    {
      title: { pt: 'Produto web', en: 'Web product', es: 'Producto web' },
      detail: { pt: 'Next.js, React e Supabase', en: 'Next.js, React & Supabase', es: 'Next.js, React y Supabase' },
    },
    {
      title: { pt: 'IA', en: 'AI', es: 'IA' },
      detail: { pt: 'Experimentos e assistentes', en: 'Experiments and assistants', es: 'Experimentos y asistentes' },
    },
  ] as { title: T; detail: T }[],

  /* Faixa de tecnologias. */
  stack: ['Next.js', 'SQL', 'MySQL', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind', 'shadcn/ui', 'three.js'],

  /* Jornada (experiência e formação). */
  journey: [
    {
      title: { pt: 'Assistente de dados', en: 'Data assistant', es: 'Asistente de datos' },
      org: 'Instituto Conhecimento Liberta',
      kind: { pt: 'Trabalho', en: 'Work', es: 'Trabajo' },
      text: {
        pt: 'Apoio o instituto com dados: organizo e consulto bases, preparo análises e transformo números em informação clara para a equipe decidir.',
        en: 'I support the institute with data: I organize and query databases, prepare analyses and turn numbers into clear information for the team to decide.',
        es: 'Apoyo al instituto con datos: organizo y consulto bases, preparo análisis y convierto números en información clara para que el equipo decida.',
      },
    },
    {
      title: { pt: 'Ciência de Dados', en: 'Data Science', es: 'Ciencia de Datos' },
      org: { pt: 'Estudante', en: 'Student', es: 'Estudiante' },
      kind: { pt: 'Formação', en: 'Education', es: 'Formación' },
      text: {
        pt: 'Formação em andamento: estatística, programação, bancos de dados e aprendizado de máquina aplicados a problemas reais.',
        en: 'In progress: statistics, programming, databases and machine learning applied to real problems.',
        es: 'En curso: estadística, programación, bases de datos y aprendizaje automático aplicados a problemas reales.',
      },
    },
    {
      title: {
        pt: 'Técnico em Desenvolvimento de Sistemas',
        en: 'Technical Degree in Systems Development',
        es: 'Técnico en Desarrollo de Sistemas',
      },
      org: 'SENAI São Caetano do Sul · Mecatrônica Boa Vista',
      kind: { pt: 'Formação · 2024–2025', en: 'Education · 2024–2025', es: 'Formación · 2024–2025' },
      text: {
        pt: 'Curso técnico de dois anos: lógica de programação, desenvolvimento web, banco de dados e projetos práticos.',
        en: 'Two-year technical program: programming logic, web development, databases and hands-on projects.',
        es: 'Curso técnico de dos años: lógica de programación, desarrollo web, bases de datos y proyectos prácticos.',
      },
    },
  ] as { title: T; org: string | T; kind: T; text: T }[],

  /* Fotos de apresentações (Galeria). Fica escondida enquanto vazia.
     Ex.: { src: '/galeria/apresentacao.jpg', caption: { pt: '…', en: '…', es: '…' } } */
  gallery: [] as { src: string; caption: T }[],
} as const;

/* Textos da interface. */
export const ui = {
  nav: {
    inicio: { pt: 'Início', en: 'Home', es: 'Inicio' },
    sobre: { pt: 'Sobre', en: 'About', es: 'Sobre mí' },
    projetos: { pt: 'Projetos', en: 'Projects', es: 'Proyectos' },
    experiencia: { pt: 'Jornada', en: 'Journey', es: 'Trayectoria' },
    novidades: { pt: 'Novidades', en: 'News', es: 'Novedades' },
    contato: { pt: 'Contato', en: 'Contact', es: 'Contacto' },
  },
  seeProjects: { pt: 'Ver projetos', en: 'See projects', es: 'Ver proyectos' },
  contact: { pt: 'Contato', en: 'Contact', es: 'Contacto' },
  downloadCv: { pt: 'Baixar currículo', en: 'Download résumé', es: 'Descargar currículum' },
  cvLabel: { pt: 'Currículo', en: 'Résumé', es: 'Currículum' },
  cvTitle: { pt: 'Meu currículo, em uma página.', en: 'My résumé, on one page.', es: 'Mi currículum, en una página.' },
  cvText: {
    pt: 'Formação, experiência e ferramentas que uso no dia a dia. PDF pronto para imprimir ou anexar.',
    en: 'Education, experience and the tools I use every day. A PDF ready to print or attach.',
    es: 'Formación, experiencia y las herramientas que uso a diario. PDF listo para imprimir o adjuntar.',
  },
  cvUpdated: { pt: 'Atualizado em', en: 'Updated on', es: 'Actualizado el' },
  cvFile: { pt: 'PDF', en: 'PDF', es: 'PDF' },
  statProjects: { pt: 'Projetos publicados', en: 'Published projects', es: 'Proyectos publicados' },
  statStack: { pt: 'Tecnologias no dia a dia', en: 'Technologies I use', es: 'Tecnologías que uso' },
  statNews: { pt: 'Novidades postadas', en: 'Updates posted', es: 'Novedades publicadas' },
  aboutTitle: { pt: 'Sobre mim', en: 'About me', es: 'Sobre mí' },
  projectsTitle: { pt: 'Projetos em destaque', en: 'Featured projects', es: 'Proyectos destacados' },
  allProjects: { pt: 'Todos os projetos', en: 'All projects', es: 'Todos los proyectos' },
  code: { pt: 'Código', en: 'Code', es: 'Código' },
  demo: { pt: 'Ver online', en: 'Live', es: 'Ver en línea' },
  details: { pt: 'Detalhes', en: 'Details', es: 'Detalles' },
  journeyTitle: { pt: 'Minha jornada', en: 'My journey', es: 'Mi trayectoria' },
  galleryTitle: { pt: 'Galeria', en: 'Gallery', es: 'Galería' },
  newsTitle: { pt: 'Novidades', en: 'News', es: 'Novedades' },
  allNews: { pt: 'Ver tudo', en: 'See all', es: 'Ver todo' },
  contactTitle: { pt: 'Vamos conversar?', en: "Let's talk?", es: '¿Hablamos?' },
  contactText: {
    pt: 'Tem um projeto, uma vaga ou um conjunto de dados em mente? Minha caixa de entrada está aberta.',
    en: 'Have a project, a role or a dataset in mind? My inbox is open.',
    es: '¿Tienes un proyecto, una vacante o un conjunto de datos en mente? Mi bandeja de entrada está abierta.',
  },
  formName: { pt: 'Nome', en: 'Name', es: 'Nombre' },
  formEmail: { pt: 'E-mail', en: 'Email', es: 'Correo' },
  formMessage: { pt: 'Mensagem', en: 'Message', es: 'Mensaje' },
  formSend: { pt: 'Enviar mensagem', en: 'Send message', es: 'Enviar mensaje' },
  formHint: { pt: 'Todos os campos são obrigatórios.', en: 'All fields are required.', es: 'Todos los campos son obligatorios.' },
  writeMe: { pt: 'Escrever mensagem', en: 'Write a message', es: 'Escribir mensaje' },
  madHi: { pt: 'Oi, Bruno! Meu nome é', en: 'Hi Bruno! My name is', es: '¡Hola, Bruno! Me llamo' },
  madMid: { pt: 'e você pode me responder em', en: 'and you can reach me at', es: 'y puedes responderme en' },
  madEnd: { pt: 'Eu queria conversar sobre', en: "I'd like to talk about", es: 'Me gustaría hablar sobre' },
  phName: { pt: 'seu nome', en: 'your name', es: 'tu nombre' },
  phEmail: { pt: 'seu@email.com', en: 'you@email.com', es: 'tu@correo.com' },
  phMessage: { pt: 'um projeto, uma vaga, uma ideia…', en: 'a project, a role, an idea…', es: 'un proyecto, una vacante, una idea…' },
  orReach: { pt: 'Ou me encontre em', en: 'Or find me on', es: 'O encuéntrame en' },
  kineticTop: { pt: 'Ciência de Dados', en: 'Data Science', es: 'Ciencia de Datos' },
  formSending: { pt: 'Enviando…', en: 'Sending…', es: 'Enviando…' },
  formOk: {
    pt: 'Mensagem enviada. Obrigado! Respondo em breve.',
    en: 'Message sent. Thank you! I will reply soon.',
    es: 'Mensaje enviado. ¡Gracias! Te respondo pronto.',
  },
  formFail: {
    pt: 'Não foi possível enviar agora. Tente o e-mail acima.',
    en: "Couldn't send right now. Try the email above.",
    es: 'No se pudo enviar ahora. Prueba con el correo de arriba.',
  },
  formLimit: {
    pt: 'Muitas mensagens em pouco tempo. Tente de novo mais tarde ou use o e-mail acima.',
    en: 'Too many messages in a short time. Try again later or use the email above.',
    es: 'Demasiados mensajes en poco tiempo. Inténtalo más tarde o usa el correo de arriba.',
  },
  formInvalid: {
    pt: 'Confira os campos: nome, e-mail válido e uma mensagem de pelo menos 10 caracteres.',
    en: 'Check the fields: name, a valid email and a message of at least 10 characters.',
    es: 'Revisa los campos: nombre, un correo válido y un mensaje de al menos 10 caracteres.',
  },
  rights: {
    pt: 'Feito com Next.js, Supabase e three.js.',
    en: 'Built with Next.js, Supabase and three.js.',
    es: 'Hecho con Next.js, Supabase y three.js.',
  },
  theme: { pt: 'Alternar tema', en: 'Toggle theme', es: 'Cambiar tema' },
  menu: { pt: 'Menu', en: 'Menu', es: 'Menú' },
} satisfies Record<string, unknown>;

export const nav = [
  { key: 'inicio', href: '/#inicio' },
  { key: 'sobre', href: '/#sobre' },
  { key: 'projetos', href: '/#projetos' },
  { key: 'experiencia', href: '/#jornada' },
  { key: 'novidades', href: '/#novidades' },
  { key: 'contato', href: '/#contato' },
] as const;
