/* Rohith Kumar S S — portfolio motion & behaviour */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasSplit = typeof window.SplitText !== 'undefined';

  /* ------------------------------------------------------------------
     1. Render content from data.js
  ------------------------------------------------------------------ */
  function render() {
    const D = typeof PORTFOLIO !== "undefined" ? PORTFOLIO : null;
    if (!D) return;

    const log = $('[data-render="experience"]');
    log.innerHTML = D.experience.filter((x) => x.side !== 'culture').map((x, i) => `
      <li class="log__item">
        <button class="log__row" type="button" aria-expanded="false" aria-controls="log-${i}">
          <span class="log__role">${esc(x.role)}${x.edu ? '<span class="log__tag">Education</span>' : ''}</span>
          <span class="log__org">${esc(x.org)}</span>
          <span class="log__place">${esc(x.place)}</span>
          <span class="log__when">${esc(x.when)}</span>
          <span class="log__icon" aria-hidden="true"></span>
        </button>
        <div class="log__detail" id="log-${i}" role="region">
          <ul class="log__points">${x.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </div>
      </li>`).join('');

    const grid = $('[data-render="builds"]');
    grid.innerHTML = D.builds.map((b) => {
      const inner = `
        <span class="build__top"><span class="build__tag${b.tag === 'Live' ? ' is-live' : ''}">${esc(b.tag || '')}</span>${b.more ? '' : '<span class="build__crew">Team Kernels</span>'}</span>
        <span class="build__emblem" aria-hidden="true"><svg viewBox="0 0 64 64">${EMBLEMS[b.emblem] || ''}</svg></span>
        <span class="build__foot"><span class="build__title">${esc(b.title)}</span><span class="build__year">${esc(b.year)}</span></span>
        <span class="build__zari" aria-hidden="true"></span>`;
      return b.more
        ? `<a class="build build--more" href="${esc(b.href)}" target="_blank" rel="noopener" data-cursor="GitHub">${inner}</a>`
        : `<button class="build" type="button" data-id="${esc(b.id)}" data-cursor="Open" aria-haspopup="dialog">${inner}</button>`;
    }).join('');

    $('[data-render="stats"]').innerHTML = D.stats.map((s) => `
      <div><dt>${esc(s.label)}</dt><dd><span class="count" data-n="${s.n}">${s.n}</span>${s.suffix ? `<small>${esc(s.suffix)}</small>` : ''}</dd></div>`).join('');

    $('[data-render="culture"]').innerHTML = D.culture.map((c) => `
      <li class="cult"><span class="cult__title">${esc(c.title)}</span><span class="cult__where">${esc(c.where)}</span><span class="cult__when">${esc(c.when)}</span><span class="cult__what">${esc(c.what)}</span></li>`).join('');
    $$('[data-build-count]').forEach((n) => (n.textContent = D.builds.filter((b) => !b.more).length));

    $('[data-render="podiums"]').innerHTML = D.podiums.map((p) => `
      <li class="podium"><span class="podium__title">${esc(p.title)}</span><span class="podium__where">${esc(p.where)}</span><span class="podium__what">${esc(p.what)}</span></li>`).join('');

    $('[data-render="stack"]').innerHTML = D.stack.map((g) => `
      <div class="stack__group"><h3 class="mono">${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');

    const all = D.stack.flatMap((g) => g.items);
    const half = Math.ceil(all.length / 2);
    const row = (items) => {
      const one = items.map((t, i) => `<i class="${i % 2 ? 'f' : 's'}">${esc(t)}</i><i class="d">◆</i>`).join('');
      return `<div class="stack__row"><span>${one}${one}${one}</span></div>`;
    };
    $('[data-render="stack-marquee"]').innerHTML = row(all.slice(0, half)) + row(all.slice(half));
  }

  /* ------------------------------------------------------------------
     2. Topographic contour tiles (periodic noise → marching squares)
  ------------------------------------------------------------------ */
  function contourTile(size, stroke, seed) {
    const S = 2, N = 110, P = 4;
    const perm = new Uint8Array(512);
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const base = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
    const grad = (ix, iy, per) => {
      ix = ((ix % per) + per) % per; iy = ((iy % per) + per) % per;
      const a = (perm[perm[ix] + iy] / 256) * Math.PI * 2;
      return [Math.cos(a), Math.sin(a)];
    };
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const noise = (x, y, per) => {
      const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
      const d = (gx, gy, dx, dy) => { const g = grad(gx, gy, per); return g[0] * dx + g[1] * dy; };
      const u = fade(fx), v = fade(fy);
      const a = d(x0, y0, fx, fy), b = d(x0 + 1, y0, fx - 1, fy);
      const c = d(x0, y0 + 1, fx, fy - 1), e = d(x0 + 1, y0 + 1, fx - 1, fy - 1);
      return (a + (b - a) * u) + ((c + (e - c) * u) - (a + (b - a) * u)) * v;
    };
    const f = [];
    for (let j = 0; j <= N; j++) {
      const row = [];
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * P, y = (j / N) * P;
        row.push(noise(x, y, P) + 0.45 * noise(x * 2, y * 2, P * 2) + 0.18 * noise(x * 4, y * 4, P * 4));
      }
      f.push(row);
    }
    const c = document.createElement('canvas');
    c.width = c.height = size * S;
    const ctx = c.getContext('2d');
    ctx.scale(S, S);
    ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.lineCap = 'round';
    const cell = size / N;
    ctx.beginPath();
    for (let lv = -0.6; lv <= 0.6; lv += 0.12) {
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const a = f[j][i], b = f[j][i + 1], cc = f[j + 1][i + 1], d = f[j + 1][i];
          const idx = (a > lv) << 3 | (b > lv) << 2 | (cc > lv) << 1 | (d > lv);
          if (idx === 0 || idx === 15) continue;
          const T = [i + (lv - a) / (b - a), j], R = [i + 1, j + (lv - b) / (cc - b)];
          const B = [i + (lv - d) / (cc - d), j + 1], L = [i, j + (lv - a) / (d - a)];
          const seg = (p, q) => { ctx.moveTo(p[0] * cell, p[1] * cell); ctx.lineTo(q[0] * cell, q[1] * cell); };
          switch (idx) {
            case 1: case 14: seg(L, B); break;
            case 2: case 13: seg(B, R); break;
            case 3: case 12: seg(L, R); break;
            case 4: case 11: seg(T, R); break;
            case 6: case 9: seg(T, B); break;
            case 7: case 8: seg(L, T); break;
            case 5: seg(L, T); seg(B, R); break;
            case 10: seg(T, R); seg(L, B); break;
          }
        }
      }
    }
    ctx.stroke();
    return new Promise((res) => c.toBlob((blob) => res(blob ? URL.createObjectURL(blob) : null), 'image/png'));
  }

  function paintContours() {
    const root = document.documentElement.style;
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
    idle(async () => {
      const light = await contourTile(1100, 'rgba(20,17,12,0.085)', 20051021);
      if (light) root.setProperty('--contour-light', `url(${light})`);
      const dark = await contourTile(1100, 'rgba(243,236,220,0.055)', 7702);
      if (dark) root.setProperty('--contour-dark', `url(${dark})`);
    });
  }

  /* ------------------------------------------------------------------
     3. Smooth scroll
  ------------------------------------------------------------------ */
  let lenis = null;
  function smoothScroll() {
    if (reduced || typeof window.Lenis === 'undefined' || !hasGsap) return;
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ------------------------------------------------------------------
     4. Header / cursor theme follows the section underneath
  ------------------------------------------------------------------ */
  const header = $('.header');
  function setTheme(t) {
    if (header.dataset.theme !== t) header.dataset.theme = t;
    document.body.dataset.ui = t;
  }
  let themeQueued = false;
  function syncTheme() {
    if (themeQueued) return;
    themeQueued = true;
    requestAnimationFrame(() => {
      themeQueued = false;
      const x = Math.round(window.innerWidth * 0.3), y = 36;
      const hit = document.elementsFromPoint(x, y).find((el) => !el.closest('.header, .cursor, .menu'));
      const sec = hit && hit.closest('section[data-theme], footer[data-theme]');
      if (!sec) return;
      setTheme(sec.classList.contains('gallery') ? (sec.classList.contains('is-warm') ? 'light' : 'dark') : sec.dataset.theme);
    });
  }
  function themeTriggers() {
    window.addEventListener('scroll', syncTheme, { passive: true });
    window.addEventListener('resize', syncTheme);
    ScrollTrigger.addEventListener('refresh', syncTheme);
    syncTheme();
  }

  /* ------------------------------------------------------------------
     5. Custom cursor + magnetic buttons
  ------------------------------------------------------------------ */
  function cursor() {
    if (!finePointer || reduced || !hasGsap) return;
    const el = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    document.body.classList.add('has-cursor');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    window.addEventListener('pointermove', (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      el.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', () => el.classList.add('is-hidden'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      const scan = t.closest('.hero__stage');
      const lab = t.closest('[data-cursor]');
      const link = t.closest('a, button, [role="button"]');
      ring.style.opacity = scan ? '0' : '';
      el.classList.toggle('is-label', !!lab);
      el.classList.toggle('is-hover', !lab && !!link);
      label.textContent = lab ? lab.dataset.cursor : '';
    });
  }

  function magnetic() {
    if (!finePointer || reduced || !hasGsap) return;
    $$('.magnetic').forEach((m) => {
      const xTo = gsap.quickTo(m, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(m, 'y', { duration: 0.5, ease: 'power3' });
      m.addEventListener('pointermove', (e) => {
        const r = m.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      m.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ------------------------------------------------------------------
     6. Menu overlay
  ------------------------------------------------------------------ */
  const menu = $('#menu'), menuBtn = $('.menu-btn');
  let menuOpen = false, menuTl = null;
  function openMenu() {
    menuOpen = true;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.querySelector('.sr-only').textContent = 'Close menu';
    lenis && lenis.stop();
    if (hasGsap && !reduced) {
      menuTl && menuTl.kill();
      menuTl = gsap.timeline()
        .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
        .fromTo($$('.menu__label', menu), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.35)
        .fromTo($('.menu__preview', menu), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'expo.out' }, 0.5)
        .fromTo($('.menu__foot', menu), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.6);
    } else {
      menu.style.clipPath = 'none';
    }
    setTimeout(() => $('.menu__list a', menu).focus({ preventScroll: true }), reduced ? 0 : 500);
  }
  function closeMenu(then) {
    if (!menuOpen) { then && then(); return; }
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelector('.sr-only').textContent = 'Open menu';
    const done = () => {
      menu.hidden = true;
      document.body.classList.remove('menu-open');
      lenis && lenis.start();
      then && then();
    };
    if (hasGsap && !reduced) {
      menuTl && menuTl.kill();
      menuTl = gsap.timeline({ onComplete: done })
        .to($$('.menu__label', menu), { yPercent: -110, duration: 0.45, stagger: 0.03, ease: 'power3.in' })
        .to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'expo.inOut' }, 0.2);
    } else done();
  }
  function menuSetup() {
    menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
    const prev = $('.menu__preview img', menu);
    $$('.menu__list a', menu).forEach((a) => {
      a.addEventListener('pointerenter', () => {
        if (prev.getAttribute('src') === a.dataset.img) return;
        if (hasGsap && !reduced) {
          gsap.to(prev, { autoAlpha: 0, scale: 1.06, duration: 0.18, onComplete: () => {
            prev.src = a.dataset.img;
            gsap.to(prev, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
          } });
        } else prev.src = a.dataset.img;
      });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { closeMenu(); menuBtn.focus(); } });
  }

  /* In-page links: close the menu first, then glide */
  function anchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu(() => scrollToTarget(target));
    });
  }

  /* ------------------------------------------------------------------
     7. Project drawer
  ------------------------------------------------------------------ */
  const drawer = $('#drawer');
  let lastFocus = null;
  function openDrawer(id) {
    const b = PORTFOLIO.builds.find((x) => x.id === id);
    if (!b) return;
    lastFocus = document.activeElement;
    $('.drawer__body', drawer).innerHTML = `
      <div class="drawer__emblem" aria-hidden="true"><svg viewBox="0 0 64 64">${EMBLEMS[b.emblem] || ''}</svg></div>
      <p class="drawer__meta mono"><span>${esc(b.year)}</span><span>${esc(b.tag || '')}</span><span>Team Kernels</span></p>
      <h2 class="drawer__title" id="drawer-title">${esc(b.title)}</h2>
      <p class="drawer__line">${esc(b.line)}</p>
      <p class="drawer__text">${esc(b.body)}</p>
      <ul class="drawer__points">${(b.points || []).map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <ul class="drawer__stack" aria-label="Built with">${(b.stack || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p class="drawer__crew"><span class="mono">Built by</span> Rohith Kumar S S, Nithish Raajan N K and Mohamed Navith</p>
      ${b.links ? `<div class="drawer__links">${b.links.map((l) => `<a class="btn-gold" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>` : ''}`;
    drawer.hidden = false;
    lenis && lenis.stop();
    document.documentElement.style.overflow = 'hidden';
    const panel = $('.drawer__panel', drawer);
    panel.scrollTop = 0;
    if (hasGsap && !reduced) {
      gsap.fromTo($('.drawer__scrim', drawer), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.85, ease: 'expo.out' });
      gsap.fromTo($$('.drawer__body > *', drawer), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out', delay: 0.2 });
      const paths = $$('.drawer__emblem svg > *', drawer);
      drawPaths(paths, 1.4, 0.3);
    }
    panel.focus({ preventScroll: true });
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    const done = () => {
      drawer.hidden = true;
      document.documentElement.style.overflow = '';
      lenis && lenis.start();
      lastFocus && lastFocus.focus({ preventScroll: true });
    };
    if (hasGsap && !reduced) {
      gsap.to($('.drawer__scrim', drawer), { autoAlpha: 0, duration: 0.4 });
      gsap.to($('.drawer__panel', drawer), { xPercent: 100, duration: 0.55, ease: 'expo.in', onComplete: done });
    } else done();
  }
  function drawerSetup() {
    $('[data-render="builds"]').addEventListener('click', (e) => {
      const card = e.target.closest('button.build');
      if (card) openDrawer(card.dataset.id);
    });
    drawer.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeDrawer(); });
    document.addEventListener('keydown', (e) => {
      if (drawer.hidden) return;
      if (e.key === 'Escape') closeDrawer();
      if (e.key === 'Tab') {
        const f = $$('a, button, [tabindex]:not([tabindex="-1"])', drawer).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------
     8. Experience accordion
  ------------------------------------------------------------------ */
  function accordion() {
    $$('.log__row').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.log__item');
        const detail = $('.log__detail', item);
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (hasGsap && !reduced) {
          gsap.to(detail, { height: open ? 'auto' : 0, duration: 0.6, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
          if (open) gsap.fromTo($$('li', detail), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.5, delay: 0.1 });
        } else {
          detail.style.height = open ? 'auto' : '0';
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function drawPaths(paths, duration = 1.2, delay = 0) {
    paths.forEach((p) => {
      if (typeof p.getTotalLength !== 'function') return;
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
        strokeDashoffset: 0, duration, delay, ease: 'power2.inOut',
        onComplete: () => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }
      });
    });
  }
  function splitReveal(el, opts = {}) {
    if (!hasSplit) {
      return gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: opts.trigger === false ? undefined : { trigger: el, start: 'top 88%' } });
    }
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110, duration: 1.15, stagger: 0.09, ease: 'expo.out', delay: opts.delay || 0,
          scrollTrigger: opts.trigger === false ? undefined : { trigger: el, start: opts.start || 'top 88%' }
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     9. Loader → hero intro (the portrait assembles from its point cloud)
  ------------------------------------------------------------------ */
  function intro(twin) {
    const loader = $('.loader');
    const count = $('.loader__count');
    const finish = () => {
      document.body.classList.remove('is-loading');
      lenis && lenis.start();
      ScrollTrigger.refresh();
    };

    if (reduced || !hasGsap) {
      loader && loader.remove();
      document.body.classList.remove('is-loading');
      return;
    }

    const prog = { v: 0 };
    const marks = $$('.loader__mark path');
    drawPaths(marks, 1.3, 0.1);
    const counting = gsap.to(prog, { v: 86, duration: 1.6, ease: 'power2.out', onUpdate: () => (count.textContent = Math.round(prog.v)) });
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const minTime = new Promise((r) => setTimeout(r, 1500));

    Promise.all([fontsReady, twin.ready.catch(() => false), minTime]).then(([, twinOk]) => {
      counting.kill();
      twin.measure();
      const face = twin.face();
      const L = twin.lens;
      gsap.timeline({ onComplete: finish })
        .to(prog, { v: 100, duration: 0.45, ease: 'power1.inOut', onUpdate: () => (count.textContent = Math.round(prog.v)) })
        .to('.loader__meta, .loader__mark', { y: -30, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, '+=0.1')
        .add(() => { if (twinOk) { L.x = face.x; L.y = face.y; L.r = face.size * 0.62; L.o = 0; twin.start(); } })
        .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'expo.inOut' }, '-=0.15')
        .from('.hero__portrait', { yPercent: 14, scale: 1.04, duration: 1.6, ease: 'expo.out' }, '-=0.75')
        .to(L, { r: 0, duration: 1.5, ease: 'power3.inOut' }, '-=0.6')
        .from('.header > *', { y: -40, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, '-=1.2')
        .from('.hero__kicker > *', { yPercent: 60, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, '-=1')
        .from('.hero__card', { x: -40, autoAlpha: 0, duration: 1, ease: 'expo.out' }, '-=0.9')
        .from('.hero__hint, .hero__scroll', { autoAlpha: 0, duration: 0.8 }, '-=0.6')
        .add(() => { loader.remove(); heroLens(twin, twinOk); });
    });
  }

  /* After the intro: the lens follows the pointer (or roams on touch screens) */
  function heroLens(twin, ok) {
    if (!ok) return;
    const hero = $('.hero'), stage = $('.hero__stage');
    const L = twin.lens;
    const xTo = gsap.quickTo(L, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(L, 'y', { duration: 0.35, ease: 'power3' });
    const R = () => Math.max(70, Math.min(130, stage.offsetHeight * 0.14));
    let roam = null, over = false;

    const inside = (e) => {
      const r = stage.getBoundingClientRect();
      return e.clientX > r.left - 30 && e.clientX < r.right + 30 && e.clientY > r.top + r.height * 0.04 && e.clientY < r.bottom;
    };
    const show = () => gsap.to(L, { r: R(), o: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
    const hide = () => gsap.to(L, { r: 0, o: 0, duration: 0.45, ease: 'power3.in', overwrite: 'auto' });

    function startRoam() {
      if (roam) return;
      const f = twin.face();
      L.x = f.x; L.y = f.y;
      show();
      let t = 0;
      roam = () => {
        t += 0.0085;
        const ff = twin.face();
        xTo(ff.x + Math.sin(t * 1.3) * ff.size * 0.2);
        yTo(ff.y + Math.sin(t * 0.9 + 1) * ff.size * 0.22);
      };
      gsap.ticker.add(roam);
    }
    function stopRoam() { if (roam) { gsap.ticker.remove(roam); roam = null; } }

    hero.addEventListener('pointermove', (e) => {
      const hr = hero.getBoundingClientRect();
      const now = inside(e);
      if (e.pointerType !== 'mouse') stopRoam();
      xTo(e.clientX - hr.left); yTo(e.clientY - hr.top);
      if (now && !over) { over = true; if (L.r < 1) { L.x = e.clientX - hr.left; L.y = e.clientY - hr.top; } show(); }
      if (!now && over) { over = false; hide(); }
    });
    hero.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { over = false; hide(); } });

    if (!finePointer) {
      startRoam();
      hero.addEventListener('pointerup', () => setTimeout(() => { over = false; startRoam(); }, 1600));
    }
  }

  /* ------------------------------------------------------------------
     10. Scroll choreography
  ------------------------------------------------------------------ */
  function scenes() {
    const mm = gsap.matchMedia();

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 861px)', wide: '(min-width: 1101px)' }, (ctx) => {
      const { motion, desktop, wide } = ctx.conditions;
      if (!motion) {
        // still let the header theme follow sections
        gsap.set('.manifesto__text .word', { clearProps: 'color' });
        return;
      }

      /* Hero: portrait drifts and fades as the statement slides over */
      gsap.to('.hero__stage', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__kicker, .hero__card', { y: -80, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '20% top', end: '70% top', scrub: true } });

      /* Statement: pinned; rows slide, frame opens, signature writes itself */
      const sigs = $$('.signature .sig');
      sigs.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = `${l} ${l + 60}`; p.style.strokeDashoffset = l + 30; });
      const st = gsap.timeline({ scrollTrigger: { trigger: '.statement', start: 'top top', end: '+=150%', pin: true, scrub: 0.7 } });
      st.fromTo('.statement__row--serif span', { xPercent: 0 }, { xPercent: -33.333, ease: 'none', duration: 1 }, 0)
        .fromTo('.statement__row--sans span', { xPercent: -33.333 }, { xPercent: 0, ease: 'none', duration: 1 }, 0)
        .fromTo('.statement__frame', { scale: 0.55, clipPath: 'inset(14% 14% 14% 14% round 3px)' }, { scale: 1, clipPath: 'inset(0% 0% 0% 0% round 3px)', ease: 'power2.out', duration: 0.55 }, 0)
        .fromTo('.statement__frame img', { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1 }, 0);
      sigs.forEach((p, i) => st.to(p, { strokeDashoffset: 0, ease: 'none', duration: i === 0 ? 0.42 : 0.08 }, 0.35 + (i === 0 ? 0 : 0.36 + i * 0.06)));
      st.to('.signature', { scale: 1.06, duration: 0.2 }, 0.8);

      /* Manifesto: words brighten as you read */
      const mText = $('.manifesto__text');
      if (hasSplit) {
        const split = SplitText.create(mText, { type: 'words', wordsClass: 'word' });
        gsap.to(split.words, {
          color: (i, el) => (el.closest('em') ? '#E6B13E' : '#F3ECDC'),
          stagger: 0.12, ease: 'none',
          scrollTrigger: { trigger: mText, start: 'top 78%', end: 'bottom 45%', scrub: true }
        });
      }
      gsap.from('.emblem', { scale: 0.4, autoAlpha: 0, rotate: -90, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.manifesto', start: 'top 70%' } });

      /* Gallery: background warms from ink to ivory; photos drift at their own speeds */
      const gal = $('.gallery');
      gsap.timeline({
        scrollTrigger: {
          trigger: gal, start: 'top -15%', end: 'bottom 70%', scrub: true,
          onUpdate: (self) => { gal.classList.toggle('is-warm', self.progress > 0.55); syncTheme(); }
        }
      })
        .to(gal, { backgroundColor: '#5C4527', duration: 1, ease: 'none' })
        .to(gal, { backgroundColor: '#F3ECDC', color: '#14110C', duration: 1, ease: 'none' });

      $$('.g-item img').forEach((img) => {
        gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.25 }, {
          clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: img, start: 'top 92%' }
        });
      });
      $$('.g-quote').forEach((q) => gsap.from(q.children, { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: q, start: 'top 85%' } }));
      if (desktop) {
        $$('.g-item[data-speed]').forEach((el) => {
          gsap.to(el, { y: () => -parseFloat(el.dataset.speed) * window.innerHeight, ease: 'none', scrollTrigger: { trigger: gal, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        });
      }

      /* Gallery heading + the ivory curtain from Genesis'26 above */
      gsap.fromTo('.gallery__wave', { scaleY: 1 }, { scaleY: 0, ease: 'none', scrollTrigger: { trigger: gal, start: 'top bottom', end: 'top 15%', scrub: true } });
      gsap.from('.gallery__eyebrow', { y: 20, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.gallery__head', start: 'top 80%' } });

      /* Team Kernels: cards deal in, then tilt toward the pointer */
      const crew = $$('.crew__card');
      gsap.from(crew, { y: 120, rotate: (i) => (i - 1) * 6, autoAlpha: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.crew', start: 'top 80%' } });
      gsap.from('.crew__img', { yPercent: 16, duration: 1.6, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.crew', start: 'top 80%' } });
      if (finePointer) {
        crew.forEach((c) => {
          const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' });
          const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
          c.addEventListener('pointermove', (e) => {
            const r = c.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 14); rx((0.5 - py) * 12);
            c.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
            c.style.setProperty('--my', (py * 100).toFixed(1) + '%');
          });
          c.addEventListener('pointerleave', () => { rx(0); ry(0); });
        });
      }
      gsap.from('.crew__photo', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.crew__together', start: 'top 80%' } });
      gsap.from('.crew__quote, .crew__wins li', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.crew__together', start: 'top 75%' } });

      /* Seminar */
      gsap.from('.talk__photo', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.talk', start: 'top 75%' } });
      gsap.from('.talk__photo img', { scale: 1.25, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.talk', start: 'top 75%' } });
      gsap.from('.talk__copy > *', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.talk', start: 'top 70%' } });

      /* Culture roles */
      gsap.from('.cult', { x: -60, autoAlpha: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.culture__list', start: 'top 80%' } });
      gsap.from('.culture__photo', { y: 80, rotate: 10, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.culture', start: 'top 70%' } });

      /* Lab / Stage */
      gsap.from('.split__copy > *', { yPercent: 60, autoAlpha: 0, stagger: 0.07, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.split', start: 'top 60%' } });
      gsap.fromTo('.split__panel', { clipPath: 'inset(12% 0% 12% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '.split', start: 'top bottom', end: 'top 25%', scrub: true } });

      /* Section headings */
      $$('.display > span').forEach((d, i) => splitReveal(d, { delay: (i % 2) * 0.08 }));

      /* Experience rows */
      gsap.from('.log__item', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.log__list', start: 'top 85%' } });

      /* Builds: cards rise, alternate columns drift */
      const cards = $$('.build');
      gsap.from(cards, { autoAlpha: 0, scale: 0.9, duration: 1, stagger: { each: 0.05, grid: 'auto', from: 'start' }, ease: 'expo.out', scrollTrigger: { trigger: '.builds__grid', start: 'top 85%' } });
      const cols = wide ? 4 : desktop ? 3 : 2;
      const drift = cards.filter((_, i) => (cols === 3 ? i % 3 === 1 : i % 2 === 1));
      gsap.fromTo(drift, { y: wide ? 90 : 50 }, { y: wide ? -10 : 0, ease: 'none', scrollTrigger: { trigger: '.builds__grid', start: 'top bottom', end: 'bottom top', scrub: true } });
      cards.forEach((c) => c.addEventListener('pointerenter', () => drawPaths($$('.build__emblem svg > :not(.fill)', c), 0.9)));

      /* Stage: the ink curtain lifts into ivory; collage lands; numbers count up */
      gsap.fromTo('.stage__wave', { scaleY: 1 }, { scaleY: 0, ease: 'none', scrollTrigger: { trigger: '.stage', start: 'top bottom', end: 'top 15%', scrub: true } });
      const col = gsap.timeline({ scrollTrigger: { trigger: '.stage__collage', start: 'top 75%' } });
      col.from('.stage__card', { y: 140, rotate: 16, autoAlpha: 0, duration: 1.4, ease: 'expo.out' })
         .from('.stage__cut', { x: -120, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, 0.15)
         .from('.stage__gold', { scale: 0.5, rotate: -28, autoAlpha: 0, duration: 1.3, ease: 'back.out(1.6)' }, 0.35);
      gsap.to('.stage__cut', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.stage__collage', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.stage__eyebrow, .stage__lede, .stage__ctas', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.stage__copy', start: 'top 75%' } });
      $$('.stage__title > span, .talk__title > span, .contact__title > span, .footer__big > span').forEach((t, i) => splitReveal(t, { delay: (i % 3) * 0.06 }));
      $$('.count').forEach((c) => {
        const n = +c.dataset.n, o = { v: 0 };
        c.textContent = '0';
        gsap.to(o, { v: n, duration: 2, ease: 'power3.out', onUpdate: () => (c.textContent = Math.round(o.v)), scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
      });
      gsap.from('.podium', { x: -50, autoAlpha: 0, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.podiums__list', start: 'top 85%' } });

      /* Stack: the scribble writes itself; skill rows slide against each other */
      gsap.fromTo('.stack__scribble', { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% -10% -20% 0%)', ease: 'none', scrollTrigger: { trigger: '.stack', start: 'top 75%', end: 'top 10%', scrub: true } });
      const rows = $$('.stack__row span');
      if (rows[0]) gsap.fromTo(rows[0], { xPercent: 0 }, { xPercent: -33.333, ease: 'none', scrollTrigger: { trigger: '.stack__marquees', start: 'top bottom', end: 'bottom top', scrub: true } });
      if (rows[1]) gsap.fromTo(rows[1], { xPercent: -33.333 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.stack__marquees', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.stack__group', { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.stack__groups', start: 'top 85%' } });

      /* Contact: the photo deck fans open */
      const deck = $$('.deck__card');
      const spread = desktop ? 1 : 0.6;
      gsap.set(deck, { rotate: 0, x: 0, y: 60, autoAlpha: 0 });
      gsap.to(deck, {
        rotate: (i) => (i - 2) * 11 * spread, x: (i) => (i - 2) * 64 * spread, y: (i) => Math.abs(i - 2) * 14,
        autoAlpha: 1, duration: 1.5, stagger: 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: '.deck', start: 'top 80%' }
      });
      deck.forEach((c, i) => {
        c.addEventListener('pointerenter', () => gsap.to(c, { y: -30, scale: 1.06, zIndex: 10, duration: 0.5, ease: 'expo.out' }));
        c.addEventListener('pointerleave', () => gsap.to(c, { y: Math.abs(i - 2) * 14, scale: 1, zIndex: 1, duration: 0.6, ease: 'expo.out' }));
      });
      gsap.from('.contact__note, .contact__mail, .contact__links li', { y: 24, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.contact__note', start: 'top 90%' } });

      /* Footer */
      gsap.from('.footer__cols > *', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 80%' } });
    });
  }

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  render();
  paintContours();
  menuSetup();
  anchors();
  drawerSetup();
  accordion();
  document.body.dataset.ui = 'light';

  if (!hasGsap) {
    $('.loader') && $('.loader').remove();
    document.body.classList.remove('is-loading');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);

  smoothScroll();
  cursor();
  magnetic();
  themeTriggers();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(scenes);

  const twin = Twin.hero($('.hero'));
  if (!reduced) Twin.bust($('.split__cloud'), 'assets/img/cut-portrait.webp');
  intro(twin);
  if (reduced) twin.ready.then((ok) => ok && heroLens(twin, ok));

  window.addEventListener('load', () => ScrollTrigger.refresh());
  // lazy images can still change heights after load: re-measure (debounced) as they arrive
  let refreshT;
  $$('img[loading="lazy"]').forEach((img) => img.addEventListener('load', () => {
    clearTimeout(refreshT);
    refreshT = setTimeout(() => ScrollTrigger.refresh(), 200);
  }, { once: true }));
})();
