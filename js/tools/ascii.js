export function renderAscii(el, { copyText, notify }) {
  el.innerHTML = `
<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
  <button class="btn btn-blue" id="asc-tab-to">Text → Codes</button>
  <button class="btn"          id="asc-tab-from">Codes → Text</button>
  <button class="btn"          id="asc-tab-table">ASCII Table</button>
</div>

<!-- TEXT → CODES -->
<div id="asc-pane-to">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="asc-grid-to">
    <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-hdr" style="margin-bottom:0">ТЕКСТ</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" id="asc-paste">⎘ Вставити</button>
          <button class="btn btn-sm btn-danger" id="asc-clear">✕</button>
        </div>
      </div>
      <textarea id="asc-text-in" placeholder="Введіть текст..." spellcheck="false"
        style="flex:1;min-height:180px;width:100%;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:13px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s">
      </textarea>
    </div>
    <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-hdr" style="margin-bottom:0" id="asc-out-label">ASCII КОДИ</div>
        <button class="btn btn-sm" id="asc-copy-out">⎘ Копіювати</button>
      </div>
      <textarea id="asc-code-out" readonly spellcheck="false"
        style="flex:1;min-height:180px;width:100%;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:12px;outline:none;resize:vertical;line-height:1.7;opacity:.85">
      </textarea>
    </div>
  </div>
  <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;align-items:center">
    <span class="f-label" style="margin-bottom:0">ФОРМАТ:</span>
    <label class="asc-radio"><input type="radio" name="asc-fmt" value="dec" checked> Decimal</label>
    <label class="asc-radio"><input type="radio" name="asc-fmt" value="hex"> Hex</label>
    <label class="asc-radio"><input type="radio" name="asc-fmt" value="bin"> Binary</label>
    <label class="asc-radio"><input type="radio" name="asc-fmt" value="oct"> Octal</label>
    <label class="asc-radio"><input type="radio" name="asc-fmt" value="html"> HTML Entity</label>
    <label class="asc-radio"><input type="radio" name="asc-fmt" value="uni"> Unicode</label>
    <span style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-left:8px" id="asc-stats"></span>
  </div>
</div>

<!-- CODES → TEXT -->
<div id="asc-pane-from" style="display:none">
  <div class="card" style="margin-bottom:0">
    <div class="card-hdr">введіть коди (через пробіл, кому або новий рядок)</div>
    <textarea id="asc-codes-in" placeholder="72 101 108 108 111" spellcheck="false"
      style="width:100%;min-height:100px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s;margin-bottom:12px">
    </textarea>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <span class="f-label" style="margin-bottom:0">БАЗА:</span>
      <label class="asc-radio"><input type="radio" name="asc-from-fmt" value="dec" checked> Decimal</label>
      <label class="asc-radio"><input type="radio" name="asc-from-fmt" value="hex"> Hex</label>
      <label class="asc-radio"><input type="radio" name="asc-from-fmt" value="bin"> Binary</label>
      <label class="asc-radio"><input type="radio" name="asc-from-fmt" value="oct"> Octal</label>
    </div>
  </div>
  <div class="card" style="margin-top:12px;margin-bottom:0">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div class="card-hdr" style="margin-bottom:0">РЕЗУЛЬТАТ</div>
      <button class="btn btn-sm" id="asc-copy-from">⎘ Копіювати</button>
    </div>
    <div id="asc-text-out"
      style="min-height:48px;padding:10px 12px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;color:var(--text2);font-size:14px;font-family:var(--sans);line-height:1.7;
             word-break:break-all">
    </div>
    <div id="asc-from-err" style="display:none;margin-top:8px;font-family:var(--mono);font-size:11px;
         color:var(--red);padding:7px 12px;background:var(--red-dim);border-radius:6px"></div>
  </div>
</div>

<!-- ASCII TABLE -->
<div id="asc-pane-table" style="display:none">
  <div class="card" style="margin-bottom:0">
    <div class="card-hdr">таблиця ASCII (0–127)</div>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <input type="text" id="asc-table-filter" placeholder="Пошук символу або коду..."
        style="flex:1;min-width:180px;font-size:13px;padding:7px 11px">
      <select id="asc-table-range" style="padding:7px 11px;font-size:13px">
        <option value="all">Всі (0–127)</option>
        <option value="ctrl">Керуючі (0–31)</option>
        <option value="print">Друковані (32–126)</option>
        <option value="digit">Цифри (48–57)</option>
        <option value="upper">Великі (65–90)</option>
        <option value="lower">Малі (97–122)</option>
      </select>
    </div>
    <div id="asc-table" style="overflow-x:auto"></div>
  </div>
</div>`;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const q = id => el.querySelector('#' + id);

  const CTRL_NAMES = {
    0:'NUL',1:'SOH',2:'STX',3:'ETX',4:'EOT',5:'ENQ',6:'ACK',7:'BEL',
    8:'BS',9:'TAB',10:'LF',11:'VT',12:'FF',13:'CR',14:'SO',15:'SI',
    16:'DLE',17:'DC1',18:'DC2',19:'DC3',20:'DC4',21:'NAK',22:'SYN',23:'ETB',
    24:'CAN',25:'EM',26:'SUB',27:'ESC',28:'FS',29:'GS',30:'RS',31:'US',127:'DEL',
  };

  function encode(char, fmt) {
    const code = char.codePointAt(0);
    switch (fmt) {
      case 'dec':  return String(code);
      case 'hex':  return '0x' + code.toString(16).toUpperCase().padStart(2,'0');
      case 'bin':  return code.toString(2).padStart(8,'0');
      case 'oct':  return '0' + code.toString(8);
      case 'html': return code < 128 && code > 31 ? `&amp;#${code};` : `&amp;#${code};`;
      case 'uni':  return 'U+' + code.toString(16).toUpperCase().padStart(4,'0');
      default:     return String(code);
    }
  }

  function convert() {
    const text = q('asc-text-in').value;
    const fmt  = el.querySelector('input[name="asc-fmt"]:checked').value;
    const labels = { dec:'ASCII КОДИ (DEC)', hex:'HEX КОДИ', bin:'BINARY', oct:'OCTAL', html:'HTML ENTITIES', uni:'UNICODE' };
    q('asc-out-label').textContent = labels[fmt] || 'КОДИ';

    if (!text) { q('asc-code-out').value = ''; q('asc-stats').textContent = ''; return; }

    const chars = [...text]; // Unicode-safe
    const codes = chars.map(c => encode(c, fmt));
    q('asc-code-out').value = codes.join(' ');
    q('asc-stats').textContent = `${chars.length} симв.`;
  }

  function convertFrom() {
    const raw  = q('asc-codes-in').value.trim();
    const base = el.querySelector('input[name="asc-from-fmt"]:checked').value;
    const errEl = q('asc-from-err');
    errEl.style.display = 'none';
    if (!raw) { q('asc-text-out').textContent = ''; return; }

    const parts = raw.split(/[\s,;]+/).filter(Boolean);
    try {
      const chars = parts.map(p => {
        const clean = p.replace(/^0x/i,'').replace(/^0(?=[0-7])/,'');
        const radix = { dec:10, hex:16, bin:2, oct:8 }[base];
        const code  = parseInt(p.replace(/^0x/i,''), radix);
        if (isNaN(code) || code < 0 || code > 1114111) throw new Error(`Невалідний код: "${p}"`);
        return String.fromCodePoint(code);
      });
      q('asc-text-out').textContent = chars.join('');
    } catch(e) {
      q('asc-text-out').textContent = '';
      errEl.textContent = '✕ ' + e.message;
      errEl.style.display = 'block';
    }
  }

  function renderTable(filter = '', range = 'all') {
    const ranges = {
      all:   [0, 127],
      ctrl:  [0, 31],
      print: [32, 126],
      digit: [48, 57],
      upper: [65, 90],
      lower: [97, 122],
    };
    const [start, end] = ranges[range] || [0, 127];

    let rows = [];
    for (let i = start; i <= end; i++) {
      const char    = i === 32 ? 'SPC' : (CTRL_NAMES[i] || (i === 127 ? 'DEL' : String.fromCharCode(i)));
      const display = i >= 33 && i <= 126 && i !== 127 ? String.fromCharCode(i) : '';
      const dec = String(i);
      const hex = i.toString(16).toUpperCase().padStart(2,'0');
      const bin = i.toString(2).padStart(8,'0');
      if (filter && !dec.includes(filter) && !hex.toLowerCase().includes(filter.toLowerCase()) &&
          !char.toLowerCase().includes(filter.toLowerCase())) continue;
      rows.push({ i, char, display, dec, hex, bin });
    }

    if (!rows.length) {
      q('asc-table').innerHTML = `<div style="font-family:var(--mono);font-size:12px;color:var(--muted);padding:12px">Нічого не знайдено</div>`;
      return;
    }

    q('asc-table').innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:12px">
        <thead>
          <tr style="border-bottom:2px solid var(--border2)">
            <th style="padding:7px 12px;text-align:left;color:var(--accent);font-size:9px;letter-spacing:1.5px">DEC</th>
            <th style="padding:7px 12px;text-align:left;color:var(--accent);font-size:9px;letter-spacing:1.5px">HEX</th>
            <th style="padding:7px 12px;text-align:left;color:var(--accent);font-size:9px;letter-spacing:1.5px">BIN</th>
            <th style="padding:7px 12px;text-align:left;color:var(--accent);font-size:9px;letter-spacing:1.5px">CHAR</th>
            <th style="padding:7px 12px;text-align:left;color:var(--accent);font-size:9px;letter-spacing:1.5px">DISPLAY</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr style="border-bottom:1px solid var(--border);cursor:pointer" class="asc-trow" data-char="${r.display || ''}" data-dec="${r.dec}">
              <td style="padding:6px 12px;color:var(--text2)">${r.dec}</td>
              <td style="padding:6px 12px;color:var(--blue)">${r.hex}</td>
              <td style="padding:6px 12px;color:var(--muted2);font-size:10px">${r.bin}</td>
              <td style="padding:6px 12px;color:var(--amber)">${r.char}</td>
              <td style="padding:6px 12px;color:var(--text2);font-size:16px">${r.display}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    // Клік → вставляємо в text-in
    q('asc-table').querySelectorAll('.asc-trow').forEach(row => {
      row.addEventListener('mouseenter', () => row.style.background = 'var(--s2)');
      row.addEventListener('mouseleave', () => row.style.background = '');
      row.addEventListener('click', () => {
        const ch = row.dataset.char;
        if (ch) {
          q('asc-text-in').value += ch;
          convert();
        }
      });
    });
  }

  // ── Tabs ────────────────────────────────────────────────────────────────────

  function setTab(tab) {
    ['to','from','table'].forEach(t => {
      q('asc-pane-' + t).style.display = t === tab ? '' : 'none';
      q('asc-tab-' + t).className = 'btn ' + (t === tab ? 'btn-blue' : '');
    });
    if (tab === 'table') renderTable(q('asc-table-filter')?.value || '', q('asc-table-range')?.value || 'all');
  }

  q('asc-tab-to').addEventListener('click',    () => setTab('to'));
  q('asc-tab-from').addEventListener('click',  () => setTab('from'));
  q('asc-tab-table').addEventListener('click', () => setTab('table'));

  // ── Events ──────────────────────────────────────────────────────────────────

  q('asc-text-in').addEventListener('input', convert);
  el.querySelectorAll('input[name="asc-fmt"]').forEach(r => r.addEventListener('change', convert));

  q('asc-codes-in').addEventListener('input', convertFrom);
  el.querySelectorAll('input[name="asc-from-fmt"]').forEach(r => r.addEventListener('change', convertFrom));

  q('asc-paste').addEventListener('click', () => {
    navigator.clipboard.readText().then(t => { q('asc-text-in').value = t; convert(); });
  });
  q('asc-clear').addEventListener('click', () => { q('asc-text-in').value = ''; q('asc-code-out').value = ''; q('asc-stats').textContent = ''; });
  q('asc-copy-out').addEventListener('click', () => { const v = q('asc-code-out').value; if (!v) { notify('Немає даних'); return; } copyText(v, 'коди'); });
  q('asc-copy-from').addEventListener('click', () => { const v = q('asc-text-out').textContent; if (!v) { notify('Немає даних'); return; } copyText(v, 'текст'); });

  q('asc-table-filter')?.addEventListener('input', () =>
    renderTable(q('asc-table-filter').value, q('asc-table-range').value));
  q('asc-table-range')?.addEventListener('change', () =>
    renderTable(q('asc-table-filter').value, q('asc-table-range').value));

  // ── Init ────────────────────────────────────────────────────────────────────
  if (window.innerWidth <= 768) {
    el.querySelector('#asc-grid-to')?.style && (el.querySelector('#asc-grid-to').style.gridTemplateColumns = '1fr');
  }
}