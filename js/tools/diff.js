export function renderDiff(el, { notify }) {
  el.innerHTML = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px" id="diff-inputs">
  <div class="card" style="margin-bottom:0">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0;color:var(--blue)">ОРИГІНАЛ</div>
      <button class="btn btn-sm btn-danger" data-clear="a">✕</button>
    </div>
    <textarea id="diff-a" placeholder="Вставте оригінальний текст..." spellcheck="false"
      style="width:100%;min-height:200px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s">
    </textarea>
  </div>
  <div class="card" style="margin-bottom:0">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-hdr" style="margin-bottom:0;color:var(--amber)">ЗМІНЕНИЙ</div>
      <button class="btn btn-sm btn-danger" data-clear="b">✕</button>
    </div>
    <textarea id="diff-b" placeholder="Вставте змінений текст..." spellcheck="false"
      style="width:100%;min-height:200px;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:10px 12px;color:var(--text2);font-family:var(--mono);
             font-size:12px;outline:none;resize:vertical;line-height:1.7;transition:border-color .12s">
    </textarea>
  </div>
</div>

<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center">
  <button class="btn btn-blue" id="diff-run">▶ ПОРІВНЯТИ</button>
  <button class="btn btn-sm btn-danger" id="diff-clear-all">✕ Очистити все</button>
  <div style="display:flex;align-items:center;gap:8px;margin-left:auto">
    <span class="f-label" style="margin-bottom:0">РЕЖИМ:</span>
    <select id="diff-mode" style="padding:6px 10px;font-size:12px">
      <option value="line"  selected>Рядки</option>
      <option value="word"         >Слова</option>
      <option value="char"         >Символи</option>
    </select>
  </div>
</div>

<!-- Stats bar -->
<div id="diff-stats" style="display:none;margin-bottom:14px">
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <div class="diff-stat-box diff-stat-add" id="stat-add"></div>
    <div class="diff-stat-box diff-stat-del" id="stat-del"></div>
    <div class="diff-stat-box diff-stat-same" id="stat-same"></div>
  </div>
</div>

<!-- Result -->
<div class="card" id="diff-result-card" style="display:none">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
    <div class="card-hdr" style="margin-bottom:0">РЕЗУЛЬТАТ</div>
    <div style="display:flex;gap:6px">
      <span class="diff-legend"><span class="diff-ins-bg">+</span> додано</span>
      <span class="diff-legend"><span class="diff-del-bg">−</span> видалено</span>
    </div>
  </div>
  <div id="diff-output"
    style="font-family:var(--mono);font-size:12px;line-height:1.9;
           background:var(--bg);border:1px solid var(--border);border-radius:6px;
           padding:14px;overflow-x:auto;white-space:pre-wrap;word-break:break-all">
  </div>
</div>`;

  // ── LCS-based diff ────────────────────────────────────────────────────────

  function lcs(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
    // Backtrack
    const result = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i-1] === b[j-1]) {
        result.unshift({ type: 'same', val: a[i-1] }); i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
        result.unshift({ type: 'ins', val: b[j-1] }); j--;
      } else {
        result.unshift({ type: 'del', val: a[i-1] }); i--;
      }
    }
    return result;
  }

  function tokenize(text, mode) {
    if (mode === 'line') return text.split('\n');
    if (mode === 'word') return text.split(/(\s+)/);
    return text.split('');
  }

  function escape(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── Run diff ──────────────────────────────────────────────────────────────

  function runDiff() {
    const textA = el.querySelector('#diff-a').value;
    const textB = el.querySelector('#diff-b').value;
    const mode  = el.querySelector('#diff-mode').value;

    if (!textA && !textB) { notify('Введіть текст у обидва поля'); return; }

    const tokA = tokenize(textA, mode);
    const tokB = tokenize(textB, mode);

    // Limit for performance
    if (tokA.length + tokB.length > 8000) {
      notify('Текст занадто великий, перемкніться в режим "Рядки"');
      return;
    }

    const ops = lcs(tokA, tokB);
    let adds = 0, dels = 0, same = 0;
    let html = '';

    if (mode === 'line') {
      ops.forEach(op => {
        const line = escape(op.val);
        if (op.type === 'same') { same++; html += `<div class="diff-line">${line || '&nbsp;'}</div>`; }
        else if (op.type === 'ins') { adds++; html += `<div class="diff-line diff-ins"><span class="diff-sign">+</span>${line || '&nbsp;'}</div>`; }
        else { dels++; html += `<div class="diff-line diff-del"><span class="diff-sign">−</span>${line || '&nbsp;'}</div>`; }
      });
    } else {
      ops.forEach(op => {
        const tok = escape(op.val);
        if (op.type === 'same') { same++; html += tok; }
        else if (op.type === 'ins') { adds++; html += `<mark class="diff-ins-inline">${tok}</mark>`; }
        else { dels++; html += `<mark class="diff-del-inline">${tok}</mark>`; }
      });
    }

    el.querySelector('#diff-output').innerHTML = html;
    el.querySelector('#diff-result-card').style.display = 'block';

    // Stats
    el.querySelector('#diff-stats').style.display = 'block';
    el.querySelector('#stat-add').textContent  = `+${adds} додано`;
    el.querySelector('#stat-del').textContent  = `−${dels} видалено`;
    el.querySelector('#stat-same').textContent = `=${same} без змін`;
  }

  el.querySelector('#diff-run').addEventListener('click', runDiff);
  el.querySelector('#diff-clear-all').addEventListener('click', () => {
    ['diff-a','diff-b'].forEach(id => { el.querySelector('#'+id).value = ''; });
    el.querySelector('#diff-result-card').style.display = 'none';
    el.querySelector('#diff-stats').style.display = 'none';
  });

  el.querySelectorAll('[data-clear]').forEach(btn => {
    btn.addEventListener('click', () => { el.querySelector('#diff-' + btn.dataset.clear).value = ''; });
  });

  // Ctrl+Enter
  ['diff-a','diff-b'].forEach(id => {
    el.querySelector('#'+id).addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey) runDiff(); });
  });

  // Responsive grid
  if (window.innerWidth <= 768) {
    el.querySelector('#diff-inputs').style.gridTemplateColumns = '1fr';
  }
}