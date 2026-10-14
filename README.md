# Rohith Kumar S S — portfolio

A one-page portfolio inspired by landonorris.com, in a "kasavu gold" palette (silk-veshti ivory, ink, zari gold).

## Run it

```bash
python -m http.server 8130 --directory D:/rohith-portfolio
```

Open http://localhost:8130. It must be served over http(s): the "digital twin" lens reads the portrait's pixels, which browsers block on `file://`.

## Edit the words

All text for experience, builds, Genesis'26 numbers, recognition and skills lives in `js/data.js`. Headings, hero lines, gallery captions and links live in `index.html`.

## Files

| Path | What it is |
|---|---|
| `index.html` | Page structure and static copy |
| `css/style.css` | Palette tokens at the top, then one block per section |
| `js/data.js` | Content and the line-art emblems for the build cards |
| `js/twin.js` | The point-cloud portrait (hero lens + turning bust in "In the Lab") |
| `js/main.js` | Loader, smooth scroll, cursor, menu, drawer, scroll animations |
| `assets/img/` | Web-ready photos and cut-outs (WebP) |
| `source-photos/`, `work/` | Originals and cut-out masks — not needed to publish |

Libraries load from jsDelivr: GSAP 3.13 (ScrollTrigger, SplitText) and Lenis 1.1.13.

## Publish (GitHub Pages)

Push everything except `source-photos/` and `work/` (already in `.gitignore`) to a repo named `Rohith-Kumar-SS.github.io`, then turn on Pages (main / root).
