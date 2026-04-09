# DevToolbox

Утилітарний набір інструментів для розробників.

## Структура файлів

```
toolbox/
├── index.html          ← єдина HTML-сторінка
├── css/
│   └── style.css       ← всі стилі
└── js/
    ├── main.js         ← роутер, стан, навігація (ES module)
    └── tools/
        ├── home.js
        ├── aspect.js   ← Aspect Ratio
        ├── units.js    ← CSS Units
        ├── color.js    ← Color Converter
        ├── password.js ← Password Generator
        ├── textcount.js← Text Counter
        ├── qrbar.js    ← QR / Barcode
        └── admin.js    ← Admin Panel
```

## Як запустити

Проект використовує **ES модулі** (`import/export`), тому потребує HTTP-сервера.  
Відкриття через `file://` **не працюватиме**.

### Варіант 1 — VS Code Live Server
1. Відкрий папку `toolbox/` у VS Code
2. Натисни **Go Live** (розширення Live Server)

### Варіант 2 — Python (є скрізь)
```bash
cd toolbox
python3 -m http.server 3000
# відкрий http://localhost:3000
```

### Варіант 3 — Node.js npx
```bash
cd toolbox
npx serve .
```

### Варіант 4 — Node.js http-server
```bash
npm install -g http-server
cd toolbox
http-server -p 3000
```

## Як додати новий інструмент

1. Створи файл `js/tools/mytool.js`:
```js
export function renderMyTool(el, ctx) {
  el.innerHTML = `<div class="card">...</div>`;
  // логіка...
}
```

2. Додай імпорт у `js/main.js`:
```js
import { renderMyTool } from './tools/mytool.js';
```

3. Додай запис у масив `DEFAULT_TOOLS` в `js/main.js`:
```js
{ id: 'mytool', icon: '★', name: 'My Tool', desc: 'Опис', render: (el) => renderMyTool(el, ctx), enabled: true, order: 7 },
```

Готово — інструмент автоматично з'явиться в сайдбарі та на головній сторінці.
