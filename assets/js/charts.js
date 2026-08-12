/* =========================================================================
   Small hand-rolled SVG chart set.
   Rules held throughout: one axis per plot, hairline recessive grid, thin
   marks with a 4px rounded value-end, a 2px surface gap between adjacent
   fills, selective direct labels, a legend whenever two or more series share
   a plot, a hover/focus tooltip, and a table twin for every chart.
   ========================================================================= */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var SURFACE = '#14161a';

  function E(tag, attrs, kids) {
    var el = document.createElementNS(NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === null || attrs[k] === undefined) return;
        el.setAttribute(k, attrs[k]);
      });
    }
    (kids || []).forEach(function (k) {
      el.appendChild(k);
    });
    return el;
  }
  function text(str, attrs) {
    var el = E('text', attrs);
    el.textContent = str;
    return el;
  }
  function series(name) {
    return 'var(--' + name + ')';
  }

  /* ---------------------------- tooltip ---------------------------- */
  var tipEl;
  function tip() {
    if (!tipEl) tipEl = document.getElementById('tip');
    return tipEl;
  }
  function showTip(html, x, y) {
    var el = tip();
    if (!el) return;
    el.innerHTML = html;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.classList.add('is-on');
  }
  function hideTip() {
    var el = tip();
    if (el) el.classList.remove('is-on');
  }
  function bindTip(node, htmlFn) {
    function move(ev) {
      var r = node.getBoundingClientRect();
      var px = ev && ev.clientX !== undefined ? ev.clientX : r.left + r.width / 2;
      var py = ev && ev.clientY !== undefined ? ev.clientY : r.top;
      showTip(htmlFn(), px, py - 6);
    }
    node.addEventListener('mouseenter', move);
    node.addEventListener('mousemove', move);
    node.addEventListener('mouseleave', hideTip);
    node.addEventListener('focus', move);
    node.addEventListener('blur', hideTip);
  }
  function tipRow(label, value, color) {
    return (
      '<div class="tip__row"><span>' +
      (color ? '<span class="legend__swatch" style="display:inline-block;background:' + color + '"></span> ' : '') +
      label +
      '</span><b>' +
      value +
      '</b></div>'
    );
  }

  /* ------------------------- shared plumbing ------------------------ */
  function svgRoot(w, h, title) {
    var svg = E('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      width: w,
      height: h,
      role: 'img',
      'aria-label': title || '',
      preserveAspectRatio: 'xMidYMid meet',
      style: 'max-width:100%;height:auto',
    });
    return svg;
  }
  function gridLines(x0, x1, ticks, scale) {
    var g = E('g', { class: 'ch-grid' });
    ticks.forEach(function (tk) {
      g.appendChild(E('line', { x1: x0, x2: x1, y1: scale(tk), y2: scale(tk) }));
    });
    return g;
  }
  /* Greedy word wrap to a character budget, max two lines. */
  function wrapLabel(str, budget) {
    if (str.length <= budget) return [str];
    var words = str.split(' ');
    var lines = [''];
    words.forEach(function (word) {
      var line = lines[lines.length - 1];
      if (!line) lines[lines.length - 1] = word;
      else if ((line + ' ' + word).length <= budget || lines.length === 2) lines[lines.length - 1] = line + ' ' + word;
      else lines.push(word);
    });
    return lines;
  }

  function niceTicks(max, count) {
    var raw = max / (count || 4);
    var mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    var step = Math.ceil(raw / mag) * mag;
    var out = [];
    for (var v = 0; v <= max * 1.0001; v += step) out.push(v);
    if (out[out.length - 1] < max) out.push(out[out.length - 1] + step);
    return out;
  }

  /* --------------------------- table twin --------------------------- */
  function table(caption, cols, rows) {
    var wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    var t = document.createElement('table');
    t.className = 'data-table';
    var cap = document.createElement('caption');
    cap.textContent = caption;
    t.appendChild(cap);
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    cols.forEach(function (c) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = c;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    t.appendChild(thead);
    var tb = document.createElement('tbody');
    rows.forEach(function (r) {
      var row = document.createElement('tr');
      r.forEach(function (cell, i) {
        var td = document.createElement(i === 0 ? 'th' : 'td');
        if (i === 0) td.scope = 'row';
        td.textContent = cell;
        row.appendChild(td);
      });
      tb.appendChild(row);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    return wrap;
  }

  /* ============================== BRIDGE ============================== */
  /* A profitability / cash bridge. Steps carry sign; totals are anchored. */
  function bridge(opts) {
    var w = opts.width;
    var padT = 26,
      padB = 42,
      padL = 4,
      padR = 4;
    var h = opts.height || 240;
    var steps = opts.steps;
    var n = steps.length;
    var gap = Math.max(12, Math.min(30, w * 0.022));
    var bw = Math.max(16, Math.min(140, (w - padL - padR - gap * (n - 1)) / n));
    var span = n * bw + (n - 1) * gap;
    var x0 = padL + Math.max(0, (w - padL - padR - span) / 2);

    var running = 0;
    var levels = steps.map(function (s) {
      var from = s.total ? 0 : running;
      var to = s.total ? s.value : running + s.value;
      if (!s.total) running = to;
      else running = s.value;
      return { from: from, to: to };
    });
    var max = 0;
    levels.forEach(function (l) {
      max = Math.max(max, l.from, l.to);
    });
    var ticks = niceTicks(max, 3);
    var top = ticks[ticks.length - 1];
    var y = function (v) {
      return padT + (1 - v / top) * (h - padT - padB);
    };

    var svg = svgRoot(w, h, opts.title);
    svg.appendChild(gridLines(padL, w - padR, ticks, y));

    steps.forEach(function (s, i) {
      var x = x0 + i * (bw + gap);
      var l = levels[i];
      var yTop = y(Math.max(l.from, l.to));
      var yBot = y(Math.min(l.from, l.to));
      var barH = Math.max(2, yBot - yTop);
      var color = s.total ? series(s.series || 's1') : series(s.value < 0 ? 's3' : 's4');
      var g = E('g', { tabindex: '0', role: 'listitem' });
      g.appendChild(
        E('rect', {
          x: x,
          y: yTop,
          width: bw,
          height: barH,
          rx: 3,
          fill: color,
          class: 'ch-bar',
          opacity: s.total ? 1 : 0.92,
        })
      );
      // connector to the next step
      if (i < n - 1 && !steps[i + 1].total) {
        svg.appendChild(
          E('line', {
            x1: x + bw,
            x2: x + bw + gap,
            y1: y(l.to),
            y2: y(l.to),
            stroke: 'var(--axis)',
            'stroke-width': 1,
          })
        );
      }
      // Narrow layouts label the anchors only; the steps in between stay in
      // the tooltip and the table so the labels never collide.
      if (w >= 540 || s.total) {
        g.appendChild(
          text(opts.fmt(Math.abs(s.value)), {
            x: x + bw / 2,
            y: yTop - 7,
            class: 'ch-value',
            'text-anchor': 'middle',
          })
        );
      }
      var lbl = E('g');
      wrapLabel(s.label, Math.max(9, Math.floor(bw / 5.4))).forEach(function (part, li) {
        lbl.appendChild(
          text(part, {
            x: x + bw / 2,
            y: h - padB + 16 + li * 11,
            class: 'ch-tick',
            'text-anchor': 'middle',
          })
        );
      });
      g.appendChild(lbl);
      var hit = E('rect', { x: x - gap / 2, y: padT, width: bw + gap, height: h - padT - padB, class: 'ch-hit' });
      g.appendChild(hit);
      bindTip(g, function () {
        return (
          '<span class="tip__k">' +
          s.label +
          '</span>' +
          tipRow(opts.fullLabel || '', opts.fmtFull(s.value), color) +
          (s.note ? '<span class="tip__k" style="letter-spacing:0;text-transform:none">' + s.note + '</span>' : '')
        );
      });
      svg.appendChild(g);
    });

    svg.appendChild(E('line', { x1: padL, x2: w - padR, y1: y(0), y2: y(0), stroke: 'var(--axis)', 'stroke-width': 1 }));
    return svg;
  }

  /* ========================= HORIZONTAL BARS ========================= */
  function barsH(opts) {
    var w = opts.width;
    var rows = opts.rows;
    var labelW = opts.labelWidth || 96;
    var valueW = opts.valueWidth || 76;
    var rowH = opts.rowHeight || 34;
    var barH = opts.barHeight || 12;
    var h = rows.length * rowH + 6;
    var plotW = Math.max(40, w - labelW - valueW);
    var max = Math.max.apply(
      null,
      rows.map(function (r) {
        return r.value;
      })
    );
    var svg = svgRoot(w, h, opts.title);

    rows.forEach(function (r, i) {
      var cy = i * rowH + rowH / 2;
      var bw = max ? (r.value / max) * plotW : 0;
      var g = E('g', { tabindex: '0' });
      g.appendChild(
        text(r.label, { x: 0, y: cy + 4, class: 'ch-label' })
      );
      g.appendChild(
        E('line', {
          x1: labelW,
          x2: labelW,
          y1: cy - rowH / 2 + 4,
          y2: cy + rowH / 2 - 4,
          stroke: 'var(--axis)',
          'stroke-width': 1,
        })
      );
      g.appendChild(
        E('rect', {
          x: labelW,
          y: cy - barH / 2,
          width: Math.max(2, bw),
          height: barH,
          rx: 3,
          fill: series(r.series || opts.series || 's1'),
          class: 'ch-bar',
        })
      );
      g.appendChild(
        text(opts.fmt(r.value), { x: w, y: cy + 4, class: 'ch-value', 'text-anchor': 'end' })
      );
      g.appendChild(E('rect', { x: 0, y: cy - rowH / 2, width: w, height: rowH, class: 'ch-hit' }));
      bindTip(g, function () {
        return (
          '<span class="tip__k">' +
          r.label +
          '</span>' +
          tipRow(opts.measure || '', opts.fmtFull(r.value), series(r.series || opts.series || 's1')) +
          (r.note ? tipRow(r.noteLabel || '', r.note) : '')
        );
      });
      svg.appendChild(g);
    });
    return svg;
  }

  /* ========================== VERTICAL BARS ========================== */
  function barsV(opts) {
    var w = opts.width;
    var h = opts.height || 200;
    var padT = 22,
      padB = 34,
      padL = opts.padLeft === undefined ? 34 : opts.padLeft;
    var rows = opts.rows;
    var n = rows.length;
    var gap = Math.max(4, Math.min(14, (w - padL) / (n * 5)));
    var bw = Math.min(opts.maxBar || 46, (w - padL - gap * (n - 1)) / n);
    var span = n * bw + (n - 1) * gap;
    var x0 = padL + Math.max(0, (w - padL - span) / 2);
    var max = Math.max.apply(
      null,
      rows.map(function (r) {
        return r.value;
      })
    );
    var ticks = niceTicks(max, 3);
    var top = ticks[ticks.length - 1];
    var y = function (v) {
      return padT + (1 - v / top) * (h - padT - padB);
    };
    var svg = svgRoot(w, h, opts.title);
    svg.appendChild(gridLines(padL, w, ticks, y));

    rows.forEach(function (r, i) {
      var x = x0 + i * (bw + gap);
      var g = E('g', { tabindex: '0' });
      g.appendChild(
        E('rect', {
          x: x,
          y: y(r.value),
          width: bw,
          height: Math.max(2, y(0) - y(r.value)),
          rx: 3,
          fill: series(r.series || opts.series || 's1'),
          class: 'ch-bar' + (r.quiet ? ' ch-dim' : ''),
        })
      );
      if (r.mark) {
        g.appendChild(
          text(opts.fmt(r.value), {
            x: x + bw / 2,
            y: y(r.value) - 7,
            class: 'ch-value',
            'text-anchor': 'middle',
          })
        );
      }
      g.appendChild(
        text(r.label, { x: x + bw / 2, y: h - padB + 15, class: 'ch-tick', 'text-anchor': 'middle' })
      );
      g.appendChild(E('rect', { x: x - gap / 2, y: padT, width: bw + gap, height: h - padT - padB, class: 'ch-hit' }));
      bindTip(g, function () {
        return (
          '<span class="tip__k">' +
          (r.full || r.label) +
          '</span>' +
          tipRow(opts.measure || '', opts.fmtFull(r.value), series(r.series || opts.series || 's1'))
        );
      });
      svg.appendChild(g);
    });
    svg.appendChild(E('line', { x1: padL, x2: w, y1: y(0), y2: y(0), stroke: 'var(--axis)', 'stroke-width': 1 }));
    ticks.forEach(function (tk, i) {
      if (i === 0) return;
      svg.appendChild(
        text(opts.fmtTick ? opts.fmtTick(tk) : opts.fmt(tk), {
          x: padL - 6,
          y: y(tk) + 3,
          class: 'ch-tick',
          'text-anchor': 'end',
        })
      );
    });
    return svg;
  }

  /* ============================== LINES ============================== */
  function lines(opts) {
    var w = opts.width;
    var h = opts.height || 230;
    var padT = 18,
      padB = 30,
      padR = 6,
      padL = 66;
    var sets = opts.series;
    var labels = opts.labels;
    var max = 0;
    var min = Infinity;
    sets.forEach(function (s) {
      s.values.forEach(function (v) {
        max = Math.max(max, v);
        min = Math.min(min, v);
      });
    });
    var ticks, top, bottom;
    if (opts.zeroBased === false) {
      // A balance line reads better against its own range; the axis labels
      // carry the actual values so the scale is never implied to start at zero.
      var pad = (max - min || max * 0.1) * 0.35;
      bottom = Math.max(0, min - pad);
      top = max + pad;
      ticks = [bottom, (bottom + top) / 2, top];
    } else {
      ticks = niceTicks(max, 3);
      bottom = 0;
      top = ticks[ticks.length - 1];
    }
    var plotW = w - padL - padR;
    var x = function (i) {
      return padL + (labels.length === 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);
    };
    var y = function (v) {
      return padT + (1 - (v - bottom) / (top - bottom)) * (h - padT - padB);
    };

    var svg = svgRoot(w, h, opts.title);
    svg.appendChild(gridLines(padL, w - padR, ticks, y));
    ticks.forEach(function (tk, i) {
      if (i === 0 && opts.zeroBased !== false) return;
      svg.appendChild(
        text(opts.fmtTick(tk), { x: padL - 10, y: y(tk) + 3, class: 'ch-tick', 'text-anchor': 'end' })
      );
    });

    sets.forEach(function (s) {
      var d = s.values
        .map(function (v, i) {
          return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
        })
        .join(' ');
      svg.appendChild(
        E('path', {
          d: d,
          fill: 'none',
          stroke: series(s.series),
          'stroke-width': 2,
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round',
        })
      );
      // endpoint marker + direct label for the leading series only
      var li = s.values.length - 1;
      svg.appendChild(
        E('circle', { cx: x(li), cy: y(s.values[li]), r: 3.5, fill: series(s.series), stroke: SURFACE, 'stroke-width': 2 })
      );
    });

    // crosshair + per-index hit columns
    var cross = E('line', {
      y1: padT,
      y2: h - padB,
      stroke: 'var(--line-warm)',
      'stroke-width': 1,
      opacity: 0,
    });
    svg.appendChild(cross);
    labels.forEach(function (lb, i) {
      var colW = plotW / Math.max(1, labels.length - 1);
      var g = E('g', { tabindex: i % 2 === 0 ? '0' : null });
      var hit = E('rect', {
        x: x(i) - colW / 2,
        y: padT,
        width: Math.max(24, colW),
        height: h - padT - padB,
        class: 'ch-hit',
      });
      g.appendChild(hit);
      g.addEventListener('mouseenter', function () {
        cross.setAttribute('x1', x(i));
        cross.setAttribute('x2', x(i));
        cross.setAttribute('opacity', 1);
      });
      g.addEventListener('mouseleave', function () {
        cross.setAttribute('opacity', 0);
      });
      bindTip(g, function () {
        var html = '<span class="tip__k">' + lb + '</span>';
        sets.forEach(function (s) {
          html += tipRow(s.name, opts.fmtFull(s.values[i]), series(s.series));
        });
        return html;
      });
      svg.appendChild(g);
    });

    labels.forEach(function (lb, i) {
      if (opts.everyLabel || i === 0 || i === labels.length - 1 || i % (opts.labelStep || 4) === 0) {
        svg.appendChild(
          text(lb, {
            x: x(i),
            y: h - padB + 15,
            class: 'ch-tick',
            'text-anchor': i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle',
          })
        );
      }
    });
    svg.appendChild(
      E('line', {
        x1: padL,
        x2: w - padR,
        y1: y(bottom),
        y2: y(bottom),
        stroke: 'var(--axis)',
        'stroke-width': 1,
      })
    );
    return svg;
  }

  /* =========================== DIVERGING BARS =========================== */
  /* Inflow to the right, outflow to the left, neutral zero rule between. */
  function diverging(opts) {
    var w = opts.width;
    var rows = opts.rows;
    var rowH = 34;
    var barH = 12;
    var h = rows.length * rowH + 20;
    var labelW = opts.labelWidth || 104;
    var plotW = w - labelW;
    var mid = labelW + plotW / 2;
    var max = Math.max.apply(
      null,
      rows.map(function (r) {
        return Math.max(r.inflow, r.outflow);
      })
    );
    var scale = function (v) {
      return max ? (v / max) * (plotW / 2 - 46) : 0;
    };
    var svg = svgRoot(w, h, opts.title);

    rows.forEach(function (r, i) {
      var cy = i * rowH + rowH / 2 + 6;
      var g = E('g', { tabindex: '0' });
      g.appendChild(text(r.label, { x: 0, y: cy + 4, class: 'ch-label' }));
      if (r.outflow) {
        g.appendChild(
          E('rect', {
            x: mid - 1 - scale(r.outflow),
            y: cy - barH / 2,
            width: Math.max(2, scale(r.outflow)),
            height: barH,
            rx: 3,
            fill: series('s3'),
            class: 'ch-bar',
          })
        );
        g.appendChild(
          text(opts.fmt(r.outflow), {
            x: mid - 5 - scale(r.outflow),
            y: cy + 4,
            class: 'ch-tick',
            'text-anchor': 'end',
          })
        );
      }
      if (r.inflow) {
        g.appendChild(
          E('rect', {
            x: mid + 1,
            y: cy - barH / 2,
            width: Math.max(2, scale(r.inflow)),
            height: barH,
            rx: 3,
            fill: series('s2'),
            class: 'ch-bar',
          })
        );
        g.appendChild(
          text(opts.fmt(r.inflow), {
            x: mid + 5 + scale(r.inflow),
            y: cy + 4,
            class: 'ch-tick',
          })
        );
      }
      g.appendChild(E('rect', { x: 0, y: cy - rowH / 2, width: w, height: rowH, class: 'ch-hit' }));
      bindTip(g, function () {
        return (
          '<span class="tip__k">' +
          r.label +
          '</span>' +
          (r.inflow ? tipRow(opts.inLabel, opts.fmtFull(r.inflow), series('s2')) : '') +
          (r.outflow ? tipRow(opts.outLabel, opts.fmtFull(r.outflow), series('s3')) : '')
        );
      });
      svg.appendChild(g);
    });
    svg.appendChild(E('line', { x1: mid, x2: mid, y1: 2, y2: h - 10, stroke: 'var(--axis)', 'stroke-width': 1 }));
    return svg;
  }

  /* ======================= STATUS / PROGRESS BAR ======================= */
  function statusBar(opts) {
    var w = opts.width;
    var h = 44;
    var segs = opts.segments;
    var total = segs.reduce(function (a, s) {
      return a + s.value;
    }, 0);
    var svg = svgRoot(w, h, opts.title);
    var x = 0;
    segs.forEach(function (s, i) {
      var sw = total ? (s.value / total) * w : 0;
      var g = E('g', { tabindex: '0' });
      g.appendChild(
        E('rect', {
          x: x,
          y: 8,
          width: Math.max(2, sw - (i < segs.length - 1 ? 2 : 0)),
          height: 18,
          rx: 2,
          fill: s.color,
          class: 'ch-bar',
        })
      );
      g.appendChild(E('rect', { x: x, y: 0, width: Math.max(2, sw), height: h, class: 'ch-hit' }));
      bindTip(g, function () {
        return '<span class="tip__k">' + s.label + '</span>' + tipRow(opts.measure, opts.fmtFull(s.value), s.color);
      });
      svg.appendChild(g);
      x += sw;
    });
    return svg;
  }

  /* ============================== LEGEND ============================== */
  function legend(items) {
    var el = document.createElement('div');
    el.className = 'legend';
    items.forEach(function (it) {
      var span = document.createElement('span');
      span.className = 'legend__item';
      var sw = document.createElement('span');
      sw.className = 'legend__swatch';
      sw.style.background = it.color;
      if (it.shape === 'line') {
        sw.style.height = '2px';
        sw.style.borderRadius = '0';
      }
      span.appendChild(sw);
      span.appendChild(document.createTextNode(it.label));
      el.appendChild(span);
    });
    return el;
  }

  global.Charts = {
    E: E,
    text: text,
    series: series,
    bridge: bridge,
    barsH: barsH,
    barsV: barsV,
    lines: lines,
    diverging: diverging,
    statusBar: statusBar,
    legend: legend,
    table: table,
    bindTip: bindTip,
    hideTip: hideTip,
  };
})(window);
