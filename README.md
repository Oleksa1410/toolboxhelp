# ToolboxHelp.com

Набір блискавичних офлайн-утиліт для веброзробників.
Без завантажень, без реєстрацій — тільки код.

**Версія:** 2.5.4 · **Сайт:** [toolboxhelp.com](https://toolboxhelp.com)

---

## Інструменти (13)

### CSS & Дизайн
| ID | Назва | Опис |
|----|-------|------|
| `units` | CSS Units Converter | Конвертер px · rem · em · vw · vh |
| `color` | Color Converter | HEX ↔ RGB ↔ HSL |
| `aspect` | Aspect Ratio | Калькулятор співвідношення сторін |

### Текст & Дані
| ID | Назва | Опис |
|----|-------|------|
| `textcount` | Text Counter | Символи · слова · рядки · речення |
| `diff` | Diff Checker | Порівняння двох текстів (LCS) |
| `markdown` | Markdown Editor | Редактор з live preview |
| `dummydata` | Dummy Data | Генератор тестових користувачів |

### Кодування
| ID | Назва | Опис |
|----|-------|------|
| `base64` | Base64 Encoder | Encode/Decode тексту і файлів |
| `urlencode` | URL Encoder | Encode/Decode · розбір URL |
| `hash` | Hash Generator | MD5 · SHA-1/256/384/512 |

### Генератори
| ID | Назва | Опис |
|----|-------|------|
| `password` | Password Gen | Генератор безпечних паролів |
| `qrbar` | QR / Barcode | QR та штрих-коди, PNG/SVG |

### Валідатори
| ID | Назва | Опис |
|----|-------|------|
| `json` | JSON Validator | Форматування, валідація, мінімайзер |

---

## Структура проекту

```
toolbox/
├── index.html              ← shell-сторінка
├── 404.html                ← сторінка помилки
├── about.html              ← Про нас
├── contacts.html           ← Контакти
├── privacy.html            ← Політика конфіденційності
├── vercel.json             ← конфіг деплою Vercel
├── VERSION                 ← поточна версія (тільки тут!)
├── CHANGELOG.md            ← історія змін
├── README.md               ← цей файл
├── css/
│   └── style.css
├── img/
│   └── favicon.ico
└── js/
    ├── main.js             ← роутер, навігація, стан, buildNav
    ├── tools.config.js     ← реєстр + групи + tips
    ├── admin.config.js     ← хеш пароля (не комітити!)
    ├── ui/
    │   └── components.js
    └── tools/
        ├── home.js, aspect.js, units.js, color.js
        ├── password.js, textcount.js, qrbar.js
        ├── hash.js, json.js, base64.js, diff.js
        ├── urlencode.js, dummydata.js, markdown.js
        ├── admin.js
        └── _template.js
```

---

## Запуск локально

```bash
# Python (вбудований сервер)
cd toolbox
python3 -m http.server 3000
# відкрити http://localhost:3000

# Node.js
npx serve .
```

---

## Як додати новий інструмент

**Крок 1** — створи `js/tools/mytool.js`:
```js
export function renderMyTool(el, ctx) {
  const { notify, copyText } = ctx;
  el.innerHTML = `<div class="card">...</div>`;
}
```

**Крок 2** — додай до `tools.config.js`:
```js
{
  id:      'mytool',
  lucide:  'star',          // іконка lucide.dev/icons
  icon:    '★',             // emoji fallback
  name:    'My Tool',
  desc:    'Короткий опис',
  file:    'mytool',
  export:  'renderMyTool',
  order:   14,
  group:   'generate',      // css | text | encode | generate | validate
  enabled: true,
  tip: { title: 'Заголовок', text: 'HTML-текст довідки' },
},
```

Більше нічого не треба — меню, головна, адмінка підхоплять автоматично.

---

## Версіонування

Версія зберігається **тільки у файлі `VERSION`**.
`index.html` і `main.js` читають її через `fetch('VERSION')`.

| Зміна | Версія | Що оновити |
|-------|--------|-----------|
| Баг-фікс, косметика | PATCH +0.0.1 | `VERSION` → `CHANGELOG.md` |
| Новий інструмент | MINOR +0.1.0 | `VERSION` → `CHANGELOG.md` → `README.md` |
| Великий рефакторинг | MAJOR +1.0.0 | `VERSION` → `CHANGELOG.md` → `README.md` |

---

## Групи меню

Групи визначаються полем `group` у `tools.config.js`:

| group | Секція в меню |
|-------|--------------|
| `css` | CSS & Дизайн |
| `text` | Текст & Дані |
| `encode` | Кодування |
| `generate` | Генератори |
| `validate` | Валідатори |
| `null` | без секції (Головна, Адмін) |

---

## Деплой на Vercel

1. Підключи репозиторій у [vercel.com/new](https://vercel.com/new)
2. Framework Preset: **Other**
3. Root Directory: `toolbox/` (або де лежать файли)
4. Build Command: (порожньо — статичний сайт)
5. Output Directory: `.`

`vercel.json` вже налаштований: SPA routing, кешування, security headers.

---

## Адмінка

Пароль — SHA-256 хеш у `js/admin.config.js`.

Генерація хешу (консоль браузера F12):
```js
const h = async p => Array.from(
  new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p)))
).map(b => b.toString(16).padStart(2,'0')).join('');
h('ТвійПароль').then(console.log);
```

`.gitignore` — обов'язково:
```
js/admin.config.js
```

---

## Технічний стек

- **Vanilla JS** — ES-модулі, без фреймворків
- **Lucide Icons** — SVG іконки (CDN)
- **Geist / Geist Mono** — шрифти (Google Fonts)
- **CSS Custom Properties** — темна схема `#0d1117`
- **Vercel** — хостинг + analytics
- **history.pushState** — URL routing (`#tool-id`)