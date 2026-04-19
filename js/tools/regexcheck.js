export function renderRegexCheck(el, { copyText, notify }) {
  el.innerHTML = `
<!-- Regex input -->
<div class="card">
  <div class="card-hdr">Regular Expression</div>
  <div class="rx-input-wrap" id="rx-input-wrap">
    <span class="rx-delim">/</span>
    <input type="text" id="rx-pattern" placeholder="pattern" spellcheck="false"
      autocomplete="off" autocorrect="off" autocapitalize="off"
      style="flex:1;background:transparent;border:none;outline:none;font-family:var(--mono);
             font-size:15px;color:var(--text2);padding:0 4px">
    <span class="rx-delim">/</span>
    <input type="text" id="rx-flags" value="gm" maxlength="8" placeholder="flags" spellcheck="false"
      style="width:60px;background:transparent;border:none;outline:none;font-family:var(--mono);
             font-size:15px;color:var(--amber);padding:0 4px">
  </div>
  <div id="rx-pattern-err" style="display:none;font-family:var(--mono);font-size:11px;
       color:var(--red);margin-top:6px;padding:6px 10px;background:var(--red-dim);
       border-radius:5px;border:1px solid rgba(224,85,85,.3)"></div>

  <!-- Flags quick-select -->
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center">
    <span style="font-family:var(--mono);font-size:10px;color:var(--muted)">FLAGS:</span>
    ${[
      ['g','global — find all matches'],
      ['i','case insensitive'],
      ['m','multiline — ^ and $ match each line'],
      ['s','dotAll — . matches newlines'],
      ['u','unicode mode'],
      ['d','match indices (v8+)'],
    ].map(([f,desc]) => `<button class="btn btn-sm rx-flag-btn" data-flag="${f}" title="${desc}"
      style="font-family:var(--mono);font-size:11px;min-width:28px">${f}</button>`).join('')}
    <div style="margin-left:auto;display:flex;gap:6px">
      <button class="btn btn-sm" id="rx-copy-regex">⎘ Copy /regex/flags</button>
      <button class="btn btn-sm btn-danger" id="rx-clear">✕ Clear all</button>
    </div>
  </div>
</div>

<!-- Test string -->
<div class="card">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
    <div class="card-hdr" style="margin-bottom:0">Test String</div>
    <div style="display:flex;gap:6px;align-items:center">
      <span id="rx-match-count" style="font-family:var(--mono);font-size:11px;color:var(--muted)"></span>
      <button class="btn btn-sm" id="rx-paste-test">⎘ Paste</button>
    </div>
  </div>
  <div style="position:relative">
    <div id="rx-highlight-layer" aria-hidden="true"
      style="position:absolute;inset:0;padding:10px 12px;font-family:var(--mono);font-size:13px;
             line-height:1.7;pointer-events:none;white-space:pre-wrap;word-break:break-all;
             border-radius:6px;overflow:hidden"></div>
    <textarea id="rx-test" spellcheck="false"
      placeholder="Type or paste text to test your regex against..."
      style="width:100%;min-height:150px;background:transparent;border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:transparent;caret-color:var(--text2);
             font-family:var(--mono);font-size:13px;outline:none;resize:vertical;line-height:1.7;
             position:relative;z-index:1;transition:border-color .12s"></textarea>
  </div>
</div>

<!-- Tabs -->
<div style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap">
  <button class="btn btn-sm rx-tab active" data-tab="matches">🎯 Matches</button>
  <button class="btn btn-sm rx-tab"        data-tab="groups">📦 Groups</button>
  <button class="btn btn-sm rx-tab"        data-tab="replace">🔄 Replace</button>
  <button class="btn btn-sm rx-tab"        data-tab="split">✂ Split</button>
  <button class="btn btn-sm rx-tab"        data-tab="cheatsheet">📖 Cheat Sheet</button>
</div>

<!-- Matches tab -->
<div id="rx-pane-matches" class="rx-pane">
  <div id="rx-matches-out" class="card" style="min-height:80px"></div>
</div>

<!-- Groups tab -->
<div id="rx-pane-groups" class="rx-pane" style="display:none">
  <div id="rx-groups-out" class="card" style="min-height:80px"></div>
</div>

<!-- Replace tab -->
<div id="rx-pane-replace" class="rx-pane" style="display:none">
  <div class="card">
    <div class="card-hdr">Replacement</div>
    <div class="row" style="align-items:flex-end;gap:8px;margin-bottom:12px">
      <div class="field">
        <span class="f-label">REPLACEMENT STRING</span>
        <input type="text" id="rx-replace-str" placeholder="$1 $2 or literal text"
          style="font-family:var(--mono);font-size:13px">
      </div>
      <button class="btn btn-sm btn-blue" id="rx-do-replace" style="flex-shrink:0">Replace</button>
    </div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:10px">
      Use $1, $2... for capture groups · $&amp; for full match · $\` for before · $' for after
    </div>
    <div id="rx-replace-out" style="display:none">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <span class="card-hdr" style="margin-bottom:0">Result</span>
        <button class="btn btn-sm" id="rx-copy-replace">⎘ Copy</button>
      </div>
      <pre id="rx-replace-pre" style="background:var(--bg);border:1px solid var(--border);
        border-radius:6px;padding:10px 12px;font-family:var(--mono);font-size:12px;
        color:var(--text2);white-space:pre-wrap;word-break:break-all;max-height:300px;
        overflow-y:auto;margin:0"></pre>
    </div>
  </div>
</div>

<!-- Split tab -->
<div id="rx-pane-split" class="rx-pane" style="display:none">
  <div id="rx-split-out" class="card" style="min-height:80px"></div>
</div>

<!-- Cheat Sheet tab -->
<div id="rx-pane-cheatsheet" class="rx-pane" style="display:none">
  <div class="card">
    <div class="card-hdr">Regex Quick Reference</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:0">
      ${[
        ['Anchors', [
          ['^','Start of string / line (with m)'],
          ['$','End of string / line (with m)'],
          ['\\b','Word boundary'],
          ['\\B','Non-word boundary'],
        ]],
        ['Character Classes', [
          ['[abc]','Any of: a, b, c'],
          ['[^abc]','Not: a, b, c'],
          ['[a-z]','Range: a through z'],
          ['.','Any char except newline (\\n)'],
          ['\\w','Word char: [a-zA-Z0-9_]'],
          ['\\W','Non-word char'],
          ['\\d','Digit: [0-9]'],
          ['\\D','Non-digit'],
          ['\\s','Whitespace: space, tab, newline'],
          ['\\S','Non-whitespace'],
        ]],
        ['Quantifiers', [
          ['a*','0 or more of a (greedy)'],
          ['a+','1 or more of a (greedy)'],
          ['a?','0 or 1 of a'],
          ['a{3}','Exactly 3 of a'],
          ['a{2,5}','2 to 5 of a'],
          ['a{2,}','2 or more of a'],
          ['a*?','0 or more (lazy)'],
          ['a+?','1 or more (lazy)'],
        ]],
        ['Groups & Lookaround', [
          ['(abc)','Capture group'],
          ['(?:abc)','Non-capturing group'],
          ['(?<name>abc)','Named capture group'],
          ['(?=abc)','Positive lookahead'],
          ['(?!abc)','Negative lookahead'],
          ['(?<=abc)','Positive lookbehind'],
          ['(?<!abc)','Negative lookbehind'],
          ['a|b','Alternation: a or b'],
        ]],
        ['Escapes', [
          ['\\n','Newline'],
          ['\\t','Tab'],
          ['\\r','Carriage return'],
          ['\\0','Null character'],
          ['\\uXXXX','Unicode code point'],
          ['\\\\','Literal backslash'],
          ['\\.','Literal dot'],
        ]],
        ['Flags', [
          ['g','Global — find all matches'],
          ['i','Case insensitive'],
          ['m','Multiline — ^ and $ per line'],
          ['s','Dot matches newlines (dotAll)'],
          ['u','Unicode mode'],
          ['y','Sticky — match from lastIndex'],
        ]],
      ].map(([cat, rows]) => `
        <div style="padding:10px 12px;border-bottom:1px solid var(--border)">
          <div style="font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;
            color:var(--accent);margin-bottom:8px">${cat}</div>
          ${rows.map(([pat, desc]) => `
            <div style="display:flex;gap:10px;margin-bottom:5px;align-items:baseline">
              <code class="rx-ref-code" data-pattern="${pat.replace(/"/g,'&quot;')}">${pat.replace(/</g,'&lt;')}</code>
              <span style="font-family:var(--mono);font-size:10px;color:var(--muted)">${desc}</span>
            </div>`).join('')}
        </div>`).join('')}
    </div>
  </div>
</div>`;

  const q = id => el.querySelector('#' + id);

  // ── Highlight colors for matches (cycle) ───────────────────────────────────
  const COLORS = [
    'rgba(74,158,255,.25)', 'rgba(24,224,112,.22)', 'rgba(245,166,35,.25)',
    'rgba(224,85,85,.22)', 'rgba(180,74,255,.22)', 'rgba(255,180,0,.2)',
  ];

  // ── Flag toggle buttons ────────────────────────────────────────────────────
  el.querySelectorAll('.rx-flag-btn').forEach(btn => {
    const flag = btn.dataset.flag;
    updateFlagBtn(btn, flag);
    btn.addEventListener('click', () => {
      const flags = q('rx-flags').value;
      q('rx-flags').value = flags.includes(flag)
        ? flags.replace(flag, '')
        : flags + flag;
      updateFlagBtn(btn, flag);
      run();
    });
  });
  function updateFlagBtn(btn, flag) {
    const active = q('rx-flags').value.includes(flag);
    btn.style.background    = active ? 'var(--accent-dim)' : '';
    btn.style.borderColor   = active ? 'var(--accent)' : '';
    btn.style.color         = active ? 'var(--accent)' : '';
  }
  q('rx-flags').addEventListener('input', () => {
    el.querySelectorAll('.rx-flag-btn').forEach(b => updateFlagBtn(b, b.dataset.flag));
    run();
  });

  // ── Tabs ───────────────────────────────────────────────────────────────────
  el.querySelectorAll('.rx-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      el.querySelectorAll('.rx-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      el.querySelectorAll('.rx-pane').forEach(p => p.style.display = 'none');
      q('rx-pane-' + tab.dataset.tab).style.display = '';
      run();
    });
  });

  // ── Live run ───────────────────────────────────────────────────────────────
  q('rx-pattern').addEventListener('input', run);
  q('rx-flags').addEventListener('input', run);
  q('rx-test').addEventListener('input', () => { syncHighlight(); run(); });
  q('rx-test').addEventListener('scroll', syncScroll);

  // ── Paste / copy / clear ──────────────────────────────────────────────────
  q('rx-paste-test').addEventListener('click', () =>
    navigator.clipboard.readText().then(t => { q('rx-test').value = t; syncHighlight(); run(); })
  );
  q('rx-clear').addEventListener('click', () => {
    q('rx-pattern').value = ''; q('rx-test').value = '';
    q('rx-flags').value = 'gm';
    q('rx-pattern-err').style.display = 'none';
    q('rx-highlight-layer').innerHTML = '';
    q('rx-match-count').textContent = '';
    q('rx-matches-out').innerHTML = '';
    q('rx-groups-out').innerHTML = '';
    q('rx-split-out').innerHTML = '';
    q('rx-replace-out').style.display = 'none';
    el.querySelectorAll('.rx-flag-btn').forEach(b => updateFlagBtn(b, b.dataset.flag));
  });
  q('rx-copy-regex').addEventListener('click', () => {
    const p = q('rx-pattern').value, f = q('rx-flags').value;
    if (!p) { notify('Pattern is empty'); return; }
    copyText(`/${p}/${f}`, 'regex');
  });

  // ── Highlight layer sync ───────────────────────────────────────────────────
  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'\n');
  }

  function syncScroll() {
    const t = q('rx-test'), hl = q('rx-highlight-layer');
    hl.scrollTop  = t.scrollTop;
    hl.scrollLeft = t.scrollLeft;
  }

  function buildHighlight(text, matches) {
    if (!matches.length) return `<span style="color:var(--bg)">${esc(text)}</span>`;
    let result = '', pos = 0;
    matches.forEach((m, mi) => {
      const start = m.index, end = start + m[0].length;
      if (start > pos) result += `<span style="color:var(--bg)">${esc(text.slice(pos, start))}</span>`;
      const bg = COLORS[mi % COLORS.length];
      result += `<mark style="background:${bg};border-radius:2px;color:transparent;font-style:normal">${esc(m[0])}</mark>`;
      pos = end;
    });
    if (pos < text.length) result += `<span style="color:var(--bg)">${esc(text.slice(pos))}</span>`;
    return result;
  }

  function syncHighlight(matches = []) {
    const t   = q('rx-test');
    const hl  = q('rx-highlight-layer');
    const txt = t.value;
    hl.innerHTML = buildHighlight(txt, matches);
    // Match textarea dimensions
    hl.style.height = t.style.height || '';
    syncScroll();
  }

  // ── Build regex ────────────────────────────────────────────────────────────
  function buildRegex() {
    const pattern = q('rx-pattern').value;
    const flags   = q('rx-flags').value.replace(/[^gimsuy]/g, '');
    if (!pattern) return null;
    return new RegExp(pattern, flags);
  }

  // ── Main run ───────────────────────────────────────────────────────────────
  function run() {
    const pattern = q('rx-pattern').value;
    const text    = q('rx-test').value;
    const errEl   = q('rx-pattern-err');
    errEl.style.display = 'none';
    q('rx-input-wrap').style.borderColor = '';

    if (!pattern) {
      syncHighlight();
      q('rx-match-count').textContent = '';
      renderMatchesTab([]);
      return;
    }

    let re;
    try {
      re = buildRegex();
    } catch (e) {
      errEl.textContent = '✕ ' + e.message;
      errEl.style.display = 'block';
      q('rx-input-wrap').style.borderColor = 'var(--red)';
      syncHighlight();
      q('rx-match-count').textContent = '';
      return;
    }

    q('rx-input-wrap').style.borderColor = 'var(--accent)';

    // Collect all matches
    const matches = [];
    if (text) {
      const safeRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      let m;
      while ((m = safeRe.exec(text)) !== null) {
        matches.push(m);
        if (!re.flags.includes('g') || m[0].length === 0) break;
        if (matches.length > 500) { notify('Over 500 matches — stopping'); break; }
      }
    }

    syncHighlight(matches);
    q('rx-match-count').textContent = matches.length
      ? `${matches.length} match${matches.length > 1 ? 'es' : ''}`
      : text ? '0 matches' : '';

    // Update active tab
    const activeTab = el.querySelector('.rx-tab.active')?.dataset.tab || 'matches';
    if (activeTab === 'matches')  renderMatchesTab(matches);
    if (activeTab === 'groups')   renderGroupsTab(matches, re);
    if (activeTab === 'split')    renderSplitTab(re, text);
    if (activeTab === 'replace')  { /* on button click */ }
  }

  // ── Matches tab ────────────────────────────────────────────────────────────
  function renderMatchesTab(matches) {
    const out = q('rx-matches-out');
    if (!matches.length) {
      out.innerHTML = '<div style="font-family:var(--mono);font-size:12px;color:var(--muted);padding:8px">No matches.</div>';
      return;
    }
    out.innerHTML = `
      <div class="card-hdr" style="margin-bottom:10px">${matches.length} Match${matches.length>1?'es':''}</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:12px">
          <thead>
            <tr style="border-bottom:2px solid var(--border)">
              <th style="padding:5px 10px;text-align:left;color:var(--muted);font-size:9px;letter-spacing:1px">#</th>
              <th style="padding:5px 10px;text-align:left;color:var(--muted);font-size:9px;letter-spacing:1px">MATCH</th>
              <th style="padding:5px 10px;text-align:left;color:var(--muted);font-size:9px;letter-spacing:1px">INDEX</th>
              <th style="padding:5px 10px;text-align:left;color:var(--muted);font-size:9px;letter-spacing:1px">LENGTH</th>
              <th style="padding:5px 10px;text-align:left;color:var(--muted);font-size:9px;letter-spacing:1px"></th>
            </tr>
          </thead>
          <tbody>
            ${matches.map((m, i) => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:6px 10px;color:var(--muted)">${i+1}</td>
                <td style="padding:6px 10px;color:var(--text2)">
                  <span style="background:${COLORS[i%COLORS.length]};border-radius:3px;padding:1px 6px">${esc(m[0]) || '&lt;empty&gt;'}</span>
                </td>
                <td style="padding:6px 10px;color:var(--muted2)">${m.index}–${m.index+m[0].length}</td>
                <td style="padding:6px 10px;color:var(--muted2)">${m[0].length}</td>
                <td style="padding:6px 10px">
                  <button class="btn btn-sm rx-copy-match" data-val="${m[0].replace(/"/g,'&quot;')}"
                    style="font-size:10px;padding:2px 7px">⎘</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    out.querySelectorAll('.rx-copy-match').forEach(btn =>
      btn.addEventListener('click', () => copyText(btn.dataset.val, 'match'))
    );
  }

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ── Groups tab ─────────────────────────────────────────────────────────────
  function renderGroupsTab(matches, re) {
    const out = q('rx-groups-out');
    const hasGroups = matches.some(m => m.length > 1);
    if (!matches.length) {
      out.innerHTML = '<div style="font-family:var(--mono);font-size:12px;color:var(--muted);padding:8px">No matches.</div>';
      return;
    }
    if (!hasGroups) {
      out.innerHTML = '<div style="font-family:var(--mono);font-size:12px;color:var(--muted);padding:8px">No capture groups in pattern. Use <code>(group)</code> to capture.</div>';
      return;
    }
    out.innerHTML = matches.map((m, mi) => {
      const groups = Array.from({length: m.length - 1}, (_, i) => {
        const name = m.groups ? Object.entries(m.groups).find(([,v])=>v===m[i+1])?.[0] : null;
        return `<div style="display:flex;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:12px">
          <span style="color:var(--muted);min-width:60px">$${i+1}${name?` <em style="color:var(--blue)">(${name})</em>`:''}</span>
          <span style="color:var(--text2)">${m[i+1] !== undefined ? `<span style="background:rgba(24,224,112,.15);border-radius:3px;padding:1px 6px">${esc(m[i+1])}</span>` : '<span style="color:var(--muted)">undefined</span>'}</span>
        </div>`;
      }).join('');
      return `<div class="card-hdr" style="margin-bottom:8px">Match ${mi+1}: <span style="color:var(--text2)">${esc(m[0])}</span></div>${groups}`;
    }).join('<div style="margin:10px 0;border-top:2px solid var(--border)"></div>');
  }

  // ── Split tab ──────────────────────────────────────────────────────────────
  function renderSplitTab(re, text) {
    const out = q('rx-split-out');
    if (!text || !re) { out.innerHTML = '<div style="font-family:var(--mono);font-size:12px;color:var(--muted);padding:8px">Enter a pattern and test string.</div>'; return; }
    try {
      const splitRe = new RegExp(re.source, re.flags.replace(/g/,''));
      const parts   = text.split(splitRe);
      out.innerHTML = `
        <div class="card-hdr" style="margin-bottom:10px">Split into ${parts.length} part${parts.length!==1?'s':''}</div>
        ${parts.map((p, i) => `
          <div style="display:flex;gap:10px;padding:6px 0;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:12px;align-items:center">
            <span style="color:var(--muted);min-width:28px">[${i}]</span>
            <span style="color:var(--text2);flex:1;word-break:break-all">${p !== undefined ? esc(p) || '&lt;empty&gt;' : '<em style="color:var(--muted)">undefined</em>'}</span>
          </div>`).join('')}`;
    } catch(e) {
      out.innerHTML = `<div style="color:var(--red);font-family:var(--mono);font-size:12px">✕ ${e.message}</div>`;
    }
  }

  // ── Replace ────────────────────────────────────────────────────────────────
  q('rx-do-replace').addEventListener('click', () => {
    const text = q('rx-test').value;
    const repl = q('rx-replace-str').value;
    if (!text) { notify('Test string is empty'); return; }
    let re;
    try { re = buildRegex(); } catch(e) { notify('Regex error: '+e.message); return; }
    if (!re) { notify('Enter a pattern'); return; }
    const result = text.replace(re, repl);
    q('rx-replace-pre').textContent = result;
    q('rx-replace-out').style.display = 'block';
  });
  q('rx-copy-replace').addEventListener('click', () => {
    copyText(q('rx-replace-pre').textContent, 'replaced text');
  });

  // ── Cheat sheet: click to insert ──────────────────────────────────────────
  el.querySelectorAll('.rx-ref-code').forEach(code => {
    code.style.cursor = 'pointer';
    code.title = 'Click to insert';
    code.addEventListener('click', () => {
      const pat  = code.dataset.pattern;
      const inp  = q('rx-pattern');
      const pos  = inp.selectionStart;
      inp.setRangeText(pat, pos, inp.selectionEnd, 'end');
      inp.focus();
      run();
    });
  });

  run();
}