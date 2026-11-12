/**
 * Couche d'accès aux donnees.
 *
 * Mode LOCAL (par defaut)  : pas de VITE_API_BASE_URL dans .env.local ->
 *   reponses servies par ../mock/data.ts, aucune requete reseau.
 * Mode BACKEND (plus tard) : creez frontend/.env.local avec
 *   VITE_API_BASE_URL=http://localhost:8000 (ou l'URL du backend deploie)
 *   et relancez le serveur de developpement.
 */
import type {
  Certification,
  ContactInfo,
  Education,
  Experience,
  NewMessage,
  Profile,
  Project,
  Skill,
  SocialLink,
  Statistic,
  Technology,
  Testimonial,
} from '../lib/types';
import * as mock from '../mock/data';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export const API_MODE: 'local' | 'backend' = API_BASE_URL ? 'backend' : 'local';
export const isLocal = API_MODE === 'local';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  if (isLocal) {
    const data = mock.byPath<T>(path);
    if (data === undefined) throw new ApiError(404, `GET ${path} : donnee locale manquante`);
    return structuredClone(data);
  }
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new ApiError(res.status, `GET ${path} failed`);
  // Les URLs de medias servies par le backend sont relatives (/media/<id>/) :
  // on les prefixe avec l'origine de l'API.
  const data = (await res.json()) as T;
  return withMediaBase(data, API_BASE_URL);
}

function withMediaBase<T>(data: T, base: string): T {
  if (typeof data === 'string') {
    return (/^\/media\//.test(data) ? `${base}${data}` : data) as unknown as T;
  }
  if (Array.isArray(data)) return data.map((v) => withMediaBase(v, base)) as unknown as T;
  if (data && typeof data === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) out[k] = withMediaBase(v, base);
    return out as unknown as T;
  }
  return data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  if (isLocal) {
    // Mode local : le formulaire de contact est remplace par un mailto
    // (ContactForm.tsx) ; tout autre POST local est une erreur de setup.
    throw new ApiError(501, 'POST indisponible en mode local');
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new ApiError(res.status, detail?.detail || `POST ${path} failed`);
  }
  return res.json();
}

export type {
  Certification,
  ContactInfo,
  Education,
  Experience,
  NewMessage,
  Profile,
  Project,
  Skill,
  SocialLink,
  Statistic,
  Technology,
  Testimonial,
};
