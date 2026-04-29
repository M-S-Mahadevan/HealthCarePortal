initLayout({ title: 'Prescriptions' });

const els = {
  form: document.getElementById('prescriptionForm'),
  formStatus: document.getElementById('formStatus'),
  listStatus: document.getElementById('listStatus'),
  tbody: document.getElementById('prescriptionsTbody'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnClear: document.getElementById('btnClear'),

  id: document.getElementById('prescriptionId'),
  consultationId: document.getElementById('consultationId'),
  medicineName: document.getElementById('medicineName'),
  dosage: document.getElementById('dosage'),
  instructions: document.getElementById('instructions')
};

function clearForm() {
  els.id.value = '';
  els.form.reset();
  clearStatus(els.formStatus);
}

function setFormFromPrescription(p) {
  els.id.value = p._id;
  els.consultationId.value = p.consultationId?._id || p.consultationId || '';
  els.medicineName.value = p.medicineName || '';
  els.dosage.value = p.dosage || '';
  els.instructions.value = p.instructions || '';
}

function getPayloadFromForm() {
  return {
    consultationId: els.consultationId.value,
    medicineName: els.medicineName.value.trim(),
    dosage: els.dosage.value.trim(),
    instructions: els.instructions.value.trim()
  };
}

function consultationLabel(c) {
  const a = c.appointmentId;
  const p = a?.patientId?.fullName ? a.patientId.fullName : 'Patient';
  const d = a?.doctorId?.fullName ? a.doctorId.fullName : 'Doctor';
  const when = a ? formatDateTime(a.appointmentDate, a.appointmentTime) : '';
  return `${when} • ${p} • ${d} • Dx: ${c.diagnosis}`;
}

async function loadConsultationsDropdown() {
  const res = await api.consultations.list();
  const cons = res.data || [];
  els.consultationId.innerHTML =
    `<option value="">Select consultation</option>` +
    cons.map((c) => `<option value="${c._id}">${escapeHtml(consultationLabel(c))}</option>`).join('');
}

function renderRows(items) {
  els.tbody.innerHTML = items
    .map((p) => {
      const c = p.consultationId;
      const a = c?.appointmentId;
      const patient = a?.patientId?.fullName || '—';
      const doctor = a?.doctorId ? `${a.doctorId.fullName} (${a.doctorId.specialization})` : '—';
      return `<tr>
        <td>${escapeHtml(patient)}</td>
        <td>${escapeHtml(doctor)}</td>
        <td>${escapeHtml(p.medicineName)}</td>
        <td>${escapeHtml(p.dosage)}</td>
        <td>${escapeHtml(p.instructions)}</td>
        <td>
          <button class="btn small" data-action="edit" data-id="${p._id}">Edit</button>
          <button class="btn small danger" data-action="delete" data-id="${p._id}">Delete</button>
        </td>
      </tr>`;
    })
    .join('');
}

async function loadPrescriptions() {
  clearStatus(els.listStatus);
  setStatus(els.listStatus, { type: 'warn', message: 'Loading prescriptions…' });
  try {
    const res = await api.prescriptions.list();
    renderRows(res.data || []);
    setStatus(els.listStatus, { type: 'ok', message: `Loaded ${(res.data || []).length} prescription(s)` });
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
      await api.prescriptions.update(id, payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Prescription updated successfully' });
    } else {
      await api.prescriptions.create(payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Prescription created successfully' });
      els.form.reset();
    }
    await loadPrescriptions();
    await loadConsultationsDropdown();
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
    setStatus(els.formStatus, { type: 'warn', message: 'Loading prescription…' });
    try {
      const res = await api.prescriptions.get(id);
      setFormFromPrescription(res.data);
      setStatus(els.formStatus, { type: 'ok', message: 'Loaded into form. Update and click Save.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e3) {
      setStatus(els.formStatus, { type: 'err', message: e3.message });
    }
  }

  if (action === 'delete') {
    const ok = confirm('Delete this prescription? This cannot be undone.');
    if (!ok) return;
    try {
      await api.prescriptions.remove(id);
      await loadPrescriptions();
    } catch (e4) {
      alert(e4.message);
    }
  }
});

els.btnRefresh.addEventListener('click', loadPrescriptions);
els.btnClear.addEventListener('click', clearForm);

(async function init() {
  try {
    await loadConsultationsDropdown();
  } catch (e) {
    setStatus(els.formStatus, {
      type: 'err',
      message: `Failed to load consultations. Create consultations first. (${e.message})`
    });
  }
  await loadPrescriptions();
})();

