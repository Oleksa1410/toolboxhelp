/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  tools.config.js  —  РЕЄСТР ІНСТРУМЕНТІВ                    ║
 * ║                                                              ║
 * ║  Щоб додати нову сторінку:                                   ║
 * ║                                                              ║
 * ║  1. Створи файл  js/tools/mytool.js                          ║
 * ║     export function renderMyTool(el, ctx) { ... }            ║
 * ║                                                              ║
 * ║  2. Додай один рядок у масив TOOLS нижче                     ║
 * ║                                                              ║
 * ║  Більше нічого не треба — меню, головна, адмінка             ║
 * ║  підхоплять новий інструмент автоматично.                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Поля об'єкта:
 *   id       {string}  — унікальний ідентифікатор (латиниця, без пробілів)
 *   icon     {string}  — emoji або символ для меню
 *   name     {string}  — назва у меню та на головній сторінці
 *   desc     {string}  — короткий опис (показується на головній)
 *   file     {string}  — шлях до файлу від js/tools/ (без розширення)
 *   export   {string}  — ім'я export function у тому файлі
 *   order    {number}  — порядок у меню (менше = вище)
 *   enabled  {boolean} — показувати за замовчуванням
 *   sys      {boolean} — системний (не показується у лічильнику активних)
 *   needsCtx {boolean} — передавати ctx як другий аргумент (default: true)
 */

export const TOOLS = [
  // ── Системні ────────────────────────────────────────────────────────────────
  {
    id:      'home',
    icon:    '⌂',
    name:    'Головна',
    desc:    'Огляд усіх інструментів',
    file:    'home',
    export:  'renderHome',
    order:   0,
    enabled: true,
    sys:     false,
  },

  // ── Інструменти ─────────────────────────────────────────────────────────────
  {
    id:      'aspect',
    icon:    '▭',
    name:    'Aspect Ratio',
    desc:    'Співвідношення сторін екрану',
    file:    'aspect',
    export:  'renderAspect',
    order:   1,
    enabled: true,
  },
  {
    id:      'units',
    icon:    '⇄',
    name:    'CSS Units Converter',
    desc:    'Конвертер px · rem · em · vw · vh',
    file:    'units',
    export:  'renderUnits',
    order:   2,
    enabled: true,
  },
  {
    id:      'color',
    icon:    '◉',
    name:    'Color Converter',
    desc:    'HEX ↔ RGB ↔ HSL конвертер',
    file:    'color',
    export:  'renderColor',
    order:   3,
    enabled: true,
  },
  {
    id:      'password',
    icon:    '⚿',
    name:    'Password Gen',
    desc:    'Генератор безпечних паролів',
    file:    'password',
    export:  'renderPassword',
    order:   4,
    enabled: true,
  },
  {
    id:      'textcount',
    icon:    '¶',
    name:    'Text Counter',
    desc:    'Лічильник символів і слів',
    file:    'textcount',
    export:  'renderTextCount',
    order:   5,
    enabled: true,
  },
  {
    id:      'qrbar',
    icon:    '▦',
    name:    'QR/Barcode Generator',
    desc:    'Генератор QR та штрих-кодів',
    file:    'qrbar',
    export:  'renderQrBar',
    order:   6,
    enabled: true,
  },
  {
    id:      'hash',
    icon:    '#',
    name:    'Hash Generator',
    desc:    'MD5 · SHA-1 · SHA-256 · SHA-512',
    file:    'hash',
    export:  'renderHash',
    order:   7,
    enabled: true,
  },
  {
    id:      'json',
    icon:    '{ }',
    name:    'JSON Validator',
    desc:    'Форматування та валідація JSON',
    file:    'json',
    export:  'renderJson',
    order:   8,
    enabled: true,
  },
  {
    id:      'base64',
    icon:    '64',
    name:    'Base64 Encoder',
    desc:    'Encoder / Decoder · файли',
    file:    'base64',
    export:  'renderBase64',
    order:   9,
    enabled: true,
  },
  {
    id:      'diff',
    icon:    '↔',
    name:    'Diff Checker',
    desc:    'Порівняння тексту',
    file:    'diff',
    export:  'renderDiff',
    order:   10,
    enabled: true,
  },
  {
    id:      'urlencode',
    icon:    '%',
    name:    'URL Encoder',
    desc:    'Encode / Decode · розбір URL',
    file:    'urlencode',
    export:  'renderUrlEncode',
    order:   11,
    enabled: true,
  },
  {
    id:      'dummydata',
    icon:    '👤',
    name:    'Dummy Data',
    desc:    'Генератор тестових користувачів',
    file:    'dummydata',
    export:  'renderDummyData',
    order:   12,
    enabled: true,
  },
  {
    id:      'markdown',
    icon:    'MD',
    name:    'Markdown Editor',
    desc:    'Редактор з live preview',
    file:    'markdown',
    export:  'renderMarkdown',
    order:   13,
    enabled: true,
  },

  // ── Додай новий інструмент тут ───────────────────────────────────────────────
  // {
  //   id:      'mytool',
  //   icon:    '★',
  //   name:    'My Tool',
  //   desc:    'Опис мого інструменту',
  //   file:    'mytool',          ← файл js/tools/mytool.js
  //   export:  'renderMyTool',    ← export function renderMyTool(el, ctx)
  //   order:   7,
  //   enabled: true,
  // },

  // ── Система (завжди останнє) ─────────────────────────────────────────────────
  {
    id:      'admin',
    icon:    '⚙',
    name:    'Admin',
    desc:    'Керування інструментами',
    file:    'admin',
    export:  'renderAdmin',
    order:   99,
    enabled: true,
    sys:     true,
  },
];