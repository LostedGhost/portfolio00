/**
 * ============================================================================
 *  MES INFORMATIONS — seul fichier à modifier pour mettre le portfolio à jour
 * ============================================================================
 *
 * Ce fichier est chargé tel quel par le navigateur au démarrage du site
 * (il n'est pas compilé). Après modification : commit + push, Vercel redéploie.
 *
 * IMAGES
 *   Déposez vos fichiers dans `frontend/public/images/` puis indiquez leur chemin
 *   en commençant par « /images/… » (ex. '/images/photo.webp').
 *   Une adresse complète (https://…) fonctionne aussi.
 *   Laissé vide ('') : une illustration ou vos initiales s'affichent à la place.
 *
 * MOTS MIS EN VALEUR
 *   Dans `about.intro`, entourez des mots d'astérisques pour les surligner :
 *   'Je suis *développeur fullstack* au Bénin.'
 *
 * ICÔNES DISPONIBLES (champ `icon`)
 *   code, db, api, chart, spark, palette, mail, send, ext, cap, brief, check,
 *   face, arrow, gh (GitHub)
 *
 * ILLUSTRATIONS DE PROJET (champ `visual`)
 *   bars (barres de progression), grades (notes), terminal, files (fichiers),
 *   face (scan de visage)
 *
 * COULEURS DE CARTE (champ `tone`)
 *   mint, pale, deep (fond sombre), emerald, paper
 */
