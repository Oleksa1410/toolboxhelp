export function renderLineSort(el, { copyText, notify }) {
  el.innerHTML = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="ls-grid">

  <!-- INPUT -->
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0">INPUT</div>
      <div style="display:flex;gap:5px">
        <button class="btn btn-sm" id="ls-paste">⎘ Paste</button>
        <button class="btn btn-sm btn-danger" id="ls-clear">✕</button>
      </div>
    </div>
    <textarea id="ls-input" spellcheck="false" placeholder="Paste lines here..."
      style="flex:1;min-height:300px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.7;
             transition:border-color .12s"></textarea>
    <div id="ls-in-stat" style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:6px"></div>
  </div>

  <!-- OUTPUT -->
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0">OUTPUT</div>
      <div style="display:flex;gap:5px">
        <button class="btn btn-sm btn-blue" id="ls-copy">⎘ Copy</button>
        <button class="btn btn-sm" id="ls-apply">↩ Apply</button>
      </div>
    </div>
    <textarea id="ls-output" readonly spellcheck="false"
      style="flex:1;min-height:300px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.7;opacity:.9"></textarea>
    <div id="ls-out-stat" style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:6px"></div>
  </div>
</div>

<!-- Controls -->
<div class="card" style="margin-top:14px">
  <div class="card-hdr">Operations</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">

    <!-- Sort -->
    <div>
      <div class="ls-group-label">Sort</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-sm ls-op" data-op="sort-az">A → Z</button>
          <button class="btn btn-sm ls-op" data-op="sort-za">Z → A</button>
          <button class="btn btn-sm ls-op" data-op="sort-len-asc">Short → Long</button>
          <button class="btn btn-sm ls-op" data-op="sort-len-desc">Long → Short</button>
          <button class="btn btn-sm ls-op" data-op="sort-natural">Natural</button>
          <button class="btn btn-sm ls-op" data-op="sort-num">Numeric</button>
          <button class="btn btn-sm ls-op" data-op="sort-random">🔀 Shuffle</button>
          <button class="btn btn-sm ls-op" data-op="reverse">↕ Reverse</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <label class="ls-check"><input type="checkbox" id="ls-case-insensitive" style="accent-color:var(--accent)"> Case-insensitive</label>
          <label class="ls-check"><input type="checkbox" id="ls-trim-sort" checked style="accent-color:var(--accent)"> Trim before compare</label>
          <label class="ls-check"><input type="checkbox" id="ls-num-suffix" style="accent-color:var(--accent)"> Sort by trailing number</label>
        </div>
      </div>
    </div>

    <!-- Dedupe -->
    <div>
      <div class="ls-group-label">Deduplicate</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-sm ls-op" data-op="unique">Remove Duplicates</button>
          <button class="btn btn-sm ls-op" data-op="unique-ci">Dedupe (case-insensitive)</button>
          <button class="btn btn-sm ls-op" data-op="keep-dupes">Keep Duplicates Only</button>
          <button class="btn btn-sm ls-op" data-op="count-dupes">Count Duplicates</button>
        </div>
        <label class="ls-check"><input type="checkbox" id="ls-trim-dedupe" checked style="accent-color:var(--accent)"> Trim before compare</label>
      </div>
    </div>

    <!-- Filter -->
    <div>
      <div class="ls-group-label">Filter</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-sm ls-op" data-op="remove-empty">Remove blank lines</button>
          <button class="btn btn-sm ls-op" data-op="remove-whitespace-only">Remove whitespace-only</button>
          <button class="btn btn-sm ls-op" data-op="keep-matching">Keep matching</button>
          <button class="btn btn-sm ls-op" data-op="remove-matching">Remove matching</button>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <input type="text" id="ls-filter-text" placeholder="Pattern or regex..."
            style="flex:1;min-width:140px;padding:5px 9px;font-size:12px;font-family:var(--mono)">
          <label class="ls-check"><input type="checkbox" id="ls-filter-regex" style="accent-color:var(--accent)"> Regex</label>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-sm ls-op" data-op="keep-min-len">Keep ≥ length</button>
          <button class="btn btn-sm ls-op" data-op="keep-max-len">Keep ≤ length</button>
          <input type="number" id="ls-len-val" value="3" min="0"
            style="width:60px;padding:5px 8px;font-size:12px">
        </div>
      </div>
    </div>

    <!-- Transform -->
    <div>
      <div class="ls-group-label">Transform lines</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm ls-op" data-op="trim-lines">Trim each</button>
        <button class="btn btn-sm ls-op" data-op="upper">UPPERCASE</button>
        <button class="btn btn-sm ls-op" data-op="lower">lowercase</button>
        <button class="btn btn-sm ls-op" data-op="add-numbers">Number lines</button>
        <button class="btn btn-sm ls-op" data-op="remove-numbers">Strip numbers</button>
        <div style="display:flex;align-items:center;gap:4px;margin-top:2px">
          <input type="text" id="ls-prefix" placeholder="prefix" style="width:72px;padding:5px 8px;font-size:12px;font-family:var(--mono)">
          <button class="btn btn-sm ls-op" data-op="add-prefix">+ Prefix</button>
        </div>
        <div style="display:flex;align-items:center;gap:4px">
          <input type="text" id="ls-suffix" placeholder="suffix" style="width:72px;padding:5px 8px;font-size:12px;font-family:var(--mono)">
          <button class="btn btn-sm ls-op" data-op="add-suffix">+ Suffix</button>
        </div>
      </div>
    </div>

    <!-- Set operations -->
    <div>
      <div class="ls-group-label">Set Operations <span style="font-size:10px;color:var(--muted)">(Input A vs Input B below)</span></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm ls-op" data-op="intersect">A ∩ B Intersect</button>
        <button class="btn btn-sm ls-op" data-op="union">A ∪ B Union</button>
        <button class="btn btn-sm ls-op" data-op="diff-a-b">A − B Difference</button>
        <button class="btn btn-sm ls-op" data-op="diff-b-a">B − A Difference</button>
        <button class="btn btn-sm ls-op" data-op="symmetric-diff">A △ B Symmetric</button>
      </div>
    </div>

    <!-- Statistics -->
    <div>
      <div class="ls-group-label">Analyze</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm ls-op" data-op="stats">📊 Statistics</button>
        <button class="btn btn-sm ls-op" data-op="freq">📈 Frequency</button>
      </div>
    </div>
  </div>

  <!-- Input B for set operations -->
  <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
    <div class="ls-group-label" style="margin-bottom:6px">Input B <span style="color:var(--muted)">(for set operations)</span></div>
    <textarea id="ls-input-b" spellcheck="false" placeholder="Paste second list here (for intersect / union / difference)..."
      style="width:100%;min-height:80px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.7"></textarea>
  </div>
</div>`;

  const q  = id => el.querySelector('#' + id);

  // ── Stats ──────────────────────────────────────────────────────────────────
  function updateStat(id, lines) {
    const non = lines.filter(l => l.trim()).length;
    q(id).textContent = `${lines.length} lines · ${non} non-empty`;
  }

  function getLines(id = 'ls-input') {
    return q(id).value.split('\n');
  }

  q('ls-input').addEventListener('input', () => updateStat('ls-in-stat', getLines()));

  // ── Helpers ────────────────────────────────────────────────────────────────
  function setOutput(lines) {
    const text = lines.join('\n');
    q('ls-output').value = text;
    updateStat('ls-out-stat', lines);
  }

  function ci()     { return q('ls-case-insensitive').checked; }
  function trimCmp(){ return q('ls-trim-sort').checked; }
  function cmpKey(l){ return (trimCmp() ? l.trim() : l)[ci() ? 'toLowerCase' : 'toString'](); }

  // Natural sort
  function naturalCmp(a, b) {
    const re = /(\d+)/g;
    const ax = a.split(re), bx = b.split(re);
    for (let i = 0; i < Math.max(ax.length, bx.length); i++) {
      const av = ax[i] || '', bv = bx[i] || '';
      if (/^\d+$/.test(av) && /^\d+$/.test(bv)) {
        const diff = parseInt(av) - parseInt(bv);
        if (diff) return diff;
      } else {
        const cmp = av.localeCompare(bv);
        if (cmp) return cmp;
      }
    }
    return 0;
  }

  // Number suffix sort: "item-3" → 3
  function numSuffix(s) {
    const m = s.match(/(\d+)\s*$/);
    return m ? parseInt(m[1]) : Infinity;
  }

  // ── Operations ─────────────────────────────────────────────────────────────
  const OPS = {
    'sort-az':       lines => [...lines].sort((a,b) => cmpKey(a).localeCompare(cmpKey(b))),
    'sort-za':       lines => [...lines].sort((a,b) => cmpKey(b).localeCompare(cmpKey(a))),
    'sort-len-asc':  lines => [...lines].sort((a,b) => a.length - b.length),
    'sort-len-desc': lines => [...lines].sort((a,b) => b.length - a.length),
    'sort-natural':  lines => [...lines].sort((a,b) => naturalCmp(cmpKey(a), cmpKey(b))),
    'sort-num':      lines => [...lines].sort((a,b) => parseFloat(a.trim()) - parseFloat(b.trim())),
    'sort-random':   lines => { const a=[...lines]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}; return a; },
    'reverse':       lines => [...lines].reverse(),

    'unique':    lines => {
      const seen = new Set();
      return lines.filter(l => { const k = trimCmp()?l.trim():l; return seen.has(k)?false:(seen.add(k),true); });
    },
    'unique-ci': lines => {
      const seen = new Set();
      return lines.filter(l => { const k=(trimCmp()?l.trim():l).toLowerCase(); return seen.has(k)?false:(seen.add(k),true); });
    },
    'keep-dupes': lines => {
      const map = new Map();
      const key = l => (trimCmp()?l.trim():l)[ci()?'toLowerCase':'toString']();
      lines.forEach(l => map.set(key(l), (map.get(key(l))||0)+1));
      return lines.filter(l => map.get(key(l)) > 1);
    },
    'count-dupes': lines => {
      const map = new Map();
      const key = l => (trimCmp()?l.trim():l)[ci()?'toLowerCase':'toString']();
      lines.forEach(l => { const k=key(l); map.set(k,(map.get(k)||0)+1); });
      const seen = new Set();
      return lines
        .filter(l => { const k=key(l); if(seen.has(k))return false; seen.add(k); return true; })
        .map(l => `${map.get(key(l))}x\t${l}`);
    },

    'remove-empty': lines => lines.filter(l => l !== ''),
    'remove-whitespace-only': lines => lines.filter(l => l.trim() !== ''),
    'keep-matching': lines => {
      const pat = q('ls-filter-text').value;
      if (!pat) { notify('Enter a pattern'); return lines; }
      try {
        const re = q('ls-filter-regex').checked
          ? new RegExp(pat, ci()?'i':'')
          : null;
        return lines.filter(l => re ? re.test(l) : l.includes(pat));
      } catch(e) { notify('Regex error: '+e.message); return lines; }
    },
    'remove-matching': lines => {
      const pat = q('ls-filter-text').value;
      if (!pat) { notify('Enter a pattern'); return lines; }
      try {
        const re = q('ls-filter-regex').checked ? new RegExp(pat, ci()?'i':'') : null;
        return lines.filter(l => re ? !re.test(l) : !l.includes(pat));
      } catch(e) { notify('Regex error: '+e.message); return lines; }
    },
    'keep-min-len': lines => { const n=parseInt(q('ls-len-val').value)||0; return lines.filter(l=>l.length>=n); },
    'keep-max-len': lines => { const n=parseInt(q('ls-len-val').value)||0; return lines.filter(l=>l.length<=n); },

    'trim-lines':    lines => lines.map(l => l.trim()),
    'upper':         lines => lines.map(l => l.toUpperCase()),
    'lower':         lines => lines.map(l => l.toLowerCase()),
    'add-numbers':   lines => lines.map((l,i) => `${i+1}. ${l}`),
    'remove-numbers':lines => lines.map(l => l.replace(/^\d+[\.\)\-\s]+/, '')),
    'add-prefix':    lines => { const p=q('ls-prefix').value; return lines.map(l=>p+l); },
    'add-suffix':    lines => { const s=q('ls-suffix').value; return lines.map(l=>l+s); },

    'intersect': lines => {
      const b = new Set(getLines('ls-input-b').map(l=>l.trim()));
      return [...new Set(lines.filter(l => b.has(l.trim())))];
    },
    'union': lines => {
      const b = getLines('ls-input-b');
      return [...new Set([...lines, ...b].map(l=>l.trim()))].filter(Boolean);
    },
    'diff-a-b': lines => {
      const b = new Set(getLines('ls-input-b').map(l=>l.trim()));
      return lines.filter(l => !b.has(l.trim()));
    },
    'diff-b-a': lines => {
      const a = new Set(lines.map(l=>l.trim()));
      return getLines('ls-input-b').filter(l => !a.has(l.trim()));
    },
    'symmetric-diff': lines => {
      const b = getLines('ls-input-b');
      const aSet = new Set(lines.map(l=>l.trim()));
      const bSet = new Set(b.map(l=>l.trim()));
      return [
        ...lines.filter(l => !bSet.has(l.trim())),
        ...b.filter(l => !aSet.has(l.trim())),
      ];
    },

    'stats': lines => {
      const non = lines.filter(l=>l.trim());
      const lengths = lines.map(l=>l.length);
      const avg = lengths.length ? (lengths.reduce((a,b)=>a+b,0)/lengths.length).toFixed(1) : 0;
      const max = Math.max(...lengths), min = Math.min(...lengths);
      const uniq = new Set(lines.map(l=>l.trim().toLowerCase())).size;
      return [
        `Total lines:     ${lines.length}`,
        `Non-empty:       ${non.length}`,
        `Blank lines:     ${lines.length - non.length}`,
        `Unique lines:    ${uniq}`,
        `Duplicate lines: ${lines.length - uniq}`,
        `Avg line length: ${avg} chars`,
        `Shortest line:   ${min} chars`,
        `Longest line:    ${max} chars`,
        `Total chars:     ${lines.join('\n').length}`,
      ];
    },
    'freq': lines => {
      const map = new Map();
      lines.forEach(l => { const k=l.trim(); if(k) map.set(k,(map.get(k)||0)+1); });
      return [...map.entries()]
        .sort((a,b)=>b[1]-a[1])
        .map(([k,v]) => `${String(v).padStart(4)}x  ${k}`);
    },
  };

  // ── Operation buttons ──────────────────────────────────────────────────────
  el.querySelectorAll('.ls-op').forEach(btn => {
    btn.addEventListener('click', () => {
      const op = btn.dataset.op;
      const fn = OPS[op];
      if (!fn) return;
      const lines = getLines();
      if (!lines.join('').trim()) { notify('Input is empty'); return; }
      const result = fn(lines);
      setOutput(result);
    });
  });

  // ── Buttons ────────────────────────────────────────────────────────────────
  q('ls-paste').addEventListener('click', () =>
    navigator.clipboard.readText().then(t => {
      q('ls-input').value = t;
      updateStat('ls-in-stat', getLines());
    })
  );
  q('ls-clear').addEventListener('click', () => {
    q('ls-input').value = '';
    q('ls-output').value = '';
    q('ls-in-stat').textContent = '';
    q('ls-out-stat').textContent = '';
  });
  q('ls-copy').addEventListener('click', () => {
    const v = q('ls-output').value;
    if (!v.trim()) { notify('Output is empty'); return; }
    copyText(v, 'lines');
  });
  q('ls-apply').addEventListener('click', () => {
    const v = q('ls-output').value;
    if (!v.trim()) { notify('Output is empty'); return; }
    q('ls-input').value = v;
    q('ls-output').value = '';
    updateStat('ls-in-stat', getLines());
    q('ls-out-stat').textContent = '';
  });

  // ── Responsive ────────────────────────────────────────────────────────────
  if (window.innerWidth <= 768) q('ls-grid').style.gridTemplateColumns = '1fr';
}