// api.js

const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(method, path, body = null) {
  const headers = { 'Accept': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = 'login.html';
    throw new Error('Unauthorized');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const msg = data.errors
      ? Object.values(data.errors).flat().join(', ')
      : data.message || 'Request failed';
    throw new Error(msg);
  }

  return data;
}

// --- Auth ---
export async function login(email, password) {
  const data = await request('POST', '/login', { email, password });
  if (!data.token) {
    throw new Error('No token received from server');
  }
  setToken(data.token);
  return data;
}

export async function register(name, email, password, password_confirmation) {
  const data = await request('POST', '/register', {
    name, email, password, password_confirmation,
  });
  setToken(data.token);
  return data;
}

export async function forgotPassword(email) {
  return request('POST', '/forgot-password', { email });
}

export async function logout() {
  await request('POST', '/logout');
  clearToken();
}

// --- Tasks ---
export async function fetchTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/tasks?${query}` : '/tasks';
  return request('GET', path);
}

export async function createTask(task) {
  return request('POST', '/tasks', task);
}

export async function updateTask(id, data) {
  return request('PUT', `/tasks/${id}`, data);
}

export async function deleteTask(id) {
  return request('DELETE', `/tasks/${id}`);
}

export async function completeTask(id, note) {
  return request('PATCH', `/tasks/${id}/complete`, { note });
}

export async function missTask(id, note) {
  return request('PATCH', `/tasks/${id}/missed`, { note });
}
