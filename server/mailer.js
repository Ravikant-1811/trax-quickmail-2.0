import nodemailer from 'nodemailer';

function sanitizePort(value) {
  const port = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(port) ? port : 587;
}

export function getSmtpConfig(state = {}) {
  const smtp = state.settings?.smtp || {};
  const host = String(process.env.SMTP_HOST || smtp.host || '').trim();
  const port = sanitizePort(process.env.SMTP_PORT || smtp.port || 587);
  const user = String(process.env.SMTP_USER || smtp.user || '').trim();
  const pass = String(process.env.SMTP_PASS || smtp.pass || '').trim();
  const fromName = String(process.env.SMTP_FROM_NAME || smtp.fromName || state.settings?.account?.name || 'TraxQuickMail').trim();
  const replyTo = String(process.env.SMTP_REPLY_TO || smtp.replyTo || state.settings?.account?.email || user).trim();

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    fromName,
    replyTo,
    secure: port === 465,
  };
}

export function createTransport(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function bodyContainsHtml(body) {
  return /<\s*(p|br|div|span|strong|em|ul|ol|li|a|h[1-6]|blockquote|table|tr|td|th|img|section|article|header|footer|figure|pre|code)\b/i.test(
    body,
  );
}

function bodyToText(body) {
  const text = String(body)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6]|tr|section|article|header|footer|blockquote)\s*>/gi, '\n')
    .replace(/<\s*\/?tr\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '');

  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export function recipientName(recipient) {
  const name = String(recipient?.name || '').trim();
  if (name) return name;
  const email = String(recipient?.email || '').trim();
  if (!email) return 'there';
  return email.split('@')[0];
}

function personalizeText(text, recipient, campaign = {}) {
  const name = recipientName(recipient);
  const firstName = name.split(' ')[0] || name;
  const email = String(recipient?.email || '');
  const campaignName = String(campaign?.campaign_name || campaign?.name || 'TraxQuickMail');
  const subject = String(campaign?.subject || '');

  return String(text).replace(/\{\{name\}\}|\[name\]|\[Name\]/g, name)
    .replace(/\{\{first_name\}\}|\[first_name\]|\[First Name\]|\[First name\]|\[First_Name\]/g, firstName)
    .replace(/\{\{email\}\}|\[email\]|\[Email\]/g, email)
    .replace(/\{\{campaign_name\}\}|\[campaign_name\]|\[Campaign Name\]/g, campaignName)
    .replace(/\{\{subject\}\}|\[subject\]|\[Subject\]/g, subject);
}

export function buildEmailContent(subject, body, recipient, campaign = {}) {
  const resolvedSubject = personalizeText(subject, recipient, campaign);
  const resolvedBody = personalizeText(body, recipient, campaign);
  const isHtml = bodyContainsHtml(resolvedBody);
  const text = isHtml ? bodyToText(resolvedBody) : resolvedBody;
  const html = isHtml
    ? resolvedBody
    : `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">${escapeHtml(resolvedBody).replace(/\n/g, '<br>')}</div>`;

  return {
    subject: resolvedSubject,
    text,
    html,
  };
}

export async function verifySmtp(config) {
  const transport = createTransport(config);
  await transport.verify();
  return transport;
}

export async function sendCampaignBatch({
  smtp,
  subject,
  body,
  campaign,
  recipients,
  delaySeconds = 0,
  onResult,
}) {
  const transport = createTransport(smtp);
  const results = {
    sent: 0,
    failed: 0,
    total: recipients.length,
    details: [],
  };

  for (const recipient of recipients) {
    const email = String(recipient?.email || '').trim();
    if (!email) {
      results.failed += 1;
      results.details.push({ email: '', ok: false, reason: 'Missing email' });
      if (onResult) onResult({ recipient, ok: false, reason: 'Missing email' });
      continue;
    }

    const content = buildEmailContent(subject, body, recipient, campaign);
    const info = await transport.sendMail({
      from: `"${smtp.fromName}" <${smtp.user}>`,
      to: `"${recipientName(recipient)}" <${email}>`,
      replyTo: smtp.replyTo,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    results.sent += 1;
    results.details.push({ email, ok: true, messageId: info.messageId || null });
    if (onResult) onResult({ recipient, ok: true, info });

    if (delaySeconds > 0) {
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
    }
  }

  return results;
}
