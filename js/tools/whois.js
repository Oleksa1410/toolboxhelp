export function renderWhois(el, { notify }) {

  // ── HTML Structure ─────────────────────────────────────────────────────────
  el.innerHTML = `
<div class="card" style="margin-bottom:14px">
  <div class="row" style="align-items:flex-end;gap:10px">
    <div class="field">
      <span class="f-label">DOMAIN / IP ADDRESS</span>
      <input type="text" id="wi-input" placeholder="example.com or 8.8.8.8"
        style="font-family:var(--mono)" autocomplete="off" spellcheck="false">
    </div>
    <button class="btn btn-blue" id="wi-btn" style="flex-shrink:0;min-width:120px">
      ▶ LOOKUP
    </button>
  </div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px" id="wi-presets">
    ${['google.com','github.com','cloudflare.com','openai.com','8.8.8.8'].map(d =>
      `<button class="btn btn-sm wi-preset" data-v="${d}">${d}</button>`
    ).join('')}
  </div>
</div>

<!-- Tabs -->
<div class="wi-tabs" id="wi-tabs" style="display:none">
  <button class="wi-tab active" data-tab="rdap">🔍 WHOIS / RDAP</button>
  <button class="wi-tab" data-tab="dns">📋 DNS Records</button>
  <button class="wi-tab" data-tab="uptime">📡 Uptime</button>
  <button class="wi-tab" data-tab="diag">🛠 Diagnostics</button>
</div>

<!-- Tab panes -->
<div id="wi-pane-rdap"   class="wi-pane" style="display:none"></div>
<div id="wi-pane-dns"    class="wi-pane" style="display:none"></div>
<div id="wi-pane-uptime" class="wi-pane" style="display:none"></div>
<div id="wi-pane-diag"   class="wi-pane" style="display:none"></div>`;

  const q  = id => el.querySelector('#' + id);
  const q$ = sel => el.querySelector(sel);
  let lastQuery = '';

  // ── Tabs logic ──────────────────────────────────────────────────────────────
  el.querySelectorAll('.wi-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      el.querySelectorAll('.wi-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      el.querySelectorAll('.wi-pane').forEach(p => p.style.display = 'none');
      const pane = q(`wi-pane-${tab.dataset.tab}`);
      pane.style.display = 'block';
      // Lazy load tab content
      if (!pane.dataset.loaded) loadTab(tab.dataset.tab, lastQuery);
    });
  });

  // ── Presets ─────────────────────────────────────────────────────────────────
  el.querySelectorAll('.wi-preset').forEach(b => {
    b.addEventListener('click', () => { q('wi-input').value = b.dataset.v; doLookup(); });
  });
  q('wi-btn').addEventListener('click', doLookup);
  q('wi-input').addEventListener('keydown', e => { if (e.key === 'Enter') doLookup(); });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const isIP = v => /^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]{2,39}$/.test(v);

  function normalizeDomain(raw) {
    return raw.trim().toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./i, '');
  }

  function skeleton(label) {
    return `<div class="card">
      <div class="card-hdr">${label}</div>
      <div class="wi-loading">
        <div class="wi-skel"></div><div class="wi-skel" style="width:70%"></div>
        <div class="wi-skel" style="width:85%"></div>
      </div>
    </div>`;
  }

  function errBox(msg) {
    return `<div class="msg-box msg-box--error">✕ ${msg}</div>`;
  }

  function infoRow(k, v, mono = true) {
    if (!v || v === '—') return `
      <div class="whois-row">
        <span class="whois-k">${k}</span>
        <span class="whois-v" style="color:var(--muted)">—</span>
      </div>`;
    return `
      <div class="whois-row">
        <span class="whois-k">${k}</span>
        <span class="whois-v" style="${mono ? 'font-family:var(--mono)' : ''}">${v}</span>
      </div>`;
  }

  function statusBadge(text, color) {
    const colors = {
      green:  'background:rgba(24,224,112,.12);border:1px solid rgba(24,224,112,.3);color:var(--green)',
      red:    'background:rgba(224,85,85,.12);border:1px solid rgba(224,85,85,.3);color:#f08080',
      amber:  'background:rgba(245,166,35,.12);border:1px solid rgba(245,166,35,.3);color:var(--amber)',
      blue:   'background:rgba(74,158,255,.12);border:1px solid rgba(74,158,255,.3);color:var(--blue)',
      muted:  'background:var(--s3);border:1px solid var(--border);color:var(--muted2)',
    };
    return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;
      font-family:var(--mono);font-size:10px;font-weight:600;${colors[color] || colors.muted}">${text}</span>`;
  }

  function fmtDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      const diff = d - Date.now();
      const days = Math.ceil(diff / 86400000);
      const formatted = d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
      if (diff > 0 && days < 30)  return `${formatted} ${statusBadge('⚠ expires in ' + days + 'd', 'red')}`;
      if (diff > 0 && days < 90)  return `${formatted} ${statusBadge(days + 'd left', 'amber')}`;
      return formatted;
    } catch { return dateStr; }
  }

  // ── Main lookup ──────────────────────────────────────────────────────────────
  async function doLookup() {
    const raw = q('wi-input').value.trim();
    if (!raw) { notify('Enter a domain or IP address'); return; }

    const query = isIP(raw) ? raw : normalizeDomain(raw);
    if (!isIP(query) && !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(query)) {
      notify('Invalid domain or IP address'); return;
    }

    lastQuery = query;
    q('wi-input').value = query;

    const btn = q('wi-btn');
    btn.textContent = '⏳ Loading...'; btn.disabled = true;

    // Reset all panes
    el.querySelectorAll('.wi-pane').forEach(p => { p.style.display = 'none'; p.dataset.loaded = ''; });
    q('wi-tabs').style.display = 'flex';

    // Show RDAP tab by default
    el.querySelectorAll('.wi-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'rdap'));
    q('wi-pane-rdap').style.display = 'block';

    await loadTab('rdap', query);

    btn.textContent = '▶ LOOKUP'; btn.disabled = false;
  }

  // ── Load tab ─────────────────────────────────────────────────────────────────
  async function loadTab(tab, query) {
    const pane = q(`wi-pane-${tab}`);
    if (pane.dataset.loaded) return;
    pane.dataset.loaded = '1';

    switch (tab) {
      case 'rdap':   await renderRDAP(pane, query);   break;
      case 'dns':    await renderDNS(pane, query);    break;
      case 'uptime': await renderUptime(pane, query); break;
      case 'diag':   await renderDiag(pane, query);   break;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 1: WHOIS / RDAP
  // ────────────────────────────────────────────────────────────────────────────
  async function renderRDAP(pane, query) {
    pane.innerHTML = skeleton('Loading WHOIS / RDAP data...');

    try {
      const ip = isIP(query);
      const url = ip
        ? `https://rdap.org/ip/${query}`
        : `https://rdap.org/domain/${query}`;

      const [rdapRes, ipInfoRes] = await Promise.allSettled([
        fetch(url).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }),
        ip
          ? fetch(`https://ipapi.co/${query}/json/`).then(r => r.json())
          : fetch(`https://cloudflare-dns.com/dns-query?name=${query}&type=A`, {
              headers: { Accept: 'application/dns-json' }
            }).then(r => r.json()),
      ]);

      pane.innerHTML = '';

      // ── Section 1a: IP Address ──────────────────────────────────────────────
      if (ip) {
        const info = ipInfoRes.status === 'fulfilled' ? ipInfoRes.value : null;
        const sectionIP = document.createElement('div');
        sectionIP.className = 'card';
        sectionIP.innerHTML = `
          <div class="card-hdr">IP Address</div>
          <div class="whois-grid">
            ${infoRow('IP', query)}
            ${info ? `
            ${infoRow('Version', info.version || '—')}
            ${infoRow('City', info.city || '—')}
            ${infoRow('Region', info.region || '—')}
            ${infoRow('Country', (info.country_name || '—') + (info.country_code ? ` (${info.country_code})` : ''))}
            ${infoRow('Org / ISP', info.org || '—')}
            ${infoRow('ASN', info.asn || '—')}
            ${infoRow('Timezone', info.timezone || '—')}
            ${infoRow('Coordinates', info.latitude ? `${info.latitude}, ${info.longitude}` : '—')}
            ` : ''}
          </div>`;
        pane.appendChild(sectionIP);
      } else {
        // DNS A records for domain IP
        const dnsOk = ipInfoRes.status === 'fulfilled';
        const aRecs = dnsOk ? (ipInfoRes.value.Answer || []).filter(r => r.type === 1) : [];
        if (aRecs.length) {
          const secIP = document.createElement('div');
          secIP.className = 'card';
          secIP.innerHTML = `
            <div class="card-hdr">IP Address</div>
            <div class="whois-grid">
              ${aRecs.map(r => infoRow('A', r.data)).join('')}
            </div>`;
          pane.appendChild(secIP);
        }
      }

      // RDAP data
      if (rdapRes.status === 'rejected') {
        const notFound = rdapRes.reason?.message?.includes('404') || rdapRes.reason?.message?.includes('501');
        pane.innerHTML += `<div class="card">${errBox(notFound
          ? 'No RDAP data found. Domain may be unregistered or registrar does not support RDAP.'
          : 'RDAP error: ' + rdapRes.reason.message)}</div>`;
        appendAboutRDAP(pane, query);
        return;
      }

      const data = rdapRes.value;

      // ── Helpers for RDAP ────────────────────────────────────────────────────
      const getEvent   = type => (data.events || []).find(e => e.eventAction === type)?.eventDate;
      const entities   = data.entities || [];
      const getEntity  = role => entities.find(e => (e.roles||[]).includes(role));
      const getVcard   = (ent, field) => ent?.vcardArray?.[1]?.find(v => v[0] === field)?.[3];
      const registrar  = getEntity('registrar');
      const registrant = getEntity('registrant');
      const tech       = getEntity('technical');
      const admin      = getEntity('administrative');

      // ── Section 1b: Registrar ───────────────────────────────────────────────
      if (registrar) {
        const secReg = document.createElement('div');
        secReg.className = 'card';
        const ianaId = registrar.publicIds?.find(p => p.type === 'IANA Registrar ID')?.identifier;
        secReg.innerHTML = `
          <div class="card-hdr">Registrar Information</div>
          <div class="whois-grid">
            ${infoRow('Registrar', getVcard(registrar, 'fn') || '—')}
            ${ianaId ? infoRow('IANA ID', ianaId) : ''}
            ${infoRow('URL', getVcard(registrar, 'url') || registrar.links?.[0]?.href || '—')}
          </div>`;
        pane.appendChild(secReg);
      }

      // ── Section 1c: Important Dates ─────────────────────────────────────────
      const secDates = document.createElement('div');
      secDates.className = 'card';
      secDates.innerHTML = `
        <div class="card-hdr">Important Dates</div>
        <div class="whois-grid">
          ${infoRow('Registered', fmtDate(getEvent('registration')), false)}
          ${infoRow('Expires', fmtDate(getEvent('expiration')), false)}
          ${infoRow('Last Updated', fmtDate(getEvent('last changed')), false)}
          ${infoRow('Transferred', getEvent('transfer') ? fmtDate(getEvent('transfer')) : '—', false)}
        </div>`;
      pane.appendChild(secDates);

      // ── Section 1d: Nameservers ─────────────────────────────────────────────
      const ns = (data.nameservers || []).map(n => n.ldhName?.toLowerCase()).filter(Boolean);
      if (ns.length) {
        const secNS = document.createElement('div');
        secNS.className = 'card';
        secNS.innerHTML = `
          <div class="card-hdr">Nameservers</div>
          <div class="whois-grid">
            ${ns.map((n, i) => infoRow('NS ' + (i + 1), n)).join('')}
          </div>`;
        pane.appendChild(secNS);
      }

      // ── Section 1e: Domain Status ───────────────────────────────────────────
      const statuses = data.status || [];
      if (statuses.length) {
        const secSt = document.createElement('div');
        secSt.className = 'card';
        const statusColors = {
          'active': 'green',
          'client delete prohibited': 'blue',
          'client transfer prohibited': 'blue',
          'client update prohibited': 'blue',
          'server delete prohibited': 'amber',
          'server transfer prohibited': 'amber',
          'pending delete': 'red',
          'pending transfer': 'amber',
          'redemption period': 'red',
        };
        secSt.innerHTML = `
          <div class="card-hdr">Domain Status</div>
          <div style="padding:10px 0;display:flex;flex-wrap:wrap;gap:6px">
            ${statuses.map(s => statusBadge(s, statusColors[s.toLowerCase()] || 'muted')).join('')}
          </div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px">
            <a href="https://icann.org/epp" target="_blank" rel="noopener"
              style="color:var(--blue)">Learn about ICANN status codes ↗</a>
          </div>`;
        pane.appendChild(secSt);
      }

      // ── Section 1f: Contact Information ────────────────────────────────────
      const contacts = [
        { label: 'Registrant', entity: registrant },
        { label: 'Administrative', entity: admin },
        { label: 'Technical', entity: tech },
      ].filter(c => c.entity);

      if (contacts.length) {
        const secContact = document.createElement('div');
        secContact.className = 'card';
        let contactHtml = '<div class="card-hdr">Contact Information</div>';
        contacts.forEach(({ label, entity }) => {
          const name    = getVcard(entity, 'fn')  || '—';
          const org     = getVcard(entity, 'org') || '—';
          const email   = getVcard(entity, 'email') || '—';
          const tel     = getVcard(entity, 'tel') || '—';
          const adr     = entity?.vcardArray?.[1]?.find(v => v[0] === 'adr')?.[3];
          const city    = adr ? (adr[3] || '') : '—';
          const country = adr ? (adr[6] || '') : '—';
          contactHtml += `
            <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--border)">
              <div style="font-family:var(--mono);font-size:10px;color:var(--accent);
                letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">${label}</div>
              <div class="whois-grid">
                ${infoRow('Name', name)}
                ${org !== '—' ? infoRow('Organization', org) : ''}
                ${email !== '—' ? infoRow('Email', `<a href="mailto:${email}" style="color:var(--blue)">${email}</a>`, false) : ''}
                ${tel !== '—' ? infoRow('Phone', tel) : ''}
                ${city !== '—' ? infoRow('City', city) : ''}
                ${country !== '—' ? infoRow('Country', country) : ''}
              </div>
            </div>`;
        });
        secContact.innerHTML = contactHtml;
        pane.appendChild(secContact);
      }

      // ── Section 1g: Raw RDAP Data ───────────────────────────────────────────
      const secRaw = document.createElement('div');
      secRaw.className = 'card';
      secRaw.innerHTML = `
        <div class="card-hdr" style="cursor:pointer;user-select:none" id="wi-raw-toggle">
          Raw RDAP Data <span style="font-size:10px;color:var(--muted)">(click to expand)</span>
        </div>
        <pre id="wi-raw-pre" style="display:none;font-family:var(--mono);font-size:10px;
          color:var(--text2);overflow-x:auto;white-space:pre-wrap;word-break:break-all;
          max-height:400px;overflow-y:auto;background:var(--bg);padding:12px;
          border-radius:6px;margin-top:10px;border:1px solid var(--border)">${
          JSON.stringify(data, null, 2).replace(/</g,'&lt;').replace(/>/g,'&gt;')
        }</pre>`;
      secRaw.querySelector('#wi-raw-toggle').addEventListener('click', () => {
        const pre = secRaw.querySelector('#wi-raw-pre');
        pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
      });
      pane.appendChild(secRaw);

    } catch (e) {
      pane.innerHTML = `<div class="card">${errBox('Error: ' + e.message)}</div>`;
    }

    appendAboutRDAP(pane, query);
  }

  function appendAboutRDAP(pane, query) {
    const sec = document.createElement('div');
    sec.className = 'card';
    sec.style.background = 'var(--s2)';
    sec.innerHTML = `
      <div class="card-hdr">About WHOIS / RDAP</div>
      <div style="font-size:13px;color:var(--text);line-height:1.8">
        <p style="margin-bottom:10px">
          <strong style="color:var(--text2)">WHOIS</strong> is a protocol for querying databases
          that store registration information about domain names, IP addresses, and autonomous systems.
        </p>
        <p style="margin-bottom:10px">
          <strong style="color:var(--text2)">RDAP</strong> (Registration Data Access Protocol) is the
          modern successor to WHOIS, returning structured JSON data with CORS support.
        </p>
        <p style="margin-bottom:0;font-family:var(--mono);font-size:11px;color:var(--muted)">
          Data source: <a href="https://rdap.org/domain/${query}" target="_blank" rel="noopener"
            style="color:var(--blue)">rdap.org ↗</a>
          · Some fields may be redacted under GDPR.
        </p>
      </div>`;
    pane.appendChild(sec);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 2: DNS Records
  // ────────────────────────────────────────────────────────────────────────────
  async function renderDNS(pane, query) {
    const domain = isIP(query) ? query : query;
    pane.innerHTML = skeleton('Querying DNS records...');

    const DNS_TYPES = [
      { type: 'A',     code: 1,   label: 'A',     desc: 'IPv4 address' },
      { type: 'AAAA',  code: 28,  label: 'AAAA',  desc: 'IPv6 address' },
      { type: 'MX',    code: 15,  label: 'MX',    desc: 'Mail exchange' },
      { type: 'NS',    code: 2,   label: 'NS',    desc: 'Nameservers' },
      { type: 'TXT',   code: 16,  label: 'TXT',   desc: 'Text records (SPF, DKIM, etc)' },
      { type: 'CNAME', code: 5,   label: 'CNAME', desc: 'Canonical name' },
      { type: 'SOA',   code: 6,   label: 'SOA',   desc: 'Start of authority' },
      { type: 'CAA',   code: 257, label: 'CAA',   desc: 'Certificate authority' },
    ];

    const results = await Promise.allSettled(
      DNS_TYPES.map(t =>
        fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=${t.type}`, {
          headers: { Accept: 'application/dns-json' }
        }).then(r => r.json()).then(d => ({ ...t, answers: d.Answer || [], status: d.Status }))
      )
    );

    pane.innerHTML = '';

    // Header
    const secHeader = document.createElement('div');
    secHeader.className = 'card';
    secHeader.innerHTML = `
      <div class="card-hdr">DNS Records for <span style="color:var(--accent)">${domain}</span></div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:4px">
        Resolver: Cloudflare 1.1.1.1 · DNSSEC validated
      </div>`;

    let hasAny = false;
    results.forEach(res => {
      if (res.status !== 'fulfilled') return;
      const { label, desc, answers } = res.value;
      if (!answers.length) return;
      hasAny = true;

      const block = document.createElement('div');
      block.style.cssText = 'margin-top:14px;border-top:1px solid var(--border);padding-top:14px';
      block.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-family:var(--mono);font-size:11px;font-weight:700;
            padding:2px 8px;border-radius:4px;background:var(--s3);color:var(--amber)">${label}</span>
          <span style="font-family:var(--mono);font-size:10px;color:var(--muted)">${desc}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:11px">
          <thead>
            <tr style="border-bottom:1px solid var(--border)">
              <th style="text-align:left;padding:4px 8px;color:var(--muted);font-size:9px;letter-spacing:1px">NAME</th>
              <th style="text-align:left;padding:4px 8px;color:var(--muted);font-size:9px;letter-spacing:1px">TTL</th>
              <th style="text-align:left;padding:4px 8px;color:var(--muted);font-size:9px;letter-spacing:1px">VALUE</th>
            </tr>
          </thead>
          <tbody>
            ${answers.map(a => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:6px 8px;color:var(--muted2)">${a.name}</td>
                <td style="padding:6px 8px;color:var(--muted)">${a.TTL}s</td>
                <td style="padding:6px 8px;color:var(--text2);word-break:break-all">${a.data}</td>
              </tr>`).join('')}
          </tbody>
        </table>`;
      secHeader.appendChild(block);
    });

    if (!hasAny) {
      secHeader.innerHTML += `<div style="font-family:var(--mono);font-size:12px;
        color:var(--muted);margin-top:14px">No DNS records found for this domain.</div>`;
    }
    pane.appendChild(secHeader);

    // About DNS
    const secAbout = document.createElement('div');
    secAbout.className = 'card';
    secAbout.style.background = 'var(--s2)';
    secAbout.innerHTML = `
      <div class="card-hdr">About DNS Records</div>
      <div style="font-size:13px;color:var(--text);line-height:1.8">
        <p style="margin-bottom:10px">The <strong style="color:var(--text2)">Domain Name System (DNS)</strong>
        translates human-readable domain names into IP addresses.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:10px">
          ${[
            ['A', 'Maps domain to IPv4'],
            ['AAAA', 'Maps domain to IPv6'],
            ['MX', 'Mail server routing'],
            ['NS', 'Authoritative nameservers'],
            ['TXT', 'SPF, DKIM, verification'],
            ['CNAME', 'Alias to another domain'],
            ['SOA', 'Zone authority info'],
            ['CAA', 'Allowed SSL issuers'],
          ].map(([t, d]) => `
            <div style="background:var(--s3);border:1px solid var(--border);border-radius:6px;padding:8px 12px">
              <div style="font-family:var(--mono);font-size:11px;color:var(--amber);font-weight:700">${t}</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:2px">${d}</div>
            </div>`).join('')}
        </div>
      </div>`;
    pane.appendChild(secAbout);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 3: Uptime
  // ────────────────────────────────────────────────────────────────────────────
  async function renderUptime(pane, query) {
    const domain = isIP(query) ? query : query;
    pane.innerHTML = skeleton('Checking uptime...');

    const checks = [
      { label: 'HTTP',  url: `http://${domain}`,  icon: '🌐' },
      { label: 'HTTPS', url: `https://${domain}`, icon: '🔒' },
    ];

    const results = await Promise.allSettled(
      checks.map(async c => {
        const t0 = performance.now();
        try {
          const res = await Promise.race([
            fetch(c.url, { mode: 'no-cors', cache: 'no-store' }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
          ]);
          const ms = Math.round(performance.now() - t0);
          return { ...c, ok: true, ms, status: res.status || 'N/A (no-cors)' };
        } catch (e) {
          const ms = Math.round(performance.now() - t0);
          return { ...c, ok: e.message !== 'timeout', ms, error: e.message };
        }
      })
    );

    pane.innerHTML = '';

    // Current Status
    const secStatus = document.createElement('div');
    secStatus.className = 'card';
    secStatus.innerHTML = `<div class="card-hdr">Current Status: <span style="color:var(--accent)">${domain}</span></div>`;

    results.forEach(r => {
      const data = r.status === 'fulfilled' ? r.value : { ...checks[0], ok: false, ms: 0, error: r.reason?.message };
      const color = data.ok ? 'green' : (data.error === 'timeout' ? 'amber' : 'red');
      const statusText = data.ok
        ? `Reachable (${data.ms}ms)`
        : (data.error === 'timeout' ? `Timeout (>${data.ms}ms)` : 'Unreachable');

      secStatus.innerHTML += `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:20px">${data.icon}</span>
          <div style="flex:1">
            <div style="font-family:var(--mono);font-size:12px;color:var(--text2);font-weight:600">${data.label}</div>
            <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:2px">${data.url}</div>
          </div>
          ${statusBadge(statusText, color)}
        </div>`;
    });

    secStatus.innerHTML += `
      <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:10px">
        ℹ Checks use fetch() with no-cors mode. Browser CORS policy may affect results.
        HTTP redirects to HTTPS count as reachable.
      </div>`;
    pane.appendChild(secStatus);

    // Historical data note
    const secHist = document.createElement('div');
    secHist.className = 'card';
    secHist.innerHTML = `
      <div class="card-hdr">Historical Data</div>
      <div style="font-size:13px;color:var(--text);line-height:1.8">
        <p style="margin-bottom:10px;color:var(--muted2)">
          Historical uptime monitoring requires a persistent backend service to record
          periodic checks over time. This browser-based tool can only perform real-time checks.
        </p>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted)">
          For full historical monitoring, consider:
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
          ${[
            ['UptimeRobot', 'https://uptimerobot.com'],
            ['Better Uptime', 'https://betteruptime.com'],
            ['Freshping', 'https://freshping.io'],
            ['StatusCake', 'https://statuscake.com'],
          ].map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener"
            style="font-family:var(--mono);font-size:11px;color:var(--blue);padding:4px 10px;
            border:1px solid var(--border);border-radius:5px;text-decoration:none">${n} ↗</a>`
          ).join('')}
        </div>
      </div>`;
    pane.appendChild(secHist);

    // About
    const secAbout = document.createElement('div');
    secAbout.className = 'card';
    secAbout.style.background = 'var(--s2)';
    secAbout.innerHTML = `
      <div class="card-hdr">About Website Uptime Monitoring</div>
      <div style="font-size:13px;color:var(--text);line-height:1.8">
        <p>Uptime monitoring checks whether a website is accessible from the internet.
        Key metrics include <strong style="color:var(--text2)">response time</strong>,
        <strong style="color:var(--text2)">HTTP status code</strong>,
        and <strong style="color:var(--text2)">availability percentage</strong>.</p>
        <p style="margin-bottom:0;font-family:var(--mono);font-size:11px;color:var(--muted)">
          99.9% uptime = ~8.7 hours downtime/year ·
          99.99% uptime = ~52 minutes/year ·
          99.999% uptime = ~5 minutes/year
        </p>
      </div>`;
    pane.appendChild(secAbout);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 4: Diagnostics (Ping & Traceroute via HackerTarget API)
  // ────────────────────────────────────────────────────────────────────────────
  async function renderDiag(pane, query) {
    pane.innerHTML = `
<div class="card">
  <div class="card-hdr">Run Network Diagnostics for <span style="color:var(--accent)">${query}</span></div>
  <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:14px">
    Ping and Traceroute run via <a href="https://hackertarget.com" target="_blank" rel="noopener"
    style="color:var(--blue)">HackerTarget.com</a> public API (rate limited).
    True ICMP is impossible from a browser — requests are routed from HackerTarget servers.
  </p>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-blue" id="wi-run-ping">📡 Run Ping</button>
    <button class="btn" id="wi-run-trace">🗺 Run Traceroute</button>
  </div>
</div>

<div class="card" id="wi-ping-card" style="display:none">
  <div class="card-hdr">Ping Results — <span style="color:var(--accent)">${query}</span></div>
  <div id="wi-ping-out"></div>
</div>

<div class="card" id="wi-trace-card" style="display:none">
  <div class="card-hdr">Traceroute Results — <span style="color:var(--accent)">${query}</span></div>
  <div id="wi-trace-out"></div>
</div>

<div class="card" style="background:var(--s2)">
  <div class="card-hdr">About Ping & Traceroute</div>
  <div style="font-size:13px;color:var(--text);line-height:1.8">
    <p style="margin-bottom:10px">
      <strong style="color:var(--text2)">Ping</strong> sends ICMP Echo Request packets to measure
      round-trip time (RTT) and packet loss to a host.
    </p>
    <p style="margin-bottom:10px">
      <strong style="color:var(--text2)">Traceroute</strong> maps the network path between two hosts,
      showing each router (hop) along the route and its latency.
    </p>
    <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:0">
      ⚠ Browsers cannot send raw ICMP packets directly. These tools use server-side execution
      via the HackerTarget API. Results reflect server-to-target connectivity, not your local network.
    </p>
  </div>
</div>`;

    function diagOutput(raw) {
      return `<pre style="font-family:var(--mono);font-size:11px;color:var(--text2);
        background:var(--bg);border:1px solid var(--border);border-radius:6px;
        padding:12px 14px;overflow-x:auto;white-space:pre;line-height:1.7;
        max-height:360px;overflow-y:auto">${raw.replace(/</g,'&lt;')}</pre>`;
    }

    const ht_base = 'https://api.hackertarget.com';

    pane.querySelector('#wi-run-ping').addEventListener('click', async () => {
      const card = pane.querySelector('#wi-ping-card');
      const out  = pane.querySelector('#wi-ping-out');
      card.style.display = 'block';
      out.innerHTML = '<div style="font-family:var(--mono);font-size:11px;color:var(--muted)">⏳ Running ping...</div>';
      try {
        const r = await fetch(`${ht_base}/nping/?q=${encodeURIComponent(query)}`);
        const t = await r.text();
        out.innerHTML = t.includes('error') || t.includes('API count')
          ? errBox(t.trim())
          : diagOutput(t);
      } catch (e) { out.innerHTML = errBox(e.message); }
    });

    pane.querySelector('#wi-run-trace').addEventListener('click', async () => {
      const card = pane.querySelector('#wi-trace-card');
      const out  = pane.querySelector('#wi-trace-out');
      card.style.display = 'block';
      out.innerHTML = '<div style="font-family:var(--mono);font-size:11px;color:var(--muted)">⏳ Running traceroute (may take 30–60s)...</div>';
      try {
        const r = await fetch(`${ht_base}/traceroute/?q=${encodeURIComponent(query)}`);
        const t = await r.text();
        out.innerHTML = t.includes('error') || t.includes('API count')
          ? errBox(t.trim())
          : diagOutput(t);
      } catch (e) { out.innerHTML = errBox(e.message); }
    });
  }
}