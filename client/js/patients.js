initLayout({ title: 'Patients' });

const els = {
  form: document.getElementById('patientForm'),
  formStatus: document.getElementById('formStatus'),
  listStatus: document.getElementById('listStatus'),
  tbody: document.getElementById('patientsTbody'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnClear: document.getElementById('btnClear'),

  id: document.getElementById('patientId'),
  fullName: document.getElementById('fullName'),
  age: document.getElementById('age'),
  gender: document.getElementById('gender'),
  phone: document.getElementById('phone'),
  bloodGroup: document.getElementById('bloodGroup'),
  address: document.getElementById('address'),
  medicalHistory: document.getElementById('medicalHistory')
};

function getPayloadFromForm() {
  return {
    fullName: els.fullName.value.trim(),
    age: Number(els.age.value),
    gender: els.gender.value,
    phone: els.phone.value.trim(),
    bloodGroup: els.bloodGroup.value.trim(),
    address: els.address.value.trim(),
    medicalHistory: els.medicalHistory.value.trim()
  };
}

function setFormFromPatient(p) {
  els.id.value = p._id;
  els.fullName.value = p.fullName || '';
  els.age.value = p.age ?? '';
  els.gender.value = p.gender || '';
  els.phone.value = p.phone || '';
  els.bloodGroup.value = p.bloodGroup || '';
  els.address.value = p.address || '';
  els.medicalHistory.value = p.medicalHistory || '';
}

function clearForm() {
  els.id.value = '';
  els.form.reset();
  clearStatus(els.formStatus);
}

function renderRows(items) {
  els.tbody.innerHTML = items
    .map((p) => {
      return `<tr>
        <td>${escapeHtml(p.fullName)}</td>
        <td>${escapeHtml(p.age)}</td>
        <td>${escapeHtml(p.gender)}</td>
        <td>${escapeHtml(p.phone)}</td>
        <td>${escapeHtml(p.bloodGroup)}</td>
        <td>
          <button class="btn small" data-action="edit" data-id="${p._id}">Edit</button>
          <button class="btn small danger" data-action="delete" data-id="${p._id}">Delete</button>
        </td>
      </tr>`;
    })
    .join('');
}

async function loadPatients() {
  clearStatus(els.listStatus);
  setStatus(els.listStatus, { type: 'warn', message: 'Loading patients…' });
  try {
    const res = await api.patients.list();
    renderRows(res.data || []);
    setStatus(els.listStatus, { type: 'ok', message: `Loaded ${(res.data || []).length} patient(s)` });
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
      await api.patients.update(id, payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Patient updated successfully' });
    } else {
      await api.patients.create(payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Patient created successfully' });
      els.form.reset();
    }
    await loadPatients();
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
    setStatus(els.formStatus, { type: 'warn', message: 'Loading patient…' });
    try {
      const res = await api.patients.get(id);
      setFormFromPatient(res.data);
      setStatus(els.formStatus, { type: 'ok', message: 'Loaded into form. Update and click Save.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e3) {
      setStatus(els.formStatus, { type: 'err', message: e3.message });
    }
  }

  if (action === 'delete') {
    const ok = confirm('Delete this patient? This cannot be undone.');
    if (!ok) return;
    try {
      await api.patients.remove(id);
      await loadPatients();
    } catch (e4) {
      alert(e4.message);
    }
  }
});

els.btnRefresh.addEventListener('click', loadPatients);
els.btnClear.addEventListener('click', clearForm);

loadPatients();

