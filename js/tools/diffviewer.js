export function renderDiffViewer(el, { copyText, notify }) {

  el.innerHTML = `
<!-- Inputs -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px" id="dv-inputs">
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:var(--blue)">▌ ORIGINAL</span>
      <div style="display:flex;gap:5px">
        <button class="btn btn-sm" id="dv-paste-a">⎘ Paste</button>
        <button class="btn btn-sm btn-danger" id="dv-clear-a">✕</button>
      </div>
    </div>
    <textarea id="dv-a" spellcheck="false" placeholder="Paste original text..."
      style="flex:1;min-height:180px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.7;tab-size:2"></textarea>
    <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:5px" id="dv-a-info"></div>
  </div>
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:var(--amber)">▌ MODIFIED</span>
      <div style="display:flex;gap:5px">
        <button class="btn btn-sm" id="dv-paste-b">⎘ Paste</button>
        <button class="btn btn-sm btn-danger" id="dv-clear-b">✕</button>
      </div>
    </div>
    <textarea id="dv-b" spellcheck="false" placeholder="Paste modified text..."
      style="flex:1;min-height:180px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.7;tab-size:2"></textarea>
    <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:5px" id="dv-b-info"></div>
  </div>
</div>

<!-- Toolbar -->
<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
  <button class="btn btn-blue" id="dv-run">▶ COMPARE</button>
  <button class="btn btn-sm btn-danger" id="dv-clear-all">✕ Clear</button>
  <div style="height:20px;width:1px;background:var(--border);margin:0 4px"></div>
  <span style="font-family:var(--mono);font-size:10px;color:var(--muted)">VIEW:</span>
  <button class="btn btn-sm dv-view-btn active" data-view="split">⊟ Split</button>
  <button class="btn btn-sm dv-view-btn"        data-view="unified">≡ Unified</button>
  <div style="height:20px;width:1px;background:var(--border);margin:0 4px"></div>
  <label class="dv-opt"><input type="checkbox" id="dv-ignore-ws" style="accent-color:var(--accent)"> Ignore whitespace</label>
  <label class="dv-opt"><input type="checkbox" id="dv-ignore-case" style="accent-color:var(--accent)"> Ignore case</label>
  <div style="margin-left:auto;display:flex;gap:6px">
    <button class="btn btn-sm" id="dv-copy-patch">⎘ Patch</button>
    <button class="btn btn-sm" id="dv-copy-unified">⎘ Unified diff</button>
  </div>
</div>

<!-- Stats -->
<div id="dv-stats" style="display:none;margin-bottom:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <span id="dv-stat-add"  style="font-family:var(--mono);font-size:11px;padding:3px 10px;border-radius:5px;background:rgba(24,224,112,.1);border:1px solid rgba(24,224,112,.25);color:var(--green)"></span>
    <span id="dv-stat-del"  style="font-family:var(--mono);font-size:11px;padding:3px 10px;border-radius:5px;background:rgba(224,85,85,.1);border:1px solid rgba(224,85,85,.25);color:#f08080"></span>
    <span id="dv-stat-same" style="font-family:var(--mono);font-size:11px;padding:3px 10px;border-radius:5px;background:var(--s2);border:1px solid var(--border);color:var(--muted2)"></span>
    <span id="dv-stat-pct"  style="font-family:var(--mono);font-size:11px;color:var(--muted)"></span>
    <div style="display:flex;gap:16px;margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--muted)">
      <span class="dv-legend"><span class="dv-dot" style="background:rgba(24,224,112,.3)"></span>added</span>
      <span class="dv-legend"><span class="dv-dot" style="background:rgba(224,85,85,.3)"></span>removed</span>
      <span class="dv-legend"><span class="dv-dot" style="background:rgba(245,166,35,.3)"></span>changed</span>
    </div>
  </div>
</div>

<!-- Diff output -->
<div id="dv-output" style="display:none">
  <!-- Split view -->
  <div id="dv-split-view">
    <div class="dv-split-container">
      <div class="dv-split-header">
        <div class="dv-split-col-hdr dv-hdr-orig">Original</div>
        <div class="dv-split-col-hdr dv-hdr-mod">Modified</div>
      </div>
      <div class="dv-split-body" id="dv-split-body"></div>
    </div>
  </div>
  <!-- Unified view -->
  <div id="dv-unified-view" style="display:none">
    <div class="dv-unified-container">
      <pre class="dv-unified-pre" id="dv-unified-body"></pre>
    </div>
  </div>
</div>`;

  const q  = id => el.querySelector('#' + id);
  let currentView = 'split';
  let lastA = '', lastB = '';
  let lastDiff = [];

  // ── Info counters ──────────────────────────────────────────────────────────
  function updateInfo(id, text) {
    const lines = text ? text.split('\n').length : 0;
    const chars = text.length;
    q(id).textContent = text ? `${lines} lines · ${chars} chars` : '';
  }
  q('dv-a').addEventListener('input', () => updateInfo('dv-a-info', q('dv-a').value));
  q('dv-b').addEventListener('input', () => updateInfo('dv-b-info', q('dv-b').value));

  // ── Paste / clear ──────────────────────────────────────────────────────────
  q('dv-paste-a').addEventListener('click', () => navigator.clipboard.readText().then(t => { q('dv-a').value = t; updateInfo('dv-a-info', t); }));
  q('dv-paste-b').addEventListener('click', () => navigator.clipboard.readText().then(t => { q('dv-b').value = t; updateInfo('dv-b-info', t); }));
  q('dv-clear-a').addEventListener('click', () => { q('dv-a').value = ''; updateInfo('dv-a-info', ''); });
  q('dv-clear-b').addEventListener('click', () => { q('dv-b').value = ''; updateInfo('dv-b-info', ''); });
  q('dv-clear-all').addEventListener('click', () => {
    ['dv-a','dv-b'].forEach(id => { q(id).value = ''; });
    ['dv-a-info','dv-b-info'].forEach(id => q(id).textContent = '');
    q('dv-stats').style.display = 'none';
    q('dv-output').style.display = 'none';
  });

  // ── View toggle ────────────────────────────────────────────────────────────
  el.querySelectorAll('.dv-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.dv-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      q('dv-split-view').style.display   = currentView === 'split'   ? '' : 'none';
      q('dv-unified-view').style.display = currentView === 'unified' ? '' : 'none';
      if (lastDiff.length) renderOutput(lastDiff, lastA.split('\n'), lastB.split('\n'));
    });
  });

  // ── Ctrl+Enter ────────────────────────────────────────────────────────────
  ['dv-a','dv-b'].forEach(id => {
    q(id).addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') runDiff(); });
  });
  q('dv-run').addEventListener('click', runDiff);

  // ── LCS diff algorithm ─────────────────────────────────────────────────────
  function lcsLines(aLines, bLines) {
    const m = aLines.length, n = bLines.length;
    // Use Myers diff (simplified) for performance
    const MAX = m + n;
    const v = new Array(2 * MAX + 1).fill(0);
    const trace = [];

    for (let d = 0; d <= MAX; d++) {
      trace.push([...v]);
      for (let k = -d; k <= d; k += 2) {
        let x;
        const ki = k + MAX;
        if (k === -d || (k !== d && v[ki - 1] < v[ki + 1])) {
          x = v[ki + 1];
        } else {
          x = v[ki - 1] + 1;
        }
        let y = x - k;
        while (x < m && y < n && aLines[x] === bLines[y]) { x++; y++; }
        v[ki] = x;
        if (x >= m && y >= n) {
          return backtrack(trace, aLines, bLines, d, MAX);
        }
      }
    }
    return backtrack(trace, aLines, bLines, MAX, MAX);
  }

  function backtrack(trace, aLines, bLines, d, MAX) {
    const ops = [];
    let x = aLines.length, y = bLines.length;
    for (let dd = d; dd > 0; dd--) {
      const v = trace[dd];
      const k = x - y;
      const ki = k + MAX;
      let prevK;
      if (k === -dd || (k !== dd && v[ki - 1] < v[ki + 1])) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      const prevX = v[prevK + MAX];
      const prevY = prevX - prevK;
      while (x > prevX && y > prevY) { ops.unshift({ type: 'eq', a: x-1, b: y-1 }); x--; y--; }
      if (dd > 0) {
        if (x === prevX) { ops.unshift({ type: 'ins', b: y-1 }); y--; }
        else             { ops.unshift({ type: 'del', a: x-1 }); x--; }
      }
    }
    while (x > 0 && y > 0) { ops.unshift({ type: 'eq', a: x-1, b: y-1 }); x--; y--; }
    return ops;
  }

  // Char-level diff within a changed line pair
  function charDiff(aStr, bStr) {
    const aChars = [...aStr], bChars = [...bStr];
    // Simple O(n²) for short strings, skip if too long
    if (aChars.length + bChars.length > 400) {
      return { aHtml: esc(aStr), bHtml: esc(bStr) };
    }
    const m = aChars.length, n = bChars.length;
    const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = aChars[i-1] === bChars[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);

    let i = m, j = n;
    const aOps = [], bOps = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && aChars[i-1] === bChars[j-1]) {
        aOps.unshift({ t: 'eq', c: aChars[i-1] }); bOps.unshift({ t: 'eq', c: bChars[j-1] }); i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
        bOps.unshift({ t: 'ins', c: bChars[j-1] }); j--;
      } else {
        aOps.unshift({ t: 'del', c: aChars[i-1] }); i--;
      }
    }

    const render = (ops, type) => ops.map(op => {
      const c = esc(op.c);
      if (op.t === 'eq') return c;
      return `<mark class="dv-char-${type}">${c}</mark>`;
    }).join('');

    return { aHtml: render(aOps, 'del'), bHtml: render(bOps, 'ins') };
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── Main diff runner ───────────────────────────────────────────────────────
  function runDiff() {
    let a = q('dv-a').value;
    let b = q('dv-b').value;
    if (!a && !b) { notify('Both inputs are empty'); return; }
    if (a === b)  { notify('Files are identical'); return; }

    if (q('dv-ignore-case').checked) { a = a.toLowerCase(); b = b.toLowerCase(); }
    if (q('dv-ignore-ws').checked) {
      a = a.split('\n').map(l => l.trim()).join('\n');
      b = b.split('\n').map(l => l.trim()).join('\n');
    }

    lastA = a; lastB = b;
    const aLines = a.split('\n');
    const bLines = b.split('\n');

    if (aLines.length + bLines.length > 10000) {
      notify('Files too large for char-level diff — using line mode only'); }

    const ops = lcsLines(aLines, bLines);
    lastDiff = ops;

    // Stats
    let added = 0, deleted = 0, equal = 0;
    ops.forEach(op => {
      if (op.type === 'ins') added++;
      else if (op.type === 'del') deleted++;
      else equal++;
    });
    const total = added + deleted + equal;
    q('dv-stat-add').textContent  = `+${added} added`;
    q('dv-stat-del').textContent  = `−${deleted} removed`;
    q('dv-stat-same').textContent = `${equal} unchanged`;
    q('dv-stat-pct').textContent  = total ? `${Math.round(equal/total*100)}% same` : '';
    q('dv-stats').style.display   = 'flex';
    q('dv-output').style.display  = 'block';

    renderOutput(ops, aLines, bLines);
  }

  function renderOutput(ops, aLines, bLines) {
    if (currentView === 'split') renderSplit(ops, aLines, bLines);
    else renderUnified(ops, aLines, bLines);
  }

  // ── Split view ─────────────────────────────────────────────────────────────
  function renderSplit(ops, aLines, bLines) {
    let html = '';
    let ai = 0, bi = 0;

    // Group consecutive del+ins as changes
    const grouped = [];
    let i = 0;
    while (i < ops.length) {
      const op = ops[i];
      if (op.type === 'del') {
        // Look ahead for matching ins
        const delOps = [];
        while (i < ops.length && ops[i].type === 'del') { delOps.push(ops[i]); i++; }
        const insOps = [];
        while (i < ops.length && ops[i].type === 'ins') { insOps.push(ops[i]); i++; }
        if (insOps.length) {
          // Pair del+ins as "changed"
          const max = Math.max(delOps.length, insOps.length);
          for (let k = 0; k < max; k++) {
            grouped.push({ type: 'chg', del: delOps[k], ins: insOps[k] });
          }
        } else {
          delOps.forEach(op => grouped.push(op));
        }
      } else {
        grouped.push(op); i++;
      }
    }

    grouped.forEach(op => {
      if (op.type === 'chg') {
        const aLine = op.del ? aLines[op.del.a] : '';
        const bLine = op.ins ? bLines[op.ins.b] : '';
        const aNum  = op.del ? op.del.a + 1 : '';
        const bNum  = op.ins ? op.ins.b + 1 : '';
        if (aLine !== '' && bLine !== '') {
          const { aHtml, bHtml } = charDiff(aLine, bLine);
          html += `<div class="dv-row dv-chg">
            <div class="dv-cell dv-cell-del">
              <span class="dv-ln">${aNum}</span>
              <span class="dv-sign">−</span>
              <span class="dv-code">${aHtml}</span>
            </div>
            <div class="dv-cell dv-cell-ins">
              <span class="dv-ln">${bNum}</span>
              <span class="dv-sign">+</span>
              <span class="dv-code">${bHtml}</span>
            </div>
          </div>`;
        } else if (aLine !== '') {
          html += splitRow('del', aNum, '', esc(aLine), '', '');
        } else {
          html += splitRow('ins', '', bNum, '', esc(bLine), '');
        }
      } else if (op.type === 'del') {
        html += splitRow('del', op.a + 1, '', esc(aLines[op.a]), '', '');
      } else if (op.type === 'ins') {
        html += splitRow('ins', '', op.b + 1, '', esc(bLines[op.b]), '');
      } else {
        // Equal — show with context
        html += splitRow('eq', op.a + 1, op.b + 1, esc(aLines[op.a]), esc(bLines[op.b]), '');
      }
    });

    q('dv-split-body').innerHTML = html || '<div style="padding:20px;text-align:center;font-family:var(--mono);font-size:12px;color:var(--muted)">No differences found.</div>';
  }

  function splitRow(type, anA, anB, codeA, codeB) {
    const cls = { del:'dv-cell-del', ins:'dv-cell-ins', eq:'dv-cell-eq', chg:'dv-cell-chg' };
    const sign = { del:'−', ins:'+', eq:' ', chg:'~' };
    const leftSign  = type === 'del' || type === 'chg' ? '−' : (type === 'ins' ? ' ' : ' ');
    const rightSign = type === 'ins' || type === 'chg' ? '+' : (type === 'del' ? ' ' : ' ');
    const leftCls   = type === 'del' ? 'dv-cell-del' : (type === 'eq' ? 'dv-cell-eq' : 'dv-cell-empty');
    const rightCls  = type === 'ins' ? 'dv-cell-ins' : (type === 'eq' ? 'dv-cell-eq' : 'dv-cell-empty');
    return `<div class="dv-row">
      <div class="dv-cell ${leftCls}">
        <span class="dv-ln">${anA}</span>
        <span class="dv-sign">${type==='del'?'−':' '}</span>
        <span class="dv-code">${codeA}</span>
      </div>
      <div class="dv-cell ${rightCls}">
        <span class="dv-ln">${anB}</span>
        <span class="dv-sign">${type==='ins'?'+':' '}</span>
        <span class="dv-code">${codeB}</span>
      </div>
    </div>`;
  }

  // ── Unified view ───────────────────────────────────────────────────────────
  function renderUnified(ops, aLines, bLines) {
    const lines = [];
    ops.forEach(op => {
      if (op.type === 'del') {
        lines.push({ t:'del', n: op.a+1, text: aLines[op.a] });
      } else if (op.type === 'ins') {
        lines.push({ t:'ins', n: op.b+1, text: bLines[op.b] });
      } else {
        lines.push({ t:'eq',  na: op.a+1, nb: op.b+1, text: aLines[op.a] });
      }
    });

    const html = lines.map(l => {
      const cls  = l.t === 'del' ? 'dv-u-del' : (l.t === 'ins' ? 'dv-u-ins' : 'dv-u-eq');
      const sign = l.t === 'del' ? '−' : (l.t === 'ins' ? '+' : ' ');
      const ln   = l.t === 'del' ? String(l.n).padStart(4) :
                   l.t === 'ins' ? '    '  + String(l.n).padStart(4) :
                   String(l.na).padStart(4) + ' ' + String(l.nb).padStart(4);
      return `<span class="${cls}"><span class="dv-u-ln">${ln}</span><span class="dv-u-sign">${sign} </span>${esc(l.text)}\n</span>`;
    }).join('');

    q('dv-unified-body').innerHTML = html;
  }

  // ── Copy as patch ──────────────────────────────────────────────────────────
  function buildUnifiedPatch(ops, aLines, bLines) {
    let out = '--- a/original\n+++ b/modified\n';
    let hunkLines = [], hunkAStart = 1, hunkBStart = 1, hunkACount = 0, hunkBCount = 0;
    const CONTEXT = 3;

    // Simplified: output all lines with context
    const lines = [];
    ops.forEach(op => {
      if (op.type === 'del') lines.push({ t:'-', txt: aLines[op.a] });
      else if (op.type === 'ins') lines.push({ t:'+', txt: bLines[op.b] });
      else lines.push({ t:' ', txt: aLines[op.a] });
    });

    // Find changed regions and add context
    const changed = lines.map((l,i) => l.t !== ' ' ? i : -1).filter(i => i >= 0);
    if (!changed.length) return out + '@@ No differences @@\n';

    const regions = [];
    let rs = Math.max(0, changed[0] - CONTEXT);
    let re = Math.min(lines.length - 1, changed[0] + CONTEXT);
    for (let i = 1; i < changed.length; i++) {
      const cs = Math.max(0, changed[i] - CONTEXT);
      const ce = Math.min(lines.length - 1, changed[i] + CONTEXT);
      if (cs <= re + 1) { re = ce; }
      else { regions.push([rs, re]); rs = cs; re = ce; }
    }
    regions.push([rs, re]);

    let aPos = 1, bPos = 1;
    for (const [start, end] of regions) {
      let hunkA = 0, hunkB = 0;
      const hunk = [];
      for (let i = 0; i < start; i++) {
        if (lines[i].t !== '+') aPos++;
        if (lines[i].t !== '-') bPos++;
      }
      for (let i = start; i <= end; i++) {
        const l = lines[i];
        hunk.push(l.t + l.txt);
        if (l.t !== '+') hunkA++;
        if (l.t !== '-') hunkB++;
      }
      out += `@@ -${aPos},${hunkA} +${bPos},${hunkB} @@\n` + hunk.join('\n') + '\n';
      aPos += hunkA; bPos += hunkB;
    }
    return out;
  }

  q('dv-copy-patch').addEventListener('click', () => {
    if (!lastDiff.length) { notify('Run compare first'); return; }
    const patch = buildUnifiedPatch(lastDiff, lastA.split('\n'), lastB.split('\n'));
    copyText(patch, 'unified patch');
  });

  q('dv-copy-unified').addEventListener('click', () => {
    if (!lastDiff.length) { notify('Run compare first'); return; }
    const aLines = lastA.split('\n'), bLines = lastB.split('\n');
    const lines = lastDiff.map(op => {
      if (op.type === 'del') return '− ' + aLines[op.a];
      if (op.type === 'ins') return '+ ' + bLines[op.b];
      return '  ' + aLines[op.a];
    });
    copyText(lines.join('\n'), 'diff output');
  });

  // ── Responsive ────────────────────────────────────────────────────────────
  if (window.innerWidth <= 768) {
    q('dv-inputs').style.gridTemplateColumns = '1fr';
  }
}