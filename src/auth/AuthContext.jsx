import { createContext, useContext, useEffect, useState } from 'react';
import { api, configureSession } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function clearSession() {
    configureSession(null);
    setAccount(null);
  }

  function acceptSession(data) {
    configureSession(data.csrfToken, clearSession);
    setAccount(data);
    setError('');
  }

  async function refresh(signal) {
    setLoading(true);
    setError('');
    try { acceptSession(await api('/me', { signal })); }
    catch (err) {
      if (signal?.aborted) return;
      if (err.status === 401) clearSession();
      else setError(err.message);
    } finally { if (!signal?.aborted) setLoading(false); }
  }

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, []);

  async function logout() {
    await api('/auth/logout', { method: 'POST', body: {} });
    clearSession();
  }

  return <AuthContext.Provider value={{ account, loading, error, refresh, acceptSession, logout }}>
    {children}
  </AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
