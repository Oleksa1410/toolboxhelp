function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`) && window.qrcode || window.JsBarcode) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function renderQrBar(el, { notify }) {
  el.innerHTML = `
<div style="display:flex;gap:8px;margin-bottom:16px">
  <button class="btn btn-blue" id="tab-qr">▦ QR КОД</button>
  <button class="btn"          id="tab-bar">▬ BAR КОД</button>
</div>

<div id="pane-qr">
  <div class="card">
    <div class="card-hdr">дані для QR коду</div>
    <div style="margin-bottom:12px">
      <span class="f-label">ТИП</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px" id="qr-type-btns">
        <button class="btn btn-sm active-type" data-tpl="">Текст / URL</button>
        <button class="btn btn-sm" data-tpl="wifi">Wi-Fi</button>
        <button class="btn btn-sm" data-tpl="email">Email</button>
        <button class="btn btn-sm" data-tpl="tel">Телефон</button>
        <button class="btn btn-sm" data-tpl="sms">SMS</button>
        <button class="btn btn-sm" data-tpl="geo">Координати</button>
      </div>
    </div>
    <div id="qr-fields"></div>
    <div style="display:flex;gap:10px;align-items:flex-end;margin-top:12px;flex-wrap:wrap">
      <div class="field" style="max-width:130px"><span class="f-label">РОЗМІР (px)</span>
        <input type="number" id="qr-size" value="300" min="100" max="1000" step="50"></div>
      <div class="field" style="max-width:130px"><span class="f-label">ВІДСТУП (px)</span>
        <input type="number" id="qr-padding" value="20" min="0" max="200" step="4"></div>
      <div class="field" style="max-width:130px"><span class="f-label">КОРЕКЦІЯ</span>
        <select id="qr-ecl">
          <option value="L">L — низька</option>
          <option value="M" selected>M — середня</option>
          <option value="Q">Q — висока</option>
          <option value="H">H — максимум</option>
        </select></div>
      <div class="field" style="max-width:120px"><span class="f-label">ФОНОВИЙ</span>
        <input type="color" id="qr-bg" value="#ffffff" style="width:100%;height:38px;border-radius:6px;border:1px solid var(--border);padding:3px;background:transparent;cursor:pointer"></div>
      <div class="field" style="max-width:120px"><span class="f-label">КОЛІР ТОЧОК</span>
        <input type="color" id="qr-fg" value="#000000" style="width:100%;height:38px;border-radius:6px;border:1px solid var(--border);padding:3px;background:transparent;cursor:pointer"></div>
      <button class="btn btn-blue" id="btn-gen-qr">ГЕНЕРУВАТИ</button>
    </div>
  </div>
  <div class="card" id="qr-out-card" style="display:none">
    <div class="card-hdr">результат</div>
    <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap">
      <canvas id="qr-canvas" style="border-radius:8px;border:1px solid var(--border)"></canvas>
      <div>
        <div id="qr-info" style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:10px;line-height:1.8"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-blue" id="btn-dl-qr-png">↓ PNG</button>
          <button class="btn"          id="btn-dl-qr-svg">↓ SVG</button>
          <button class="btn btn-sm"   id="btn-copy-qr">⎘ Копіювати</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="pane-bar" style="display:none">
  <div class="card">
    <div class="card-hdr">дані для штрих-коду</div>
    <div class="field" style="margin-bottom:12px"><span class="f-label">ФОРМАТ</span>
      <select id="bar-fmt">
        <option value="CODE128">CODE 128 (будь-який текст)</option>
        <option value="CODE39">CODE 39</option>
        <option value="EAN13">EAN-13 (13 цифр)</option>
        <option value="EAN8">EAN-8 (8 цифр)</option>
        <option value="UPC">UPC-A (12 цифр)</option>
        <option value="ITF14">ITF-14 (14 цифр)</option>
        <option value="MSI">MSI</option>
        <option value="pharmacode">Pharmacode</option>
      </select></div>
    <div class="field" style="margin-bottom:12px"><span class="f-label">ЗНАЧЕННЯ</span>
      <input type="text" id="bar-val" placeholder="Введіть текст або цифри..." value="1234567890"></div>
    <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
      <div class="field" style="max-width:120px"><span class="f-label">ШИРИНА лінії</span>
        <input type="number" id="bar-w" value="2" min="1" max="5"></div>
      <div class="field" style="max-width:120px"><span class="f-label">ВИСОТА (px)</span>
        <input type="number" id="bar-h" value="100" min="30" max="300" step="10"></div>
      <div class="field" style="max-width:120px"><span class="f-label">КОЛІР</span>
        <input type="color" id="bar-fg" value="#000000" style="width:100%;height:38px;border-radius:6px;border:1px solid var(--border);padding:3px;background:transparent;cursor:pointer"></div>
      <div class="field" style="max-width:120px"><span class="f-label">ФОНОВИЙ</span>
        <input type="color" id="bar-bg" value="#ffffff" style="width:100%;height:38px;border-radius:6px;border:1px solid var(--border);padding:3px;background:transparent;cursor:pointer"></div>
      <label style="display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;color:var(--text);cursor:pointer;padding-bottom:2px">
        <input type="checkbox" id="bar-label" checked> Показати текст</label>
      <button class="btn btn-blue" id="btn-gen-bar">ГЕНЕРУВАТИ</button>
    </div>
  </div>
  <div class="card" id="bar-out-card" style="display:none">
    <div class="card-hdr">результат</div>
    <div style="background:#fff;padding:16px;border-radius:8px;display:inline-block;margin-bottom:14px">
      <canvas id="bar-canvas"></canvas>
    </div>
    <div id="bar-err" style="color:var(--red);font-family:var(--mono);font-size:12px;display:none"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-blue" id="btn-dl-bar-png">↓ PNG</button>
      <button class="btn"          id="btn-dl-bar-svg">↓ SVG</button>
      <button class="btn btn-sm"   id="btn-copy-bar">⎘ Копіювати</button>
    </div>
  </div>
