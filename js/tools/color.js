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
    '<div class="card"><div class="card-hdr">формати — клік = копіювати</div>' +
    '<div class="out-grid" id="c-out" style="grid-template-columns:repeat(auto-fill,minmax(155px,1fr))"></div></div>' +
    '<div class="card"><div class="card-hdr">палітри</div>' +
    '<div id="c-palettes"></div></div>';

  const q = id => el.querySelector('#' + id);

  // ── Color math ──────────────────────────────────────────────────────────────

  function h2r(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function r2h(r, g, b) {
    return '#' + [r, g, b].map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
  }
  function r2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
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
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  function hsl2r(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)];
  }

  // ── Palette generators ──────────────────────────────────────────────────────

  function genPalette(h, s, l) {
    const hmod = (v) => ((v % 360) + 360) % 360;
    const clamp = (v, mn = 0, mx = 100) => Math.max(mn, Math.min(mx, v));

    return {
      complementary: [
        { label: 'Оригінал',       h, s, l },
        { label: 'Комплементарний', h: hmod(h + 180), s, l },
      ],
      triadic: [
        { label: 'Оригінал',  h, s, l },
        { label: 'Тріада +',  h: hmod(h + 120), s, l },
        { label: 'Тріада −',  h: hmod(h + 240), s, l },
      ],
      analogous: [
        { label: '−60°', h: hmod(h - 60), s, l },
        { label: '−30°', h: hmod(h - 30), s, l },
        { label: 'Base', h, s, l },
        { label: '+30°', h: hmod(h + 30), s, l },
        { label: '+60°', h: hmod(h + 60), s, l },
      ],
      shades: [
        { label: '90%',  h, s: clamp(s * 0.6),  l: clamp(l * 0.2) },
        { label: '70%',  h, s: clamp(s * 0.8),  l: clamp(l * 0.5) },
        { label: 'Base', h, s, l },
        { label: 'Light', h, s: clamp(s * 0.7),  l: clamp(l + (100 - l) * 0.4) },
        { label: '95%',  h, s: clamp(s * 0.3),  l: clamp(l + (100 - l) * 0.75) },
      ],
      tints: [10, 25, 50, 75, 90].map(p => ({
        label: `${p}%`,
        h, s,
        l: clamp(l + (100 - l) * (p / 100)),
      })),
    };
  }

  function paletteRow(colors, title) {
    const swatches = colors.map(c => {
      const [r, g, b] = hsl2r(c.h, c.s, c.l);
      const hex = r2h(r, g, b);
      // Text contrast
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const tc  = lum > 0.5 ? '#0d1117' : '#e2e8f4';
      return `<div class="pal-swatch" data-hex="${hex}" title="${hex}"
        style="background:${hex};color:${tc}">
        <span class="pal-label">${c.label}</span>
        <span class="pal-hex">${hex}</span>
      </div>`;
    }).join('');
    return `<div class="pal-row">
      <div class="pal-title">${title}</div>
      <div class="pal-swatches">${swatches}</div>
    </div>`;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  function update(r, g, b) {
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    const hex = r2h(r, g, b);
    const [h, s, l] = r2hsl(r, g, b);
    q('csw').style.background = hex;
    q('cpick').value = hex;
    q('chex').value  = hex;

    // Formats
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

    // Palettes
    const P = genPalette(h, s, l);
    q('c-palettes').innerHTML =
      paletteRow(P.complementary, 'Комплементарна') +
      paletteRow(P.triadic,       'Тріадна') +
      paletteRow(P.analogous,     'Аналогова') +
      paletteRow(P.shades,        'Відтінки') +
      paletteRow(P.tints,         'Тінти');

    q('c-palettes').querySelectorAll('.pal-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        const [rr, gg, bb] = h2r(sw.dataset.hex);
        q('cr').value = rr; q('cg').value = gg; q('cb').value = bb;
        update(rr, gg, bb);
        copyText(sw.dataset.hex, 'колір');
      });
    });
  }

  // ── Events ──────────────────────────────────────────────────────────────────

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
  ['cr', 'cg', 'cb'].forEach(id => {
    q(id).addEventListener('input', () =>
      update(parseInt(q('cr').value)||0, parseInt(q('cg').value)||0, parseInt(q('cb').value)||0)
    );
  });

  update(24, 224, 112);
}