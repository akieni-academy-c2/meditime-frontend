import { useState } from 'react';
import BottomSheet from '../components/BottomSheet.jsx';
import { AuthButton } from '../components/AuthUI.jsx';

export default function InstallSheet({ open, onOpenChange, canInstall = false, onInstall }) {
  const [instructions, setInstructions] = useState(false);
  const [busy, setBusy] = useState(false);
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function changeOpen(value) {
    if (!value) setInstructions(false);
    onOpenChange(value);
  }
  async function handleInstall() {
    if (!canInstall) { setInstructions(true); return; }
    setBusy(true);
    try {
      const outcome = await onInstall();
      if (outcome === 'unavailable') setInstructions(true);
      else changeOpen(false);
    } finally { setBusy(false); }
  }
  return <BottomSheet open={open} onOpenChange={changeOpen} className="install-sheet" headerMedia={<img className="install-logo" src="/icons/app-192.png" width="88" height="88" alt="" />} title="MediTime" description="Vos rendez-vous médicaux, simplement." footer={<><AuthButton disabled={busy} onClick={handleInstall}>{busy ? 'Ouverture…' : 'Installer MediTime'}</AuthButton><button className="install-later" type="button" onClick={() => changeOpen(false)}>Plus tard</button></>}>
    <div className="install-intro"><h3>Votre santé, à portée de main</h3><p>Ajoutez MediTime à votre écran d’accueil pour ouvrir l’application directement depuis votre téléphone.</p></div>
    {instructions && <div className="install-instructions" role="status"><strong>Installer depuis votre navigateur</strong>{ios ? <ol><li>Ouvrez le menu de partage du navigateur.</li><li>Choisissez « Sur l’écran d’accueil », puis « Ajouter ».</li></ol> : <ol><li>Ouvrez le menu de votre navigateur.</li><li>Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil » et confirmez.</li></ol>}<p>Si cette option n’apparaît pas, ouvrez MediTime dans Safari sur iPhone ou Chrome sur Android.</p></div>}
  </BottomSheet>;
}
