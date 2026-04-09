function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

export function renderAspect(el) {
  const PRESETS = [
    ['1920×1080',1920,1080],['2560×1440',2560,1440],['3840×2160',3840,2160],
    ['1280×720',1280,720],  ['2560×1080',2560,1080],['1080×1920',1080,1920],
    ['iPhone 14',1170,2532],['iPad Pro',2048,2732],
  ];
  const NAMES = {
    '1:1':'Square','4:3':'Classic','3:2':'Photo','16:9':'Wide HD',
    '16:10':'Monitor','21:9':'Ultrawide','32:9':'Super UW','9:16':'Portrait',
  };

  el.innerHTML = `
<div class="ar-section">
  <div class="ar-section-title">
    <span class="ar-section-num">// 0. РОЗРАХУВАТИ СПІВВІДНОШЕННЯ</span>
    <div class="ar-section-label">Знаючи ширину та висоту</div>
  </div>
  <div class="ar-inputs">
    <div class="field"><span class="f-label">ШИРИНА (px)</span><input type="number" id="aw" value="1920" min="1"></div>
    <div class="ar-word">×</div>
    <div class="field"><span class="f-label">ВИСОТА (px)</span><input type="number" id="ah" value="1080" min="1"></div>
  </div>
  <div class="presets" id="ar-pre"></div>
  <div class="ar-result-box">
    <div class="ar-result-text" id="r0-text">—</div>
    <div class="ar-result-num-wrap"><div class="ar-result-num" id="r0-num">—</div></div>
    <div class="ar-result-fmt" id="r0-fmt"></div>
  </div>
</div>

<div class="ar-section">
  <div class="ar-section-title">
    <span class="ar-section-num">// 1. ВИЗНАЧИТИ ВИСОТУ</span>
    <div class="ar-section-label">Знаючи ширину</div>
    <div class="ar-section-hint">(співвідношення синхронізується з блоку вище)</div>
  </div>
  <div class="ar-inputs">
    <div class="field"><span class="f-label">ШИРИНА (px)</span><input type="number" id="cw" placeholder="напр. 800" min="1"></div>
    <div class="ar-word">співвідношення</div>
    <div class="ar-ratio-inputs">
      <div><span class="f-label">W</span><input type="number" id="crx" value="16" min="1" style="width:70px"></div>
      <div class="ar-na">на</div>
      <div><span class="f-label">H</span><input type="number" id="cry" value="9" min="1" style="width:70px"></div>
    </div>
    <button class="btn btn-blue" id="btn-calc-h">ДІЗНАТИСЬ ВИСОТУ</button>
    <button class="btn btn-danger" id="btn-clear-h" style="padding:8px 11px">✕</button>
  </div>
  <div class="ar-result-box" id="r1-box" style="display:none">
    <div class="ar-result-text" id="r1-text"></div>
    <div class="ar-result-num-wrap"><div class="ar-result-num" id="r1-num">—</div><div class="ar-result-px">px</div></div>
    <div class="ar-result-fmt" id="r1-fmt"></div>
  </div>
</div>

<div class="ar-section">
  <div class="ar-section-title">
    <span class="ar-section-num">// 2. ВИЗНАЧИТИ ШИРИНУ</span>
    <div class="ar-section-label">Знаючи висоту</div>
    <div class="ar-section-hint">(співвідношення синхронізується з блоку вище)</div>
  </div>
  <div class="ar-inputs">
    <div class="field"><span class="f-label">ВИСОТА (px)</span><input type="number" id="ch" placeholder="напр. 1080" min="1"></div>
    <div class="ar-word">співвідношення</div>
    <div class="ar-ratio-inputs">
      <div><span class="f-label">W</span><input type="number" id="cwx" value="16" min="1" style="width:70px"></div>
      <div class="ar-na">на</div>
      <div><span class="f-label">H</span><input type="number" id="cwy" value="9" min="1" style="width:70px"></div>
    </div>
    <button class="btn btn-blue" id="btn-calc-w">ДІЗНАТИСЬ ШИРИНУ</button>
    <button class="btn btn-danger" id="btn-clear-w" style="padding:8px 11px">✕</button>
  </div>
  <div class="ar-result-box" id="r2-box" style="display:none">
    <div class="ar-result-text" id="r2-text"></div>
    <div class="ar-result-num-wrap"><div class="ar-result-num" id="r2-num">—</div><div class="ar-result-px">px</div></div>
    <div class="ar-result-fmt" id="r2-fmt"></div>
  </div>
</div>`;

  // Presets
  const pre = el.querySelector('#ar-pre');
  PRESETS.forEach(([label, w, h]) => {
    const b = document.createElement('div');
    b.className = 'preset';
    b.textContent = label;
    b.addEventListener('click', () => {
      el.querySelector('#aw').value = w;
      el.querySelector('#ah').value = h;
      calcRatio();
    });
    pre.appendChild(b);
  });

  function calcRatio() {
    const w = parseInt(el.querySelector('#aw').value) || 0;
    const h = parseInt(el.querySelector('#ah').value) || 0;
    if (!w || !h) return;
    const d = gcd(w, h), rx = w / d, ry = h / d, ratio = `${rx}:${ry}`;
    const name = NAMES[ratio] ? ` — ${NAMES[ratio]}` : '';
    ['#crx','#cwx'].forEach(s => { el.querySelector(s).value = rx; });
    ['#cry','#cwy'].forEach(s => { el.querySelector(s).value = ry; });
    el.querySelector('#r0-text').innerHTML = `При розмірі <u>${w} × ${h}</u> px, співвідношення:`;
    el.querySelector('#r0-num').textContent = ratio;
    el.querySelector('#r0-fmt').textContent = `decimal: ${(w/h).toFixed(4)}${name}`;
  }

  el.querySelector('#btn-calc-h').addEventListener('click', () => {
    const w  = parseFloat(el.querySelector('#cw').value)  || 0;
    const rx = parseFloat(el.querySelector('#crx').value) || 16;
    const ry = parseFloat(el.querySelector('#cry').value) || 9;
    if (!w) return;
    const h = Math.round(w * ry / rx);
    el.querySelector('#r1-text').innerHTML = `Маючи ширину <u>${w}</u> при пропорції <b>${rx} на ${ry}</b>, висота:`;
    el.querySelector('#r1-num').textContent = h.toFixed(2);
    el.querySelector('#r1-fmt').textContent = `ФОРМАТ: ${w} × ${h}`;
    el.querySelector('#r1-box').style.display = 'block';
  });

  el.querySelector('#btn-clear-h').addEventListener('click', () => {
    el.querySelector('#cw').value = '';
    el.querySelector('#r1-box').style.display = 'none';
  });

  el.querySelector('#btn-calc-w').addEventListener('click', () => {
    const h  = parseFloat(el.querySelector('#ch').value)  || 0;
    const rx = parseFloat(el.querySelector('#cwx').value) || 16;
    const ry = parseFloat(el.querySelector('#cwy').value) || 9;
    if (!h) return;
    const w = Math.round(h * rx / ry);
    el.querySelector('#r2-text').innerHTML = `Маючи висоту <u>${h}</u> при пропорції <b>${rx} на ${ry}</b>, ширина:`;
    el.querySelector('#r2-num').textContent = w.toFixed(2);
    el.querySelector('#r2-fmt').textContent = `ФОРМАТ: ${w} × ${h}`;
    el.querySelector('#r2-box').style.display = 'block';
  });

  el.querySelector('#btn-clear-w').addEventListener('click', () => {
    el.querySelector('#ch').value = '';
    el.querySelector('#r2-box').style.display = 'none';
  });

  ['#aw','#ah'].forEach(s => el.querySelector(s).addEventListener('input', calcRatio));
  calcRatio();
}
