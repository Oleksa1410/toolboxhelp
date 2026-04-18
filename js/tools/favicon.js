export function renderFavicon(el, { notify }) {

  // ── Sizes to generate ──────────────────────────────────────────────────────
  const SIZES = [
    { s: 16,  label: '16×16',   name: 'favicon-16x16.png',   use: 'Browser tab (classic)' },
    { s: 32,  label: '32×32',   name: 'favicon-32x32.png',   use: 'Browser tab (retina)' },
    { s: 48,  label: '48×48',   name: 'favicon-48x48.png',   use: 'Windows taskbar' },
    { s: 64,  label: '64×64',   name: 'favicon-64x64.png',   use: 'Shortcut icon' },
    { s: 96,  label: '96×96',   name: 'favicon-96x96.png',   use: 'Google TV' },
    { s: 128, label: '128×128', name: 'favicon-128x128.png', use: 'Chrome Web Store' },
    { s: 180, label: '180×180', name: 'apple-touch-icon.png',use: 'Apple Touch Icon (iOS)' },
    { s: 192, label: '192×192', name: 'icon-192x192.png',    use: 'Android Chrome / PWA' },
    { s: 256, label: '256×256', name: 'favicon-256x256.png', use: 'Windows tile' },
    { s: 512, label: '512×512', name: 'icon-512x512.png',    use: 'PWA splash screen' },
  ];

  // ── HTML ───────────────────────────────────────────────────────────────────
  el.innerHTML = `
<div class="card">
  <div class="card-hdr">Upload Image</div>
  <!-- Drop zone -->
  <div class="fav-drop" id="fav-drop">
    <div class="fav-drop-icon">🖼</div>
    <div class="fav-drop-text">
      Drag &amp; drop image here or
      <span class="fav-browse" id="fav-browse">browse</span>
    </div>
    <div class="fav-drop-hint">PNG, JPG, JPEG, SVG, WebP · Any size</div>
    <input type="file" id="fav-file" accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif" style="display:none">
  </div>

  <!-- Settings (hidden until image loaded) -->
  <div id="fav-settings" style="display:none;margin-top:18px">
    <div class="row" style="flex-wrap:wrap;gap:14px;align-items:flex-end">
      <div class="field" style="max-width:160px">
        <span class="f-label">BACKGROUND</span>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="color" id="fav-bg-color" value="#ffffff"
            style="width:38px;height:32px;border-radius:5px;border:1px solid var(--border);
                   background:transparent;cursor:pointer;padding:2px">
          <label style="display:flex;align-items:center;gap:6px;font-family:var(--mono);
                 font-size:12px;color:var(--text);cursor:pointer;white-space:nowrap">
            <input type="checkbox" id="fav-transparent" style="accent-color:var(--accent)">
            Transparent
          </label>
        </div>
      </div>
      <div class="field" style="max-width:160px">
        <span class="f-label">PADDING: <span id="fav-pad-val">0</span>%</span>
        <input type="range" id="fav-padding" min="0" max="30" value="0">
      </div>
      <div class="field" style="max-width:180px">
        <span class="f-label">CORNER RADIUS: <span id="fav-radius-val">0</span>%</span>
        <input type="range" id="fav-radius" min="0" max="50" value="0">
      </div>
      <button class="btn btn-blue" id="fav-gen-btn">▶ GENERATE ALL</button>
    </div>
  </div>
</div>

<!-- Source preview -->
<div id="fav-source-wrap" style="display:none" class="card">
  <div class="card-hdr">Source Image</div>
  <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
    <img id="fav-source-img" style="max-width:160px;max-height:160px;border-radius:8px;
      border:1px solid var(--border);background:repeating-conic-gradient(var(--s3) 0% 25%,
      var(--bg) 0% 50%) 0 0/12px 12px">
    <div id="fav-source-info" style="font-family:var(--mono);font-size:12px;color:var(--muted2);line-height:2"></div>
  </div>
</div>

<!-- Results -->
<div id="fav-results" style="display:none">
  <div class="card">
    <div class="card-hdr" style="display:flex;align-items:center;justify-content:space-between">
      <span>Generated Favicons</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-sm btn-blue" id="fav-dl-all-zip">⬇ Download All (ZIP)</button>
        <button class="btn btn-sm" id="fav-dl-ico">⬇ favicon.ico</button>
      </div>
    </div>
    <div class="fav-grid" id="fav-grid"></div>
  </div>

  <!-- HTML Snippet -->
  <div class="card">
    <div class="card-hdr" style="display:flex;align-items:center;justify-content:space-between">
      <span>HTML &lt;head&gt; Snippet</span>
      <button class="btn btn-sm" id="fav-copy-html">⎘ Copy</button>
    </div>
    <pre id="fav-html-snippet"
      style="font-family:var(--mono);font-size:11px;color:var(--text2);
             background:var(--bg);border:1px solid var(--border);border-radius:6px;
             padding:14px;overflow-x:auto;white-space:pre;line-height:1.7;margin:0"></pre>
  </div>
</div>`;

  // ── State ──────────────────────────────────────────────────────────────────
  let sourceImg  = null;
  let canvases   = {};   // size → canvas
  let sourceFile = null;

  const q = id => el.querySelector('#' + id);

  // ── Drop zone ──────────────────────────────────────────────────────────────
  const drop  = q('fav-drop');
  const input = q('fav-file');

  q('fav-browse').addEventListener('click', () => input.click());
  drop.addEventListener('click', () => input.click());

  drop.addEventListener('dragover',  e => { e.preventDefault(); drop.classList.add('fav-drop--over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('fav-drop--over'));
  drop.addEventListener('drop', e => {
    e.preventDefault();
    drop.classList.remove('fav-drop--over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadFile(file);
    else notify('Please select an image file');
  });

  input.addEventListener('change', () => {
    if (input.files[0]) loadFile(input.files[0]);
  });

  // ── Load file ──────────────────────────────────────────────────────────────
  function loadFile(file) {
    sourceFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        sourceImg = img;
        // Source preview
        q('fav-source-img').src = e.target.result;
        q('fav-source-info').innerHTML =
          `File: <span style="color:var(--text2)">${file.name}</span><br>` +
          `Type: <span style="color:var(--text2)">${file.type}</span><br>` +
          `Size: <span style="color:var(--text2)">${(file.size/1024).toFixed(1)} KB</span><br>` +
          `Dimensions: <span style="color:var(--text2)">${img.naturalWidth}×${img.naturalHeight}px</span>`;
        q('fav-source-wrap').style.display = 'block';
        q('fav-settings').style.display = 'block';
        // Auto-generate on load
        generate();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── Settings live preview ──────────────────────────────────────────────────
  q('fav-padding').addEventListener('input',  e => { q('fav-pad-val').textContent = e.target.value; debounceGen(); });
  q('fav-radius').addEventListener('input',   e => { q('fav-radius-val').textContent = e.target.value; debounceGen(); });
  q('fav-bg-color').addEventListener('input', debounceGen);
  q('fav-transparent').addEventListener('change', debounceGen);
  q('fav-gen-btn').addEventListener('click', generate);

  let _debTimer;
  function debounceGen() { clearTimeout(_debTimer); _debTimer = setTimeout(() => { if (sourceImg) generate(); }, 200); }

  // ── Render single canvas ───────────────────────────────────────────────────
  function renderCanvas(size) {
    const canvas  = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const transparent = q('fav-transparent').checked;
    const bgColor     = q('fav-bg-color').value;
    const padding     = parseInt(q('fav-padding').value) / 100;
    const radius      = parseInt(q('fav-radius').value) / 100 * size / 2;

    // Background
    if (!transparent) {
      ctx.fillStyle = bgColor;
      if (radius > 0) {
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, radius);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, size, size);
      }
    }

    // Clip to rounded rect if radius > 0
    if (radius > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.clip();
    }

    // Draw image with padding
    const pad = Math.round(size * padding);
    const dSize = size - pad * 2;

    // Cover or contain — use contain (full image visible)
    const iw = sourceImg.naturalWidth;
    const ih = sourceImg.naturalHeight;
    const ratio = Math.min(dSize / iw, dSize / ih);
    const dw = iw * ratio;
    const dh = ih * ratio;
    const dx = pad + (dSize - dw) / 2;
    const dy = pad + (dSize - dh) / 2;

    ctx.drawImage(sourceImg, dx, dy, dw, dh);

    if (radius > 0) ctx.restore();

    return canvas;
  }

  // ── Generate all ──────────────────────────────────────────────────────────
  function generate() {
    if (!sourceImg) return;

    canvases = {};
    SIZES.forEach(({ s }) => { canvases[s] = renderCanvas(s); });

    renderGrid();
    renderHTMLSnippet();
    q('fav-results').style.display = 'block';
  }

  // ── Preview grid ──────────────────────────────────────────────────────────
  function renderGrid() {
    const grid = q('fav-grid');
    grid.innerHTML = '';

    SIZES.forEach(({ s, label, name, use }) => {
      const canvas = canvases[s];

      const cell = document.createElement('div');
      cell.className = 'fav-cell';

      // Checkerboard bg to show transparency
      const previewWrap = document.createElement('div');
      previewWrap.className = 'fav-preview-bg';
      previewWrap.style.width  = Math.min(s, 64) + 'px';
      previewWrap.style.height = Math.min(s, 64) + 'px';

      const preview = document.createElement('canvas');
      preview.width  = Math.min(s, 64);
      preview.height = Math.min(s, 64);
      preview.style.cssText = 'display:block;image-rendering:pixelated';
      preview.getContext('2d').drawImage(canvas, 0, 0, preview.width, preview.height);
      previewWrap.appendChild(preview);

      const info = document.createElement('div');
      info.className = 'fav-cell-info';
      info.innerHTML =
        `<div class="fav-cell-size">${label}</div>` +
        `<div class="fav-cell-name">${name}</div>` +
        `<div class="fav-cell-use">${use}</div>`;

      const dlBtn = document.createElement('button');
      dlBtn.className = 'btn btn-sm';
      dlBtn.textContent = '⬇ PNG';
      dlBtn.addEventListener('click', () => downloadPNG(canvas, name));

      cell.appendChild(previewWrap);
      cell.appendChild(info);
      cell.appendChild(dlBtn);
      grid.appendChild(cell);
    });
  }

  // ── Download PNG ──────────────────────────────────────────────────────────
  function downloadPNG(canvas, filename) {
    const a = document.createElement('a');
    a.href     = canvas.toDataURL('image/png');
    a.download = filename;
    a.click();
  }

  // ── Download all as ZIP (using JSZip) ─────────────────────────────────────
  q('fav-dl-all-zip').addEventListener('click', async () => {
    if (!Object.keys(canvases).length) { notify('Generate favicons first'); return; }

    const btn = q('fav-dl-all-zip');
    btn.textContent = '⏳ Packing...';
    btn.disabled = true;

    try {
      // Load JSZip dynamically
      if (!window.JSZip) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }

      const zip = new window.JSZip();
      const folder = zip.folder('favicons');

      // Add all PNGs
      for (const { s, name } of SIZES) {
        const dataUrl = canvases[s].toDataURL('image/png');
        const base64  = dataUrl.split(',')[1];
        folder.file(name, base64, { base64: true });
      }

      // Add ICO (16, 32, 48)
      const icoData = buildICO([16, 32, 48]);
      folder.file('favicon.ico', icoData);

      // Add HTML snippet
      folder.file('favicon-snippet.html', q('fav-html-snippet').textContent);

      // Add README
      folder.file('README.txt',
        'Favicon Package — generated by ToolboxHelp.com\n\n' +
        'Files included:\n' +
        SIZES.map(({ name, s, use }) => `  ${name.padEnd(25)} ${s}x${s}  ${use}`).join('\n') +
        '\n  favicon.ico                   Multi-size ICO (16, 32, 48)\n\n' +
        'Usage: See favicon-snippet.html for HTML <head> code.\n'
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = 'favicons.zip';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);

    } catch (e) {
      notify('ZIP error: ' + e.message);
    } finally {
      btn.textContent = '⬇ Download All (ZIP)';
      btn.disabled = false;
    }
  });

  // ── Download ICO ──────────────────────────────────────────────────────────
  q('fav-dl-ico').addEventListener('click', () => {
    if (!Object.keys(canvases).length) { notify('Generate favicons first'); return; }
    const icoData = buildICO([16, 32, 48]);
    const blob = new Blob([icoData], { type: 'image/x-icon' });
    const a = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'favicon.ico';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });

  // ── ICO builder (pure JS) ─────────────────────────────────────────────────
  // ICO format: ICONDIR + ICONDIRENTRYs + PNG data blobs
  function buildICO(sizes) {
    const pngBlobs = sizes.map(s => {
      const dataUrl = canvases[s].toDataURL('image/png');
      const b64 = dataUrl.split(',')[1];
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return arr;
    });

    const count    = sizes.length;
    const headerSz = 6;               // ICONDIR
    const entrySz  = 16;              // ICONDIRENTRY per image
    const dataOffset = headerSz + entrySz * count;

    let totalSize = dataOffset;
    pngBlobs.forEach(b => { totalSize += b.length; });

    const buf  = new ArrayBuffer(totalSize);
    const view = new DataView(buf);
    let pos = 0;

    function w16(v) { view.setUint16(pos, v, true); pos += 2; }
    function w32(v) { view.setUint32(pos, v, true); pos += 4; }
    function w8(v)  { view.setUint8(pos, v);         pos += 1; }

    // ICONDIR
    w16(0);     // reserved
    w16(1);     // type: 1 = ICO
    w16(count); // number of images

    // ICONDIRENTRYs
    let imgOffset = dataOffset;
    pngBlobs.forEach((blob, i) => {
      const s = sizes[i];
      w8(s >= 256 ? 0 : s);  // width  (0 = 256)
      w8(s >= 256 ? 0 : s);  // height (0 = 256)
      w8(0);                  // color count
      w8(0);                  // reserved
      w16(1);                 // color planes
      w16(32);                // bits per pixel
      w32(blob.length);       // size of image data
      w32(imgOffset);         // offset of image data
      imgOffset += blob.length;
    });

    // PNG data
    pngBlobs.forEach(blob => {
      new Uint8Array(buf, pos, blob.length).set(blob);
      pos += blob.length;
    });

    return new Uint8Array(buf);
  }

  // ── HTML Snippet ──────────────────────────────────────────────────────────
  function renderHTMLSnippet() {
    const snippet = [
      '<!-- Favicon: generated by ToolboxHelp.com -->',
      '<link rel="icon" type="image/x-icon"   href="/favicon.ico">',
      '<link rel="icon" type="image/png" sizes="16x16"   href="/favicon-16x16.png">',
      '<link rel="icon" type="image/png" sizes="32x32"   href="/favicon-32x32.png">',
      '<link rel="icon" type="image/png" sizes="96x96"   href="/favicon-96x96.png">',
      '<link rel="apple-touch-icon" sizes="180x180"       href="/apple-touch-icon.png">',
      '<link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png">',
      '<link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png">',
      '',
      '<!-- PWA Manifest (create manifest.json in your root) -->',
      '<link rel="manifest" href="/manifest.json">',
      '',
      '<!-- manifest.json content:',
      '{',
      '  "icons": [',
      '    { "src": "/icon-192x192.png", "sizes": "192x192", "type": "image/png" },',
      '    { "src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png" }',
      '  ]',
      '}',
      '-->',
    ].join('\n');

    q('fav-html-snippet').textContent = snippet;
  }

  q('fav-copy-html').addEventListener('click', () => {
    const text = q('fav-html-snippet').textContent;
    navigator.clipboard.writeText(text).then(() => notify('HTML snippet copied!'));
  });
}