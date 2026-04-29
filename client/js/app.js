function $(sel) {
  return document.querySelector(sel);
}

function setStatus(el, { type = 'info', message = '' } = {}) {
  if (!el) return;
  el.className = 'status show';
  if (type === 'ok') el.classList.add('ok');
  if (type === 'err') el.classList.add('err');
  if (type === 'warn') el.classList.add('warn');
  el.textContent = message;
}

function clearStatus(el) {
  if (!el) return;
  el.className = 'status';
  el.textContent = '';
}

function formatDateTime(dateStr, timeStr) {
  const d = dateStr ? dateStr : '';
  const t = timeStr ? timeStr : '';
  return `${d} ${t}`.trim();
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getPageName() {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  return file;
}

function renderSidebar(activeFile) {
  const container = $('#sidebar');
  if (!container) return;

  const links = [
    { href: 'index.html', label: 'Home', tag: 'Public' },
    { href: 'patients.html', label: 'Patients', tag: 'CRUD' },
    { href: 'doctors.html', label: 'Doctors', tag: 'CRUD' },
    { href: 'appointments.html', label: 'Appointments', tag: 'Booking' },
    { href: 'consultations.html', label: 'Consultations', tag: 'Linked' },
    { href: 'prescriptions.html', label: 'Prescriptions', tag: 'Linked' },
    { href: 'admin.html', label: 'Admin', tag: 'JWT' }
  ];

  const items = links
    .map((l) => {
      const active = l.href === activeFile ? 'active' : '';
      return `<a class="${active}" href="${l.href}">
        <span>${escapeHtml(l.label)}</span>
        <span class="tag">${escapeHtml(l.tag)}</span>
      </a>`;
    })
    .join('');

  container.innerHTML = `
    <div class="sidebar">
      <div class="brand">
        <div class="brand-badge">MA</div>
        <div>
          <h1>MedAssistant</h1>
          <p>College project • Vanilla JS + Express</p>
        </div>
      </div>
      <nav class="nav">${items}</nav>
      <div style="margin-top:14px; padding: 12px; border-radius: 12px; border: 1px solid var(--line); background: rgba(255,255,255,0.03);">
        <div class="hint">Admin token</div>
        <div id="tokenState" class="pill" style="margin-top:8px;">Checking…</div>
        <div class="row" style="margin-top:10px;">
          <button id="btnLogout" class="btn small danger" type="button">Logout</button>
        </div>
        <div class="hint" style="margin-top:8px;">Only the dashboard uses JWT right now.</div>
      </div>
    </div>
  `;

  const tokenState = $('#tokenState');
  const btnLogout = $('#btnLogout');

  const token = api.token.get();
  tokenState.textContent = token ? 'Logged in (JWT saved)' : 'Not logged in';
  tokenState.classList.add(token ? 'approved' : 'pending');

  btnLogout.addEventListener('click', () => {
    api.token.clear();
    location.href = 'admin.html';
  });
}

function initLayout({ title }) {
  const page = getPageName();
  renderSidebar(page);
  const topTitle = $('#pageTitle');
  if (topTitle) topTitle.textContent = title || 'MedAssistant';
}

function $(sel) {
  return document.querySelector(sel);
}

function setStatus(el, { type = 'info', message = '' } = {}) {
  if (!el) return;
  el.className = 'status show';
  if (type === 'ok') el.classList.add('ok');
  if (type === 'err') el.classList.add('err');
  if (type === 'warn') el.classList.add('warn');
  el.textContent = message;
}

function clearStatus(el) {
  if (!el) return;
  el.className = 'status';
  el.textContent = '';
}

function formatDateTime(dateStr, timeStr) {
  const d = dateStr ? dateStr : '';
  const t = timeStr ? timeStr : '';
  return `${d} ${t}`.trim();
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getPageName() {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  return file;
}

function renderSidebar(activeFile) {
  const container = $('#sidebar');
  if (!container) return;

  const links = [
    { href: 'index.html', label: 'Home', tag: 'Public' },
    { href: 'patients.html', label: 'Patients', tag: 'CRUD' },
    { href: 'doctors.html', label: 'Doctors', tag: 'CRUD' },
    { href: 'appointments.html', label: 'Appointments', tag: 'Booking' },
    { href: 'consultations.html', label: 'Consultations', tag: 'Linked' },
    { href: 'prescriptions.html', label: 'Prescriptions', tag: 'Linked' },
    { href: 'admin.html', label: 'Admin', tag: 'JWT' }
  ];

  const items = links
    .map((l) => {
      const active = l.href === activeFile ? 'active' : '';
      return `<a class="${active}" href="${l.href}">
        <span>${escapeHtml(l.label)}</span>
        <span class="tag">${escapeHtml(l.tag)}</span>
      </a>`;
    })
    .join('');

  container.innerHTML = `
    <div class="sidebar">
      <div class="brand">
        <div class="brand-badge">IH</div>
        <div>
          <h1>Integrated Health Care Portal</h1>
          <p>College project • Vanilla JS + Express</p>
        </div>
      </div>
      <nav class="nav">${items}</nav>
      <div style="margin-top:14px; padding: 12px; border-radius: 12px; border: 1px solid var(--line); background: rgba(255,255,255,0.03);">
        <div class="hint">Admin token</div>
        <div id="tokenState" class="pill" style="margin-top:8px;">Checking…</div>
        <div class="row" style="margin-top:10px;">
          <button id="btnLogout" class="btn small danger" type="button">Logout</button>
        </div>
        <div class="hint" style="margin-top:8px;">Only the dashboard uses JWT right now.</div>
      </div>
    </div>
  `;

  const tokenState = $('#tokenState');
  const btnLogout = $('#btnLogout');

  const token = api.token.get();
  tokenState.textContent = token ? 'Logged in (JWT saved)' : 'Not logged in';
  tokenState.classList.add(token ? 'approved' : 'pending');

  btnLogout.addEventListener('click', () => {
    api.token.clear();
    location.href = 'admin.html';
  });
}

function initLayout({ title }) {
  const page = getPageName();
  renderSidebar(page);
  const topTitle = $('#pageTitle');
  if (topTitle) topTitle.textContent = title || 'Integrated Health Care Portal';
}

