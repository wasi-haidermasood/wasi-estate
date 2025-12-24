const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getHero() {
  const res = await fetch(`${API_BASE}/hero`);
  if (!res.ok) throw new Error('Failed to load hero');
  return res.json();
}

export async function updateHero(data) {
  const res = await fetch(`${API_BASE}/hero`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update hero');
  return res.json();
}