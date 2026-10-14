/* Digital twin: the portrait re-drawn as a gold point cloud.
   - Twin.hero(): a lens over the hero portrait that reveals the "scan".
   - Twin.bust(): a slowly turning 3-D point-cloud bust for the Lab panel. */

const Twin = (() => {
  const GOLD = [255, 199, 64];

  // Read the cut-out's pixels once and turn them into points with a guessed depth.
  function samplePortrait(img, step) {
    const w = img.naturalWidth, h = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const cx = c.getContext('2d', { willReadFrequently: true });
    cx.drawImage(img, 0, 0);
    const data = cx.getImageData(0, 0, w, h).data;   // throws on file:// (tainted) — callers catch
    const xs = [], ys = [], lum = [], dep = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4;
        if (data[i + 3] < 140) continue;
        const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        // head ≈ ellipsoid, shoulders ≈ a wide cylinder
        const hx = (x - w * 0.47) / (w * 0.21), hy = (y - h * 0.36) / (h * 0.3);
        const head = 1 - hx * hx - hy * hy;
        const tx = (x - w * 0.5) / (w * 0.5);
        const torso = y > h * 0.62 ? 1 - tx * tx : 0;
        const z = Math.max(head > 0 ? Math.sqrt(head) : 0, torso > 0 ? Math.sqrt(torso) * 0.55 : 0);
        xs.push(x); ys.push(y); lum.push(l); dep.push(z);
      }
    }
    return { w, h, n: xs.length, xs: new Float32Array(xs), ys: new Float32Array(ys), lum: new Float32Array(lum), dep: new Float32Array(dep) };
  }

  function whenLoaded(img) {
    return img.complete && img.naturalWidth ? Promise.resolve() :
      new Promise((res, rej) => { img.addEventListener('load', res, { once: true }); img.addEventListener('error', rej, { once: true }); });
  }

  /* ---------------- Hero lens ---------------- */
  function hero(heroEl) {
    const img = heroEl.querySelector('.hero__portrait');
    const cvs = heroEl.querySelector('.hero__twin');
    const ctx = cvs.getContext('2d');
    const lens = { x: -999, y: -999, r: 0, o: 0 };
    let pts = null, dpr = 1, W = 0, H = 0, ox = 0, oy = 0, k = 1, visible = true, raf = 0, t0 = performance.now();

    function measure() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = heroEl.clientWidth; H = heroEl.clientHeight;
      cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
      const hr = heroEl.getBoundingClientRect(), sr = img.getBoundingClientRect();
      ox = sr.left - hr.left; oy = sr.top - hr.top;
      k = sr.width / (img.naturalWidth || 650);
    }

    // Where the face sits, in hero coordinates (used for the intro and idle roaming)
    function face() {
      return { x: ox + (img.naturalWidth || 650) * 0.47 * k, y: oy + (img.naturalHeight || 680) * 0.38 * k, size: (img.naturalHeight || 680) * k };
    }

    function draw(now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (lens.r < 1 || !pts) return;
      const { x: lx, y: ly, r } = lens;

      // dark disc + calibration grid
      ctx.fillStyle = '#14110C';
      ctx.beginPath(); ctx.arc(lx, ly, r + 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(205,189,156,0.10)'; ctx.lineWidth = 1;
      const g = 22, gx0 = Math.floor((lx - r) / g) * g, gy0 = Math.floor((ly - r) / g) * g;
      ctx.beginPath();
      for (let x = gx0; x <= lx + r; x += g) { ctx.moveTo(x + .5, ly - r); ctx.lineTo(x + .5, ly + r); }
      for (let y = gy0; y <= ly + r; y += g) { ctx.moveTo(lx - r, y + .5); ctx.lineTo(lx + r, y + .5); }
      ctx.stroke();

      // points (bucketed by brightness to keep fillStyle changes low)
      const f = face();
      const px = (lx - f.x) * 0.05, py = (ly - f.y) * 0.035;
      const unit = k * pts.step;
      const buckets = [[], [], [], []];
      const r2 = (r + 6) * (r + 6);
      for (let i = 0; i < pts.n; i++) {
        const d = pts.dep[i] - 0.45;
        const sx = ox + pts.xs[i] * k - px * d, sy = oy + pts.ys[i] * k - py * d;
        const dx = sx - lx, dy = sy - ly;
        if (dx * dx + dy * dy > r2) continue;
        const l = pts.lum[i];
        buckets[l < .25 ? 0 : l < .5 ? 1 : l < .75 ? 2 : 3].push(sx, sy, l);
      }
      const alphas = [0.42, 0.62, 0.82, 1];
      for (let b = 0; b < 4; b++) {
        const a = buckets[b];
        ctx.fillStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${alphas[b]})`;
        for (let j = 0; j < a.length; j += 3) {
          const s = Math.max(0.9, (0.35 + a[j + 2] * 0.75) * unit * 0.62);
          ctx.fillRect(a[j] - s / 2, a[j + 1] - s / 2, s, s);
        }
      }

      // scan line sweeping down the lens
      const period = 2400, p = ((now - t0) % period) / period;
      const sy = ly - r + p * r * 2;
      const grad = ctx.createLinearGradient(0, sy - 26, 0, sy + 2);
      grad.addColorStop(0, 'rgba(255,199,64,0)');
      grad.addColorStop(1, 'rgba(255,199,64,0.32)');
      ctx.fillStyle = grad; ctx.fillRect(lx - r, sy - 26, r * 2, 28);
      ctx.fillStyle = 'rgba(255,214,110,0.9)'; ctx.fillRect(lx - r, sy, r * 2, 1.2);
    }

    function apply() {
      heroEl.style.setProperty('--lx', lens.x.toFixed(1) + 'px');
      heroEl.style.setProperty('--ly', lens.y.toFixed(1) + 'px');
      heroEl.style.setProperty('--lr', Math.max(0, lens.r).toFixed(1) + 'px');
      heroEl.style.setProperty('--lo', lens.o.toFixed(3));
    }

    function loop(now) {
      raf = 0;
      if (!visible) return;
      apply();
      draw(now);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && visible) raf = requestAnimationFrame(loop); }

    const ready = whenLoaded(img).then(() => {
      measure();
      const step = window.matchMedia('(max-width: 860px)').matches ? 6 : 4;
      try { pts = samplePortrait(img, step); pts.step = step; }
      catch (e) { console.warn('Digital twin needs the site served over http(s):', e.message); pts = null; }
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(heroEl);
      let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 120); });
      start();
      return !!pts;
    });

    return { lens, face, ready, measure, start };
  }

  /* ---------------- Turning bust ---------------- */
  function bust(canvas, src) {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = src;
    let pts = null, dpr = 1, W = 0, H = 0, visible = false, raf = 0, mx = 0, tilt = 0;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }

    function frame(now) {
      raf = 0;
      if (!visible || !pts) return;
      tilt += (mx - tilt) * 0.05;
      const a = Math.sin(now / 2600) * 0.55 + tilt * 0.6;
      const ca = Math.cos(a), sa = Math.sin(a);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const scale = Math.min(W / pts.w, H / pts.h) * 0.78;
      const cx = W / 2, cy = H * 0.47, depth = pts.w * 0.42, f = pts.w * 2.4;
      const sweep = ((now / 3200) % 1) * pts.h;
      for (let i = 0; i < pts.n; i++) {
        const x = pts.xs[i] - pts.w / 2, y = pts.ys[i] - pts.h / 2, z = pts.dep[i] * depth;
        const rx = x * ca + z * sa, rz = -x * sa + z * ca;
        const p = f / (f - rz);
        const sx = cx + rx * p * scale, sy = cy + y * p * scale;
        const l = pts.lum[i];
        const near = Math.abs(pts.ys[i] - sweep) < 6 ? 0.5 : 0;
        const al = Math.min(1, 0.18 + l * 0.7 + (rz / depth) * 0.25 + near);
        ctx.fillStyle = `rgba(255,${near ? 222 : 199},${near ? 140 : 64},${al.toFixed(2)})`;
        const s = (0.7 + l * 1.4) * p;
        ctx.fillRect(sx, sy, s, s);
      }
      raf = requestAnimationFrame(frame);
    }

    whenLoaded(img).then(() => {
      try { pts = samplePortrait(img, window.matchMedia('(max-width: 860px)').matches ? 7 : 5); }
      catch (e) { return; }
      size();
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      }).observe(canvas);
      let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 120); });
      canvas.parentElement.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      });
      canvas.parentElement.addEventListener('pointerleave', () => { mx = 0; });
    }).catch(() => {});
  }

  return { hero, bust };
})();
