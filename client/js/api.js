function getToken() {
  return localStorage.getItem('ihcp_token');
}

function setToken(token) {
  localStorage.setItem('ihcp_token', token);
}

function clearToken() {
  localStorage.removeItem('ihcp_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = { success: false, message: 'Invalid JSON response' };
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const api = {
  health: () => request('/health'),

  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),

  patients: {
    list: () => request('/patients'),
    get: (id) => request(`/patients/${id}`),
    create: (payload) => request('/patients', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/patients/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => request(`/patients/${id}`, { method: 'DELETE' })
  },

  doctors: {
    list: () => request('/doctors'),
    get: (id) => request(`/doctors/${id}`),
    create: (payload) => request('/doctors', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/doctors/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => request(`/doctors/${id}`, { method: 'DELETE' })
  },

  appointments: {
    list: () => request('/appointments'),
    get: (id) => request(`/appointments/${id}`),
    create: (payload) => request('/appointments', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/appointments/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => request(`/appointments/${id}`, { method: 'DELETE' })
  },

  consultations: {
    list: () => request('/consultations'),
    get: (id) => request(`/consultations/${id}`),
    create: (payload) => request('/consultations', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/consultations/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => request(`/consultations/${id}`, { method: 'DELETE' })
  },

  prescriptions: {
    list: () => request('/prescriptions'),
    get: (id) => request(`/prescriptions/${id}`),
    create: (payload) => request('/prescriptions', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/prescriptions/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => request(`/prescriptions/${id}`, { method: 'DELETE' })
  },

  admin: {
    dashboard: () => request('/admin/dashboard', { auth: true })
  },

  token: { get: getToken, set: setToken, clear: clearToken }
};

