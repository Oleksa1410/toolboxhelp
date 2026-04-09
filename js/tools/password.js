export function renderPassword(el, { copyText }) {
  const SETS = {
    upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower:   'abcdefghijklmnopqrstuvwxyz',
    digits:  '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
  };
  const checks = { upper: true, lower: true, digits: true, symbols: true, noSimilar: false };

  el.innerHTML = `
<div class="card">
  <div class="card-hdr">параметри генерації</div>
  <div class="row" style="align-items:flex-end;margin-bottom:14px">
    <div class="field" style="flex:3">
      <span class="f-label">ДОВЖИНА: <span id="len-v">8</span> символів</span>
      <input type="range" id="pwd-len" min="4" max="128" value="8">
    </div>
    <div class="field" style="max-width:100px">
      <span class="f-label">КІЛЬКІСТЬ</span>
      <input type="number" id="pwd-n" value="5" min="1" max="20">
    </div>
  </div>
  <div class="checks-grid" id="cg"></div>
  <div style="margin-top:14px">
    <button class="btn btn-blue" id="gen-btn"
      style="width:100%;justify-content:center;letter-spacing:1px">↺ ГЕНЕРУВАТИ</button>
  </div>
</div>
<div class="card">
  <div class="card-hdr">результати</div>
  <div id="pwd-list"></div>
</div>`;

  const q = id => el.querySelector('#' + id);

  // ── Checkboxes ──────────────────────────────────────────────────────────────
  const defs = [
    { k: 'upper',     l: 'Великі (A–Z)' },
    { k: 'lower',     l: 'Малі (a–z)' },
    { k: 'digits',    l: 'Цифри (0–9)' },
    { k: 'symbols',   l: 'Символи (!@#...)' },
    { k: 'noSimilar', l: 'Без схожих (il1Lo0)' },
  ];
  defs.forEach(({ k, l }) => {
    const d   = document.createElement('div'); d.className = 'chk';
    const box = document.createElement('div'); box.className = 'chk-box' + (checks[k] ? ' on' : '');
    const lbl = document.createElement('span'); lbl.className = 'chk-lbl'; lbl.textContent = l;
    d.appendChild(box); d.appendChild(lbl);
    d.addEventListener('click', () => {
      checks[k] = !checks[k];
      box.className = 'chk-box' + (checks[k] ? ' on' : '');
      genPwd();
    });
    q('cg').appendChild(d);
  });

  // ── Strength — враховує реальну довжину і набори ────────────────────────────
  function strength(p, actualLen) {
    // actualLen — задана довжина, не p.length (щоб уникнути помилок відображення)
    const len = actualLen || p.length;
    let s = 0;
    if (len >= 8)  s++;
    if (len >= 12) s++;
    if (len >= 16) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    // max score = 7
    const pct = Math.round(s / 7 * 100);
    if (s <= 2) return { pct, label: 'Слабкий',    color: 'var(--red)' };
    if (s <= 3) return { pct, label: 'Задовільний', color: 'var(--amber)' };
    if (s <= 4) return { pct, label: 'Добрий',      color: 'var(--amber)' };
    if (s <= 5) return { pct, label: 'Сильний',     color: 'var(--green)' };
    return             { pct, label: 'Відмінний',   color: 'var(--accent)' };
  }

  // ── Generate ────────────────────────────────────────────────────────────────
  function genPwd() {
    let cs = '';
    if (checks.upper)     cs += SETS.upper;
    if (checks.lower)     cs += SETS.lower;
    if (checks.digits)    cs += SETS.digits;
    if (checks.symbols)   cs += SETS.symbols;
    if (checks.noSimilar) cs = cs.split('').filter(c => !SETS.similar.includes(c)).join('');

    const list = q('pwd-list');

    if (!cs) {
      list.innerHTML = `<div style="color:var(--red);font-family:var(--mono);font-size:12px;padding:8px">
        Оберіть хоча б один набір символів</div>`;
      return;
    }

    // Читаємо значення ОДИН РАЗ і більше не чіпаємо DOM під час генерації
    const len = Math.max(4, Math.min(128, parseInt(q('pwd-len').value) || 8));
    const n   = Math.max(1, Math.min(20, parseInt(q('pwd-n').value)   || 5));

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < n; i++) {
      // Гарантуємо хоча б по одному символу з кожного активного набору
      const required = [];
      if (checks.upper)   required.push(SETS.upper);
      if (checks.lower)   required.push(SETS.lower);
      if (checks.digits)  required.push(SETS.digits);
      if (checks.symbols) required.push(SETS.symbols);

      // Якщо довжина менша за кількість required наборів — беремо по одному
      const minLen = Math.min(len, required.length);
      const arr = new Uint32Array(len);
      crypto.getRandomValues(arr);

      const chars = Array.from(arr, v => cs[v % cs.length]);

      // Вставляємо по одному символу з кожного обов'язкового набору
      const reqArr = new Uint32Array(required.length);
      crypto.getRandomValues(reqArr);
      required.forEach((set, idx) => {
        if (idx < len) {
          const filteredSet = checks.noSimilar
            ? set.split('').filter(c => !SETS.similar.includes(c)).join('')
            : set;
          if (filteredSet.length > 0) {
            chars[idx] = filteredSet[reqArr[idx] % filteredSet.length];
          }
        }
      });

      // Перемішуємо символи (Fisher-Yates)
      const shuffleArr = new Uint32Array(len);
      crypto.getRandomValues(shuffleArr);
      for (let j = len - 1; j > 0; j--) {
        const k = shuffleArr[j] % (j + 1);
        [chars[j], chars[k]] = [chars[k], chars[j]];
      }

      const p = chars.join('');
      const s = strength(p, len);

      // Будуємо DOM елемент замість innerHTML конкатенації
      const wrap = document.createElement('div');
      wrap.className = 'pwd-wrap';
      wrap.style.cssText = 'margin-bottom:8px';

      const txt = document.createElement('div');
      txt.className = 'pwd-txt';
      txt.textContent = p; // textContent — без HTML injection і без артефактів

      const row = document.createElement('div');
      row.className = 'pwd-row';

      const bar = document.createElement('div');
      bar.className = 'str-bar';
      const fill = document.createElement('div');
      fill.className = 'str-fill';
      fill.style.cssText = `width:${s.pct}%;background:${s.color}`;
      bar.appendChild(fill);

      const label = document.createElement('span');
      label.style.cssText = `color:${s.color};font-family:var(--mono);font-size:10px;margin-left:10px;white-space:nowrap;flex-shrink:0`;
      label.textContent = `${s.label} · ${len} симв.`;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn-sm';
      copyBtn.style.marginLeft = 'auto';
      copyBtn.textContent = 'copy';
      copyBtn.addEventListener('click', () => copyText(p, 'пароль'));

      row.appendChild(bar);
      row.appendChild(label);
      row.appendChild(copyBtn);
      wrap.appendChild(txt);
      wrap.appendChild(row);
      fragment.appendChild(wrap);
    }

    // Один раз замінюємо весь список — без артефактів
    list.innerHTML = '';
    list.appendChild(fragment);
  }

  // ── Events ──────────────────────────────────────────────────────────────────
  q('pwd-len').addEventListener('input', e => {
    q('len-v').textContent = e.target.value;
    genPwd();
  });
  q('pwd-n').addEventListener('change', genPwd);   // change замість input — спрацьовує після введення
  q('gen-btn').addEventListener('click', genPwd);

  genPwd();
}