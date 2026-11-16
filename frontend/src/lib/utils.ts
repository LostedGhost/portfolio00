/** Concatène des classes conditionnelles (équivalent minimal de clsx). */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
