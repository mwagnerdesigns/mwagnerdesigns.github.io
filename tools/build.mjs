// Generates the site's HTML pages from tools/site-data.json.
// Usage (from the repo root): node tools/build.mjs
// To add artwork: drop images into images/web + images/thumb, add an item to site-data.json, rebuild.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/site-data.json'), 'utf8'));

const SITE = {
  name: 'Michael Reigle Wagner',
  url: 'https://michaelreiglewagner.com',
  email: 'info@michaelreiglewagner.com',
  phone: '(216) 407-6098',
  tel: '+12164076098',
  instagram: 'https://www.instagram.com/michaelwagnerart',
};
const NAV = [
  ['/', 'Home'],
  ['/charcoals-and--pastel', 'Charcoal & Pastel'],
  ['/oils-on-canvas-', 'Acrylic & Oil'],
  ['/drawings-', 'Sketches'],
  ['/digital', 'Graphic Design'],
  ['/contact-', 'Contact'],
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const web = f => `/images/web/${f}`;
const thumb = f => `/images/thumb/${f}`;
const fit = (w, h, max) => { const s = Math.min(1, max / Math.max(w, h)); return [Math.round(w * s), Math.round(h * s)]; };

function layout({ slug, title, description, body, active, bodyClass = '' }) {
  const canonical = SITE.url + (slug === 'index' ? '/' : '/' + slug);
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | Art`;
  const nav = NAV.map(([href, label]) =>
    `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('\n        ');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${SITE.url}${web(data.home.headshot.file)}">
  <link rel="icon" href="/assets/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css">
  <script>document.documentElement.classList.add('js')</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <a class="skip" href="#main">Skip to main content</a>
  <header class="site-header">
    <nav class="site-nav" aria-label="Main">
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">Menu</button>
      <div class="nav-links" id="nav-links">
        ${nav}
      </div>
    </nav>
  </header>
  <div class="brand"><a href="/">Michael R Wagner</a></div>
  <main id="main">
${body}
  </main>
  <footer class="site-footer">
    <a class="social" href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1C2.7 9.8 2.7 10.1 2.7 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.2-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg>
    </a>
    <p>A Michael Wagner Production &middot; &copy; ${new Date().getFullYear()} ${esc(SITE.name)}</p>
  </footer>
  <dialog class="viewer" aria-label="Artwork viewer">
    <figure>
      <img alt="">
      <figcaption></figcaption>
    </figure>
    <p class="v-count" aria-live="polite"></p>
    <button class="v-btn v-close" aria-label="Close">&times;</button>
    <button class="v-btn v-prev" aria-label="Previous artwork">&#8249;</button>
    <button class="v-btn v-next" aria-label="Next artwork">&#8250;</button>
  </dialog>
  <script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

// One artwork per screen. The <a> points at the large image so it still works without JS;
// site.js turns the click into the in-page viewer.
function slide(i) {
  const [w, h] = fit(i.w, i.h, 2000);
  const cap = i.title || i.desc.length
    ? `\n        <figcaption><strong>${esc(i.title)}</strong>${i.desc.length ? `<span>${esc(i.desc.join(' · '))}</span>` : ''}</figcaption>`
    : '';
  return `      <figure class="slide art">
        <a class="frame" href="${web(i.file)}" data-title="${esc(i.title)}" data-desc="${esc(i.desc.join(' · '))}">` +
    `<img src="${thumb(i.file)}" srcset="${thumb(i.file)} ${fit(i.w, i.h, 700)[0]}w, ${web(i.file)} ${w}w" ` +
    `sizes="(max-width: 760px) 92vw, 70vw" width="${w}" height="${h}" loading="lazy" decoding="async" alt="${esc(i.alt)}"></a>${cap}
      </figure>`;
}

function renderBlocks(blocks) {
  const intro = [], reel = [];
  for (const b of blocks) {
    if (b.type === 'heading') intro.push(`      <h1>${esc(b.text)}</h1>`);
    else if (b.type === 'subheading') reel.push(`      <section class="slide chapter"><h2>${esc(b.text)}</h2></section>`);
    else if (b.type === 'link') reel.push(`      <p class="more"><a href="${b.href}">${esc(b.text)} &rarr;</a></p>`);
    else if (b.type === 'gallery') reel.push(...b.items.map(slide));
    else if (b.type === 'image') reel.push(slide(b.item));
  }
  intro.push('      <p class="note">Scroll to explore &middot; click any piece to expand</p>');
  return `    <section class="slide intro">
${intro.join('\n')}
      <span class="cue" aria-hidden="true"></span>
    </section>
    <div class="reel">
${reel.join('\n')}
    </div>
    <nav class="reel-nav" aria-label="Gallery position">
      <button class="r-up" aria-label="Previous artwork">&#8963;</button>
      <span class="r-count"></span>
      <button class="r-down" aria-label="Next artwork">&#8964;</button>
      <button class="r-top" aria-label="Back to top"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 2.5h10M8 14V6M4 9.5 8 5.5l4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Top</span></button>
    </nav>`;
}

function write(slug, html) {
  fs.writeFileSync(path.join(ROOT, slug + '.html'), html);
  console.log('wrote', slug + '.html');
}

// Gallery pages
const descriptions = {
  'charcoals-and--pastel': 'Charcoal and pastel drawings by Cleveland surrealist artist Michael Reigle Wagner.',
  'oils-on-canvas-': 'Surrealist oil and acrylic paintings by Michael Reigle Wagner: vivid, dreamlike reinterpretations of classical subjects.',
  'drawings-': 'Sketches and drawings by Michael Reigle Wagner.',
  digital: 'Graphic design work by Michael Reigle Wagner: ads, logos, style guides and skateboard graphics.',
  'style-guide-c12ou': 'Brand style guides and product design work by Michael Reigle Wagner.',
  schleem: 'Schleem Skateboards graphics by Michael Reigle Wagner.',
};
const activeFor = { 'style-guide-c12ou': '/digital', schleem: '/digital' };
const extraLinks = {
  digital: { after: 'Style Guides', href: '/style-guide-c12ou', text: 'View the style guides' },
  digital2: { after: 'Schleem Skateboards', href: '/schleem', text: 'View the full Schleem collection' },
};
for (const [slug, p] of Object.entries(data.pages)) {
  let blocks = p.blocks;
  if (slug === 'digital') {
    // The Wix version linked these sections to their own pages; make that explicit.
    blocks = blocks.flatMap((b, idx) => {
      const prev = blocks[idx - 1];
      const out = [b];
      if (prev?.type === 'subheading' && b.type !== 'subheading') {
        for (const l of Object.values(extraLinks)) if (prev.text === l.after) out.push({ type: 'link', href: l.href, text: l.text });
      }
      return out;
    });
  }
  write(slug, layout({ slug, title: p.title, description: descriptions[slug], active: activeFor[slug] || '/' + slug, bodyClass: 'reel-page', body: renderBlocks(blocks) }));
}

// Home
const t = data.home.texts;
const tileLabels = { Charcoal: ['Charcoal & Pastel', '/charcoals-and--pastel'], 'Oil on Canvas': ['Acrylic & Oil', '/oils-on-canvas-'], Sketches: ['Drawings', '/drawings-'], 'Graphic Design': ['Graphic Design', '/digital'], Resume: ['Resume', '/resume'], Contact: ['Contact', '/contact-'] };
const tiles = data.home.tiles.map(i => {
  const [label, href] = tileLabels[i.title] || [i.title, '/'];
  return `<a class="medium" href="${href}"><img src="${thumb(i.file)}" width="300" height="300" alt="" loading="lazy"><span>${esc(label)}</span></a>`;
}).join('\n      ');
const hs = data.home.headshot;
const para = s => s.split(/\n\n+/).map(x => `<p>${esc(x.trim())}</p>`).join('\n        ');
write('index', layout({
  slug: 'index', title: '', active: '/',
  description: 'Michael Reigle Wagner is a Cleveland-born surrealist oil painter and graphic designer. Browse paintings, charcoal and pastel drawings, sketches and design work.',
  body: `    <p class="lede">${esc(t.i4yttkon)}</p>
    <nav class="mediums" aria-label="Browse by medium">
      ${tiles}
    </nav>
    <p class="disclaimer">${esc(t.i4yw5s6s)}</p>
    <section class="about">
      <img src="${web(hs.file)}" width="${fit(hs.w, hs.h, 600).join('" height="')}" alt="Michael Reigle Wagner" loading="lazy">
      <div>
        <h1>${esc(t['comp-m740huai1'])}</h1>
        <p class="bio">${esc(t['comp-m740huak1'])}</p>
        <h2>${esc(t['comp-m740t3bv1'])}</h2>
        ${para(t['comp-m740t3bw3'])}
      </div>
    </section>
    <section class="contact-strip">
      <h2>Contact</h2>
      <p>For all of your artistic inquiries contact me directly at:</p>
      <p><a href="mailto:${SITE.email}">${SITE.email}</a><br><a href="tel:${SITE.tel}">${SITE.phone}</a></p>
    </section>`,
}));

// Contact
write('contact-', layout({
  slug: 'contact-', title: 'Contact', active: '/contact-',
  description: 'Contact artist and graphic designer Michael Reigle Wagner.',
  body: `    <h1>About</h1>
    <section class="contact">
      <p>MichaelReigleWagner.com is the official online portfolio for the artist/graphic designer Michael Reigle Wagner.</p>
      <p>For additional inquiry feel free to contact me.</p>
      <p class="contact-lines">Tel: <a href="tel:${SITE.tel}">${SITE.phone}</a> &nbsp;|&nbsp; <a href="mailto:${SITE.email}">${SITE.email}</a></p>
      <form class="contact-form" data-to="${SITE.email}">
        <label>Name <input name="name" required autocomplete="name"></label>
        <label>Email <input name="email" type="email" required autocomplete="email"></label>
        <label>Subject <input name="subject"></label>
        <label class="msg">Message <textarea name="message" rows="7" required></textarea></label>
        <button type="submit">Send</button>
        <p class="form-hint">Opens your email app with the message filled in.</p>
      </form>
    </section>`,
}));

// Resume (content transcribed from the Wix page; employer logos alongside each entry)
const L = data.resumeLogos;
const logo = id => L[id] ? `<img class="logo" src="${thumb(L[id].file)}" alt="" width="120" height="${Math.round(120 * L[id].h / L[id].w)}" loading="lazy">` : '';
const job = (id, name, items, blurb) => `      <article class="job">
        ${logo(id)}
        <div>
          <h3>${esc(name)}</h3>
          ${blurb ? `<p>${esc(blurb)}</p>` : ''}
          <ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
      </article>`;
write('resume', layout({
  slug: 'resume', title: 'Resume', active: '/resume',
  description: 'Resume of Michael Reigle Wagner: BFA, USC Roski School of Art and Design; graphic design and art experience.',
  body: `    <h1>Resume</h1>
    <div class="resume">
      <p class="resume-contact">Email: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
      <h2>Education</h2>
${job('i4yv0p25', 'University of Southern California – Roski School of Art and Design, Los Angeles, CA', ['BFA 2016'])}
      <h2>Employment</h2>
${job('comp-m70v4g4g', 'Alliance Real Estate LLC (2021)', ['Logo creation', 'Style guide for the company', 'Website creation and maintenance', 'Presentation decks and press material'])}
${job('comp-m70uxxhe', 'JGX Group (2019)', ['Physical storefront designs / product layouts / display cases', '3D renderings of product designs', 'Commercial and large format printing', 'Advertising creation, print and digital', 'Style guides, presentation decks'])}
${job('comp-m70v0rhi', 'Davey Tree (2017)', ['Logo creation for new products', 'Print and digital design: catalogs, post cards, web pages, billboards', 'Style guides, presentation decks, layouts for print material'])}
${job('i4yv0p27_1', 'Jimmy Iovine and Andre Young Academy, Los Angeles, CA (2014–15)', ['Supervise 3D printing – Makerbot, UltiMaker; commercial-sized 3D print jobs as well as small personal creations', 'Supervise laser cutting – Unich Cutter; mediums: wood, plastic, paper, fabrics, fiberglass', 'Technical support for students and teachers at The Academy'], 'The Academy aims to inspire innovative, entrepreneurial thought in business, design, marketing and the arts; creating the products of the future in art and design; engineering and computer science; and business and venture management.')}
${job('idajc375', 'Davis Elen Advertising, Los Angeles, CA (2015)', ["Creative Department; worked on national brand campaigns including Toyota and McDonald's", 'Special Olympics World Games Los Angeles 2015, social media', 'In-house design work'])}
${job('i4yv0p26_0', 'Diamond Supply Co., Los Angeles, CA (2014)', ['Graphic Designer – create illustrations and graphic designs for new line of children’s apparel', 'Production Team – assist with product choices, color combinations, material choices', 'Artist Assistant – assist other team members with both studio and digital creative design'], 'Diamond Supply Co is a California based skateboard clothing line, specializing in apparel with creative graphic design elements.')}
${job('i4yv0p26', 'Heather Moore Jewelry, Cleveland, OH (2010–2013)', ['Website Design – worked on the website’s visual presentation including layout and image correction; worked with the business manager on online pricing issues', 'Magazine Spread/Advertisement Design – assisted in the digital production of national marketing and advertisement campaigns', 'Marketing – assisted in implementing marketing campaigns directed at members of the professional trade', 'Product Documentation and Cataloging – digitally corrected photos of each piece of jewelry made and catalogued the entire collection', 'Precious metals/jewels inventory – performed physical inventory of materials used in product production', 'Provided general operational support as needed throughout the organization'], 'Heather Moore Jewelry designs and produces personalized jewelry collections for the luxury market.')}
${job('i4yv0p25_0', 'USC Thornton Technology, Los Angeles, CA (work study 2011)', ['Provided audio and visual technical support to classes within USC’s Thornton School of Music', 'Issued and rented out musical equipment to students and faculty'])}
${job('i4yv0p27_2', 'Sterling Real Estate Apartments, Cleveland, OH (2008–13)', ['Real estate leasing agent, kept building occupancy above 90%', 'Building maintenance, construction, repair and refurbishing', 'Contact for open house viewings and appointment showings'])}
      <h2>Software / Computer</h2>
${job('i4yv0p26_1', 'Tools', ['Adobe: Photoshop, Illustrator, InDesign, Bridge', 'CAD: Computer Aided Drawing', 'Film: Final Cut Pro (Final Cut X)', '3D Printing: Makerbot'])}
    </div>`,
}));

// 404
write('404', layout({
  slug: '404', title: 'Page not found', active: '',
  description: 'Page not found.',
  body: `    <h1>Page not found</h1>
    <p class="note">That page doesn't exist. <a href="/">Head back to the gallery</a>.</p>`,
}));

// Sitemap
const urls = ['/', ...Object.keys(data.pages).map(s => '/' + s), '/contact-', '/resume'];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE.url}${u}</loc></url>`).join('\n')}
</urlset>
`);
console.log('wrote sitemap.xml');
