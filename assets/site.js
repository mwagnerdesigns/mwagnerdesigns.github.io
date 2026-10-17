// Mobile menu, gallery lightbox, and mailto-based contact form.
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  const box = document.querySelector('.lightbox');
  const items = [...document.querySelectorAll('a.tile, a.feature')];
  if (box && items.length) {
    const img = box.querySelector('img');
    const cap = box.querySelector('figcaption');
    let idx = 0;
    const show = i => {
      idx = (i + items.length) % items.length;
      const a = items[idx];
      img.src = a.href;
      img.alt = a.querySelector('img').alt;
      cap.innerHTML = '';
      if (a.dataset.title) cap.append(Object.assign(document.createElement('strong'), { textContent: a.dataset.title }));
      if (a.dataset.desc) cap.append(Object.assign(document.createElement('span'), { textContent: a.dataset.desc }));
      new Image().src = items[(idx + 1) % items.length].href; // preload next
    };
    items.forEach((a, i) => a.addEventListener('click', e => {
      e.preventDefault();
      show(i);
      box.showModal();
    }));
    box.querySelector('.lb-close').addEventListener('click', () => box.close());
    box.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
    box.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
    box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'FIGURE') box.close(); });
    box.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    let x0 = null;
    box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    box.addEventListener('close', () => { img.removeAttribute('src'); });
  }

  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const subject = f.get('subject') || `Website inquiry from ${f.get('name')}`;
    const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
    location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
