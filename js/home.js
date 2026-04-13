import { t } from '../i18n.js';

export function renderHome(el) {
  el.innerHTML = `
<div class="hp-hero">
  <div class="hp-hero-content">
    <h1 class="hp-title">${t('home.title')}<br><span class="hp-title-accent">${t('home.title.accent')}</span></h1>
    <p class="hp-desc">
      ${t('home.subtitle')}<br>
      ${t('home.subtitle2')}
    </p>
  </div>
</div>

<div class="hp-features">
  <div class="hp-feature">
    <div class="hp-feature-icon">⚡</div>
    <div class="hp-feature-title">${t('home.feat1.title')}</div>
    <div class="hp-feature-desc">${t('home.feat1.desc')}</div>
  </div>
  <div class="hp-feature">
    <div class="hp-feature-icon">🔒</div>
    <div class="hp-feature-title">${t('home.feat2.title')}</div>
    <div class="hp-feature-desc">${t('home.feat2.desc')}</div>
  </div>
</div>`;
}