export function renderUrlEncode(el, { copyText, notify }) {
  el.innerHTML = `
<div style="display:flex;gap:8px;margin-bottom:16px">
  <button class="btn btn-blue" id="url-tab-encode">▲ ENCODE</button>
  <button class="btn"          id="url-tab-decode">▼ DECODE</button>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="url-grid">
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0" id="url-lbl-in">ТЕКСТ / URL</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm" id="url-paste">⎘ Вставити</button>
        <button class="btn btn-sm btn-danger" id="url-clear">✕</button>
      </div>
    </div>
    <textarea id="url-input" placeholder="Введіть текст або URL..." spellcheck="false"
      style="flex:1;min-height:180px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.6;transition:border-color .12s">
    </textarea>
  </div>

  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0" id="url-lbl-out">ЗАКОДОВАНИЙ</div>
      <button class="btn btn-sm" id="url-copy">⎘ Копіювати</button>
    </div>
    <textarea id="url-output" readonly spellcheck="false"
      style="flex:1;min-height:180px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.6;opacity:.85">
    </textarea>
    <div id="url-err" style="display:none;margin-top:8px;font-family:var(--mono);font-size:11px;
         color:var(--red);padding:7px 12px;background:var(--red-dim);border-radius:6px;
         border:1px solid rgba(224,85,85,.3)"></div>
  </div>
</div>

<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;align-items:center">
  <button class="btn btn-blue" id="url-run">▶ КОНВЕРТУВАТИ</button>
  <div style="display:flex;align-items:center;gap:8px;margin-left:8px">
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:12px;color:var(--text);cursor:pointer">
      <input type="radio" name="url-fn" id="url-fn-full" value="full" checked> encodeURIComponent
    </label>
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:12px;color:var(--text);cursor:pointer">
      <input type="radio" name="url-fn" id="url-fn-part" value="part"> encodeURI
    </label>
  </div>
  <div id="url-stats" style="margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--muted)"></div>
</div>

<!-- Розбір URL -->
<div class="card" style="margin-top:14px">
  <div class="card-hdr">розбір URL</div>
  <div class="row" style="align-items:flex-end">
    <div class="field">
      <span class="f-label">ВВЕДІТЬ URL</span>
      <input type="text" id="url-parse-input" placeholder="https://example.com/path?key=value&foo=bar#section">
    </div>
    <button class="btn btn-sm btn-blue" id="url-parse-btn" style="flex-shrink:0">РОЗІБРАТИ</button>
  </div>
  <div id="url-parse-result" style="display:none;margin-top:12px">
    <table id="url-parse-table" style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:12px"></table>
  </div>
</div>`;

  let mode = 'encode';
  const q = id => el.querySelector('#' + id);

  function setMode(m) {
    mode = m;
    q('url-tab-encode').className = 'btn ' + (m === 'encode' ? 'btn-blue' : '');
    q('url-tab-decode').className = 'btn ' + (m === 'decode' ? 'btn-blue' : '');
    q('url-lbl-in').textContent  = m === 'decode' ? 'ЗАКОДОВАНИЙ URL' : 'ТЕКСТ / URL';
    q('url-lbl-out').textContent = m === 'decode' ? 'ДЕКОДОВАНИЙ'     : 'ЗАКОДОВАНИЙ';
    q('url-input').value = '';
    q('url-output').value = '';
    q('url-err').style.display = 'none';
    q('url-stats').textContent = '';
  }

  q('url-tab-encode').addEventListener('click', () => setMode('encode'));
  q('url-tab-decode').addEventListener('click', () => setMode('decode'));

  function convert() {
    const input = q('url-input').value;
    const full  = el.querySelector('input[name="url-fn"]:checked').value === 'full';
    const errEl = q('url-err');
    errEl.style.display = 'none';
    if (!input.trim()) { q('url-output').value = ''; q('url-stats').textContent = ''; return; }
    try {
      let result;
      if (mode === 'encode') {
        result = full ? encodeURIComponent(input) : encodeURI(input);
      } else {
        result = full ? decodeURIComponent(input) : decodeURI(input);
      }
      q('url-output').value = result;
      q('url-stats').textContent = `${input.length} → ${result.length} симв.`;
    } catch (e) {
      q('url-output').value = '';
      errEl.textContent = '✕ ' + e.message;
      errEl.style.display = 'block';
      q('url-stats').textContent = '';
    }
  }

  q('url-run').addEventListener('click', convert);
  q('url-input').addEventListener('input', () => { clearTimeout(el._urlt); el._urlt = setTimeout(convert, 300); });
  q('url-copy').addEventListener('click', () => {
    const v = q('url-output').value;
    if (!v) { notify('Немає результату'); return; }
    copyText(v, 'URL');
  });
  q('url-paste').addEventListener('click', () => {
    navigator.clipboard.readText().then(t => { q('url-input').value = t; convert(); });
  });
  q('url-clear').addEventListener('click', () => {
    q('url-input').value = ''; q('url-output').value = '';
    errEl.style.display = 'none'; q('url-stats').textContent = '';
  });

  // URL Parser
  q('url-parse-btn').addEventListener('click', () => {
    const raw = q('url-parse-input').value.trim();
    if (!raw) { notify('Введіть URL'); return; }
    try {
      const u = new URL(raw);
      const rows = [
        ['Protocol',  u.protocol],
        ['Host',      u.host],
        ['Hostname',  u.hostname],
        ['Port',      u.port || '(за замовчуванням)'],
        ['Pathname',  u.pathname],
        ['Search',    u.search || '—'],
        ['Hash',      u.hash   || '—'],
        ['Origin',    u.origin],
      ];
      // Query params
      const params = [...u.searchParams.entries()];

      const table = q('url-parse-table');
      table.innerHTML = rows.map(([k, v]) =>
        `<tr style="border-bottom:1px solid var(--border)">
          <td style="padding:6px 10px 6px 0;color:var(--muted);width:110px;white-space:nowrap">${k}</td>
          <td style="padding:6px 0;color:var(--text2);word-break:break-all">${v}</td>
        </tr>`
      ).join('') + (params.length ? `
        <tr><td colspan="2" style="padding:10px 0 4px;color:var(--accent);font-size:10px;letter-spacing:1.5px">QUERY PARAMS</td></tr>
        ${params.map(([k, v]) =>
          `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:6px 10px 6px 0;color:var(--blue);width:110px;word-break:break-all">${k}</td>
            <td style="padding:6px 0;color:var(--text2);word-break:break-all">${v}</td>
          </tr>`
        ).join('')}` : '');

      q('url-parse-result').style.display = 'block';
    } catch (e) {
      notify('Невалідний URL: ' + e.message);
    }
  });
  q('url-parse-input').addEventListener('keydown', e => { if (e.key === 'Enter') q('url-parse-btn').click(); });

  // Responsive
  if (window.innerWidth <= 768) q('url-grid').style.gridTemplateColumns = '1fr';
}
