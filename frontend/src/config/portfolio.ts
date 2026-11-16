/**
 * Contenu du portfolio.
 * C'est le SEUL fichier à modifier pour mettre le site à jour (textes, projets, liens, images).
 *
 * Images : déposez les fichiers dans `public/images/` puis renseignez leur chemin
 * (ex. `photo: '/images/photo.webp'`). Laissés vides, des emplacements illustrés sont affichés.
 */
import type { IconName } from '@/components/icon'

export type Fact = { icon: IconName; title: string; text: string }
export type Skill = { icon: IconName; title: string; text: string }
/** `kind` choisit l'illustration animée de la carte (voir components/project-visual.tsx). */
export type ProjectVisual = 'bars' | 'grades' | 'terminal' | 'files' | 'face'
export type ProjectLink = { label: string; href: string; icon: IconName; external?: boolean }
export type Project = {
  id: string
  title: string
  icon: IconName
  text: string
  tags?: string[]
  visual: ProjectVisual
  /** Thème de la carte : clair, menthe, profond, émeraude, papier. */
  tone: 'mint' | 'pale' | 'deep' | 'emerald' | 'paper'
  /** Sans `href`, le lien ouvre le formulaire prérempli avec `ask`. */
  link: { label: string; icon: IconName; href?: string; ask?: string }
  /** Captures d'écran facultatives (chemins dans /public) : un carrousel apparaît. */
  images?: string[]
}
export type Step = { title: string; text: string }

export const site = {
  firstName: 'Ludel',
  lastName: 'Topanou',
  nickname: 'Lucio',
  initials: 'LT',
  role: 'Développeur fullstack, data analyst et designer',
  country: 'Bénin',
  email: 'contact@graciotopanou.online',
  github: 'https://github.com/LostedGhost',
  /** Chemins dans /public, ex. '/images/logo.webp'. Vide = initiales. */
  logo: '',
  /** Portrait (ratio 4:5 conseillé). Vide = illustration. */
  photo: '',
  year: 2026,
}

export const about = {
  title: 'Qui je suis',
  intro:
    'Je m’appelle Ludel, on m’appelle Lucio. Je suis développeur fullstack au Bénin. Je conçois des API REST solides, des interfaces claires, et je m’intéresse à l’IA, à l’automatisation et à la clean architecture. J’aime coder, apprendre et partager.',
  /** Indices des mots mis en valeur dans l'intro (révélée au défilement). */
  emphasis: [8, 9, 15, 16, 19, 20],
  facts: [
    { icon: 'brief', title: 'Stage chez SolDigit', text: 'En stage professionnel depuis janvier 2026.' },
    { icon: 'cap', title: 'Enseignement', text: 'Je donne des cours sur le cycle de vie des projets IT et le backend d’API REST, pour des étudiants qui débutent.' },
    { icon: 'check', title: 'Formation', text: 'Licence en génie logiciel, obtenue en 2023.' },
  ] satisfies Fact[],
  skills: [
    { icon: 'code', title: 'Frontend', text: 'React, Next.js, interfaces animées.' },
    { icon: 'api', title: 'Backend', text: 'Django, FastAPI, API REST.' },
    { icon: 'db', title: 'Bases de données', text: 'PostgreSQL, modélisation.' },
    { icon: 'chart', title: 'Data', text: 'Analyse et tableaux de bord.' },
    { icon: 'spark', title: 'IA et prompts', text: 'Prompt engineering, automatisation.' },
    { icon: 'palette', title: 'Design', text: 'Maquettes, identités, interfaces.' },
  ] satisfies Skill[],
}

/** Outils qui défilent en bandeau entre deux chapitres. */
export const tools = ['React', 'Next.js', 'TypeScript', 'Django', 'FastAPI', 'PostgreSQL', 'Python', 'Tailwind', 'GSAP', 'Docker', 'Git', 'Figma']

export const projectsTitle = 'Ce que j’ai construit'
export const projects: Project[] = [
  {
    id: 'suivicm', title: 'SuiviCM', icon: 'check', visual: 'bars', tone: 'mint',
    text: 'Une application pour suivre les décisions du Conseil des Ministres, utilisée au Secrétariat général du gouvernement. Je pilote la recette.',
    link: { label: 'Demander une démo', icon: 'mail', ask: 'SuiviCM' },
  },
  {
    id: 'piaget', title: 'Gestion scolaire Jean Piaget', icon: 'cap', visual: 'grades', tone: 'pale',
    text: 'Une application complète pour l’école : élèves, notes, bulletins. Construite avec ma méthode spec-first, de la spécification au déploiement.',
    link: { label: 'Demander une démo', icon: 'mail', ask: 'la gestion scolaire Jean Piaget' },
  },
  {
    id: 'lulucode', title: 'LuluCode', icon: 'code', visual: 'terminal', tone: 'deep',
    text: 'Un agent de code open source, utilisable dans le terminal et sur le web. Il s’appuie sur des outils comme DocScan pour lire et comprendre les documents.',
    link: { label: 'Code source', icon: 'gh', href: 'https://github.com/LostedGhost' },
  },
  {
    id: 'lulufiles', title: 'LuluFiles', icon: 'send', visual: 'files', tone: 'emerald',
    text: 'Une plateforme de stockage de fichiers qui s’appuie sur un canal Telegram, et que d’autres applications utilisent par API.',
    link: { label: 'Demander l’accès à l’API', icon: 'mail', ask: 'LuluFiles' },
  },
  {
    id: 'pointage', title: 'Pointage par reconnaissance faciale', icon: 'face', visual: 'face', tone: 'paper',
    text: 'Un système de présence qui reconnaît les visages et enregistre les arrivées automatiquement, avec des tâches planifiées côté serveur.',
    tags: ['FastAPI', 'PostgreSQL', 'APScheduler'],
    link: { label: 'Demander une démo', icon: 'mail', ask: 'le système de pointage facial' },
  },
]

export const method = {
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
  ] satisfies Step[],
}

export const contact = {
  title: 'Un projet à construire ?',
  text: 'Parlez-moi de votre besoin, d’une mission ou d’une collaboration. Je réponds personnellement.',
  subjects: ['Mission freelance', 'Projet web ou mobile', 'Collaboration', 'Enseignement', 'Autre'],
}
