# michaelreiglewagner.com

Portfolio site for Michael Reigle Wagner, served by GitHub Pages. It's plain static HTML with no build step on GitHub's side.

The page URLs match the old Wix site (`/oils-on-canvas-`, `/charcoals-and--pastel`, `/drawings-`, `/digital`, `/contact-`, `/resume`, `/style-guide-c12ou`, `/schleem`). That way existing links and search results keep working after the move.

## Layout

| Path | What it is |
| --- | --- |
| `*.html` | Generated pages. Don't edit these by hand; edit the data or `tools/build.mjs` and rebuild |
| `images/web/` | Large images (longest side 2000px), shown in the lightbox |
| `images/thumb/` | Gallery thumbnails (longest side 700px) |
| `assets/` | `site.css`, `site.js` (menu, lightbox, contact form), favicon |
| `tools/site-data.json` | Every artwork: page, gallery, title, size/medium lines, image file |
| `tools/build.mjs` | Regenerates every page from the data |

## Adding artwork

1. Save the image twice, once at about 2000px (`images/web/<page>/<name>.jpg`) and once at about 700px (`images/thumb/<page>/<name>.jpg`).
2. Add an item to the gallery you want in `tools/site-data.json` (copy a neighbor and change `title`, `desc`, `w`, `h`, `file`).
3. Run `node tools/build.mjs`, then commit and push.

## Preview locally

```
npx serve C:/dev/mwagnerdesigns.github.io
```
