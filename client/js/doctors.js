initLayout({ title: 'Doctors' });

const els = {
  form: document.getElementById('doctorForm'),
  formStatus: document.getElementById('formStatus'),
  listStatus: document.getElementById('listStatus'),
  tbody: document.getElementById('doctorsTbody'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnClear: document.getElementById('btnClear'),

  id: document.getElementById('doctorId'),
  fullName: document.getElementById('fullName'),
  specialization: document.getElementById('specialization'),
  experience: document.getElementById('experience'),
  phone: document.getElementById('phone'),
  email: document.getElementById('email'),
  availability: document.getElementById('availability')
};

function getPayloadFromForm() {
  return {
    fullName: els.fullName.value.trim(),
    specialization: els.specialization.value.trim(),
    experience: Number(els.experience.value),
    phone: els.phone.value.trim(),
    email: els.email.value.trim(),
    availability: els.availability.value.trim()
  };
}

function setFormFromDoctor(d) {
  els.id.value = d._id;
  els.fullName.value = d.fullName || '';
  els.specialization.value = d.specialization || '';
  els.experience.value = d.experience ?? '';
  els.phone.value = d.phone || '';
  els.email.value = d.email || '';
  els.availability.value = d.availability || '';
}

function clearForm() {
  els.id.value = '';
  els.form.reset();
  clearStatus(els.formStatus);
}

function renderRows(items) {
  els.tbody.innerHTML = items
    .map((d) => {
      return `<tr>
        <td>${escapeHtml(d.fullName)}</td>
        <td>${escapeHtml(d.specialization)}</td>
        <td>${escapeHtml(d.experience)}</td>
        <td>${escapeHtml(d.phone)}</td>
        <td>${escapeHtml(d.email)}</td>
        <td>${escapeHtml(d.availability)}</td>
        <td>
          <button class="btn small" data-action="edit" data-id="${d._id}">Edit</button>
          <button class="btn small danger" data-action="delete" data-id="${d._id}">Delete</button>
        </td>
      </tr>`;
    })
    .join('');
}

async function loadDoctors() {
  clearStatus(els.listStatus);
  setStatus(els.listStatus, { type: 'warn', message: 'Loading doctors…' });
  try {
    const res = await api.doctors.list();
    renderRows(res.data || []);
    setStatus(els.listStatus, { type: 'ok', message: `Loaded ${(res.data || []).length} doctor(s)` });
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
      await api.doctors.update(id, payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Doctor updated successfully' });
    } else {
      await api.doctors.create(payload);
      setStatus(els.formStatus, { type: 'ok', message: 'Doctor created successfully' });
      els.form.reset();
    }
    await loadDoctors();
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
    setStatus(els.formStatus, { type: 'warn', message: 'Loading doctor…' });
    try {
      const res = await api.doctors.get(id);
      setFormFromDoctor(res.data);
      setStatus(els.formStatus, { type: 'ok', message: 'Loaded into form. Update and click Save.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e3) {
      setStatus(els.formStatus, { type: 'err', message: e3.message });
    }
  }

  if (action === 'delete') {
    const ok = confirm('Delete this doctor? This cannot be undone.');
    if (!ok) return;
    try {
      await api.doctors.remove(id);
      await loadDoctors();
    } catch (e4) {
      alert(e4.message);
    }
  }
});

els.btnRefresh.addEventListener('click', loadDoctors);
els.btnClear.addEventListener('click', clearForm);

loadDoctors();

