import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Baby, CalendarDays, Heart, House, Search, Stethoscope, Sun, UserRound, X } from 'lucide-react';
import { Brand } from './Brand.jsx';
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from './ui/dialog.jsx';
import { Dialog as DialogPrimitive } from 'radix-ui';
import '../desktop.css';

// A presentation of the patient home, using the same icons as the application.
// It is intentionally independent of the signed-in account and makes no API calls.
function PhonePreview() {
  return <div className="gateway-phone" aria-hidden="true">
    <img className="gateway-hand" src="/illustrations/mobile-in-hand.webp" width="1024" height="1536" alt="" />
    <div className="gateway-phone-screen">
      <div className="preview-island" />
      <div className="preview-body">
        <div className="preview-header"><Brand /><span className="preview-avatar">SM</span></div>
        <h2>Bonjour Sophie !</h2>
        <p>Trouvez un médecin pour votre prochain rendez-vous.</p>
        <div className="preview-search"><Search /><span>Médecin, spécialité, ville…</span></div>
        <div className="preview-heading"><strong>Spécialités</strong><span>Voir tout</span></div>
        <div className="preview-specialties">{[[Stethoscope, 'Médecine générale'], [Sun, 'Dermatologie'], [Baby, 'Pédiatrie'], [Heart, 'Cardiologie']].map(([Icon, label]) => <div key={label}><Icon /><span>{label}</span></div>)}</div>
        <div className="preview-heading"><strong>Mes rendez-vous</strong></div>
        <div className="preview-counts"><span>0 confirmés</span><span>0 en attente</span></div>
        <div className="preview-heading"><strong>À venir</strong><span>Voir tout</span></div>
        <div className="preview-empty" />
      </div>
      <div className="preview-navigation">{[[House, 'Accueil'], [CalendarDays, 'Rendez-vous'], [UserRound, 'Profil']].map(([Icon, label]) => <div key={label}><Icon /><span>{label}</span></div>)}</div>
      <div className="preview-home-indicator" />
    </div>
  </div>;
}

export default function DesktopGateway() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const mobileUrl = new URL(`${location.pathname}${location.search}`, window.location.origin).href;
  const localOnly = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  return <main className="desktop-gateway">
    <header className="gateway-header"><Brand /><span>Mobile et tablette</span></header>
    <div className="gateway-hero">
      <div className="gateway-copy">
        <h1>Un médecin.<br />Un créneau.<br />Et vous.</h1>
        <p className="gateway-intro">Trouvez un médecin, demandez un rendez-vous et suivez sa réponse depuis votre téléphone.</p>
        <p className="gateway-availability">L’interface ordinateur n’est pas encore disponible.<br />MediTime vous accompagne sur mobile et tablette.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><button type="button" className="gateway-continue">Continue on Mobile</button></DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="gateway-overlay" />
            <DialogPrimitive.Content className="gateway-qr-dialog">
              <DialogClose className="gateway-close" aria-label="Fermer"><X size={22} /></DialogClose>
              <Brand />
              <DialogTitle>Ouvrir sur mobile</DialogTitle>
              <DialogDescription>Scannez ce QR code avec votre téléphone.</DialogDescription>
              <div className="gateway-qr-surface">
                <QRCodeSVG value={mobileUrl} size={288} level="H" marginSize={4} fgColor="#100d3e" title="Ouvrir la page actuelle de MediTime sur mobile" imageSettings={{ src: '/brand/meditime-mark-144.webp', width: 48, height: 34, excavate: true }} />
              </div>
              <p className="gateway-qr-caption">Le lien de cette page, sur votre téléphone.</p>
              {localOnly && <p className="gateway-local-note">Cette adresse locale s’ouvre uniquement sur cet ordinateur. Pour scanner depuis un téléphone, ouvrez MediTime avec son adresse réseau ou son adresse publique.</p>}
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      </div>
      <PhonePreview />
    </div>
  </main>;
}
