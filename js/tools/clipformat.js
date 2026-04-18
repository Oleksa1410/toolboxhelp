export function renderClipFormat(el, { copyText, notify }) {

  el.innerHTML = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="cf-grid">

  <!-- INPUT -->
  <div style="display:flex;flex-direction:column;gap:14px">
    <div class="card" style="margin-bottom:0;flex:1;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-hdr" style="margin-bottom:0">INPUT</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" id="clf-paste">⎘ Paste</button>
          <button class="btn btn-sm btn-danger" id="clf-clear">✕</button>
        </div>
      </div>
      <textarea id="clf-input" spellcheck="false"
        placeholder="Paste or type your text here..."
        style="flex:1;min-height:220px;width:100%;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:13px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s">
      </textarea>
      <div style="margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--muted)" id="clf-input-stats"></div>
    </div>
  </div>

  <!-- OUTPUT -->
  <div style="display:flex;flex-direction:column;gap:14px">
    <div class="card" style="margin-bottom:0;flex:1;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-hdr" style="margin-bottom:0">OUTPUT</div>
        <button class="btn btn-sm btn-blue" id="clf-copy-out">⎘ Copy</button>
      </div>
      <textarea id="clf-output" readonly spellcheck="false"
        style="flex:1;min-height:220px;width:100%;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:13px;outline:none;resize:vertical;line-height:1.7;opacity:.9">
      </textarea>
      <div style="margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--muted)" id="clf-output-stats"></div>
    </div>
  </div>
</div>

<!-- Transformations toolbar -->
<div class="card" style="margin-top:14px">
  <div class="card-hdr">Transformations</div>

  <!-- Case -->
  <div class="clf-group">
    <div class="clf-group-label">Case</div>
    <div class="clf-btns">
      <button class="btn btn-sm clf-op" data-op="upper"       title="UPPERCASE">ABC</button>
      <button class="btn btn-sm clf-op" data-op="lower"       title="lowercase">abc</button>
      <button class="btn btn-sm clf-op" data-op="title"       title="Title Case">Title</button>
      <button class="btn btn-sm clf-op" data-op="sentence"    title="Sentence case">Sent.</button>
      <button class="btn btn-sm clf-op" data-op="camel"       title="camelCase">camel</button>
      <button class="btn btn-sm clf-op" data-op="pascal"      title="PascalCase">Pascal</button>
      <button class="btn btn-sm clf-op" data-op="snake"       title="snake_case">snake</button>
      <button class="btn btn-sm clf-op" data-op="kebab"       title="kebab-case">kebab</button>
      <button class="btn btn-sm clf-op" data-op="scream"      title="SCREAMING_SNAKE">SCREAM</button>
      <button class="btn btn-sm clf-op" data-op="dot"         title="dot.case">dot</button>
      <button class="btn btn-sm clf-op" data-op="path"        title="path/case">path</button>
      <button class="btn btn-sm clf-op" data-op="constant"    title="CONSTANT_CASE">CONST</button>
    </div>
  </div>

  <!-- Whitespace -->
  <div class="clf-group">
    <div class="clf-group-label">Whitespace</div>
    <div class="clf-btns">
      <button class="btn btn-sm clf-op" data-op="trim"        title="Trim leading/trailing spaces">Trim</button>
      <button class="btn btn-sm clf-op" data-op="collapse"    title="Collapse multiple spaces to one">Collapse</button>
      <button class="btn btn-sm clf-op" data-op="remove_spaces" title="Remove all spaces">No spaces</button>
      <button class="btn btn-sm clf-op" data-op="trim_lines"  title="Trim each line">Trim lines</button>
      <button class="btn btn-sm clf-op" data-op="remove_blank_lines" title="Remove blank lines">No blank lines</button>
      <button class="btn btn-sm clf-op" data-op="single_line" title="Join all lines into one">Single line</button>
      <button class="btn btn-sm clf-op" data-op="normalize"   title="Normalize whitespace">Normalize</button>
    </div>
  </div>

  <!-- Lines -->
  <div class="clf-group">
    <div class="clf-group-label">Lines</div>
    <div class="clf-btns">
      <button class="btn btn-sm clf-op" data-op="sort_asc"    title="Sort lines A→Z">Sort A→Z</button>
      <button class="btn btn-sm clf-op" data-op="sort_desc"   title="Sort lines Z→A">Sort Z→A</button>
      <button class="btn btn-sm clf-op" data-op="sort_len"    title="Sort by length">By length</button>
      <button class="btn btn-sm clf-op" data-op="reverse_lines" title="Reverse line order">Reverse</button>
      <button class="btn btn-sm clf-op" data-op="unique"      title="Remove duplicate lines">Unique</button>
      <button class="btn btn-sm clf-op" data-op="shuffle"     title="Shuffle lines randomly">Shuffle</button>
      <button class="btn btn-sm clf-op" data-op="number_lines" title="Add line numbers">Num. lines</button>
    </div>
  </div>

  <!-- Add / Remove -->
  <div class="clf-group">
    <div class="clf-group-label">Add / Remove</div>
    <div class="clf-btns" style="align-items:flex-end;flex-wrap:wrap;gap:6px">
      <div style="display:flex;align-items:center;gap:4px">
        <input type="text" id="clf-prefix-val" placeholder="prefix" style="width:80px;padding:5px 8px;font-size:12px;font-family:var(--mono)">
        <button class="btn btn-sm clf-op" data-op="add_prefix" title="Add prefix to each line">+ Prefix</button>
      </div>
      <div style="display:flex;align-items:center;gap:4px">
        <input type="text" id="clf-suffix-val" placeholder="suffix" style="width:80px;padding:5px 8px;font-size:12px;font-family:var(--mono)">
        <button class="btn btn-sm clf-op" data-op="add_suffix" title="Add suffix to each line">+ Suffix</button>
      </div>
      <button class="btn btn-sm clf-op" data-op="remove_punct"   title="Remove punctuation">No punct.</button>
      <button class="btn btn-sm clf-op" data-op="remove_numbers" title="Remove all digits">No numbers</button>
      <button class="btn btn-sm clf-op" data-op="remove_html"    title="Strip HTML tags">Strip HTML</button>
      <button class="btn btn-sm clf-op" data-op="remove_emoji"   title="Remove emoji">No emoji</button>
      <button class="btn btn-sm clf-op" data-op="remove_urls"    title="Remove URLs">No URLs</button>
      <button class="btn btn-sm clf-op" data-op="extract_urls"   title="Extract all URLs">URLs only</button>
      <button class="btn btn-sm clf-op" data-op="extract_emails" title="Extract all emails">Emails</button>
      <button class="btn btn-sm clf-op" data-op="extract_numbers" title="Extract all numbers">Numbers</button>
    </div>
  </div>

  <!-- Find & Replace -->
  <div class="clf-group">
    <div class="clf-group-label">Find &amp; Replace</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <input type="text" id="clf-find"    placeholder="Find..."    style="flex:1;min-width:120px;padding:7px 10px;font-size:12px;font-family:var(--mono)">
      <input type="text" id="clf-replace" placeholder="Replace..." style="flex:1;min-width:120px;padding:7px 10px;font-size:12px;font-family:var(--mono)">
      <label style="display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:11px;color:var(--text);cursor:pointer;white-space:nowrap">
        <input type="checkbox" id="clf-regex" style="accent-color:var(--accent)"> Regex
      </label>
      <label style="display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:11px;color:var(--text);cursor:pointer;white-space:nowrap">
        <input type="checkbox" id="clf-case-sensitive" style="accent-color:var(--accent)"> Case
      </label>
      <button class="btn btn-sm btn-blue clf-op" data-op="find_replace">Replace</button>
    </div>
  </div>

  <!-- Encode / Decode -->
  <div class="clf-group">
    <div class="clf-group-label">Encode / Decode</div>
    <div class="clf-btns">
      <button class="btn btn-sm clf-op" data-op="html_encode"  title="Encode HTML entities">&amp;amp;</button>
      <button class="btn btn-sm clf-op" data-op="html_decode"  title="Decode HTML entities">HTML→</button>
      <button class="btn btn-sm clf-op" data-op="url_encode"   title="encodeURIComponent">URL enc</button>
      <button class="btn btn-sm clf-op" data-op="url_decode"   title="decodeURIComponent">URL dec</button>
      <button class="btn btn-sm clf-op" data-op="b64_encode"   title="Base64 encode">B64 enc</button>
      <button class="btn btn-sm clf-op" data-op="b64_decode"   title="Base64 decode">B64 dec</button>
      <button class="btn btn-sm clf-op" data-op="escape_json"  title="Escape for JSON string">JSON esc</button>
      <button class="btn btn-sm clf-op" data-op="unescape_json" title="Unescape JSON string">JSON unesc</button>
      <button class="btn btn-sm clf-op" data-op="escape_regex" title="Escape for use in regex">Regex esc</button>
    </div>
  </div>

  <!-- Format -->
  <div class="clf-group">
    <div class="clf-group-label">Format as</div>
    <div class="clf-btns">
      <button class="btn btn-sm clf-op" data-op="csv_to_json"   title="CSV to JSON array">CSV→JSON</button>
      <button class="btn btn-sm clf-op" data-op="lines_to_json" title="Lines to JSON array">Lines→JSON</button>
      <button class="btn btn-sm clf-op" data-op="lines_to_csv"  title="Lines to CSV row">Lines→CSV</button>
      <button class="btn btn-sm clf-op" data-op="lines_to_sql"  title="Lines to SQL IN ()">Lines→SQL</button>
      <button class="btn btn-sm clf-op" data-op="slugify"       title="Convert to URL slug">Slugify</button>
      <button class="btn btn-sm clf-op" data-op="wrap_quotes"   title='Wrap each line in "quotes"'>Wrap "…"</button>
      <button class="btn btn-sm clf-op" data-op="wrap_ticks"    title="Wrap each line in \`backticks\`">Wrap \`…\`</button>
      <button class="btn btn-sm clf-op" data-op="comma_join"    title="Join lines with comma">Comma join</button>
      <button class="btn btn-sm clf-op" data-op="pipe_join"     title="Join lines with |">Pipe join</button>
    </div>
  </div>

  <!-- History -->
  <div style="display:flex;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
    <button class="btn btn-sm" id="clf-undo">↩ Undo</button>
    <button class="btn btn-sm" id="clf-redo">↪ Redo</button>
    <button class="btn btn-sm" id="clf-swap">⇅ Swap I/O</button>
    <button class="btn btn-sm btn-blue" id="clf-copy-out2" style="margin-left:auto">⎘ Copy Output</button>
  </div>
</div>`;

  // ── State ──────────────────────────────────────────────────────────────────
  const q = id => el.querySelector('#' + id);
  let history = [''];
  let histIdx = 0;

  function getInput()  { return q('clf-input').value; }
  function setOutput(v) {
    q('clf-output').value = v;
    const lines = v ? v.split('\n').length : 0;
    const chars = v.length;
    q('clf-output-stats').textContent = v ? `${chars} chars · ${lines} lines` : '';
  }

  function pushHistory(v) {
    history = history.slice(0, histIdx + 1);
    history.push(v);
    histIdx = history.length - 1;
  }

  function applyTransform(v) {
    pushHistory(q('clf-input').value);
    q('clf-input').value = v;
    updateInputStats();
    setOutput('');
  }

  function updateInputStats() {
    const v = getInput();
    const words = v.trim() ? v.trim().split(/\s+/).length : 0;
    q('clf-input-stats').textContent = v ? `${v.length} chars · ${words} words · ${v.split('\n').length} lines` : '';
  }

  q('clf-input').addEventListener('input', updateInputStats);

  // ── Operations ─────────────────────────────────────────────────────────────

  // Case helpers
  const toWords = s => s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_./]/g, ' ').trim();

  const OPS = {
    upper:       s => s.toUpperCase(),
    lower:       s => s.toLowerCase(),
    title:       s => s.toLowerCase().replace(/(?:^|\s)\S/g, c => c.toUpperCase()),
    sentence:    s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
    camel:       s => toWords(s).toLowerCase().replace(/\s+(\w)/g, (_, c) => c.toUpperCase()),
    pascal:      s => toWords(s).toLowerCase().replace(/(?:^|\s+)(\w)/g, (_, c) => c.toUpperCase()).replace(/\s/g, ''),
    snake:       s => toWords(s).toLowerCase().replace(/\s+/g, '_'),
    kebab:       s => toWords(s).toLowerCase().replace(/\s+/g, '-'),
    scream:      s => toWords(s).toUpperCase().replace(/\s+/g, '_'),
    dot:         s => toWords(s).toLowerCase().replace(/\s+/g, '.'),
    path:        s => toWords(s).toLowerCase().replace(/\s+/g, '/'),
    constant:    s => toWords(s).toUpperCase().replace(/\s+/g, '_'),

    trim:        s => s.trim(),
    collapse:    s => s.replace(/[^\S\n]+/g, ' '),
    remove_spaces: s => s.replace(/ /g, ''),
    trim_lines:  s => s.split('\n').map(l => l.trim()).join('\n'),
    remove_blank_lines: s => s.split('\n').filter(l => l.trim()).join('\n'),
    single_line: s => s.replace(/\s+/g, ' ').trim(),
    normalize:   s => s.replace(/\s+/g, ' ').trim(),

    sort_asc:    s => s.split('\n').sort((a,b) => a.localeCompare(b)).join('\n'),
    sort_desc:   s => s.split('\n').sort((a,b) => b.localeCompare(a)).join('\n'),
    sort_len:    s => s.split('\n').sort((a,b) => a.length - b.length).join('\n'),
    reverse_lines: s => s.split('\n').reverse().join('\n'),
    unique:      s => [...new Set(s.split('\n'))].join('\n'),
    shuffle:     s => { const a = s.split('\n'); for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}; return a.join('\n'); },
    number_lines: s => s.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n'),

    remove_punct:   s => s.replace(/[^\w\s]/g, ''),
    remove_numbers: s => s.replace(/\d/g, ''),
    remove_html:    s => s.replace(/<[^>]*>/g, ''),
    remove_emoji:   s => s.replace(/\p{Emoji}/gu, ''),
    remove_urls:    s => s.replace(/https?:\/\/[^\s]*/g, '').replace(/\s{2,}/g, ' ').trim(),
    extract_urls:   s => (s.match(/https?:\/\/[^\s]*/g) || []).join('\n'),
    extract_emails: s => (s.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi) || []).join('\n'),
    extract_numbers:s => (s.match(/-?\d+(?:\.\d+)?/g) || []).join('\n'),

    add_prefix: s => {
      const p = q('clf-prefix-val').value;
      return s.split('\n').map(l => p + l).join('\n');
    },
    add_suffix: s => {
      const sf = q('clf-suffix-val').value;
      return s.split('\n').map(l => l + sf).join('\n');
    },

    html_encode:  s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'),
    html_decode:  s => { const t=document.createElement('textarea'); t.innerHTML=s; return t.value; },
    url_encode:   s => encodeURIComponent(s),
    url_decode:   s => { try { return decodeURIComponent(s); } catch { return s; } },
    b64_encode:   s => { try { return btoa(unescape(encodeURIComponent(s))); } catch { return s; } },
    b64_decode:   s => { try { return decodeURIComponent(escape(atob(s.trim()))); } catch { return '✕ Invalid Base64'; } },
    escape_json:  s => JSON.stringify(s).slice(1, -1),
    unescape_json:s => { try { return JSON.parse('"' + s + '"'); } catch { return s; } },
    escape_regex: s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),

    csv_to_json: s => {
      try {
        const lines = s.trim().split('\n').filter(Boolean);
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,''));
        const rows = lines.slice(1).map(l => {
          const vals = l.split(',').map(v => v.trim().replace(/^"|"$/g,''));
          return Object.fromEntries(headers.map((h,i) => [h, vals[i] ?? '']));
        });
        return JSON.stringify(rows, null, 2);
      } catch { return '✕ Could not parse CSV'; }
    },
    lines_to_json: s => JSON.stringify(s.split('\n').filter(l => l.trim()), null, 2),
    lines_to_csv:  s => s.split('\n').filter(l=>l.trim()).map(l => `"${l.replace(/"/g,'""')}"`).join(','),
    lines_to_sql:  s => {
      const items = s.split('\n').filter(l=>l.trim()).map(l => `'${l.replace(/'/g,"''")}'`).join(', ');
      return `(${items})`;
    },
    slugify:     s => s.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').replace(/^-+|-+$/g,''),
    wrap_quotes: s => s.split('\n').map(l => `"${l.replace(/"/g,'\\"')}"`).join('\n'),
    wrap_ticks:  s => s.split('\n').map(l => `\`${l}\``).join('\n'),
    comma_join:  s => s.split('\n').filter(l=>l.trim()).join(', '),
    pipe_join:   s => s.split('\n').filter(l=>l.trim()).join(' | '),

    find_replace: s => {
      const find    = q('clf-find').value;
      const replace = q('clf-replace').value;
      const useRx   = q('clf-regex').checked;
      const cs      = q('clf-case-sensitive').checked;
      if (!find) return s;
      try {
        if (useRx) {
          return s.replace(new RegExp(find, cs ? 'g' : 'gi'), replace);
        }
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return s.replace(new RegExp(escaped, cs ? 'g' : 'gi'), replace);
      } catch (e) {
        notify('Regex error: ' + e.message); return s;
      }
    },
  };

  // Apply operation: transforms INPUT → OUTPUT (non-destructive preview)
  // Double-click applies OUTPUT back to INPUT (chain)
  el.querySelectorAll('.clf-op').forEach(btn => {
    btn.addEventListener('click', () => {
      const op  = btn.dataset.op;
      const fn  = OPS[op];
      if (!fn) return;
      const src = getInput();
      if (!src.trim() && !['find_replace'].includes(op)) { notify('Input is empty'); return; }
      const result = fn(src);
      setOutput(result);
    });
    // Double-click: apply output → input (chain transforms)
    btn.addEventListener('dblclick', () => {
      const op = btn.dataset.op;
      const fn = OPS[op];
      if (!fn) return;
      const src = getInput();
      if (!src.trim()) return;
      const result = fn(src);
      applyTransform(result);
      setOutput('');
      notify('Applied to input (double-click)');
    });
  });

  // ── Copy / Paste / Swap ────────────────────────────────────────────────────
  q('clf-paste').addEventListener('click', () => {
    navigator.clipboard.readText().then(t => {
      q('clf-input').value = t;
      updateInputStats();
    }).catch(() => notify('Clipboard permission denied'));
  });

  q('clf-clear').addEventListener('click', () => {
    pushHistory(getInput());
    q('clf-input').value = '';
    q('clf-output').value = '';
    q('clf-input-stats').textContent = '';
    q('clf-output-stats').textContent = '';
  });

  function copyOut() {
    const v = q('clf-output').value || q('clf-input').value;
    if (!v.trim()) { notify('Nothing to copy'); return; }
    copyText(v, 'formatted text');
  }
  q('clf-copy-out').addEventListener('click',  copyOut);
  q('clf-copy-out2').addEventListener('click', copyOut);

  q('clf-swap').addEventListener('click', () => {
    const out = q('clf-output').value;
    if (!out.trim()) { notify('Output is empty — nothing to swap'); return; }
    pushHistory(getInput());
    q('clf-input').value  = out;
    q('clf-output').value = '';
    updateInputStats();
    q('clf-output-stats').textContent = '';
  });

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  q('clf-undo').addEventListener('click', () => {
    if (histIdx <= 0) { notify('Nothing to undo'); return; }
    histIdx--;
    q('clf-input').value = history[histIdx];
    updateInputStats();
  });
  q('clf-redo').addEventListener('click', () => {
    if (histIdx >= history.length - 1) { notify('Nothing to redo'); return; }
    histIdx++;
    q('clf-input').value = history[histIdx];
    updateInputStats();
  });

  // ── Keyboard shortcut Ctrl+Enter = copy output ────────────────────────────
  q('clf-input').addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') copyOut();
  });

  // ── Responsive ────────────────────────────────────────────────────────────
  if (window.innerWidth <= 768) {
    q('cf-grid').style.gridTemplateColumns = '1fr';
  }
}