/* =========================================================================
   Decision-intelligence matrix, the three flagship case studies, supporting
   work and the working principles. Copy is carried inline as {id,en} pairs.
   ========================================================================= */
(function (global) {
  'use strict';

  var D = global.PORTFOLIO_DATA;
  var C = global.Charts;
  var T = global.I18N;

  function L(o) {
    if (!o) return '';
    return o[T.lang] !== undefined ? o[T.lang] : o.id;
  }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = txt;
    return n;
  }
  function money(v) {
    return T.money(v);
  }
  function moneyFull(v) {
    return T.moneyFull(v);
  }

  /* ---------------- responsive chart registry ---------------- */
  var registry = [];
  function mountViz(host, build, tableBuild) {
    var entry = { host: host, build: build, table: tableBuild, mode: 'chart' };
    registry.push(entry);
    // Draw on the next frame: the host is still detached at this point, so
    // measuring it now would size every chart to the fallback width.
    requestAnimationFrame(function () {
      draw(entry);
    });
    return entry;
  }
  function draw(entry) {
    var w = Math.max(
      240,
      Math.floor(entry.host.clientWidth || (entry.host.parentNode && entry.host.parentNode.clientWidth) || 320)
    );
    entry.host.innerHTML = '';
    if (entry.mode === 'table' && entry.table) {
      entry.host.appendChild(entry.table());
    } else {
      var out = entry.build(w);
      (Array.isArray(out) ? out : [out]).forEach(function (n) {
        if (n) entry.host.appendChild(n);
      });
    }
  }
  function redrawAll() {
    registry.forEach(draw);
  }
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(redrawAll, 180);
  });

  /* ---------------- viz block shell ---------------- */
  function vizBlock(opts) {
    var wrap = el('div', 'viz');
    var head = el('div', 'viz__head');
    var title = el('span', 'viz__title', L(opts.title));
    head.appendChild(title);
    var right = el('div');
    var note = el('span', 'viz__note', L(opts.note || { id: '', en: '' }));
    right.appendChild(note);
    head.appendChild(right);
    wrap.appendChild(head);

    var body = el('div', 'viz__scroll');
    wrap.appendChild(body);
    var entry = mountViz(body, opts.build, opts.table);

    if (opts.legend) {
      var lg = C.legend(opts.legend());
      wrap.appendChild(lg);
      entry.legendNode = lg;
      entry.legendFn = opts.legend;
    }
    if (opts.table) {
      var btn = el('button', 'chip', T.t('ui.table'));
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      btn.style.marginTop = '0.6rem';
      btn.addEventListener('click', function () {
        entry.mode = entry.mode === 'chart' ? 'table' : 'chart';
        btn.setAttribute('aria-pressed', String(entry.mode === 'table'));
        btn.textContent = entry.mode === 'table' ? T.t('ui.chart') : T.t('ui.table');
        if (entry.legendNode) entry.legendNode.classList.toggle('is-hidden', entry.mode === 'table');
        draw(entry);
      });
      wrap.appendChild(btn);
      entry.toggleBtn = btn;
    }
    entry.titleNode = title;
    entry.noteNode = note;
    entry.titleCopy = opts.title;
    entry.noteCopy = opts.note;
    return wrap;
  }

  function relabel() {
    registry.forEach(function (e) {
      if (e.titleNode && e.titleCopy) e.titleNode.textContent = L(e.titleCopy);
      if (e.noteNode && e.noteCopy) e.noteNode.textContent = L(e.noteCopy);
      if (e.toggleBtn) e.toggleBtn.textContent = e.mode === 'table' ? T.t('ui.chart') : T.t('ui.table');
      if (e.legendNode && e.legendFn) {
        var fresh = C.legend(e.legendFn());
        e.legendNode.replaceWith(fresh);
        e.legendNode = fresh;
      }
    });
  }

  function kpiRow(items) {
    var row = el('div', 'kpis');
    items.forEach(function (k) {
      var cell = el('div', 'kpi' + (k.accent ? ' kpi--accent' : ''));
      cell.appendChild(el('span', 'kpi__label', L(k.label)));
      cell.appendChild(el('div', 'kpi__value', k.value));
      if (k.meta) cell.appendChild(el('div', 'kpi__meta', k.meta));
      row.appendChild(cell);
    });
    return row;
  }

  /* =====================================================================
     Decision intelligence matrix
     ===================================================================== */
  var DIMENSIONS = [
    {
      k: '01',
      title: { id: 'Profitabilitas', en: 'Profitability' },
      short: { id: 'Di mana margin dibuat atau bocor?', en: 'Where is margin made or lost?' },
      q: { id: 'Di mana margin sebenarnya dibuat — dan di mana ia bocor?', en: 'Where is margin actually created — and where does it leak?' },
      measures: [
        { id: 'Margin kotor dan margin bersih', en: 'Gross margin and net margin' },
        { id: 'Margin per kanal, produk, dan proyek', en: 'Margin by channel, product and project' },
        { id: 'Kontribusi biaya terhadap penjualan bersih', en: 'Cost contribution to net sales' },
        { id: 'Kebocoran margin: diskon, biaya kanal, retur', en: 'Margin leakage: discounts, channel fees, returns' },
      ],
      decisions: [
        { id: 'Lindungi', en: 'Protect' },
        { id: 'Sesuaikan', en: 'Adjust' },
        { id: 'Hentikan', en: 'Stop' },
        { id: 'Perbesar', en: 'Scale' },
      ],
    },
    {
      k: '02',
      title: { id: 'Kas', en: 'Cash' },
      short: { id: 'Berapa kas tersedia dan apa yang akan berubah?', en: 'What cash is available and what is about to change?' },
      q: { id: 'Berapa kas yang benar-benar tersedia, dan apa yang akan mengubahnya?', en: 'What cash is genuinely available, and what is about to change it?' },
      measures: [
        { id: 'Posisi kas dan pergerakan harian', en: 'Cash position and daily movement' },
        { id: 'Arus masuk dan arus keluar per klasifikasi', en: 'Inflow and outflow by classification' },
        { id: 'Settlement yang belum masuk', en: 'Settlement not yet received' },
        { id: 'Kewajiban jatuh tempo dan potensi cash gap', en: 'Obligations falling due and the potential cash gap' },
      ],
      decisions: [
        { id: 'Tahan', en: 'Hold' },
        { id: 'Cairkan', en: 'Release' },
        { id: 'Tagih', en: 'Collect' },
        { id: 'Alokasikan ulang', en: 'Reallocate' },
      ],
    },
    {
      k: '03',
      title: { id: 'Piutang', en: 'Receivables' },
      short: { id: 'Apa yang belum menjadi kas?', en: 'What has not become cash yet?' },
      q: { id: 'Apa yang sudah menjadi penjualan tetapi belum menjadi kas — dan mana yang perlu didahulukan?', en: 'What has already become revenue but not yet cash — and which part needs attention first?' },
      measures: [
        { id: 'Total piutang dan umur piutang', en: 'Total receivables and ageing' },
        { id: 'Jatuh tempo dan yang sudah lewat', en: 'Due and overdue' },
        { id: 'Progres penagihan', en: 'Collection progress' },
        { id: 'Konsentrasi piutang pada satu sumber', en: 'Concentration on a single source' },
      ],
      decisions: [
        { id: 'Prioritaskan', en: 'Prioritise' },
        { id: 'Eskalasi', en: 'Escalate' },
        { id: 'Pantau', en: 'Monitor' },
      ],
    },
    {
      k: '04',
      title: { id: 'Kinerja Proyek', en: 'Project Performance' },
      short: { id: 'Apakah proyek masih sehat secara keuangan?', en: 'Is the project financially on track?' },
      q: { id: 'Apakah proyek ini masih sehat secara keuangan — dan bagian mana yang mulai bergeser?', en: 'Is this project still financially healthy — and which part has started to move?' },
      measures: [
        { id: 'Nilai kontrak terhadap biaya yang sudah terjadi', en: 'Contract value against cost incurred' },
        { id: 'Margin dan variance terhadap rencana', en: 'Margin and variance against plan' },
        { id: 'Kas diterima dan sisa penagihan', en: 'Cash received and outstanding collection' },
        { id: 'Konsentrasi biaya dan sisa biaya penyelesaian', en: 'Cost concentration and cost to complete' },
      ],
      decisions: [
        { id: 'Lanjutkan', en: 'Continue' },
        { id: 'Kendalikan biaya', en: 'Control cost' },
        { id: 'Percepat penagihan', en: 'Accelerate billing' },
        { id: 'Tinjau ulang', en: 'Review' },
      ],
    },
    {
      k: '05',
      title: { id: 'Eksepsi & Risiko', en: 'Exception & Risk' },
      short: { id: 'Apa yang berubah dan perlu perhatian sekarang?', en: 'What changed and needs attention now?' },
      q: { id: 'Apa yang berubah dari kebiasaan — dan perlu perhatian manajemen sekarang?', en: 'What has moved away from the pattern — and needs management attention now?' },
      measures: [
        { id: 'Variance dan deviasi terhadap anggaran', en: 'Variance and deviation against budget' },
        { id: 'Transaksi yang belum cocok atau belum terpetakan', en: 'Unmatched or unmapped transactions' },
        { id: 'Selisih rekonsiliasi', en: 'Reconciliation differences' },
        { id: 'Pergerakan biaya yang tidak biasa', en: 'Unusual cost movement' },
      ],
      decisions: [
        { id: 'Selidiki', en: 'Investigate' },
        { id: 'Setujui', en: 'Approve' },
        { id: 'Tahan', en: 'Hold' },
        { id: 'Koreksi', en: 'Correct' },
      ],
    },
  ];

  var matrixIndex = 0;
  function renderMatrix() {
    var list = document.getElementById('matrixList');
    var panel = document.getElementById('matrixPanel');
    if (!list || !panel) return;
    list.innerHTML = '';
    DIMENSIONS.forEach(function (d, i) {
      var b = el('button', 'matrix__btn');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === matrixIndex));
      b.id = 'dim-' + d.k;
      b.appendChild(el('span', 'matrix__btn-k', d.k));
      var mid = el('span');
      mid.appendChild(el('span', 'matrix__btn-t', L(d.title)));
      mid.appendChild(el('span', 'matrix__btn-q', L(d.short)));
      b.appendChild(mid);
      b.appendChild(el('span', 'matrix__arrow', '→'));
      b.addEventListener('click', function () {
        matrixIndex = i;
        renderMatrix();
      });
      b.addEventListener('keydown', function (ev) {
        if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
        ev.preventDefault();
        matrixIndex = (i + (ev.key === 'ArrowDown' ? 1 : DIMENSIONS.length - 1)) % DIMENSIONS.length;
        renderMatrix();
        list.children[matrixIndex].focus();
      });
      list.appendChild(b);
    });

    var d = DIMENSIONS[matrixIndex];
    panel.innerHTML = '';
    panel.setAttribute('aria-labelledby', 'dim-' + d.k);
    panel.appendChild(el('h3', 'matrix__q', L(d.q)));
    var cols = el('div', 'matrix__cols');
    var c1 = el('div');
    c1.appendChild(el('p', 'matrix__sub', T.t('matrix.measures')));
    var ul = el('ul', 'matrix__items');
    d.measures.forEach(function (m) {
      ul.appendChild(el('li', null, L(m)));
    });
    c1.appendChild(ul);
    var c2 = el('div');
    c2.appendChild(el('p', 'matrix__sub', T.t('matrix.decisions')));
    var dec = el('div', 'matrix__decisions');
    d.decisions.forEach(function (x) {
      dec.appendChild(el('span', 'matrix__decision', L(x)));
    });
    c2.appendChild(dec);
    cols.appendChild(c1);
    cols.appendChild(c2);
    panel.appendChild(cols);
  }

  /* =====================================================================
     Case study shell
     ===================================================================== */
  function caseShell(host, spec) {
    host.innerHTML = '';
    var head = el('div', 'case__head');
    var left = el('div');
    left.appendChild(el('span', 'case__index', spec.index + ' — ' + L(spec.kicker)));
    left.appendChild(el('h3', 'display case__name', L(spec.name)));
    head.appendChild(left);
    var right = el('div');
    right.appendChild(el('p', 'case__q', L(spec.question)));
    right.appendChild(el('p', 'case__blurb', L(spec.blurb)));
    head.appendChild(right);
    host.appendChild(head);

    var report = el('div', 'report');
    var bar = el('div', 'report__bar');
    bar.appendChild(el('span', 'report__title', L(spec.panel)));
    var controls = el('div', 'report__controls');
    bar.appendChild(controls);
    report.appendChild(bar);
    var body = el('div', 'report__body');
    report.appendChild(body);

    var foot = el('div', 'report__foot');
    var ico = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ico.setAttribute('viewBox', '0 0 16 16');
    ico.setAttribute('width', '13');
    ico.setAttribute('height', '13');
    ico.setAttribute('aria-hidden', 'true');
    ico.innerHTML =
      '<circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M8 7.2v4M8 4.8v.9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>';
    foot.appendChild(ico);
    var footText = el('span', null, T.t('ui.disclosure'));
    foot.appendChild(footText);
    report.appendChild(foot);
    host.appendChild(report);

    var outcome = el('div', 'case__outcome');
    var sig = el('div');
    sig.appendChild(el('p', 'outcome__head', T.t('ui.signal')));
    var sl = el('ul', 'signal-list');
    spec.signals.forEach(function (s, i) {
      var li = el('li');
      li.appendChild(el('span', 'signal-list__i', '0' + (i + 1)));
      var body2 = el('span');
      var b = el('b', null, L(s.t));
      body2.appendChild(b);
      body2.appendChild(document.createTextNode(' ' + L(s.d)));
      li.appendChild(body2);
      sl.appendChild(li);
    });
    sig.appendChild(sl);
    outcome.appendChild(sig);

    var dec = el('div');
    dec.appendChild(el('p', 'outcome__head', T.t('ui.decision')));
    var chips = el('div', 'matrix__decisions');
    spec.decisions.forEach(function (x) {
      chips.appendChild(el('span', 'matrix__decision', L(x)));
    });
    dec.appendChild(chips);
    var en = el('p', 'enabler');
    en.style.marginTop = '1.2rem';
    en.innerHTML = '<b>' + T.t('ui.enabler') + '.</b> ' + L(spec.enabler);
    dec.appendChild(en);
    outcome.appendChild(dec);
    host.appendChild(outcome);

    return { controls: controls, body: body };
  }

  function tabs(controls, items, onPick) {
    var current = 0;
    var btns = [];
    items.forEach(function (it, i) {
      var b = el('button', 'chip', L(it.label));
      b.type = 'button';
      b.setAttribute('aria-selected', String(i === 0));
      b.addEventListener('click', function () {
        current = i;
        btns.forEach(function (x, j) {
          x.setAttribute('aria-selected', String(i === j));
        });
        onPick(i);
      });
      btns.push(b);
      controls.appendChild(b);
    });
    return {
      relabel: function () {
        btns.forEach(function (b, i) {
          b.textContent = L(items[i].label);
        });
      },
      get index() {
        return current;
      },
    };
  }

  /* =====================================================================
     Case 01 — Marketplace Financial Intelligence
     ===================================================================== */
  var CASE1 = {
    index: '01',
    kicker: { id: 'Profitabilitas', en: 'Profitability' },
    name: { id: 'Marketplace Financial Intelligence', en: 'Marketplace Financial Intelligence' },
    question: { id: 'Di mana pendapatan benar-benar berubah menjadi laba?', en: 'Where is revenue actually turning into profit?' },
    blurb: {
      id: 'Penjualan dari empat kanal marketplace disatukan sampai ke tingkat margin: penjualan kotor, diskon penjual, biaya kanal, HPP, lalu settlement dan piutang. Pertanyaannya bukan berapa yang terjual, tetapi berapa yang benar-benar tersisa.',
      en: 'Sales from four marketplace channels brought together down to margin level: gross sales, seller discounts, channel costs, COGS, then settlement and receivables. The question is not how much sold, but how much actually remained.',
    },
    panel: { id: 'Laporan Profitabilitas Marketplace', en: 'Marketplace Profitability Report' },
    signals: [
      {
        t: { id: 'Kanal terbesar bukan kanal paling efisien.', en: 'The largest channel is not the most efficient one.' },
        d: {
          id: 'Kanal dengan penjualan bersih terbesar membawa biaya kanal 17,0% sementara kanal terkecil kedua hanya 15,0% — selisih yang berulang di setiap periode.',
          en: 'The channel with the largest net sales carries a 17.0% channel cost while a smaller one carries only 15.0% — a gap that repeats every period.',
        },
      },
      {
        t: { id: 'Diskon penjual menekan margin lebih dalam dari biaya kanal.', en: 'Seller discounts cut deeper than channel fees.' },
        d: {
          id: 'Pada satu kanal, diskon menyerap porsi terbesar dari penjualan kotor sebelum biaya marketplace bahkan dihitung.',
          en: 'On one channel, discounts absorb the largest share of gross sales before marketplace fees are even applied.',
        },
      },
      {
        t: { id: 'Produk termahal bukan produk paling menguntungkan per unit.', en: 'The most expensive product is not the most profitable per unit.' },
        d: {
          id: 'Margin per pcs menunjukkan urutan yang berbeda dari harga jual — dan itu mengubah produk mana yang layak didorong.',
          en: 'Margin per unit ranks differently from price — and that changes which product deserves the push.',
        },
      },
    ],
    decisions: [
      { id: 'Lindungi margin', en: 'Protect margin' },
      { id: 'Selidiki kebocoran', en: 'Investigate leakage' },
      { id: 'Prioritaskan kanal & produk', en: 'Prioritise channel & product' },
      { id: 'Tinjau settlement', en: 'Review settlement' },
    ],
    enabler: {
      id: 'Ekspor penjualan dan pencairan tiap kanal dinormalisasi ke satu struktur akun, dijurnal, lalu diringkas menjadi laba rugi, posisi piutang, dan margin per produk — sehingga angka yang sama bisa dibaca dari sisi manajemen maupun sisi akuntansi.',
      en: 'Sales and payout exports from each channel are normalised into one account structure, journalised, then summarised into a P&L, a receivable position and per-product margin — so the same numbers can be read from both a management and an accounting view.',
    },
  };

  function buildCase1(host) {
    var mp = D.marketplace;
    var shell = caseShell(host, CASE1);
    var filter = 'all';

    var filterWrap = el('div', 'report__controls');
    var tabApi;

    function channels() {
      return filter === 'all'
        ? mp.channels
        : mp.channels.filter(function (c) {
            return c.key === filter;
          });
    }

    var views = [
      { label: { id: 'Profitabilitas', en: 'Profitability' } },
      { label: { id: 'Kanal & produk', en: 'Channel & product' } },
      { label: { id: 'Piutang', en: 'Receivables' } },
    ];

    var panel = el('div');
    shell.body.appendChild(panel);

    function render() {
      registry = registry.filter(function (e) {
        return !panel.contains(e.host);
      });
      panel.innerHTML = '';
      var rows = channels();
      var tot = mp.totals(rows);
      var view = tabApi ? tabApi.index : 0;

      if (view === 0) {
        panel.appendChild(
          kpiRow([
            { label: { id: 'Penjualan Bersih', en: 'Net Sales' }, value: money(tot.net), meta: T.t('ui.period') },
            {
              label: { id: 'Biaya Marketplace', en: 'Marketplace Cost' },
              value: money(tot.fee),
              meta: T.pct(tot.feeRate) + ' ' + T.t('ui.of') + ' net',
            },
            {
              label: { id: 'Margin Kontribusi', en: 'Contribution Margin' },
              value: money(tot.margin),
              meta: T.pct(tot.marginRate) + ' ' + T.t('ui.of') + ' net',
              accent: true,
            },
            {
              label: { id: 'Laba Operasi', en: 'Operating Profit' },
              value: money(tot.operating),
              meta: T.pct(tot.operatingRate) + ' ' + T.t('ui.of') + ' net',
            },
          ])
        );

        var steps = function () {
          return [
            { label: L({ id: 'Penjualan Kotor', en: 'Gross Sales' }), value: tot.gross, total: true, series: 's2' },
            { label: L({ id: 'Diskon Penjual', en: 'Seller Discount' }), value: -tot.discount },
            { label: L({ id: 'Penjualan Bersih', en: 'Net Sales' }), value: tot.net, total: true, series: 's2' },
            { label: L({ id: 'Biaya Kanal', en: 'Channel Cost' }), value: -tot.fee },
            { label: L({ id: 'HPP', en: 'COGS' }), value: -tot.cogs },
            { label: L({ id: 'Margin', en: 'Margin' }), value: tot.margin, total: true, series: 's1' },
          ];
        };

        panel.appendChild(
          vizBlock({
            title: { id: 'Jembatan profitabilitas', en: 'Profitability bridge' },
            note: { id: 'Dari penjualan kotor ke margin', en: 'Gross sales to margin' },
            build: function (w) {
              return C.bridge({
                width: w,
                height: 250,
                steps: steps(),
                fmt: money,
                fmtFull: moneyFull,
                title: 'Profitability bridge',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Jembatan profitabilitas', en: 'Profitability bridge' }),
                [L({ id: 'Pos', en: 'Line' }), L({ id: 'Nilai', en: 'Value' })],
                steps().map(function (s) {
                  return [s.label, moneyFull(s.value)];
                })
              );
            },
          })
        );

        var grid = el('div', 'viz-grid viz-grid--2');
        grid.appendChild(
          vizBlock({
            title: { id: 'Margin per kanal', en: 'Margin by channel' },
            note: { id: '% dari penjualan bersih', en: '% of net sales' },
            build: function (w) {
              return C.barsH({
                width: w,
                rows: mp.channels.map(function (c) {
                  return {
                    label: c.name,
                    value: c.marginRate * 100,
                    series: c.series,
                    note: money(c.margin),
                    noteLabel: L({ id: 'Nilai margin', en: 'Margin value' }),
                  };
                }),
                series: 's1',
                fmt: function (v) {
                  return T.num(v, 1) + '%';
                },
                fmtFull: function (v) {
                  return T.num(v, 1) + '%';
                },
                measure: L({ id: 'Margin', en: 'Margin' }),
                title: 'Margin by channel',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Margin per kanal', en: 'Margin by channel' }),
                [
                  L({ id: 'Kanal', en: 'Channel' }),
                  L({ id: 'Penjualan bersih', en: 'Net sales' }),
                  L({ id: 'Biaya kanal', en: 'Channel cost' }),
                  L({ id: 'Margin', en: 'Margin' }),
                  '%',
                ],
                mp.channels.map(function (c) {
                  return [c.name, moneyFull(c.net), moneyFull(c.fee), moneyFull(c.margin), T.pct(c.marginRate)];
                })
              );
            },
          })
        );
        grid.appendChild(
          vizBlock({
            title: { id: 'Rasio biaya kanal', en: 'Channel cost ratio' },
            note: { id: '% dari penjualan bersih', en: '% of net sales' },
            build: function (w) {
              return C.barsV({
                width: w,
                height: 190,
                rows: mp.channels.map(function (c) {
                  return { label: c.name, value: c.feeRate * 100, series: c.series, mark: true };
                }),
                fmt: function (v) {
                  return T.num(v, 1) + '%';
                },
                fmtFull: function (v) {
                  return T.num(v, 1) + '%';
                },
                fmtTick: function (v) {
                  return T.num(v, 0) + '%';
                },
                measure: L({ id: 'Biaya kanal', en: 'Channel cost' }),
                title: 'Channel cost ratio',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Rasio biaya kanal', en: 'Channel cost ratio' }),
                [L({ id: 'Kanal', en: 'Channel' }), L({ id: 'Biaya kanal', en: 'Channel cost' }), '%'],
                mp.channels.map(function (c) {
                  return [c.name, moneyFull(c.fee), T.pct(c.feeRate)];
                })
              );
            },
          })
        );
        panel.appendChild(grid);
      }

      if (view === 1) {
        var labels = mp.channels[0].daily.map(function (_, i) {
          return 'D' + (i + 1);
        });
        panel.appendChild(
          vizBlock({
            title: { id: 'Penjualan bersih harian per kanal', en: 'Daily net sales by channel' },
            note: { id: 'Periode 14 hari', en: '14-day period' },
            legend: function () {
              return mp.channels.map(function (c) {
                return { label: c.name, color: 'var(--' + c.series + ')', shape: 'line' };
              });
            },
            build: function (w) {
              return C.lines({
                width: w,
                height: 240,
                labels: labels,
                labelStep: 3,
                series: mp.channels.map(function (c) {
                  return {
                    name: c.name,
                    series: c.series,
                    values: c.daily.map(function (v) {
                      return v * D.JT;
                    }),
                  };
                }),
                fmtTick: money,
                fmtFull: moneyFull,
                title: 'Daily net sales by channel',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Penjualan bersih harian', en: 'Daily net sales' }),
                [L({ id: 'Hari', en: 'Day' })].concat(
                  mp.channels.map(function (c) {
                    return c.name;
                  })
                ),
                labels.map(function (lb, i) {
                  return [lb].concat(
                    mp.channels.map(function (c) {
                      return moneyFull(c.daily[i] * D.JT);
                    })
                  );
                })
              );
            },
          })
        );

        var skus = D.marketplace.skus.slice().sort(function (a, b) {
          return b.marginRate - a.marginRate;
        });
        panel.appendChild(
          vizBlock({
            title: { id: 'Margin per produk (per pcs)', en: 'Margin per product (per unit)' },
            note: { id: 'Harga − biaya kanal − HPP', en: 'Price − channel cost − COGS' },
            build: function (w) {
              return C.barsH({
                width: w,
                labelWidth: 108,
                rows: skus.map(function (s) {
                  return {
                    label: L({ id: 'Produk ', en: 'Product ' }) + s.label,
                    value: s.marginRate * 100,
                    note: moneyFull(s.margin) + ' / ' + T.t('ui.perPcs'),
                    noteLabel: L({ id: 'Margin', en: 'Margin' }),
                  };
                }),
                fmt: function (v) {
                  return T.num(v, 1) + '%';
                },
                fmtFull: function (v) {
                  return T.num(v, 1) + '%';
                },
                measure: L({ id: 'Margin per unit', en: 'Margin per unit' }),
                title: 'Margin per product',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Margin per produk', en: 'Margin per product' }),
                [
                  L({ id: 'Produk', en: 'Product' }),
                  L({ id: 'Harga', en: 'Price' }),
                  L({ id: 'Biaya kanal', en: 'Channel cost' }),
                  L({ id: 'HPP', en: 'COGS' }),
                  L({ id: 'Margin', en: 'Margin' }),
                  '%',
                ],
                skus.map(function (s) {
                  return [
                    L({ id: 'Produk ', en: 'Product ' }) + s.label,
                    moneyFull(s.price),
                    moneyFull(s.fee),
                    moneyFull(s.cogs),
                    moneyFull(s.margin),
                    T.pct(s.marginRate),
                  ];
                })
              );
            },
          })
        );
      }

      if (view === 2) {
        var totR = mp.totals(mp.channels);
        panel.appendChild(
          kpiRow([
            { label: { id: 'Piutang Marketplace', en: 'Marketplace Receivables' }, value: money(totR.receivable), accent: true },
            { label: { id: 'Dalam Proses', en: 'In Process' }, value: money(totR.receivableProcess) },
            { label: { id: 'Menunggu Settlement', en: 'Awaiting Settlement' }, value: money(totR.receivableSettlement) },
          ])
        );
        panel.appendChild(
          vizBlock({
            title: { id: 'Piutang per kanal', en: 'Receivables by channel' },
            note: { id: 'Dalam proses + menunggu settlement', en: 'In process + awaiting settlement' },
            build: function (w) {
              return C.barsH({
                width: w,
                rows: mp.channels.map(function (c) {
                  return {
                    label: c.name,
                    value: c.receivable,
                    series: c.series,
                    note: T.num(c.settleDays, 1) + ' ' + L({ id: 'hari', en: 'days' }),
                    noteLabel: L({ id: 'Rata-rata pencairan', en: 'Average settlement' }),
                  };
                }),
                fmt: money,
                fmtFull: moneyFull,
                measure: L({ id: 'Piutang', en: 'Receivables' }),
                title: 'Receivables by channel',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Piutang per kanal', en: 'Receivables by channel' }),
                [
                  L({ id: 'Kanal', en: 'Channel' }),
                  L({ id: 'Dalam proses', en: 'In process' }),
                  L({ id: 'Menunggu settlement', en: 'Awaiting settlement' }),
                  L({ id: 'Total', en: 'Total' }),
                  L({ id: 'Rata-rata hari', en: 'Average days' }),
                ],
                mp.channels.map(function (c) {
                  return [
                    c.name,
                    moneyFull(c.receivableProcess),
                    moneyFull(c.receivableSettlement),
                    moneyFull(c.receivable),
                    T.num(c.settleDays, 1),
                  ];
                })
              );
            },
          })
        );
        panel.appendChild(
          vizBlock({
            title: { id: 'Rata-rata hari pencairan', en: 'Average days to settlement' },
            note: { id: 'Semakin lama, semakin lama kas tertahan', en: 'The longer it runs, the longer cash is held' },
            build: function (w) {
              return C.barsV({
                width: w,
                height: 170,
                rows: mp.channels.map(function (c) {
                  return { label: c.name, value: c.settleDays, series: c.series, mark: true };
                }),
                fmt: function (v) {
                  return T.num(v, 1);
                },
                fmtFull: function (v) {
                  return T.num(v, 1) + ' ' + L({ id: 'hari', en: 'days' });
                },
                fmtTick: function (v) {
                  return T.num(v, 0);
                },
                measure: L({ id: 'Hari', en: 'Days' }),
                title: 'Average days to settlement',
              });
            },
          })
        );
      }
    }

    // filter row — scopes the whole panel
    var filterLabel = el('span', 'report__title', L({ id: 'Kanal', en: 'Channel' }));
    filterWrap.appendChild(filterLabel);
    var opts = [{ key: 'all', name: T.t('ui.all') }].concat(
      mp.channels.map(function (c) {
        return { key: c.key, name: c.name };
      })
    );
    opts.forEach(function (o) {
      var b = el('button', 'chip', o.name);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(o.key === filter));
      b.addEventListener('click', function () {
        filter = o.key;
        filterWrap.querySelectorAll('.chip').forEach(function (x) {
          x.setAttribute('aria-pressed', String(x === b));
        });
        render();
      });
      filterWrap.appendChild(b);
    });

    tabApi = tabs(shell.controls, views, render);
    shell.body.insertBefore(filterWrap, panel);
    filterWrap.style.marginBottom = '1rem';
    render();
  }

  /* =====================================================================
     Case 02 — Project Financial Performance
     ===================================================================== */
  var TERMS = {
    dp: { id: 'DP', en: 'Down payment' },
    t1: { id: 'Termin 1', en: 'Term 1' },
    t2: { id: 'Termin 2', en: 'Term 2' },
    t3: { id: 'Termin 3', en: 'Term 3' },
    final: { id: 'Pelunasan', en: 'Final' },
  };
  var TERM_STATUS = {
    paid: { label: { id: 'Lunas', en: 'Paid' }, color: 'var(--st-good)' },
    due: { label: { id: 'Jatuh tempo', en: 'Due' }, color: 'var(--st-warn)' },
    upcoming: { label: { id: 'Akan datang', en: 'Upcoming' }, color: 'var(--axis)' },
  };
  var DRIVERS = {
    subcontract: { id: 'Produksi / Subkontraktor', en: 'Production / subcontract' },
    materials: { id: 'Material Utama', en: 'Primary materials' },
    finishing: { id: 'Finishing & Hardware', en: 'Finishing & hardware' },
    other: { id: 'Biaya Lain', en: 'Other costs' },
  };

  var CASE2 = {
    index: '02',
    kicker: { id: 'Kinerja Proyek', en: 'Project Performance' },
    name: { id: 'Project Financial Performance', en: 'Project Financial Performance' },
    question: { id: 'Apakah proyek ini masih sehat secara keuangan?', en: 'Is this project financially on track?' },
    blurb: {
      id: 'Satu proyek dibaca dari dua jalur yang sengaja dipisah: jalur laba (nilai proyek → biaya → margin) dan jalur kas (termin → kas diterima → sisa penagihan). Proyek bisa untung di atas kertas dan tetap kekurangan kas.',
      en: 'One project read along two deliberately separated paths: the profit path (project value → cost → margin) and the cash path (terms → cash received → outstanding collection). A project can be profitable on paper and still be short of cash.',
    },
    panel: { id: 'Laporan Kinerja Proyek — Proyek A', en: 'Project Performance Report — Project A' },
    signals: [
      {
        t: { id: 'Margin sehat, tetapi penagihan tertinggal.', en: 'Margin is healthy, collection is behind.' },
        d: {
          id: 'Margin 41,0% dari nilai proyek, sementara 30,2% nilai kontrak belum menjadi kas. Dua angka ini tidak boleh dibaca sebagai satu kesimpulan.',
          en: 'Margin is 41.0% of project value while 30.2% of the contract has not become cash. These two numbers must not be read as one conclusion.',
        },
      },
      {
        t: { id: 'Biaya terkonsentrasi pada satu kategori.', en: 'Cost is concentrated in one category.' },
        d: {
          id: 'Kategori biaya terbesar menyerap 37,5% dari total biaya — perubahan kecil di sana menggeser margin lebih cepat daripada penghematan di tempat lain.',
          en: 'The largest cost category absorbs 37.5% of total cost — a small move there shifts margin faster than savings anywhere else.',
        },
      },
      {
        t: { id: 'Belanja memuncak di pertengahan, bukan di awal.', en: 'Spending peaks mid-project, not at the start.' },
        d: {
          id: 'Puncak biaya mingguan terjadi setelah dua termin pertama cair — sehingga kebutuhan kas terberat justru datang sebelum termin berikutnya.',
          en: 'The weekly cost peak lands after the first two terms are received — so the heaviest cash need arrives before the next term does.',
        },
      },
    ],
    decisions: [
      { id: 'Lanjutkan', en: 'Continue' },
      { id: 'Kendalikan biaya', en: 'Control cost' },
      { id: 'Percepat penagihan', en: 'Accelerate collection' },
      { id: 'Tinjau margin', en: 'Review margin' },
    ],
    enabler: {
      id: 'Transaksi biaya harian per proyek dikumpulkan dan dikelompokkan per kategori dan per minggu, lalu disandingkan dengan struktur termin dan status pembayaran — sehingga posisi laba dan posisi kas bisa dibaca berdampingan tanpa tercampur.',
      en: 'Daily project cost transactions are collected and grouped by category and by week, then placed beside the term structure and payment status — so the profit position and the cash position can be read side by side without being confused for one another.',
    },
  };

  function buildCase2(host) {
    var p = D.project;
    var shell = caseShell(host, CASE2);
    var views = [
      { label: { id: 'Profitabilitas', en: 'Profitability' } },
      { label: { id: 'Kas & penagihan', en: 'Cash & collection' } },
      { label: { id: 'Biaya per waktu', en: 'Cost over time' } },
    ];
    var panel = el('div');
    shell.body.appendChild(panel);
    var tabApi;

    function render() {
      registry = registry.filter(function (e) {
        return !panel.contains(e.host);
      });
      panel.innerHTML = '';
      var view = tabApi ? tabApi.index : 0;

      panel.appendChild(
        kpiRow([
          { label: { id: 'Nilai Proyek', en: 'Project Value' }, value: money(p.value) },
          { label: { id: 'Biaya Terjadi', en: 'Cost Incurred' }, value: money(p.cost), meta: T.pct(p.costRatio) + ' ' + T.t('ui.of') + ' ' + L({ id: 'nilai', en: 'value' }) },
          { label: { id: 'Margin', en: 'Margin' }, value: money(p.margin), meta: T.pct(p.marginRate), accent: true },
          { label: { id: 'Kas Diterima', en: 'Cash Received' }, value: money(p.cashReceived) },
          { label: { id: 'Sisa Penagihan', en: 'Outstanding' }, value: money(p.outstanding), meta: T.pct(p.outstanding / p.value) },
        ])
      );

      if (view === 0) {
        var steps = function () {
          return [
            { label: L({ id: 'Nilai Proyek', en: 'Project Value' }), value: p.value, total: true, series: 's2' },
            { label: L({ id: 'Biaya', en: 'Cost' }), value: -p.cost },
            { label: L({ id: 'Margin', en: 'Margin' }), value: p.margin, total: true, series: 's1' },
          ];
        };
        var grid = el('div', 'viz-grid viz-grid--2');
        grid.appendChild(
          vizBlock({
            title: { id: 'Jalur laba', en: 'Profit path' },
            note: { id: 'Nilai proyek → biaya → margin', en: 'Value → cost → margin' },
            build: function (w) {
              return C.bridge({ width: w, height: 230, steps: steps(), fmt: money, fmtFull: moneyFull, title: 'Profit path' });
            },
            table: function () {
              return C.table(
                L({ id: 'Jalur laba', en: 'Profit path' }),
                [L({ id: 'Pos', en: 'Line' }), L({ id: 'Nilai', en: 'Value' })],
                steps().map(function (s) {
                  return [s.label, moneyFull(s.value)];
                })
              );
            },
          })
        );
        grid.appendChild(
          vizBlock({
            title: { id: 'Penggerak biaya', en: 'Cost drivers' },
            note: { id: 'Tiga terbesar + sisanya', en: 'Top three + the rest' },
            build: function (w) {
              return C.barsH({
                width: w,
                labelWidth: Math.min(150, w * 0.42),
                rows: p.costDrivers.map(function (d, i) {
                  return {
                    label: L(DRIVERS[d.key]),
                    value: d.amount,
                    series: i === 0 ? 's1' : 's1',
                    note: T.pct(d.amount / p.cost),
                    noteLabel: L({ id: 'Porsi biaya', en: 'Share of cost' }),
                  };
                }),
                fmt: money,
                fmtFull: moneyFull,
                measure: L({ id: 'Biaya', en: 'Cost' }),
                title: 'Cost drivers',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Penggerak biaya', en: 'Cost drivers' }),
                [L({ id: 'Kategori', en: 'Category' }), L({ id: 'Nilai', en: 'Value' }), '%'],
                p.costDrivers.map(function (d) {
                  return [L(DRIVERS[d.key]), moneyFull(d.amount), T.pct(d.amount / p.cost)];
                })
              );
            },
          })
        );
        panel.appendChild(grid);
      }

      if (view === 1) {
        panel.appendChild(
          vizBlock({
            title: { id: 'Struktur termin & status pembayaran', en: 'Term structure & payment status' },
            note: { id: 'Jalur kas dipisahkan dari jalur laba', en: 'The cash path, kept separate from profit' },
            legend: function () {
              return ['paid', 'due', 'upcoming'].map(function (k) {
                return { label: L(TERM_STATUS[k].label), color: TERM_STATUS[k].color };
              });
            },
            build: function (w) {
              var bar = C.statusBar({
                width: w,
                segments: p.terms.map(function (t) {
                  return {
                    label: L(TERMS[t.key]) + ' — ' + L(TERM_STATUS[t.status].label),
                    value: t.amount,
                    color: TERM_STATUS[t.status].color,
                  };
                }),
                measure: L({ id: 'Nilai termin', en: 'Term value' }),
                fmtFull: moneyFull,
                title: 'Term structure',
              });
              var list = el('div');
              list.style.marginTop = '0.4rem';
              p.terms.forEach(function (t) {
                var row = el('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.gap = '1rem';
                row.style.padding = '0.45rem 0';
                row.style.borderBottom = '1px solid var(--line)';
                row.style.fontSize = '0.84rem';
                var left = el('span', null, L(TERMS[t.key]));
                var right = el('span', 'status');
                var dot = el('span', 'status__dot');
                dot.style.background = TERM_STATUS[t.status].color;
                right.appendChild(dot);
                right.appendChild(document.createTextNode(L(TERM_STATUS[t.status].label) + ' · ' + money(t.amount)));
                row.appendChild(left);
                row.appendChild(right);
                list.appendChild(row);
              });
              return [bar, list];
            },
            table: function () {
              return C.table(
                L({ id: 'Struktur termin', en: 'Term structure' }),
                [L({ id: 'Termin', en: 'Term' }), L({ id: 'Nilai', en: 'Value' }), L({ id: 'Status', en: 'Status' })],
                p.terms.map(function (t) {
                  return [L(TERMS[t.key]), moneyFull(t.amount), L(TERM_STATUS[t.status].label)];
                })
              );
            },
          })
        );
        var steps2 = function () {
          return [
            { label: L({ id: 'Nilai Kontrak', en: 'Contract Value' }), value: p.value, total: true, series: 's2' },
            { label: L({ id: 'Kas Diterima', en: 'Cash Received' }), value: -p.cashReceived },
            { label: L({ id: 'Sisa Penagihan', en: 'Outstanding' }), value: p.outstanding, total: true, series: 's3' },
          ];
        };
        panel.appendChild(
          vizBlock({
            title: { id: 'Posisi penagihan', en: 'Collection position' },
            note: { id: 'Apa yang belum menjadi kas', en: 'What has not become cash' },
            build: function (w) {
              return C.bridge({ width: w, height: 210, steps: steps2(), fmt: money, fmtFull: moneyFull, title: 'Collection position' });
            },
            table: function () {
              return C.table(
                L({ id: 'Posisi penagihan', en: 'Collection position' }),
                [L({ id: 'Pos', en: 'Line' }), L({ id: 'Nilai', en: 'Value' })],
                steps2().map(function (s) {
                  return [s.label, moneyFull(s.value)];
                })
              );
            },
          })
        );
      }

      if (view === 2) {
        var peak = p.weekly.indexOf(Math.max.apply(null, p.weekly));
        panel.appendChild(
          vizBlock({
            title: { id: 'Biaya per minggu', en: 'Cost by week' },
            note: { id: 'Puncak belanja ditandai', en: 'Spending peak marked' },
            build: function (w) {
              return C.barsV({
                width: w,
                height: 220,
                rows: p.weekly.map(function (v, i) {
                  return {
                    label: 'W' + (i + 1),
                    full: L({ id: 'Minggu ', en: 'Week ' }) + (i + 1),
                    value: v,
                    mark: i === peak,
                    quiet: i !== peak && v < p.weekly[peak] * 0.7,
                  };
                }),
                fmt: money,
                fmtFull: moneyFull,
                fmtTick: money,
                measure: L({ id: 'Biaya', en: 'Cost' }),
                title: 'Cost by week',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Biaya per minggu', en: 'Cost by week' }),
                [L({ id: 'Minggu', en: 'Week' }), L({ id: 'Biaya', en: 'Cost' }), L({ id: 'Kumulatif', en: 'Cumulative' })],
                p.weekly.map(function (v, i) {
                  return [String(i + 1), moneyFull(v), moneyFull(p.cumulativeWeekly[i])];
                })
              );
            },
          })
        );
        panel.appendChild(
          vizBlock({
            title: { id: 'Biaya kumulatif', en: 'Cumulative cost' },
            note: { id: 'Terhadap nilai proyek', en: 'Against project value' },
            build: function (w) {
              return C.lines({
                width: w,
                height: 200,
                everyLabel: true,
                labels: p.cumulativeWeekly.map(function (_, i) {
                  return 'W' + (i + 1);
                }),
                series: [
                  {
                    name: L({ id: 'Biaya kumulatif', en: 'Cumulative cost' }),
                    series: 's1',
                    values: p.cumulativeWeekly,
                  },
                ],
                fmtTick: money,
                fmtFull: moneyFull,
                title: 'Cumulative cost',
              });
            },
          })
        );
      }
    }

    tabApi = tabs(shell.controls, views, render);
    render();
  }

  /* =====================================================================
     Case 03 — Cash & Financial Visibility
     ===================================================================== */
  var CLS = {
    revenue: { id: 'Settlement Pendapatan', en: 'Revenue settlement' },
    opex: { id: 'Biaya Operasional', en: 'Operating expense' },
    cogs: { id: 'Pembelian / HPP', en: 'Purchases / COGS' },
    payroll: { id: 'Gaji', en: 'Payroll' },
    tax: { id: 'Pajak', en: 'Tax' },
    review: { id: 'Perlu Ditinjau', en: 'Needs review' },
  };
  var TX_TYPE = {
    qr: { id: 'Settlement QR', en: 'QR settlement' },
    delivery: { id: 'Kanal pengiriman', en: 'Delivery channel' },
    payroll: { id: 'Siklus gaji', en: 'Payroll cycle' },
    vendor: { id: 'Pembayaran vendor', en: 'Vendor payment' },
    transfer: { id: 'Transfer masuk', en: 'Incoming transfer' },
    settlement: { id: 'Settlement marketplace', en: 'Marketplace settlement' },
    charges: { id: 'Biaya administrasi bank', en: 'Bank charges' },
    card: { id: 'Settlement kartu', en: 'Card settlement' },
    operating: { id: 'Pembayaran operasional', en: 'Operating payment' },
    supplier: { id: 'Pembayaran pemasok', en: 'Supplier payment' },
    tax: { id: 'Pembayaran pajak', en: 'Tax payment' },
    logistics: { id: 'Biaya logistik', en: 'Logistics cost' },
    reversal: { id: 'Pembalikan refund', en: 'Refund reversal' },
    unidentified: { id: 'Debit belum teridentifikasi', en: 'Unidentified debit' },
  };
  var TX_STATUS = {
    matched: { label: { id: 'Cocok', en: 'Matched' }, color: 'var(--st-good)' },
    mapping: { label: { id: 'Perlu mapping', en: 'Needs mapping' }, color: 'var(--st-warn)' },
    exception: { label: { id: 'Eksepsi', en: 'Exception' }, color: 'var(--st-critical)' },
  };

  var CASE3 = {
    index: '03',
    kicker: { id: 'Kas & Eksepsi', en: 'Cash & Exceptions' },
    name: { id: 'Cash & Financial Visibility', en: 'Cash & Financial Visibility' },
    question: { id: 'Apa yang berubah pada kas, dan apa yang perlu perhatian sekarang?', en: 'What changed in cash, and what needs attention now?' },
    blurb: {
      id: 'Pergerakan rekening diklasifikasikan ke konteks akuntansi, direkonsiliasi, lalu disajikan sebagai posisi kas beserta daftar eksepsi. Nilainya bukan pada mengunggah mutasi, tetapi pada membuat informasi kas layak dipakai untuk memutuskan.',
      en: 'Account movement is classified into accounting context, reconciled, then presented as a cash position together with its exception list. The value is not in uploading statements — it is in making cash information fit to decide on.',
    },
    panel: { id: 'Laporan Visibilitas Kas — Rekening Operasional A', en: 'Cash Visibility Report — Operating Account A' },
    signals: [
      {
        t: { id: '95% nilai sudah cocok — sisanya yang menentukan.', en: '95% of value is matched — the rest is what decides.' },
        d: {
          id: 'Empat transaksi yang belum terselesaikan tidak besar nilainya, tetapi selama belum jelas, posisi kas belum bisa dipakai sebagai dasar keputusan.',
          en: 'Four unresolved transactions are small in value, but until they are clear the cash position cannot be used as a basis for a decision.',
        },
      },
      {
        t: { id: 'Beban terbesar jatuh di awal periode.', en: 'The heaviest outflow lands early in the period.' },
        d: {
          id: 'Siklus gaji menyerap kas sebelum sebagian besar settlement pendapatan masuk — pola ini berulang dan bisa direncanakan.',
          en: 'The payroll cycle absorbs cash before most revenue settlements arrive — a repeating pattern that can be planned for.',
        },
      },
      {
        t: { id: 'Transfer tanpa konteks adalah risiko, bukan kas.', en: 'A transfer without context is risk, not cash.' },
        d: {
          id: 'Dana masuk yang belum bisa dipetakan ke akun tidak diakui sebagai pendapatan sampai konteksnya jelas.',
          en: 'Incoming funds that cannot yet be mapped to an account are not recognised as revenue until their context is clear.',
        },
      },
    ],
    decisions: [
      { id: 'Tagih', en: 'Collect' },
      { id: 'Tahan', en: 'Hold' },
      { id: 'Cairkan', en: 'Release' },
      { id: 'Selidiki', en: 'Investigate' },
      { id: 'Rekonsiliasi', en: 'Reconcile' },
    ],
    enabler: {
      id: 'Mutasi rekening dibaca menjadi baris transaksi, dipetakan ke akun sesuai polanya, lalu diberi status rekonsiliasi. Yang tidak dikenali tidak dipaksa masuk — justru diangkat sebagai antrean eksepsi yang harus diputuskan manusia.',
      en: 'Account movement is read into transaction rows, mapped to accounts by pattern, then given a reconciliation status. Whatever is not recognised is never forced through — it is raised as an exception queue for a human to decide on.',
    },
  };

  function buildCase3(host) {
    var c = D.cash;
    var shell = caseShell(host, CASE3);
    var views = [
      { label: { id: 'Posisi kas', en: 'Cash position' } },
      { label: { id: 'Klasifikasi', en: 'Classification' } },
      { label: { id: 'Rekonsiliasi & eksepsi', en: 'Reconciliation & exceptions' } },
    ];
    var panel = el('div');
    shell.body.appendChild(panel);
    var tabApi;

    function render() {
      registry = registry.filter(function (e) {
        return !panel.contains(e.host);
      });
      panel.innerHTML = '';
      var view = tabApi ? tabApi.index : 0;

      panel.appendChild(
        kpiRow([
          { label: { id: 'Saldo Awal', en: 'Opening Balance' }, value: money(c.opening) },
          { label: { id: 'Kas Masuk', en: 'Cash In' }, value: money(c.inflow) },
          { label: { id: 'Kas Keluar', en: 'Cash Out' }, value: money(c.outflow) },
          { label: { id: 'Saldo Akhir', en: 'Closing Balance' }, value: money(c.closing), accent: true },
          {
            label: { id: 'Belum Terselesaikan', en: 'Unresolved' },
            value: String(c.unresolved.length),
            meta: money(c.unresolvedValue),
          },
        ])
      );

      if (view === 0) {
        var steps = function () {
          return [
            { label: L({ id: 'Saldo Awal', en: 'Opening' }), value: c.opening, total: true, series: 's2' },
            { label: L({ id: 'Masuk', en: 'In' }), value: c.inflow },
            { label: L({ id: 'Keluar', en: 'Out' }), value: -c.outflow },
            { label: L({ id: 'Saldo Akhir', en: 'Closing' }), value: c.closing, total: true, series: 's1' },
          ];
        };
        panel.appendChild(
          vizBlock({
            title: { id: 'Pergerakan kas periode', en: 'Cash movement for the period' },
            note: { id: 'Saldo awal → masuk → keluar → saldo akhir', en: 'Opening → in → out → closing' },
            build: function (w) {
              return C.bridge({ width: w, height: 230, steps: steps(), fmt: money, fmtFull: moneyFull, title: 'Cash movement' });
            },
            table: function () {
              return C.table(
                L({ id: 'Pergerakan kas', en: 'Cash movement' }),
                [L({ id: 'Pos', en: 'Line' }), L({ id: 'Nilai', en: 'Value' })],
                steps().map(function (s) {
                  return [s.label, moneyFull(s.value)];
                })
              );
            },
          })
        );
        panel.appendChild(
          vizBlock({
            title: { id: 'Saldo harian', en: 'Daily balance' },
            note: { id: 'Lima hari kerja', en: 'Five working days' },
            build: function (w) {
              return C.lines({
                width: w,
                height: 200,
                everyLabel: true,
                zeroBased: false,
                labels: c.days.map(function (d) {
                  return 'D' + d.d;
                }),
                series: [
                  {
                    name: L({ id: 'Saldo', en: 'Balance' }),
                    series: 's2',
                    values: c.days.map(function (d) {
                      return d.balance;
                    }),
                  },
                ],
                fmtTick: money,
                fmtFull: moneyFull,
                title: 'Daily balance',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Saldo harian', en: 'Daily balance' }),
                [L({ id: 'Hari', en: 'Day' }), L({ id: 'Pergerakan', en: 'Movement' }), L({ id: 'Saldo', en: 'Balance' })],
                c.days.map(function (d) {
                  return ['D' + d.d, moneyFull(d.net), moneyFull(d.balance)];
                })
              );
            },
          })
        );
      }

      if (view === 1) {
        panel.appendChild(
          vizBlock({
            title: { id: 'Kas masuk & keluar per klasifikasi', en: 'Cash in and out by classification' },
            note: { id: 'Konteks akuntansi, bukan deskripsi bank', en: 'Accounting context, not bank description' },
            legend: function () {
              return [
                { label: L({ id: 'Masuk', en: 'In' }), color: 'var(--s2)' },
                { label: L({ id: 'Keluar', en: 'Out' }), color: 'var(--s3)' },
              ];
            },
            build: function (w) {
              return C.diverging({
                width: w,
                labelWidth: Math.min(150, w * 0.36),
                rows: c.byClass.map(function (r) {
                  return { label: L(CLS[r.cls]), inflow: r.inflow, outflow: r.outflow };
                }),
                fmt: money,
                fmtFull: moneyFull,
                inLabel: L({ id: 'Masuk', en: 'In' }),
                outLabel: L({ id: 'Keluar', en: 'Out' }),
                title: 'Cash by classification',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Kas per klasifikasi', en: 'Cash by classification' }),
                [L({ id: 'Klasifikasi', en: 'Classification' }), L({ id: 'Masuk', en: 'In' }), L({ id: 'Keluar', en: 'Out' })],
                c.byClass.map(function (r) {
                  return [L(CLS[r.cls]), r.inflow ? moneyFull(r.inflow) : '—', r.outflow ? moneyFull(r.outflow) : '—'];
                })
              );
            },
          })
        );
      }

      if (view === 2) {
        var counts = ['matched', 'mapping', 'exception'].map(function (s) {
          return {
            key: s,
            label: L(TX_STATUS[s].label),
            color: TX_STATUS[s].color,
            value: c.tx.reduce(function (a, t) {
              return t.status === s ? a + t.amount : a;
            }, 0),
            n: c.tx.filter(function (t) {
              return t.status === s;
            }).length,
          };
        });
        panel.appendChild(
          vizBlock({
            title: { id: 'Status rekonsiliasi', en: 'Reconciliation status' },
            note: {
              id: T.pct(c.matchedRate, 1) + ' nilai sudah cocok',
              en: T.pct(c.matchedRate, 1) + ' of value matched',
            },
            legend: function () {
              return counts.map(function (s) {
                return { label: s.label + ' · ' + s.n, color: s.color };
              });
            },
            build: function (w) {
              return C.statusBar({
                width: w,
                segments: counts,
                measure: L({ id: 'Nilai pergerakan', en: 'Movement value' }),
                fmtFull: moneyFull,
                title: 'Reconciliation status',
              });
            },
            table: function () {
              return C.table(
                L({ id: 'Status rekonsiliasi', en: 'Reconciliation status' }),
                [L({ id: 'Status', en: 'Status' }), L({ id: 'Transaksi', en: 'Transactions' }), L({ id: 'Nilai', en: 'Value' })],
                counts.map(function (s) {
                  return [s.label, String(s.n), moneyFull(s.value)];
                })
              );
            },
          })
        );

        var queue = el('div', 'viz');
        var qh = el('div', 'viz__head');
        qh.appendChild(el('span', 'viz__title', L({ id: 'Antrean eksepsi', en: 'Exception queue' })));
        qh.appendChild(
          el('span', 'viz__note', L({ id: 'Menunggu keputusan manusia', en: 'Waiting on a human decision' }))
        );
        queue.appendChild(qh);
        var wrap = el('div', 'table-wrap');
        var tbl = el('table', 'data-table');
        var cap = el('caption', null, L({ id: 'Item yang belum terselesaikan', en: 'Unresolved items' }));
        tbl.appendChild(cap);
        var thead = el('thead');
        var htr = el('tr');
        [
          L({ id: 'Hari', en: 'Day' }),
          L({ id: 'Transaksi', en: 'Transaction' }),
          L({ id: 'Arah', en: 'Direction' }),
          L({ id: 'Nilai', en: 'Value' }),
          L({ id: 'Status', en: 'Status' }),
        ].forEach(function (h) {
          var th = el('th', null, h);
          th.scope = 'col';
          htr.appendChild(th);
        });
        thead.appendChild(htr);
        tbl.appendChild(thead);
        var tb = el('tbody');
        c.unresolved.forEach(function (t) {
          var tr = el('tr');
          var th = el('th', null, 'D' + t.d);
          th.scope = 'row';
          tr.appendChild(th);
          tr.appendChild(el('td', null, L(TX_TYPE[t.type])));
          tr.appendChild(el('td', null, t.dir === 'in' ? L({ id: 'Masuk', en: 'In' }) : L({ id: 'Keluar', en: 'Out' })));
          tr.appendChild(el('td', null, moneyFull(t.amount)));
          var td = el('td');
          var st = el('span', 'status');
          var dot = el('span', 'status__dot');
          dot.style.background = TX_STATUS[t.status].color;
          st.appendChild(dot);
          st.appendChild(document.createTextNode(L(TX_STATUS[t.status].label)));
          td.appendChild(st);
          tr.appendChild(td);
          tb.appendChild(tr);
        });
        tbl.appendChild(tb);
        wrap.appendChild(tbl);
        queue.appendChild(wrap);
        panel.appendChild(queue);
      }
    }

    tabApi = tabs(shell.controls, views, render);
    render();
  }

  /* =====================================================================
     Supporting work + principles
     ===================================================================== */
  var SUPPORT = [
    {
      k: 'S1',
      t: { id: 'Kontrol Pengeluaran', en: 'Spending Control' },
      d: {
        id: 'Pengajuan biaya dibaca terhadap anggaran dan pola belanja sebelum uang keluar, bukan setelahnya.',
        en: 'Spending requests read against budget and prior pattern before the money leaves, not after.',
      },
    },
    {
      k: 'S2',
      t: { id: 'Persetujuan Keuangan', en: 'Finance Approval' },
      d: {
        id: 'Jalur persetujuan yang jelas: siapa memutuskan apa, dengan bukti yang menempel pada keputusannya.',
        en: 'A clear approval path: who decides what, with the evidence attached to the decision.',
      },
    },
    {
      k: 'S3',
      t: { id: 'Rekonsiliasi', en: 'Reconciliation' },
      d: {
        id: 'Mencocokkan catatan internal dengan pergerakan riil, lalu mengangkat selisihnya sebagai pekerjaan.',
        en: 'Matching internal records to real movement, then raising the difference as work to be done.',
      },
    },
    {
      k: 'S4',
      t: { id: 'Pelaporan Manajemen', en: 'Management Reporting' },
      d: {
        id: 'Laporan berkala yang disusun dari pertanyaan manajemen, bukan dari ketersediaan data.',
        en: 'Recurring reports built from the management question, not from whatever data happens to exist.',
      },
    },
    {
      k: 'S5',
      t: { id: 'Otomasi Keuangan Operasional', en: 'Operational Finance Automation' },
      d: {
        id: 'Pekerjaan berulang yang dipindahkan ke sistem agar waktu analis kembali ke analisis.',
        en: 'Repetitive work moved into the system so analyst time returns to analysis.',
      },
    },
  ];

  var PRINCIPLES = [
    {
      k: '01',
      t: { id: 'Mulai dari keputusannya', en: 'Start from the decision' },
      d: {
        id: 'Laporan yang tidak mengubah tindakan hanya menambah pekerjaan. Saya menyusun informasi mundur dari keputusan yang harus diambil.',
        en: 'A report that changes no action only adds work. I build the information backwards from the decision that has to be made.',
      },
    },
    {
      k: '02',
      t: { id: 'Angka harus bisa dipercaya', en: 'The number has to hold' },
      d: {
        id: 'Kecepatan tidak berarti apa-apa kalau angkanya diragukan. Validasi dan rekonsiliasi adalah syarat, bukan tambahan.',
        en: 'Speed means nothing if the number is doubted. Validation and reconciliation are the precondition, not an extra.',
      },
    },
    {
      k: '03',
      t: { id: 'Sederhana di depan, teliti di belakang', en: 'Simple in front, rigorous behind' },
      d: {
        id: 'Manajemen melihat satu tampilan yang tenang. Kerumitannya tetap ada — hanya saja tidak dipindahkan ke meja mereka.',
        en: 'Management sees one calm view. The complexity still exists — it simply is not moved onto their desk.',
      },
    },
  ];

  function renderSupport() {
    var host = document.getElementById('supportGrid');
    if (!host) return;
    host.innerHTML = '';
    SUPPORT.forEach(function (s) {
      var cell = el('div', 'support__cell');
      cell.appendChild(el('span', 'support__k', s.k));
      cell.appendChild(el('h3', 'support__t', L(s.t)));
      cell.appendChild(el('p', 'support__d', L(s.d)));
      host.appendChild(cell);
    });
  }
  function renderPrinciples() {
    var host = document.getElementById('principles');
    if (!host) return;
    host.innerHTML = '';
    PRINCIPLES.forEach(function (p) {
      var cell = el('div', 'principle');
      cell.appendChild(el('span', 'principle__k', p.k));
      cell.appendChild(el('h3', 'principle__t', L(p.t)));
      cell.appendChild(el('p', 'principle__d', L(p.d)));
      host.appendChild(cell);
    });
  }

  function renderAll() {
    renderMatrix();
    buildCase1(document.getElementById('case-1'));
    buildCase2(document.getElementById('case-2'));
    buildCase3(document.getElementById('case-3'));
    renderSupport();
    renderPrinciples();
  }

  global.CaseStudies = {
    render: renderAll,
    redraw: redrawAll,
    relabel: relabel,
  };
})(window);
