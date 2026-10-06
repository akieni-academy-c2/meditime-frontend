// Production sessions must stay on the site's origin, including preview builds.
// Keep an explicit local API address for development (for example Gmail SMTP).
const baseUrl = import.meta.env.PROD
  ? '/api/v1'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1').replace(/\/$/, '');
let csrfToken = null;
let sessionExpired = () => {};

export function configureSession(token, onExpired) {
  csrfToken = token || null;
  sessionExpired = onExpired || (() => {});
}

export class ApiError extends Error {
  constructor(message, status = 0, code = 'NETWORK_ERROR', retryAfter = 0) {
    super(message);
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method, credentials: 'include', cache: 'no-store',
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(45000)]) : AbortSignal.timeout(45000),
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(method !== 'GET' && csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError('Le service ne répond pas. Vérifiez votre connexion et réessayez.');
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/')) sessionExpired();
    const retryHeader = response.headers.get('Retry-After');
    const retryAfter = Number(retryHeader) || data?.retryAfter || 0;
    throw new ApiError(data?.error?.message || 'Une erreur est survenue. Réessayez.', response.status, data?.error?.code, retryAfter);
  }
  if (data === null) throw new ApiError('La réponse du service est illisible. Réessayez.', response.status, 'INVALID_RESPONSE');
  return data;
}
