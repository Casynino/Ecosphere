'use client';

import { CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { buttonClass } from '@/components/ui/ButtonLink';
import { submitContact, type ContactState } from '@/lib/contact/action';
import {
  contactFields,
  NOT_SURE,
  readContactForm,
  validateContact,
  type ContactField,
  type FieldErrors,
} from '@/lib/contact/schema';

type Option = { value: string; label: string };

const inputClass =
  'mt-2 block w-full rounded-xl border border-snow/15 bg-snow/5 px-4 py-3 text-base text-snow transition-colors placeholder:text-mist/60 hover:border-snow/35 focus:border-lime focus:bg-snow/10 aria-[invalid=true]:border-red-400';

/** Consultation request form. Remounting it (new key) gives a fresh, empty form. */
export function ContactForm({ services }: { services: Option[] }) {
  const [formKey, setFormKey] = useState(0);
  return <Form key={formKey} services={services} onReset={() => setFormKey((key) => key + 1)} />;
}

function Form({ services, onReset }: { services: Option[]; onReset: () => void }) {
  const t = useTranslations('contactForm');
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' });
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Pre-select the service when arriving from a "Request this service" button
  // (/contact?service=<slug>).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('service');
    if (requested && serviceRef.current && services.some((service) => service.value === requested)) {
      serviceRef.current.value = requested;
    }
  }, [services]);

  // Move keyboard and screen-reader focus to the result message.
  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus();
  }, [state]);

  const errors: FieldErrors = clientErrors ?? (state.status === 'error' ? state.fieldErrors : undefined) ?? {};
  const saved = state.status === 'error' ? state.values : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = validateContact(readContactForm(formData));

    if (!result.ok) {
      setClientErrors(result.errors);
      const firstInvalid = contactFields.find((field) => result.errors[field]);
      if (firstInvalid) (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setClientErrors(null);
    startTransition(() => formAction(formData));
  }

  if (state.status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="py-6 text-center outline-none sm:py-10">
        <CircleCheck className="mx-auto h-14 w-14 text-lime" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="mt-5 text-2xl text-snow sm:text-3xl">{t('successTitle')}</h2>
        <p className="mx-auto mt-3 max-w-md text-mist">{t('successBody')}</p>
        <button type="button" onClick={onReset} className={buttonClass('outline', 'mt-7')}>
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  const field = (name: ContactField, label: string, control: (props: FieldProps) => ReactNode, optional = false) => {
    const error = errors[name];
    return (
      <div>
        <label htmlFor={name} className="block font-semibold text-snow">
          {label}
          {optional && <span className="ml-1.5 font-normal text-mist">({t('optional')})</span>}
        </label>
        {control({
          id: name,
          name,
          defaultValue: saved?.[name] ?? '',
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? `${name}-error` : undefined,
          className: inputClass,
        })}
        {error && (
          <p id={`${name}-error`} className="mt-1.5 text-sm font-semibold text-red-300">
            {t(`errors.${error}`)}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="fax_number">{t('honeypot')}</label>
        <input id="fax_number" name="fax_number" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {field('name', t('name'), (props) => <input {...props} type="text" autoComplete="name" required />)}
      {field('organisation', t('organisation'), (props) => <input {...props} type="text" autoComplete="organization" />, true)}
      {field('email', t('email'), (props) => <input {...props} type="email" autoComplete="email" inputMode="email" required />)}
      {field('phone', t('phone'), (props) => <input {...props} type="tel" autoComplete="tel" inputMode="tel" />, true)}

      <div className="sm:col-span-2">
        {field('service', t('service'), (props) => (
          <select {...props} ref={serviceRef} required>
            <option value="">{t('servicePlaceholder')}</option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
            <option value={NOT_SURE}>{t('notSure')}</option>
          </select>
        ))}
      </div>

      <div className="sm:col-span-2">
        {field('message', t('message'), (props) => (
          <textarea {...props} rows={6} required placeholder={t('messageHint')} />
        ))}
      </div>

      <div className="sm:col-span-2">
        {state.status === 'error' && !clientErrors && (
          <div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            className="mb-5 flex gap-3 rounded-xl border border-red-400/40 bg-red-500/10 p-4 font-semibold text-red-200 outline-none"
          >
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {t(`errors.${state.error}`)}
          </div>
        )}
        <button type="submit" disabled={pending} className={buttonClass('lime', 'w-full disabled:opacity-70 sm:w-auto')}>
          {pending ? (
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-5 w-5" aria-hidden="true" />
          )}
          {pending ? t('sending') : t('submit')}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  name: string;
  defaultValue: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
  className: string;
};
