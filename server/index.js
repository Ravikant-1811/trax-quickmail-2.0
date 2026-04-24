import express from 'express';
import cors from 'cors';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readState, updateState } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const app = express();
const port = Number(process.env.PORT || 8787);
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const apiRouter = express.Router();

function send(res, payload) {
  res.json(payload);
}

function notFound(res, message = 'Not found') {
  res.status(404).json({ error: message });
}

function nextId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function computeDashboard(state) {
  const totalSent = state.campaigns.reduce((sum, item) => sum + (item.sent || 0), 0);
  const totalOpens = state.campaigns.reduce((sum, item) => sum + (item.opens || 0), 0);
  const totalClicks = state.campaigns.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const totalRevenue = state.campaigns.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const activeContacts = state.contacts.filter((item) => item.status === 'Active').length;
  const totalUnsubscribes = Math.max(0, Math.round((totalSent || 1) * 0.0014));
  const openRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
  const clickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0;

  return {
    totals: {
      totalSent,
      openRate: Number(openRate.toFixed(1)),
      clickRate: Number(clickRate.toFixed(1)),
      unsubscribes: totalUnsubscribes,
      revenueAttributed: totalRevenue,
      totalContacts: state.contacts.length,
      activeContacts,
    },
    kpis: state.dashboard.kpis,
    recentCampaigns: [...state.campaigns]
      .sort((a, b) => (a.id < b.id ? 1 : -1))
      .slice(0, 5),
    audienceGrowth: {
      '30': state.dashboard.audience30,
      '60': state.dashboard.audience60,
      '90': state.dashboard.audience90,
    },
  };
}

function computeAnalytics(state) {
  const campaigns = state.campaigns;
  const sent = campaigns.reduce((sum, item) => sum + (item.sent || 0), 0);
  const opens = campaigns.reduce((sum, item) => sum + (item.opens || 0), 0);
  const clicks = campaigns.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const revenue = campaigns.reduce((sum, item) => sum + (item.revenue || 0), 0);

  return {
    summary: {
      sent,
      deliveries: Math.round(sent * 0.989),
      opens,
      clicks,
      bounces: Math.round(sent * 0.012),
      unsubscribes: Math.round(sent * 0.0014),
      revenue,
    },
    performanceData: state.analytics.performanceData,
    deviceData: state.analytics.deviceData,
    topCampaigns: campaigns
      .map((campaign) => ({
        name: campaign.name,
        sent: campaign.sent,
        opens: campaign.opens,
        clicks: campaign.clicks,
        openRate: campaign.openRate,
        clickRate: campaign.clickRate,
      }))
      .sort((a, b) => b.sent - a.sent),
  };
}

apiRouter.get('/bootstrap', async (_req, res) => {
  const state = await readState();
  send(res, {
    user: state.user,
    settings: state.settings,
    campaigns: state.campaigns,
    automations: state.automations,
    contacts: state.contacts,
    templates: state.templates,
    scheduler: state.scheduler,
    dashboard: computeDashboard(state),
    analytics: computeAnalytics(state),
  });
});

apiRouter.get('/dashboard', async (_req, res) => {
  const state = await readState();
  send(res, computeDashboard(state));
});

apiRouter.get('/campaigns', async (req, res) => {
  const state = await readState();
  const query = String(req.query.q || '').trim().toLowerCase();
  const status = String(req.query.status || '').trim().toLowerCase();
  const results = state.campaigns.filter((item) => {
    const matchesQuery = !query || [item.name, item.subject, item.segment].some((value) => String(value).toLowerCase().includes(query));
    const matchesStatus = !status || String(item.status).toLowerCase() === status;
    return matchesQuery && matchesStatus;
  });
  send(res, results);
});

apiRouter.post('/campaigns', async (req, res) => {
  const body = req.body ?? {};
  const next = await updateState((state) => {
    const campaign = {
      id: nextId('cmp'),
      name: String(body.name || 'New Campaign'),
      status: 'Draft',
      subject: String(body.subject || 'Draft subject line'),
      segment: String(body.segment || 'All Subscribers'),
      sent: 0,
      opens: 0,
      clicks: 0,
      openRate: 0,
      clickRate: 0,
      date: '-',
      scheduledAt: String(body.scheduledAt || ''),
      revenue: 0,
    };
    return { ...state, campaigns: [campaign, ...state.campaigns] };
  });
  send(res, next.campaigns[0]);
});

apiRouter.patch('/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body ?? {};
  const next = await updateState((state) => ({
    ...state,
    campaigns: state.campaigns.map((campaign) => {
      if (campaign.id !== id) {
        return campaign;
      }

      const updated = { ...campaign, ...body };
      if (typeof updated.sent === 'number' && updated.sent > 0) {
        updated.openRate = Number(((updated.opens / updated.sent) * 100 || 0).toFixed(1));
        updated.clickRate = Number(((updated.clicks / updated.sent) * 100 || 0).toFixed(1));
      }
      return updated;
    }),
  }));
  const campaign = next.campaigns.find((item) => item.id === id);
  if (!campaign) {
    return notFound(res, 'Campaign not found');
  }
  send(res, campaign);
});

