export function renderJwt(el, { copyText, notify }) {

  el.innerHTML = `
<div class="card">
  <div class="card-hdr">JWT Token</div>
  <div style="position:relative">
    <textarea id="jwt-input" spellcheck="false"
      placeholder="Paste your JWT token here... (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
      style="width:100%;min-height:90px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.7;
             transition:border-color .12s;word-break:break-all">
    </textarea>
  </div>
  <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-blue" id="jwt-decode-btn">▶ DECODE</button>
    <button class="btn btn-sm" id="jwt-paste-btn">⎘ Paste</button>
    <button class="btn btn-sm btn-danger" id="jwt-clear-btn">✕ Clear</button>
    <div id="jwt-color-token" style="flex:1;min-width:0;font-family:var(--mono);font-size:11px;
         word-break:break-all;padding:4px 0;display:none"></div>
  </div>
</div>

<!-- Try example -->
<div id="jwt-try-wrap" style="margin-bottom:14px;font-family:var(--mono);font-size:11px;color:var(--muted)">
  No JWT?
  <button class="btn btn-sm" id="jwt-try-btn" style="font-size:10px">Load example</button>
</div>

<!-- Result (hidden until decoded) -->
<div id="jwt-result" style="display:none">

  <!-- Status banner -->
  <div id="jwt-status-banner" style="margin-bottom:14px;padding:10px 14px;border-radius:8px;
       font-family:var(--mono);font-size:12px;display:flex;align-items:center;gap:10px"></div>

  <!-- Three columns: Header, Payload, Signature -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px" id="jwt-grid">

    <!-- Header -->
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="jwt-dot" style="background:#4a9eff"></span>
          <span class="card-hdr" style="margin-bottom:0">Header</span>
        </div>
        <button class="btn btn-sm" id="jwt-copy-header">⎘</button>
      </div>
      <pre class="jwt-json" id="jwt-header-json"></pre>
      <div id="jwt-header-fields" class="jwt-fields"></div>
    </div>

    <!-- Payload -->
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="jwt-dot" style="background:var(--accent)"></span>
          <span class="card-hdr" style="margin-bottom:0">Payload</span>
        </div>
        <button class="btn btn-sm" id="jwt-copy-payload">⎘</button>
      </div>
      <pre class="jwt-json" id="jwt-payload-json"></pre>
      <div id="jwt-payload-fields" class="jwt-fields"></div>
    </div>
  </div>

  <!-- Signature -->
  <div class="card" style="margin-bottom:12px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:8px">
        <span class="jwt-dot" style="background:var(--red)"></span>
        <span class="card-hdr" style="margin-bottom:0">Signature</span>
      </div>
      <button class="btn btn-sm" id="jwt-copy-sig">⎘ Copy</button>
    </div>
    <div style="font-family:var(--mono);font-size:11px;color:var(--muted2);word-break:break-all;
         line-height:1.6" id="jwt-sig-val"></div>
    <div id="jwt-sig-note" style="font-family:var(--mono);font-size:11px;color:var(--muted);
         margin-top:8px;padding:8px 12px;background:var(--s2);border-radius:6px;line-height:1.7"></div>
  </div>

  <!-- Claims reference -->
  <div id="jwt-claims-ref" class="card" style="display:none">
    <div class="card-hdr">Registered Claims</div>
    <div id="jwt-claims-table"></div>
  </div>

  <!-- Raw parts -->
  <div class="card" style="background:var(--s2)">
    <div class="card-hdr" style="cursor:pointer;user-select:none" id="jwt-raw-toggle">
      Raw Base64url Parts <span style="font-size:10px;color:var(--muted)">(click to expand)</span>
    </div>
    <div id="jwt-raw-parts" style="display:none">
      <div style="margin-bottom:10px">
        <div style="font-family:var(--mono);font-size:10px;color:#4a9eff;margin-bottom:4px">HEADER</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--muted2);word-break:break-all" id="jwt-raw-h"></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="font-family:var(--mono);font-size:10px;color:var(--accent);margin-bottom:4px">PAYLOAD</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--muted2);word-break:break-all" id="jwt-raw-p"></div>
      </div>
      <div>
        <div style="font-family:var(--mono);font-size:10px;color:var(--red);margin-bottom:4px">SIGNATURE</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--muted2);word-break:break-all" id="jwt-raw-s"></div>
      </div>
    </div>
  </div>
</div>

<!-- About JWT -->
<div class="card" style="background:var(--s2);margin-top:14px">
  <div class="card-hdr">About JWT</div>
  <div style="font-size:13px;color:var(--text);line-height:1.8">
    <p style="margin-bottom:10px">
      <strong style="color:var(--text2)">JSON Web Token (JWT)</strong> is a compact, URL-safe token
      format used for authentication and information exchange. A JWT consists of three Base64url-encoded
      parts separated by dots: <span style="color:#4a9eff">Header</span>.<span style="color:var(--accent)">Payload</span>.<span style="color:var(--red)">Signature</span>
    </p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:10px">
      ${[
        ['alg','Signing algorithm (HS256, RS256...)'],
        ['typ','Token type (JWT)'],
        ['iss','Issuer — who created the token'],
        ['sub','Subject — who the token is about'],
        ['aud','Audience — intended recipients'],
        ['exp','Expiration time (Unix timestamp)'],
        ['nbf','Not Before — valid after this time'],
        ['iat','Issued At — creation time'],
        ['jti','JWT ID — unique identifier'],
      ].map(([k,v]) => `
        <div style="background:var(--s3);border:1px solid var(--border);border-radius:6px;padding:8px 10px">
          <div style="font-family:var(--mono);font-size:11px;color:var(--accent);font-weight:700">${k}</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:2px;line-height:1.4">${v}</div>
        </div>`).join('')}
    </div>
    <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:12px;margin-bottom:0">
      ⚠ JWT signature verification requires the secret/public key — this tool decodes and inspects the token only.
      Never paste production tokens into online tools.
    </p>
  </div>
</div>`;

  const q = id => el.querySelector('#' + id);

  // ── Example JWT ────────────────────────────────────────────────────────────
  const EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTY1ODI0MDAsImV4cCI6MTcxNjYyNTYwMCwibmJmIjoxNzE2NTgyNDAwLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJhdWQiOlsiaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20iXSwianRpIjoiYWJjZGVmMTIzNDU2In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  q('jwt-try-btn').addEventListener('click', () => {
    q('jwt-input').value = EXAMPLE;
    decode(EXAMPLE);
  });

  // ── Buttons ────────────────────────────────────────────────────────────────
  q('jwt-decode-btn').addEventListener('click', () => decode(q('jwt-input').value.trim()));
  q('jwt-paste-btn').addEventListener('click', () =>
    navigator.clipboard.readText().then(t => { q('jwt-input').value = t.trim(); decode(t.trim()); })
  );
  q('jwt-clear-btn').addEventListener('click', () => {
    q('jwt-input').value = '';
    q('jwt-result').style.display = 'none';
    q('jwt-color-token').style.display = 'none';
    q('jwt-try-wrap').style.display = '';
  });
  q('jwt-input').addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') decode(q('jwt-input').value.trim());
  });
  // Live decode on paste
  q('jwt-input').addEventListener('input', () => {
    clearTimeout(q('jwt-input')._t);
    q('jwt-input')._t = setTimeout(() => {
      const v = q('jwt-input').value.trim();
      if (v.split('.').length === 3) decode(v);
    }, 400);
  });

  q('jwt-raw-toggle').addEventListener('click', () => {
    const p = q('jwt-raw-parts');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  function b64urlDecode(str) {
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    try {
      return JSON.parse(decodeURIComponent(escape(atob(s))));
    } catch {
      // Try raw
      try { return atob(s); } catch { return null; }
    }
  }

  function fmtDate(ts) {
    const d = new Date(ts * 1000);
    return d.toUTCString() + ` (${ts})`;
  }

  function timeAgo(ts) {
    const diff = ts - Date.now() / 1000;
    const abs  = Math.abs(diff);
    const past = diff < 0;
    if (abs < 60)    return past ? `${Math.round(abs)}s ago` : `in ${Math.round(abs)}s`;
    if (abs < 3600)  return past ? `${Math.round(abs/60)}m ago` : `in ${Math.round(abs/60)}m`;
    if (abs < 86400) return past ? `${Math.round(abs/3600)}h ago` : `in ${Math.round(abs/3600)}h`;
    return past ? `${Math.round(abs/86400)}d ago` : `in ${Math.round(abs/86400)}d`;
  }

  function syntaxHighlight(json) {
    return json
      .replace(/("(\\u[a-zA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, m =>
        /:$/.test(m)
          ? `<span style="color:#4a9eff">${m}</span>`
          : `<span style="color:var(--green)">${m}</span>`)
      .replace(/\b(true|false)\b/g, '<span style="color:var(--amber)">$1</span>')
      .replace(/\bnull\b/g, '<span style="color:var(--muted2)">null</span>')
      .replace(/(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, '<span style="color:var(--amber)">$1</span>');
  }

  function fieldRow(k, v, note = '') {
    return `<div class="jwt-field-row">
      <span class="jwt-fk">${k}</span>
      <span class="jwt-fv">${v}${note ? ` <span class="jwt-note">${note}</span>` : ''}</span>
    </div>`;
  }

  // ── Decode ─────────────────────────────────────────────────────────────────
  function decode(token) {
    if (!token) { notify('Enter a JWT token'); return; }

    const parts = token.split('.');
    if (parts.length !== 3) {
      notify('Invalid JWT: expected 3 parts separated by dots');
      return;
    }

    const [rawH, rawP, rawS] = parts;
    const header  = b64urlDecode(rawH);
    const payload = b64urlDecode(rawP);

    if (!header || typeof header !== 'object') {
      notify('Could not decode header — check token format'); return;
    }
    if (!payload || typeof payload !== 'object') {
      notify('Could not decode payload — check token format'); return;
    }

    q('jwt-try-wrap').style.display  = 'none';
    q('jwt-result').style.display    = 'block';

    // ── Colored token display ─────────────────────────────────────────────
    const colorEl = q('jwt-color-token');
    colorEl.style.display = 'block';
    colorEl.innerHTML =
      `<span style="color:#4a9eff">${rawH}</span>` +
      `<span style="color:var(--muted)">.</span>` +
      `<span style="color:var(--accent)">${rawP}</span>` +
      `<span style="color:var(--muted)">.</span>` +
      `<span style="color:var(--red)">${rawS}</span>`;

    // ── Status banner ─────────────────────────────────────────────────────
    const now = Math.floor(Date.now() / 1000);
    let status = 'valid', statusMsg = '✓ Token structure is valid';
    let statusStyle = 'background:rgba(24,224,112,.1);border:1px solid rgba(24,224,112,.25);color:var(--green)';

    if (payload.exp) {
      if (payload.exp < now) {
        status = 'expired';
        statusMsg = `✕ Token EXPIRED ${timeAgo(payload.exp)}`;
        statusStyle = 'background:rgba(224,85,85,.1);border:1px solid rgba(224,85,85,.25);color:#f08080';
      } else {
        const remains = payload.exp - now;
        if (remains < 300) {
          statusMsg = `⚠ Token expires ${timeAgo(payload.exp)}`;
          statusStyle = 'background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.25);color:var(--amber)';
        } else {
          statusMsg += ` · Expires ${timeAgo(payload.exp)}`;
        }
      }
    }
    if (payload.nbf && payload.nbf > now) {
      statusMsg = `⚠ Token not yet valid (nbf: ${timeAgo(payload.nbf)})`;
      statusStyle = 'background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.25);color:var(--amber)';
    }

    q('jwt-status-banner').style.cssText = `margin-bottom:14px;padding:10px 14px;border-radius:8px;
      font-family:var(--mono);font-size:12px;display:flex;align-items:center;gap:10px;${statusStyle}`;
    q('jwt-status-banner').innerHTML = `
      <span style="font-size:16px">${status === 'expired' ? '🔴' : status === 'valid' ? '🟢' : '🟡'}</span>
      <span>${statusMsg}</span>
      <span style="margin-left:auto;font-size:11px;color:inherit;opacity:.7">alg: ${header.alg || '?'} · typ: ${header.typ || '?'}</span>`;

    // ── Header ────────────────────────────────────────────────────────────
    const hJson = JSON.stringify(header, null, 2);
    q('jwt-header-json').innerHTML = syntaxHighlight(hJson.replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    q('jwt-header-fields').innerHTML = [
      header.alg ? fieldRow('Algorithm', header.alg, getAlgNote(header.alg)) : '',
      header.typ ? fieldRow('Type', header.typ) : '',
      header.kid ? fieldRow('Key ID', header.kid) : '',
      header.x5t ? fieldRow('X.509 Thumbprint', header.x5t) : '',
    ].filter(Boolean).join('');
    q('jwt-copy-header').onclick = () => copyText(hJson, 'header');

    // ── Payload ───────────────────────────────────────────────────────────
    const pJson = JSON.stringify(payload, null, 2);
    q('jwt-payload-json').innerHTML = syntaxHighlight(pJson.replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    // Registered claims
    const registeredClaims = [];
    const TIME_CLAIMS = { exp: 'Expires At', iat: 'Issued At', nbf: 'Not Before', auth_time: 'Auth Time' };
    const STR_CLAIMS  = { iss: 'Issuer', sub: 'Subject', jti: 'JWT ID' };
    const ARR_CLAIMS  = { aud: 'Audience', scope: 'Scope' };

    Object.entries(TIME_CLAIMS).forEach(([k, label]) => {
      if (payload[k] !== undefined) {
        const isExpired = k === 'exp' && payload[k] < now;
        const note = `${fmtDate(payload[k])} <em style="color:${isExpired?'var(--red)':'var(--muted)'}">(${timeAgo(payload[k])})</em>`;
        registeredClaims.push(fieldRow(label, `<code>${k}</code>`, note));
      }
    });
    Object.entries(STR_CLAIMS).forEach(([k, label]) => {
      if (payload[k]) registeredClaims.push(fieldRow(label, `<code>${k}</code>`, `<em>${payload[k]}</em>`));
    });
    Object.entries(ARR_CLAIMS).forEach(([k, label]) => {
      if (payload[k]) {
        const val = Array.isArray(payload[k]) ? payload[k].join(', ') : payload[k];
        registeredClaims.push(fieldRow(label, `<code>${k}</code>`, `<em>${val}</em>`));
      }
    });

    // Custom claims
    const reserved = new Set(['exp','iat','nbf','iss','sub','aud','jti','scope','auth_time']);
    const customClaims = Object.entries(payload)
      .filter(([k]) => !reserved.has(k))
      .map(([k, v]) => fieldRow(k, '', `<em>${JSON.stringify(v)}</em>`));

    q('jwt-payload-fields').innerHTML = [...registeredClaims, ...customClaims].join('');
    q('jwt-copy-payload').onclick = () => copyText(pJson, 'payload');

    // ── Claims reference ──────────────────────────────────────────────────
    if (registeredClaims.length) {
      q('jwt-claims-ref').style.display = 'block';
      q('jwt-claims-table').innerHTML = registeredClaims.join('');
    }

    // ── Signature ─────────────────────────────────────────────────────────
    q('jwt-sig-val').textContent = rawS;
    q('jwt-sig-note').innerHTML =
      `ℹ The signature is created by signing <code>base64url(header) + "." + base64url(payload)</code> ` +
      `using the algorithm <strong>${header.alg || 'unknown'}</strong> and a secret/private key.<br>` +
      `Signature verification requires the secret key and cannot be done in the browser without it.`;
    q('jwt-copy-sig').onclick = () => copyText(rawS, 'signature');

    // ── Raw parts ─────────────────────────────────────────────────────────
    q('jwt-raw-h').textContent = rawH;
    q('jwt-raw-p').textContent = rawP;
    q('jwt-raw-s').textContent = rawS;
  }

  function getAlgNote(alg) {
    const notes = {
      'HS256': 'HMAC SHA-256 (symmetric)',
      'HS384': 'HMAC SHA-384 (symmetric)',
      'HS512': 'HMAC SHA-512 (symmetric)',
      'RS256': 'RSA SHA-256 (asymmetric)',
      'RS384': 'RSA SHA-384 (asymmetric)',
      'RS512': 'RSA SHA-512 (asymmetric)',
      'ES256': 'ECDSA P-256 SHA-256',
      'ES384': 'ECDSA P-384 SHA-384',
      'ES512': 'ECDSA P-521 SHA-512',
      'PS256': 'RSA-PSS SHA-256',
      'none':  '⚠ Unsigned token — not secure!',
    };
    return notes[alg] ? `<span style="color:${alg==='none'?'var(--red)':'var(--muted)'}">${notes[alg]}</span>` : '';
  }
}