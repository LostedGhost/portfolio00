/**
 * Illustrations du récit — SVG faits main (licence 100 % à nous, bible §5).
 * Style : rendu doux façon illustration 3D (clay), palette de la bible :
 * surfaces émaillées claires sur fond sombre, halo néon menthe discret.
 * Chaque illustration porte un sens narratif lié à son chapitre.
 */
interface IllustrationProps {
  className?: string;
}

const CLAY = '#dff3e6';
const CLAY_DIM = '#8fb39d';
const MINT = '#57ff9a';
const SHADOW = 'rgba(6,10,8,0.35)';

/** Ch.01 — Le dé : cube aux arêtes adoucies, une face lumineuse. */
export function DieIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Un dé aux arêtes douces, une face lumineuse">
      <defs>
        <linearGradient id="die-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={CLAY} />
          <stop offset="1" stopColor="#c2ddca" />
        </linearGradient>
        <radialGradient id="die-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={MINT} stopOpacity="0.5" />
          <stop offset="1" stopColor={MINT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="170" rx="62" ry="12" fill={SHADOW} />
      <circle cx="100" cy="100" r="72" fill="url(#die-glow)" opacity="0.5" />
      {/* Face avant */}
      <path d="M50 55 L100 40 L100 105 L50 118 Z" fill="url(#die-face)" />
      {/* Face dessus */}
      <path d="M50 55 L100 40 L150 52 L102 68 Z" fill="#eef7f1" />
      {/* Face droite (lumineuse) */}
      <path d="M100 40 L150 52 L150 116 L100 105 Z" fill={MINT} opacity="0.92" />
      {/* Pips */}
      <circle cx="68" cy="80" r="6" fill="#0c150f" opacity="0.25" />
      <circle cx="84" cy="95" r="6" fill="#0c150f" opacity="0.25" />
      <circle cx="72" cy="60" r="6" fill="#0c150f" opacity="0.15" />
      <circle cx="92" cy="50" r="6" fill="#0c150f" opacity="0.15" />
    </svg>
  );
}

/** Ch.02 — Le chemin : trajectoire ondulée entre deux sphères (départ → maîtrise). */
export function PathIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 160" className={className} role="img" aria-label="Un chemin ponctué de jalons jusqu'à une sphère pleine">
      <defs>
        <radialGradient id="sph" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor={CLAY} />
          <stop offset="1" stopColor="#b9d3c2" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="80" rx="70" ry="45" fill={SHADOW} />
      <path
        d="M20 120 C 60 90 70 130 105 95 S 150 60 118 92"
        fill="none"
        stroke={CLAY_DIM}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 8"
        data-draw
      />
      {/* Jalons */}
      <circle cx="20" cy="120" r="7" fill="none" stroke={CLAY_DIM} strokeWidth="3" data-draw />
      <circle cx="72" cy="112" r="7" fill="none" stroke={CLAY_DIM} strokeWidth="3" data-draw />
      <circle cx="105" cy="95" r="7" fill="none" stroke={CLAY_DIM} strokeWidth="3" />
      {/* Sphère maîtresse céramique */}
      <circle cx="152" cy="78" r="34" fill="url(#sph)" />
      <circle cx="152" cy="78" r="34" fill={MINT} opacity="0.12" />
      <ellipse cx="148" cy="118" rx="26" ry="6" fill={SHADOW} />
    </svg>
  );
}

/** Ch.03 — La pratique : blocs empilés (les lignes de code livrées). */
export function BlocksIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 180" className={className} role="img" aria-label="Trois blocs céramiques empilés, le sommet lumineux">
      <defs>
        <linearGradient id="blk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CLAY} />
          <stop offset="1" stopColor="#bcd6c5" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="162" rx="68" ry="10" fill={SHADOW} />
      <g>
        <rect x="55" y="118" width="90" height="40" rx="10" fill="#c6dfd0" />
        <rect x="65" y="74" width="70" height="40" rx="10" fill="url(#blk)" />
        <rect x="78" y="30" width="44" height="40" rx="10" fill={MINT} opacity="0.9" />
        {/* boutons façon touche */}
        <circle cx="70" cy="138" r="4" fill="#0c150f" opacity="0.2" />
        <circle cx="80" cy="94" r="4" fill="#0c150f" opacity="0.2" />
        <circle cx="90" cy="50" r="4" fill="#0c150f" opacity="0.28" />
      </g>
    </svg>
  );
}