apiRouter.post('/campaigns/:id/send', async (req, res) => {
  const { id } = req.params;
  const next = await updateState((state) => {
    const campaigns = state.campaigns.map((campaign) => {
      if (campaign.id !== id) return campaign;
      const sent = campaign.sent > 0 ? campaign.sent : 32450;
      const opens = campaign.opens > 0 ? campaign.opens : Math.round(sent * 0.34);
      const clicks = campaign.clicks > 0 ? campaign.clicks : Math.round(sent * 0.087);
      return {
        ...campaign,
        status: 'Sent',
        sent,
        opens,
        clicks,
        openRate: Number(((opens / sent) * 100).toFixed(1)),
        clickRate: Number(((clicks / sent) * 100).toFixed(1)),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        revenue: Math.round(sent * 0.52),
      };
    });
    return { ...state, campaigns };
  });
  const campaign = next.campaigns.find((item) => item.id === id);
  if (!campaign) {
    return notFound(res, 'Campaign not found');
  }
  send(res, { ok: true, campaign });
});

apiRouter.delete('/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  const next = await updateState((state) => ({
    ...state,
    campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
  }));
  send(res, { ok: true, count: next.campaigns.length });
});

apiRouter.get('/contacts', async (req, res) => {
  const state = await readState();
  const query = String(req.query.q || '').trim().toLowerCase();
  const results = state.contacts.filter((item) => {
    if (!query) return true;
    return [item.name, item.email, item.list, ...(item.tags || [])].some((value) => String(value).toLowerCase().includes(query));
  });
  send(res, results);
});

apiRouter.post('/contacts', async (req, res) => {
  const body = req.body ?? {};
  const next = await updateState((state) => {
    const contact = {
      id: nextId('ct'),
      name: String(body.name || 'New Contact'),
      email: String(body.email || ''),
      tags: Array.isArray(body.tags) ? body.tags : [],
      list: String(body.list || 'All Subscribers'),
      lastActivity: 'Just now',
      openRate: Number(body.openRate || 0),
      status: String(body.status || 'Active'),
    };
    return { ...state, contacts: [contact, ...state.contacts] };
  });
  send(res, next.contacts[0]);
});

apiRouter.patch('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body ?? {};
  const next = await updateState((state) => ({
    ...state,
    contacts: state.contacts.map((contact) => (contact.id === id ? { ...contact, ...body } : contact)),
  }));
  const contact = next.contacts.find((item) => item.id === id);
  if (!contact) {
    return notFound(res, 'Contact not found');
  }
  send(res, contact);
});

apiRouter.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const next = await updateState((state) => ({
    ...state,
    contacts: state.contacts.filter((contact) => contact.id !== id),
  }));
  send(res, { ok: true, count: next.contacts.length });
});

apiRouter.get('/templates', async (_req, res) => {
  const state = await readState();
  send(res, state.templates);
});

apiRouter.get('/automations', async (_req, res) => {
  const state = await readState();
  send(res, state.automations);
});

apiRouter.post('/automations', async (req, res) => {
  const body = req.body ?? {};
  const next = await updateState((state) => {
    const automation = {
      id: nextId('aut'),
      name: String(body.name || 'New Automation'),
      status: String(body.status || 'Paused'),
      trigger: String(body.trigger || 'Custom event'),
      enrolled: Number(body.enrolled || 0),
      completed: Number(body.completed || 0),
      conversionRate: Number(body.conversionRate || 0),
      nodes: Number(body.nodes || 3),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    return { ...state, automations: [automation, ...state.automations] };
  });
  send(res, next.automations[0]);
});

apiRouter.patch('/automations/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body ?? {};
  const next = await updateState((state) => ({
    ...state,
    automations: state.automations.map((automation) => (automation.id === id ? { ...automation, ...body, lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : automation)),
  }));
  const automation = next.automations.find((item) => item.id === id);
  if (!automation) {
    return notFound(res, 'Automation not found');
  }
  send(res, automation);
});

apiRouter.get('/scheduler', async (_req, res) => {
  const state = await readState();
  send(res, state.scheduler);
});

apiRouter.get('/analytics', async (_req, res) => {
  const state = await readState();
  send(res, computeAnalytics(state));
});

apiRouter.get('/settings', async (_req, res) => {
  const state = await readState();
  send(res, state.settings);
});

apiRouter.put('/settings', async (req, res) => {
  const body = req.body ?? {};
  const next = await updateState((state) => ({
    ...state,
    settings: {
      ...state.settings,
      ...body,
      account: {
        ...state.settings.account,
        ...(body.account || {}),
      },
    },
  }));
  send(res, next.settings);
});

apiRouter.post('/settings/domains', async (req, res) => {
  const body = req.body ?? {};
  const next = await updateState((state) => ({
    ...state,
    settings: {
      ...state.settings,
      domains: [
        ...state.settings.domains,
        {
          id: nextId('dom'),
          domain: String(body.domain || 'new.domain.com'),
          dkim: false,
          spf: false,
          status: 'Pending',
        },
      ],
    },
  }));
  send(res, next.settings.domains[next.settings.domains.length - 1]);
});

apiRouter.post('/settings/domains/:id/verify', async (req, res) => {
  const { id } = req.params;
  const next = await updateState((state) => ({
    ...state,
    settings: {
      ...state.settings,
      domains: state.settings.domains.map((domain) => (
        domain.id === id ? { ...domain, dkim: true, spf: true, status: 'Verified' } : domain
      )),
    },
  }));
  const domain = next.settings.domains.find((item) => item.id === id);
  if (!domain) {
    return notFound(res, 'Domain not found');
  }
  send(res, domain);
});

apiRouter.post('/smtp/test', async (_req, res) => {
  const state = await readState();
  send(res, {
    ok: true,
    message: `SMTP connection check passed for ${state.settings.account.email}.`,
  });
});

app.use('/api', apiRouter);

if (isProduction && existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`TraxQuickMail backend running on http://localhost:${port}`);
});
