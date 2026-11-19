import { z } from 'zod';
import { services } from '@/content/services';

// One set of rules for the contact form, used in the browser and on the server.
// Error messages are codes; the matching text lives in messages/*.json
// under contactForm.errors.

export const NOT_SURE = 'not-sure';
export const serviceValues = [...services.map((service) => service.slug), NOT_SURE];

export const contactFields = ['name', 'organisation', 'email', 'phone', 'service', 'message'] as const;
export type ContactField = (typeof contactFields)[number];
export type ContactValues = Record<ContactField, string>;

export type ContactErrorCode =
  | 'nameRequired'
  | 'emailInvalid'
  | 'phoneInvalid'
  | 'serviceRequired'
  | 'messageShort'
  | 'tooLong';
export type FieldErrors = Partial<Record<ContactField, ContactErrorCode>>;

const text = (max: number) => z.string().trim().max(max, 'tooLong');

export const contactSchema = z.object({
  name: text(120).min(2, 'nameRequired'),
  organisation: text(160),
  email: text(200).pipe(z.email('emailInvalid')),
  phone: text(40).refine((value) => value === '' || /^\+?[\d\s().-]{7,}$/.test(value), 'phoneInvalid'),
  service: z.string().refine((value) => serviceValues.includes(value), 'serviceRequired'),
  message: text(5000).min(20, 'messageShort'),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Picks the form fields out of a submitted form as plain strings. */
export function readContactForm(formData: FormData): ContactValues {
  const values = {} as ContactValues;
  for (const field of contactFields) {
    const value = formData.get(field);
    values[field] = typeof value === 'string' ? value : '';
  }
  return values;
}

export function validateContact(values: ContactValues) {
  const result = contactSchema.safeParse(values);
  if (result.success) return { ok: true as const, data: result.data };

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    errors[field] ??= issue.message as ContactErrorCode;
  }
  return { ok: false as const, errors };
}
