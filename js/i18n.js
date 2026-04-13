/**
 * i18n.js — система перекладів ToolboxHelp
 *
 * Використання:
 *   import { t, setLang, getLang, onLangChange } from './i18n.js';
 *
 *   t('nav.home')           → 'Головна' або 'Home'
 *   t('tool.units.tip')     → текст підказки
 *   setLang('en')           → змінює мову + оновлює сторінку
 *   getLang()               → 'uk' або 'en'
 *   onLangChange(cb)        → підписка на зміну мови
 */

// ── Translations ──────────────────────────────────────────────────────────────

export const TRANSLATIONS = {
  uk: {
    // ── UI ──────────────────────────────────────────────────────────────────
    'ui.online':          'ONLINE',
    'ui.active_tools':    'active tools',
    'ui.path_prefix':     '~/toolbox/',
    'ui.copied':          'Скопійовано',
    'ui.loading':         'Завантаження...',

    // ── Nav groups ───────────────────────────────────────────────────────────
    'group.css':      'CSS & Дизайн',
    'group.text':     'Текст & Дані',
    'group.encode':   'Кодування',
    'group.generate': 'Генератори',
    'group.validate': 'Валідатори',
    'group.system':   'Система',
    'group.disabled': 'Вимкнені',
    'group.other':    'Інше',

    // ── Tool names ───────────────────────────────────────────────────────────
    'tool.home.name':      'Головна',
    'tool.home.desc':      'Огляд усіх інструментів',
    'tool.units.name':     'CSS Units',
    'tool.units.desc':     'Конвертер px · rem · em · vw · vh',
    'tool.color.name':     'Color Converter',
    'tool.color.desc':     'HEX ↔ RGB ↔ HSL конвертер',
    'tool.aspect.name':    'Aspect Ratio',
    'tool.aspect.desc':    'Калькулятор співвідношення сторін',
    'tool.textcount.name': 'Text Counter',
    'tool.textcount.desc': 'Символи · слова · рядки',
    'tool.diff.name':      'Diff Checker',
    'tool.diff.desc':      'Порівняння двох текстів',
    'tool.markdown.name':  'Markdown Editor',
    'tool.markdown.desc':  'Редактор з live preview',
    'tool.dummydata.name': 'Dummy Data',
    'tool.dummydata.desc': 'Генератор тестових користувачів',
    'tool.base64.name':    'Base64',
    'tool.base64.desc':    'Encoder / Decoder · файли',
    'tool.urlencode.name': 'URL Encoder',
    'tool.urlencode.desc': 'Encode / Decode · розбір URL',
    'tool.hash.name':      'Hash Generator',
    'tool.hash.desc':      'MD5 · SHA-1/256/384/512',
    'tool.password.name':  'Password Gen',
    'tool.password.desc':  'Генератор безпечних паролів',
    'tool.qrbar.name':     'QR / Barcode',
    'tool.qrbar.desc':     'QR-коди та штрих-коди',
    'tool.json.name':      'JSON Validator',
    'tool.json.desc':      'Форматування та валідація JSON',
    'tool.whois.name':     'WHOIS Lookup',
    'tool.whois.desc':     'Перевірка домену, реєстратор, дати',
    'tool.ascii.name':     'ASCII Converter',
    'tool.ascii.desc':     'Текст ↔ ASCII/Hex/Binary/Unicode',
    'tool.admin.name':     'Admin',
    'tool.admin.desc':     'Керування інструментами',

    // ── Home page ────────────────────────────────────────────────────────────
    'home.title':     'ToolboxHelp — ваш цифровий',
    'home.title.accent': 'швейцарський ніж',
    'home.subtitle':  'Набір блискавичних офлайн-перших утиліт для веброзробників.',
    'home.subtitle2': 'Жодних завантажень, жодних реєстрацій — тільки код.',
    'home.feat1.title': 'Миттєво',
    'home.feat1.desc':  'Все працює на стороні клієнта. Жодних затримок мережі.',
    'home.feat2.title': 'Приватно',
    'home.feat2.desc':  'Ваші дані ніколи не покидають ваш браузер. Ми не збираємо та не зберігаємо вашу інформацію.',

    // ── Footer ───────────────────────────────────────────────────────────────
    'footer.about':   'Про нас',
    'footer.contacts':'Контакти',
    'footer.privacy': 'Конфіденційність',
    'footer.ad':      'Реклама',

    // ── Common UI ────────────────────────────────────────────────────────────
    'ui.copy':    'Копіювати',
    'ui.paste':   'Вставити',
    'ui.clear':   'Очистити',
    'ui.format':  'Форматувати',
    'ui.generate':'Генерувати',
    'ui.run':     'run',
    'ui.off':     'off',
    'ui.convert': 'Конвертувати',
    'ui.result':  'Результат',
    'ui.input':   'Вхід',
    'ui.output':  'Вихід',
    'ui.error':   'Помилка',
    'ui.nodata':  'Немає даних',
    'ui.send':    'Надіслати',
    'ui.settings':'Налаштування',
  },

  en: {
    // ── UI ──────────────────────────────────────────────────────────────────
    'ui.online':          'ONLINE',
    'ui.active_tools':    'active tools',
    'ui.path_prefix':     '~/toolbox/',
    'ui.copied':          'Copied',
    'ui.loading':         'Loading...',

    // ── Nav groups ───────────────────────────────────────────────────────────
    'group.css':      'CSS & Design',
    'group.text':     'Text & Data',
    'group.encode':   'Encoding',
    'group.generate': 'Generators',
    'group.validate': 'Validators',
    'group.system':   'System',
    'group.disabled': 'Disabled',
    'group.other':    'Other',

    // ── Tool names ───────────────────────────────────────────────────────────
    'tool.home.name':      'Home',
    'tool.home.desc':      'Overview of all tools',
    'tool.units.name':     'CSS Units',
    'tool.units.desc':     'Converter px · rem · em · vw · vh',
    'tool.color.name':     'Color Converter',
    'tool.color.desc':     'HEX ↔ RGB ↔ HSL converter',
    'tool.aspect.name':    'Aspect Ratio',
    'tool.aspect.desc':    'Screen aspect ratio calculator',
    'tool.textcount.name': 'Text Counter',
    'tool.textcount.desc': 'Characters · words · lines',
    'tool.diff.name':      'Diff Checker',
    'tool.diff.desc':      'Compare two text versions',
    'tool.markdown.name':  'Markdown Editor',
    'tool.markdown.desc':  'Editor with live preview',
    'tool.dummydata.name': 'Dummy Data',
    'tool.dummydata.desc': 'Test user data generator',
    'tool.base64.name':    'Base64',
    'tool.base64.desc':    'Encoder / Decoder · files',
    'tool.urlencode.name': 'URL Encoder',
    'tool.urlencode.desc': 'Encode / Decode · URL parser',
    'tool.hash.name':      'Hash Generator',
    'tool.hash.desc':      'MD5 · SHA-1/256/384/512',
    'tool.password.name':  'Password Gen',
    'tool.password.desc':  'Secure password generator',
    'tool.qrbar.name':     'QR / Barcode',
    'tool.qrbar.desc':     'QR codes and barcodes',
    'tool.json.name':      'JSON Validator',
    'tool.json.desc':      'Format and validate JSON',
    'tool.whois.name':     'WHOIS Lookup',
    'tool.whois.desc':     'Domain check, registrar, dates',
    'tool.ascii.name':     'ASCII Converter',
    'tool.ascii.desc':     'Text ↔ ASCII/Hex/Binary/Unicode',
    'tool.admin.name':     'Admin',
    'tool.admin.desc':     'Tools management',

    // ── Home page ────────────────────────────────────────────────────────────
    'home.title':        'ToolboxHelp — your digital',
    'home.title.accent': 'Swiss army knife',
    'home.subtitle':     'A set of blazing-fast, offline-first utilities for web developers.',
    'home.subtitle2':    'No downloads, no sign-ups — just code.',
    'home.feat1.title':  'Instant',
    'home.feat1.desc':   'Everything runs client-side. Zero network latency.',
    'home.feat2.title':  'Private',
    'home.feat2.desc':   'Your data never leaves your browser. We don\'t collect or store your information.',

    // ── Footer ───────────────────────────────────────────────────────────────
    'footer.about':   'About',
    'footer.contacts':'Contact',
    'footer.privacy': 'Privacy',
    'footer.ad':      'Ad',

    // ── Common UI ────────────────────────────────────────────────────────────
    'ui.copy':    'Copy',
    'ui.paste':   'Paste',
    'ui.clear':   'Clear',
    'ui.format':  'Format',
    'ui.generate':'Generate',
    'ui.run':     'run',
    'ui.off':     'off',
    'ui.convert': 'Convert',
    'ui.result':  'Result',
    'ui.input':   'Input',
    'ui.output':  'Output',
    'ui.error':   'Error',
    'ui.nodata':  'No data',
    'ui.send':    'Send',
    'ui.settings':'Settings',
  },
};

