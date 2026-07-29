const API = '';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { 'x-admin-password': token } : {};
}

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.headers.get('content-type')?.includes('text/csv') ? res.text() : res.json();
}

export async function initDatabase() {
  await api('/api/admin/init', { method: 'POST' });
}

export async function getAllRegistrations() {
  const { items } = await api('/api/admin/registrations?limit=10000');
  return items;
}

export async function getRegistrationByEmail(email: string) {
  const { items } = await api(`/api/admin/registrations?q=${encodeURIComponent(email)}&limit=1`);
  return items?.[0] || null;
}

export async function insertRegistration(record: any) {
  return api('/api/register', { method: 'POST', body: JSON.stringify(record) });
}

export async function deleteRegistration(id: string) {
  return api(`/api/admin/registrations/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function deleteAllRegistrations() {
  return api('/api/admin/registrations', { method: 'DELETE' });
}

export async function getFilteredRegistrations(params: { q?: string; experience?: string; page: number; limit: number }) {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.experience) qs.set('experience', params.experience);
  qs.set('page', String(params.page));
  qs.set('limit', String(params.limit));
  return api(`/api/admin/registrations?${qs}`);
}

export async function getStats() {
  return api('/api/stats');
}
