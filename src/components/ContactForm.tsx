import { useId, useRef, useState, type FormEvent } from 'react';
import { profile } from '../data/portfolio';

const INQUIRY_TYPES = ['', 'Project Collaboration', 'Internship Opportunity', 'Technical Discussion', 'Other'] as const;
type InquiryType = (typeof INQUIRY_TYPES)[number];

type Values = {
  name: string;
  email: string;
  subject: string;
  inquiryType: InquiryType;
  message: string;
};

type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'sending' | 'success' | 'error';

const EMPTY: Values = { name: '', email: '', subject: '', inquiryType: '', message: '' };
const LIMITS = { name: 120, email: 254, subject: 160, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const SUCCESS_MESSAGE =
  "Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon.";
const FAILURE_MESSAGE = 'Something went wrong. Please try again.';
const DIRECT_EMAIL = profile.email ? `You can also email me directly at ${profile.email}.` : '';

function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  if (subject.length < 2) errors.subject = 'Please add a subject.';
  else if (subject.length > LIMITS.subject) errors.subject = `Please keep the subject under ${LIMITS.subject} characters.`;

  if (message.length < 10) errors.message = 'Please write at least a short sentence.';
  else if (message.length > LIMITS.message) errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  if (!INQUIRY_TYPES.includes(values.inquiryType)) errors.inquiryType = 'Please choose one of the listed inquiry types.';

  return errors;
}

/**
 * Contact form. Posts to `/api/contact` (the serverless handler in `api/contact.js`,
 * bridged into the dev server by `vite.config.ts`). Success is shown only after the
 * backend confirms delivery; failures keep every value so the visitor can retry.
 */