// ── State ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'tbh_lang';
const SUPPORTED   = ['uk', 'en'];
const DEFAULT     = 'uk';

let _lang     = DEFAULT;
let _listeners = [];

// ── Init: detect language ─────────────────────────────────────────────────────

function detectLang() {
  // 1. URL param: ?lang=en
  const urlParam = new URLSearchParams(window.location.search).get('lang');
  if (urlParam && SUPPORTED.includes(urlParam)) return urlParam;
  // 2. localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  // 3. Browser language
  const browser = (navigator.language || 'uk').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browser) ? browser : DEFAULT;
}

_lang = detectLang();

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns translation for key in current language. Falls back to key if not found. */
export function t(key) {
  return TRANSLATIONS[_lang]?.[key] ?? TRANSLATIONS[DEFAULT]?.[key] ?? key;
}

/** Returns current language code ('uk' | 'en') */
export function getLang() { return _lang; }

/** Returns all supported languages */
export function getSupportedLangs() { return [...SUPPORTED]; }

/** Sets language, saves to localStorage, notifies listeners */
export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  _lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  _listeners.forEach(cb => cb(lang));
}

/** Subscribe to language change */
export function onLangChange(cb) {
  _listeners.push(cb);
  return () => { _listeners = _listeners.filter(l => l !== cb); };
}

/** Apply translations to all [data-i18n] elements in container (default: document) */
export function applyTranslations(container = document) {
  container.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  container.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
  container.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.title = t(key);
  });
}

// Apply lang attribute on load
document.documentElement.lang = _lang;