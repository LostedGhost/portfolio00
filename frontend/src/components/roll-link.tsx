import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { onAnchorClick } from '@/lib/motion'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { label: string }

/** Lien dont les lettres « roulent » au survol. Les ancres internes passent par Lenis. */
export function RollLink({ label, className, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => { onClick?.(e); onAnchorClick(e) }}
      className={cn('roll-host inline-block', className)}
    >
      <span className="roll" aria-hidden="true">
        {[...label].map((ch, i) => (
          <span key={i} className="roll-ch" style={{ ['--i' as string]: i }}>
            <span>{ch}</span>
            <span>{ch}</span>
          </span>
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </a>
  )
}
