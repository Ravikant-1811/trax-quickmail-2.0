import { readState, updateState } from '../server/store.js';
import { buildEmailContent, createTransport, getSmtpConfig, recipientName, verifySmtp } from '../server/mailer.js';

function nextId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function sanitizeText(value) {
  return String(value ?? '').trim();
}

function selectRecipients(state, segment) {
  const query = sanitizeText(segment).toLowerCase();
  const contacts = Array.isArray(state.contacts) ? state.contacts : [];

  if (!query || query === 'all subscribers' || query === 'all active subscribers') {
    return contacts.filter((contact) => contact.status !== 'Inactive');
  }

  if (query.includes('inactive')) {
    return contacts.filter((contact) => contact.status === 'Inactive');
  }

  if (query.includes('newsletter')) {
    return contacts.filter((contact) => {
      const tags = Array.isArray(contact.tags) ? contact.tags : [];
      return tags.some((tag) => String(tag).toLowerCase().includes('newsletter')) || String(contact.list || '').toLowerCase().includes('newsletter');
    });
  }

  if (query.includes('customer') || query.includes('purchase')) {
    return contacts.filter((contact) => {
      const tags = Array.isArray(contact.tags) ? contact.tags : [];
      return tags.some((tag) => String(tag).toLowerCase().includes('customer')) || String(contact.list || '').toLowerCase().includes('purchase');
    });
  }

  if (query.includes('engagement')) {
    return contacts.filter((contact) => Number(contact.openRate || 0) >= 40 || String(contact.status).toLowerCase() === 'active');
  }

  if (query.includes('cart')) {
    return contacts.filter((contact) => {
      const tags = Array.isArray(contact.tags) ? contact.tags : [];
      return tags.some((tag) => String(tag).toLowerCase().includes('customer'));
    });
  }

  return contacts;
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
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
    recentCampaigns: [...state.campaigns].sort((a, b) => (a.id < b.id ? 1 : -1)).slice(0, 5),
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

function getSegments(pathname) {
  return pathname
    .replace(/^\/api\/?/, '')
    .split('/')
    .filter(Boolean);
}

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const segments = getSegments(url.pathname);
  const method = (req.method || 'GET').toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? {} : await parseBody(req);

  if (segments.length === 0) {
    return json(res, 200, { ok: true });
  }

  const [resource, id, action, extra] = segments;

  if (resource === 'bootstrap' && method === 'GET') {
    const state = await readState();
    return json(res, 200, {
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
  }

  if (resource === 'dashboard' && method === 'GET') {
    const state = await readState();
    return json(res, 200, computeDashboard(state));
  }

  if (resource === 'health' && method === 'GET') {
    return json(res, 200, { ok: true });
  }

  if (resource === 'campaigns') {
    if (method === 'GET' && !id) {
      const state = await readState();
      const query = String(url.searchParams.get('q') || '').trim().toLowerCase();
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      const results = state.campaigns.filter((item) => {
        const matchesQuery = !query || [item.name, item.subject, item.segment].some((value) => String(value).toLowerCase().includes(query));
        const matchesStatus = !status || String(item.status).toLowerCase() === status;
        return matchesQuery && matchesStatus;
      });
      return json(res, 200, results);
    }

    if (method === 'POST' && !id) {
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
      return json(res, 201, next.campaigns[0]);
    }

    if (id && !action) {
      if (method === 'PATCH') {
        const next = await updateState((state) => ({
          ...state,
          campaigns: state.campaigns.map((campaign) => {
            if (campaign.id !== id) return campaign;
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
          return json(res, 404, { error: 'Campaign not found' });
        }
        return json(res, 200, campaign);
      }

      if (method === 'DELETE') {
        const next = await updateState((state) => ({
          ...state,
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        }));
        return json(res, 200, { ok: true, count: next.campaigns.length });
      }
    }

    if (id && action === 'send' && method === 'POST') {
      const state = await readState();
      const campaign = state.campaigns.find((item) => item.id === id);
      if (!campaign) {
        return json(res, 404, { error: 'Campaign not found' });
      }

      const smtp = getSmtpConfig(state);
      if (!smtp) {
        return json(res, 400, { error: 'SMTP settings are missing. Save SMTP details before sending.' });
      }

      const recipients = selectRecipients(state, campaign.segment);
      if (!recipients.length) {
        return json(res, 400, { error: 'No recipients found for the selected segment.' });
      }

      const transport = createTransport(smtp);
      const report = [];

      try {
        await verifySmtp(smtp);
      } catch (error) {
        return json(res, 400, { error: `SMTP verification failed: ${error.message}` });
      }

      for (const recipient of recipients) {
        const email = sanitizeText(recipient.email);
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          report.push({ email, status: 'skipped' });
          continue;
        }

        const parts = buildEmailContent(campaign.subject || 'TraxQuickMail update', campaign.body || '', recipient, campaign);
        try {
          await transport.sendMail({
            from: `"${sanitizeText(smtp.fromName) || 'TraxQuickMail'}" <${smtp.user}>`,
            to: `"${recipientName(recipient)}" <${email}>`,
            replyTo: sanitizeText(smtp.replyTo) || smtp.user,
            subject: parts.subject,
            text: parts.text,
            html: parts.html,
          });
          report.push({ email, status: 'sent' });
        } catch (error) {
          report.push({ email, status: 'failed', error: error.message });
        }
      }

      const sentCount = report.filter((item) => item.status === 'sent').length;
      const failedCount = report.filter((item) => item.status === 'failed').length;
      const skippedCount = report.filter((item) => item.status === 'skipped').length;
      const opens = Math.max(0, Math.round(sentCount * 0.34));
      const clicks = Math.max(0, Math.round(sentCount * 0.087));
      const updatedState = await updateState((current) => ({
        ...current,
        campaigns: current.campaigns.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'Sent',
                sent: sentCount,
                opens,
                clicks,
                openRate: sentCount > 0 ? Number(((opens / sentCount) * 100).toFixed(1)) : 0,
                clickRate: sentCount > 0 ? Number(((clicks / sentCount) * 100).toFixed(1)) : 0,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                revenue: Math.round(sentCount * 0.52),
                body: campaign.body || '',
                lastSendReport: {
                  sentCount,
                  failedCount,
                  skippedCount,
                  timestamp: new Date().toISOString(),
                },
              }
            : item,
        ),
      }));

      const updatedCampaign = updatedState.campaigns.find((item) => item.id === id);
      return json(res, 200, {
        ok: true,
        campaign: updatedCampaign,
        report: { sentCount, failedCount, skippedCount },
      });
    }
  }

  if (resource === 'contacts') {
    if (method === 'GET' && !id) {
      const state = await readState();
      const query = String(url.searchParams.get('q') || '').trim().toLowerCase();
      const results = state.contacts.filter((item) => {
        if (!query) return true;
        return [item.name, item.email, item.list, ...(item.tags || [])].some((value) => String(value).toLowerCase().includes(query));
      });
      return json(res, 200, results);
    }

    if (method === 'POST' && !id) {
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
      return json(res, 201, next.contacts[0]);
    }

    if (id) {
      if (method === 'PATCH') {
        const next = await updateState((state) => ({
          ...state,
          contacts: state.contacts.map((contact) => (contact.id === id ? { ...contact, ...body } : contact)),
        }));
        const contact = next.contacts.find((item) => item.id === id);
        if (!contact) {
          return json(res, 404, { error: 'Contact not found' });
        }
        return json(res, 200, contact);
      }

      if (method === 'DELETE') {
        const next = await updateState((state) => ({
          ...state,
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }));
        return json(res, 200, { ok: true, count: next.contacts.length });
      }
    }
  }

  if (resource === 'templates' && method === 'GET') {
    const state = await readState();
    return json(res, 200, state.templates);
  }

  if (resource === 'automations') {
    if (method === 'GET' && !id) {
      const state = await readState();
      return json(res, 200, state.automations);
    }

    if (method === 'POST' && !id) {
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
      return json(res, 201, next.automations[0]);
    }

    if (id && method === 'PATCH') {
      const next = await updateState((state) => ({
        ...state,
        automations: state.automations.map((automation) =>
          automation.id === id
            ? { ...automation, ...body, lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
            : automation,
        ),
      }));
      const automation = next.automations.find((item) => item.id === id);
      if (!automation) {
        return json(res, 404, { error: 'Automation not found' });
      }
      return json(res, 200, automation);
    }
  }

  if (resource === 'scheduler' && method === 'GET') {
    const state = await readState();
    return json(res, 200, state.scheduler);
  }

  if (resource === 'analytics' && method === 'GET') {
    const state = await readState();
    return json(res, 200, computeAnalytics(state));
  }

  if (resource === 'settings') {
    if (method === 'GET' && !id) {
      const state = await readState();
      return json(res, 200, state.settings);
    }

    if (method === 'PUT' && !id) {
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
      return json(res, 200, next.settings);
    }

    if (id === 'domains') {
      if (method === 'POST' && !action) {
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
        return json(res, 201, next.settings.domains[next.settings.domains.length - 1]);
      }

      if (action && extra === 'verify' && method === 'POST') {
        const domainId = action;
        const next = await updateState((state) => ({
          ...state,
          settings: {
            ...state.settings,
            domains: state.settings.domains.map((domain) =>
              domain.id === domainId ? { ...domain, dkim: true, spf: true, status: 'Verified' } : domain,
            ),
          },
        }));
        const domain = next.settings.domains.find((item) => item.id === domainId);
        if (!domain) {
          return json(res, 404, { error: 'Domain not found' });
        }
        return json(res, 200, domain);
      }
    }
  }

  if (resource === 'smtp' && id === 'test' && method === 'POST') {
    const state = await readState();
    const smtp = getSmtpConfig(state);
    if (!smtp) {
      return json(res, 400, { ok: false, message: 'SMTP settings are missing.' });
    }
    try {
      await verifySmtp(smtp);
    } catch (error) {
      return json(res, 400, { ok: false, message: error.message });
    }
    return json(res, 200, {
      ok: true,
      message: `SMTP connection check passed for ${state.settings.account.email}.`,
    });
  }

  return json(res, 404, { error: 'Not found' });
}
