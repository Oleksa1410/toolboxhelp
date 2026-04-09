export function renderBase64(el, { copyText, notify }) {
  el.innerHTML = `
<!-- Mode tabs -->
<div style="display:flex;gap:8px;margin-bottom:16px">
  <button class="btn btn-blue" id="b64-tab-encode">▲ ENCODE</button>
  <button class="btn"          id="b64-tab-decode">▼ DECODE</button>
  <button class="btn"          id="b64-tab-file"  >📎 ФАЙЛ</button>
</div>

<!-- TEXT MODE -->
<div id="b64-text-mode">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="b64-grid">
    <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-hdr" style="margin-bottom:0" id="b64-lbl-in">ТЕКСТ</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" id="b64-paste">⎘ Вставити</button>
          <button class="btn btn-sm btn-danger" id="b64-clear">✕</button>
        </div>
      </div>
      <textarea id="b64-input" placeholder="Введіть текст..." spellcheck="false"
        style="flex:1;min-height:220px;width:100%;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:13px;outline:none;resize:vertical;line-height:1.6;transition:border-color .12s">
      </textarea>
      <div style="margin-top:8px">
        <span class="f-label" style="margin-bottom:4px">КОДУВАННЯ</span>
        <select id="b64-charset" style="width:100%;padding:7px 10px;font-size:13px">
          <option value="utf8" selected>UTF-8 (рекомендовано)</option>
          <option value="latin1">Latin-1 / ISO-8859-1</option>
        </select>
      </div>
    </div>

    <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-hdr" style="margin-bottom:0" id="b64-lbl-out">BASE64</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" id="b64-copy">⎘ Копіювати</button>
          <button class="btn btn-sm" id="b64-swap">⇅ Swap</button>
        </div>
      </div>
      <textarea id="b64-output" placeholder="Результат з'явиться тут..." spellcheck="false" readonly
        style="flex:1;min-height:220px;width:100%;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:12px;outline:none;resize:vertical;line-height:1.6;opacity:.85">
      </textarea>
      <div id="b64-err" style="display:none;margin-top:8px;font-family:var(--mono);font-size:11px;
           color:var(--red);padding:7px 12px;background:var(--red-dim);border-radius:6px;
           border:1px solid rgba(224,85,85,.3)"></div>
    </div>
  </div>

  <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-blue" id="b64-run">▶ КОНВЕРТУВАТИ</button>
    <label style="display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;color:var(--text);cursor:pointer">
      <input type="checkbox" id="b64-urlsafe"> URL-safe (замінює +/= на -_~)
    </label>
    <div id="b64-stats" style="margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--muted)"></div>
  </div>
</div>

<!-- FILE MODE -->
<div id="b64-file-mode" style="display:none">
  <div class="card">
    <div class="card-hdr">файл → base64</div>
    <div id="b64-drop"
      style="border:2px dashed var(--border2);border-radius:8px;padding:40px;text-align:center;
             cursor:pointer;transition:border-color .15s;margin-bottom:14px">
      <div style="font-size:28px;margin-bottom:8px">📂</div>
      <div style="font-family:var(--mono);font-size:12px;color:var(--muted2)">
        Перетягни файл або <span style="color:var(--accent);cursor:pointer" id="b64-file-click">обери файл</span>
      </div>
      <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:6px">
        Будь-який тип · Макс. 5MB
      </div>
      <input type="file" id="b64-file-input" style="display:none">
    </div>
    <div id="b64-file-result" style="display:none">
      <div style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:8px" id="b64-file-info"></div>
      <textarea id="b64-file-output" readonly spellcheck="false"
        style="width:100%;min-height:120px;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:11px;outline:none;resize:vertical;line-height:1.5"></textarea>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button class="btn btn-blue btn-sm" id="b64-file-copy">⎘ Копіювати Base64</button>
        <button class="btn btn-sm" id="b64-file-img-wrap" style="display:none">👁 Показати зображення</button>
      </div>
      <div id="b64-file-img" style="display:none;margin-top:12px">
        <img id="b64-file-preview" style="max-width:100%;max-height:300px;border-radius:8px;border:1px solid var(--border)">
      </div>
    </div>
  </div>
</div>`;

  // ── State ──────────────────────────────────────────────────────────────────

  let mode = 'encode'; // 'encode' | 'decode'

  // ── Tabs ───────────────────────────────────────────────────────────────────

  function setMode(m) {
    mode = m;
    const isFile = m === 'file';
    el.querySelector('#b64-text-mode').style.display = isFile ? 'none' : '';
    el.querySelector('#b64-file-mode').style.display = isFile ? '' : 'none';
    el.querySelector('#b64-tab-encode').className = 'btn ' + (m === 'encode' ? 'btn-blue' : '');
    el.querySelector('#b64-tab-decode').className = 'btn ' + (m === 'decode' ? 'btn-blue' : '');
    el.querySelector('#b64-tab-file').className   = 'btn ' + (m === 'file'   ? 'btn-blue' : '');
    el.querySelector('#b64-lbl-in').textContent  = m === 'decode' ? 'BASE64' : 'ТЕКСТ';
    el.querySelector('#b64-lbl-out').textContent = m === 'decode' ? 'ТЕКСТ'  : 'BASE64';
    el.querySelector('#b64-input').placeholder   = m === 'decode' ? 'Введіть Base64...' : 'Введіть текст...';
    el.querySelector('#b64-input').value = '';
    el.querySelector('#b64-output').value = '';
    el.querySelector('#b64-err').style.display = 'none';
    el.querySelector('#b64-stats').textContent = '';
  }

  el.querySelector('#b64-tab-encode').addEventListener('click', () => setMode('encode'));
  el.querySelector('#b64-tab-decode').addEventListener('click', () => setMode('decode'));
  el.querySelector('#b64-tab-file').addEventListener('click',   () => setMode('file'));

  // ── Convert ────────────────────────────────────────────────────────────────

  function convert() {
    const input   = el.querySelector('#b64-input').value;
    const urlsafe = el.querySelector('#b64-urlsafe').checked;
    const errEl   = el.querySelector('#b64-err');
    const statsEl = el.querySelector('#b64-stats');
    errEl.style.display = 'none';

    if (!input.trim()) { el.querySelector('#b64-output').value = ''; statsEl.textContent = ''; return; }

    try {
      let result;
      if (mode === 'encode') {
        result = btoa(unescape(encodeURIComponent(input)));
        if (urlsafe) result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '~');
        statsEl.textContent = `Вхід: ${input.length} симв. → Вихід: ${result.length} симв. (×${(result.length/input.length).toFixed(2)})`;
      } else {
        let b64 = input.trim();
        if (urlsafe) b64 = b64.replace(/-/g, '+').replace(/_/g, '/').replace(/~/g, '=');
        // Add padding if missing
        while (b64.length % 4) b64 += '=';
        result = decodeURIComponent(escape(atob(b64)));
        statsEl.textContent = `Вхід: ${input.length} симв. → Вихід: ${result.length} симв.`;
      }
      el.querySelector('#b64-output').value = result;
    } catch (e) {
      el.querySelector('#b64-output').value = '';
      errEl.textContent = '✕ ' + (mode === 'decode' ? 'Невалідний Base64 рядок' : e.message);
      errEl.style.display = 'block';
      statsEl.textContent = '';
    }
  }

  el.querySelector('#b64-run').addEventListener('click', convert);
  el.querySelector('#b64-input').addEventListener('input', () => {
    clearTimeout(el._b64t);
    el._b64t = setTimeout(convert, 400);
  });

  el.querySelector('#b64-copy').addEventListener('click', () => {
    const v = el.querySelector('#b64-output').value;
    if (!v) { notify('Немає результату'); return; }
    copyText(v, 'Base64');
  });

  el.querySelector('#b64-paste').addEventListener('click', () => {
    navigator.clipboard.readText().then(t => { el.querySelector('#b64-input').value = t; convert(); });
  });

  el.querySelector('#b64-clear').addEventListener('click', () => {
    el.querySelector('#b64-input').value = '';
    el.querySelector('#b64-output').value = '';
    el.querySelector('#b64-err').style.display = 'none';
    el.querySelector('#b64-stats').textContent = '';
  });

  el.querySelector('#b64-swap').addEventListener('click', () => {
    const out = el.querySelector('#b64-output').value;
    if (!out) return;
    el.querySelector('#b64-input').value = out;
    setMode(mode === 'encode' ? 'decode' : 'encode');
    convert();
  });

  // ── File mode ──────────────────────────────────────────────────────────────

  const dropZone  = el.querySelector('#b64-drop');
  const fileInput = el.querySelector('#b64-file-input');

  el.querySelector('#b64-file-click').addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; });
  dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
  dropZone.addEventListener('drop', e => {
    e.preventDefault(); dropZone.style.borderColor = '';
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => { if (fileInput.files[0]) processFile(fileInput.files[0]); });

  function processFile(file) {
    if (file.size > 5 * 1024 * 1024) { notify('Файл більше 5MB'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const b64 = e.target.result.split(',')[1];
      el.querySelector('#b64-file-output').value = b64;
      el.querySelector('#b64-file-info').textContent =
        `${file.name} · ${file.type || 'невідомий тип'} · ${(file.size/1024).toFixed(1)} KB · ${b64.length} симв. Base64`;
      el.querySelector('#b64-file-result').style.display = 'block';

      const isImg = file.type.startsWith('image/');
      const imgWrap = el.querySelector('#b64-file-img-wrap');
      imgWrap.style.display = isImg ? 'inline-flex' : 'none';
      if (isImg) {
        el.querySelector('#b64-file-preview').src = e.target.result;
        imgWrap.onclick = () => {
          const imgDiv = el.querySelector('#b64-file-img');
          imgDiv.style.display = imgDiv.style.display === 'none' ? 'block' : 'none';
        };
      }
    };
    reader.readAsDataURL(file);
  }

  el.querySelector('#b64-file-copy').addEventListener('click', () => {
    const v = el.querySelector('#b64-file-output').value;
    if (!v) return;
    copyText(v, 'Base64');
  });

  // Grid responsive
  const grid = el.querySelector('#b64-grid');
  if (window.innerWidth <= 768) grid.style.gridTemplateColumns = '1fr';
}