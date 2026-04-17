# Changelog — ToolboxHelp.com

Всі значущі зміни проекту задокументовані тут.
Формат базується на [Keep a Changelog](https://keepachangelog.com/uk/1.0.0/).

Версії: `MAJOR.MINOR.PATCH`
- **PATCH** — виправлення багів, дрібні зміни (2.4.0 → 2.4.1)
- **MINOR** — новий інструмент або нова функція (2.4.0 → 2.5.0)
- **MAJOR** — повний рефакторинг або зміна архітектури (2.x.x → 3.0.0)

---

## [2.7.2] — 2025-05-15

### Змінено
- **WHOIS Lookup** — повний редизайн з 4 вкладками:
  1. **WHOIS/RDAP** — IP Address, Registrar Information, Important Dates, Nameservers, Domain Status, Contact Information, Raw RDAP JSON, About WHOIS/RDAP
  2. **DNS Records** — A, AAAA, MX, NS, TXT, CNAME, SOA, CAA через Cloudflare DoH; таблиця з NAME/TTL/VALUE
  3. **Uptime** — HTTP/HTTPS перевірка доступності з RTT, Historical Data, About Uptime Monitoring
  4. **Diagnostics** — Ping і Traceroute через HackerTarget API; About Ping & Traceroute
- Skeleton loader при завантаженні кожної вкладки
- Lazy-load: вкладки завантажуються тільки при першому відкритті
- Підтримка як доменів так і IP-адрес

---

---

## [2.7.1] — 2025-05-15

### Виправлено
- **Висота рекламного блоку 285px** — AdSense JS додає `style="height:auto !important; max-height:none !important"` прямо на `.ad-bar` і `<ins>` — CSS не може це перевизначити. Рішення: новий `.ad-bar-outer` з `height:100px; overflow:hidden` який AdSense ніколи не чіпає. `.ad-bar` може рости скільки завгодно — outer обрізає
- **404 на Vercel** — `404.html` тепер знаходиться у **корені проекту** з правильними відносними шляхами (`css/style.css`, `img/favicon.ico`). Vercel автоматично подає `404.html` з кореня для будь-яких 404 помилок — не потрібні додаткові `routes` або `rewrites`
- Прибрано `data-ad-format="auto"` і `data-full-width-responsive="true"` з `<ins>` — вони дозволяли AdSense самовільно змінювати розмір
---

## [2.7.0] — 2025-05-14

### Додано
- **i18n система** (`js/i18n.js`) — підтримка UK/EN з автодетектом мови браузера, localStorage, URL-параметром `?lang=en`
- **Language switcher** — кнопки UK / EN у topbar, зберігають вибір між сесіями
- **SEO для багатомовності** — `<link rel="alternate" hreflang>` в `index.html`, `<html lang>` змінюється динамічно
- Функція `t(key)` доступна у всіх інструментах через `ctx.t`

### Змінено
- `home.js` — повністю перекладений через i18n
- `main.js` — nav groups, nav labels, notify повідомлення через `t()`
- `index.html` — `data-i18n` атрибути на footer, sidebar, topbar; hreflang SEO теги; canonical
- `pages/about.html`, `contacts.html`, `privacy.html` — оновлено відповідно до завантажених файлів; виправлено баг у Formspree (умова `!== 'YOUR_FORM_ID'`)
- **Рекламний банер** — `height:100px; max-height:100px` на `.ad-bar`, `height:90px !important` на `.ad-slot-wrap ins` — жорстке обмеження

### Виправлено
- `contacts.html` — Formspree ніколи не надсилав через баг в умові (`!== 'mvzdpwwl'` замість `!== 'YOUR_FORM_ID'`)

## [2.6.0] — 2025-05-13

### Виправлено
- **Сторінки /about, /contacts, /privacy на Vercel** — `cleanUrls: true` конфліктував з rewrites: Vercel стрипував `.html` з destination і не знаходив `pages/about.html`. Видалено `cleanUrls`, тепер rewrites працюють явно
- **404 на Vercel** — тепер `/(.*) → /pages/404.html` перехоплює всі невідомі URL; без `cleanUrls` правило спрацьовує коректно
- **Великий банер реклами** — замінено inline `width:728px;height:90px` на `display:block` з CSS-обмеженням через `.ad-slot-wrap`. `max-height:110px` на контейнері

### Додано
- **WHOIS Lookup** — перевірка домену через RDAP API (rdap.org): реєстратор, власник, дати реєстрації/спливання, nameservers, статуси, перевірка DNS через Cloudflare DoH
- **ASCII Converter** — три режими: Text→Codes (DEC/HEX/BIN/OCT/HTML Entity/Unicode), Codes→Text, повна ASCII-таблиця (0–127) з пошуком та фільтром по групах

---

## [2.5.7] — 2025-05-12

### Виправлено
- **Порожній екран / нічого не працює** — `Promise.all` замінено на `Promise.allSettled`: якщо один інструмент не завантажується, решта продовжують працювати. Додано `try/catch` навколо `tool.render()` — помилка в одному інструменті не ламає весь застосунок
- **Годинник не працює** — `updateClock()` тепер викликається одразу при старті + кожну секунду через `setInterval`. Null-check на `document.getElementById('tb-clock')` запобігає помилкам
- **Великий блок реклами** — `<ins>` обмежено через `max-width: min(728px, calc(100vw - sidebar - 120px))`. На мобільних — `width:100% !important`

### Змінено
- **Рекламний блок** — замінено placeholder на реальний AdSense код (`ca-pub-1778963811750250`, slot `1905379734`)
- Весь код тепер розрахований на звичайний локальний сервер (без MAMP-специфіки)

---

## [2.5.6] — 2025-05-12

### Виправлено
- **Порожній екран після v2.5.5** — `await import('@vercel/analytics')` з bare module specifier вбивав весь ES-модуль у браузері без бандлера. Рядок видалено. Vercel Analytics працює через `/_vercel/insights/script.js` у HTML (цього достатньо)
- **VERSION fetch** — тепер спочатку `/VERSION` (Vercel), потім `VERSION` (локально) — fallback для MAMP підпапки
- **Pathname routing** — `rawPath.split('/')[0]` замість повного pathname — коректно працює у підпапці MAMP (`/toolbox/aspect` → `aspect`)
- **404 сторінка** — catch-all rewrite `/(.*) → /pages/404.html` у `vercel.json`

### Додано
- **`.htaccess`** — Apache SPA routing для MAMP: невідомі шляхи → `index.html`, `/about` → `pages/about.html`, custom `ErrorDocument 404`
- **Google AdSense** — `ca-pub-1778963811750250` скрипт у `<head>` `index.html`
- **Контактна форма** — поля: ім'я, email, повідомлення, прикріплення файлів; Formspree + `mailto:` fallback; email: `artur.oleksiuk.89@gmail.com`

---

## [2.5.5] — 2025-05-10

### Змінено
- **Структура** — `about.html`, `contacts.html`, `privacy.html`, `404.html` переміщено в `pages/`
- **URL routing** — інструменти тепер використовують pathname замість hash:
  - `toolboxhelp.com/aspect` замість `toolboxhelp.com/#aspect`
  - Головна — чистий `/`, без `#home`
  - F5 / пряме посилання відновлює потрібний інструмент
- **`vercel.json`** — clean URL rewrites:
  - `/about` → `pages/about.html`
  - `/contacts` → `pages/contacts.html`
  - `/privacy` → `pages/privacy.html`
  - `/aspect`, `/units`, ... → `index.html` (SPA routing)
  - 301-редиректи зі старих `.html` посилань на clean URLs
- **`privacy.html`** — посилання на email замінено на `/contacts`
- Всі посилання між сторінками оновлено на clean URLs (`/about`, `/contacts`, `/privacy`)

---

## [2.5.4] — 2025-05-10

### Виправлено
- `addLog('system: started vX.X.X')` — версія більше не хардкодиться у `main.js`, читається з `VERSION` через `fetch` (той самий механізм що й sidebar)
- Рік у footer: `2026` → `2026`, починаючи з 2027 → `2026–2027` і далі автоматично
- Перегенеровано `contacts.html` та `privacy.html` (Cloudflare-скрипти прибрані)

### Змінено
- **Меню** — інструменти розбито по групах:
  - **CSS & Дизайн** — CSS Units, Color Converter, Aspect Ratio
  - **Текст & Дані** — Text Counter, Diff Checker, Markdown Editor, Dummy Data
  - **Кодування** — Base64, URL Encoder, Hash Generator
  - **Генератори** — Password Gen, QR / Barcode
  - **Валідатори** — JSON Validator
- `tools.config.js` — додано поле `group` для кожного інструменту
- `buildNav()` у `main.js` — читає групи з конфігу, рендерить секції автоматично
- Оновлено `README.md`

---

## [2.5.3] — 2025-05-09

### Додано
- **`about.html`** — сторінка «Про нас»: принципи, стек, список інструментів
- **`contacts.html`** — сторінка «Контакти»: email, як повідомити про баг, запропонувати інструмент
- **`privacy.html`** — «Політика конфіденційності»: що збираємо (нічого особистого), AdSense, Vercel Analytics, localStorage
- **Footer** у `index.html` — посилання на всі три сторінки + рік копірайту, видимий на всіх пристроях

### Змінено
- `color.js` — прибрано секцію генерації палітр (повернуто до попередньої версії)

---

## [2.5.2] — 2025-05-09

### Додано
- **Vercel Analytics** — `/_vercel/insights/script.js` у `index.html` + `inject()` у `main.js` (ігнорується на локальному сервері)
- **Google AdSense банер** — sticky-footer зона у `.main` з placeholder 728×90 (desktop) / 320×50 (mobile); інструкції для підключення у коментарях `index.html`
- **`vercel.json`** — конфіг деплою: SPA routing, агресивне кешування CSS/JS/IMG, no-cache для VERSION, security headers

---

## [2.5.1] — 2025-05-09

### Виправлено
- **`/?i=1`** у рядку адреси — виправлено `navigate()`, тепер завжди використовується `#id` формат
- Відносні шляхи у `index.html` і `404.html` (прибрано leading `/` з favicon та VERSION fetch)

### Додано
- **Lucide Icons** — SVG-іконки у sidebar через CDN (`lucide.dev`), emoji як fallback
- **Tips (довідки)** — під кожним інструментом collapsible-блок з поясненням
- **Color Converter** — генерація палітр: комплементарна, тріадна, аналогова, відтінки, тінти
- **`meta description`** та **`meta keywords`** в `index.html` і `404.html`
- **Open Graph** мета-теги в `index.html`
- Оновлено `README.md` — повна документація v2.5.x

---

## [2.5.0] — 2025-05-08

### Додано
- **URL Encoder** — encode/decode з encodeURIComponent/encodeURI, авто-конвертація, розбір URL на складові
- **Dummy Data Generator** — генератор тестових користувачів (ім'я, email, телефон, адреса, компанія тощо), формати: картки / JSON / CSV / таблиця, EN та UA імена
- **Markdown Editor** — split/edit/preview режими, live-рендер, toolbar з форматуванням, підтримка таблиць, Code blocks, Tab→indent, копіювання MD або HTML
- URL routing через `history.pushState` — при переході на інструмент URL змінюється на `#tool-id`
- Відновлення сторінки після F5 — зчитується `#hash` з URL
- Навігація кнопками браузера (назад/вперед) через `popstate`
- Версія сайту читається з файлу `VERSION` через `fetch('/VERSION')` — більше не треба змінювати `index.html`

### Змінено
- `index.html` — прибрано хардкодену версію, `id="app-version"` заповнюється з `VERSION`

---

## [2.4.1] — 2025-05-07

### Виправлено
- **Password Gen** — артефакти при перетягуванні повзунка (паролі злипались у блоки)
- **Password Gen** — неправильна довжина згенерованих паролів (показувало менше символів ніж задано)
- **Password Gen** — некоректна оцінка надійності (короткий пароль міг показати "Відмінний")
- **Password Gen** — тепер гарантується наявність символів з кожного увімкненого набору + Fisher-Yates перемішування

### Змінено
- `CSS Units` → `CSS Units Converter`
- `QR / Barcode` → `QR/Barcode Generator`
- `JSON Formatter` → `JSON Validator`
- `Base64` → `Base64 Encoder`
- `toolboxhelp.dev` → `toolboxhelp.com` скрізь

### Додано
- `CHANGELOG.md` — цей файл
- `VERSION` — файл з поточною версією

---

## [2.4.0] — 2025-05-06

### Додано
- **Base64 Encoder** — Encode / Decode тексту, URL-safe режим, drag & drop файлів до 5MB, preview зображень
- **Diff Checker** — порівняння тексту з LCS-алгоритмом, режими: Рядки / Слова / Символи, статистика змін
- Адаптивний мобільний скрол (виправлено `overflow:hidden` на мобільних)
- `404.html` — оновлені кольори під нову схему

---

## [2.3.0] — 2025-05-05

### Додано
- **JSON Validator** — форматування, syntax highlighting, мінімайзер, статистика, live-валідація
- **Hash Generator** — MD5 + SHA-1/256/384/512, перевірка хешу, клік = копіювати

### Змінено
- Кольорова схема → темно-синій (Fuelygo-стиль): `#0d1117` фон, `#18e070` акцент
- **Color Converter** — tooltips `?` з поясненням кожного формату
- **Password Gen** — початкова довжина 8 символів, "Символи" увімкнено за замовчуванням

---

## [2.2.0] — 2025-05-04

### Додано
- Бургер-меню на мобільних (slide-in sidebar з overlay)
- `js/ui/components.js` — бібліотека спільних UI-компонентів

### Змінено
- Назва проекту: `DevToolbox` → `ToolboxHelp`
- Головна сторінка — лендінг замість сітки інструментів
- Видалено `local · no tracking` з сайдбару
- Блоки переваг: тільки "Миттєво" і "Приватно"

---

## [2.1.4] — 2025-05-03

### Додано
- Tooltips у **CSS Units** з формулами і прикладами для кожної одиниці
- Повна адаптивність (`@media` для 1100px, 768px, 480px)
- Блоки переваг на головній: Миттєво / Приватно / Розширювано

### Виправлено
- `404.html` — центрування сторінки
- PARENT FONT поле в CSS Units більше не опускається

---

## [2.1.3] — 2025-05-02

### Додано
- **Адмінка** — пароль у окремому файлі `js/admin.config.js` (не зберігається у localStorage)
- SHA-256 хешування пароля в браузері

### Змінено
- Адмінка більше не пропонує встановити пароль при першому відкритті

---

## [2.1.2] — 2025-05-02

### Виправлено
- Список інструментів на головній (зайве справа)
- "6 інструментів" прибрано з eyebrow
- "Розширювано" замінено на "Зручно"
- Адмінка — повернуто локальну версію (без FastAPI)

---

## [2.1.1] — 2025-05-01

### Додано
- Нова головна сторінка — лендінг з hero + список інструментів + переваги
- Фавікон `<link rel="icon" href="/img/favicon.ico">`

### Змінено
- Прибрано `local · no tracking` з sidebar
- Версія стала трирівневою: `MAJOR.MINOR.PATCH`

---

## [2.1.0] — 2025-04-30

### Додано
- **Text Counter** — лічильник символів (з/без пробілів), слова, рядки, речення, параграфи
- **QR/Barcode Generator** — QR (qrcode-generator), BAR (JsBarcode), PNG/SVG завантаження, відступи
- Система версій `MAJOR.MINOR.PATCH`
- Панель адміністратора з паролем і сесією

### Змінено
- Архітектура: ES-модулі (`import/export`), `tools.config.js` реєстр
- `js/ui/components.js` — спільні UI-компоненти

---

## [2.0.0] — 2025-04-28

### Додано
- Повний рефакторинг: єдиний `index.html` + `css/style.css` + `js/main.js` + `js/tools/*.js`
- **Aspect Ratio** — калькулятор співвідношень сторін
- **CSS Units** — конвертер px/rem/em/vw/vh
- **Color Converter** — HEX/RGB/HSL
- **Password Generator** — bcrypt-рівень генерації
- Адмін-панель з drag-and-drop сортуванням
- Темна тема, шрифт Geist Mono

---

## [1.0.0] — початкова версія

- Один HTML-файл з усіма інструментами