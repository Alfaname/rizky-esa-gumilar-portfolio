/* =========================================================================
   Signature experience — Decision Compression.

   A scroll-scrubbed canvas: scattered source records are validated, resolved
   into a management structure, muted down to the few that carry signal, and
   finally compressed into one priority with options to act on.

   Nothing here is decorative: every particle is a record, every phase is a
   step the information actually goes through.
   ========================================================================= */
(function (global) {
  'use strict';

  var STEPS = [
    { t: 'compress.s1.t', b: 'compress.s1.b' },
    { t: 'compress.s2.t', b: 'compress.s2.b' },
    { t: 'compress.s3.t', b: 'compress.s3.b' },
    { t: 'compress.s4.t', b: 'compress.s4.b' },
    { t: 'compress.s5.t', b: 'compress.s5.b' },
  ];

  var SOURCES = [
    { id: 'Marketplace', en: 'Marketplace' },
    { id: 'Mutasi bank', en: 'Bank movement' },
    { id: 'Biaya proyek', en: 'Project cost' },
    { id: 'Tagihan', en: 'Billing' },
    { id: 'Piutang', en: 'Receivables' },
  ];
  var COLUMNS = [
    { id: 'Profitabilitas', en: 'Profitability' },
    { id: 'Kas', en: 'Cash' },
    { id: 'Piutang', en: 'Receivables' },
    { id: 'Proyek', en: 'Project' },
    { id: 'Eksepsi', en: 'Exception' },
  ];
  var SERIES = ['#bb862b', '#5c8fdb', '#d65e33', '#1fa377', '#e3b15c'];
  var MUTED = '#2f3138';

  var canvas, ctx, stage, W = 0, H = 0, dpr = 1;
  var particles = [];
  var progress = 0;
  var target = 0;
  var raf = null;
  var lastPhase = -1;
  var reduced = false;

  function rnd(seed) {
    // deterministic pseudo-random so the composition is stable across reloads
    var x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function L(o) {
    return o[global.I18N.lang] !== undefined ? o[global.I18N.lang] : o.id;
  }

  function priorityBox() {
    var bw = Math.min(430, Math.max(260, W * 0.42));
    var bh = Math.min(150, Math.max(110, H * 0.26));
    return { x: (W - bw) / 2, y: H * 0.32, w: bw, h: bh };
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function layout() {
    var count = W < 640 ? 260 : W < 1000 ? 420 : 600;
    particles = [];
    var cols = 5;
    var colW = W / cols;
    var perCol = Math.ceil(count / cols);
    var stackCols = 4; // dots across a management column, so a stack reads as a bar
    var stackRows = Math.ceil(perCol / stackCols);
    var rowGap = Math.min(6.5, (H * 0.6) / stackRows);
    var baseline = H * 0.88;
    var gridCols = Math.max(10, Math.round(W / 44));
    var gridRows = Math.ceil(count / gridCols);
    var gW = Math.min(W * 0.9, gridCols * 36);
    var gH = Math.min(H * 0.68, gridRows * 20);

    // A record's source does not decide which management view it lands in:
    // every view is fed by several sources, so the columns are mixed.
    var assign = [];
    var cursor = [0, 0, 0, 0, 0];
    for (var a = 0; a < count; a++) assign.push(Math.min(4, Math.floor(rnd(a * 17.3) * 5)));

    for (var i = 0; i < count; i++) {
      var g = i % cols;
      var idx = Math.floor(i / cols);
      var col2 = assign[i];
      var k = cursor[col2]++;

      // P0 — scattered around five source clusters
      var p0 = {
        x: colW * (g + 0.5) + (rnd(i * 1.7) - 0.5) * colW * 0.82,
        y: H * (0.1 + rnd(i * 2.3) * 0.82),
      };

      // P1 — validation lattice
      var gc = i % gridCols;
      var gr = Math.floor(i / gridCols);
      var p1 = {
        x: (W - gW) / 2 + (gc + 0.5) * (gW / gridCols),
        y: (H - gH) / 2 + (gr + 0.5) * (gH / Math.max(1, gridRows)),
      };

      // P2 — resolved into five management columns
      var sc = k % stackCols;
      var sr = Math.floor(k / stackCols);
      var p2 = {
        x: colW * (col2 + 0.5) + (sc - (stackCols - 1) / 2) * 7,
        y: baseline - sr * rowGap,
      };

      // Signal: the few records that can actually change a decision. They
      // come out of the exception view — the thing that moved.
      var signal = col2 === 4 && rnd(i * 7.3) > 0.72;

      // P4 — signal compresses into the priority card; the rest settles below
      var box = priorityBox();
      var p4 = signal
        ? {
            x: box.x + 22 + rnd(i * 9.1) * (box.w - 44),
            y: box.y + 30 + rnd(i * 11.3) * (box.h - 52),
          }
        : { x: colW * (col2 + 0.5) + (sc - (stackCols - 1) / 2) * 7, y: baseline + 4 - (sr % 4) * 4 };

      particles.push({
        g: g,
        signal: signal,
        r: 1.4 + rnd(i * 13.7) * 1.1,
        p: [p0, p1, p2, p2, p4],
        seed: i,
      });
    }
  }

  function resize() {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    W = Math.max(320, rect.width);
    H = Math.max(240, rect.height);
    dpr = Math.min(2, global.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
    render();
  }

  function phaseOf(p) {
    return clamp(Math.floor(p * 5), 0, 4);
  }

  function drawLabels(p) {
    var phase = phaseOf(p);
    ctx.font = '500 10px PlexMono, ui-monospace, monospace';
    ctx.textAlign = 'center';
    var colW = W / 5;

    // source labels fade out after phase 0
    var aSrc = clamp(1 - (p - 0.12) / 0.1, 0, 1);
    if (aSrc > 0.01) {
      ctx.fillStyle = 'rgba(133,130,122,' + aSrc + ')';
      SOURCES.forEach(function (s, i) {
        ctx.fillText(L(s).toUpperCase(), colW * (i + 0.5), H - 8);
      });
    }

    // management columns appear from phase 2
    var aCol = clamp((p - 0.42) / 0.1, 0, 1) * clamp(1 - (p - 0.86) / 0.08, 0, 1);
    if (aCol > 0.01) {
      COLUMNS.forEach(function (s, i) {
        var isSignal = i === 4;
        ctx.fillStyle = isSignal && p > 0.62 ? 'rgba(227,177,92,' + aCol + ')' : 'rgba(133,130,122,' + aCol + ')';
        ctx.fillText(L(s).toUpperCase(), colW * (i + 0.5), H - 8);
      });
    }

    // validation ticks in phase 1
    var aVal = clamp((p - 0.2) / 0.06, 0, 1) * clamp(1 - (p - 0.36) / 0.06, 0, 1);
    if (aVal > 0.01) {
      ctx.fillStyle = 'rgba(133,130,122,' + aVal + ')';
      var steps = ['CONNECT', 'VALIDATE', 'RECONCILE', 'STRUCTURE'];
      steps.forEach(function (s, i) {
        ctx.fillText(s, (W / 4) * (i + 0.5), 16);
      });
    }

    // final priority card + the options it puts on the table
    var aFin = clamp((p - 0.82) / 0.09, 0, 1);
    if (aFin > 0.01) {
      var box = priorityBox();
      ctx.strokeStyle = 'rgba(187,134,43,' + aFin * 0.95 + ')';
      ctx.lineWidth = 1;
      roundRect(box.x, box.y, box.w, box.h, 3);
      ctx.stroke();
      ctx.fillStyle = 'rgba(227,177,92,' + aFin + ')';
      ctx.font = '500 10px PlexMono, ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(L({ id: 'PRIORITAS MINGGU INI', en: 'THIS WEEK’S PRIORITY' }), box.x + 16, box.y + 22);
      var signalCount = particles.filter(function (q) {
        return q.signal;
      }).length;
      ctx.fillStyle = 'rgba(133,130,122,' + aFin + ')';
      ctx.fillText(
        signalCount + L({ id: ' CATATAN YANG MENENTUKAN', en: ' RECORDS THAT DECIDE IT' }),
        box.x + 16,
        box.y + box.h - 12
      );

      var aOpt = clamp((p - 0.9) / 0.08, 0, 1);
      if (aOpt > 0.01) {
        var opts = [
          { id: 'Prioritaskan', en: 'Prioritise' },
          { id: 'Selidiki', en: 'Investigate' },
          { id: 'Tahan', en: 'Hold' },
        ];
        ctx.font = '400 10px PlexMono, ui-monospace, monospace';
        var cx2 = box.x + 16;
        var cy2 = box.y + box.h + 30;
        opts.forEach(function (o) {
          var label = L(o).toUpperCase();
          var tw = ctx.measureText(label).width + 20;
          ctx.strokeStyle = 'rgba(187,134,43,' + aOpt * 0.8 + ')';
          roundRect(cx2, cy2 - 13, tw, 22, 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(227,177,92,' + aOpt + ')';
          ctx.fillText(label, cx2 + 10, cy2 + 2);
          cx2 += tw + 8;
        });
      }
      ctx.textAlign = 'center';
    }
  }

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    var p = progress;
    // 5 anchor states → 4 transitions, finishing slightly early so the final
    // state is held rather than still arriving at the end of the stage.
    var seg = clamp((p / 0.9) * 4, 0, 4);
    var i0 = clamp(Math.floor(seg), 0, 3);
    var t = ease(clamp(seg - i0, 0, 1));

    // hairline lattice during validation
    var aVal = clamp((p - 0.18) / 0.08, 0, 1) * clamp(1 - (p - 0.4) / 0.08, 0, 1);
    if (aVal > 0.01) {
      ctx.strokeStyle = 'rgba(47,42,33,' + aVal * 0.9 + ')';
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 4; gx++) {
        var x = (W / 4) * gx;
        ctx.beginPath();
        ctx.moveTo(x, H * 0.16);
        ctx.lineTo(x, H * 0.86);
        ctx.stroke();
      }
    }

    particles.forEach(function (pt) {
      var a = pt.p[i0];
      var b = pt.p[i0 + 1];
      var x = lerp(a.x, b.x, t);
      var y = lerp(a.y, b.y, t);

      var color = SERIES[pt.g];
      var alpha = 0.92;
      var r = pt.r;

      if (p > 0.62) {
        // signal phase — everything that cannot change a decision goes quiet
        var mute = clamp((p - 0.62) / 0.1, 0, 1);
        if (!pt.signal) {
          color = MUTED;
          alpha = lerp(0.9, 0.35, mute);
          r = lerp(pt.r, pt.r * 0.75, mute);
        } else {
          color = '#e3b15c';
          r = lerp(pt.r, pt.r * 1.5, mute);
        }
      }
      if (p > 0.86 && !pt.signal) alpha *= clamp(1 - (p - 0.86) / 0.1, 0.12, 1);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    drawLabels(p);
  }

  function tick() {
    var diff = target - progress;
    if (Math.abs(diff) < 0.0008) {
      progress = target;
      render();
      raf = null;
      return;
    }
    progress += diff * 0.14;
    render();
    raf = requestAnimationFrame(tick);
  }

  function setStep(phase) {
    if (phase === lastPhase) return;
    lastPhase = phase;
    var titleEl = document.getElementById('compressTitle');
    var bodyEl = document.getElementById('compressBody');
    if (titleEl) {
      titleEl.setAttribute('data-i18n', STEPS[phase].t);
      titleEl.textContent = global.I18N.t(STEPS[phase].t);
    }
    if (bodyEl) {
      bodyEl.setAttribute('data-i18n', STEPS[phase].b);
      bodyEl.textContent = global.I18N.t(STEPS[phase].b);
    }
    var ticks = document.getElementById('compressTicks');
    if (ticks) {
      Array.prototype.forEach.call(ticks.children, function (el, i) {
        el.classList.toggle('is-done', i < phase);
        el.classList.toggle('is-active', i === phase);
      });
    }
  }

  function onScroll() {
    if (!stage) return;
    var rect = stage.getBoundingClientRect();
    var total = rect.height - global.innerHeight;
    var p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
    target = p;
    setStep(phaseOf(p));
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function init() {
    reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    stage = document.getElementById('compressStage');
    canvas = document.getElementById('compressCanvas');
    if (!stage || !canvas || reduced) {
      setStep(0);
      return;
    }
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    resize();
    onScroll();
    global.addEventListener('scroll', onScroll, { passive: true });
    var rz;
    global.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(resize, 160);
    });
    global.I18N.onChange(function () {
      lastPhase = -1;
      setStep(phaseOf(progress));
      render();
    });
  }

  global.Compression = { init: init };
})(window);
