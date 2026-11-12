/**
 * Data locales du portfolio — remplace le backend Django quand
 * VITE_API_BASE_URL n'est pas defini dans .env.local (voir ../api/client.ts).
 *
 * Mettre a jour le contenu = editer ce fichier.
 * Remplacer une image = changer le fichier dans ./images/ (meme nom).
 */
/** Le hero 3D n'a plus besoin de fond image (scène 3D douce à la place). */

/** Les 6 chapitres du récit (scénario dans portfolio-assets/scenario.md). */
export interface Chapter {
  index: string;       // « 01 », « 02 »…
  id: string;          // ancre
  title: string;       // titre court du chapitre
  manifesto: string;   // phrase révélée mot à mot au scroll
}

export const chapters: Chapter[] = [
  { index: '01', id: 'hero', title: 'Le dé', manifesto: 'Chaque projet commence par une question simple.' },
  { index: '02', id: 'about', title: 'Le chemin', manifesto: "J'apprends à construire, puis à construire mieux." },
  { index: '03', id: 'experience', title: 'La pratique', manifesto: "Le code qui compte est celui qu'on livre." },
  { index: '04', id: 'technologies', title: 'Les instruments', manifesto: "Peu d'outils, maîtrisés." },
  { index: '05', id: 'projects', title: 'Les preuves', manifesto: 'Des interfaces que des gens réels utilisent chaque jour.' },
  { index: '06', id: 'contact', title: 'La continuité', manifesto: "La meilleure histoire est celle qu'on écrit ensemble." },
];

export const hero = {
  /** Fil conducteur mono affiché sous le nom (HUD façon Midnight). */
  ticker: 'UNE PIÈCE, UNE HISTOIRE — CONSTRUITE AVEC SOIN',
  /** Manifeste du chapitre 01, révélé mot à mot dès l'ouverture. */
  manifesto: 'Chaque projet commence par une question simple.',
};

import heroImage from './images/hero.png';
import logo from './images/logo.png';
import photo from './images/photo.png';
import project1 from './images/project-1.png';
import project2 from './images/project-2.png';
import project3 from './images/project-3.png';
import project4 from './images/project-4.png';
import project5 from './images/project-5.png';
import project6 from './images/project-6.png';
import testimonial1 from './images/testimonial-1.png';
import testimonial2 from './images/testimonial-2.png';
import testimonial3 from './images/testimonial-3.png';
import logoDjango from './images/tech-django.png';
import logoDocker from './images/tech-docker.png';
import logoFigma from './images/tech-figma.png';
import logoGit from './images/tech-git.png';
import logoMongo from './images/tech-mongodb.png';
import logoNode from './images/tech-nodejs.png';
import logoPostgres from './images/tech-postgresql.png';
import logoPython from './images/tech-python.png';
import logoReact from './images/tech-react.png';
import logoSpring from './images/tech-spring-boot.png';
import logoTailwind from './images/tech-tailwind.png';
import logoTensorflow from './images/tech-tensorflow.png';
import type {
  Certification,
  ContactInfo,
  Education,
  Experience,
  Profile,
  Project,
  Skill,
  SocialLink,
  Statistic,
  Technology,
  Testimonial,
} from '../lib/types';

export const profile: Profile = {
  full_name: 'Ludel S. G. TOPANOU',
  site_name: 'Ludel S. G. TOPANOU',
  title: 'Développeur web full-stack & Data analyst',
  email: 'contact@graciotopanou.online',
  phone: '+229 01 00 00 00 00',
  photo,
  logo,
  hero_image: heroImage,
  hero_background_image: null,
  hero_background_opacity: 0,
  cv: null,
  description: `Développeur full-stack basé à Cotonou, je conçois des applications web de bout en bout : API Django et Spring Boot côté serveur, React côté client, PostgreSQL et MongoDB pour les données.

Je m'intéresse aussi à la data : analyse, tableaux de bord et intégration d'IA dans des produits concrets.`,
  available: true,
};

