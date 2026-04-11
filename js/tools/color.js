export function renderColor(el, { copyText }) {
  el.innerHTML =
    '<div class="card"><div class="card-hdr">вхідний колір</div>' +
    '<div class="c-swatch" id="csw"></div>' +
    '<div class="row">' +
    '<div class="field" style="flex:0 0 auto"><span class="f-label">PICKER</span>' +
    '<input type="color" id="cpick" value="#18e070" style="width:50px;height:38px;border-radius:6px;border:1px solid var(--border);background:transparent;cursor:pointer;padding:3px"></div>' +
    '<div class="field"><span class="f-label">HEX</span><input type="text" id="chex" value="#18e070"></div>' +
    '<div class="field"><span class="f-label">R</span><input type="number" id="cr" value="24" min="0" max="255"></div>' +
    '<div class="field"><span class="f-label">G</span><input type="number" id="cg" value="224" min="0" max="255"></div>' +
    '<div class="field"><span class="f-label">B</span><input type="number" id="cb" value="112" min="0" max="255"></div>' +
    '</div></div>' +
    '<div class="card"><div class="card-hdr">всі формати — клік = копіювати</div>' +
    '<div class="out-grid" id="c-out" style="grid-template-columns:repeat(auto-fill,minmax(155px,1fr))"></div></div>';

  const q = id => el.querySelector('#' + id);

  function h2r(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function r2h(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function r2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
    let h, s, l = (mx + mn) / 2;
    if (mx === mn) { h = s = 0; } else {
      const d = mx - mn;
      s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      switch (mx) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
  }

  function update(r, g, b) {
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    const hex = r2h(r, g, b);
    const [h, s, l] = r2hsl(r, g, b);
    q('csw').style.background = hex;
    q('cpick').value = hex;
    q('chex').value  = hex;

    const TIPS = {
      'HEX':       '#rrggbb\nШістнадцятковий формат.\nНайпоширеніший у вебі.',
      'RGB':       'rgb(r, g, b)\nЧервоний · Зелений · Синій.\nКожен канал: 0–255.',
      'RGBA':      'rgba(r, g, b, a)\nЯк RGB + канал прозорості.\na=0 прозорий, a=1 непрозорий.',
      'HSL':       'hsl(h, s%, l%)\nВідтінок · Насиченість · Яскравість.\nЗручно для програмного підбору.',
      'CSS VAR':   '--color: #hex;\nCSS custom property.\nВикористовуй у :root {}.',
      'Tailwind':  '[#hex]\nJIT arbitrary color.\nКласи типу bg-[#hex] або text-[#hex].',
      'ARGB':      '0xFFrrggbb\nФормат Android / Flutter.\nAA — alpha (FF = повністю непрозорий).',
      'Float RGB': 'rgb(0.0–1.0, ...)\nНормалізований формат.\nВикористовується у WebGL / Three.js.',
    };
    const fmts = [
      { l: 'HEX',       v: hex },
      { l: 'RGB',       v: `rgb(${r}, ${g}, ${b})` },
      { l: 'RGBA',      v: `rgba(${r}, ${g}, ${b}, 1)` },
      { l: 'HSL',       v: `hsl(${h}, ${s}%, ${l}%)` },
      { l: 'CSS VAR',   v: `--color: ${hex};` },
      { l: 'Tailwind',  v: `[${hex}]` },
      { l: 'ARGB',      v: `0xFF${hex.slice(1).toUpperCase()}` },
      { l: 'Float RGB', v: `rgb(${(r/255).toFixed(3)}, ${(g/255).toFixed(3)}, ${(b/255).toFixed(3)})` },
    ];
    q('c-out').innerHTML = fmts.map(f =>
      `<div class="out-cell" data-label="${f.l}" data-val="${f.v}">` +
      `<div class="oc-l-wrap"><span class="oc-l">${f.l}</span><span class="oc-tip" data-tip="${TIPS[f.l]}">?</span></div>` +
      `<div class="oc-v" style="font-size:10px;word-break:break-all">${f.v}</div></div>`
    ).join('');
    q('c-out').querySelectorAll('.out-cell').forEach(cell => {
      cell.addEventListener('click', () => copyText(cell.dataset.val, cell.dataset.label));
    });
  }

  q('cpick').addEventListener('input', e => {
    const [r, g, b] = h2r(e.target.value);
    q('cr').value = r; q('cg').value = g; q('cb').value = b;
    q('chex').value = e.target.value;
    update(r, g, b);
  });
  q('chex').addEventListener('input', e => {
    let h = e.target.value.trim();
    if (!h.startsWith('#')) h = '#' + h;
    if (h.length === 4 || h.length === 7) {
      const [r, g, b] = h2r(h);
      q('cr').value = r; q('cg').value = g; q('cb').value = b;
      update(r, g, b);
    }
  });
  ['cr','cg','cb'].forEach(id => {
    q(id).addEventListener('input', () =>
      update(parseInt(q('cr').value)||0, parseInt(q('cg').value)||0, parseInt(q('cb').value)||0)
    );
  });
  update(24, 224, 112);
}