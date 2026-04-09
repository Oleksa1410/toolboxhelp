export function renderTextCount(el) {
  el.innerHTML = `
<div class="card">
  <div class="card-hdr">введіть або вставте текст</div>
  <textarea id="tc-input" placeholder="Вставте сюди ваш текст..."
    style="width:100%;min-height:200px;background:var(--bg);border:1px solid var(--border);
    border-radius:6px;padding:12px 14px;color:var(--text2);font-family:var(--mono);
    font-size:14px;outline:none;resize:vertical;transition:border-color .12s;line-height:1.7"></textarea>
  <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
    <button class="btn btn-danger btn-sm" id="tc-clear">✕ ОЧИСТИТИ</button>
    <button class="btn btn-sm" id="tc-paste">⎘ ВСТАВИТИ</button>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;margin-bottom:14px" id="tc-stats"></div>
<div class="card">
  <div class="card-hdr">деталі</div>
  <div id="tc-detail" style="font-family:var(--mono);font-size:13px;color:var(--muted2);line-height:2.2"></div>
</div>`;

  const q = id => el.querySelector('#' + id);

  function stat(label, val, accent) {
    return `<div style="background:var(--s1);border:1px solid ${accent ? 'var(--accent)' : 'var(--border)'};border-radius:8px;padding:16px 18px">
      <div style="font-family:var(--mono);font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:${accent ? 'var(--accent)' : 'var(--muted)'};margin-bottom:6px">${label}</div>
      <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--text2);letter-spacing:-0.5px">${val}</div>
    </div>`;
  }

  function calc() {
    const text = q('tc-input').value;
    const withSpaces = text.length;
    const noSpaces   = text.replace(/\s/g, '').length;
    const words      = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lines      = text === '' ? 0 : text.split(/\n/).length;
    const sentences  = text.trim() === '' ? 0 : (text.match(/[.!?…]+/g) || []).length;
    const paragraphs = text.trim() === '' ? 0 : (text.split(/\n\s*\n/).filter(p => p.trim() !== '').length || 1);
    const unique     = text.trim() === '' ? 0 : new Set(text.trim().toLowerCase().split(/\s+/)).size;
    const avgWord    = words > 0 ? (noSpaces / words).toFixed(1) : 0;

    q('tc-stats').innerHTML =
      stat('Символи з пробілами',  withSpaces, true)  +
      stat('Символи без пробілів', noSpaces,   true)  +
      stat('Слова',      words,      false) +
      stat('Рядки',      lines,      false) +
      stat('Речення',    sentences,  false) +
      stat('Параграфи',  paragraphs, false);

    q('tc-detail').innerHTML =
      `<span style="color:var(--muted)">Унікальних слів:</span> <span style="color:var(--text2)">${unique}</span><br>` +
      `<span style="color:var(--muted)">Сер. довжина слова:</span> <span style="color:var(--text2)">${avgWord} символів</span><br>` +
      `<span style="color:var(--muted)">Пробілів:</span> <span style="color:var(--text2)">${withSpaces - noSpaces}</span><br>` +
      `<span style="color:var(--muted)">Цифр:</span> <span style="color:var(--text2)">${(text.match(/[0-9]/g) || []).length}</span><br>` +
      `<span style="color:var(--muted)">Спец. символів:</span> <span style="color:var(--text2)">${(text.match(/[^a-zA-Zа-яА-ЯіІїЇєЄ0-9\s]/g) || []).length}</span>`;
  }

  q('tc-input').addEventListener('input', calc);
  q('tc-clear').addEventListener('click', () => { q('tc-input').value = ''; calc(); });
  q('tc-paste').addEventListener('click', () => {
    navigator.clipboard.readText().then(t => { q('tc-input').value = t; calc(); });
  });
  calc();
}
