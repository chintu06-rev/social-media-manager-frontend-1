const API_BASE = '/api';

export const api = {
  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(details) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // Accounts
  async getAccounts(userId) {
    const url = userId ? `${API_BASE}/accounts?userId=${userId}` : `${API_BASE}/accounts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch accounts');
    return res.json();
  },

  async connectAccount(data) {
    const res = await fetch(`${API_BASE}/accounts/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to connect account');
    }
    return res.json();
  },

  async disconnectAccount(id) {
    const res = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to disconnect account');
    return true;
  },

  // Posts
  async getPosts(userId) {
    const url = userId ? `${API_BASE}/posts?userId=${userId}` : `${API_BASE}/posts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async createPost(payload) {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to publish post');
    }
    return res.json();
  },

  async retryDelivery(deliveryId) {
    const res = await fetch(`${API_BASE}/posts/deliveries/${deliveryId}/retry`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to retry delivery');
    return res.json();
  },

  // Media Upload
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload media');
    return res.json();
  },

  // Dashboard Stats
  async getStats(userId) {
    const url = userId ? `${API_BASE}/dashboard/stats?userId=${userId}` : `${API_BASE}/dashboard/stats`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
