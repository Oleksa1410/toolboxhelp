export function renderUuid(el, { copyText, notify }) {
  el.innerHTML = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="uuid-grid">

  <!-- Generator -->
  <div>
    <div class="card" style="margin-bottom:14px">
      <div class="card-hdr">Generate</div>
      <div class="row" style="align-items:flex-end;gap:10px;flex-wrap:wrap">
        <div class="field" style="max-width:130px">
          <span class="f-label">VERSION</span>
          <select id="uuid-version" style="font-family:var(--mono);font-size:13px">
            <option value="4" selected>v4 — Random</option>
            <option value="1">v1 — Timestamp</option>
            <option value="7">v7 — Timestamp+Random</option>
            <option value="nil">Nil UUID</option>
            <option value="max">Max UUID</option>
          </select>
        </div>
        <div class="field" style="max-width:100px">
          <span class="f-label">COUNT</span>
          <input type="number" id="uuid-count" value="1" min="1" max="1000">
        </div>
        <div class="field" style="max-width:130px">
          <span class="f-label">FORMAT</span>
          <select id="uuid-format" style="font-family:var(--mono);font-size:13px">
            <option value="standard">Standard</option>
            <option value="upper">UPPERCASE</option>
            <option value="nodash">No dashes</option>
            <option value="braces">{Braces}</option>
            <option value="urn">URN</option>
          </select>
        </div>
        <button class="btn btn-blue" id="uuid-gen-btn" style="flex-shrink:0">↺ GENERATE</button>
      </div>
      <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-blue" id="uuid-copy-all">⎘ Copy all</button>
        <button class="btn btn-sm" id="uuid-dl">⬇ .txt</button>
        <button class="btn btn-sm btn-danger" id="uuid-clear-out">✕</button>
      </div>
    </div>

    <!-- Output list -->
    <div class="card" style="margin-bottom:0">
      <div class="card-hdr">Generated UUIDs</div>
      <div id="uuid-list" style="font-family:var(--mono);font-size:13px;color:var(--muted2)">
        Click Generate to create UUIDs…
      </div>
    </div>
  </div>

  <!-- Inspector + Bulk -->
  <div style="display:flex;flex-direction:column;gap:14px">
    <!-- Inspector -->
    <div class="card" style="margin-bottom:0">
      <div class="card-hdr">Inspect UUID</div>
      <input type="text" id="uuid-inspect-in" spellcheck="false"
        placeholder="Paste a UUID to inspect..."
        style="width:100%;font-family:var(--mono);font-size:13px;margin-bottom:10px">
      <div id="uuid-inspect-out" style="font-family:var(--mono);font-size:12px;color:var(--muted2)"></div>
    </div>

    <!-- Bulk validate -->
    <div class="card" style="margin-bottom:0;flex:1;display:flex;flex-direction:column">
      <div class="card-hdr">Validate / Convert</div>
      <textarea id="uuid-bulk-in" spellcheck="false"
        placeholder="Paste UUIDs (one per line) to validate or convert..."
        style="flex:1;min-height:120px;width:100%;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:12px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s;
               margin-bottom:10px"></textarea>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-blue" id="uuid-bulk-validate">✓ Validate</button>
        <button class="btn btn-sm" id="uuid-bulk-convert">⇄ Convert format</button>
        <button class="btn btn-sm" id="uuid-bulk-copy">⎘ Copy result</button>
      </div>
      <div id="uuid-bulk-out" style="margin-top:10px;font-family:var(--mono);font-size:12px"></div>
    </div>
  </div>
</div>

<!-- About -->
<div class="card" style="margin-top:14px;background:var(--s2)">
  <div class="card-hdr">UUID Versions</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
    ${[
      ['v1','Time-based + MAC address. Sortable by time but leaks MAC.'],
      ['v4','Random. Most common. 122 bits of randomness. Not sortable.'],
      ['v7','Unix timestamp + random. K-sortable. Recommended for DBs.'],
      ['Nil','All zeros: 00000000-0000-0000-0000-000000000000'],
      ['Max','All ones: FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'],
    ].map(([v,d])=>`
      <div style="background:var(--s3);border:1px solid var(--border);border-radius:6px;padding:8px 12px">
        <div style="font-family:var(--mono);font-size:11px;color:var(--accent);font-weight:700;margin-bottom:3px">UUID ${v}</div>
        <div style="font-family:var(--mono);font-size:10px;color:var(--muted);line-height:1.5">${d}</div>
      </div>`).join('')}
  </div>
</div>`;

  const q = id => el.querySelector('#' + id);

  // ── UUID generators ────────────────────────────────────────────────────────

  function uuidv4() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(b=>b.toString(16).padStart(2,'0'));
    return `${hex.slice(0,4).join('')}-${hex.slice(4,6).join('')}-${hex.slice(6,8).join('')}-${hex.slice(8,10).join('')}-${hex.slice(10).join('')}`;
  }

  function uuidv1() {
    // Simplified v1: uses current timestamp + random node
    const now  = Date.now();
    const OFFSET = 122192928000000000n; // 100ns intervals from 1582-10-15 to 1970-01-01
    const ts   = BigInt(now) * 10000n + OFFSET;
    const tl   = Number(ts & 0xFFFFFFFFn).toString(16).padStart(8,'0');
    const tm   = Number((ts >> 32n) & 0xFFFFn).toString(16).padStart(4,'0');
    const th   = (Number((ts >> 48n) & 0x0FFFn) | 0x1000).toString(16).padStart(4,'0');
    const clockSeq = (Math.floor(Math.random()*0x3FFF)|0x8000).toString(16).padStart(4,'0');
    const node = [...crypto.getRandomValues(new Uint8Array(6))]
      .map(b=>b.toString(16).padStart(2,'0')).join('');
    return `${tl}-${tm}-${th}-${clockSeq}-${node}`;
  }

  function uuidv7() {
    // UUIDv7: Unix ms timestamp + random
    const ms  = BigInt(Date.now());
    const rnd = crypto.getRandomValues(new Uint8Array(10));
    const msHex = ms.toString(16).padStart(12,'0');
    const p1  = msHex.slice(0,8);
    const p2  = msHex.slice(8,12);
    // version 7 nibble
    const ver = (0x7000 | (rnd[0] & 0x0fff)).toString(16).padStart(4,'0');
    const var_ = ((rnd[1] & 0x3f) | 0x80).toString(16).padStart(2,'0');
    const rest = [...rnd.slice(2)].map(b=>b.toString(16).padStart(2,'0')).join('');
    return `${p1}-${p2}-${ver}-${var_}${rnd[2].toString(16).padStart(2,'0')}-${rest}`;
  }

  const GENERATORS = {
    '4':   uuidv4,
    '1':   uuidv1,
    '7':   uuidv7,
    'nil': () => '00000000-0000-0000-0000-000000000000',
    'max': () => 'ffffffff-ffff-ffff-ffff-ffffffffffff',
  };

  function applyFormat(uuid, fmt) {
    switch (fmt) {
      case 'upper':  return uuid.toUpperCase();
      case 'nodash': return uuid.replace(/-/g,'');
      case 'braces': return `{${uuid}}`;
      case 'urn':    return `urn:uuid:${uuid}`;
      default:       return uuid;
    }
  }

  // ── Generate ───────────────────────────────────────────────────────────────
  let lastGenerated = [];

  function generate() {
    const ver  = q('uuid-version').value;
    const fmt  = q('uuid-format').value;
    const n    = Math.min(1000, Math.max(1, parseInt(q('uuid-count').value)||1));
    const genFn = GENERATORS[ver];
    if (!genFn) return;

    lastGenerated = Array.from({length: n}, () => applyFormat(genFn(), fmt));

    const list = q('uuid-list');
    list.innerHTML = lastGenerated.map((uuid, i) => `
      <div class="uuid-row" data-uuid="${uuid}">
        <span class="uuid-num">${i+1}</span>
        <span class="uuid-val">${uuid}</span>
        <button class="btn btn-sm uuid-copy-one" data-val="${uuid}"
          style="font-size:10px;padding:2px 7px;flex-shrink:0">⎘</button>
      </div>`).join('');

    list.querySelectorAll('.uuid-copy-one').forEach(btn =>
      btn.addEventListener('click', () => copyText(btn.dataset.val, 'UUID'))
    );
    list.querySelectorAll('.uuid-row').forEach(row =>
      row.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') return;
        copyText(row.dataset.uuid, 'UUID');
      })
    );
  }

  q('uuid-gen-btn').addEventListener('click', generate);
  q('uuid-copy-all').addEventListener('click', () => {
    if (!lastGenerated.length) { notify('Generate UUIDs first'); return; }
    copyText(lastGenerated.join('\n'), `${lastGenerated.length} UUIDs`);
  });
  q('uuid-dl').addEventListener('click', () => {
    if (!lastGenerated.length) { notify('Generate UUIDs first'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lastGenerated.join('\n')], {type:'text/plain'}));
    a.download = 'uuids.txt'; a.click();
  });
  q('uuid-clear-out').addEventListener('click', () => {
    q('uuid-list').innerHTML = 'Click Generate to create UUIDs…';
    lastGenerated = [];
  });
  // Regenerate on version/format change
  ['uuid-version','uuid-format'].forEach(id =>
    q(id).addEventListener('change', () => { if (lastGenerated.length) generate(); })
  );
  // Initial generate
  generate();

  // ── Inspector ──────────────────────────────────────────────────────────────
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const UUID_NODASH = /^[0-9a-f]{32}$/i;

  function normalize(raw) {
    const s = raw.trim().replace(/^\{|\}$|^urn:uuid:/gi,'');
    if (UUID_RE.test(s)) return s.toLowerCase();
    if (UUID_NODASH.test(s)) {
      return s.toLowerCase().replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/,'$1-$2-$3-$4-$5');
    }
    return null;
  }

  function inspect(uuid) {
    const version = parseInt(uuid[14]);
    const variant = parseInt(uuid[19],16);
    const varStr  = variant >= 14 ? 'Reserved (future)' : variant >= 12 ? 'Microsoft/Legacy' : variant >= 8 ? 'RFC 4122 (standard)' : 'NCS backward compat.';

    const verNotes = {
      0: 'Nil UUID — all zeros',
      1: 'Time-based + MAC address',
      2: 'DCE Security (rare)',
      3: 'Name-based MD5 hash',
      4: 'Random / pseudo-random',
      5: 'Name-based SHA-1 hash',
      6: 'Reordered timestamp (draft)',
      7: 'Unix timestamp + random (sortable)',
      8: 'Custom / vendor-specific',
    };

    const rows = [
      ['UUID', `<span style="color:var(--text2)">${uuid}</span>`],
      ['Version', `${version} — ${verNotes[version] || 'Unknown'}`],
      ['Variant', varStr],
      ['Uppercase', uuid.toUpperCase()],
      ['No dashes', uuid.replace(/-/g,'')],
      ['URN', `urn:uuid:${uuid}`],
      ['Braces', `{${uuid}}`],
    ];

    // v1/v7 timestamp decode
    if (version === 1) {
      try {
        const tl = uuid.slice(0,8);
        const tm = uuid.slice(9,13);
        const th = uuid.slice(14,18);
        const ts = BigInt('0x' + th.slice(1) + tm + tl);
        const OFFSET = 122192928000000000n;
        const ms = Number((ts - OFFSET) / 10000n);
        if (ms > 0) rows.push(['Timestamp', new Date(ms).toISOString()]);
      } catch {}
    }
    if (version === 7) {
      try {
        const msHex = uuid.slice(0,8) + uuid.slice(9,13);
        const ms = parseInt(msHex, 16);
        rows.push(['Timestamp', new Date(ms).toISOString()]);
      } catch {}
    }

    return `<div class="whois-grid">${
      rows.map(([k,v])=>`<div class="whois-row">
        <span class="whois-k">${k}</span>
        <span class="whois-v">${v}</span>
      </div>`).join('')
    }</div>`;
  }

  q('uuid-inspect-in').addEventListener('input', () => {
    const raw  = q('uuid-inspect-in').value.trim();
    const out  = q('uuid-inspect-out');
    if (!raw) { out.innerHTML = ''; return; }
    const uuid = normalize(raw);
    if (!uuid) {
      out.innerHTML = `<span style="color:var(--red);font-size:12px">✕ Invalid UUID format</span>`;
      return;
    }
    out.innerHTML = inspect(uuid);
  });

  // ── Bulk validate / convert ────────────────────────────────────────────────
  let bulkResult = '';

  q('uuid-bulk-validate').addEventListener('click', () => {
    const lines = q('uuid-bulk-in').value.trim().split('\n').filter(Boolean);
    if (!lines.length) { notify('Input is empty'); return; }
    let ok = 0, fail = 0;
    const html = lines.map(l => {
      const uuid = normalize(l.trim());
      if (uuid) { ok++; return `<div style="color:var(--green)">✓ ${l.trim()}</div>`; }
      else { fail++; return `<div style="color:var(--red)">✕ ${l.trim()}</div>`; }
    }).join('');
    bulkResult = lines.filter(l=>normalize(l.trim())).join('\n');
    q('uuid-bulk-out').innerHTML = `<div style="margin-bottom:6px;font-size:11px">
      ${ok} valid · ${fail} invalid</div>${html}`;
  });

  q('uuid-bulk-convert').addEventListener('click', () => {
    const lines = q('uuid-bulk-in').value.trim().split('\n').filter(Boolean);
    const fmt   = q('uuid-format').value;
    if (!lines.length) { notify('Input is empty'); return; }
    const results = lines.map(l => {
      const uuid = normalize(l.trim());
      return uuid ? applyFormat(uuid, fmt) : `✕ ${l.trim()}`;
    });
    bulkResult = results.join('\n');
    q('uuid-bulk-out').innerHTML = results.map(r =>
      `<div style="font-size:12px;${r.startsWith('✕')?'color:var(--red)':'color:var(--text2)'}">${r}</div>`
    ).join('');
  });

  q('uuid-bulk-copy').addEventListener('click', () => {
    if (!bulkResult) { notify('Run validate or convert first'); return; }
    copyText(bulkResult, 'UUIDs');
  });

  if (window.innerWidth <= 768) q('uuid-grid').style.gridTemplateColumns = '1fr';
}