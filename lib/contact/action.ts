'use server';

import { headers } from 'next/headers';
import { sendContactEmail } from './email';
import { allowRequest } from './rate-limit';
import { readContactForm, validateContact, type ContactValues, type FieldErrors } from './schema';

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error';
      error: 'validation' | 'rate' | 'config' | 'send';
      fieldErrors?: FieldErrors;
      /** What the visitor typed, so the form can be refilled if the page reloads. */
      values: ContactValues;
    };

/** Server action behind the contact form. */
export async function submitContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: a hidden field people never see. If it is filled in, a bot did it.
  // Pretend all went well so the bot learns nothing.
  if (formData.get('fax_number')) return { status: 'success' };

  const values = readContactForm(formData);
  const result = validateContact(values);
  if (!result.ok) return { status: 'error', error: 'validation', fieldErrors: result.errors, values };

  const visitor = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allowRequest(visitor)) return { status: 'error', error: 'rate', values };

  const locale = formData.get('locale') === 'sw' ? 'sw' : 'en';
  const outcome = await sendContactEmail(result.data, locale);

  if (outcome === 'sent' || outcome === 'logged') return { status: 'success' };
  return { status: 'error', error: outcome === 'not-configured' ? 'config' : 'send', values };
}
