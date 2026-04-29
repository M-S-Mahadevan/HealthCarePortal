initLayout({ title: 'Admin' });

const els = {
  registerForm: document.getElementById('registerForm'),
  loginForm: document.getElementById('loginForm'),
  registerStatus: document.getElementById('registerStatus'),
  loginStatus: document.getElementById('loginStatus'),
  dashStatus: document.getElementById('dashStatus'),
  countRow: document.getElementById('countRow'),
  latestTbody: document.getElementById('latestAppointmentsTbody'),

  regName: document.getElementById('regName'),
  regEmail: document.getElementById('regEmail'),
  regPassword: document.getElementById('regPassword'),

  loginEmail: document.getElementById('loginEmail'),
  loginPassword: document.getElementById('loginPassword'),

  btnLoadDashboard: document.getElementById('btnLoadDashboard'),
  btnLogout2: document.getElementById('btnLogout2')
};

function renderCounts(counts) {
  const cards = [
    { label: 'Patients', value: counts.patients },
    { label: 'Doctors', value: counts.doctors },
    { label: 'Appointments', value: counts.appointments },
    { label: 'Consultations', value: counts.consultations },
    { label: 'Prescriptions', value: counts.prescriptions }
  ];

  els.countRow.innerHTML = cards
    .map(
      (c) => `<div class="card" style="flex: 1 1 180px;">
        <div class="card-body">
          <div class="hint">${escapeHtml(c.label)}</div>
          <div style="font-size: 28px; font-weight: 800; margin-top: 6px;">${escapeHtml(c.value)}</div>
        </div>
      </div>`
    )
    .join('');
}

function statusPill(status) {
  const cls = ['pill', status].join(' ');
  return `<span class="${cls}">${escapeHtml(status)}</span>`;
}

function renderLatestAppointments(items) {
  els.latestTbody.innerHTML = items
    .map((a) => {
      const created = a.createdAt ? new Date(a.createdAt).toLocaleString() : '—';
      const when = formatDateTime(a.appointmentDate, a.appointmentTime);
      const patient = a.patientId?.fullName || '—';
      const doctor = a.doctorId ? `${a.doctorId.fullName} (${a.doctorId.specialization})` : '—';
      return `<tr>
        <td>${escapeHtml(created)}</td>
        <td>${escapeHtml(when)}</td>
        <td>${escapeHtml(patient)}</td>
        <td>${escapeHtml(doctor)}</td>
        <td>${statusPill(a.status)}</td>
      </tr>`;
    })
    .join('');
}

async function loadDashboard() {
  clearStatus(els.dashStatus);
  setStatus(els.dashStatus, { type: 'warn', message: 'Loading dashboard…' });
  try {
    const res = await api.admin.dashboard();
    renderCounts(res.data.counts);
    renderLatestAppointments(res.data.latestAppointments || []);
    setStatus(els.dashStatus, { type: 'ok', message: 'Dashboard loaded successfully' });
  } catch (e) {
    setStatus(els.dashStatus, { type: 'err', message: e.message });
  }
}

els.registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearStatus(els.registerStatus);
  setStatus(els.registerStatus, { type: 'warn', message: 'Registering…' });
  try {
    const res = await api.register({
      name: els.regName.value.trim(),
      email: els.regEmail.value.trim(),
      password: els.regPassword.value
    });
    api.token.set(res.token);
    setStatus(els.registerStatus, { type: 'ok', message: 'Registered and logged in (token saved).' });
  } catch (err) {
    setStatus(els.registerStatus, { type: 'err', message: err.message });
  }
});

els.loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearStatus(els.loginStatus);
  setStatus(els.loginStatus, { type: 'warn', message: 'Logging in…' });
  try {
    const res = await api.login({
      email: els.loginEmail.value.trim(),
      password: els.loginPassword.value
    });
    api.token.set(res.token);
    setStatus(els.loginStatus, { type: 'ok', message: 'Login successful (token saved).' });
  } catch (err) {
    setStatus(els.loginStatus, { type: 'err', message: err.message });
  }
});

els.btnLoadDashboard.addEventListener('click', loadDashboard);
els.btnLogout2.addEventListener('click', () => {
  api.token.clear();
  setStatus(els.loginStatus, { type: 'ok', message: 'Logged out (token removed).' });
});

setStatus(els.dashStatus, {
  type: 'warn',
  message: 'Login first, then click “Load Dashboard”.'
});

