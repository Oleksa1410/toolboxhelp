export function renderHome(el) {
  el.innerHTML = `
<div class="hp-hero">
  <div class="hp-hero-content">
    <h1 class="hp-title">ToolboxHelp — your digital<br><span class="hp-title-accent">Swiss army knife</span></h1>
    <p class="hp-desc">
      A set of blazing-fast, offline-first utilities for web developers.<br>
      No downloads, no sign-ups — just code.
    </p>
  </div>
</div>

<div class="hp-features">
  <div class="hp-feature">
    <div class="hp-feature-icon">⚡</div>
    <div class="hp-feature-title">Instant</div>
    <div class="hp-feature-desc">Everything runs client-side. Zero network latency.</div>
  </div>
  <div class="hp-feature">
    <div class="hp-feature-icon">🔒</div>
    <div class="hp-feature-title">Private</div>
    <div class="hp-feature-desc">Your data never leaves your browser. We don't collect or store your information.</div>
  </div>
</div>`;
}