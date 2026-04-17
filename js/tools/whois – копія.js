export function renderWhois(el, { notify }) {
  el.innerHTML = `
<div class="card">
  <div class="card-hdr">перевірка домену</div>
  <div class="row" style="align-items:flex-end;gap:10px">
    <div class="field">
      <span class="f-label">ДОМЕННЕ ІМ'Я</span>
      <input type="text" id="whois-input" placeholder="example.com"
        style="font-family:var(--mono)" autocomplete="off" spellcheck="false">
    </div>
    <button class="btn btn-blue" id="whois-btn" style="flex-shrink:0">
      ПЕРЕВІРИТИ
    </button>
  </div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px" id="whois-presets">
    ${['google.com','github.com','vercel.com','openai.com','cloudflare.com'].map(d =>
      `<div class="preset" data-d="${d}">${d}</div>`
    ).join('')}
  </div>
</div>

<div id="whois-result" style="display:none"></div>`;

  const q = id => el.querySelector('#' + id);

  el.querySelectorAll('#whois-presets .preset').forEach(p => {
    p.addEventListener('click', () => {
      q('whois-input').value = p.dataset.d;
      lookup();
    });
  });

  q('whois-btn').addEventListener('click', lookup);
  q('whois-input').addEventListener('keydown', e => { if (e.key === 'Enter') lookup(); });

  async function lookup() {
    let domain = q('whois-input').value.trim().toLowerCase();
    if (!domain) { notify('Введіть доменне ім\'я'); return; }

    // Прибираємо протокол і шлях
    domain = domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '');

    if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(domain)) {
      notify('Невалідне доменне ім\'я');
      return;
    }

    const btn = q('whois-btn');
    btn.textContent = 'ЗАПИТ...';
    btn.disabled = true;

    const result = q('whois-result');
    result.innerHTML = `<div class="card"><div style="font-family:var(--mono);font-size:12px;color:var(--muted)">⏳ Запит до RDAP...</div></div>`;
    result.style.display = 'block';

    try {
      // RDAP — відкритий протокол, CORS підтримується
      const [rdap, avail] = await Promise.allSettled([
        fetch(`https://rdap.org/domain/${domain}`).then(r => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        }),
        // Перевіряємо доступність через DNS-over-HTTPS
        fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
          headers: { Accept: 'application/dns-json' }
        }).then(r => r.json()),
      ]);

      renderResult(domain, rdap, avail);
    } catch (e) {
      result.innerHTML = `<div class="card">
        <div class="card-hdr">помилка</div>
        <div style="color:var(--red);font-family:var(--mono);font-size:12px">${e.message}</div>
      </div>`;
    } finally {
      btn.textContent = 'ПЕРЕВІРИТИ';
      btn.disabled = false;
    }
  }

  function renderResult(domain, rdapResult, availResult) {
    const result = q('whois-result');

    // ── Availability ──────────────────────────────────────────────────────────
    let dnsResolved = false;
    if (availResult.status === 'fulfilled') {
      const dns = availResult.value;
      dnsResolved = dns.Status === 0 && dns.Answer && dns.Answer.length > 0;
    }

    // ── RDAP data ─────────────────────────────────────────────────────────────
    if (rdapResult.status === 'rejected') {
      const notFound = rdapResult.reason?.message?.includes('404') ||
                       rdapResult.reason?.message?.includes('not found');
      result.innerHTML = `
<div class="card">
  <div class="card-hdr">результат: ${domain}</div>
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
    <div class="whois-badge ${notFound ? 'whois-badge-avail' : 'whois-badge-err'}">
      ${notFound ? '✓ Вільний' : '⚠ Немає даних'}
    </div>
    <div style="font-family:var(--mono);font-size:12px;color:var(--muted)">
      ${notFound ? 'Домен не зареєстровано або реєстратор не підтримує RDAP' : rdapResult.reason?.message || 'Помилка запиту'}
    </div>
  </div>
</div>`;
      return;
    }

    const data = rdapResult.value;

    // Парсимо дати
    const findEvent = type => {
      const ev = (data.events || []).find(e => e.eventAction === type);
      if (!ev) return '—';
      return new Date(ev.eventDate).toLocaleDateString('uk-UA', { year:'numeric', month:'long', day:'numeric' });
    };

    const registered = findEvent('registration');
    const expiry     = findEvent('expiration');
    const updated    = findEvent('last changed');

    // Статус
    const statuses = (data.status || []).map(s => `
      <span style="font-family:var(--mono);font-size:10px;padding:2px 8px;border-radius:4px;
        background:var(--s3);border:1px solid var(--border);color:var(--muted2)">${s}</span>
    `).join('');

    // Nameservers
    const ns = (data.nameservers || []).map(n => n.ldhName?.toLowerCase() || '').filter(Boolean);

    // Registrar
    const entities = data.entities || [];
    const registrar = entities.find(e => (e.roles||[]).includes('registrar'));
    const registrarName = registrar?.vcardArray?.[1]?.find(v => v[0]==='fn')?.[3]
      || registrar?.publicIds?.[0]?.identifier
      || '—';

    // Registrant
    const registrant = entities.find(e => (e.roles||[]).includes('registrant'));
    const registrantName = registrant?.vcardArray?.[1]?.find(v => v[0]==='fn')?.[3] || '—';

    // TLD info
    const tld = domain.split('.').pop().toUpperCase();

    // Expiry warning
    let expiryWarn = '';
    const expiryEv = (data.events||[]).find(e => e.eventAction==='expiration');
    if (expiryEv) {
      const daysLeft = Math.ceil((new Date(expiryEv.eventDate) - Date.now()) / 86400000);
      if (daysLeft < 30)  expiryWarn = `<div class="whois-badge whois-badge-err">⚠ Спливає через ${daysLeft} дн.</div>`;
      else if (daysLeft < 90) expiryWarn = `<div class="whois-badge whois-badge-warn">🕐 ${daysLeft} дн. до спливання</div>`;
    }

    result.innerHTML = `
<div class="card">
  <div class="card-hdr">результат: ${domain}</div>

  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:18px">
    <div class="whois-badge ${dnsResolved ? 'whois-badge-reg' : 'whois-badge-avail'}">
      ${dnsResolved ? '● Зареєстровано' : '○ DNS не знайдено'}
    </div>
    ${expiryWarn}
    <span style="font-family:var(--mono);font-size:10px;color:var(--muted)">.${tld}</span>
  </div>

  <div class="whois-grid">
    <div class="whois-row"><span class="whois-k">Реєстратор</span><span class="whois-v">${registrarName}</span></div>
    <div class="whois-row"><span class="whois-k">Власник</span><span class="whois-v">${registrantName}</span></div>
    <div class="whois-row"><span class="whois-k">Зареєстровано</span><span class="whois-v">${registered}</span></div>
    <div class="whois-row"><span class="whois-k">Спливає</span><span class="whois-v">${expiry}</span></div>
    <div class="whois-row"><span class="whois-k">Оновлено</span><span class="whois-v">${updated}</span></div>
    ${ns.length ? `<div class="whois-row"><span class="whois-k">Nameservers</span><span class="whois-v">${ns.join('<br>')}</span></div>` : ''}
    ${statuses ? `<div class="whois-row"><span class="whois-k">Статус</span><span class="whois-v" style="display:flex;gap:4px;flex-wrap:wrap">${statuses}</span></div>` : ''}
    <div class="whois-row">
      <span class="whois-k">RDAP</span>
      <span class="whois-v">
        <a href="https://rdap.org/domain/${domain}" target="_blank" rel="noopener"
          style="color:var(--blue);font-family:var(--mono);font-size:11px">
          rdap.org/domain/${domain} ↗
        </a>
      </span>
    </div>
  </div>
</div>`;
  }
}