</div>`;

  const q = id => el.querySelector('#' + id);

  // ── Tabs ──────────────────────────────────────────
  function switchTab(t) {
    q('pane-qr').style.display  = t === 'qr'  ? '' : 'none';
    q('pane-bar').style.display = t === 'bar' ? '' : 'none';
    q('tab-qr').className  = 'btn ' + (t === 'qr'  ? 'btn-blue' : '');
    q('tab-bar').className = 'btn ' + (t === 'bar' ? 'btn-blue' : '');
  }
  q('tab-qr').addEventListener('click',  () => switchTab('qr'));
  q('tab-bar').addEventListener('click', () => switchTab('bar'));

  // ── QR type templates ─────────────────────────────
  const QR_TPLS = {
    '':     () => `<div class="field"><span class="f-label">ТЕКСТ / URL</span><input type="text" id="qr-main" placeholder="https://example.com або будь-який текст" value="https://example.com"></div>`,
    wifi:   () => `<div class="row"><div class="field"><span class="f-label">SSID</span><input type="text" id="qr-ssid" placeholder="MyNetwork"></div><div class="field"><span class="f-label">ПАРОЛЬ</span><input type="text" id="qr-wpass" placeholder="password123"></div><div class="field" style="max-width:130px"><span class="f-label">ТИП</span><select id="qr-wtype"><option>WPA</option><option>WEP</option><option value="nopass">Без пароля</option></select></div></div>`,
    email:  () => `<div class="row"><div class="field"><span class="f-label">EMAIL</span><input type="text" id="qr-email" placeholder="user@example.com"></div><div class="field"><span class="f-label">ТЕМА</span><input type="text" id="qr-esubj" placeholder="Тема"></div><div class="field"><span class="f-label">ТЕКСТ</span><input type="text" id="qr-ebody" placeholder="Текст..."></div></div>`,
    tel:    () => `<div class="field"><span class="f-label">НОМЕР ТЕЛЕФОНУ</span><input type="text" id="qr-tel" placeholder="+380991234567"></div>`,
    sms:    () => `<div class="row"><div class="field"><span class="f-label">НОМЕР</span><input type="text" id="qr-smsn" placeholder="+380991234567"></div><div class="field"><span class="f-label">ТЕКСТ SMS</span><input type="text" id="qr-smst" placeholder="Текст повідомлення"></div></div>`,
    geo:    () => `<div class="row"><div class="field"><span class="f-label">ШИРОТА</span><input type="text" id="qr-lat" placeholder="50.4501"></div><div class="field"><span class="f-label">ДОВГОТА</span><input type="text" id="qr-lng" placeholder="30.5234"></div></div>`,
  };
  let qrCurrentTpl = '';
  function setTpl(tpl) {
    qrCurrentTpl = tpl;
    q('qr-fields').innerHTML = QR_TPLS[tpl]();
    el.querySelectorAll('#qr-type-btns .btn').forEach(b => {
      b.classList.toggle('active-type', b.dataset.tpl === tpl);
      b.classList.toggle('btn-blue',    b.dataset.tpl === tpl);
    });
  }
  el.querySelectorAll('#qr-type-btns .btn').forEach(b =>
    b.addEventListener('click', () => setTpl(b.dataset.tpl))
  );
  setTpl('');

  function getQRdata() {
    const v = id => { const el2 = el.querySelector('#' + id); return el2 ? el2.value.trim() : ''; };
    const t = qrCurrentTpl;
    if (t === '')      return v('qr-main');
    if (t === 'wifi')  return `WIFI:T:${v('qr-wtype')};S:${v('qr-ssid')};P:${v('qr-wpass')};;`;
    if (t === 'email') return `mailto:${v('qr-email')}?subject=${encodeURIComponent(v('qr-esubj'))}&body=${encodeURIComponent(v('qr-ebody'))}`;
    if (t === 'tel')   return `tel:${v('qr-tel')}`;
    if (t === 'sms')   return `smsto:${v('qr-smsn')}:${v('qr-smst')}`;
    if (t === 'geo')   return `geo:${v('qr-lat')},${v('qr-lng')}`;
    return '';
  }

  // ── QR generate ───────────────────────────────────
  let _qrData, _qrBg, _qrFg, _qrEcl, _qrPad;

  q('btn-gen-qr').addEventListener('click', async () => {
    const data = getQRdata();
    if (!data) { notify('Введіть дані!'); return; }
    const size = parseInt(q('qr-size').value)    || 300;
    const pad  = parseInt(q('qr-padding').value) || 0;
    const bg   = q('qr-bg').value;
    const fg   = q('qr-fg').value;
    const ecl  = q('qr-ecl').value;

    try {
      await loadScript('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js');
      const qr = qrcode(0, ecl); qr.addData(data); qr.make();
      const mc = qr.getModuleCount(), cell = Math.floor(size / mc);
      const qrSize = cell * mc, total = qrSize + pad * 2;
      const canvas = q('qr-canvas');
      canvas.width = total; canvas.height = total;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, total, total);
      ctx.fillStyle = fg;
      for (let r = 0; r < mc; r++)
        for (let c = 0; c < mc; c++)
          if (qr.isDark(r, c))
            ctx.fillRect(pad + c * cell, pad + r * cell, cell, cell);
      q('qr-out-card').style.display = 'block';
      q('qr-info').innerHTML =
        `Дані: <span style="color:var(--text2)">${data.substring(0,60)}${data.length>60?'…':''}</span><br>` +
        `Розмір: <span style="color:var(--text2)">${total}×${total} px</span> · ` +
        `QR: <span style="color:var(--text2)">${qrSize}×${qrSize}</span> · ` +
        `Відступ: <span style="color:var(--text2)">${pad}px</span><br>` +
        `Клітинок: <span style="color:var(--text2)">${mc}×${mc}</span> · ` +
        `Корекція: <span style="color:var(--text2)">${ecl}</span>`;
      _qrData = data; _qrBg = bg; _qrFg = fg; _qrEcl = ecl; _qrPad = pad;
    } catch(e) { notify('Помилка: ' + e.message); }
  });

  q('btn-dl-qr-png').addEventListener('click', () => {
    const canvas = q('qr-canvas');
    if (!canvas.width) { notify('Спочатку згенеруйте QR'); return; }
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'qr-code.png'; a.click();
  });

  q('btn-dl-qr-svg').addEventListener('click', () => {
    if (!_qrData) { notify('Спочатку згенеруйте QR'); return; }
    const qr = qrcode(0, _qrEcl || 'M'); qr.addData(_qrData); qr.make();
    const mc = qr.getModuleCount(), cell = 4, pad = _qrPad || 20, sz = mc * cell + pad * 2;
    let rects = '';
    for (let r = 0; r < mc; r++)
      for (let c = 0; c < mc; c++)
        if (qr.isDark(r, c))
          rects += `<rect x="${pad+c*cell}" y="${pad+r*cell}" width="${cell}" height="${cell}" fill="${_qrFg||'#000'}"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><rect width="${sz}" height="${sz}" fill="${_qrBg||'#fff'}"/>${rects}</svg>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = 'qr-code.svg'; a.click();
  });

  q('btn-copy-qr').addEventListener('click', () => {
    q('qr-canvas').toBlob(blob =>
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => notify('Зображення скопійовано!'))
    );
  });

  // ── Barcode generate ──────────────────────────────
  q('btn-gen-bar').addEventListener('click', async () => {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js');
      const fmt     = q('bar-fmt').value;
      const val     = q('bar-val').value.trim();
      const lw      = parseInt(q('bar-w').value) || 2;
      const h       = parseInt(q('bar-h').value) || 100;
      const fg      = q('bar-fg').value;
      const bg      = q('bar-bg').value;
      const showLbl = q('bar-label').checked;
      const errEl   = q('bar-err');
      errEl.style.display = 'none';
      q('bar-out-card').style.display = 'block';
      JsBarcode('#bar-canvas', val, {
        format: fmt, width: lw, height: h,
        lineColor: fg, background: bg,
        displayValue: showLbl, fontSize: 14, margin: 10,
        valid: v => { if (!v) throw new Error(`Невірне значення для формату ${fmt}`); },
      });
    } catch(e) {
      const errEl = q('bar-err');
      errEl.textContent = `Помилка: ${e.message}`;
      errEl.style.display = 'block';
    }
  });

  q('btn-dl-bar-png').addEventListener('click', () => {
    const canvas = q('bar-canvas');
    if (!canvas.width) { notify('Спочатку згенеруйте BAR'); return; }
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'barcode.png'; a.click();
  });

  q('btn-dl-bar-svg').addEventListener('click', () => {
    if (!window.JsBarcode) { notify('Спочатку згенеруйте BAR'); return; }
    const s = document.createElement('svg');
    JsBarcode(s, q('bar-val').value, {
      format: q('bar-fmt').value,
      width: parseInt(q('bar-w').value) || 2,
      height: parseInt(q('bar-h').value) || 100,
      lineColor: q('bar-fg').value,
      background: q('bar-bg').value,
      displayValue: q('bar-label').checked,
      fontSize: 14, margin: 10,
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([s.outerHTML], { type: 'image/svg+xml' }));
    a.download = 'barcode.svg'; a.click();
  });

  q('btn-copy-bar').addEventListener('click', () => {
    q('bar-canvas').toBlob(blob =>
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => notify('Зображення скопійовано!'))
    );
  });
}
