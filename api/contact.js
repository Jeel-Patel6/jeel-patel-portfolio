/**
 * POST /api/contact — serverless email endpoint.
 *
 * Deployment: Vercel Node function (the `api/` directory is auto-detected).
 * During `npm run dev` the same handler is mounted by the Vite dev server
 * (see `contactApi()` in vite.config.ts) so the form can be tested locally.
 *
 * Delivery uses Resend's HTTPS API directly, so no SDK/dependency is needed:
 *   RESEND_API_KEY   server-side only — never prefixed with VITE_
 *   CONTACT_FROM     verified sender, e.g. "Portfolio <hello@yourdomain.com>"
 *                    (for testing, Resend's "onboarding@resend.dev" only
 *                    delivers to the account owner's address)
 *   CONTACT_TO       inbox that receives messages (default: jeelpatel611@gmail.com)
 *
 * The browser only ever sees { ok: true } or { ok: false, error } — provider
 * responses, stack traces and configuration details stay on the server.
 */

const DEFAULT_RECIPIENT = 'jeelpatel611@gmail.com';
const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

const LIMITS = {
  name: [2, 120],
  email: [3, 254],
  subject: [2, 160],
  message: [10, 5000],
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const INQUIRY_TYPES = new Set(['', 'Project Collaboration', 'Internship Opportunity', 'Technical Discussion', 'Other']);

/** Requests per IP, per warm serverless instance (basic spam protection). */
const rateHits = new Map();

const stripControl = (value) =>
  String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

/** Single-line field: trims, collapses newlines (header-injection safe). */
const singleLine = (value) => stripControl(value).replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

/** Multiline field: keeps line breaks, caps consecutive blank lines. */
const multiline = (value) => stripControl(value).replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function clientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return String(raw || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

function rateLimited(ip) {
  const now = Date.now();
  if (rateHits.size > 5000) rateHits.clear();
  const entry = rateHits.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateHits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
    return JSON.parse(String(req.body));
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('payload_too_large');
      error.code = 'TOO_LARGE';
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  if (rateLimited(clientIp(req))) {
    return send(res, 429, { ok: false, error: 'Too many messages in a short time. Please try again in a minute.' });
  }

  let data;
  try {
    data = await readBody(req);
  } catch (error) {
    if (error?.code === 'TOO_LARGE') {
      return send(res, 413, { ok: false, error: 'That message is too large.' });
    }
    return send(res, 400, { ok: false, error: 'Invalid request.' });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return send(res, 400, { ok: false, error: 'Invalid request.' });
  }

  // Honeypot: bots that fill every field get a fake success, nothing is sent.
  if (singleLine(data.company)) return send(res, 200, { ok: true });

  const name = singleLine(data.name);
  const email = singleLine(data.email).toLowerCase();
  const subject = singleLine(data.subject);
  const inquiryType = singleLine(data.inquiryType);
  const message = multiline(data.message);

  const fields = {};
  if (name.length < LIMITS.name[0] || name.length > LIMITS.name[1]) {
    fields.name = `Please enter your name (${LIMITS.name[0]}–${LIMITS.name[1]} characters).`;
  }
  if (email.length > LIMITS.email[1] || !EMAIL_RE.test(email)) {
    fields.email = 'Please enter a valid email address.';
  }
  if (subject.length < LIMITS.subject[0] || subject.length > LIMITS.subject[1]) {
    fields.subject = `Please add a subject (${LIMITS.subject[0]}–${LIMITS.subject[1]} characters).`;
  }
  if (message.length < LIMITS.message[0] || message.length > LIMITS.message[1]) {
    fields.message = `Please write a message (${LIMITS.message[0]}–${LIMITS.message[1]} characters).`;
  }
  if (!INQUIRY_TYPES.has(inquiryType)) {
    fields.inquiryType = 'Please choose one of the listed inquiry types.';
  }
  if (Object.keys(fields).length > 0) {
    return send(res, 422, { ok: false, error: 'Please check the highlighted fields.', fields });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set — message was not delivered.');
    return send(res, 503, {
      ok: false,
      error: `Email delivery isn't configured yet. Please email me directly at ${process.env.CONTACT_TO || DEFAULT_RECIPIENT}.`,
    });
  }

  const sentAt = new Date().toISOString();
  const body = [
    'New message from the portfolio contact form.',
    '',
    `Name:          ${name}`,
    `Email:         ${email}`,
    `Subject:       ${subject}`,
    `Inquiry type:  ${inquiryType || 'Not specified'}`,
    `Submitted:     ${sentAt}`,
    '',
    'Message:',
    '--------',
    message,
  ].join('\n');

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Portfolio Contact <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO || DEFAULT_RECIPIENT],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: body,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error('[contact] Resend request failed:', error?.message || error);
    return send(res, 502, {
      ok: false,
      error: 'The message could not be sent right now. Please try again, or email me directly.',
    });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[contact] Resend rejected the message:', response.status, detail.slice(0, 500));
    return send(res, 502, {
      ok: false,
      error: 'The message could not be sent right now. Please try again, or email me directly.',
    });
  }

  return send(res, 200, { ok: true });
}
