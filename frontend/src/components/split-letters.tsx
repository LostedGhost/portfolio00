/**
 * Découpe un texte en lettres animables.
 * `mask` : chaque lettre est dans un masque (entrée par le bas) ; sinon lettres libres (explosion).
 */
export function SplitLetters({ text, attr = 'data-letter', mask = true, letterClass = '' }: { text: string; attr?: string; mask?: boolean; letterClass?: string }) {
  return (
    <>
      {[...text].map((c, i) => {
        if (c === ' ') return <span key={i} className="inline-block w-[0.28em]" />
        const letter = <span {...{ [attr]: '' }} className={`inline-block will-change-transform ${letterClass}`}>{c}</span>
        return mask
          ? <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">{letter}</span>
          : <span key={i} className="inline-block">{letter}</span>
      })}
    </>
  )
}
