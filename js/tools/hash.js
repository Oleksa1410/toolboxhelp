export function renderHash(el, { copyText, notify }) {
  el.innerHTML = `
<div class="card">
  <div class="card-hdr">введіть текст для хешування</div>
  <div style="margin-bottom:12px">
    <span class="f-label">ТЕКСТ / ДАНІ</span>
    <textarea id="hash-input"
      placeholder="Введіть будь-який текст..."
      style="width:100%;min-height:100px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.6;transition:border-color .12s">
    </textarea>
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-blue" id="btn-hash-all">РОЗРАХУВАТИ ВСЕ</button>
    <button class="btn btn-danger btn-sm" id="btn-hash-clear">✕ ОЧИСТИТИ</button>
  </div>
</div>

<div id="hash-results" style="display:none">

  <div class="card">
    <div class="card-hdr">результати — клік = копіювати</div>
    <div id="hash-list"></div>
  </div>

  <div class="card">
    <div class="card-hdr">перевірка хешу</div>
    <div class="row" style="align-items:flex-end;gap:10px">
      <div class="field">
        <span class="f-label">ОЧІКУВАНИЙ ХЕШ</span>
        <input type="text" id="hash-compare" placeholder="Вставте хеш для порівняння..."
          style="font-family:var(--mono);font-size:12px">
      </div>
    </div>
    <div id="hash-compare-result" style="margin-top:10px;display:none;font-family:var(--mono);font-size:12px;padding:8px 12px;border-radius:6px"></div>
  </div>

</div>`;

  const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  // Simple MD5 (pure JS, no SubtleCrypto — not available for MD5)
  function md5(str) {
    function safeAdd(x, y) { const lsw = (x & 0xffff) + (y & 0xffff); const msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xffff); }
    function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
    function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
    function md5ff(a,b,c,d,x,s,t){ return md5cmn((b&c)|(~b&d),a,b,x,s,t); }
    function md5gg(a,b,c,d,x,s,t){ return md5cmn((b&d)|(c&~d),a,b,x,s,t); }
    function md5hh(a,b,c,d,x,s,t){ return md5cmn(b^c^d,a,b,x,s,t); }
    function md5ii(a,b,c,d,x,s,t){ return md5cmn(c^(b|~d),a,b,x,s,t); }
    const utf8 = unescape(encodeURIComponent(str));
    const arr = [];
    for (let i = 0; i < utf8.length; i++) arr.push(utf8.charCodeAt(i));
    arr.push(128);
    while (arr.length % 64 !== 56) arr.push(0);
    const len = utf8.length * 8;
    arr.push(len & 0xff, (len >>> 8) & 0xff, (len >>> 16) & 0xff, (len >>> 24) & 0xff, 0,0,0,0);
    let a=1732584193, b=-271733879, c=-1732584194, d=271733878;
    for (let i = 0; i < arr.length; i += 64) {
      const m = [];
      for (let j = 0; j < 16; j++) m[j] = arr[i+j*4] | (arr[i+j*4+1]<<8) | (arr[i+j*4+2]<<16) | (arr[i+j*4+3]<<24);
      let [aa,bb,cc,dd] = [a,b,c,d];
      a=md5ff(a,b,c,d,m[0],7,-680876936);d=md5ff(d,a,b,c,m[1],12,-389564586);c=md5ff(c,d,a,b,m[2],17,606105819);b=md5ff(b,c,d,a,m[3],22,-1044525330);
      a=md5ff(a,b,c,d,m[4],7,-176418897);d=md5ff(d,a,b,c,m[5],12,1200080426);c=md5ff(c,d,a,b,m[6],17,-1473231341);b=md5ff(b,c,d,a,m[7],22,-45705983);
      a=md5ff(a,b,c,d,m[8],7,1770035416);d=md5ff(d,a,b,c,m[9],12,-1958414417);c=md5ff(c,d,a,b,m[10],17,-42063);b=md5ff(b,c,d,a,m[11],22,-1990404162);
      a=md5ff(a,b,c,d,m[12],7,1804603682);d=md5ff(d,a,b,c,m[13],12,-40341101);c=md5ff(c,d,a,b,m[14],17,-1502002290);b=md5ff(b,c,d,a,m[15],22,1236535329);
      a=md5gg(a,b,c,d,m[1],5,-165796510);d=md5gg(d,a,b,c,m[6],9,-1069501632);c=md5gg(c,d,a,b,m[11],14,643717713);b=md5gg(b,c,d,a,m[0],20,-373897302);
      a=md5gg(a,b,c,d,m[5],5,-701558691);d=md5gg(d,a,b,c,m[10],9,38016083);c=md5gg(c,d,a,b,m[15],14,-660478335);b=md5gg(b,c,d,a,m[4],20,-405537848);
      a=md5gg(a,b,c,d,m[9],5,568446438);d=md5gg(d,a,b,c,m[14],9,-1019803690);c=md5gg(c,d,a,b,m[3],14,-187363961);b=md5gg(b,c,d,a,m[8],20,1163531501);
      a=md5gg(a,b,c,d,m[13],5,-1444681467);d=md5gg(d,a,b,c,m[2],9,-51403784);c=md5gg(c,d,a,b,m[7],14,1735328473);b=md5gg(b,c,d,a,m[12],20,-1926607734);
      a=md5hh(a,b,c,d,m[5],4,-378558);d=md5hh(d,a,b,c,m[8],11,-2022574463);c=md5hh(c,d,a,b,m[11],16,1839030562);b=md5hh(b,c,d,a,m[14],23,-35309556);
      a=md5hh(a,b,c,d,m[1],4,-1530992060);d=md5hh(d,a,b,c,m[4],11,1272893353);c=md5hh(c,d,a,b,m[7],16,-155497632);b=md5hh(b,c,d,a,m[10],23,-1094730640);
      a=md5hh(a,b,c,d,m[13],4,681279174);d=md5hh(d,a,b,c,m[0],11,-358537222);c=md5hh(c,d,a,b,m[3],16,-722521979);b=md5hh(b,c,d,a,m[6],23,76029189);
      a=md5hh(a,b,c,d,m[9],4,-640364487);d=md5hh(d,a,b,c,m[12],11,-421815835);c=md5hh(c,d,a,b,m[15],16,530742520);b=md5hh(b,c,d,a,m[2],23,-995338651);
      a=md5ii(a,b,c,d,m[0],6,-198630844);d=md5ii(d,a,b,c,m[7],10,1126891415);c=md5ii(c,d,a,b,m[14],15,-1416354905);b=md5ii(b,c,d,a,m[5],21,-57434055);
      a=md5ii(a,b,c,d,m[12],6,1700485571);d=md5ii(d,a,b,c,m[3],10,-1894986606);c=md5ii(c,d,a,b,m[10],15,-1051523);b=md5ii(b,c,d,a,m[1],21,-2054922799);
      a=md5ii(a,b,c,d,m[8],6,1873313359);d=md5ii(d,a,b,c,m[15],10,-30611744);c=md5ii(c,d,a,b,m[6],15,-1560198380);b=md5ii(b,c,d,a,m[13],21,1309151649);
      a=md5ii(a,b,c,d,m[4],6,-145523070);d=md5ii(d,a,b,c,m[11],10,-1120210379);c=md5ii(c,d,a,b,m[2],15,718787259);b=md5ii(b,c,d,a,m[9],21,-343485551);
      a=safeAdd(a,aa); b=safeAdd(b,bb); c=safeAdd(c,cc); d=safeAdd(d,dd);
    }
    return [a,b,c,d].map(n => {
      let hex = '';
      for (let j = 0; j < 4; j++) hex += ('0' + ((n >> (j*8)) & 0xff).toString(16)).slice(-2);
      return hex;
    }).join('');
  }

  async function hashText(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const results = { MD5: md5(text) };
    for (const algo of ALGOS) {
      const buf = await crypto.subtle.digest(algo, data);
      results[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    }
    return results;
  }

  const DESC = {
    'MD5':     '128-bit · застарілий, не для паролів',
    'SHA-1':   '160-bit · не рекомендується для безпеки',
    'SHA-256': '256-bit · стандарт для перевірки цілісності',
    'SHA-384': '384-bit · SHA-2 сімейство, підвищена безпека',
    'SHA-512': '512-bit · максимальна довжина SHA-2',
  };

  async function compute() {
    const text = el.querySelector('#hash-input').value;
    if (!text.trim()) { notify('Введіть текст'); return; }

    const btn = el.querySelector('#btn-hash-all');
    btn.textContent = 'РОЗРАХУНОК...';
    btn.disabled = true;

    const results = await hashText(text);

    const listEl = el.querySelector('#hash-list');
    listEl.innerHTML = Object.entries(results).map(([algo, hash]) => `
      <div class="hash-row" data-hash="${hash}">
        <div class="hash-row-head">
          <span class="hash-algo">${algo}</span>
          <span class="hash-desc">${DESC[algo]}</span>
          <span class="hash-copy-hint">клік — копіювати</span>
        </div>
        <div class="hash-value">${hash}</div>
      </div>`
    ).join('');

    listEl.querySelectorAll('.hash-row').forEach(row => {
      row.addEventListener('click', () => {
        copyText(row.dataset.hash, row.querySelector('.hash-algo').textContent + ' hash');
        row.classList.add('hash-copied');
        setTimeout(() => row.classList.remove('hash-copied'), 1200);
      });
    });

    el.querySelector('#hash-results').style.display = 'block';

    // Live compare
    const compareInput = el.querySelector('#hash-compare');
    const compareResult = el.querySelector('#hash-compare-result');

    function doCompare() {
      const expected = compareInput.value.trim().toLowerCase();
      if (!expected) { compareResult.style.display = 'none'; return; }
      const found = Object.entries(results).find(([, h]) => h === expected);
      compareResult.style.display = 'block';
      if (found) {
        compareResult.style.background = 'rgba(90,158,122,0.12)';
        compareResult.style.border = '1px solid rgba(90,158,122,0.3)';
        compareResult.style.color = 'var(--green)';
        compareResult.textContent = `✓ Збіг! Алгоритм: ${found[0]}`;
      } else {
        compareResult.style.background = 'var(--red-dim)';
        compareResult.style.border = '1px solid rgba(201,96,90,.3)';
        compareResult.style.color = '#e08580';
        compareResult.textContent = '✕ Хеші не збігаються';
      }
    }
    compareInput.removeEventListener('input', compareInput._handler);
    compareInput._handler = doCompare;
    compareInput.addEventListener('input', doCompare);

    btn.textContent = 'РОЗРАХУВАТИ ВСЕ';
    btn.disabled = false;
  }

  el.querySelector('#btn-hash-all').addEventListener('click', compute);
  el.querySelector('#btn-hash-clear').addEventListener('click', () => {
    el.querySelector('#hash-input').value = '';
    el.querySelector('#hash-results').style.display = 'none';
    el.querySelector('#hash-compare').value = '';
  });
  el.querySelector('#hash-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.ctrlKey) compute();
  });
}