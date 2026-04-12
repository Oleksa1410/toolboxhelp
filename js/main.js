/**
 * main.js — ядро застосунку
 * Не редагувати при додаванні нових інструментів.
 * Всі зміни — тільки у js/tools.config.js
 */

import { TOOLS } from './tools.config.js';

// ── Динамічний імпорт інструментів ────────────────────────────────────────────
// Кожен інструмент імпортується окремо — якщо один впав, решта працюють

const renderFns = {};

await Promise.allSettled(
  TOOLS.map(async t => {
    try {
      const mod = await import(`./tools/${t.file}.js`);
      renderFns[t.id] = mod[t.export];
    } catch (e) {
      console.warn(`[ToolboxHelp] Не вдалося завантажити інструмент "${t.id}":`, e.message);
    }
  })
);

// ── State ─────────────────────────────────────────────────────────────────────

const DEFAULT_TOOLS = TOOLS.map(t => ({
  ...t,
  render: (el) => {
    const fn = renderFns[t.id];
    if (!fn) { el.innerHTML = `<div class="card" style="color:var(--red)">Інструмент "${t.id}" не завантажився.</div>`; return; }
    t.sys ? fn(el, adminCtx()) : fn(el, ctx);
  },
}));

const tools      = loadState();
const eventLog   = [];
const dragSrcRef = { id: null };
let   current    = null;

Object.defineProperty(window, '_currentTool', { get: () => current });
Object.defineProperty(window, '_eventLog',    { get: () => eventLog });

// ── Persistence ───────────────────────────────────────────────────────────────

function loadState() {
  try {
    const s = localStorage.getItem('dtb_v3');
    if (s) {
      const p = JSON.parse(s);
      return DEFAULT_TOOLS.map(d => {
        const f = p.find(x => x.id === d.id);
        return f ? { ...d, enabled: f.enabled, order: f.order } : { ...d };
      });
    }
  } catch (_) {}
  return DEFAULT_TOOLS.map(d => ({ ...d }));
}

