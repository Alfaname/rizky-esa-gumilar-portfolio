/* =========================================================================
   Public-safe case-study data.

   Every figure below is a portfolio-safe reconstruction. What is preserved is
   the financial LOGIC of the real reporting work — the calculation chain, the
   relationships between lines, the categories, and the management questions.
   What is deliberately NOT preserved is any confidential value, entity, client,
   project, product, person or account.

   Derived figures are computed here rather than typed in, so every number the
   site shows stays internally consistent with the formula it claims to follow.
   ========================================================================= */
(function (global) {
  'use strict';

  var JT = 1e6; // juta / million IDR

  /* ------------------------------------------------------------------ */
  /* 01 — Marketplace Financial Intelligence                             */
  /* Logic: Gross Sales − Seller Discount = Net Sales;                   */
  /*        Net Sales − Marketplace Cost − COGS = Contribution Margin;   */
  /*        Margin − Selling − G&A = Operating Profit.                   */
  /* ------------------------------------------------------------------ */
  var mpChannels = [
    {
      key: 'shopee',
      name: 'Shopee',
      series: 's1',
      daily: [68, 72, 81, 76, 92, 118, 104, 71, 69, 84, 88, 96, 112, 99],
      discount: 96,
      feeRate: 0.17,
      cogsRate: 0.6,
      receivableProcess: 88,
      receivableSettlement: 132,
      settleDays: 5.2,
      cancelRate: 0.031,
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      series: 's2',
      daily: [46, 52, 58, 61, 74, 96, 88, 49, 53, 62, 67, 71, 84, 79],
      discount: 112,
      feeRate: 0.19,
      cogsRate: 0.61,
      receivableProcess: 121,
      receivableSettlement: 96,
      settleDays: 8.4,
      cancelRate: 0.054,
    },
    {
      key: 'tokopedia',
      name: 'Tokopedia',
      series: 's3',
      daily: [31, 34, 37, 36, 42, 51, 47, 33, 32, 38, 40, 44, 49, 46],
      discount: 38,
      feeRate: 0.15,
      cogsRate: 0.61,
      receivableProcess: 47,
      receivableSettlement: 58,
      settleDays: 6.0,
      cancelRate: 0.022,
    },
    {
      key: 'lazada',
      name: 'Lazada',
      series: 's4',
      daily: [17, 18, 21, 19, 24, 29, 26, 18, 17, 20, 22, 23, 27, 25],
      discount: 22,
      feeRate: 0.17,
      cogsRate: 0.62,
      receivableProcess: 33,
      receivableSettlement: 26,
      settleDays: 7.1,
      cancelRate: 0.028,
    },
  ];

  mpChannels.forEach(function (c) {
    c.net = c.daily.reduce(function (a, b) {
      return a + b;
    }, 0) * JT;
    c.discount *= JT;
    c.gross = c.net + c.discount;
    c.fee = c.net * c.feeRate;
    c.cogs = c.net * c.cogsRate;
    c.margin = c.net - c.fee - c.cogs;
    c.marginRate = c.margin / c.net;
    c.receivableProcess *= JT;
    c.receivableSettlement *= JT;
    c.receivable = c.receivableProcess + c.receivableSettlement;
  });

  function mpTotals(rows) {
    var t = {
      gross: 0,
      discount: 0,
      net: 0,
      fee: 0,
      cogs: 0,
      margin: 0,
      receivable: 0,
      receivableProcess: 0,
      receivableSettlement: 0,
    };
    rows.forEach(function (c) {
      t.gross += c.gross;
      t.discount += c.discount;
      t.net += c.net;
      t.fee += c.fee;
      t.cogs += c.cogs;
      t.margin += c.margin;
      t.receivable += c.receivable;
      t.receivableProcess += c.receivableProcess;
      t.receivableSettlement += c.receivableSettlement;
    });
    t.feeRate = t.net ? t.fee / t.net : 0;
    t.marginRate = t.net ? t.margin / t.net : 0;
    // Operating cost is carried at group level, allocated across the period.
    t.selling = 226 * JT * (t.net / 3036e6);
    t.ga = 178 * JT * (t.net / 3036e6);
    t.operating = t.margin - t.selling - t.ga;
    t.operatingRate = t.net ? t.operating / t.net : 0;
    return t;
  }

  var mpSkus = [
    { label: 'A', price: 189000, cogs: 113400, feeRate: 0.17 },
    { label: 'B', price: 249000, cogs: 162000, feeRate: 0.17 },
    { label: 'C', price: 129000, cogs: 71000, feeRate: 0.17 },
    { label: 'D', price: 359000, cogs: 248000, feeRate: 0.17 },
    { label: 'E', price: 99000, cogs: 52000, feeRate: 0.17 },
  ];
  mpSkus.forEach(function (s) {
    s.fee = s.price * s.feeRate;
    s.margin = s.price - s.fee - s.cogs;
    s.marginRate = s.margin / s.price;
  });

  /* ------------------------------------------------------------------ */
  /* 02 — Project Financial Performance                                  */
  /* Profit path and cash path are deliberately kept separate.           */
  /* ------------------------------------------------------------------ */
  var project = {
    value: 860 * JT,
    cost: 507 * JT,
    terms: [
      { key: 'dp', amount: 260 * JT, status: 'paid' },
      { key: 't1', amount: 170 * JT, status: 'paid' },
      { key: 't2', amount: 170 * JT, status: 'paid' },
      { key: 't3', amount: 145 * JT, status: 'due' },
      { key: 'final', amount: 115 * JT, status: 'upcoming' },
    ],
    costDrivers: [
      { key: 'subcontract', amount: 190 * JT },
      { key: 'materials', amount: 125 * JT },
      { key: 'finishing', amount: 84 * JT },
      { key: 'other', amount: 108 * JT },
    ],
    weekly: [50, 40, 60, 80, 70, 65, 70, 72].map(function (v) {
      return v * JT;
    }),
  };
  project.margin = project.value - project.cost;
  project.marginRate = project.margin / project.value;
  project.cashReceived = project.terms.reduce(function (a, t) {
    return a + (t.status === 'paid' ? t.amount : 0);
  }, 0);
  project.outstanding = project.value - project.cashReceived;
  project.costRatio = project.cost / project.value;
  project.cashCoverage = project.cashReceived / project.cost;
  project.cumulativeWeekly = project.weekly.reduce(function (acc, v) {
    acc.push((acc.length ? acc[acc.length - 1] : 0) + v);
    return acc;
  }, []);

  /* ------------------------------------------------------------------ */
  /* 03 — Cash & Financial Visibility                                    */
  /* Bank movement classified into accounting context, then reconciled.  */
  /* status: matched | mapping (needs account mapping) | exception       */
  /* ------------------------------------------------------------------ */
  var cash = {
    opening: 320 * JT,
    tx: [
      { d: 1, dir: 'in', amount: 18.5, type: 'qr', cls: 'revenue', status: 'matched' },
      { d: 1, dir: 'in', amount: 7.2, type: 'delivery', cls: 'revenue', status: 'matched' },
      { d: 1, dir: 'out', amount: 41.0, type: 'payroll', cls: 'payroll', status: 'matched' },
      { d: 2, dir: 'out', amount: 12.8, type: 'vendor', cls: 'opex', status: 'matched' },
      { d: 2, dir: 'in', amount: 4.1, type: 'transfer', cls: 'review', status: 'mapping' },
      { d: 2, dir: 'in', amount: 21.4, type: 'settlement', cls: 'revenue', status: 'matched' },
      { d: 2, dir: 'out', amount: 3.25, type: 'charges', cls: 'opex', status: 'matched' },
      { d: 3, dir: 'in', amount: 9.3, type: 'card', cls: 'revenue', status: 'matched' },
      { d: 3, dir: 'out', amount: 6.5, type: 'operating', cls: 'opex', status: 'matched' },
      { d: 3, dir: 'out', amount: 18.9, type: 'supplier', cls: 'cogs', status: 'matched' },
      { d: 3, dir: 'in', amount: 2.75, type: 'transfer', cls: 'review', status: 'mapping' },
      { d: 4, dir: 'in', amount: 16.2, type: 'qr', cls: 'revenue', status: 'matched' },
      { d: 4, dir: 'out', amount: 9.4, type: 'tax', cls: 'tax', status: 'matched' },
      { d: 4, dir: 'out', amount: 5.6, type: 'logistics', cls: 'opex', status: 'matched' },
      { d: 4, dir: 'in', amount: 1.85, type: 'reversal', cls: 'review', status: 'exception' },
      { d: 5, dir: 'in', amount: 23.7, type: 'settlement', cls: 'revenue', status: 'matched' },
      { d: 5, dir: 'out', amount: 14.3, type: 'vendor', cls: 'opex', status: 'matched' },
      { d: 5, dir: 'out', amount: 2.1, type: 'unidentified', cls: 'review', status: 'exception' },
    ],
  };
  cash.tx.forEach(function (t) {
    t.amount *= JT;
  });
  cash.inflow = cash.tx.reduce(function (a, t) {
    return a + (t.dir === 'in' ? t.amount : 0);
  }, 0);
  cash.outflow = cash.tx.reduce(function (a, t) {
    return a + (t.dir === 'out' ? t.amount : 0);
  }, 0);
  cash.closing = cash.opening + cash.inflow - cash.outflow;
  cash.unresolved = cash.tx.filter(function (t) {
    return t.status !== 'matched';
  });
  cash.unresolvedValue = cash.unresolved.reduce(function (a, t) {
    return a + t.amount;
  }, 0);
  cash.movement = cash.inflow + cash.outflow;
  cash.matchedRate = (cash.movement - cash.unresolvedValue) / cash.movement;
  cash.matchedCount = cash.tx.length - cash.unresolved.length;
  cash.days = [1, 2, 3, 4, 5].map(function (d) {
    var net = cash.tx.reduce(function (a, t) {
      return t.d === d ? a + (t.dir === 'in' ? t.amount : -t.amount) : a;
    }, 0);
    return { d: d, net: net };
  });
  cash.days.reduce(function (bal, day) {
    day.balance = bal + day.net;
    return day.balance;
  }, cash.opening);
  cash.byClass = ['revenue', 'opex', 'cogs', 'payroll', 'tax', 'review'].map(function (cls) {
    return {
      cls: cls,
      inflow: cash.tx.reduce(function (a, t) {
        return t.cls === cls && t.dir === 'in' ? a + t.amount : a;
      }, 0),
      outflow: cash.tx.reduce(function (a, t) {
        return t.cls === cls && t.dir === 'out' ? a + t.amount : a;
      }, 0),
    };
  }).filter(function (r) {
    return r.inflow || r.outflow;
  });

  global.PORTFOLIO_DATA = {
    JT: JT,
    marketplace: { channels: mpChannels, totals: mpTotals, skus: mpSkus },
    project: project,
    cash: cash,
  };
})(window);