export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');
  const [failureHint, setFailureHint] = useState('');
  const [company, setCompany] = useState(''); // honeypot — humans never see it
  const inFlight = useRef(false);

  const sending = status === 'sending';
  const id = (name: FieldName | 'company') => `${uid}-${name}`;

  const setField = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }) as Values);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === 'error' || status === 'success') {
      setStatus('idle');
      setFormError('');
      setFailureHint('');
    }
  };

  const fieldClass = (name: FieldName) =>
    [
      'w-full rounded-xl border bg-white px-4 py-3 text-base text-ink transition-colors',
      'placeholder:text-faint focus:outline-none focus:ring-2',
      errors[name]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-line focus:border-blue focus:ring-blue/20',
    ].join(' ');

  const describedBy = (name: FieldName) => (errors[name] ? id(name) + '-error' : undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setFormError('Please check the highlighted fields and try again.');
      setFailureHint('');
      const first = (Object.keys(nextErrors) as FieldName[])[0];
      document.getElementById(id(first))?.focus();
      return;
    }

    inFlight.current = true;
    setStatus('sending');
    setFormError('');
    setFailureHint('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          inquiryType: values.inquiryType,
          message: values.message.trim(),
          company,
        }),
        signal: AbortSignal.timeout(20_000),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; fields?: Record<string, string> }
        | null;

      if (response.ok && data?.ok) {
        setValues(EMPTY);
        setErrors({});
        setStatus('success');
        return;
      }

      const serverFields = data?.fields;
      if (serverFields) {
        const mapped: Errors = {};
        for (const key of Object.keys(serverFields)) {
          if (key in EMPTY) mapped[key as FieldName] = serverFields[key];
        }
        setErrors(mapped);
      }
      setStatus('error');
      // The visitor-facing failure copy is fixed; the hint only adds the next step.
      setFormError(FAILURE_MESSAGE);
      if (response.status === 503) {
        setFailureHint(`Email delivery is not configured yet. ${DIRECT_EMAIL}`.trim());
      } else if (response.status === 429) {
        setFailureHint(data?.error || DIRECT_EMAIL);
      } else if (response.status >= 500) {
        setFailureHint(DIRECT_EMAIL);
      }
    } catch {
      setStatus('error');
      setFormError(FAILURE_MESSAGE);
      setFailureHint(`Please check your connection and try again. ${DIRECT_EMAIL}`.trim());
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-8 border-t border-line pt-8 text-left">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-mute">
        <span aria-hidden className="text-blue">*</span> Required fields
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className="mb-2 block text-sm font-semibold text-slate">
            Full Name <span aria-hidden className="text-blue">*</span>
          </label>
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            maxLength={LIMITS.name}
            placeholder="Your name"
            className={fieldClass('name')}
          />
          {errors.name && (
            <p id={id('name') + '-error'} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id('email')} className="mb-2 block text-sm font-semibold text-slate">
            Email Address <span aria-hidden className="text-blue">*</span>
          </label>
          <input
            id={id('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            maxLength={LIMITS.email}
            placeholder="you@example.com"
            className={fieldClass('email')}
          />
          {errors.email && (
            <p id={id('email') + '-error'} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <label htmlFor={id('subject')} className="mb-2 block text-sm font-semibold text-slate">
            Subject <span aria-hidden className="text-blue">*</span>
          </label>
          <input
            id={id('subject')}
            name="subject"
            type="text"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={describedBy('subject')}
            value={values.subject}
            onChange={(e) => setField('subject', e.target.value)}
            maxLength={LIMITS.subject}
            placeholder="What is this about?"
            className={fieldClass('subject')}
          />
          {errors.subject && (
            <p id={id('subject') + '-error'} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id('inquiryType')} className="mb-2 block text-sm font-semibold text-slate">
            Inquiry Type <span className="font-normal text-mute">(optional)</span>
          </label>
          <div className="relative">
            <select
              id={id('inquiryType')}
              name="inquiryType"
              aria-invalid={Boolean(errors.inquiryType)}
              aria-describedby={describedBy('inquiryType')}
              value={values.inquiryType}
              onChange={(e) => setField('inquiryType', e.target.value)}
              className={`${fieldClass('inquiryType')} appearance-none pr-10`}
            >
              <option value="">Select one</option>
              {INQUIRY_TYPES.filter(Boolean).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute">
              ▾
            </span>
          </div>
          {errors.inquiryType && (
            <p id={id('inquiryType') + '-error'} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
              {errors.inquiryType}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={id('message')} className="mb-2 block text-sm font-semibold text-slate">
          Message <span aria-hidden className="text-blue">*</span>
        </label>
        <textarea
          id={id('message')}
          name="message"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message')}
          value={values.message}
          onChange={(e) => setField('message', e.target.value)}
          maxLength={LIMITS.message}
          rows={5}
          placeholder="Tell me about your project, opportunity, or idea..."
          className={`${fieldClass('message')} resize-y leading-relaxed`}
        />
        <div className="mt-1.5 flex items-start justify-between gap-4">
          {errors.message ? (
            <p id={id('message') + '-error'} role="alert" className="text-sm font-medium text-red-600">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span aria-hidden className="shrink-0 text-xs tabular-nums text-faint">
            {values.message.length}/{LIMITS.message}
          </span>
        </div>
      </div>

      {/* Honeypot — hidden from people and assistive tech; bots fill it in and the
          server silently accepts without sending anything. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={id('company')}>Company</label>
        <input
          id={id('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Live region stays mounted so the success text is announced reliably. */}
      <div role="status" aria-live="polite" className="mt-5 empty:hidden">
        {status === 'sending' && <p className="sr-only">Sending message...</p>}
        {status === 'success' && (
          <div className="rounded-xl border border-green/50 bg-green/10 px-4 py-3 text-[15px] font-medium leading-relaxed text-ink">
            {SUCCESS_MESSAGE}
          </div>
        )}
      </div>

      {status === 'error' && formError && (
        <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{formError}</p>
          {failureHint && <p className="mt-1 text-sm leading-relaxed text-red-700/80">{failureHint}</p>}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-8 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-ink-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending && (
            <span
              aria-hidden
              className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin"
            />
          )}
          {sending ? 'Sending message...' : 'Send Message'}
        </button>
        <p className="text-xs leading-relaxed text-mute">Your details are only used to reply to this message.</p>
      </div>
    </form>
  );
}
