/**
 * Données du portfolio, lues au démarrage depuis `public/data/portfolio.js`
 * (fichier JS brut qui définit `window.PORTFOLIO`, chargé par index.html avant l'application).
 *
 * Ce module vérifie et normalise ces données, puis les expose avec des types stricts :
 * les sections importent `site`, `about`, `projects`… sans savoir d'où elles viennent.
 * Pour modifier le contenu, éditez public/data/portfolio.js — pas ce fichier.
 */
import { iconNames, type IconName } from '@/components/icon'

export type Fact = { icon: IconName; title: string; text: string }
export type Skill = { icon: IconName; title: string; text: string }
export type SiteLink = { label: string; href: string; icon: IconName }
/** Illustration animée d'une carte projet (voir components/project-visual.tsx). */
export type ProjectVisual = 'bars' | 'grades' | 'terminal' | 'files' | 'face'
export type ProjectTone = 'mint' | 'pale' | 'deep' | 'emerald' | 'paper'
export type Project = {
  id: string
  title: string
  icon: IconName
  text: string
  tags: string[]
  visual: ProjectVisual
  tone: ProjectTone
  /** Sans `href`, le bouton ouvre le formulaire prérempli avec `ask`. */
  link: { label: string; icon: IconName; href?: string; ask?: string }
  /** Captures facultatives : un carrousel apparaît. */
  images: string[]
}
export type Step = { title: string; text: string }

export type Portfolio = {
  site: {
    firstName: string
    lastName: string
    nickname: string
    initials: string
    role: string
    country: string
    email: string
    logo: string
    photo: string
    year: number
    links: SiteLink[]
  }
  about: { title: string; intro: string; facts: Fact[]; skills: Skill[] }
  tools: string[]
  projectsTitle: string
  projects: Project[]
  method: { title: string; lead: string; steps: Step[] }
  contact: { title: string; text: string; subjects: string[] }
}

/** Erreur explicite affichée à l'écran quand le fichier de données est absent ou invalide. */
export class PortfolioDataError extends Error {}

const VISUALS: ProjectVisual[] = ['bars', 'grades', 'terminal', 'files', 'face']
const TONES: ProjectTone[] = ['mint', 'pale', 'deep', 'emerald', 'paper']

type Raw = Record<string, unknown>
const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Lecture tolérante : chaîne attendue, sinon valeur par défaut (ou erreur si requise). */
function str(o: Raw, key: string, path: string, fallback?: string): string {
  const v = o[key]
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number') return String(v)
  if (fallback !== undefined) return fallback
  throw new PortfolioDataError(`Champ texte manquant : ${path}.${key}`)
}
function list(o: Raw, key: string, path: string, required = true): unknown[] {
  const v = o[key]
  if (Array.isArray(v)) return v
  if (!required && v === undefined) return []
  throw new PortfolioDataError(`Liste attendue : ${path}.${key}`)
}
function obj(o: Raw, key: string, path: string): Raw {
  const v = o[key]
  if (isObj(v)) return v
  throw new PortfolioDataError(`Objet attendu : ${path}.${key}`)
}
function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T, where: string): T {
  if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) return value as T
  if (value !== undefined) console.warn(`[portfolio] Valeur « ${String(value)} » inconnue pour ${where}, « ${fallback} » utilisé.`)
  return fallback
}
const icon = (v: unknown, where: string) => pick(v, iconNames, 'code', where)
const strings = (arr: unknown[]) => arr.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim())
const entry = (o: unknown, path: string): Raw => {
  if (!isObj(o)) throw new PortfolioDataError(`Objet attendu : ${path}`)
  return o
}

