import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useInstall } from './InstallContext.jsx';
import InstallSheet from './InstallSheet.jsx';

const dismissalKey = 'meditime-install-dismissed';
function wasDismissed() {
  try { return sessionStorage.getItem(dismissalKey) === 'yes'; }
  catch { return false; }
}

export default function InstallAfterLogin() {
  const { account, loading } = useAuth();
  const { installed, canInstall, install } = useInstall();
  const [dismissed, setDismissed] = useState(wasDismissed);
  const open = Boolean(account) && !loading && !installed && !dismissed;
  function onOpenChange(value) {
    if (!value) {
      setDismissed(true);
      try { sessionStorage.setItem(dismissalKey, 'yes'); } catch { /* In-memory dismissal still works. */ }
    }
  }
  return <InstallSheet open={open} onOpenChange={onOpenChange} canInstall={canInstall} onInstall={install} />;
}
