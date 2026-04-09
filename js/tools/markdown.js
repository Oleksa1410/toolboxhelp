export function renderMarkdown(el, { copyText, notify }) {
  el.innerHTML = `
<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center">
  <button class="btn btn-blue" id="md-tab-split">⊟ Split</button>
  <button class="btn"          id="md-tab-edit">✎ Edit</button>
  <button class="btn"          id="md-tab-preview">👁 Preview</button>
  <div style="margin-left:auto;display:flex;gap:6px">
    <button class="btn btn-sm" id="md-copy-md">⎘ MD</button>
    <button class="btn btn-sm" id="md-copy-html">⎘ HTML</button>
    <button class="btn btn-sm btn-danger" id="md-clear">✕</button>
  </div>
</div>

<div id="md-container" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;min-height:420px">
  <div id="md-editor-wrap" style="display:flex;flex-direction:column">
    <div class="card-hdr" style="margin-bottom:6px">MARKDOWN</div>
    <textarea id="md-input" spellcheck="false"
      style="flex:1;min-height:400px;width:100%;background:var(--bg);border:1px solid var(--border);
             border-radius:6px;padding:14px;color:var(--text2);font-family:var(--mono);
             font-size:13px;outline:none;resize:vertical;line-height:1.8;
             tab-size:2;transition:border-color .12s">
    </textarea>
  </div>
  <div id="md-preview-wrap" style="display:flex;flex-direction:column">
    <div class="card-hdr" style="margin-bottom:6px">PREVIEW</div>
    <div id="md-preview"
      style="flex:1;min-height:400px;background:var(--s1);border:1px solid var(--border);
             border-radius:6px;padding:20px;overflow-y:auto;line-height:1.8">
    </div>
  </div>
</div>

<!-- Toolbar -->
<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:10px" id="md-toolbar">
  ${[
    ['B','**текст**','жирний'],['I','*текст*','курсив'],['~~','~~текст~~','закреслений'],
    ['H1','# ','заголовок 1'],['H2','## ','заголовок 2'],['H3','### ','заголовок 3'],
    ['`','`код`','inline code'],['```','```\nкод\n```','блок коду'],
    ['🔗','[текст](url)','посилання'],['🖼','![alt](url)','зображення'],
    ['—','---','горизонтальна лінія'],['> ','> текст','цитата'],
    ['• ','- елемент','список'],['1.','1. елемент','нумерований список'],
  ].map(([l, v, title]) =>
    `<button class="btn btn-sm md-fmt" data-val="${v.replace(/"/g,'&quot;')}" title="${title}"
      style="font-family:var(--mono);font-size:11px;min-width:36px">${l}</button>`
  ).join('')}
</div>`;

  const q = id => el.querySelector('#' + id);
  let viewMode = 'split';

  // ── Simple Markdown parser ─────────────────────────────────────────────────
  function parseMarkdown(md) {
    let html = md
      // Escape HTML
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      // Code blocks (before inline)
      .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="md-code-block"><code${lang ? ` class="lang-${lang}"` : ''}>${code.trim()}</code></pre>`)
      // Headings
      .replace(/^###### (.+)$/gm,'<h6>$1</h6>')
      .replace(/^##### (.+)$/gm,'<h5>$1</h5>')
      .replace(/^#### (.+)$/gm,'<h4>$1</h4>')
      .replace(/^### (.+)$/gm,'<h3>$1</h3>')
      .replace(/^## (.+)$/gm,'<h2>$1</h2>')
      .replace(/^# (.+)$/gm,'<h1>$1</h1>')
      // HR
      .replace(/^---$/gm,'<hr>')
      .replace(/^\*\*\*$/gm,'<hr>')
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/__(.+?)__/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/_(.+?)_/g,'<em>$1</em>')
      // Strikethrough
      .replace(/~~(.+?)~~/g,'<del>$1</del>')
      // Inline code
      .replace(/`([^`]+)`/g,'<code class="md-inline-code">$1</code>')
      // Images before links
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" style="max-width:100%;border-radius:6px">')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener" style="color:var(--blue)">$1</a>')
      // Blockquote
      .replace(/^&gt; (.+)$/gm,'<blockquote class="md-quote">$1</blockquote>')
      // Unordered lists
      .replace(/^[\*\-] (.+)$/gm,'<li class="md-li-ul">$1</li>')
      .replace(/(<li class="md-li-ul">[\s\S]*?<\/li>)(\n(?!<li class="md-li-ul">)|$)/g,'$1</ul-group>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm,'<li class="md-li-ol">$1</li>')
      // Tables
      .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
        const ths = header.split('|').filter(s=>s.trim()).map(s=>`<th>${s.trim()}</th>`).join('');
        const trs = body.trim().split('\n').map(row => {
          const tds = row.split('|').filter(s=>s.trim()).map(s=>`<td>${s.trim()}</td>`).join('');
          return `<tr>${tds}</tr>`;
        }).join('');
        return `<table class="md-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
      })
      // Paragraphs — wrap lines not already wrapped
      .replace(/^(?!<[hH\d]|<pre|<blockquote|<hr|<li|<ul|<ol|<table|<img)(.+)$/gm, '<p>$1</p>')
      // Fix list groups
      .replace(/(<li class="md-li-ul">[\s\S]*?)(<\/ul-group>|(?=<(?!li)))/g, (m) =>
        `<ul style="padding-left:20px;margin:6px 0">${m.replace(/<\/?ul-group>/g,'')}</ul>`)
      .replace(/(<li class="md-li-ol">[\s\S]*?)(?=<(?!li)|$)/g, (m) =>
        `<ol style="padding-left:20px;margin:6px 0">${m}</ol>`);

    return html;
  }

  function updatePreview() {
    const md  = q('md-input').value;
    const out = q('md-preview');
    out.innerHTML = md.trim() ? parseMarkdown(md) : '<span style="color:var(--muted);font-family:var(--mono);font-size:12px">Введіть Markdown ліворуч...</span>';
  }

  // ── Tabs ───────────────────────────────────────────────────────────────────
  function setView(mode) {
    viewMode = mode;
    const container = q('md-container');
    const edWrap    = q('md-editor-wrap');
    const prWrap    = q('md-preview-wrap');
    q('md-tab-split').className   = 'btn ' + (mode === 'split'   ? 'btn-blue' : '');
    q('md-tab-edit').className    = 'btn ' + (mode === 'edit'    ? 'btn-blue' : '');
    q('md-tab-preview').className = 'btn ' + (mode === 'preview' ? 'btn-blue' : '');

    if (mode === 'split') {
      container.style.gridTemplateColumns = '1fr 1fr';
      edWrap.style.display = ''; prWrap.style.display = '';
    } else if (mode === 'edit') {
      container.style.gridTemplateColumns = '1fr';
      edWrap.style.display = ''; prWrap.style.display = 'none';
    } else {
      container.style.gridTemplateColumns = '1fr';
      edWrap.style.display = 'none'; prWrap.style.display = '';
      updatePreview();
    }
  }

  q('md-tab-split').addEventListener('click',   () => setView('split'));
  q('md-tab-edit').addEventListener('click',    () => setView('edit'));
  q('md-tab-preview').addEventListener('click', () => setView('preview'));

  // ── Toolbar ────────────────────────────────────────────────────────────────
  el.querySelectorAll('.md-fmt').forEach(btn => {
    btn.addEventListener('click', () => {
      const ta  = q('md-input');
      const val = btn.dataset.val;
      const s   = ta.selectionStart, e = ta.selectionEnd;
      const sel = ta.value.slice(s, e);
      let insert = val.includes('текст') && sel
        ? val.replace('текст', sel)
        : val;
      ta.setRangeText(insert, s, e, 'end');
      ta.focus();
      updatePreview();
    });
  });

  // ── Tab key ────────────────────────────────────────────────────────────────
  q('md-input').addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target, s = ta.selectionStart;
      ta.setRangeText('  ', s, s, 'end');
    }
  });

  // ── Live preview ───────────────────────────────────────────────────────────
  q('md-input').addEventListener('input', updatePreview);

  // ── Buttons ────────────────────────────────────────────────────────────────
  q('md-copy-md').addEventListener('click', () => {
    const v = q('md-input').value;
    if (!v.trim()) { notify('Немає вмісту'); return; }
    copyText(v, 'Markdown');
  });
  q('md-copy-html').addEventListener('click', () => {
    const v = q('md-input').value;
    if (!v.trim()) { notify('Немає вмісту'); return; }
    copyText(parseMarkdown(v), 'HTML');
  });
  q('md-clear').addEventListener('click', () => {
    q('md-input').value = '';
    updatePreview();
  });

  // ── Default content ────────────────────────────────────────────────────────
  q('md-input').value = `# Заголовок першого рівня

## Заголовок другого рівня

Це **жирний текст**, а це *курсив*.
~~Закреслений текст~~ і \`inline code\`.

### Список

- Пункт один
- Пункт два
- Пункт три

### Нумерований список

1. Перший
2. Другий
3. Третій

### Цитата

> Це цитата. Вона виділяється лівою смугою.

### Код

\`\`\`javascript
function hello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Посилання та зображення

[ToolboxHelp.com](https://toolboxhelp.com)

### Таблиця

| Назва | Тип | Значення |
|-------|-----|----------|
| Колір | string | #18e070 |
| Число | number | 42 |
| Флаг | boolean | true |

---

*Редагуй зліва — результат оновлюється в реальному часі →*`;

  updatePreview();

  // Responsive
  if (window.innerWidth <= 768) setView('edit');
}
