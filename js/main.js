/**
 * main.js — ядро застосунку
 * Цей файл НЕ треба редагувати при додаванні нових інструментів.
 * Всі зміни робляться тільки у  js/tools.config.js
 */

import { TOOLS } from './tools.config.js';
import { SpeedInsights } from "@vercel/speed-insights/next"

// ── Динамічний імпорт усіх інструментів із конфігу ───────────────────────────

const renderFns = {};

await Promise.all(
  TOOLS.map(async t => {
    const mod = await import(`./tools/${t.file}.js`);
    renderFns[t.id] = mod[t.export];
  })
);

// ── State ─────────────────────────────────────────────────────────────────────

const DEFAULT_TOOLS = TOOLS.map(t => ({
  ...t,
  render: (el) => {
    const fn = renderFns[t.id];
    if (!fn) return;
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
  const t = [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(v => String(v).padStart(2, '0')).join(':');
  eventLog.unshift({ time: t, msg });
  if (eventLog.length > 30) eventLog.pop();
}

function notify(msg) {
  const n = document.getElementById('notif');
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
  document.getElementById('tb-path').textContent = id;

  const content = document.getElementById('content');
  content.innerHTML = '';
  const panel = document.createElement('div');
  panel.className = 'panel active';
  content.appendChild(panel);
  tool.render(panel);

  // Tip card під інструментом
  if (tool.tip) {
    const tipEl = document.createElement('details');
    tipEl.className = 'tool-tip-card';
    tipEl.innerHTML =
      `<summary class="tool-tip-summary">💡 ${tool.tip.title}</summary>` +
      `<div class="tool-tip-body">${tool.tip.text}</div>`;
    panel.appendChild(tipEl);
  }

  // URL routing — /aspect замість #aspect; головна — чистий /
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
    el.className = [
      'nav-item',
      current === t.id ? 'active'       : '',
      disabled         ? 'nav-disabled' : '',
    ].filter(Boolean).join(' ');
    el.dataset.id = t.id;

    const iconHtml = t.lucide
      ? `<span class="nav-icon"><i data-lucide="${t.lucide}"></i></span>`
      : `<span class="nav-icon">${t.icon}</span>`;

    el.innerHTML =
      iconHtml + `<span class="nav-label">${t.name}</span>` +
      (disabled            ? '<span class="nav-off">off</span>'   : '') +
      (!disabled && !t.sys ? '<span class="nav-badge">run</span>' : '');
    if (!disabled) el.addEventListener('click', () => navigate(t.id));
    nav.appendChild(el);
  };

  // Головна окремо
  const homeT = tools.find(t => t.id === 'home' && t.enabled);
  if (homeT) item(homeT);

  // Групи
  Object.entries(GROUP_LABELS).forEach(([groupId, groupLabel]) => {
    const groupTools = vis
      .filter(t => t.group === groupId)
      .sort((a, b) => a.order - b.order);
    if (!groupTools.length) return;
    grp(groupLabel);
    groupTools.forEach(t => item(t));
  });

  // Без групи
  const ungrouped = vis.filter(t => !t.group);
  if (ungrouped.length) { grp('Інше'); ungrouped.forEach(t => item(t)); }

  if (sys.length) { grp('Система');  sys.forEach(t => item(t)); }
  if (off.length) { grp('Вимкнені'); off.forEach(t => item(t, true)); }

  document.getElementById('sf-count').textContent = vis.length;

  if (window.lucide) window.lucide.createIcons();
}

// ── Burger menu (mobile) ──────────────────────────────────────────────────────

const burger  = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mob-overlay');

function openMenu()  { sidebar.classList.add('open');  overlay.classList.add('show'); document.body.classList.add('menu-open'); }
function closeMenu() { sidebar.classList.remove('open'); overlay.classList.remove('show'); document.body.classList.remove('menu-open'); }

burger?.addEventListener('click', () => sidebar.classList.contains('open') ? closeMenu() : openMenu());
overlay?.addEventListener('click', closeMenu);
document.getElementById('nav')?.addEventListener('click', e => {
  if (e.target.closest('.nav-item')) closeMenu();
});

// ── Clock ─────────────────────────────────────────────────────────────────────

setInterval(() => {
  const d = new Date();
  document.getElementById('tb-clock').textContent =
    [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(v => String(v).padStart(2, '0')).join(':');
}, 1000);

// ── Init ──────────────────────────────────────────────────────────────────────

buildNav();

// Відновлення з URL при завантаженні / F5
// Витягуємо тільки перший сегмент шляху: /aspect → 'aspect', / → 'home'
const rawPath   = window.location.pathname.replace(/^\/+/, '').split('/')[0] || 'home';
const validId   = tools.find(t => t.id === rawPath && t.enabled) ? rawPath : 'home';
navigate(validId, true);

// Навігація кнопками браузера (назад/вперед)
window.addEventListener('popstate', e => {
  const id = e.state?.id
    || (window.location.pathname.replace(/^\/+/, '').split('/')[0] || 'home');
  navigate(id, true);
});

// Версія — fetch з кореня сайту (/VERSION), не залежить від поточного шляху
fetch('/VERSION')
  .then(r => r.text())
  .then(v => {
    addLog('system: started v' + v.trim());
    // Оновлюємо sidebar якщо fetch пройшов пізніше ніж відображення
    const el = document.getElementById('app-version');
    if (el && el.textContent === 'v—') el.textContent = 'v' + v.trim();
  })
  .catch(() => {
    // Локальна розробка без кореневого сервера — спробуємо відносний шлях
    fetch('VERSION')
      .then(r => r.text())
      .then(v => addLog('system: started v' + v.trim()))
      .catch(() => addLog('system: started (local)'));
  });