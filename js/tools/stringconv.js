export function renderStringConv(el, { copyText, notify }) {
  el.innerHTML = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="sc-grid">
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0">INPUT</div>
      <div style="display:flex;gap:5px">
        <button class="btn btn-sm" id="sc-paste">⎘ Paste</button>
        <button class="btn btn-sm btn-danger" id="sc-clear">✕</button>
      </div>
    </div>
    <textarea id="sc-input" spellcheck="false" placeholder="Enter string..."
      style="flex:1;min-height:140px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s"></textarea>
  </div>
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0">OUTPUT</div>
      <div style="display:flex;gap:5px">
        <button class="btn btn-sm btn-blue" id="sc-copy">⎘ Copy</button>
        <button class="btn btn-sm" id="sc-apply">↩ Apply</button>
      </div>
    </div>
    <textarea id="sc-output" readonly spellcheck="false"
      style="flex:1;min-height:140px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.7;opacity:.9"></textarea>
  </div>
</div>

<div class="card" style="margin-top:14px">
  <div class="card-hdr">Conversions</div>

  <div class="sc-section">
    <div class="sc-section-title">Case Conversion</div>
    <div class="sc-btns">
      <button class="btn btn-sm sc-op" data-op="upper">UPPER CASE</button>
      <button class="btn btn-sm sc-op" data-op="lower">lower case</button>
      <button class="btn btn-sm sc-op" data-op="title">Title Case</button>
      <button class="btn btn-sm sc-op" data-op="sentence">Sentence case</button>
      <button class="btn btn-sm sc-op" data-op="toggle">tOGGLE cASE</button>
      <button class="btn btn-sm sc-op" data-op="camel">camelCase</button>
      <button class="btn btn-sm sc-op" data-op="pascal">PascalCase</button>
      <button class="btn btn-sm sc-op" data-op="snake">snake_case</button>
      <button class="btn btn-sm sc-op" data-op="kebab">kebab-case</button>
      <button class="btn btn-sm sc-op" data-op="screaming">SCREAMING_SNAKE</button>
      <button class="btn btn-sm sc-op" data-op="dot">dot.case</button>
      <button class="btn btn-sm sc-op" data-op="path">path/case</button>
      <button class="btn btn-sm sc-op" data-op="constant">CONSTANT_CASE</button>
    </div>
  </div>

  <div class="sc-section">
    <div class="sc-section-title">Encode / Decode</div>
    <div class="sc-btns">
      <button class="btn btn-sm sc-op" data-op="b64enc">Base64 Encode</button>
      <button class="btn btn-sm sc-op" data-op="b64dec">Base64 Decode</button>
      <button class="btn btn-sm sc-op" data-op="urlenc">URL Encode</button>
      <button class="btn btn-sm sc-op" data-op="urldec">URL Decode</button>
      <button class="btn btn-sm sc-op" data-op="htmlenc">HTML Encode</button>
      <button class="btn btn-sm sc-op" data-op="htmldec">HTML Decode</button>
      <button class="btn btn-sm sc-op" data-op="hexenc">→ Hex</button>
      <button class="btn btn-sm sc-op" data-op="hexdec">Hex →</button>
      <button class="btn btn-sm sc-op" data-op="binenc">→ Binary</button>
      <button class="btn btn-sm sc-op" data-op="bindec">Binary →</button>
      <button class="btn btn-sm sc-op" data-op="rot13">ROT13</button>
      <button class="btn btn-sm sc-op" data-op="morse">→ Morse</button>
      <button class="btn btn-sm sc-op" data-op="unmorseop">Morse →</button>
    </div>
  </div>

  <div class="sc-section">
    <div class="sc-section-title">Format &amp; Clean</div>
    <div class="sc-btns">
      <button class="btn btn-sm sc-op" data-op="trim">Trim</button>
      <button class="btn btn-sm sc-op" data-op="collapse">Collapse spaces</button>
      <button class="btn btn-sm sc-op" data-op="nospaces">Remove spaces</button>
      <button class="btn btn-sm sc-op" data-op="reverse">Reverse string</button>
      <button class="btn btn-sm sc-op" data-op="reversewords">Reverse words</button>
      <button class="btn btn-sm sc-op" data-op="slugify">Slugify</button>
      <button class="btn btn-sm sc-op" data-op="truncate">Truncate…</button>
      <button class="btn btn-sm sc-op" data-op="padleft">Pad left</button>
      <button class="btn btn-sm sc-op" data-op="padright">Pad right</button>
      <button class="btn btn-sm sc-op" data-op="repeat">Repeat ×N</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;align-items:center">
      <label style="font-family:var(--mono);font-size:11px;color:var(--muted)">Length / N:</label>
      <input type="number" id="sc-num" value="50" min="1"
        style="width:70px;padding:5px 8px;font-size:12px">
      <label style="font-family:var(--mono);font-size:11px;color:var(--muted)">Pad char:</label>
      <input type="text" id="sc-padchar" value=" " maxlength="1"
        style="width:40px;padding:5px 8px;font-size:12px;font-family:var(--mono)">
    </div>
  </div>

  <div class="sc-section">
    <div class="sc-section-title">Inspect</div>
    <div class="sc-btns">
      <button class="btn btn-sm sc-op" data-op="count">Count chars</button>
      <button class="btn btn-sm sc-op" data-op="wordcount">Count words</button>
      <button class="btn btn-sm sc-op" data-op="bytesize">Byte size (UTF-8)</button>
      <button class="btn btn-sm sc-op" data-op="charlist">Char list</button>
      <button class="btn btn-sm sc-op" data-op="charfreq">Char frequency</button>
      <button class="btn btn-sm sc-op" data-op="checkpalindrome">Is palindrome?</button>
      <button class="btn btn-sm sc-op" data-op="checkpanagram">Is pangram?</button>
    </div>
  </div>
</div>`;

  const q = id => el.querySelector('#' + id);

  // ── Morse code tables ──────────────────────────────────────────────────────
  const MORSE_ENC = {
    A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',
    K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',
    U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
    '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
    '6':'-....','7':'--...','8':'---..','9':'----.',
    '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','-':'-....-',
    '/':'-..-.','@':'.--.-.','=':'-...-',' ':'/',
  };
  const MORSE_DEC = Object.fromEntries(Object.entries(MORSE_ENC).map(([k,v])=>[v,k]));

  // ── Word/char case helpers ─────────────────────────────────────────────────
  const words = s => s.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[-_./]/g,' ').trim().split(/\s+/);
  const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const OPS = {
    upper:    s => s.toUpperCase(),
    lower:    s => s.toLowerCase(),
    title:    s => s.toLowerCase().replace(/(?:^|\s)\S/g, c=>c.toUpperCase()),
    sentence: s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c=>c.toUpperCase()),
    toggle:   s => [...s].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join(''),
    camel:    s => words(s).map((w,i)=>i===0?w.toLowerCase():ucfirst(w)).join(''),
    pascal:   s => words(s).map(w=>ucfirst(w)).join(''),
    snake:    s => words(s).join('_').toLowerCase(),
    kebab:    s => words(s).join('-').toLowerCase(),
    screaming:s => words(s).join('_').toUpperCase(),
    dot:      s => words(s).join('.').toLowerCase(),
    path:     s => words(s).join('/').toLowerCase(),
    constant: s => words(s).join('_').toUpperCase(),

    b64enc: s => { try { return btoa(unescape(encodeURIComponent(s))); } catch { return '✕ Encode error'; } },
    b64dec: s => { try { return decodeURIComponent(escape(atob(s.trim()))); } catch { return '✕ Invalid Base64'; } },
    urlenc: s => encodeURIComponent(s),
    urldec: s => { try { return decodeURIComponent(s); } catch { return s; } },
    htmlenc: s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'),
    htmldec: s => { const t=document.createElement('textarea'); t.innerHTML=s; return t.value; },
    hexenc:  s => [...new TextEncoder().encode(s)].map(b=>b.toString(16).padStart(2,'0')).join(' '),
    hexdec:  s => {
      try {
        const bytes = s.replace(/\s/g,'').match(/.{1,2}/g)||[];
        return new TextDecoder().decode(new Uint8Array(bytes.map(b=>parseInt(b,16))));
      } catch { return '✕ Invalid hex'; }
    },
    binenc: s => [...new TextEncoder().encode(s)].map(b=>b.toString(2).padStart(8,'0')).join(' '),
    bindec: s => {
      try {
        const bytes = s.trim().split(/\s+/).map(b=>parseInt(b,2));
        return new TextDecoder().decode(new Uint8Array(bytes));
      } catch { return '✕ Invalid binary'; }
    },
    rot13: s => s.replace(/[a-zA-Z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
    }),
    morse: s => s.toUpperCase().split('').map(c => MORSE_ENC[c] || '?').join(' '),
    unmorseop: s => s.trim().split('   ').map(word =>
      word.split(' ').map(code => MORSE_DEC[code] || '?').join('')
    ).join(' '),

    trim:         s => s.trim(),
    collapse:     s => s.replace(/\s+/g,' ').trim(),
    nospaces:     s => s.replace(/\s/g,''),
    reverse:      s => [...s].reverse().join(''),
    reversewords: s => s.split(/\s+/).reverse().join(' '),
    slugify:      s => s.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').replace(/^-+|-+$/g,''),
    truncate:     (s,n) => s.length > n ? s.slice(0,n)+'…' : s,
    padleft:      (s,n,ch) => s.padStart(n, ch||' '),
    padright:     (s,n,ch) => s.padEnd(n, ch||' '),
    repeat:       (s,n) => s.repeat(Math.min(n,100)),

    count:        s => `Length: ${s.length} characters`,
    wordcount:    s => `Words: ${s.trim()?s.trim().split(/\s+/).length:0}`,
    bytesize:     s => `${new TextEncoder().encode(s).length} bytes (UTF-8)`,
    charlist:     s => [...new Set(s)].sort().map(c=>c===' '?'[space]':c).join(', '),
    charfreq:     s => {
      const map = new Map();
      [...s].forEach(c => map.set(c,(map.get(c)||0)+1));
      return [...map.entries()].sort((a,b)=>b[1]-a[1])
        .map(([c,n])=>`${n}× ${c===' '?'[space]':c}`).join('\n');
    },
    checkpalindrome: s => {
      const clean = s.toLowerCase().replace(/[^a-z0-9]/g,'');
      return clean === [...clean].reverse().join('')
        ? `✓ "${s}" is a palindrome`
        : `✕ Not a palindrome`;
    },
    checkpanagram: s => {
      const letters = new Set(s.toLowerCase().replace(/[^a-z]/g,''));
      const missing = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c=>!letters.has(c));
      return missing.length === 0
        ? `✓ Pangram! Contains all 26 letters`
        : `✕ Not a pangram. Missing: ${missing.join(', ')}`;
    },
  };

  el.querySelectorAll('.sc-op').forEach(btn => {
    btn.addEventListener('click', () => {
      const s   = q('sc-input').value;
      const op  = btn.dataset.op;
      const fn  = OPS[op];
      if (!fn) return;
      const n   = parseInt(q('sc-num').value) || 50;
      const ch  = q('sc-padchar').value || ' ';
      const result = fn(s, n, ch);
      q('sc-output').value = result;
    });
  });

  q('sc-paste').addEventListener('click', () =>
    navigator.clipboard.readText().then(t => { q('sc-input').value = t; })
  );
  q('sc-clear').addEventListener('click', () => {
    q('sc-input').value = ''; q('sc-output').value = '';
  });
  q('sc-copy').addEventListener('click', () => {
    const v = q('sc-output').value;
    if (!v.trim()) { notify('Output is empty'); return; }
    copyText(v, 'string');
  });
  q('sc-apply').addEventListener('click', () => {
    const v = q('sc-output').value;
    if (!v.trim()) { notify('Output is empty'); return; }
    q('sc-input').value = v;
    q('sc-output').value = '';
  });

  if (window.innerWidth <= 768) q('sc-grid').style.gridTemplateColumns = '1fr';
}