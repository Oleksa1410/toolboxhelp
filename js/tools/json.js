export function renderJson(el, { copyText, notify }) {
  el.innerHTML = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" id="json-grid">

  <!-- INPUT -->
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0">INPUT</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm" id="btn-json-paste">⎘ Вставити</button>
        <button class="btn btn-sm btn-danger" id="btn-json-clear">✕</button>
      </div>
    </div>
    <textarea id="json-input"
      placeholder='{\n  "key": "value"\n}'
      spellcheck="false"
      style="flex:1;min-height:320px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:12px 14px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s">
    </textarea>
    <div id="json-status" style="margin-top:8px;font-family:var(--mono);font-size:11px;min-height:18px"></div>
  </div>

  <!-- OUTPUT -->
  <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0">OUTPUT</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm" id="btn-json-copy">⎘ Копіювати</button>
        <button class="btn btn-sm" id="btn-json-minify">↔ Мінімайз</button>
      </div>
    </div>
    <pre id="json-output"
      style="flex:1;min-height:320px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:12px 14px;color:var(--text2);font-family:var(--mono);
             font-size:12px;overflow:auto;white-space:pre;line-height:1.7;margin:0"></pre>
  </div>
</div>

<!-- TOOLBAR -->
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;align-items:center">
  <button class="btn btn-blue" id="btn-json-format">▶ ФОРМАТУВАТИ</button>
  <button class="btn btn-sm" id="btn-json-validate">✓ ВАЛІДУВАТИ</button>
  <div style="display:flex;align-items:center;gap:8px;margin-left:auto">
    <span class="f-label" style="margin-bottom:0">ВІДСТУП:</span>
    <select id="json-indent" style="width:80px;padding:6px 8px;font-size:12px">
      <option value="2" selected>2 пробіли</option>
      <option value="4">4 пробіли</option>
      <option value="tab">Таб</option>
    </select>
  </div>
</div>

<!-- STATS -->
<div id="json-stats" style="display:none;margin-top:14px">
  <div class="card">
    <div class="card-hdr">статистика</div>
    <div id="json-stats-body"
      style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">
    </div>
  </div>
</div>`;

  const input  = el.querySelector('#json-input');
  const output = el.querySelector('#json-output');
  const status = el.querySelector('#json-status');
  let lastParsed = null;
  let minified   = false;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function getIndent() {
    const v = el.querySelector('#json-indent').value;
    return v === 'tab' ? '\t' : parseInt(v);
  }

  function setStatus(ok, msg) {
    status.textContent = ok ? `✓ ${msg}` : `✕ ${msg}`;
    status.style.color = ok ? 'var(--green)' : 'var(--red)';
    input.style.borderColor = ok ? 'var(--green)' : 'var(--red)';
  }

  function clearStatus() {
    status.textContent = '';
    input.style.borderColor = '';
  }

  // Syntax highlight JSON
  function highlight(json) {
    return json
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
        let cls = 'json-num';
        if (/^"/.test(match)) cls = /:$/.test(match) ? 'json-key' : 'json-str';
        else if (/true|false/.test(match)) cls = 'json-bool';
        else if (/null/.test(match)) cls = 'json-null';
        return `<span class="${cls}">${match}</span>`;
      });
  }

  function countStats(obj, depth = 0) {
    let keys = 0, arrays = 0, objects = 0, maxDepth = depth;
    if (Array.isArray(obj)) {
      arrays++;
      obj.forEach(v => {
        if (typeof v === 'object' && v !== null) {
          const s = countStats(v, depth + 1);
          keys += s.keys; arrays += s.arrays; objects += s.objects;
          maxDepth = Math.max(maxDepth, s.maxDepth);
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      objects++;
      Object.entries(obj).forEach(([, v]) => {
        keys++;
        if (typeof v === 'object' && v !== null) {
          const s = countStats(v, depth + 1);
          keys += s.keys; arrays += s.arrays; objects += s.objects;
          maxDepth = Math.max(maxDepth, s.maxDepth);
        }
      });
    }
    return { keys, arrays, objects, maxDepth };
  }

  // ── Format ───────────────────────────────────────────────────────────────────

  function format() {
    const raw = input.value.trim();
    if (!raw) { clearStatus(); output.innerHTML = ''; el.querySelector('#json-stats').style.display = 'none'; return; }
    try {
      const parsed = JSON.parse(raw);
      lastParsed = parsed;
      minified = false;
      const formatted = JSON.stringify(parsed, null, getIndent());
      output.innerHTML = highlight(formatted);
      setStatus(true, 'Валідний JSON');

      // Stats
      const stats = countStats(parsed);
      const size  = new Blob([formatted]).size;
      el.querySelector('#json-stats').style.display = 'block';
      el.querySelector('#json-stats-body').innerHTML = [
        { l: 'Ключів',   v: stats.keys },
        { l: 'Об\'єктів', v: stats.objects },
        { l: 'Масивів',  v: stats.arrays },
        { l: 'Глибина',  v: stats.maxDepth },
        { l: 'Рядків',   v: formatted.split('\n').length },
        { l: 'Розмір',   v: size > 1024 ? (size/1024).toFixed(1)+'KB' : size+'B' },
      ].map(s => `<div class="out-cell"><div class="oc-l">${s.l}</div><div class="oc-v">${s.v}</div></div>`).join('');
    } catch (e) {
      lastParsed = null;
      output.innerHTML = '';
      el.querySelector('#json-stats').style.display = 'none';
      setStatus(false, e.message);
    }
  }

  // ── Buttons ──────────────────────────────────────────────────────────────────

  el.querySelector('#btn-json-format').addEventListener('click', format);

  el.querySelector('#btn-json-validate').addEventListener('click', () => {
    const raw = input.value.trim();
    if (!raw) { notify('Введіть JSON'); return; }
    try {
      JSON.parse(raw);
      setStatus(true, 'JSON валідний ✓');
      notify('JSON валідний!');
    } catch (e) {
      setStatus(false, e.message);
      notify('Помилка: ' + e.message);
    }
  });

  el.querySelector('#btn-json-copy').addEventListener('click', () => {
    const text = output.textContent;
    if (!text.trim()) { notify('Немає даних для копіювання'); return; }
    copyText(text, 'JSON');
  });

  el.querySelector('#btn-json-minify').addEventListener('click', () => {
    if (!lastParsed) { notify('Спочатку відформатуйте JSON'); return; }
    if (minified) {
      output.innerHTML = highlight(JSON.stringify(lastParsed, null, getIndent()));
      minified = false;
    } else {
      output.innerHTML = highlight(JSON.stringify(lastParsed));
      minified = true;
    }
  });

  el.querySelector('#btn-json-paste').addEventListener('click', () => {
    navigator.clipboard.readText().then(t => { input.value = t; format(); });
  });

  el.querySelector('#btn-json-clear').addEventListener('click', () => {
    input.value = '';
    output.innerHTML = '';
    clearStatus();
    lastParsed = null;
    el.querySelector('#json-stats').style.display = 'none';
  });

  // Live format on Ctrl+Enter
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey) format(); });
  // Auto-validate while typing (debounced)
  let debTimer;
  input.addEventListener('input', () => {
    clearTimeout(debTimer);
    debTimer = setTimeout(() => { if (input.value.trim()) format(); else clearStatus(); }, 600);
  });
}