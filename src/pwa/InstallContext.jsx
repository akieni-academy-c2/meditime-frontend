import { createContext, useContext, useEffect, useState } from 'react';

const InstallContext = createContext(null);
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

export function InstallProvider({ children }) {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone);
  useEffect(() => {
    const query = window.matchMedia('(display-mode: standalone)');
    const onPrompt = event => { event.preventDefault(); setPrompt(event); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    const onDisplayChange = () => setInstalled(isStandalone());
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    query.addEventListener('change', onDisplayChange);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      query.removeEventListener('change', onDisplayChange);
    };
  }, []);
  async function install() {
    if (!prompt) return 'unavailable';
    // A browser prompt can only be used once and must follow a user gesture.
    setPrompt(null);
    try {
      await prompt.prompt();
      return (await prompt.userChoice).outcome;
    } catch { return 'unavailable'; }
  }
  return <InstallContext.Provider value={{ installed, canInstall: Boolean(prompt), install }}>{children}</InstallContext.Provider>;
}

export const useInstall = () => useContext(InstallContext);
