// Always relative — Next.js rewrites /api/* to the backend internally.
// See next.config.ts:rewrites().
const API_BASE = '/api';

export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
  /** Honeypot — must remain empty for real users. */
  website?: string;
}

interface RawContactResponse {
  success: boolean;
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

export type ContactSuccessCode = 'sent' | 'savedPending';
export type ContactErrorCode = 'validation' | 'network' | 'server';

export type ContactResult =
  | { ok: true; code: ContactSuccessCode }
  | { ok: false; code: ContactErrorCode; fieldErrors?: Record<string, string> };

export async function submitContactForm(data: ContactRequest): Promise<ContactResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    return { ok: false, code: 'network' };
  }

  let body: RawContactResponse | null = null;
  try {
    body = (await response.json()) as RawContactResponse;
  } catch {
    /* non-JSON body — fall through */
  }

  if (response.ok && body?.success) {
    return {
      ok: true,
      code: body.code === 'saved_pending_email' ? 'savedPending' : 'sent',
    };
  }

  if (response.status === 400 && body?.code === 'validation_error') {
    return { ok: false, code: 'validation', fieldErrors: body.fieldErrors };
  }

  return { ok: false, code: 'server' };
}
