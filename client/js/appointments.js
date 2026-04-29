initLayout({ title: 'Appointments' });

const els = {
  form: document.getElementById('appointmentForm'),
  formStatus: document.getElementById('formStatus'),
  listStatus: document.getElementById('listStatus'),
  tbody: document.getElementById('appointmentsTbody'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnClear: document.getElementById('btnClear'),

  id: document.getElementById('appointmentId'),
  patientId: document.getElementById('patientId'),
  doctorId: document.getElementById('doctorId'),
  appointmentDate: document.getElementById('appointmentDate'),
  appointmentTime: document.getElementById('appointmentTime'),
  reason: document.getElementById('reason'),
  status: document.getElementById('status')
};

function clearForm() {
  els.id.value = '';
  els.form.reset();
  clearStatus(els.formStatus);
}

function setFormFromAppointment(a) {
  els.id.value = a._id;
  els.patientId.value = a.patientId?._id || a.patientId || '';
  els.doctorId.value = a.doctorId?._id || a.doctorId || '';
  els.appointmentDate.value = a.appointmentDate || '';
  els.appointmentTime.value = a.appointmentTime || '';
  els.reason.value = a.reason || '';
  els.status.value = a.status || 'pending';
}

function getPayloadFromForm() {
  return {
    patientId: els.patientId.value,
    doctorId: els.doctorId.value,
    appointmentDate: els.appointmentDate.value,
    appointmentTime: els.appointmentTime.value,
    reason: els.reason.value.trim(),
    status: els.status.value
  };
}

function statusPill(status) {
  const cls = ['pill', status].join(' ');
  return `<span class="${cls}">${escapeHtml(status)}</span>`;
}

function renderRows(items) {
  els.tbody.innerHTML = items
    .map((a) => {
      const patient = a.patientId?.fullName || '—';
      const doctor = a.doctorId ? `${a.doctorId.fullName} (${a.doctorId.specialization})` : '—';
      return `<tr>
        <td>${escapeHtml(formatDateTime(a.appointmentDate, a.appointmentTime))}</td>
        <td>${escapeHtml(patient)}</td>
        <td>${escapeHtml(doctor)}</td>
        <td>${escapeHtml(a.reason)}</td>
        <td>${statusPill(a.status)}</td>
        <td>
          <button class="btn small" data-action="edit" data-id="${a._id}">Edit</button>
          <button class="btn small danger" data-action="delete" data-id="${a._id}">Delete</button>
        </td>
      </tr>`;
    })
    .join('');
}

async function loadDropdowns() {
  const [patientsRes, doctorsRes] = await Promise.all([api.patients.list(), api.doctors.list()]);
  const patients = patientsRes.data || [];
  const doctors = doctorsRes.data || [];

  els.patientId.innerHTML =
    `<option value="">Select patient</option>` +
    patients.map((p) => `<option value="${p._id}">${escapeHtml(p.fullName)} (${escapeHtml(p.phone)})</option>`).join('');

  els.doctorId.innerHTML =
    `<option value="">Select doctor</option>` +
    doctors
      .map(
        (d) =>
          `<option value="${d._id}">${escapeHtml(d.fullName)} • ${escapeHtml(d.specialization)} • ${escapeHtml(
            d.availability
          )}</option>`
      )
      .join('');
}

async function loadAppointments() {
  clearStatus(els.listStatus);
  setStatus(els.listStatus, { type: 'warn', message: 'Loading appointments…' });
  try {
    const res = await api.appointments.list();
    renderRows(res.data || []);
    setStatus(els.listStatus, { type: 'ok', message: `Loaded ${(res.data || []).length} appointment(s)` });
  } catch (e) {
    setStatus(els.listStatus, { type: 'err', message: e.message });
  }
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearStatus(els.formStatus);
  setStatus(els.formStatus, { type: 'warn', message: 'Saving…' });

  const payload = getPayloadFromForm();
  const id = els.id.value;

  try {
    if (id) {
      await api.appointments.update(id, payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Appointment updated successfully' });
    } else {
      await api.appointments.create(payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Appointment booked successfully' });
      els.form.reset();
    }
    await loadAppointments();
  } catch (e2) {
    setStatus(els.formStatus, { type: 'err', message: e2.message });
  }
});

els.tbody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === 'edit') {
    clearStatus(els.formStatus);
    setStatus(els.formStatus, { type: 'warn', message: 'Loading appointment…' });
    try {
      const res = await api.appointments.get(id);
      setFormFromAppointment(res.data);
      setStatus(els.formStatus, { type: 'ok', message: 'Loaded into form. Update and click Save.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e3) {
      setStatus(els.formStatus, { type: 'err', message: e3.message });
    }
  }

  if (action === 'delete') {
    const ok = confirm('Delete this appointment? This cannot be undone.');
    if (!ok) return;
    try {
      await api.appointments.remove(id);
      await loadAppointments();
    } catch (e4) {
      alert(e4.message);
    }
  }
});

els.btnRefresh.addEventListener('click', loadAppointments);
els.btnClear.addEventListener('click', clearForm);

(async function init() {
  try {
    await loadDropdowns();
  } catch (e) {
    setStatus(els.formStatus, {
      type: 'err',
      message: `Failed to load patient/doctor dropdowns. Add patients and doctors first. (${e.message})`
    });
  }
  await loadAppointments();
})();