export const skills: Skill[] = [
  { id: 1, name: 'Python / Django', value: 90 },
  { id: 2, name: 'React / TypeScript', value: 80 },
  { id: 3, name: 'Spring Boot', value: 70 },
  { id: 4, name: 'PostgreSQL', value: 85 },
  { id: 5, name: 'Analyse de données', value: 75 },
  { id: 6, name: 'DevOps / CI-CD', value: 60 },
];

export const technologies: Technology[] = [
  { id: 1, name: 'React', logo: logoReact },
  { id: 2, name: 'Django', logo: logoDjango },
  { id: 3, name: 'Python', logo: logoPython },
  { id: 4, name: 'PostgreSQL', logo: logoPostgres },
  { id: 5, name: 'MongoDB', logo: logoMongo },
  { id: 6, name: 'Spring Boot', logo: logoSpring },
  { id: 7, name: 'Node.js', logo: logoNode },
  { id: 8, name: 'TensorFlow', logo: logoTensorflow },
  { id: 9, name: 'Tailwind', logo: logoTailwind },
  { id: 10, name: 'Figma', logo: logoFigma },
  { id: 11, name: 'Git', logo: logoGit },
  { id: 12, name: 'Docker', logo: logoDocker },
];

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'Studio Kanlisa',
    type: 'Freelance',
    start_date: '2024-01-15',
    end_date: null,
    description: 'Conception et développement d applications web pour des PME locales : sites vitrines, API REST et tableaux de bord de suivi.',
  },
  {
    id: 2,
    company: 'Faso Digital',
    type: 'Stage professionnel',
    start_date: '2023-06-01',
    end_date: '2023-11-30',
    description: 'Développement backend Django pour une plateforme de gestion scolaire : modélisation de données, API REST et optimisation des requêtes.',
  },
  {
    id: 3,
    company: 'Ecole Supérieure de Cotonou',
    type: 'Bénévolat',
    start_date: '2022-10-01',
    end_date: '2023-05-31',
    description: 'Animation d ateliers d initiation à la programmation Python pour des étudiants.',
  },
];

export const statistics: Statistic[] = [
  { id: 1, label: 'Projets réalisés', value: 12, suffix: '+' },
  { id: 2, label: 'Années d expérience', value: 3, suffix: '+' },
  { id: 3, label: 'Clients accompagnés', value: 8, suffix: '' },
  { id: 4, label: 'Technologies maîtrisées', value: 10, suffix: '+' },
];

export const projects: Project[] = [
  {
    id: 1,
    title: 'Kanlisa — Gestion scolaire',
    category: 'Application web',
    date: '2025-03-10',
    image: project1,
    link: '',
    description: 'Plateforme de gestion d établissement scolaire : inscriptions, notes, emplois du temps et suivi des élèves en temps réel.',
    role: 'Développeur full-stack solo',
    results: 'Adoptée par 3 établissements, réduction de 70% du temps de saisie des bulletins.',
    technologies: [technologies[1], technologies[3], technologies[0]],
  },
  {
    id: 2,
    title: 'AgriData Dashboard',
    category: 'Data / IA',
    date: '2025-06-02',
    image: project2,
    link: '',
    description: 'Tableau de bord analytique pour une coopérative agricole : prévisions de rendement et visualisation des ventes par région.',
    role: 'Data analyst & backend',
    results: 'Pipeline de données automatisé couvrant 5 régions.',
    technologies: [technologies[2], technologies[7], technologies[3]],
  },
  {
    id: 3,
    title: 'LuluFiles',
    category: 'API / Cloud',
    date: '2024-11-20',
    image: project3,
    link: '',
    description: 'Service d hébergement de fichiers avec API publique, authentification par clé et proxy de lecture sécurisé.',
    role: 'Développeur backend',
    results: 'API utilisée par plusieurs sites en production.',
    technologies: [technologies[2], technologies[1], technologies[10]],
  },
  {
    id: 4,
    title: 'Shop Cotonou',
    category: 'E-commerce',
    date: '2024-07-15',
    image: project4,
    link: '',
    description: 'Boutique en ligne pour un commerçant local : catalogue, panier et notifications de commande par email.',
    role: 'Développeur full-stack solo',
    results: 'Premiers clients en ligne dès le premier mois.',
    technologies: [technologies[0], technologies[8], technologies[6]],
  },
  {
    id: 5,
    title: 'Kanlisa Mobile',
    category: 'Application web',
    date: '2025-01-28',
    image: project5,
    link: '',
    description: 'Front office mobile-first pour parents et élèves : notes, absences et communications de l école.',
    role: 'Développeur frontend',
    results: 'Support de 900 familles connectées.',
    technologies: [technologies[0], technologies[8], technologies[1]],
  },
  {
    id: 6,
    title: 'Temo Sante',
    category: 'Application web',
    date: '2024-04-05',
    image: project6,
    link: '',
    description: 'Outil de prise de rendez-vous pour un cabinet médical, avec rappels automatiques et planning médecin.',
    role: 'Développeur full-stack',
    results: '40% de rendez-vous respectés en plus.',
    technologies: [technologies[5], technologies[4], technologies[1]],
  },
];

