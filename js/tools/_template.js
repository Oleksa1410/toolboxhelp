/**
 * _template.js — ШАБЛОН НОВОГО ІНСТРУМЕНТУ
 *
 * Як додати нову сторінку:
 *
 * 1. Скопіюй цей файл:
 *    cp js/tools/_template.js js/tools/mytool.js
 *
 * 2. Перейменуй функцію renderTemplate → renderMyTool
 *
 * 3. Додай один рядок у js/tools.config.js:
 *    {
 *      id:      'mytool',
 *      icon:    '★',
 *      name:    'My Tool',
 *      desc:    'Короткий опис',
 *      file:    'mytool',
 *      export:  'renderMyTool',
 *      order:   7,
 *      enabled: true,
 *    },
 *
 * Більше нічого не треба!
 */

// Імпортуй тільки ті компоненти які використовуєш
import { card, field, row, sep, result, btn, presets, sectionHeader } from '../ui/components.js';

export function renderTemplate(el, ctx) {
  // ctx містить: { getVisible, navigate, notify, copyText }
  const { notify, copyText } = ctx;

  // ── Рендер HTML ─────────────────────────────────────────────────────────────

  el.innerHTML =

    // Заголовок сторінки (необов'язковий)
    sectionHeader('Назва інструменту', 'Короткий опис що він робить') +

    // Картка з формою
    card('// введіть дані',
      row(
        field('ПЕРШЕ ПОЛЕ', `<input type="text" id="my-input" placeholder="Введіть щось">`),
        sep('→'),
        field('ДРУГЕ ПОЛЕ', `<input type="number" id="my-number" value="100" min="1">`),
      ) +
      presets(
        [
          { label: 'Варіант A', value: 'a' },
          { label: 'Варіант B', value: 'b' },
        ],
        'myToolPreset'  // глобальна функція нижче
      ) +
      `<div style="margin-top:14px">` +
        btn('РОЗРАХУВАТИ', { id: 'btn-calc', variant: 'blue', full: true }) +
      `</div>`
    ) +

    // Картка результату (спочатку прихована)
    `<div id="result-wrap" style="display:none">` +
      card('// результат',
        result('РЕЗУЛЬТАТ', '<span id="result-val">—</span>', 'додаткова інформація')
      ) +
    `</div>`;

  // ── Логіка ──────────────────────────────────────────────────────────────────

  const inputEl  = el.querySelector('#my-input');
  const numberEl = el.querySelector('#my-number');
  const resultEl = el.querySelector('#result-val');
  const wrapEl   = el.querySelector('#result-wrap');

  function calculate() {
    const val = inputEl.value.trim();
    const num = parseFloat(numberEl.value) || 0;

    if (!val) {
      notify('Введіть значення');
      return;
    }

    // Твоя логіка тут
    const output = `${val} × ${num}`;

    resultEl.textContent = output;
    wrapEl.style.display = 'block';
  }

  // Пресети — глобальна функція (потрібна для onclick у presets())
  window.myToolPreset = (value) => {
    inputEl.value = value;
    calculate();
  };

  // Обробники подій
  el.querySelector('#btn-calc').addEventListener('click', calculate);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
}
