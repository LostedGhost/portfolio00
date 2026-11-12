// Vérifie la présence des mécanismes du récit dans le bundle construit.
import { readFileSync, readdirSync } from 'node:fs';

const file = readdirSync('dist/assets').find((x) => x.startsWith('index-') && x.endsWith('.js'));
const s = readFileSync('dist/assets/' + file, 'utf8');

const checks = [
  ['TypedHud (HUD tapé)', String.fromCharCode(0x258c)],
  ['FaceSynced (sondage rAF)', 'requestAnimationFrame'],
  ['FaceSynced (plaged 6 faces)', 'placed'],
  ['HeroManifesto (flou)', 'blur(2px)'],
  ['scroll-hint', 'scroll-hint'],
  ['Manifest clip-path', 'inset(0 100%'],
  ['SkillThread (fil)', 'data-thread'],
  ['Timeline bounce', 'bounce.out'],
  ['Échos volets', 'transformPerspective'],
  ['Anneau contact', 'vectorEffect'],
  ['story:send (révolution)', 'story:send'],
  ['Preloader scenes-signal', 'data-critical'],
  ['Preloader-garde 2.5s', '2500'],
];

for (const [label, needle] of checks) {
  console.log(label.padEnd(30), s.includes(needle) ? 'OK' : 'ABSENT');
}
