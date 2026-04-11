/**
 * admin.config.js — конфігурація адмінки
 *
 * ⚠️  Цей файл тільки для тебе. Додай його у .gitignore:
 *     js/admin.config.js
 *
 * Як згенерувати хеш свого пароля:
 *   1. Відкрий консоль браузера (F12)
 *   2. Встав і виконай:
 *
 *   const hash = async p => Array.from(
 *     new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p)))
 *   ).map(b => b.toString(16).padStart(2,'0')).join('');
 *   hash('ТвійПароль').then(console.log);
 *
 *   3. Скопіюй результат і встав нижче замість прикладу.
 */
 
export const ADMIN_CONFIG = {
  // SHA-256 хеш твого пароля
  // Приклад нижче — це хеш рядка "Oleksiuk1410@"
  // ОБОВ'ЯЗКОВО заміни на свій хеш перед використанням
  passwordHash: '5c88304cbe50bf3a16af335e0d371d8477905c3cc4c0fbd2d764c5fd85751a7c',
};