window.PORTFOLIO = {
  site: {
    firstName: 'Ludel',
    lastName: 'Topanou',
    nickname: 'Lucio',
    initials: 'LT',
    role: 'Développeur fullstack, data analyst et designer',
    country: 'Bénin',
    email: 'contact@graciotopanou.online',
    logo: '', // ex. '/images/logo.webp'
    photo: '', // ex. '/images/photo.webp' (portrait 4:5 conseillé)
    year: 2026,
    // Liens affichés dans le contact et le pied de page
    links: [
      { label: 'GitHub', href: 'https://github.com/LostedGhost', icon: 'gh' },
    ],
  },

  about: {
    title: 'Qui je suis',
    intro:
      'Je m’appelle Ludel, on m’appelle Lucio. Je suis *développeur fullstack* au Bénin. Je conçois des *API REST solides,* des *interfaces claires,* et je m’intéresse à l’IA, à l’automatisation et à la clean architecture. J’aime coder, apprendre et partager.',
    facts: [
      { icon: 'brief', title: 'Stage chez SolDigit', text: 'En stage professionnel depuis janvier 2026.' },
      { icon: 'cap', title: 'Enseignement', text: 'Je donne des cours sur le cycle de vie des projets IT et le backend d’API REST, pour des étudiants qui débutent.' },
      { icon: 'check', title: 'Formation', text: 'Licence en génie logiciel, obtenue en 2023.' },
    ],
    skills: [
      { icon: 'code', title: 'Frontend', text: 'React, Next.js, interfaces animées.' },
      { icon: 'api', title: 'Backend', text: 'Django, FastAPI, API REST.' },
      { icon: 'db', title: 'Bases de données', text: 'PostgreSQL, modélisation.' },
      { icon: 'chart', title: 'Data', text: 'Analyse et tableaux de bord.' },
      { icon: 'spark', title: 'IA et prompts', text: 'Prompt engineering, automatisation.' },
      { icon: 'palette', title: 'Design', text: 'Maquettes, identités, interfaces.' },
    ],
  },

  // Bandeau d'outils qui défile
  tools: ['React', 'Next.js', 'TypeScript', 'Django', 'FastAPI', 'PostgreSQL', 'Python', 'Tailwind', 'GSAP', 'Docker', 'Git', 'Figma'],

  projectsTitle: 'Ce que j’ai construit',
  /**
   * link.href : lien externe (code source, site en ligne…)
   * link.ask  : sans href, le bouton ouvre le formulaire de contact prérempli
   *             (« Bonjour, je souhaite en savoir plus sur <ask>. »)
   * images    : captures facultatives → un carrousel apparaît sur la carte
   */
  projects: [
    {
      id: 'suivicm',
      title: 'SuiviCM',
      icon: 'check',
      visual: 'bars',
      tone: 'mint',
      text: 'Une application pour suivre les décisions du Conseil des Ministres, utilisée au Secrétariat général du gouvernement. Je pilote la recette.',
      link: { label: 'Demander une démo', icon: 'mail', ask: 'SuiviCM' },
      images: [],
    },
    {
      id: 'piaget',
      title: 'Gestion scolaire Jean Piaget',
      icon: 'cap',
      visual: 'grades',
      tone: 'pale',
      text: 'Une application complète pour l’école : élèves, notes, bulletins. Construite avec ma méthode spec-first, de la spécification au déploiement.',
      link: { label: 'Demander une démo', icon: 'mail', ask: 'la gestion scolaire Jean Piaget' },
      images: [],
    },
    {
      id: 'lulucode',
      title: 'LuluCode',
      icon: 'code',
      visual: 'terminal',
      tone: 'deep',
      text: 'Un agent de code open source, utilisable dans le terminal et sur le web. Il s’appuie sur des outils comme DocScan pour lire et comprendre les documents.',
      link: { label: 'Code source', icon: 'gh', href: 'https://github.com/LostedGhost' },
      images: [],
    },
    {
      id: 'lulufiles',
      title: 'LuluFiles',
      icon: 'send',
      visual: 'files',
      tone: 'emerald',
      text: 'Une plateforme de stockage de fichiers qui s’appuie sur un canal Telegram, et que d’autres applications utilisent par API.',
      link: { label: 'Demander l’accès à l’API', icon: 'mail', ask: 'LuluFiles' },
      images: [],
    },
    {
      id: 'pointage',
      title: 'Pointage par reconnaissance faciale',
      icon: 'face',
      visual: 'face',
      tone: 'paper',
      text: 'Un système de présence qui reconnaît les visages et enregistre les arrivées automatiquement, avec des tâches planifiées côté serveur.',
      tags: ['FastAPI', 'PostgreSQL', 'APScheduler'],
      link: { label: 'Demander une démo', icon: 'mail', ask: 'le système de pointage facial' },
      images: [],
    },
  ],

  method: {
    title: 'Je ne code rien avant que le besoin soit clair',
    lead: 'Chaque étape produit quelque chose qu’on peut vérifier. L’IA m’aide à aller vite, mais les règles métier et l’architecture, je les décide avec le client.',
    steps: [
      { title: 'Cas d’utilisation validés', text: 'On écrit ce que les utilisateurs doivent pouvoir faire, et on le fait approuver.' },
      { title: 'Diagrammes UML', text: 'Le modèle de données et les parcours sont dessinés avant le premier fichier de code.' },
      { title: 'Contrat d’API', text: 'Le front et le back se mettent d’accord sur les échanges, noir sur blanc.' },
      { title: 'Backend, endpoint par endpoint', text: 'Chaque route arrive avec ses tests et sa documentation.' },
      { title: 'Validation complète du backend', text: 'Le serveur est vérifié en entier avant que l’interface ne commence.' },
      { title: 'Frontend avec des mocks', text: 'L’interface avance sans attendre, sur des données simulées conformes au contrat.' },
      { title: 'Intégration et déploiement', text: 'On branche le vrai backend, on teste de bout en bout, puis on met en ligne.' },
    ],
  },

  contact: {
    title: 'Un projet à construire ?',
    text: 'Parlez-moi de votre besoin, d’une mission ou d’une collaboration. Je réponds personnellement.',
    subjects: ['Mission freelance', 'Projet web ou mobile', 'Collaboration', 'Enseignement', 'Autre'],
  },
}
