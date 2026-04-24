const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const fallback = await response.text();
    throw new Error(fallback || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type DashboardPayload = {
  totals: {
    totalSent: number;
    openRate: number;
    clickRate: number;
    unsubscribes: number;
    revenueAttributed: number;
    totalContacts: number;
    activeContacts: number;
  };
  kpis: Array<Record<string, unknown>>;
  recentCampaigns: Array<Record<string, unknown>>;
  audienceGrowth: Record<'30' | '60' | '90', Array<Record<string, unknown>>>;
};

export type BootstrapPayload = {
  user: Record<string, unknown>;
  settings: Record<string, unknown>;
  campaigns: Array<Record<string, unknown>>;
  automations: Array<Record<string, unknown>>;
  contacts: Array<Record<string, unknown>>;
  templates: Array<Record<string, unknown>>;
  scheduler: Record<string, unknown>;
  dashboard: DashboardPayload;
  analytics: Record<string, unknown>;
};

export const api = {
  bootstrap: () => request<BootstrapPayload>('/api/bootstrap'),
  dashboard: () => request<DashboardPayload>('/api/dashboard'),
  campaigns: (query = '') => request<Array<Record<string, unknown>>>(`/api/campaigns${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  createCampaign: (payload: Record<string, unknown>) => request<Record<string, unknown>>('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateCampaign: (id: string, payload: Record<string, unknown>) => request<Record<string, unknown>>(`/api/campaigns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),
  sendCampaign: (id: string) => request<Record<string, unknown>>(`/api/campaigns/${id}/send`, {
    method: 'POST',
  }),
  deleteCampaign: (id: string) => request<Record<string, unknown>>(`/api/campaigns/${id}`, {
    method: 'DELETE',
  }),
  contacts: (query = '') => request<Array<Record<string, unknown>>>(`/api/contacts${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  createContact: (payload: Record<string, unknown>) => request<Record<string, unknown>>('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateContact: (id: string, payload: Record<string, unknown>) => request<Record<string, unknown>>(`/api/contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),
  deleteContact: (id: string) => request<Record<string, unknown>>(`/api/contacts/${id}`, {
    method: 'DELETE',
  }),
  templates: () => request<Array<Record<string, unknown>>>('/api/templates'),
  automations: () => request<Array<Record<string, unknown>>>('/api/automations'),
  createAutomation: (payload: Record<string, unknown>) => request<Record<string, unknown>>('/api/automations', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateAutomation: (id: string, payload: Record<string, unknown>) => request<Record<string, unknown>>(`/api/automations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),
  scheduler: () => request<Record<string, unknown>>('/api/scheduler'),
  analytics: () => request<Record<string, unknown>>('/api/analytics'),
  settings: () => request<Record<string, unknown>>('/api/settings'),
  updateSettings: (payload: Record<string, unknown>) => request<Record<string, unknown>>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  addDomain: (payload: Record<string, unknown>) => request<Record<string, unknown>>('/api/settings/domains', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  verifyDomain: (id: string) => request<Record<string, unknown>>(`/api/settings/domains/${id}/verify`, {
    method: 'POST',
  }),
  testSmtp: () => request<Record<string, unknown>>('/api/smtp/test', {
    method: 'POST',
  }),
};
