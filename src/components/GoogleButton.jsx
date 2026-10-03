import { useEffect, useRef, useState } from 'react';

let scriptPromise;
let initialized = false;
let credentialHandler;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client?hl=fr';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => { script.remove(); scriptPromise = null; reject(new Error('Google est indisponible. Vous pouvez continuer par email.')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export default function GoogleButton({ onCredential, disabled }) {
  const container = useRef(null);
  const callback = useRef(onCredential);
  const busy = useRef(disabled);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  callback.current = onCredential;
  busy.current = disabled;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    let active = true;
    let observer;
    const timer = setTimeout(() => {
      if (active) setError('Google met du temps à répondre. La connexion par email reste disponible.');
    }, 12000);
    loadGoogle().then(() => {
      if (!active) return;
      clearTimeout(timer);
      setError('');
      credentialHandler = (credential) => { if (active && !busy.current) callback.current(credential); };
      if (!initialized) {
        window.google.accounts.id.initialize({ client_id: clientId, ux_mode: 'popup', auto_select: false,
          callback: ({ credential }) => credentialHandler?.(credential),
        });
        initialized = true;
      }
      let previousWidth = 0;
      function renderButton() {
        if (!active || !container.current) return;
        const width = Math.min(Math.floor(container.current.clientWidth), 400);
        if (width < 200 || width === previousWidth) return;
        previousWidth = width;
        container.current.replaceChildren();
        window.google.accounts.id.renderButton(container.current, {
          theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', locale: 'fr', logo_alignment: 'center', width,
        });
      }
      renderButton();
      observer = new ResizeObserver(renderButton);
      observer.observe(container.current);
      setReady(true);
    }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; clearTimeout(timer); observer?.disconnect(); };
  }, [clientId]);

  if (!clientId) return <p className="muted small">La connexion Google n’est pas configurée.</p>;
  return <div className="google-area" aria-busy={!ready && !error}>
    <div ref={container} className={disabled ? 'google-disabled' : ''} inert={disabled ? true : undefined} />
    {!ready && !error && <p className="muted small" role="status">Chargement de Google…</p>}
    {error && <p className="muted small" role="status">{error}</p>}
  </div>;
}
