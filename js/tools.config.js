/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  tools.config.js  —  РЕЄСТР ІНСТРУМЕНТІВ                    ║
 * ║                                                              ║
 * ║  Щоб додати нову сторінку:                                   ║
 * ║  1. Створи файл  js/tools/mytool.js                          ║
 * ║     export function renderMyTool(el, ctx) { ... }            ║
 * ║  2. Додай один об'єкт у масив TOOLS нижче                    ║
 * ║                                                              ║
 * ║  Меню, головна, адмінка підхоплять інструмент автоматично.   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Поля об'єкта:
 *   id      — унікальний ідентифікатор (латиниця, без пробілів)
 *   lucide  — назва іконки Lucide (https://lucide.dev/icons/)
 *   icon    — emoji fallback якщо Lucide не завантажився
 *   name    — назва у меню
 *   desc    — короткий опис (головна сторінка)
 *   file    — шлях від js/tools/ (без .js)
 *   export  — ім'я export function
 *   order   — порядок у меню (менше = вище)
 *   enabled — показувати за замовчуванням
 *   sys     — системний (не рахується в active tools)
 *   tip     — { title, text } — довідка під інструментом
 */

export const TOOLS = [
  {
    id:      'home',
    lucide:  'house',
    icon:    '⌂',
    name:    'Головна',
    desc:    'Огляд усіх інструментів',
    file:    'home',
    export:  'renderHome',
    order:   0,
    enabled: true,
  },
  {
    id:      'aspect',
    lucide:  'ratio',
    icon:    '▭',
    name:    'Aspect Ratio',
    desc:    'Співвідношення сторін екрану',
    file:    'aspect',
    export:  'renderAspect',
    order:   1,
    enabled: true,
    tip: {
      title: 'Навіщо знати Aspect Ratio?',
      text:  'Співвідношення сторін (aspect ratio) — це відношення ширини до висоти зображення або екрану. ' +
             '<b>16:9</b> — стандарт для відео та більшості моніторів. <b>4:3</b> — старі монітори та фото. ' +
             '<b>1:1</b> — квадрат (Instagram). <b>9:16</b> — вертикальне відео (TikTok, Reels, Shorts). ' +
             'Знаючи ratio, можна точно розраховувати розміри банерів, відео, зображень без спотворень.',
    },
  },
  {
    id:      'units',
    lucide:  'ruler',
    icon:    '⇄',
    name:    'CSS Units Converter',
    desc:    'Конвертер px · rem · em · vw · vh',
    file:    'units',
    export:  'renderUnits',
    order:   2,
    enabled: true,
    tip: {
      title: 'Що таке REM і чому він кращий за PX?',
      text:  '<b>PX</b> — абсолютна одиниця. Не змінюється при зміні налаштувань браузера. ' +
             'Погано для доступності.<br>' +
             '<b>REM</b> (root em) — відносно <code>font-size</code> кореневого елемента <code>&lt;html&gt;</code>. ' +
             'Якщо користувач збільшить шрифт у браузері — весь layout масштабується. ' +
             'Рекомендується для типографіки та відступів.<br>' +
             '<b>EM</b> — відносно батьківського елемента. При вкладенні множиться, що може призводити до ' +
             'непередбачуваних результатів.<br>' +
             '<b>VW/VH</b> — відсоток від ширини/висоти вікна. Ідеально для fluid-лейаутів.',
    },
  },
  {
    id:      'color',
    lucide:  'pipette',
    icon:    '◉',
    name:    'Color Converter',
    desc:    'HEX ↔ RGB ↔ HSL · палітри',
    file:    'color',
    export:  'renderColor',
    order:   3,
    enabled: true,
    tip: {
      title: 'HEX, RGB чи HSL — що вибрати?',
      text:  '<b>HEX</b> (#rrggbb) — найпоширеніший у вебі. Зручний для копіювання з Figma/дизайнера.<br>' +
             '<b>RGB</b> — корисний коли потрібно програмно маніпулювати каналами кольору.<br>' +
             '<b>HSL</b> (Hue, Saturation, Lightness) — найінтуїтивніший для людини. ' +
             'Легко отримати темніший/світліший варіант: просто зменшити/збільшити L. ' +
             'Ідеальний для генерації палітр у CSS.',
    },
  },
  {
    id:      'password',
    lucide:  'key-round',
    icon:    '⚿',
    name:    'Password Gen',
    desc:    'Генератор безпечних паролів',
    file:    'password',
    export:  'renderPassword',
    order:   4,
    enabled: true,
    tip: {
      title: 'Що робить пароль надійним?',
      text:  'Надійний пароль — це <b>довжина + різноманітність</b>. ' +
             'Пароль з 8 символів лише з малих букв можна зламати за лічені секунди. ' +
             'Той самий пароль з великими, цифрами та символами — вже годинами. ' +
             '16+ символів з усіма наборами — практично невразливий для brute-force.<br>' +
             '<b>Ніколи</b> не використовуй один пароль на кількох сайтах. ' +
             'Рекомендується менеджер паролів (Bitwarden, 1Password, KeePass).',
    },
  },
  {
    id:      'textcount',
    lucide:  'type',
    icon:    '¶',
    name:    'Text Counter',
    desc:    'Лічильник символів і слів',
    file:    'textcount',
    export:  'renderTextCount',
    order:   5,
    enabled: true,
    tip: {
      title: 'Навіщо рахувати символи?',
      text:  'Ліміти символів зустрічаються скрізь: ' +
             '<b>Twitter/X</b> — 280 символів, <b>meta description</b> — 155–160, ' +
             '<b>SMS</b> — 160 (Latin) або 70 (Unicode/кирилиця), ' +
             '<b>title тег</b> — 50–60 для SEO.<br>' +
             'Лічильник слів корисний при написанні статей, де є мінімальні вимоги (наприклад, 1000+ слів для SEO).',
    },
  },
  {
    id:      'qrbar',
    lucide:  'qr-code',
    icon:    '▦',
    name:    'QR/Barcode Generator',
    desc:    'Генератор QR та штрих-кодів',
    file:    'qrbar',
    export:  'renderQrBar',
    order:   6,
    enabled: true,
    tip: {
      title: 'QR-код vs Штрих-код — коли що використовувати?',
      text:  '<b>QR-код</b> — зберігає до ~3000 символів, читається під будь-яким кутом, ' +
             'підтримує URL, Wi-Fi, контакти, геолокацію. Є рівні корекції помилок (L/M/Q/H).<br>' +
             '<b>Штрих-код (CODE128, EAN-13)</b> — лише числа/текст, менша місткість, ' +
             'але стандарт у роздрібній торгівлі та логістиці.<br>' +
             '<b>EAN-13</b> — міжнародний стандарт для товарів у магазинах (13 цифр).',
    },
  },
  {
    id:      'hash',
    lucide:  'hash',
    icon:    '#',
    name:    'Hash Generator',
    desc:    'MD5 · SHA-1 · SHA-256 · SHA-512',
    file:    'hash',
    export:  'renderHash',
    order:   7,
    enabled: true,
    tip: {
      title: 'SHA-256 vs MD5 — яку хеш-функцію обрати?',
      text:  '<b>MD5</b> — швидкий, але криптографічно зламаний. Підходить лише для перевірки ' +
             'цілісності файлів (не для паролів!).<br>' +
             '<b>SHA-1</b> — теж вважається небезпечним, але ще використовується у Git.<br>' +
             '<b>SHA-256</b> — поточний стандарт. Використовується у TLS, JWT, Bitcoin, ' +
             'перевірці завантажень. Рекомендується для більшості задач.<br>' +
             '<b>SHA-512</b> — довший хеш, складніший для GPU-атак. Корисний для критичних застосунків.',
    },
  },
  {
    id:      'json',
    lucide:  'braces',
    icon:    '{}',
    name:    'JSON Validator',
    desc:    'Форматування та валідація JSON',
    file:    'json',
    export:  'renderJson',
    order:   8,
    enabled: true,
    tip: {
      title: 'Типові помилки у JSON',
      text:  'JSON суворіший за JavaScript-об\'єкти:<br>' +
             '• Ключі завжди в <b>подвійних лапках</b>: <code>"key": "value"</code><br>' +
             '• Нема коментарів (// або /* */)<br>' +
             '• Нема trailing comma: <code>{"a":1,}</code> — помилка<br>' +
             '• <code>undefined</code> не підтримується, тільки <code>null</code><br>' +
             '• Числа не можуть починатись з 0: <code>07</code> — помилка<br>' +
             'Використовуй <b>Ctrl+Enter</b> для швидкого форматування.',
    },
  },
  {
    id:      'base64',
    lucide:  'binary',
    icon:    '64',
    name:    'Base64 Encoder',
    desc:    'Encoder / Decoder · файли',
    file:    'base64',
    export:  'renderBase64',
    order:   9,
    enabled: true,
    tip: {
      title: 'Що таке Base64 і навіщо він потрібен?',
      text:  'Base64 кодує бінарні дані у рядок з 64 ASCII-символів. ' +
             'Використовується коли потрібно передати бінарні дані через текстовий канал:<br>' +
             '• <b>Data URI</b> — вбудовані зображення в CSS/HTML: <code>url("data:image/png;base64,...")</code><br>' +
             '• <b>JWT токени</b> — header та payload закодовані у Base64URL<br>' +
             '• <b>Email вкладення</b> (MIME)<br>' +
             '• <b>API</b> — передача файлів у JSON<br>' +
             'Важливо: Base64 <b>не є шифруванням</b> — дані легко декодуються.',
    },
  },
  {
    id:      'diff',
    lucide:  'git-compare-arrows',
    icon:    '↔',
    name:    'Diff Checker',
    desc:    'Порівняння тексту',
    file:    'diff',
    export:  'renderDiff',
    order:   10,
    enabled: true,
    tip: {
      title: 'Як читати diff?',
      text:  'Diff показує різницю між двома версіями тексту:<br>' +
             '<span style="color:var(--green)">+ зелений</span> — рядок доданий у нову версію<br>' +
             '<span style="color:var(--red)">− червоний</span> — рядок видалений зі старої версії<br>' +
             'Без кольору — рядок не змінився.<br>' +
             'Режими: <b>Рядки</b> — порівнює цілі рядки (як git diff), ' +
             '<b>Слова</b> — виділяє змінені слова, ' +
             '<b>Символи</b> — найточніший, але повільніший на великих текстах.',
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
    order:   11,
    enabled: true,
    tip: {
      title: 'encodeURIComponent vs encodeURI — різниця',
      text:  '<b>encodeURIComponent</b> — кодує всі символи крім <code>A–Z a–z 0–9 - _ . ! ~ * \' ( )</code>. ' +
             'Використовуй для значень параметрів: <code>?q=hello+world</code> → <code>?q=hello%2Bworld</code><br>' +
             '<b>encodeURI</b> — кодує менше символів, зберігає структуру URL (<code>: / ? # @ &</code>). ' +
             'Використовуй для повних URL.<br>' +
             '<b>Приклад:</b> <code>encodeURIComponent("a&b=c")</code> → <code>"a%26b%3Dc"</code>',
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
    order:   12,
    enabled: true,
    tip: {
      title: 'Навіщо тестові дані?',
      text:  'Реальні дані не можна використовувати для розробки та тестування через приватність (GDPR). ' +
             'Тестові дані потрібні для:<br>' +
             '• Наповнення UI при розробці (щоб побачити як виглядає таблиця з 50 рядками)<br>' +
             '• Тестування форм та валідації<br>' +
             '• Демонстрацій та презентацій<br>' +
             '• Load testing (перевірка швидкодії при великій кількості записів)<br>' +
             'Формат <b>JSON</b> для API-тестів, <b>CSV</b> для Excel/таблиць, <b>таблиця</b> для швидкого огляду.',
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
    order:   13,
    enabled: true,
    tip: {
      title: 'Markdown — швидка шпаргалка',
      text:  '<code># H1</code> &nbsp;<code>## H2</code> &nbsp;<code>### H3</code><br>' +
             '<code>**жирний**</code> &nbsp;<code>*курсив*</code> &nbsp;<code>~~закреслений~~</code><br>' +
             '<code>`inline code`</code> &nbsp;<code>```блок коду```</code><br>' +
             '<code>[текст](url)</code> &nbsp;<code>![alt](img-url)</code><br>' +
             '<code>- список</code> &nbsp;<code>1. нумерований</code> &nbsp;<code>> цитата</code><br>' +
             '<code>---</code> горизонтальна лінія<br>' +
             'Markdown підтримують: GitHub, GitLab, Notion, Obsidian, Reddit, Discord.',
    },
  },

  // ── Додай новий інструмент тут ───────────────────────────────────────────────
  // {
  //   id:      'mytool',
  //   lucide:  'star',          ← іконка з https://lucide.dev/icons/
  //   icon:    '★',             ← emoji fallback
  //   name:    'My Tool',
  //   desc:    'Опис',
  //   file:    'mytool',
  //   export:  'renderMyTool',
  //   order:   14,
  //   enabled: true,
  //   tip: { title: 'Заголовок довідки', text: 'Текст довідки...' },
  // },

  // ── Система ──────────────────────────────────────────────────────────────────
  {
    id:      'admin',
    lucide:  'settings',
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