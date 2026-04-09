/**
 * js/ui/components.js
 *
 * Спільні UI-компоненти для всіх інструментів.
 * Використовуй ці функції замість написання HTML вручну —
 * так дизайн буде однаковим на кожній сторінці.
 *
 * ─────────────────────────────────────────────────────────
 *  ДОСТУПНІ КОМПОНЕНТИ
 * ─────────────────────────────────────────────────────────
 *  card(title, contentHTML)        → блок з заголовком
 *  field(label, inputHTML)         → підписане поле форми
 *  row(...fieldsHTML)              → горизонтальний ряд полів
 *  result(label, value, sub?)      → блок результату з акцентом
 *  statGrid(stats)                 → сітка статистики (лічильники)
 *  btn(label, opts?)               → кнопка
 *  presets(items, onClick)         → рядок пресетів (кнопки-теги)
 *  sectionHeader(title, desc)      → заголовок сторінки
 *  errorBox(msg)                   → блок помилки
 *  infoBox(msg)                    → блок інформації
 * ─────────────────────────────────────────────────────────
 */

// ── card ─────────────────────────────────────────────────────────────────────

/**
 * Базовий блок — використовується скрізь.
 * @param {string} title       — заголовок у верхній смузі
 * @param {string} contentHTML — HTML всередині картки
 * @returns {string} HTML
 */
export function card(title, contentHTML) {
  return `
    <div class="card">
      <div class="card-hdr">${title}</div>
      ${contentHTML}
    </div>`;
}

// ── field ─────────────────────────────────────────────────────────────────────

/**
 * Підписане поле форми.
 * @param {string} label     — мітка над полем (рядок)
 * @param {string} inputHTML — HTML тегу input / select / textarea
 * @param {object} [opts]
 * @param {string} [opts.style] — inline стиль на обгортці .field
 * @returns {string} HTML
 */
export function field(label, inputHTML, opts = {}) {
  const style = opts.style ? ` style="${opts.style}"` : '';
  return `
    <div class="field"${style}>
      <span class="f-label">${label}</span>
      ${inputHTML}
    </div>`;
}

// ── row ───────────────────────────────────────────────────────────────────────

/**
 * Горизонтальний ряд — передай довільну кількість HTML-рядків.
 * @param {...string} items — HTML блоків (field, sep, button тощо)
 * @returns {string} HTML
 */
export function row(...items) {
  return `<div class="row">${items.join('')}</div>`;
}

// ── sep ───────────────────────────────────────────────────────────────────────

/**
 * Роздільник між полями у row (×, →, на, тощо).
 * @param {string} [symbol='×']
 * @returns {string} HTML
 */
export function sep(symbol = '×') {
  return `<div class="ar-word">${symbol}</div>`;
}

// ── result ────────────────────────────────────────────────────────────────────

/**
 * Блок результату з лівою акцентною смугою.
 * @param {string} label          — підпис над значенням (монospace caps)
 * @param {string} value          — головне значення (велике)
 * @param {string} [sub='']       — підпис під значенням (малий текст)
 * @returns {string} HTML
 */
export function result(label, value, sub = '') {
  return `
    <div class="result-block">
      <div class="result-label">${label}</div>
      <div class="result-value">${value}</div>
      ${sub ? `<div class="result-sub">${sub}</div>` : ''}
    </div>`;
}

// ── statGrid ──────────────────────────────────────────────────────────────────

/**
 * Сітка статистичних лічильників (як у Text Counter).
 * @param {Array<{label: string, value: string|number, accent?: boolean}>} stats
 * @returns {string} HTML
 */
export function statGrid(stats) {
  const cells = stats.map(s => `
    <div class="stat-cell${s.accent ? ' stat-cell--accent' : ''}">
      <div class="stat-cell-label">${s.label}</div>
      <div class="stat-cell-value">${s.value}</div>
    </div>`).join('');
  return `<div class="stat-grid">${cells}</div>`;
}

// ── btn ───────────────────────────────────────────────────────────────────────

/**
 * Кнопка.
 * @param {string} label
 * @param {object} [opts]
 * @param {'default'|'blue'|'danger'|'sm'} [opts.variant='default']
 * @param {string}  [opts.id]
 * @param {string}  [opts.style]
 * @param {boolean} [opts.full=false] — розтягнути на повну ширину
 * @returns {string} HTML
 */
export function btn(label, opts = {}) {
  const { variant = 'default', id = '', style = '', full = false } = opts;
  const cls = [
    'btn',
    variant === 'blue'    ? 'btn-blue'    : '',
    variant === 'danger'  ? 'btn-danger'  : '',
    variant === 'sm'      ? 'btn-sm'      : '',
  ].filter(Boolean).join(' ');
  const idAttr    = id    ? ` id="${id}"`    : '';
  const styleAttr = (style || full)
    ? ` style="${full ? 'width:100%;justify-content:center;' : ''}${style}"`
    : '';
  return `<button class="${cls}"${idAttr}${styleAttr}>${label}</button>`;
}

// ── presets ───────────────────────────────────────────────────────────────────

/**
 * Рядок пресет-кнопок.
 * @param {Array<{label: string, value: any}>} items
 * @param {string} callbackName — ім'я глобальної функції виклику onclick
 * @returns {string} HTML
 *
 * Приклад:
 *   presets([{label:'1920×1080', value:'1920,1080'}], 'setAR')
 *   → onclick="setAR('1920,1080')"
 */
export function presets(items, callbackName) {
  const btns = items.map(item =>
    `<div class="preset" onclick="${callbackName}('${item.value}')">${item.label}</div>`
  ).join('');
  return `<div class="presets">${btns}</div>`;
}

// ── sectionHeader ─────────────────────────────────────────────────────────────

/**
 * Заголовок сторінки інструменту (великий заголовок + підпис).
 * Не обов'язковий — використовуй якщо хочеш описовий блок вгорі.
 * @param {string} title
 * @param {string} [desc='']
 * @returns {string} HTML
 */
export function sectionHeader(title, desc = '') {
  return `
    <div class="section-header">
      <div class="section-header-title">${title}</div>
      ${desc ? `<div class="section-header-desc">${desc}</div>` : ''}
    </div>`;
}

// ── errorBox ──────────────────────────────────────────────────────────────────

/**
 * Блок помилки (червоний).
 * @param {string} msg
 * @returns {string} HTML
 */
export function errorBox(msg) {
  return `<div class="msg-box msg-box--error">${msg}</div>`;
}

// ── infoBox ───────────────────────────────────────────────────────────────────

/**
 * Інформаційний блок (акцентний).
 * @param {string} msg
 * @returns {string} HTML
 */
export function infoBox(msg) {
  return `<div class="msg-box msg-box--info">${msg}</div>`;
}