/** Ch.04 — Les instruments : boîte d'outils céramique avec une pointe lumineuse. */
export function ToolsIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label="Une boîte à instruments céramique posée, couvercle lumineux">
      <defs>
        <linearGradient id="box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CLAY} />
          <stop offset="1" stopColor="#b7d2c1" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="152" rx="56" ry="9" fill={SHADOW} />
      <path d="M45 80 H155 L145 148 H55 Z" fill="url(#box)" />
      <rect x="52" y="66" width="96" height="16" rx="8" fill="#eef7f1" />
      <path d="M52 74 h96" stroke={MINT} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <circle cx="100" cy="112" r="9" fill="#0c150f" opacity="0.16" />
      <rect x="86" y="118" width="28" height="5" rx="2.5" fill="#0c150f" opacity="0.16" />
    </svg>
  );
}

/** Ch.05 — Les preuves : écran vivant (interface) sur socle, lueur de validation. */
export function ProofIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 210 170" className={className} role="img" aria-label="Un écran courbé montrant une interface simple, confirmée d'une coche lumineuse">
      <defs>
        <linearGradient id="scr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#132b1d" />
          <stop offset="1" stopColor="#0e2016" />
        </linearGradient>
      </defs>
      <ellipse cx="105" cy="158" rx="62" ry="8" fill={SHADOW} />
      <rect x="35" y="26" width="140" height="104" rx="14" fill={CLAY} />
      <rect x="44" y="36" width="122" height="84" rx="9" fill="url(#scr)" />
      {/* interface simple : lignes + KPI + coche (les traits se dessinent au scroll) */}
      <rect x="54" y="48" width="44" height="5" rx="2.5" fill={MINT} opacity="0.85" />
      <rect x="54" y="60" width="70" height="4" rx="2" fill="#eaf5ee" opacity="0.35" data-draw />
      <rect x="54" y="72" width="56" height="4" rx="2" fill="#eaf5ee" opacity="0.25" data-draw />
      <circle cx="134" cy="92" r="16" fill="none" stroke={MINT} strokeWidth="3" opacity="0.9" data-draw />
      <path d="M127 92 l5 5 10 -10" fill="none" stroke={MINT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" data-draw />
      <rect x="60" y="140" width="90" height="10" rx="5" fill="#b7d2c1" />
    </svg>
  );
}

/** Ch.06 — La continuité : deux dé qui se rencontrent (le suivant est à toi). */
export function TogetherIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 160" className={className} role="img" aria-label="Deux dés : un posé, l'autre encore en roue, lumineux">
      <defs>
        <linearGradient id="d2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={CLAY} />
          <stop offset="1" stopColor="#c2ddca" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="140" rx="80" ry="10" fill={SHADOW} />
      {/* dé posé */}
      <g>
        <rect x="40" y="86" width="52" height="52" rx="12" fill="url(#d2)" />
        <circle cx="56" cy="102" r="5" fill="#0c150f" opacity="0.22" />
        <circle cx="76" cy="122" r="5" fill="#0c150f" opacity="0.22" />
        <circle cx="66" cy="112" r="5" fill="#0c150f" opacity="0.22" />
      </g>
      {/* dé en roue (lumineux) */}
      <g transform="rotate(-18 150 92)">
        <rect x="124" y="66" width="52" height="52" rx="12" fill={MINT} opacity="0.92" />
        <circle cx="150" cy="92" r="5" fill="#0c150f" opacity="0.3" />
      </g>
      {/* mouvement */}
      <path d="M118 110 q 14 -8 20 -20" fill="none" stroke={CLAY_DIM} strokeWidth="2.5" strokeDasharray="1 6" strokeLinecap="round" />
    </svg>
  );
}
