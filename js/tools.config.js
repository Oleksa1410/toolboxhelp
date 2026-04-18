/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  tools.config.js  —  РЕЄСТР ІНСТРУМЕНТІВ                    ║
 * ║                                                              ║
 * ║  Щоб додати нову сторінку:                                   ║
 * ║  1. Створи файл  js/tools/mytool.js                          ║
 * ║     export function renderMyTool(el, ctx) { ... }            ║
 * ║  2. Додай об'єкт у масив TOOLS нижче                         ║
 * ║                                                              ║
 * ║  Поле group — визначає секцію у меню:                        ║
 * ║    'css'      → CSS & Дизайн                                 ║
 * ║    'text'     → Текст & Дані                                 ║
 * ║    'encode'   → Кодування                                    ║
 * ║    'generate' → Генератори                                   ║
 * ║    null/''    → без групи (Головна)                          ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const TOOLS = [

  // ── Головна ─────────────────────────────────────────────────────────────────
  {
    id:      'home',
    lucide:  'house',
    icon:    '⌂',
    name:    'Головна',
    desc:    'Огляд усіх інструментів',
    file:    'home',
    export:  'renderHome',
    order:   0,
    group:   null,
    enabled: true,
  },

  // ── CSS & Дизайн ─────────────────────────────────────────────────────────────
  {
    id:      'units',
    lucide:  'ruler',
    icon:    '⇄',
    name:    'CSS Units',
    desc:    'Конвертер px · rem · em · vw · vh',
    file:    'units',
    export:  'renderUnits',
    order:   1,
    group:   'css',
    enabled: true,
    tip: {
      title: 'Що таке REM і чому він кращий за PX?',
      text:  '<b>PX</b> — абсолютна одиниця. Не змінюється при зміні налаштувань браузера.<br>' +
             '<b>REM</b> — відносно <code>font-size</code> кореневого <code>&lt;html&gt;</code>. ' +
             'Масштабується разом з налаштуваннями браузера. Рекомендується для типографіки.<br>' +
             '<b>EM</b> — відносно батьківського елемента. При вкладенні множиться.<br>' +
             '<b>VW/VH</b> — відсоток від ширини/висоти вікна. Для fluid-лейаутів.',
    },
  },
  {
    id:      'color',
    lucide:  'pipette',
    icon:    '◉',
    name:    'Color Converter',
    desc:    'HEX ↔ RGB ↔ HSL конвертер',
    file:    'color',
    export:  'renderColor',
    order:   2,
    group:   'css',
    enabled: true,
    tip: {
      title: 'HEX, RGB чи HSL — що вибрати?',
      text:  '<b>HEX</b> — найпоширеніший у вебі, зручний для копіювання з Figma.<br>' +
             '<b>RGB</b> — для програмної маніпуляції каналами кольору.<br>' +
             '<b>HSL</b> — найінтуїтивніший. Легко отримати темніший варіант: зменшити L. ' +
             'Ідеальний для генерації палітр у CSS.',
    },
  },
  {
    id:      'aspect',
    lucide:  'ratio',
    icon:    '▭',
    name:    'Aspect Ratio',
    desc:    'Калькулятор співвідношення сторін',
    file:    'aspect',
    export:  'renderAspect',
    order:   3,
    group:   'css',
    enabled: true,
    tip: {
      title: 'Навіщо знати Aspect Ratio?',
      text:  '<b>16:9</b> — стандарт відео та моніторів. <b>4:3</b> — старі монітори, фото. ' +
             '<b>1:1</b> — квадрат (Instagram). <b>9:16</b> — вертикальне відео (TikTok, Reels).',
    },
  },

  // ── Текст & Дані ─────────────────────────────────────────────────────────────
  {
    id:      'textcount',
    lucide:  'type',
    icon:    '¶',
    name:    'Text Counter',
    desc:    'Символи · слова · рядки',
    file:    'textcount',
    export:  'renderTextCount',
    order:   4,
    group:   'text',
    enabled: true,
    tip: {
      title: 'Навіщо рахувати символи?',
      text:  '<b>Twitter/X</b> — 280 симв., <b>meta description</b> — 155–160, ' +
             '<b>SMS</b> — 160 (Latin) / 70 (Unicode), <b>title тег</b> — 50–60 для SEO.',
    },
  },
  {
    id:      'diff',
    lucide:  'git-compare-arrows',
    icon:    '↔',
    name:    'Diff Checker',
    desc:    'Порівняння двох текстів',
    file:    'diff',
    export:  'renderDiff',
    order:   5,
    group:   'text',
    enabled: true,
    tip: {
      title: 'Як читати diff?',
      text:  '<span style="color:var(--green)">+ зелений</span> — рядок доданий.<br>' +
             '<span style="color:var(--red)">− червоний</span> — рядок видалений.<br>' +
             'Режими: <b>Рядки</b> (як git diff), <b>Слова</b>, <b>Символи</b>.',
    },
  },
  {
    id:      'markdown',
    lucide:  'file-text',
    icon:    'MD',
    name:    'Markdown Editor',
    desc:    'Редактор з live preview',
    file:    'markdown',
    export:  'renderMarkdown',
    order:   6,
    group:   'text',
    enabled: true,
    tip: {
      title: 'Markdown — шпаргалка',
      text:  '<code># H1</code> &nbsp;<code>**жирний**</code> &nbsp;<code>*курсив*</code><br>' +
             '<code>`code`</code> &nbsp;<code>[текст](url)</code> &nbsp;<code>- список</code><br>' +
             'Підтримують: GitHub, GitLab, Notion, Obsidian, Discord.',
    },
  },
  {
    id:      'dummydata',
    lucide:  'users',
    icon:    '👤',
    name:    'Dummy Data',
    desc:    'Генератор тестових користувачів',
    file:    'dummydata',
    export:  'renderDummyData',
    order:   7,
    group:   'text',
    enabled: true,
    tip: {
      title: 'Навіщо тестові дані?',
      text:  'Реальні дані не можна використовувати через GDPR. Тестові потрібні для:<br>' +
             '• Наповнення UI при розробці<br>• Тестування форм та валідації<br>' +
             '• Load testing · Демонстрацій',
    },
  },

  // ── Кодування ────────────────────────────────────────────────────────────────
  {
    id:      'base64',
    lucide:  'binary',
    icon:    '64',
    name:    'Base64',
    desc:    'Encoder / Decoder · файли',
    file:    'base64',
    export:  'renderBase64',
    order:   8,
    group:   'encode',
    enabled: true,
    tip: {
      title: 'Що таке Base64?',
      text:  'Кодує бінарні дані у ASCII-рядок. Використовується для:<br>' +
             '• <b>Data URI</b> — вбудовані зображення в CSS<br>' +
             '• <b>JWT токени</b> — header та payload<br>' +
             '• <b>API</b> — передача файлів у JSON<br>' +
             'Важливо: Base64 <b>не є шифруванням</b>.',
    },
  },
  {
    id:      'urlencode',
    lucide:  'link',
    icon:    '%',
    name:    'URL Encoder',
    desc:    'Encode / Decode · розбір URL',
    file:    'urlencode',
    export:  'renderUrlEncode',
    order:   9,
    group:   'encode',
    enabled: true,
    tip: {
      title: 'encodeURIComponent vs encodeURI',
      text:  '<b>encodeURIComponent</b> — кодує все крім <code>A–Z a–z 0–9 - _ . ! ~ * \' ( )</code>. ' +
             'Для значень параметрів.<br>' +
             '<b>encodeURI</b> — зберігає структуру URL (<code>: / ? # @</code>). ' +
             'Для повних URL.',
    },
  },
  {
    id:      'hash',
    lucide:  'hash',
    icon:    '#',
    name:    'Hash Generator',
    desc:    'MD5 · SHA-1/256/384/512',
    file:    'hash',
    export:  'renderHash',
    order:   10,
    group:   'encode',
    enabled: true,
    tip: {
      title: 'SHA-256 vs MD5',
      text:  '<b>MD5</b> — зламаний, тільки для перевірки файлів.<br>' +
             '<b>SHA-1</b> — небезпечний, використовується у Git.<br>' +
             '<b>SHA-256</b> — стандарт: TLS, JWT, Bitcoin. Рекомендується.<br>' +
             '<b>SHA-512</b> — для критичних застосунків.',
    },
  },

  // ── Генератори ───────────────────────────────────────────────────────────────
  {
    id:      'password',
    lucide:  'key-round',
    icon:    '⚿',
    name:    'Password Gen',
    desc:    'Генератор безпечних паролів',
    file:    'password',
    export:  'renderPassword',
    order:   11,
    group:   'generate',
    enabled: true,
    tip: {
      title: 'Що робить пароль надійним?',
      text:  '<b>Довжина + різноманітність</b>. 8 символів лише з малих букв — секунди. ' +
             '16+ символів з усіма наборами — практично невразливий.<br>' +
             'Ніколи не використовуй один пароль на кількох сайтах.',
    },
  },
  {
    id:      'qrbar',
    lucide:  'qr-code',
    icon:    '▦',
    name:    'QR / Barcode',
    desc:    'QR-коди та штрих-коди',
    file:    'qrbar',
    export:  'renderQrBar',
    order:   12,
    group:   'generate',
    enabled: true,
    tip: {
      title: 'QR-код vs Штрих-код',
      text:  '<b>QR</b> — до ~3000 символів, будь-який кут, URL/Wi-Fi/контакти.<br>' +
             '<b>Штрих-код</b> — стандарт у роздрібній торгівлі та логістиці.<br>' +
             '<b>EAN-13</b> — міжнародний стандарт для товарів (13 цифр).',
    },
  },

  // ── Валідатори ───────────────────────────────────────────────────────────────
  {
    id:      'json',
    lucide:  'braces',
    icon:    '{}',
    name:    'JSON Validator',
    desc:    'Форматування та валідація JSON',
    file:    'json',
    export:  'renderJson',
    order:   13,
    group:   'validate',
    enabled: true,
    tip: {
      title: 'Типові помилки у JSON',
      text:  '• Ключі завжди в <b>подвійних</b> лапках<br>' +
             '• Нема коментарів (// або /* */)<br>' +
             '• Нема trailing comma: <code>{"a":1,}</code> — помилка<br>' +
             '• <code>undefined</code> → тільки <code>null</code><br>' +
             '<b>Ctrl+Enter</b> — швидке форматування.',
    },
  },

  // ── Система ──────────────────────────────────────────────────────────────────
  {
    id:      'whois',
    lucide:  'search',
    icon:    '🔍',
    name:    'WHOIS Lookup',
    desc:    'Перевірка домену, реєстратор, дати',
    file:    'whois',
    export:  'renderWhois',
    order:   14,
    group:   'validate',
    enabled: true,
    tip: {
      title: 'Що таке WHOIS / RDAP?',
      text:  '<b>WHOIS</b> — протокол для отримання інформації про доменне ім\'я: реєстратор, власник, дати реєстрації та спливання, nameservers.<br>' +
             '<b>RDAP</b> (Registration Data Access Protocol) — сучасна заміна WHOIS, повертає структурований JSON. ' +
             'Підтримує CORS, тому працює прямо у браузері.<br>' +
             'Дані надаються реєстратором — деякі поля можуть бути приховані через GDPR.',
    },
  },
  {
    id:      'ascii',
    lucide:  'binary',
    icon:    'A',
    name:    'ASCII Converter',
    desc:    'Текст ↔ ASCII/Hex/Binary/Unicode',
    file:    'ascii',
    export:  'renderAscii',
    order:   15,
    group:   'encode',
    enabled: true,
    tip: {
      title: 'ASCII, Unicode, UTF-8 — різниця',
      text:  '<b>ASCII</b> — 128 символів (0–127): латиниця, цифри, розділові знаки. 7-бітний стандарт 1963 року.<br>' +
             '<b>Unicode</b> — понад 140 000 символів з усіх мов світу. Кожен символ має унікальний code point (U+XXXX).<br>' +
             '<b>UTF-8</b> — найпоширеніше кодування Unicode. Сумісне з ASCII для перших 128 символів. ' +
             'Кирилиця кодується у 2 байти.',
    },
  },
  {
    id:      'favicon',
    lucide:  'image',
    icon:    '⭐',
    name:    'Favicon Converter',
    desc:    'Generate favicons from any image',
    file:    'favicon',
    export:  'renderFavicon',
    order:   16,
    group:   'generate',
    enabled: true,
    tip: {
      title: 'What sizes does a favicon need?',
      text:  '<b>16×16</b> — classic browser tab.<br>' +
             '<b>32×32</b> — retina browser tab, taskbar.<br>' +
             '<b>180×180</b> — Apple Touch Icon (iOS home screen).<br>' +
             '<b>192×192</b> and <b>512×512</b> — Android Chrome / PWA.<br>' +
             '<b>favicon.ico</b> — multi-size ICO containing 16, 32, 48px. ' +
             'Place it in the root of your site for maximum compatibility.',
    },
  },

  {
    id:      'admin',
    lucide:  'settings',
    icon:    '⚙',
    name:    'Admin',
    desc:    'Керування інструментами',
    file:    'admin',
    export:  'renderAdmin',
    order:   99,
    group:   null,
    enabled: true,
    sys:     true,
  },
];