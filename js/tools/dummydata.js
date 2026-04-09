export function renderDummyData(el, { copyText, notify }) {
  // ── Data pools ──────────────────────────────────────────────────────────────
  const FIRST_M = ['Oliver','James','William','Benjamin','Lucas','Henry','Alexander','Mason','Ethan','Daniel','Noah','Liam','Logan','Jackson','Aiden','Sebastian','Mateo','Jack','Owen','Samuel'];
  const FIRST_F = ['Emma','Olivia','Sophia','Isabella','Charlotte','Amelia','Mia','Harper','Evelyn','Abigail','Emily','Elizabeth','Sofia','Avery','Ella','Scarlett','Grace','Victoria','Riley','Aria'];
  const LAST    = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Martinez','Wilson','Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','Thompson','White','Harris'];
  const DOMAINS = ['gmail.com','yahoo.com','outlook.com','icloud.com','proton.me','fastmail.com','hey.com','zoho.com'];
  const STREETS = ['Main St','Oak Ave','Maple Dr','Cedar Ln','Pine Rd','Elm St','Washington Blvd','Park Ave','Lake View Dr','Sunset Blvd','River Rd','Hill St','Forest Way','Highland Ave','Valley Rd'];
  const CITIES  = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte'];
  const STATES  = ['NY','CA','IL','TX','AZ','PA','TX','CA','TX','CA','TX','FL','TX','OH','NC'];
  const TLDS    = ['.com','.net','.org','.io','.dev','.app','.co'];
  const JOBS    = ['Software Engineer','Product Manager','UX Designer','Data Analyst','DevOps Engineer','Frontend Developer','Backend Developer','Full Stack Developer','QA Engineer','Tech Lead','CTO','CEO','Marketing Manager','Sales Rep','HR Manager'];
  const COMPANIES = ['TechCorp','DataSoft','WebFlow','CloudBase','DevHouse','Innovate Inc','Digital Works','CodeLab','NextGen Tech','SoftWave','ByteWorks','PixelForge','AppMint','CloudSeed','NetBridge'];
  const UA_FIRST_M = ['Олександр','Михайло','Іван','Дмитро','Андрій','Сергій','Максим','Олег','Тарас','Богдан','Василь','Юрій','Роман','Віктор','Павло'];
  const UA_FIRST_F = ['Олена','Наталія','Марія','Юлія','Оксана','Тетяна','Ірина','Людмила','Ганна','Катерина','Вікторія','Світлана','Валентина','Лариса','Надія'];
  const UA_LAST   = ['Шевченко','Бондаренко','Коваленко','Кравченко','Ткаченко','Мельник','Лисенко','Павленко','Савченко','Олійник','Шаповаленко','Гриценко','Яременко','Іваненко','Марченко'];

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const pick  = arr => arr[Math.floor(Math.random() * arr.length)];
  const rnd   = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pad   = (n, d = 2) => String(n).padStart(d, '0');

  function randDate(fromYear = 1960, toYear = 2000) {
    const y = rnd(fromYear, toYear), m = rnd(1, 12), d = rnd(1, 28);
    return `${y}-${pad(m)}-${pad(d)}`;
  }
  function randPhone() {
    return `+1 (${rnd(200,999)}) ${rnd(200,999)}-${pad(rnd(0,9999), 4)}`;
  }
  function randIP() {
    return [rnd(1,254), rnd(0,255), rnd(0,255), rnd(1,254)].join('.');
  }
  function randColor() {
    return '#' + Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0');
  }
  function randUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0;
      return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
  }
  function slug(name) {
    return name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  }

  function generateUser(lang) {
    const female = Math.random() > 0.5;
    const fn = lang === 'ua'
      ? (female ? pick(UA_FIRST_F) : pick(UA_FIRST_M))
      : (female ? pick(FIRST_F)   : pick(FIRST_M));
    const ln = lang === 'ua' ? pick(UA_LAST) : pick(LAST);
    const emailName = (fn + '.' + ln).toLowerCase()
      .replace(/[^a-z0-9.]/g, x => x.charCodeAt(0).toString(16));
    const company = pick(COMPANIES);
    const streetNum = rnd(1, 9999);
    const zip = pad(rnd(10000,99999), 5);
    const stateIdx = Math.floor(Math.random() * CITIES.length);
    return {
      id:        randUUID(),
      firstName: fn,
      lastName:  ln,
      gender:    female ? 'female' : 'male',
      email:     emailName + '@' + pick(DOMAINS),
      phone:     randPhone(),
      birthday:  randDate(1960, 2003),
      age:       new Date().getFullYear() - parseInt(randDate(1960,2003).slice(0,4)),
      company:   company,
      website:   'https://www.' + slug(company) + pick(TLDS),
      job:       pick(JOBS),
      address: {
        street:  streetNum + ' ' + pick(STREETS),
        city:    CITIES[stateIdx],
        state:   STATES[stateIdx],
        zip,
        country: 'US',
      },
      ip:        randIP(),
      avatar:    `https://i.pravatar.cc/150?u=${Math.random()}`,
      color:     randColor(),
    };
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  el.innerHTML = `
<div class="card">
  <div class="card-hdr">параметри генерації</div>
  <div class="row" style="align-items:flex-end;flex-wrap:wrap;gap:12px">
    <div class="field" style="max-width:130px">
      <span class="f-label">КІЛЬКІСТЬ</span>
      <input type="number" id="dd-count" value="5" min="1" max="50">
    </div>
    <div class="field" style="max-width:160px">
      <span class="f-label">ФОРМАТ ВИВОДУ</span>
      <select id="dd-format">
        <option value="card">Картки</option>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="table">Таблиця</option>
      </select>
    </div>
    <div class="field" style="max-width:160px">
      <span class="f-label">МОВА ІМЕН</span>
      <select id="dd-lang">
        <option value="en">English</option>
        <option value="ua">Українська</option>
      </select>
    </div>
    <button class="btn btn-blue" id="dd-gen">↺ ГЕНЕРУВАТИ</button>
  </div>
</div>

<div id="dd-output-wrap" style="display:none">
  <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
    <button class="btn btn-sm" id="dd-copy-all">⎘ Копіювати все</button>
    <button class="btn btn-sm btn-danger" id="dd-clear">✕ Очистити</button>
  </div>
  <div id="dd-output"></div>
</div>`;

  const q = id => el.querySelector('#' + id);
  let lastData = [];

  function renderCards(users) {
    return users.map(u => `
      <div class="card" style="margin-bottom:10px">
        <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">
          <img src="${u.avatar}" alt="" width="56" height="56"
            style="border-radius:50%;border:2px solid var(--border);flex-shrink:0;background:var(--s3)"
            onerror="this.style.display='none'">
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:600;color:var(--text2);margin-bottom:2px">
              ${u.firstName} ${u.lastName}
              <span style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-left:8px">${u.gender}</span>
            </div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--muted2);line-height:2">
              <span style="color:var(--accent)">✉</span> ${u.email} &nbsp;
              <span style="color:var(--blue)">☎</span> ${u.phone}<br>
              <span style="color:var(--amber)">🏢</span> ${u.job} @ ${u.company}<br>
              <span style="color:var(--muted)">📍</span> ${u.address.street}, ${u.address.city}, ${u.address.state} ${u.address.zip}<br>
              <span style="color:var(--muted)">🎂</span> ${u.birthday} &nbsp;
              <span style="color:var(--muted)">🌐</span> ${u.website} &nbsp;
              <span style="color:var(--muted)">🔑</span> <span style="font-size:10px">${u.id}</span>
            </div>
          </div>
        </div>
      </div>`).join('');
  }

  function renderJSON(users) {
    const json = JSON.stringify(users, null, 2);
    return `<pre style="background:var(--bg);border:1px solid var(--border);border-radius:6px;
      padding:14px;font-family:var(--mono);font-size:11px;color:var(--text2);
      overflow-x:auto;white-space:pre;max-height:500px;overflow-y:auto">${json}</pre>`;
  }

  function renderCSV(users) {
    const headers = ['id','firstName','lastName','gender','email','phone','birthday','company','job','website','street','city','state','zip','ip'];
    const rows = users.map(u => [
      u.id, u.firstName, u.lastName, u.gender, u.email, u.phone, u.birthday,
      u.company, u.job, u.website, u.address.street, u.address.city, u.address.state, u.address.zip, u.ip,
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    return `<pre style="background:var(--bg);border:1px solid var(--border);border-radius:6px;
      padding:14px;font-family:var(--mono);font-size:11px;color:var(--text2);
      overflow-x:auto;white-space:pre;max-height:400px;overflow-y:auto">${csv}</pre>`;
  }

  function renderTable(users) {
    const cols = ['Ім\'я','Email','Телефон','Компанія','Посада','Місто'];
    return `<div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:11px">
        <thead>
          <tr style="border-bottom:2px solid var(--border2)">
            ${cols.map(c => `<th style="padding:8px 10px;text-align:left;color:var(--accent);white-space:nowrap;letter-spacing:1px;font-size:9px">${c.toUpperCase()}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr style="border-bottom:1px solid var(--border)">
              <td style="padding:8px 10px;color:var(--text2);white-space:nowrap">${u.firstName} ${u.lastName}</td>
              <td style="padding:8px 10px;color:var(--blue)">${u.email}</td>
              <td style="padding:8px 10px;color:var(--text);white-space:nowrap">${u.phone}</td>
              <td style="padding:8px 10px;color:var(--text)">${u.company}</td>
              <td style="padding:8px 10px;color:var(--muted2)">${u.job}</td>
              <td style="padding:8px 10px;color:var(--text);white-space:nowrap">${u.address.city}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  function generate() {
    const count  = Math.min(50, Math.max(1, parseInt(q('dd-count').value) || 5));
    const format = q('dd-format').value;
    const lang   = q('dd-lang').value;
    lastData = Array.from({ length: count }, () => generateUser(lang));

    let html = '';
    if (format === 'card')  html = renderCards(lastData);
    if (format === 'json')  html = renderJSON(lastData);
    if (format === 'csv')   html = renderCSV(lastData);
    if (format === 'table') html = renderTable(lastData);

    q('dd-output').innerHTML = html;
    q('dd-output-wrap').style.display = 'block';
  }

  q('dd-gen').addEventListener('click', generate);

  q('dd-copy-all').addEventListener('click', () => {
    if (!lastData.length) { notify('Спочатку згенеруйте дані'); return; }
    const format = q('dd-format').value;
    let text = '';
    if (format === 'json') text = JSON.stringify(lastData, null, 2);
    else if (format === 'csv') {
      const headers = ['id','firstName','lastName','gender','email','phone','birthday','company','job','website','street','city','state','zip','ip'];
      const rows = lastData.map(u => [u.id,u.firstName,u.lastName,u.gender,u.email,u.phone,u.birthday,u.company,u.job,u.website,u.address.street,u.address.city,u.address.state,u.address.zip,u.ip].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
      text = [headers.join(','),...rows].join('\n');
    } else {
      text = lastData.map(u => `${u.firstName} ${u.lastName} | ${u.email} | ${u.phone} | ${u.job} @ ${u.company}`).join('\n');
    }
    copyText(text, `${lastData.length} записів`);
  });

  q('dd-clear').addEventListener('click', () => {
    q('dd-output-wrap').style.display = 'none';
    lastData = [];
  });

  generate();
}
