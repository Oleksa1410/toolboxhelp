export function renderHome(el) {
  el.innerHTML = `
<div class="hp-hero">
  <div class="hp-hero-content">
    <h1 class="hp-title">ToolboxHelp — ваш цифровий<br><span class="hp-title-accent">швейцарський ніж</span></h1>
    <p class="hp-desc">
      Набір блискавичних офлайн-перших утиліт для веброзробників.<br>
      Жодних завантажень, жодних реєстрацій — тільки код.
    </p>
  </div>
</div>

<div class="hp-features">
  <div class="hp-feature">
    <div class="hp-feature-icon">⚡</div>
    <div class="hp-feature-title">Миттєво</div>
    <div class="hp-feature-desc">Все працює на стороні клієнта. Жодних затримок мережі.</div>
  </div>
  <div class="hp-feature">
    <div class="hp-feature-icon">🔒</div>
    <div class="hp-feature-title">Приватно</div>
    <div class="hp-feature-desc">Ваші дані ніколи не покидають ваш браузер. Ми не збираємо та не зберігаємо вашу інформацію.</div>
  </div>
</div>`;
}