/* =========================================================================
   Page wiring: language, navigation, scroll rule, reveals, hero parallax and
   the scroll-scrubbed "How I Work" sequence.
   ========================================================================= */
(function (global) {
  'use strict';

  var T = global.I18N;
  var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel) {
    return document.querySelector(sel);
  }
  function L(o) {
    return o[T.lang] !== undefined ? o[T.lang] : o.id;
  }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = txt;
    return n;
  }

  /* ------------------------- how I work sequence ------------------------- */
  var BEATS = [
    {
      t: { id: 'Pertanyaan manajemen', en: 'The management question' },
      d: {
        id: 'Semua dimulai dari satu pertanyaan yang harus dijawab minggu ini — bukan dari data yang kebetulan tersedia.',
        en: 'It starts from one question that has to be answered this week — not from whatever data happens to exist.',
      },
    },
    {
      t: { id: 'Sumber informasi', en: 'Information sources' },
      d: {
        id: 'Sumber yang relevan dikumpulkan dan diperiksa: mana yang bisa dipercaya, mana yang harus dikonfirmasi.',
        en: 'The relevant sources are gathered and checked: what can be trusted, what has to be confirmed.',
      },
    },
    {
      t: { id: 'Analisis & konteks keuangan', en: 'Financial analysis & context' },
      d: {
        id: 'Angka disusun ke dalam struktur akuntansi dan dibandingkan dengan periode, anggaran, atau pola sebelumnya.',
        en: 'The numbers are placed in accounting structure and compared against period, budget or prior pattern.',
      },
    },
    {
      t: { id: 'Sinyal', en: 'Signal' },
      d: {
        id: 'Yang tidak mengubah keputusan dipadamkan. Yang tersisa dijelaskan: kenapa bergerak, dan seberapa penting.',
        en: 'What cannot change a decision is muted. What remains gets explained: why it moved, and how much it matters.',
      },
    },
    {
      t: { id: 'Laporan siap keputusan', en: 'A decision-ready report' },
      d: {
        id: 'Satu tampilan dengan prioritas, opsi tindakan, dan jejak angka yang bisa ditelusuri kembali.',
        en: 'One view with the priority, the options to act, and a trail back to the numbers behind it.',
      },
    },
  ];

  var METHOD_SOURCES = [
    { id: 'Marketplace', en: 'Marketplace' },
    { id: 'Bank', en: 'Bank' },
    { id: 'Proyek', en: 'Project' },
    { id: 'Tagihan', en: 'Billing' },
    { id: 'Piutang', en: 'AR' },
  ];
  var METHOD_STATS = [
    { k: { id: 'Margin', en: 'Margin' }, v: '22,1%', ven: '22.1%' },
    { k: { id: 'Kas', en: 'Cash' }, v: 'Rp 313 jt', ven: 'Rp 313 m' },
    { k: { id: 'Eksepsi', en: 'Exceptions' }, v: '4', ven: '4', flag: true },
  ];
  var METHOD_DECISIONS = [
    { id: 'Prioritaskan', en: 'Prioritise' },
    { id: 'Selidiki', en: 'Investigate' },
    { id: 'Percepat penagihan', en: 'Accelerate collection' },
  ];

  function buildMethod() {
    var beats = document.getElementById('methodBeats');
    if (!beats) return;
    beats.innerHTML = '';
    BEATS.forEach(function (b, i) {
      var li = el('li', 'method__beat' + (i === 0 ? ' is-active' : ''));
      li.appendChild(el('span', 'method__beat-k', '0' + (i + 1)));
      var body = el('div');
      body.appendChild(el('span', 'method__beat-t', L(b.t)));
      body.appendChild(el('p', 'method__beat-d', L(b.d)));
      li.appendChild(body);
      beats.appendChild(li);
    });

    var src = document.getElementById('methodSources');
    if (src) {
      src.innerHTML = '';
      METHOD_SOURCES.forEach(function (s) {
        src.appendChild(el('span', 'method__source', L(s)));
      });
    }
    var chart = document.getElementById('methodChart');
    if (chart) {
      chart.innerHTML = '';
      [0.42, 0.58, 0.36, 0.74, 0.5, 0.66, 0.94].forEach(function (h) {
        var col = el('span', 'method__col');
        col.style.height = Math.round(h * 100) + '%';
        chart.appendChild(col);
      });
    }
    var side = document.getElementById('methodSide');
    if (side) {
      side.innerHTML = '';
      METHOD_STATS.forEach(function (s) {
        var box = el('div', 'method__stat' + (s.flag ? ' is-flag' : ''));
        box.appendChild(el('span', null, L(s.k)));
        box.appendChild(el('b', null, T.lang === 'en' ? s.ven : s.v));
        side.appendChild(box);
      });
    }
    var dec = document.getElementById('methodDecide');
    if (dec) {
      dec.innerHTML = '';
      METHOD_DECISIONS.forEach(function (d) {
        dec.appendChild(el('span', 'matrix__decision', L(d)));
      });
    }
    var stamp = document.getElementById('methodStamp');
    if (stamp) stamp.textContent = T.lang === 'en' ? 'Week 32' : 'Minggu 32';
  }

  function methodScroll() {
    var stage = document.getElementById('methodStage');
    if (!stage) return;
    var rect = stage.getBoundingClientRect();
    var total = rect.height - global.innerHeight;
    var p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    var beat = Math.max(0, Math.min(4, Math.floor(p * 5)));

    var beats = document.getElementById('methodBeats');
    if (beats) {
      Array.prototype.forEach.call(beats.children, function (li, i) {
        li.classList.toggle('is-active', i === beat);
      });
    }
    var portrait = document.getElementById('methodPortrait');
    var report = document.getElementById('methodReport');
    if (portrait) {
      portrait.style.opacity = beat === 0 ? '1' : '0';
      portrait.style.transform = beat === 0 ? 'scale(1)' : 'scale(1.04)';
    }
    if (report) report.classList.toggle('is-on', beat >= 1);

    var sources = document.getElementById('methodSources');
    if (sources) {
      Array.prototype.forEach.call(sources.children, function (s, i) {
        s.classList.toggle('is-on', beat >= 1 && p * 5 - 1 > i * 0.12);
        s.classList.toggle('is-checked', beat >= 2);
      });
    }
    var chart = document.getElementById('methodChart');
    if (chart) {
      Array.prototype.forEach.call(chart.children, function (c, i) {
        c.classList.toggle('is-on', beat >= 2 && p * 5 - 2 > i * 0.09);
        c.classList.toggle('is-signal', beat >= 3 && i === 6);
        c.classList.toggle('is-quiet', beat >= 3 && i !== 6);
      });
    }
    var side = document.getElementById('methodSide');
    if (side) {
      Array.prototype.forEach.call(side.children, function (s, i) {
        s.classList.toggle('is-on', beat >= 3 && p * 5 - 3 > i * 0.14);
      });
    }
    var dec = document.getElementById('methodDecide');
    if (dec) dec.classList.toggle('is-on', beat >= 4);
  }

  /* ------------------------------ nav ------------------------------ */
  function initNav() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      links.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'A') {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var sections = Array.prototype.slice.call(
      document.querySelectorAll('#vision, #compression, #work, #method, #about')
    );
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('#navLinks a[href^="#"]'));
    function mark() {
      var y = global.scrollY + global.innerHeight * 0.34;
      var active = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= y) active = s.id;
      });
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
      });
      if (nav) nav.classList.toggle('is-stuck', global.scrollY > 12);
    }
    return mark;
  }

  /* ---------------------------- reveals ---------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in global) || reduced) {
      items.forEach(function (i) {
        i.classList.add('is-in');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    items.forEach(function (i) {
      io.observe(i);
    });
  }

  /* ---------------------------- scroll ---------------------------- */
  function initScroll(markNav) {
    var rule = document.getElementById('scrollRule');
    var portrait = document.getElementById('heroPortrait');
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var doc = document.documentElement;
        var max = doc.scrollHeight - global.innerHeight;
        if (rule) rule.style.transform = 'scaleX(' + (max > 0 ? global.scrollY / max : 0) + ')';
        if (portrait && !reduced && global.scrollY < global.innerHeight * 1.2) {
          portrait.style.transform = 'translate3d(0,' + global.scrollY * 0.06 + 'px,0)';
        }
        markNav();
        methodScroll();
        ticking = false;
      });
    }
    global.addEventListener('scroll', onScroll, { passive: true });
    global.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ------------------------------ boot ------------------------------ */
  function boot() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    T.init();
    global.CaseStudies.render();
    buildMethod();

    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.addEventListener('click', function () {
        T.set(b.dataset.lang);
      });
    });

    T.onChange(function () {
      global.CaseStudies.render();
      buildMethod();
      methodScroll();
    });

    var markNav = initNav();
    initReveal();
    initScroll(markNav);
    global.Compression.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