function parse(raw: unknown): Portfolio {
  if (!isObj(raw)) {
    throw new PortfolioDataError('window.PORTFOLIO est introuvable : vérifiez que public/data/portfolio.js existe et ne contient pas d’erreur de syntaxe.')
  }
  const s = obj(raw, 'site', 'PORTFOLIO')
  const firstName = str(s, 'firstName', 'site')
  const lastName = str(s, 'lastName', 'site')
  const site: Portfolio['site'] = {
    firstName,
    lastName,
    nickname: str(s, 'nickname', 'site', ''),
    initials: str(s, 'initials', 'site', `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()),
    role: str(s, 'role', 'site'),
    country: str(s, 'country', 'site', ''),
    email: str(s, 'email', 'site'),
    logo: str(s, 'logo', 'site', ''),
    photo: str(s, 'photo', 'site', ''),
    year: Number(s.year) || new Date().getFullYear(),
    links: list(s, 'links', 'site', false).map((l, i) => {
      const o = entry(l, `site.links[${i}]`)
      return { label: str(o, 'label', `site.links[${i}]`), href: str(o, 'href', `site.links[${i}]`), icon: icon(o.icon ?? 'ext', `site.links[${i}].icon`) }
    }),
  }

  const a = obj(raw, 'about', 'PORTFOLIO')
  const card = (path: string) => (x: unknown, i: number) => {
    const o = entry(x, `${path}[${i}]`)
    return { icon: icon(o.icon, `${path}[${i}].icon`), title: str(o, 'title', `${path}[${i}]`), text: str(o, 'text', `${path}[${i}]`, '') }
  }
  const about: Portfolio['about'] = {
    title: str(a, 'title', 'about'),
    intro: str(a, 'intro', 'about', ''),
    facts: list(a, 'facts', 'about', false).map(card('about.facts')),
    skills: list(a, 'skills', 'about', false).map(card('about.skills')),
  }

  const projects: Project[] = list(raw, 'projects', 'PORTFOLIO').map((x, i) => {
    const p = `projects[${i}]`
    const o = entry(x, p)
    const l = entry(o.link ?? {}, `${p}.link`)
    const href = str(l, 'href', `${p}.link`, '')
    const title = str(o, 'title', p)
    return {
      id: str(o, 'id', p, `projet-${i + 1}`),
      title,
      icon: icon(o.icon, `${p}.icon`),
      text: str(o, 'text', p, ''),
      tags: strings(list(o, 'tags', p, false)),
      visual: pick(o.visual, VISUALS, 'bars', `${p}.visual`),
      tone: pick(o.tone, TONES, TONES[i % TONES.length], `${p}.tone`),
      link: {
        label: str(l, 'label', `${p}.link`, 'Me contacter'),
        icon: icon(l.icon ?? 'mail', `${p}.link.icon`),
        href: href || undefined,
        ask: href ? undefined : str(l, 'ask', `${p}.link`, title),
      },
      images: strings(list(o, 'images', p, false)),
    }
  })

  const m = obj(raw, 'method', 'PORTFOLIO')
  const c = obj(raw, 'contact', 'PORTFOLIO')
  const subjects = strings(list(c, 'subjects', 'contact', false))

  return {
    site,
    about,
    tools: strings(list(raw, 'tools', 'PORTFOLIO', false)),
    projectsTitle: str(raw, 'projectsTitle', 'PORTFOLIO', 'Projets'),
    projects,
    method: {
      title: str(m, 'title', 'method'),
      lead: str(m, 'lead', 'method', ''),
      steps: list(m, 'steps', 'method', false).map((x, i) => {
        const o = entry(x, `method.steps[${i}]`)
        return { title: str(o, 'title', `method.steps[${i}]`), text: str(o, 'text', `method.steps[${i}]`, '') }
      }),
    },
    contact: {
      title: str(c, 'title', 'contact'),
      text: str(c, 'text', 'contact', ''),
      subjects: subjects.length ? subjects : ['Autre'],
    },
  }
}

declare global {
  interface Window { PORTFOLIO?: unknown }
}

/** Lu une seule fois au chargement du module (le script de données est déjà exécuté). */
const data = parse(window.PORTFOLIO)

export const { site, about, tools, projectsTitle, projects, method, contact } = data
