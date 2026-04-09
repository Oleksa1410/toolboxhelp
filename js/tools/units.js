export function renderUnits(el, { copyText }) {
  el.innerHTML = `
<div class="card">
  <div class="card-hdr">параметри середовища</div>
  <div class="row">
    <div class="field"><span class="f-label">ROOT FONT (px)</span><input type="number" id="ur" value="16" min="1"></div>
    <div class="field"><span class="f-label">PARENT FONT (px)</span><input type="number" id="up" value="16" min="1"></div>
    <div class="field"><span class="f-label">VIEWPORT W (px)</span><input type="number" id="uvw" value="1440" min="1"></div>
    <div class="field"><span class="f-label">VIEWPORT H (px)</span><input type="number" id="uvh" value="900" min="1"></div>
  </div>
</div>
<div class="card">
  <div class="card-hdr">конвертувати</div>
  <div class="row">
    <div class="field"><span class="f-label">ЗНАЧЕННЯ</span><input type="number" id="uval" value="16" step="0.1"></div>
    <div class="field" style="max-width:110px">
      <span class="f-label">ОДИНИЦЯ</span>
      <select id="uunit">
        <option>px</option><option>rem</option><option>em</option>
        <option>vw</option><option>vh</option><option>%</option><option>pt</option>
      </select>
    </div>
  </div>
  <div class="out-grid" id="u-out"></div>
</div>`;

  const g = id => parseFloat(el.querySelector('#' + id).value) || 0;

  function toPx(v, u) {
    const r = g('ur') || 16, p = g('up') || 16, vw = g('uvw') || 1440, vh = g('uvh') || 900;
    return { px: v, rem: v*r, em: v*p, vw: v*vw/100, vh: v*vh/100, '%': v*p/100, pt: v*1.3333 }[u] ?? v;
  }
  function fromPx(px, u) {
    const r = g('ur') || 16, p = g('up') || 16, vw = g('uvw') || 1440, vh = g('uvh') || 900;
    return { px, rem: px/r, em: px/p, vw: px*100/vw, vh: px*100/vh, '%': px*100/p, pt: px/1.3333 }[u];
  }

  function calc() {
    const v = parseFloat(el.querySelector('#uval').value) || 0;
    const u = el.querySelector('#uunit').value;
    const px = toPx(v, u);
    const r = g('ur') || 16, p = g('up') || 16, vw = g('uvw') || 1440, vh = g('uvh') || 900;
    const units = ['px','rem','em','vw','vh','%','pt'];
    const TIPS = {
      px:  'Піксель — абсолютна одиниця.\nЗавжди фіксована, не залежить\nвід жодних налаштувань.',
      rem: `root em — відносно <html> font-size.\n1rem = ${r}px (ваш root font)\nІдеально для типографіки та відступів.`,
      em:  `em — відносно font-size батьківського елемента.\n1em = ${p}px (ваш parent font)\nОбережно: вкладення множить значення.`,
      vw:  `viewport width — 1% ширини вікна браузера.\n1vw = ${(vw/100).toFixed(2)}px (при ${vw}px viewport)\nКорисно для fluid-типографіки.`,
      vh:  `viewport height — 1% висоти вікна браузера.\n1vh = ${(vh/100).toFixed(2)}px (при ${vh}px viewport)\nЧасто використовують для full-screen секцій.`,
      '%': `Відсоток — відносно font-size батьківського елемента.\n100% = ${p}px (ваш parent font)\nАналог em: 100% = 1em.`,
      pt:  `Пункт — одиниця з поліграфії.\n1pt = 1/72 дюйма = 1.333px\nМайже не використовується у вебі.`,
    };
    el.querySelector('#u-out').innerHTML = units.map(uu => {
      const val = fromPx(px, uu);
      const fmt = Math.abs(val) < 0.0001 && val !== 0 ? val.toExponential(2) : String(parseFloat(val.toFixed(5)));
      return `<div class="out-cell${uu === u ? '" style="border-color:var(--accent)' : ''}" data-copy="${fmt}${uu}">
        <div class="oc-l-wrap">
          <span class="oc-l">${uu}</span>
          <span class="oc-tip" data-tip="${TIPS[uu]}">?</span>
        </div>
        <div class="oc-v">${fmt}</div></div>`;
    }).join('');

    el.querySelectorAll('#u-out .out-cell').forEach(cell => {
      cell.addEventListener('click', () => copyText(cell.dataset.copy, cell.dataset.copy));
    });
  }

  ['uval','uunit','ur','up','uvw','uvh'].forEach(id =>
    el.querySelector('#' + id).addEventListener('input', calc)
  );
  calc();
}