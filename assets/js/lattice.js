/* Animated header: drifting "atoms" that bond to nearby neighbours.
   No dependencies. Honors prefers-reduced-motion (draws one static frame).
   Tunables are in the CONFIG block. */
(function () {
  var canvas = document.getElementById('lattice');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var CONFIG = {
    density: 1 / 11000,   // atoms per CSS pixel of area
    maxAtoms: 140,
    minAtoms: 40,
    bond: 130,            // max bond length in CSS px
    speed: 0.22,          // drift speed in px per frame
    mouseRadius: 140,     // cursor influence radius
    species: [            // radius, colour, relative abundance
      { r: 2.2, c: '92,196,221',  w: 5 },  // teal
      { r: 3.2, c: '140,170,255', w: 3 },  // blue
      { r: 4.2, c: '214,110,190', w: 1 }   // magenta
    ]
  };

  var atoms = [], W = 0, H = 0, dpr = 1, raf = null;
  var mouse = { x: -1e4, y: -1e4 };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pickSpecies() {
    var total = 0, i;
    for (i = 0; i < CONFIG.species.length; i++) total += CONFIG.species[i].w;
    var t = Math.random() * total;
    for (i = 0; i < CONFIG.species.length; i++) {
      t -= CONFIG.species[i].w;
      if (t <= 0) return CONFIG.species[i];
    }
    return CONFIG.species[0];
  }

  function resize() {
    var rect = canvas.parentNode.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var n = Math.round(Math.min(CONFIG.maxAtoms, Math.max(CONFIG.minAtoms, W * H * CONFIG.density)));
    while (atoms.length < n) {
      var s = pickSpecies(), a = Math.random() * Math.PI * 2;
      atoms.push({ x: Math.random() * W, y: Math.random() * H,
                   vx: Math.cos(a) * CONFIG.speed, vy: Math.sin(a) * CONFIG.speed, s: s });
    }
    atoms.length = n;
  }

  function step() {
    for (var i = 0; i < atoms.length; i++) {
      var p = atoms[i];
      // gentle cursor attraction, so the lattice leans toward the pointer
      var dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
      if (d2 < CONFIG.mouseRadius * CONFIG.mouseRadius && d2 > 1) {
        var d = Math.sqrt(d2), f = (1 - d / CONFIG.mouseRadius) * 0.02;
        p.vx += dx / d * f; p.vy += dy / d * f;
      }
      // damp back toward the base speed
      var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
      var target = CONFIG.speed;
      p.vx += (p.vx / sp * target - p.vx) * 0.02;
      p.vy += (p.vy / sp * target - p.vy) * 0.02;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, d2, bond2 = CONFIG.bond * CONFIG.bond;
    ctx.lineWidth = 1;
    for (i = 0; i < atoms.length; i++) {
      a = atoms[i];
      for (j = i + 1; j < atoms.length; j++) {
        b = atoms[j];
        dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
        if (d2 < bond2) {
          var t = 1 - Math.sqrt(d2) / CONFIG.bond;
          ctx.strokeStyle = 'rgba(190,225,240,' + (t * 0.35).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (i = 0; i < atoms.length; i++) {
      a = atoms[i];
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + a.s.c + ',0.95)';
      ctx.fill();
    }
  }

  function loop() { step(); draw(); raf = requestAnimationFrame(loop); }
  function start() { if (!raf && !reduced) raf = requestAnimationFrame(loop); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  resize();
  draw();
  if (!reduced) {
    // Only animate while the header is on screen and the tab is visible.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(canvas);
    } else { start(); }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    canvas.parentNode.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentNode.addEventListener('pointerleave', function () { mouse.x = mouse.y = -1e4; });
  }
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { resize(); draw(); }, 120); });
})();