function saveState() {
  localStorage.setItem('dtb_v3', JSON.stringify(
    tools.map(t => ({ id: t.id, enabled: t.enabled, order: t.order }))
  ));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getVisible() {
  return tools.filter(t => t.enabled).sort((a, b) => a.order - b.order);
}

function addLog(msg) {
  const d = new Date();
  const ts = [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(v => String(v).padStart(2, '0')).join(':');
  eventLog.unshift({ time: ts, msg });
  if (eventLog.length > 30) eventLog.pop();
}

function notify(msg) {
  const n = document.getElementById('notif');
  if (!n) return;
  document.getElementById('notif-msg').textContent = msg;
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 2500);
}

function copyText(text, lbl) {
  navigator.clipboard.writeText(text)
    .then(() => notify('Скопійовано: ' + (lbl || text)));
}

// ── Context ───────────────────────────────────────────────────────────────────

const ctx = { getVisible, navigate, notify, copyText };

function adminCtx() {
  return { tools, DEFAULT_TOOLS, getVisible, navigate, saveState, buildNav, addLog, notify, dragSrcRef };
}

// ── Navigation ────────────────────────────────────────────────────────────────

function navigate(id, silent) {
  const tool = tools.find(t => t.id === id);
  if (!tool || !tool.enabled) return;
  current = id;

  document.querySelectorAll('.nav-item')
    .forEach(el => el.classList.toggle('active', el.dataset.id === id));

  const tbPath = document.getElementById('tb-path');
  if (tbPath) tbPath.textContent = id;

  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = '';

  const panel = document.createElement('div');
  panel.className = 'panel active';
  content.appendChild(panel);

  try {
    tool.render(panel);
  } catch (e) {
    panel.innerHTML = `<div class="card" style="color:var(--red)">Помилка рендеру "${id}": ${e.message}</div>`;
    console.error('[ToolboxHelp] render error:', e);
  }

  if (tool.tip) {
    const tipEl = document.createElement('details');
    tipEl.className = 'tool-tip-card';
    tipEl.innerHTML =
      `<summary class="tool-tip-summary">💡 ${tool.tip.title}</summary>` +
      `<div class="tool-tip-body">${tool.tip.text}</div>`;
    panel.appendChild(tipEl);
  }

  if (!silent) {
    const url = id === 'home' ? '/' : '/' + id;
    history.pushState({ id }, '', url);
    addLog('open: ' + id);
  }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

const GROUP_LABELS = {
  css:      'CSS & Дизайн',
  text:     'Текст & Дані',
  encode:   'Кодування',
  generate: 'Генератори',
  validate: 'Валідатори',
};

function buildNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.innerHTML = '';

  const vis = getVisible().filter(t => !t.sys && t.id !== 'home');
  const sys = getVisible().filter(t =>  t.sys);
  const off = tools.filter(t => !t.enabled && !t.sys);

  const grp = label => {
    const g = document.createElement('div');
    g.className = 'nav-group';
    g.textContent = label;
    nav.appendChild(g);
  };

  const item = (t, disabled = false) => {
    const el = document.createElement('div');
    el.className = ['nav-item', current === t.id ? 'active' : '', disabled ? 'nav-disabled' : '']
      .filter(Boolean).join(' ');
    el.dataset.id = t.id;
    const iconHtml = t.lucide
      ? `<span class="nav-icon"><i data-lucide="${t.lucide}"></i></span>`
      : `<span class="nav-icon">${t.icon}</span>`;
    el.innerHTML =
      iconHtml + `<span class="nav-label">${t.name}</span>` +
      (disabled            ? '<span class="nav-off">off</span>'    : '') +
      (!disabled && !t.sys ? '<span class="nav-badge">run</span>'  : '');
    if (!disabled) el.addEventListener('click', () => navigate(t.id));
    nav.appendChild(el);
  };

  const homeT = tools.find(t => t.id === 'home' && t.enabled);
  if (homeT) item(homeT);

  Object.entries(GROUP_LABELS).forEach(([groupId, groupLabel]) => {
    const groupTools = vis.filter(t => t.group === groupId).sort((a, b) => a.order - b.order);
    if (!groupTools.length) return;
    grp(groupLabel);
    groupTools.forEach(t => item(t));
  });

  const ungrouped = vis.filter(t => !t.group);
  if (ungrouped.length) { grp('Інше'); ungrouped.forEach(t => item(t)); }
  if (sys.length)       { grp('Система');  sys.forEach(t => item(t)); }
  if (off.length)       { grp('Вимкнені'); off.forEach(t => item(t, true)); }

  const cnt = document.getElementById('sf-count');
  if (cnt) cnt.textContent = vis.length;

  if (window.lucide) window.lucide.createIcons();
}

// ── Burger menu ───────────────────────────────────────────────────────────────

const burger  = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mob-overlay');

function openMenu()  { sidebar?.classList.add('open');    overlay?.classList.add('show');    document.body.classList.add('menu-open'); }
function closeMenu() { sidebar?.classList.remove('open'); overlay?.classList.remove('show'); document.body.classList.remove('menu-open'); }

burger?.addEventListener('click',  () => sidebar?.classList.contains('open') ? closeMenu() : openMenu());
overlay?.addEventListener('click', closeMenu);
document.getElementById('nav')?.addEventListener('click', e => { if (e.target.closest('.nav-item')) closeMenu(); });

// ── Clock ─────────────────────────────────────────────────────────────────────

function updateClock() {
  const el = document.getElementById('tb-clock');
  if (!el) return;
  const d = new Date();
  el.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(v => String(v).padStart(2, '0')).join(':');
}
updateClock();
setInterval(updateClock, 1000);

// ── Init ──────────────────────────────────────────────────────────────────────

buildNav();

const rawPath = window.location.pathname.replace(/^\/+/, '').split('/')[0] || 'home';
const validId = tools.find(t => t.id === rawPath && t.enabled) ? rawPath : 'home';
navigate(validId, true);

window.addEventListener('popstate', e => {
  const id = e.state?.id || (window.location.pathname.replace(/^\/+/, '').split('/')[0] || 'home');
  navigate(id, true);
});

// Версія — спочатку /VERSION (Vercel), потім VERSION (локально)
fetch('/VERSION')
  .then(r => r.ok ? r.text() : Promise.reject())
  .catch(() => fetch('VERSION').then(r => r.text()))
  .then(v => {
    const ver = v.trim();
    addLog('system: started v' + ver);
    const el = document.getElementById('app-version');
    if (el && el.textContent === 'v—') el.textContent = 'v' + ver;
  })
  .catch(() => addLog('system: started'));