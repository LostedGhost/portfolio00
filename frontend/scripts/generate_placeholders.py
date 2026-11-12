"""Genere des images placeholder dans src/mock/images/ (theme sombre du portfolio).

Usage : python generate_placeholders.py
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "src" / "mock" / "images"

BG = (10, 10, 32)        # --color-surface
DARK = (5, 5, 15)        # --color-bg
ACCENT = (0, 170, 255)   # --color-accent
VIOLET = (123, 47, 255)  # --color-violet
GRID = (232, 232, 240, 26)

WIDESCREEN = [(1920, 1080), (1600, 1000)]
SQUARE = [(800, 800), (512, 512), (400, 400)]


def make(name: str, size: tuple[int, int], label: str, variant: int) -> None:
    w, h = size
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)

    # Fond : wrille bord-clair discret
    step = max(24, w // 20)
    for x in range(0, w, step):
        d.line([(x, 0), (x, h)], fill=GRID, width=1)
    for y in range(0, h, step):
        d.line([(0, y), (w, y)], fill=GRID, width=1)

    # Halo radial violet/bleu positionne selon le variant
    cx = w // 2 + int(w * 0.25 * math.cos(variant)) // 2
    cy = h // 2 + int(h * 0.25 * math.sin(variant)) // 2
    r = int(min(w, h) * 0.5)
    for i in range(r, 0, -8):
        t = 1 - i / r
        color = (
            int(ACCENT[0] * t + VIOLET[0] * (1 - t)),
            int(ACCENT[1] * t + VIOLET[1] * (1 - t)),
            int(ACCENT[2] * t + VIOLET[2] * (1 - t)),
        )
        d.ellipse([cx - i, cy - i, cx + i, cy + i], outline=color, width=2)

    # Monogramme simple ( Approche type < /> )
    mono_font = None
    try:
        from PIL import ImageFont
        mono_font = ImageFont.truetype("consola.ttf", size=max(28, min(w, h) // 12))
    except Exception:
        pass
    text = f"<{label}/>"
    d.text((cx, cy), text, fill=(232, 232, 240), anchor="mm", font=mono_font)

    img.save(OUT / f"{name}.png", optimize=True)


def make_solid(name: str, size: tuple[int, int], color: tuple[int, int, int]) -> None:
    Image.new("RGB", size, color).save(OUT / f"{name}.png", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    W, H = WIDESCREEN[0]

    # Fond d'accueil : sombre, presque uni
    bg = Image.new("RGB", (1920, 1080), DARK)
    bg.save(OUT / "hero-background.png", optimize=True)

    # Texture 3D accueil
    make("hero", (1024, 1024), "HERO", 1)
    # Profil + logo + favicons projets
    make("photo", (800, 800), "PHOTO", 2)
    make("logo", (400, 400), "LOGO", 3)
    for i in range(1, 7):
        make(f"project-{i}", (1600, 1000), f"PRO{i}", i)
    for i in range(1, 4):
        make_solid(f"testimonial-{i}", (400, 400), BG)

    # Logos techno : aplat uni sombre + grille fine
    techs = [
        ("tech-react", 1), ("tech-django", 2), ("tech-python", 3),
        ("tech-postgresql", 4), ("tech-mongodb", 5), ("tech-spring-boot", 6),
        ("tech-nodejs", 7), ("tech-tensorflow", 8), ("tech-tailwind", 9),
        ("tech-figma", 10), ("tech-git", 11), ("tech-docker", 12),
    ]
    for name, v in techs:
        make(name, (512, 512), name.removeprefix("tech-").upper(), v)

    print("Placeholders generes dans", OUT)


if __name__ == "__main__":
    main()