export const contactInfo: ContactInfo = {
  address: 'Cotonou, Bénin',
  phone: '+229 01 00 00 00 00',
  email: 'contact@graciotopanou.online',
  form_active: true,
};

export const socialLinks: SocialLink[] = [
  { id: 1, platform: 'GitHub', url: 'https://github.com/LostedGhost' },
  { id: 2, platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ludel-topanou' },
  { id: 3, platform: 'X / Twitter', url: 'https://x.com/ludel_topanou' },
];

export const education: Education[] = [
  {
    id: 1,
    institution: 'Institut Supérieur de Cotonou',
    degree: 'Licence Génie Logiciel',
    start_date: '2021-10-01',
    end_date: '2024-07-31',
    description: 'Bases du développement logiciel, réseaux, bases de données et algorithmique.',
  },
];

export const certifications: Certification[] = [
  {
    id: 1,
    name: 'Data Analytics Foundations',
    issuer: 'Google / Coursera',
    date_obtained: '2024-02-10',
    credential_url: '',
  },
  {
    id: 2,
    name: 'Backend Development with Django',
    issuer: 'Meta / Coursera',
    date_obtained: '2023-09-18',
    credential_url: '',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    author_name: 'Awa DOSSOU',
    author_role: 'Directrice, Ecole Les Palmiers',
    content: 'Ludel a livré notre plateforme de gestion scolaire dans les délais. Interface claire, support réactif : nos équipes l ont adoptée en une semaine.',
    photo: testimonial1,
  },
  {
    id: 2,
    author_name: 'Marcin K.',
    author_role: 'CTO, AgriTech Bénin',
    content: 'Un développeur rigoureux qui pose les bonnes questions métier avant de coder. Notre dashboard de ventes fonctionne parfaitement depuis le lancement.',
    photo: testimonial2,
  },
  {
    id: 3,
    author_name: 'Sylvain AGBO',
    author_role: 'Gérant, Boutique Artisanale',
    content: 'Grâce à la boutique en ligne développée par Ludel, nous vendons désormais hors de notre boutique physique. Excellent accompagnement.',
    photo: testimonial3,
  },
];

/**
 * Routeur simple : renvoie la donnee locale correspondant au chemin d'API.
 * Les chemis refletent les endpoints Django (voir backend/portfolio/urls.py).
 */
export function byPath<T>(path: string): T | undefined {
  switch (path) {
    case '/api/profile/':
      return profile as T;
    case '/api/skills/':
      return skills as T;
    case '/api/technologies/':
      return technologies as T;
    case '/api/experiences/':
      return experiences as T;
    case '/api/statistics/':
      return statistics as T;
    case '/api/projects/':
      return projects as T;
    case '/api/contact-info/':
      return contactInfo as T;
    case '/api/social-links/':
      return socialLinks as T;
    case '/api/education/':
      return education as T;
    case '/api/certifications/':
      return certifications as T;
    case '/api/testimonials/':
      return testimonials as T;
    default:
      return undefined;
  }
}
