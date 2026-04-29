initLayout({ title: 'Consultations' });

const els = {
  form: document.getElementById('consultationForm'),
  formStatus: document.getElementById('formStatus'),
  listStatus: document.getElementById('listStatus'),
  tbody: document.getElementById('consultationsTbody'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnClear: document.getElementById('btnClear'),

  id: document.getElementById('consultationId'),
  appointmentId: document.getElementById('appointmentId'),
  diagnosis: document.getElementById('diagnosis'),
  notes: document.getElementById('notes'),
  followUpDate: document.getElementById('followUpDate')
};

function clearForm() {
  els.id.value = '';
  els.form.reset();
  clearStatus(els.formStatus);
}

function setFormFromConsultation(c) {
  els.id.value = c._id;
  els.appointmentId.value = c.appointmentId?._id || c.appointmentId || '';
  els.diagnosis.value = c.diagnosis || '';
  els.notes.value = c.notes || '';
  els.followUpDate.value = c.followUpDate || '';
}

function getPayloadFromForm() {
  return {
    appointmentId: els.appointmentId.value,
    diagnosis: els.diagnosis.value.trim(),
    notes: els.notes.value.trim(),
    followUpDate: els.followUpDate.value || ''
  };
}

function apptLabel(a) {
  const p = a.patientId?.fullName ? a.patientId.fullName : 'Patient';
  const d = a.doctorId?.fullName ? a.doctorId.fullName : 'Doctor';
  const when = formatDateTime(a.appointmentDate, a.appointmentTime);
  return `${when} • ${p} • ${d}`;
}

async function loadAppointmentsDropdown() {
  const res = await api.appointments.list();
  const appts = res.data || [];
  els.appointmentId.innerHTML =
    `<option value="">Select appointment</option>` +
    appts.map((a) => `<option value="${a._id}">${escapeHtml(apptLabel(a))}</option>`).join('');
}

function renderRows(items) {
  els.tbody.innerHTML = items
    .map((c) => {
      const a = c.appointmentId;
      const when = a ? formatDateTime(a.appointmentDate, a.appointmentTime) : '—';
      const patient = a?.patientId?.fullName || '—';
      const doctor = a?.doctorId ? `${a.doctorId.fullName} (${a.doctorId.specialization})` : '—';
      return `<tr>
        <td>${escapeHtml(when)}</td>
        <td>${escapeHtml(patient)}</td>
        <td>${escapeHtml(doctor)}</td>
        <td>${escapeHtml(c.diagnosis)}</td>
        <td>${escapeHtml(c.followUpDate || '—')}</td>
        <td>
          <button class="btn small" data-action="edit" data-id="${c._id}">Edit</button>
          <button class="btn small danger" data-action="delete" data-id="${c._id}">Delete</button>
        </td>
      </tr>`;
    })
    .join('');
}

async function loadConsultations() {
  clearStatus(els.listStatus);
  setStatus(els.listStatus, { type: 'warn', message: 'Loading consultations…' });
  try {
    const res = await api.consultations.list();
    renderRows(res.data || []);
    setStatus(els.listStatus, { type: 'ok', message: `Loaded ${(res.data || []).length} consultation(s)` });
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
      await api.consultations.update(id, payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Consultation updated successfully' });
    } else {
      await api.consultations.create(payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Consultation created successfully' });
      els.form.reset();
    }
    await loadConsultations();
    await loadAppointmentsDropdown();
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
    setStatus(els.formStatus, { type: 'warn', message: 'Loading consultation…' });
    try {
      const res = await api.consultations.get(id);
      setFormFromConsultation(res.data);
      setStatus(els.formStatus, { type: 'ok', message: 'Loaded into form. Update and click Save.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e3) {
      setStatus(els.formStatus, { type: 'err', message: e3.message });
    }
  }

  if (action === 'delete') {
    const ok = confirm('Delete this consultation? This cannot be undone.');
    if (!ok) return;
    try {
      await api.consultations.remove(id);
      await loadConsultations();
    } catch (e4) {
      alert(e4.message);
    }
  }
});

els.btnRefresh.addEventListener('click', loadConsultations);
els.btnClear.addEventListener('click', clearForm);

(async function init() {
  try {
    await loadAppointmentsDropdown();
  } catch (e) {
    setStatus(els.formStatus, {
      type: 'err',
      message: `Failed to load appointments. Create appointments first. (${e.message})`
    });
  }
  await loadConsultations();
})();

