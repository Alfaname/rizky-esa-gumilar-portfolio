/* =========================================================================
   Bilingual copy. Indonesian is the default; English is written as native
   professional copy rather than a literal translation.
   ========================================================================= */
(function (global) {
  'use strict';

  var ID = {
    skip: 'Lewati ke konten utama',
    'nav.vision': 'Visi',
    'nav.compression': 'Kompresi Keputusan',
    'nav.work': 'Karya',
    'nav.method': 'Cara Kerja',
    'nav.about': 'Tentang',
    'nav.menu': 'Buka menu',
    'cta.primary': 'Perjelas Langkah Berikutnya',
    'cta.short': 'Perjelas Langkah',
    'wa.message':
      'Halo Esa, saya melihat portfolio Anda dan ingin berdiskusi mengenai kebutuhan atau tantangan finance di bisnis kami.',

    'hero.sub':
      'Saya membantu manajemen melihat apa yang benar-benar penting dari informasi keuangan dan operasional — lebih cepat, lebih jelas, dan cukup terukur untuk menentukan langkah berikutnya.',
    'hero.secondary': 'Lihat karya nyata',
    'prog.1': 'Kompleksitas',
    'prog.2': 'Kejelasan',
    'prog.3': 'Sinyal',
    'prog.4': 'Prioritas',
    'prog.5': 'Keputusan',

    'vision.eyebrow': 'Visi',
    'vision.statement': 'Informasi keuangan harus mengarahkan keputusan, bukan hanya mencatat hasil.',
    'vision.note':
      'Di banyak bisnis, angka sebenarnya sudah tersedia. Yang hilang adalah jarak antara angka itu dan keputusan: terlalu lama dikumpulkan, terlalu sulit dipercaya, dan terlalu jauh dari pertanyaan yang sedang dihadapi manajemen.',
    'vision.gap1': 'Informasi tersebar di banyak sumber dan format',
    'vision.gap2': 'Validasi manual membuat laporan datang setelah momen keputusan lewat',
    'vision.gap3': 'Laporan menjelaskan masa lalu, tetapi tidak menunjuk apa yang perlu diputuskan',

    'compress.eyebrow': 'Bagaimana informasi menjadi keputusan',
    'compress.payoff':
      'Lebih sedikit waktu mengumpulkan informasi. Lebih banyak waktu memutuskan apa yang penting.',
    'compress.s1.t': 'Informasi datang dari banyak arah.',
    'compress.s1.b':
      'Ekspor marketplace, mutasi bank, biaya proyek, tagihan, piutang. Setiap sumber punya format, waktu, dan tingkat kepercayaan yang berbeda.',
    'compress.s2.t': 'Sebelum dipercaya, harus dibuktikan.',
    'compress.s2.b':
      'Dicocokkan, direkonsiliasi, dan diberi konteks akuntansi. Bagian ini tidak terlihat oleh manajemen — tetapi menentukan apakah angkanya layak dipakai.',
    'compress.s3.t': 'Detail berubah menjadi struktur.',
    'compress.s3.b':
      'Transaksi tersusun menjadi tampilan manajemen: profitabilitas, kas, piutang, kinerja proyek, dan eksepsi.',
    'compress.s4.t': 'Yang tidak mengubah keputusan, dipadamkan.',
    'compress.s4.b':
      'Sebagian besar detail benar tetapi tidak relevan. Yang tersisa adalah sinyal yang benar-benar menggerakkan angka.',
    'compress.s5.t': 'Prioritas terlihat. Keputusan menjadi mungkin.',
    'compress.s5.b':
      'Satu hal yang paling penting minggu ini, dengan pilihan tindakan yang jelas — dan alasan di baliknya tetap bisa ditelusuri.',
    'compress.s1.t2': 'Banyak sumber',
    'compress.s1.b2': 'Ekspor marketplace, mutasi bank, biaya proyek, tagihan, piutang.',
    'compress.s2.t2': 'Divalidasi',
    'compress.s2.b2': 'Dicocokkan, direkonsiliasi, dan diberi konteks akuntansi.',
    'compress.s3.t2': 'Tampilan manajemen',
    'compress.s3.b2': 'Satu struktur yang bisa dibaca bersama oleh manajemen.',
    'compress.s4.t2': 'Sinyal',
    'compress.s4.b2': 'Detail yang tidak mengubah keputusan dipadamkan.',
    'compress.s5.t2': 'Keputusan',
    'compress.s5.b2': 'Prioritas terlihat dan pilihan tindakan menjadi jelas.',

    'matrix.eyebrow': 'Yang tersisa: lima pertanyaan manajemen',
    'matrix.measures': 'Yang diukur',
    'matrix.decisions': 'Keputusan yang didukung',

    'work.eyebrow': 'Karya Terpilih — Output Nyata',
    'work.title': 'Tiga pertanyaan manajemen, tiga cara menjawabnya.',
    'work.note':
      'Setiap studi kasus mengikuti logika laporan yang saya kerjakan: struktur perhitungannya, hubungan antar angkanya, dan pertanyaan yang harus dijawab.',

    'method.eyebrow': 'Cara Kerja',
    'method.title': 'Dari pertanyaan manajemen sampai laporan siap keputusan.',
    'method.quote':
      '“Pertanyaannya jarang ‘berapa angkanya’. Pertanyaannya adalah apa yang harus dilakukan setelah melihat angkanya.”',
    'method.report': 'Tampilan Manajemen',
    'method.openingK': '01 · Pertanyaan manajemen',

    'support.eyebrow': 'Pekerjaan Pendukung',
    'about.eyebrow': 'Tentang',
    'close.label': 'Tiga hal yang saya pegang',
    'about.lede1': 'Finance-minded.',
    'about.lede2': 'Strategy-driven.',
    'about.lede3': 'Technology-enabled.',
    'about.factBase': 'Basis',
    'about.factLang': 'Bahasa kerja',
    'about.themes': 'Ruang lingkup',
    'about.linkedin': 'Riwayat karier lengkap tersedia di',
    'about.p1':
      'Latar belakang saya adalah keuangan dan akuntansi: menyusun laporan, menjaga kontrol, dan memastikan angka bisa dipertanggungjawabkan. Yang membuat saya bertahan di bidang ini bukan laporannya, tetapi momen ketika sebuah angka akhirnya mengubah cara manajemen mengambil langkah.',
    'about.p2':
      'Karena itu saya bekerja dari arah sebaliknya: mulai dari keputusan yang harus diambil, lalu menyusun informasi seperlunya untuk sampai ke sana. Otomasi, dashboard, dan integrasi data hanyalah cara mempersingkat jaraknya — bukan tujuannya.',
    'about.p4':
      'Satu hal yang tidak bisa ditawar: kerahasiaan. Semua contoh di situs ini sengaja disamarkan — logikanya nyata, angkanya tidak. Disiplin yang sama berlaku untuk data siapa pun yang saya pegang.',

    'contact.eyebrow': 'Kontak',
    'contact.title': 'Langkah berikutnya biasanya sudah ada di dalam angkanya.',
    'contact.note':
      'Yang sering hilang bukan datanya, melainkan cara membacanya. Kalau ada keputusan yang sedang ditimbang — margin, kas, piutang, atau kinerja proyek — mari kita lihat apa yang sebenarnya ditunjukkan angkanya.',
    'contact.wa': 'Percakapan langsung',
    'contact.loc': 'Lokasi',

    /* ---- shared UI ---- */
    'ui.table': 'Tabel',
    'ui.chart': 'Grafik',
    'ui.showTable': 'Tampilkan tabel data',
    'ui.showChart': 'Tampilkan grafik',
    'ui.all': 'Semua kanal',
    'ui.keySignal': 'Sinyal Utama',
    'ui.signal': 'Yang terbaca dari laporan',
    'ui.decision': 'Keputusan yang didukung',
    'ui.enabler': 'Bagaimana ini dimungkinkan',
    'ui.anonymised': 'Data disamarkan',
    'ui.of': 'dari',
    'ui.period': 'Periode 14 hari',
    'ui.perPcs': 'per pcs',
  };

  var EN = {
    skip: 'Skip to main content',
    'nav.vision': 'Vision',
    'nav.compression': 'Decision Compression',
    'nav.work': 'Work',
    'nav.method': 'How I Work',
    'nav.about': 'About',
    'nav.menu': 'Open menu',
    'cta.primary': 'Clarify the Next Move',
    'cta.short': 'Clarify the Next Move',
    'wa.message':
      'Hi Esa, I saw your portfolio and would like to discuss a finance need or challenge in our business.',

    'hero.sub':
      'I help management see what actually matters in their financial and operational information — sooner, more clearly, and measured well enough to choose the next move.',
    'hero.secondary': 'See the real work',
    'prog.1': 'Complexity',
    'prog.2': 'Clarity',
    'prog.3': 'Signal',
    'prog.4': 'Priority',
    'prog.5': 'Decision',

    'vision.eyebrow': 'Vision',
    'vision.statement': 'Financial information should guide decisions, not merely record outcomes.',
    'vision.note':
      'In most businesses the numbers already exist. What is missing is the distance between those numbers and the decision: too slow to assemble, too hard to trust, and too far from the question management is actually facing.',
    'vision.gap1': 'Information sits across many sources and formats',
    'vision.gap2': 'Manual validation makes the report arrive after the decision moment has passed',
    'vision.gap3': 'Reports explain the past but never point to what has to be decided',

    'compress.eyebrow': 'How information becomes a decision',
    'compress.payoff': 'Less time gathering information. More time deciding what matters.',
    'compress.s1.t': 'Information arrives from every direction.',
    'compress.s1.b':
      'Marketplace exports, bank movement, project cost, billing, receivables. Each source carries its own format, timing and level of trust.',
    'compress.s2.t': 'Before it can be trusted, it has to be proven.',
    'compress.s2.b':
      'Matched, reconciled and placed in accounting context. Management never sees this layer — but it decides whether the numbers are usable at all.',
    'compress.s3.t': 'Detail becomes structure.',
    'compress.s3.b':
      'Transactions resolve into a management view: profitability, cash, receivables, project performance and exceptions.',
    'compress.s4.t': 'Whatever cannot change a decision goes quiet.',
    'compress.s4.b':
      'Most detail is accurate but irrelevant. What remains is the signal that actually moves the number.',
    'compress.s5.t': 'Priority becomes visible. A decision becomes possible.',
    'compress.s5.b':
      'One thing that matters most this week, with clear options to act on — and the reasoning behind it still traceable.',
    'compress.s1.t2': 'Many sources',
    'compress.s1.b2': 'Marketplace exports, bank movement, project cost, billing, receivables.',
    'compress.s2.t2': 'Validated',
    'compress.s2.b2': 'Matched, reconciled and placed in accounting context.',
    'compress.s3.t2': 'Management view',
    'compress.s3.b2': 'One structure management can read together.',
    'compress.s4.t2': 'Signal',
    'compress.s4.b2': 'Detail that cannot change a decision is muted.',
    'compress.s5.t2': 'Decision',
    'compress.s5.b2': 'Priority is visible and the options to act are clear.',

    'matrix.eyebrow': 'What remains: five management questions',
    'matrix.measures': 'What gets measured',
    'matrix.decisions': 'Decisions it supports',

    'work.eyebrow': 'Selected Work — Real Outputs',
    'work.title': 'Three management questions, three ways to answer them.',
    'work.note':
      'Each case study follows the logic of reporting work I have done: its calculation structure, the relationships between the numbers, and the question that had to be answered.',

    'method.eyebrow': 'How I Work',
    'method.title': 'From a management question to a decision-ready report.',
    'method.quote':
      '“The question is rarely ‘what is the number’. The question is what to do once you have seen it.”',
    'method.report': 'Management View',
    'method.openingK': '01 · The management question',

    'support.eyebrow': 'Supporting Work',
    'about.eyebrow': 'About',
    'close.label': 'Three things I hold to',
    'about.lede1': 'Finance-minded.',
    'about.lede2': 'Strategy-driven.',
    'about.lede3': 'Technology-enabled.',
    'about.factBase': 'Based in',
    'about.factLang': 'Working languages',
    'about.themes': 'Scope',
    'about.linkedin': 'The full career history lives on',
    'about.p1':
      'My background is finance and accounting: building the reports, holding the controls, making sure the numbers stand up. What kept me in this field was never the report itself — it was the moment a number finally changed how management moved.',
    'about.p2':
      'So I work backwards from that: start with the decision that has to be made, then assemble only the information needed to get there. Automation, dashboards and data integration are simply how the distance gets shorter — never the point.',
    'about.p4':
      'One thing is not negotiable: confidentiality. Every example on this site is deliberately anonymised — the logic is real, the numbers are not. The same discipline applies to anyone else’s data I handle.',

    'contact.eyebrow': 'Contact',
    'contact.title': 'The next move is usually already in the numbers.',
    'contact.note':
      'What is missing is rarely the data — it is the reading of it. If there is a decision on the table — margin, cash, receivables or project performance — let us look at what the numbers are actually saying.',
    'contact.wa': 'Direct conversation',
    'contact.loc': 'Location',

    'ui.table': 'Table',
    'ui.chart': 'Chart',
    'ui.showTable': 'Show data table',
    'ui.showChart': 'Show chart',
    'ui.all': 'All channels',
    'ui.keySignal': 'Key Signal',
    'ui.signal': 'What the report shows',
    'ui.decision': 'Decisions it supports',
    'ui.enabler': 'How it was enabled',
    'ui.anonymised': 'Anonymised',
    'ui.of': 'of',
    'ui.period': '14-day period',
    'ui.perPcs': 'per unit',
  };

  var lang = 'id';
  var listeners = [];

  function t(key) {
    var d = lang === 'en' ? EN : ID;
    return d[key] !== undefined ? d[key] : ID[key] !== undefined ? ID[key] : key;
  }

  /* ---------------- number & currency formatting ---------------- */
  function locale() {
    return lang === 'en' ? 'en-US' : 'id-ID';
  }
  function num(v, dp) {
    return Number(v).toLocaleString(locale(), {
      minimumFractionDigits: dp || 0,
      maximumFractionDigits: dp === undefined ? 0 : dp,
    });
  }
  /* Short money, in the scale each audience reads natively. */
  function money(v) {
    var a = Math.abs(v);
    var sign = v < 0 ? '−' : '';
    if (a >= 1e9) return sign + 'Rp ' + num(a / 1e9, 2) + (lang === 'en' ? ' bn' : ' M');
    if (a >= 1e6) return sign + 'Rp ' + num(a / 1e6, a >= 1e8 ? 0 : 1) + (lang === 'en' ? ' m' : ' jt');
    if (a >= 1e3) return sign + 'Rp ' + num(a / 1e3, 0) + (lang === 'en' ? ' k' : ' rb');
    return sign + 'Rp ' + num(a);
  }
  function moneyFull(v) {
    return 'Rp ' + num(Math.round(v));
  }
  function pct(v, dp) {
    return num(v * 100, dp === undefined ? 1 : dp) + '%';
  }

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    var wa = 'https://wa.me/6285117071290?text=' + encodeURIComponent(t('wa.message'));
    ['heroCta', 'contactCta', 'waRow', 'navCta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('href', wa);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    listeners.forEach(function (fn) {
      fn(lang);
    });
  }

  global.I18N = {
    get lang() {
      return lang;
    },
    t: t,
    num: num,
    money: money,
    moneyFull: moneyFull,
    pct: pct,
    locale: locale,
    onChange: function (fn) {
      listeners.push(fn);
    },
    set: function (next) {
      if (next !== 'id' && next !== 'en') return;
      lang = next;
      try {
        localStorage.setItem('reg-lang', next);
      } catch (e) {
        /* storage unavailable — language simply resets on reload */
      }
      apply();
    },
    init: function () {
      var saved = null;
      try {
        saved = localStorage.getItem('reg-lang');
      } catch (e) {
        saved = null;
      }
      // Indonesian is the default. English is only used when the visitor has
      // explicitly chosen it before.
      lang = saved === 'en' ? 'en' : 'id';
      apply();
    },
  };
})(window);
