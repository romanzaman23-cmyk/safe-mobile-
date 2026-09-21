const API_BASE = '/api';

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth
  login: async (email, pin_code) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin_code })
    });
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST'
    });
    return res.json();
  },

  // Permissions
  getPermissions: async () => {
    const res = await fetch(`${API_BASE}/permissions`);
    return res.json();
  },

  togglePermission: async (id, is_allowed) => {
    const res = await fetch(`${API_BASE}/permissions/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_allowed })
    });
    return res.json();
  },

  // Usage
  getUsage: async () => {
    const res = await fetch(`${API_BASE}/usage`);
    return res.json();
  },

  requestTimeExtension: async (minutes = 30) => {
    const res = await fetch(`${API_BASE}/usage/request-extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes })
    });
    return res.json();
  },

  // Device Telemetry
  getTelemetry: async () => {
    const res = await fetch(`${API_BASE}/device/telemetry`);
    return res.json();
  },

  syncDevice: async () => {
    const res = await fetch(`${API_BASE}/device/sync`, {
      method: 'POST'
    });
    return res.json();
  },

  // Parent Portal APIs
  getParentOverview: async () => {
    const res = await fetch(`${API_BASE}/parent/overview`);
    return res.json();
  },

  getParentChildren: async () => {
    const res = await fetch(`${API_BASE}/parent/children`);
    return res.json();
  },

  addParentChild: async (childData) => {
    const res = await fetch(`${API_BASE}/parent/children`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(childData)
    });
    return res.json();
  },

  toggleChildLock: async (childId) => {
    const res = await fetch(`${API_BASE}/parent/toggle-lock/${childId}`, {
      method: 'POST'
    });
    return res.json();
  },

  triggerSiren: async (childId) => {
    const res = await fetch(`${API_BASE}/parent/trigger-siren/${childId}`, {
      method: 'POST'
    });
    return res.json();
  },

  togglePauseAll: async () => {
    const res = await fetch(`${API_BASE}/parent/pause-all`, {
      method: 'POST'
    });
    return res.json();
  },

  getParentProfile: async () => {
    const res = await fetch(`${API_BASE}/parent/profile`);
    return res.json();
  },

  updateParentProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/parent/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  sendInvite: async (targetPhone, pairingCode) => {
    const res = await fetch(`${API_BASE}/parent/send-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetPhone, pairingCode })
    });
    return res.json();
  },

  // Parent Contacts Management
  getParentContacts: async (childId) => {
    const url = childId ? `${API_BASE}/parent/contacts?childId=${childId}` : `${API_BASE}/parent/contacts`;
    const res = await fetch(url);
    return res.json();
  },

  toggleBlockContact: async (contactId) => {
    const res = await fetch(`${API_BASE}/parent/contacts/${contactId}/toggle-block`, {
      method: 'POST'
    });
    return res.json();
  },

  addParentContact: async (contactData) => {
    const res = await fetch(`${API_BASE}/parent/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    return res.json();
  },

  // Parent SMS Monitoring
  getParentSMS: async (childId) => {
    const url = childId ? `${API_BASE}/parent/sms?childId=${childId}` : `${API_BASE}/parent/sms`;
    const res = await fetch(url);
    return res.json();
  },

  blockSMSSender: async (smsId) => {
    const res = await fetch(`${API_BASE}/parent/sms/${smsId}/block-sender`, {
      method: 'POST'
    });
    return res.json();
  },

  // Parent Apps & Limits
  getParentApps: async (childId) => {
    const url = childId ? `${API_BASE}/parent/apps?childId=${childId}` : `${API_BASE}/parent/apps`;
    const res = await fetch(url);
    return res.json();
  },

  toggleBlockApp: async (appId) => {
    const res = await fetch(`${API_BASE}/parent/apps/${appId}/toggle-block`, {
      method: 'POST'
    });
    return res.json();
  },

  setAppTimeLimit: async (appId, minutes) => {
    const res = await fetch(`${API_BASE}/parent/apps/${appId}/set-limit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes })
    });
    return res.json();
  },

  // Super Admin SecOps APIs
  getAdminOverview: async () => {
    const res = await fetch(`${API_BASE}/admin/overview`);
    return res.json();
  },

  getAdminParents: async () => {
    const res = await fetch(`${API_BASE}/admin/parents`);
    return res.json();
  },

  getAdminChildren: async () => {
    const res = await fetch(`${API_BASE}/admin/children`);
    return res.json();
  },

  getAdminList: async () => {
    const res = await fetch(`${API_BASE}/admin/admins`);
    return res.json();
  },

  addAdminUser: async (adminData) => {
    const res = await fetch(`${API_BASE}/admin/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });
    return res.json();
  },

  updateParentStatus: async (parentId, status) => {
    const res = await fetch(`${API_BASE}/admin/parents/${parentId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  sendBroadcast: async (title, message) => {
    const res = await fetch(`${API_BASE}/admin/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message })
    });
    return res.json();
  }
};
