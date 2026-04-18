export function renderBase64Img(el, { copyText, notify }) {

  el.innerHTML = `
<!-- Tabs -->
<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
  <button class="btn btn-blue" id="b64i-tab-encode">🖼 Image → Base64</button>
  <button class="btn"          id="b64i-tab-decode">🔄 Base64 → Image</button>
  <button class="btn"          id="b64i-tab-css">🎨 CSS Usage</button>
</div>

<!-- ── ENCODE pane ── -->
<div id="b64i-pane-encode">
  <div class="card">
    <div class="card-hdr">Upload Image</div>
    <div class="b64i-drop" id="b64i-drop">
      <div style="font-size:32px;margin-bottom:8px">🖼</div>
      <div style="font-size:14px;color:var(--text);margin-bottom:6px">
        Drag &amp; drop image or <span class="b64i-browse" id="b64i-browse">browse</span>
      </div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--muted)">
        PNG · JPG · GIF · WebP · SVG · ICO · Any image format
      </div>
      <input type="file" id="b64i-file" accept="image/*" style="display:none">
    </div>
    <div id="b64i-url-row" style="margin-top:12px">
      <span class="f-label">OR ENCODE FROM URL</span>
      <div class="row" style="align-items:flex-end;gap:8px">
        <div class="field">
          <input type="text" id="b64i-url-input" placeholder="https://example.com/image.png"
            style="font-family:var(--mono);font-size:12px">
        </div>
        <button class="btn btn-sm btn-blue" id="b64i-url-btn" style="flex-shrink:0">FETCH</button>
      </div>
    </div>
  </div>

  <div id="b64i-encode-result" style="display:none">
    <!-- Preview + info -->
    <div class="card">
      <div class="card-hdr">Image Info</div>
      <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
        <img id="b64i-preview"
          style="max-width:140px;max-height:140px;border-radius:8px;border:1px solid var(--border);
                 background:repeating-conic-gradient(var(--s3) 0% 25%,var(--bg) 0% 50%) 0 0/10px 10px;
                 object-fit:contain;flex-shrink:0">
        <div id="b64i-info" style="font-family:var(--mono);font-size:12px;color:var(--muted2);line-height:2;flex:1"></div>
      </div>
    </div>

    <!-- Output options -->
    <div class="card">
      <div class="card-hdr">Base64 Output</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn btn-sm b64i-fmt-btn active" data-fmt="dataurl">Data URL</button>
        <button class="btn btn-sm b64i-fmt-btn"        data-fmt="raw">Raw Base64</button>
        <button class="btn btn-sm b64i-fmt-btn"        data-fmt="imghtml">HTML &lt;img&gt;</button>
        <button class="btn btn-sm b64i-fmt-btn"        data-fmt="cssurl">CSS url()</button>
        <button class="btn btn-sm b64i-fmt-btn"        data-fmt="markdown">Markdown</button>
      </div>
      <textarea id="b64i-output" readonly spellcheck="false"
        style="width:100%;min-height:100px;background:var(--bg);border:1px solid var(--border);
               border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
               font-size:11px;outline:none;resize:vertical;line-height:1.6;word-break:break-all">
      </textarea>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-blue btn-sm" id="b64i-copy">⎘ Copy</button>
        <button class="btn btn-sm" id="b64i-dl-txt">⬇ Save as .txt</button>
        <span id="b64i-size-label" style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-left:auto"></span>
      </div>
    </div>
  </div>
</div>

<!-- ── DECODE pane ── -->
<div id="b64i-pane-decode" style="display:none">
  <div class="card">
    <div class="card-hdr">Paste Base64 / Data URL</div>
    <textarea id="b64i-decode-input" spellcheck="false"
      placeholder="Paste Data URL (data:image/png;base64,...) or raw Base64 string..."
      style="width:100%;min-height:120px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.6;transition:border-color .12s;
             margin-bottom:10px">
    </textarea>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <button class="btn btn-blue" id="b64i-decode-btn">▶ DECODE</button>
      <button class="btn btn-sm btn-danger" id="b64i-decode-clear">✕ Clear</button>
      <select id="b64i-decode-mime" style="padding:7px 10px;font-size:12px;font-family:var(--mono)">
        <option value="">Auto-detect MIME</option>
        <option value="image/png">image/png</option>
        <option value="image/jpeg">image/jpeg</option>
        <option value="image/gif">image/gif</option>
        <option value="image/webp">image/webp</option>
        <option value="image/svg+xml">image/svg+xml</option>
        <option value="image/x-icon">image/x-icon</option>
      </select>
    </div>
  </div>
  <div id="b64i-decode-result" style="display:none" class="card">
    <div class="card-hdr" style="display:flex;align-items:center;justify-content:space-between">
      <span>Decoded Image</span>
      <button class="btn btn-sm btn-blue" id="b64i-decode-dl">⬇ Download</button>
    </div>
    <div style="text-align:center;padding:10px 0">
      <img id="b64i-decode-img"
        style="max-width:100%;max-height:400px;border-radius:8px;border:1px solid var(--border);
               background:repeating-conic-gradient(var(--s3) 0% 25%,var(--bg) 0% 50%) 0 0/10px 10px;
               object-fit:contain">
    </div>
    <div id="b64i-decode-info" style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:8px"></div>
  </div>
  <div id="b64i-decode-err" style="display:none" class="card">
    <div style="color:var(--red);font-family:var(--mono);font-size:12px" id="b64i-decode-err-msg"></div>
  </div>
</div>

<!-- ── CSS USAGE pane ── -->
<div id="b64i-pane-css" style="display:none">
  <div class="card">
    <div class="card-hdr">CSS / HTML Usage Examples</div>
    <p style="font-size:13px;color:var(--text);margin-bottom:16px;line-height:1.7">
      Base64 images can be embedded directly in CSS, HTML, and JavaScript — no external file requests.
      <strong style="color:var(--text2)">Upload an image first</strong> to get live examples.
    </p>
    <div id="b64i-css-examples">
      <div style="font-family:var(--mono);font-size:12px;color:var(--muted)">
        ← Upload an image in the "Image → Base64" tab to see examples here.
      </div>
    </div>
  </div>
  <div class="card" style="background:var(--s2)">
    <div class="card-hdr">When to use Base64 Images?</div>
    <div style="font-size:13px;color:var(--text);line-height:1.8">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:4px">
        <div>
          <div style="color:var(--green);font-family:var(--mono);font-size:11px;font-weight:700;margin-bottom:8px">✓ Good use cases</div>
          <ul style="padding-left:16px;color:var(--text);font-size:12px;line-height:2">
            <li>Small icons &amp; logos (&lt;5KB)</li>
            <li>CSS background images</li>
            <li>Email templates (no hosting)</li>
            <li>Favicons in CSS</li>
            <li>Single-file HTML documents</li>
            <li>Reducing HTTP requests</li>
          </ul>
        </div>
        <div>
          <div style="color:var(--red);font-family:var(--mono);font-size:11px;font-weight:700;margin-bottom:8px">✕ Avoid when</div>
          <ul style="padding-left:16px;color:var(--text);font-size:12px;line-height:2">
            <li>Large images (&gt;10KB)</li>
            <li>Images shared across pages</li>
            <li>Browser caching is needed</li>
            <li>Dynamic images</li>
            <li>Already on CDN</li>
          </ul>
        </div>
      </div>
      <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:12px;margin-bottom:0">
        Base64 encoding increases file size by ~33%. For images &gt;10KB, a separate file with caching is always faster.
      </p>
    </div>
  </div>
</div>`;

  // ── State ──────────────────────────────────────────────────────────────────
  let currentDataUrl = '';
  let currentMime    = '';
  let currentFmt     = 'dataurl';
  let currentName    = 'image';
  let currentW = 0, currentH = 0, currentBytes = 0;

  const q = id => el.querySelector('#' + id);

  // ── Tabs ───────────────────────────────────────────────────────────────────
  function setTab(tab) {
    ['encode','decode','css'].forEach(t => {
      q(`b64i-pane-${t}`).style.display = t === tab ? '' : 'none';
      q(`b64i-tab-${t}`).className = 'btn ' + (t === tab ? 'btn-blue' : '');
    });
  }
  q('b64i-tab-encode').addEventListener('click', () => setTab('encode'));
  q('b64i-tab-decode').addEventListener('click', () => setTab('decode'));
  q('b64i-tab-css').addEventListener('click',    () => setTab('css'));

  // ── Drop zone (encode) ─────────────────────────────────────────────────────
  const drop  = q('b64i-drop');
  const input = q('b64i-file');

  q('b64i-browse').addEventListener('click', () => input.click());
  drop.addEventListener('click', () => input.click());
  drop.addEventListener('dragover',  e => { e.preventDefault(); drop.classList.add('b64i-drop--over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('b64i-drop--over'));
  drop.addEventListener('drop', e => {
    e.preventDefault(); drop.classList.remove('b64i-drop--over');
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file); else notify('Please drop an image file');
  });
  input.addEventListener('change', () => { if (input.files[0]) loadFile(input.files[0]); });

  // ── Load file ──────────────────────────────────────────────────────────────
  function loadFile(file) {
    if (!file.type.startsWith('image/') && !file.name.match(/\.(ico|svg|webp)$/i)) {
      notify('Please select an image file'); return;
    }
    currentBytes = file.size;
    currentMime  = file.type || guessMime(file.name);
    currentName  = file.name.replace(/\.[^.]+$/, '');
    const reader = new FileReader();
    reader.onload = e => { processDataUrl(e.target.result, file.name); };
    reader.readAsDataURL(file);
  }

  function guessMime(name) {
    const ext = name.split('.').pop().toLowerCase();
    const map = { png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg',
      gif:'image/gif', webp:'image/webp', svg:'image/svg+xml', ico:'image/x-icon' };
    return map[ext] || 'image/png';
  }

  function processDataUrl(dataUrl, filename) {
    currentDataUrl = dataUrl;
    // Preview
    const img = new Image();
    img.onload = () => {
      currentW = img.naturalWidth;
      currentH = img.naturalHeight;
      q('b64i-preview').src = dataUrl;
      const b64Size = Math.round(dataUrl.split(',')[1].length * 0.75);
      q('b64i-info').innerHTML =
        `Name: <span style="color:var(--text2)">${filename || currentName}</span><br>` +
        `MIME: <span style="color:var(--text2)">${currentMime}</span><br>` +
        `Dimensions: <span style="color:var(--text2)">${currentW}×${currentH}px</span><br>` +
        `Original size: <span style="color:var(--text2)">${fmtBytes(currentBytes)}</span><br>` +
        `Base64 size: <span style="color:var(--amber)">${fmtBytes(b64Size)}</span> (+${Math.round((b64Size/currentBytes-1)*100)}%)`;
      q('b64i-encode-result').style.display = 'block';
      renderOutput();
      renderCssExamples();
    };
    img.onerror = () => {
      // SVG or non-renderable — show anyway
      q('b64i-preview').src = dataUrl;
      q('b64i-encode-result').style.display = 'block';
      renderOutput();
    };
    img.src = dataUrl;
  }

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
    return (b/1024/1024).toFixed(2) + ' MB';
  }

  // ── Output format ──────────────────────────────────────────────────────────
  el.querySelectorAll('.b64i-fmt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.b64i-fmt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFmt = btn.dataset.fmt;
      renderOutput();
    });
  });

  function getOutput() {
    if (!currentDataUrl) return '';
    const raw = currentDataUrl.split(',')[1];
    switch (currentFmt) {
      case 'dataurl':  return currentDataUrl;
      case 'raw':      return raw;
      case 'imghtml':  return `<img src="${currentDataUrl}" alt="${currentName}" width="${currentW}" height="${currentH}">`;
      case 'cssurl':   return `url("${currentDataUrl}")`;
      case 'markdown': return `![${currentName}](${currentDataUrl})`;
      default: return currentDataUrl;
    }
  }

  function renderOutput() {
    const out = getOutput();
    q('b64i-output').value = out;
    q('b64i-size-label').textContent = out ? fmtBytes(out.length) + ' string' : '';
  }

  q('b64i-copy').addEventListener('click', () => {
    const v = q('b64i-output').value;
    if (!v) { notify('Nothing to copy'); return; }
    copyText(v, currentFmt + ' string');
  });

  q('b64i-dl-txt').addEventListener('click', () => {
    const v = q('b64i-output').value;
    if (!v) return;
    const a = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([v], { type: 'text/plain' }));
    a.download = `${currentName}-base64.txt`;
    a.click();
  });

  // ── Fetch from URL ─────────────────────────────────────────────────────────
  q('b64i-url-btn').addEventListener('click', async () => {
    const url = q('b64i-url-input').value.trim();
    if (!url) { notify('Enter an image URL'); return; }
    const btn = q('b64i-url-btn');
    btn.textContent = '⏳'; btn.disabled = true;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = e => {
        currentBytes = blob.size;
        currentMime  = blob.type || guessMime(url);
        currentName  = url.split('/').pop().replace(/\?.*/, '').replace(/\.[^.]+$/, '') || 'image';
        processDataUrl(e.target.result, url.split('/').pop());
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      notify('Error: ' + e.message + '. Check CORS policy of the image host.');
    } finally {
      btn.textContent = 'FETCH'; btn.disabled = false;
    }
  });
  q('b64i-url-input').addEventListener('keydown', e => { if (e.key === 'Enter') q('b64i-url-btn').click(); });

  // ── CSS Examples ──────────────────────────────────────────────────────────
  function renderCssExamples() {
    if (!currentDataUrl) return;
    const raw = currentDataUrl.split(',')[1];
    const examples = [
      {
        title: 'HTML <img> tag',
        code:  `<img src="${currentDataUrl.substring(0,60)}..." alt="${currentName}">`,
        full:  `<img src="${currentDataUrl}" alt="${currentName}" width="${currentW}" height="${currentH}">`,
      },
      {
        title: 'CSS background-image',
        code:  `.element {\n  background-image: url("data:${currentMime};base64,...");\n  background-size: contain;\n  background-repeat: no-repeat;\n}`,
        full:  `.element {\n  background-image: url("${currentDataUrl}");\n  background-size: contain;\n  background-repeat: no-repeat;\n  width: ${currentW}px;\n  height: ${currentH}px;\n}`,
      },
      {
        title: 'CSS content (pseudo-elements)',
        code:  `.icon::before {\n  content: url("data:${currentMime};base64,...");\n}`,
        full:  `.icon::before {\n  content: url("${currentDataUrl}");\n}`,
      },
      {
        title: 'Inline SVG (for SVG images)',
        code:  currentMime === 'image/svg+xml' ? `<img src="${currentDataUrl.substring(0,50)}..." >` : `<!-- SVG only: use svg+xml format -->`,
        full:  currentDataUrl,
      },
    ];
    q('b64i-css-examples').innerHTML = examples.map(ex => `
      <div style="margin-bottom:16px;border:1px solid var(--border);border-radius:8px;overflow:hidden">
        <div style="background:var(--s2);padding:8px 14px;font-family:var(--mono);font-size:10px;
          color:var(--accent);letter-spacing:1px;text-transform:uppercase;
          display:flex;align-items:center;justify-content:space-between">
          <span>${ex.title}</span>
          <button class="btn btn-sm b64i-copy-ex" data-full="${encodeURIComponent(ex.full)}"
            style="font-size:10px;padding:2px 8px">⎘ Copy full</button>
        </div>
        <pre style="margin:0;padding:12px 14px;font-family:var(--mono);font-size:11px;
          color:var(--text2);overflow-x:auto;background:var(--bg);white-space:pre;line-height:1.7">${
          ex.code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
      </div>`).join('');
    el.querySelectorAll('.b64i-copy-ex').forEach(btn => {
      btn.addEventListener('click', () => {
        const full = decodeURIComponent(btn.dataset.full);
        copyText(full, 'code snippet');
      });
    });
  }

  // ── DECODE tab ─────────────────────────────────────────────────────────────
  q('b64i-decode-btn').addEventListener('click', decodeBase64);
  q('b64i-decode-input').addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') decodeBase64(); });
  q('b64i-decode-clear').addEventListener('click', () => {
    q('b64i-decode-input').value = '';
    q('b64i-decode-result').style.display = 'none';
    q('b64i-decode-err').style.display = 'none';
  });

  function decodeBase64() {
    const raw   = q('b64i-decode-input').value.trim();
    const errEl = q('b64i-decode-err');
    const resEl = q('b64i-decode-result');
    errEl.style.display = 'none';
    resEl.style.display = 'none';
    if (!raw) { notify('Paste a Base64 string'); return; }

    try {
      let dataUrl = raw;
      // If raw base64 (no data: prefix), add it
      if (!raw.startsWith('data:')) {
        const mime = q('b64i-decode-mime').value || 'image/png';
        dataUrl = `data:${mime};base64,${raw.replace(/\s/g, '')}`;
      }

      // Validate base64 portion
      const b64part = dataUrl.split(',')[1];
      if (!b64part) throw new Error('Invalid format — expected data:mime;base64,... or raw base64');
      atob(b64part.substring(0, 100)); // quick validation

      const img = q('b64i-decode-img');
      img.onerror = () => {
        resEl.style.display = 'none';
        q('b64i-decode-err-msg').textContent = '✕ Could not render image. Check MIME type or data integrity.';
        errEl.style.display = 'block';
      };
      img.onload = () => {
        const b64size = Math.round(b64part.length * 0.75);
        q('b64i-decode-info').textContent =
          `Dimensions: ${img.naturalWidth}×${img.naturalHeight}px · Approx. size: ${fmtBytes(b64size)}`;
        // Set download
        const mimeMatch = dataUrl.match(/data:([^;]+);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const ext  = mime.split('/')[1]?.replace('jpeg','jpg') || 'png';
        q('b64i-decode-dl').onclick = () => {
          const a = document.createElement('a');
          a.href = dataUrl; a.download = `decoded-image.${ext}`; a.click();
        };
      };
      img.src = dataUrl;
      resEl.style.display = 'block';
    } catch (e) {
      q('b64i-decode-err-msg').textContent = '✕ ' + e.message;
      errEl.style.display = 'block';
    }
  }
}