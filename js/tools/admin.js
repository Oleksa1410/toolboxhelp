import { ADMIN_CONFIG } from '../admin.config.js';

// ── Session ───────────────────────────────────────────────────────────────────

const SESSION_KEY = 'dtb_admin_auth';

function isAuthed()   { return sessionStorage.getItem(SESSION_KEY) === '1'; }
function setAuthed()  { sessionStorage.setItem(SESSION_KEY, '1'); }
function clearAuthed(){ sessionStorage.removeItem(SESSION_KEY); }

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ── Lock screen ───────────────────────────────────────────────────────────────

function renderLock(el, { notify, onSuccess }) {
  el.innerHTML = `
<div style="max-width:380px;margin:60px auto 0">
  <div class="card">
    <div class="card-hdr">вхід до адмінки</div>
    <div class="field" style="margin-bottom:16px">
      <span class="f-label">ПАРОЛЬ</span>
      <input type="password" id="pwd-a" placeholder="Введіть пароль"
        autocomplete="current-password" style="letter-spacing:2px">
    </div>
    <div id="lock-err"
      style="display:none;color:var(--red);font-family:var(--mono);font-size:11px;
             margin-bottom:12px;padding:8px 12px;background:var(--red-dim);
             border-radius:6px;border:1px solid rgba(201,96,90,.3)">
    </div>
    <button class="btn btn-blue" id="btn-login"
      style="width:100%;justify-content:center;letter-spacing:1px">
      УВІЙТИ
    </button>
  </div>
</div>`;

  const input = el.querySelector('#pwd-a');
  const btn   = el.querySelector('#btn-login');
  const err   = el.querySelector('#lock-err');

  input.focus();

  async function tryLogin() {
    err.style.display = 'none';
    btn.disabled = true;
    btn.textContent = '...';
    const hash = await sha256(input.value);
    if (hash === ADMIN_CONFIG.passwordHash) {
      setAuthed();
      onSuccess();
    } else {
      err.textContent = '✕ Невірний пароль';
      err.style.display = 'block';
      input.value = '';
      input.focus();
    }
    btn.disabled = false;
    btn.textContent = 'УВІЙТИ';
  }

  btn.addEventListener('click', tryLogin);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
}

// ── Admin dashboard ───────────────────────────────────────────────────────────

export function renderAdmin(el, ctx) {
  const { tools, DEFAULT_TOOLS, navigate, saveState, buildNav, addLog, notify, dragSrcRef } = ctx;

  if (!isAuthed()) {
    renderLock(el, { notify, onSuccess: () => renderDashboard(el) });
    return;
  }
  renderDashboard(el);

  function renderDashboard(container) {
    container.innerHTML = '';
    draw(container);
  }

  function draw(container) {
    const active = tools.filter(t => !t.sys && t.enabled).length;
    const total  = tools.filter(t => !t.sys).length;

    container.innerHTML =
      '<div class="card"><div class="card-hdr">огляд системи</div>' +
      '<div class="admin-stats">' +
      `<div class="astat"><div class="astat-val">${active}</div><div class="astat-lbl">Активних</div></div>` +
      `<div class="astat"><div class="astat-val" style="color:var(--muted2)">${total - active}</div><div class="astat-lbl">Вимкнених</div></div>` +
      `<div class="astat"><div class="astat-val">${total}</div><div class="astat-lbl">Всього</div></div>` +
      `<div class="astat"><div class="astat-val" style="font-size:13px;padding-top:8px">${new Date().toLocaleDateString('uk')}</div><div class="astat-lbl">Дата</div></div>` +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
      '<button class="btn" id="btn-home">← На головну</button>' +
      '<button class="btn btn-sm" id="btn-enable-all">Увімкнути всі</button>' +
      '<button class="btn btn-sm btn-danger" id="btn-reset-all">Скинути все</button>' +
      '<button class="btn btn-sm btn-danger" id="btn-logout" style="margin-left:auto">Вийти</button>' +
      '</div></div>' +
      '<div class="admin-2col">' +
      '<div class="card" style="margin-bottom:0"><div class="card-hdr">tools manager</div>' +
      '<div style="font-family:var(--mono);font-size:9px;color:var(--muted);margin-bottom:10px">Перетягни для зміни порядку</div>' +
      '<div id="tool-list"></div></div>' +
      '<div class="card" style="margin-bottom:0"><div class="card-hdr">event log</div>' +
      '<div id="a-log"></div></div>' +
      '</div>';

    const logEl = container.querySelector('#a-log');
    logEl.innerHTML = window._eventLog && window._eventLog.length
      ? window._eventLog.slice(0, 12).map(e =>
          `<div class="log-line"><span class="log-t">${e.time}</span><span class="log-m">${e.msg}</span></div>`
        ).join('')
      : '<div style="font-family:var(--mono);color:var(--muted);font-size:9px">No events yet</div>';

    container.querySelector('#btn-home').addEventListener('click', () => navigate('home'));

    container.querySelector('#btn-enable-all').addEventListener('click', () => {
      tools.forEach(t => { if (!t.sys) t.enabled = true; });
      saveState(); buildNav(); draw(container); notify('Всі увімкнено'); addLog('enable: all');
    });

    container.querySelector('#btn-reset-all').addEventListener('click', () => {
      if (!confirm('Скинути всі налаштування?')) return;
      localStorage.removeItem('dtb_v3');
      tools.splice(0, tools.length, ...DEFAULT_TOOLS.map(d => ({ ...d })));
      saveState(); buildNav(); navigate('home');
      notify('Скинуто'); addLog('reset: all');
    });

    container.querySelector('#btn-logout').addEventListener('click', () => {
      clearAuthed();
      notify('Вийшли з адмінки');
      addLog('admin: logout');
      navigate('home');
    });

    const listEl = container.querySelector('#tool-list');
    tools.filter(t => !t.sys).sort((a, b) => a.order - b.order).forEach(t => {
      const row = document.createElement('div');
      row.className = 'arow'; row.draggable = true; row.dataset.id = t.id;
      row.innerHTML =
        '<div class="arow-drag">⠿</div>' +
        `<div class="arow-icon">${t.icon}</div>` +
        `<div class="arow-info"><div class="arow-name">${t.name}</div><div class="arow-id">id: ${t.id}</div></div>` +
        `<div class="toggle${t.enabled ? ' on' : ''}" data-toggle="${t.id}"></div>`;

      row.querySelector('[data-toggle]').addEventListener('click', () => {
        t.enabled = !t.enabled;
        if (!t.enabled && window._currentTool === t.id) navigate('home');
        saveState(); buildNav(); draw(container);
        addLog((t.enabled ? 'enable' : 'disable') + ': ' + t.id);
        notify(t.name + ': ' + (t.enabled ? 'ON' : 'OFF'));
      });

      row.addEventListener('dragstart', e => {
        dragSrcRef.id = t.id; row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend',  () => row.classList.remove('dragging'));
      row.addEventListener('dragover', e => e.preventDefault());
      row.addEventListener('drop', e => {
        e.preventDefault();
        if (dragSrcRef.id === t.id) return;
        const src = tools.find(x => x.id === dragSrcRef.id);
        const dst = tools.find(x => x.id === t.id);
        [src.order, dst.order] = [dst.order, src.order];
        saveState(); buildNav(); draw(container); addLog('reorder: ' + src.name);
      });
      listEl.appendChild(row);
    });
  }
}