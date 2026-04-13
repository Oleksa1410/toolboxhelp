# ToolboxHelp.com

Blazing-fast offline-first utilities for web developers.
No downloads, no sign-ups — just code.

**Version:** 2.7.0 · **Site:** [toolboxhelp.com](https://toolboxhelp.com)  
**Languages:** 🇺🇦 Ukrainian · 🇬🇧 English

---

## Tools (15)

### CSS & Design
| ID | Name | Description |
|----|------|-------------|
| `units` | CSS Units Converter | px · rem · em · vw · vh |
| `color` | Color Converter | HEX ↔ RGB ↔ HSL |
| `aspect` | Aspect Ratio | Aspect ratio calculator |

### Text & Data
| ID | Name | Description |
|----|------|-------------|
| `textcount` | Text Counter | Characters · words · lines |
| `diff` | Diff Checker | Compare two text versions (LCS) |
| `markdown` | Markdown Editor | Editor with live preview |
| `dummydata` | Dummy Data | Test user data generator |

### Encoding
| ID | Name | Description |
|----|------|-------------|
| `base64` | Base64 Encoder | Encode/Decode text and files |
| `urlencode` | URL Encoder | Encode/Decode · URL parser |
| `hash` | Hash Generator | MD5 · SHA-1/256/384/512 |
| `ascii` | ASCII Converter | Text ↔ ASCII/Hex/Binary/Unicode |

### Generators
| ID | Name | Description |
|----|------|-------------|
| `password` | Password Gen | Secure password generator |
| `qrbar` | QR / Barcode | QR codes and barcodes, PNG/SVG |

### Validators
| ID | Name | Description |
|----|------|-------------|
| `json` | JSON Validator | Format, validate, minify JSON |
| `whois` | WHOIS Lookup | Domain info via RDAP API |

---

## Project Structure

```
toolbox/
├── index.html              ← Single HTML shell
├── pages/
│   ├── about.html          ← About page
│   ├── contacts.html       ← Contact page (Formspree form)
│   ├── privacy.html        ← Privacy policy
│   └── 404.html            ← Error page
├── vercel.json             ← Vercel deployment config
├── .htaccess               ← Apache fallback routing
├── VERSION                 ← Current version (edit only here!)
├── CHANGELOG.md            ← Version history
├── README.md               ← This file
├── css/
│   └── style.css
├── img/
│   └── favicon.ico
└── js/
    ├── main.js             ← Router, navigation, state, i18n
    ├── i18n.js             ← Translation system (UK/EN)
    ├── tools.config.js     ← Tool registry + groups + tips
    ├── admin.config.js     ← Admin password hash (don't commit!)
    ├── ui/
    │   └── components.js
    └── tools/
        ├── home.js, aspect.js, units.js, color.js
        ├── password.js, textcount.js, qrbar.js
        ├── hash.js, json.js, base64.js, diff.js
        ├── urlencode.js, dummydata.js, markdown.js
        ├── whois.js, ascii.js
        ├── admin.js
        └── _template.js
```

---

## Local Development

```bash
# Python (recommended - supports SPA routing)
python3 -m http.server 3000
# Then open http://localhost:3000

# Node.js (with SPA support)
npx serve . --single
```

> ⚠️ Pathname routing (`/aspect`, `/units`) requires a server. `file://` won't work.

---

## Adding a New Tool

**Step 1** — Create `js/tools/mytool.js`:
```js
import { t } from '../i18n.js';  // optional, for i18n

export function renderMyTool(el, ctx) {
  const { notify, copyText, t } = ctx;
  el.innerHTML = `<div class="card">...</div>`;
}
```

**Step 2** — Register in `tools.config.js`:
```js
{
  id:      'mytool',
  lucide:  'star',          // icon from lucide.dev/icons
  icon:    '★',             // emoji fallback
  name:    'My Tool',
  desc:    'Description',
  file:    'mytool',
  export:  'renderMyTool',
  order:   16,
  group:   'generate',      // css | text | encode | generate | validate
  enabled: true,
  tip: { title: 'Tip title', text: 'HTML tip text' },
},
```

**Step 3** — Add translations to `js/i18n.js`:
```js
// In uk section:
'tool.mytool.name': 'Мій Інструмент',
'tool.mytool.desc': 'Опис',

// In en section:
'tool.mytool.name': 'My Tool',
'tool.mytool.desc': 'Description',
```

**Step 4** — Add rewrite to `vercel.json`:
```json
{ "source": "/mytool", "destination": "/index.html" }
```

Nothing else needed — menu, home page, and admin panel update automatically.

---

## i18n (Internationalization)

Languages: **Ukrainian (uk)** · **English (en)**

The language switcher is in the topbar (UK / EN buttons).

| What | How |
|------|-----|
| All translations | `js/i18n.js` — `TRANSLATIONS.uk` and `TRANSLATIONS.en` |
| Get translation | `t('key')` from `import { t } from '../i18n.js'` |
| In tools | `ctx.t` is passed in context |
| HTML elements | `data-i18n="key"` attribute — auto-applied |
| Auto-detect | Browser language → localStorage → URL `?lang=en` |
| SEO | `hreflang` alternate links in `<head>` |

---

## Versioning

Version lives **only in the `VERSION` file**.

| Change | Version | What to update |
|--------|---------|----------------|
| Bug fix, cosmetic | PATCH +0.0.1 | `VERSION` → `CHANGELOG.md` |
| New tool / feature | MINOR +0.1.0 | `VERSION` → `CHANGELOG.md` → `README.md` |
| Full rewrite | MAJOR +1.0.0 | `VERSION` → `CHANGELOG.md` → `README.md` |

---

## Menu Groups

| `group` | Menu section (UK) | Menu section (EN) |
|---------|-------------------|-------------------|
| `css` | CSS & Дизайн | CSS & Design |
| `text` | Текст & Дані | Text & Data |
| `encode` | Кодування | Encoding |
| `generate` | Генератори | Generators |
| `validate` | Валідатори | Validators |
| `null` | — (no section) | — |

---

## Vercel Deployment

1. Connect repo at [vercel.com/new](https://vercel.com/new)
2. Framework Preset: **Other**
3. Root Directory: `toolbox/` (or wherever files are)
4. Build Command: (empty — static site)
5. Output Directory: `.`

`vercel.json` is pre-configured: explicit tool rewrites, pages/ rewrites, 404 catch-all, cache headers, security headers.

> **Important:** `cleanUrls: true` is intentionally **not set** — it conflicts with `pages/*.html` rewrites.

---

## Admin Panel

Password is stored as SHA-256 hash in `js/admin.config.js`.

Generate hash (browser console F12):
```js
const h = async p => Array.from(
  new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p)))
).map(b => b.toString(16).padStart(2,'0')).join('');
h('YourPassword').then(console.log);
```

`.gitignore`:
```
js/admin.config.js
```

---

## Tech Stack

- **Vanilla JS** — ES modules, zero runtime dependencies
- **i18n** — custom lightweight translation system (`js/i18n.js`)
- **Lucide Icons** — SVG icons via CDN
- **Geist / Geist Mono** — fonts (Google Fonts)
- **CSS Custom Properties** — dark theme `#0d1117`
- **Vercel** — hosting + analytics
- **history.pushState** — URL routing (`/tool-id`)