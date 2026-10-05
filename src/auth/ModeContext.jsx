import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const ModeContext = createContext(null);
export function ModeProvider({ children }) {
  const { account } = useAuth();
  const [preferred, setPreferred] = useState(() => {
    try { return sessionStorage.getItem('meditime-mode') || 'patient'; } catch { return 'patient'; }
  });
  const allowedModes = account?.allowedModes || [];
  const mode = allowedModes.includes(preferred) ? preferred : 'patient';
  function changeMode(value) {
    if (!allowedModes.includes(value)) return;
    setPreferred(value);
    try { sessionStorage.setItem('meditime-mode', value); } catch { /* Display preference only. */ }
  }
  return <ModeContext.Provider value={{ mode, allowedModes, changeMode }}>{children}</ModeContext.Provider>;
}
export const useMode = () => useContext(ModeContext);
