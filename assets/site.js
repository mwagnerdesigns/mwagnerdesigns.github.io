// Mobile menu, gallery reel (entrance animation + position counter), artwork viewer, Formspree contact form.
(() => {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(.22, .61, .36, 1)';

  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  // Mobile menu: opens from the Menu button; closes on a tap outside it or once the page scrolls.
  let openedAt = 0;
  const setMenu = open => {
    links?.classList.toggle('open', open);
    toggle?.setAttribute('aria-expanded', open);
    if (open) openedAt = scrollY;
  };
  toggle?.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  document.addEventListener('click', e => {
    if (links?.classList.contains('open') && !e.target.closest('.site-nav')) setMenu(false);
  });
  addEventListener('scroll', () => {
    if (links?.classList.contains('open') && Math.abs(scrollY - openedAt) > 12) setMenu(false);
  }, { passive: true });

  // Keep the snap offset equal to the sticky header's real height.
  const header = document.querySelector('.site-header');
  const setHdr = () => root.style.setProperty('--hdr', header.offsetHeight + 'px');
  setHdr();
  addEventListener('resize', setHdr);

  // ---- Reel ----
  const slides = [...document.querySelectorAll('.reel .slide')];
  const arts = slides.filter(s => s.classList.contains('art'));
  const nav = document.querySelector('.reel-nav');
  const count = nav?.querySelector('.r-count');
  let current = -1;

  if (slides.length) {
    const reveal = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    }), { threshold: 0.2 });
    slides.forEach(s => reveal.observe(s));

    // The artwork crossing the middle of the screen is "current".
    const track = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      current = arts.indexOf(e.target);
      count.textContent = `${current + 1} / ${arts.length}`;
    }), { rootMargin: '-45% 0px -45% 0px' });
    arts.forEach(s => track.observe(s));

    const intro = document.querySelector('.intro');
    const footer = document.querySelector('.site-footer');
    const showNav = () => {
      const r = intro.getBoundingClientRect(), f = footer.getBoundingClientRect();
      nav.classList.toggle('show', r.bottom < innerHeight * 0.5 && f.top > innerHeight * 0.6);
    };
    addEventListener('scroll', showNav, { passive: true });
    showNav();

    const step = d => {
      const next = arts[Math.max(0, Math.min(arts.length - 1, (current < 0 ? -1 : current) + d))];
      next?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    };
    nav.querySelector('.r-up').addEventListener('click', () => step(-1));
    nav.querySelector('.r-down').addEventListener('click', () => step(1));
    nav.querySelector('.r-top').addEventListener('click', () => scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }));
  }

  // ---- Viewer ----
  const box = document.querySelector('.viewer');
  const frames = [...document.querySelectorAll('.reel a.frame')];
  if (box && frames.length) {
    const img = box.querySelector('img');
    const cap = box.querySelector('figcaption');
    const counter = box.querySelector('.v-count');
    let idx = 0, busy = false;

    const caption = a => {
      cap.replaceChildren();
      if (a.dataset.title) cap.append(Object.assign(document.createElement('strong'), { textContent: a.dataset.title }));
      if (a.dataset.desc) cap.append(Object.assign(document.createElement('span'), { textContent: a.dataset.desc }));
      counter.textContent = `${idx + 1} / ${frames.length}`;
    };
    // Show the already-loaded slide image at once, then swap in the large file when it's ready.
    const load = a => {
      const small = a.querySelector('img');
      img.width = small.width; img.height = small.height;
      img.src = small.currentSrc || small.src;
      img.alt = small.alt;
      if (img.src !== a.href) {
        const big = new Image();
        big.src = a.href;
        big.decode().then(() => { if (frames[idx] === a) img.src = a.href; }).catch(() => {});
      }
    };
    // FLIP: animate the viewer image between its own box and the slide image's box.
    const flip = (fromRect, reverse) => {
      const to = img.getBoundingClientRect();
      if (calm || !fromRect.width || !to.width) return Promise.resolve();
      const dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2);
      const dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2);
      const s = fromRect.width / to.width;
      const frames = [{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }, { transform: 'none' }];
      return img.animate(reverse ? frames.reverse() : frames, { duration: 560, easing: ease, fill: 'both' }).finished;
    };

    const open = i => {
      idx = i;
      const a = frames[idx];
      load(a);
      caption(a);
      box.showModal();
      requestAnimationFrame(() => {
        flip(a.querySelector('img').getBoundingClientRect(), false).then(() => img.getAnimations().forEach(x => x.cancel()));
        box.classList.add('open');
      });
    };
    const close = async () => {
      if (busy || !box.open) return;
      busy = true;
      const slideEl = frames[idx].closest('.slide');
      slideEl.scrollIntoView({ block: 'start', behavior: 'instant' });
      slideEl.classList.add('in');
      box.classList.remove('open');
      await flip(frames[idx].querySelector('img').getBoundingClientRect(), true);
      box.close();
      img.getAnimations().forEach(x => x.cancel());
      img.removeAttribute('src');
      busy = false;
    };
    // Crossfade: slide the current piece out, the next one in.
    const go = async d => {
      if (busy) return;
      busy = true;
      const dur = calm ? 0 : 1;
      await img.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-d * 36}px) scale(.98)` }],
        { duration: 220 * dur, easing: 'ease-in', fill: 'forwards' }).finished;
      cap.style.opacity = 0;
      idx = (idx + d + frames.length) % frames.length;
      const a = frames[idx];
      load(a);
      try { await img.decode(); } catch {}
      caption(a);
      cap.style.opacity = '';
      img.getAnimations().forEach(x => x.cancel());
      await img.animate([{ opacity: 0, transform: `translateX(${d * 36}px) scale(.98)` }, { opacity: 1, transform: 'none' }],
        { duration: 420 * dur, easing: ease }).finished;
      busy = false;
    };

    frames.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); open(i); }));
    box.querySelector('.v-close').addEventListener('click', close);
    box.querySelector('.v-prev').addEventListener('click', () => go(-1));
    box.querySelector('.v-next').addEventListener('click', () => go(1));
    // Click the picture or the dark surround to close.
    box.addEventListener('click', e => { if (!e.target.closest('.v-btn')) close(); });
    box.addEventListener('cancel', e => { e.preventDefault(); close(); });
    box.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    let x0 = null;
    box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) { e.preventDefault(); go(dx < 0 ? 1 : -1); }
    });
  }

  const form = document.querySelector('.contact-form');
  // Posts to Formspree in the background; without JS the form still posts and Formspree shows its own page.
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button');
    const data = new FormData(form);
    if (!data.get('_subject')) data.set('_subject', `Website inquiry from ${data.get('name')}`);
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending…';
    try {
      const r = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).errors?.map(x => x.message).join(', ') || r.status);
      form.reset();
      status.className = 'form-status ok';
      status.textContent = 'Thanks! Your message was sent.';
    } catch (err) {
      status.className = 'form-status err';
      status.textContent = 'Sorry, that didn’t send. Please email info@michaelreiglewagner.com directly.';
    } finally {
      button.disabled = false;
    }
  });
})();
