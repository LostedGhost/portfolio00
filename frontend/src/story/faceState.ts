/**
 * Compteur partagé 3D → DOM (théâtre ch.01) : doit vivre dans le CHUNK
 * PRINCIPAL, pas dans le chunk lazy de Three.js (sinon le DOM attend un
 * module asynchrone pour afficher le nom — et le bundle se sépare).
 */
export const dieFacesState = { placed: 0 };

/** Progression de l'ouverture : 0 (rien) → 1 (dé prêt). */
export const openingState = { value: 0 };
