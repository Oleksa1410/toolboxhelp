# ToolboxHelp.com

Набір блискавичних офлайн-утиліт для веброзробників.
Без завантажень, без реєстрацій — тільки код.

**Версія:** 2.5.0 · **Сайт:** [toolboxhelp.com](https://toolboxhelp.com)

---

## Інструменти (13)

| # | ID | Назва | Опис |
|---|-----|-------|------|
| 1 | `aspect` | Aspect Ratio | Калькулятор співвідношення сторін |
| 2 | `units` | CSS Units Converter | Конвертер px · rem · em · vw · vh |
| 3 | `color` | Color Converter | HEX ↔ RGB ↔ HSL · генерація палітр |
| 4 | `password` | Password Gen | Генератор безпечних паролів |
| 5 | `textcount` | Text Counter | Лічильник символів, слів, рядків |
| 6 | `qrbar` | QR/Barcode Generator | QR та штрих-коди, PNG/SVG завантаження |
| 7 | `hash` | Hash Generator | MD5 · SHA-1/256/384/512 |
| 8 | `json` | JSON Validator | Форматування, валідація, мінімайзер |
| 9 | `base64` | Base64 Encoder | Encode/Decode тексту і файлів |
| 10 | `diff` | Diff Checker | Порівняння тексту (LCS-алгоритм) |
| 11 | `urlencode` | URL Encoder | Encode/Decode · розбір URL на частини |
| 12 | `dummydata` | Dummy Data | Генератор тестових користувачів |
| 13 | `markdown` | Markdown Editor | Редактор з live preview |

---

## Структура проекту

```
toolbox/
├── index.html              ← shell-сторінка
├── 404.html                ← сторінка помилки
├── VERSION                 ← поточна версія (тільки тут!)
├── CHANGELOG.md            ← історія змін
├── README.md               ← цей файл
├── css/
│   └── style.css           ← всі стилі + responsive + теми
├── img/
│   └── favicon.ico
├── js/
│   ├── main.js             ← роутер, навігація, стан
│   ├── tools.config.js     ← ЄДИНИЙ файл для реєстрації інструментів
│   ├── admin.config.js     ← хеш пароля адмінки (не комітити!)
│   ├── ui/
│   │   └── components.js   ← спільні UI-компоненти
│   └── tools/
│       ├── home.js, aspect.js, units.js, color.js
│       ├── password.js, textcount.js, qrbar.js
│       ├── hash.js, json.js, base64.js, diff.js
│       ├── urlencode.js, dummydata.js, markdown.js
│       ├── admin.js
│       └── _template.js    ← шаблон нового інструменту
└── server/                 ← FastAPI + MySQL бекенд (майбутнє)
```

---

## Запуск

ES-модулі потребують HTTP-сервера (не `file://`).

```bash
# Python
cd toolbox
python3 -m http.server 3000

# Node.js
npx serve .
```

Відкрити: http://localhost:3000

---

## Як додати новий інструмент

### Крок 1 — створи файл

```js
// js/tools/mytool.js
export function renderMyTool(el, ctx) {
  const { notify, copyText, navigate } = ctx;
  el.innerHTML = `<div class="card">...</div>`;
  // логіка
}
```

### Крок 2 — зареєструй в `tools.config.js`

```js
{
  id:      'mytool',
  lucide:  'star',            // іконка з lucide.dev/icons
  icon:    '★',               // emoji fallback
  name:    'My Tool',
  desc:    'Короткий опис',
  file:    'mytool',
  export:  'renderMyTool',
  order:   14,
  enabled: true,
  tip: {
    title: 'Заголовок довідки під інструментом',
    text:  'Текст довідки з <b>HTML</b> підтримкою.',
  },
},
```

**Більше нічого не треба** — меню, головна і адмінка підхоплять автоматично.

---

## Версіонування

Версія зберігається **тільки у файлі `VERSION`**.
`index.html` читає її через `fetch('VERSION')` — більше не треба редагувати вручну.

| Зміна | Що оновити |
|-------|-----------|
| Баг-фікс, дрібна зміна | `VERSION` (PATCH +0.0.1) → `CHANGELOG.md` |
| Новий інструмент | `VERSION` (MINOR +0.1.0) → `CHANGELOG.md` → `README.md` |
| Великий рефакторинг | `VERSION` (MAJOR +1.0.0) → `CHANGELOG.md` → `README.md` |

```
2.5.0
↑ ↑ ↑
│ │ └── PATCH — баги, текст, дрібниці
│ └──── MINOR — новий інструмент або функція
└────── MAJOR — переписування архітектури
```

---

## Адмінка

Пароль адмінки зберігається як SHA-256 хеш у `js/admin.config.js`.

```js
// js/admin.config.js
export const ADMIN_CONFIG = {
  passwordHash: 'sha256_hash_тут',
};
```

**Генерація хешу** (консоль браузера F12):
```js
const hash = async p => Array.from(
  new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p)))
).map(b => b.toString(16).padStart(2,'0')).join('');
hash('ТвійПароль').then(console.log);
```

⚠️ Додай у `.gitignore`:
```
js/admin.config.js
```

---

## URL Routing

При переході на інструмент URL змінюється: `https://toolboxhelp.com/#aspect`
При F5 або прямому переході — відкривається той самий інструмент.
Кнопки браузера "назад/вперед" працюють коректно.

---

## Технічний стек

- **Vanilla JS** з ES-модулями (`import/export`)
- **Без фреймворків** — нульові залежності у рантаймі
- **Lucide Icons** — CDN, SVG іконки в nav
- **Geist + Geist Mono** — шрифти (Google Fonts)
- **CSS Custom Properties** — темна схема `#0d1117`
- **crypto.subtle** — SHA-256/384/512 хешування
- **history.pushState** — URL routing без перезавантаження

---

## .gitignore

```
js/admin.config.js
server/.env
server/__pycache__/
server/.venv/
*.pyc
```