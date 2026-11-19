import { services } from '@/content/services';
import { NOT_SURE, type ContactInput } from './schema';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ');

export type SendResult = 'sent' | 'logged' | 'not-configured' | 'failed';

/**
 * Emails a consultation request to the company through Resend.
 * Needs RESEND_API_KEY and CONTACT_TO_EMAIL (see .env.example).
 */
export async function sendContactEmail(input: ContactInput, locale: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || 'Ecosphere Solutions website <onboarding@resend.dev>';

  const service =
    input.service === NOT_SURE
      ? 'Not sure yet'
      : (services.find((item) => item.slug === input.service)?.title.en ?? input.service);

  const rows: [string, string][] = [
    ['Full name', input.name],
    ['Organisation', input.organisation || '-'],
    ['Email', input.email],
    ['Phone', input.phone || '-'],
    ['Service needed', service],
    ['Site language', locale === 'sw' ? 'Swahili' : 'English'],
  ];

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== 'production') {
      // Local development without keys: show the request in the terminal instead.
      console.info('[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not set. Request was not emailed:', {
        ...Object.fromEntries(rows),
        message: input.message,
      });
      return 'logged';
    }
    console.error('[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is missing.');
    return 'not-configured';
  }

  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nProject details:\n${input.message}`;
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`)
    .join('')}</table><p style="font-family:Arial,sans-serif;font-size:14px"><strong>Project details</strong><br>${escapeHtml(
    input.message,
  ).replace(/\n/g, '<br>')}</p>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: oneLine(`Consultation request: ${input.name} (${service})`),
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error('[contact] Resend rejected the email:', response.status, await response.text());
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error('[contact] Could not reach Resend:', error);
    return 'failed';
  }
}
