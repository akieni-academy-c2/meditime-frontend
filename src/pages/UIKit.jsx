import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, House, Phone, Shield, Stethoscope, UserRound } from 'lucide-react';
import { Brand } from '../components/Brand.jsx';
import { AuthButton, AuthNotice, CodeField, EmailField } from '../components/AuthUI.jsx';
import { FormField, SelectField } from '../components/FormsUI.jsx';
import { StatusBadge, DateStrip, SlotPicker, ScheduleDay, AgendaList, FilterChips } from '../components/SchedulingUI.jsx';
import { PersonCard, SettingsRow, EmptyState, LoadingState } from '../components/CardsUI.jsx';
import { AppHeader, PageHeader, StepIndicator, TabBar } from '../components/NavigationUI.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
import { Button } from '../components/ui/button.jsx';
import { Checkbox } from '../components/ui/checkbox.jsx';
import { Label } from '../components/ui/label.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs.jsx';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '../components/ui/dialog.jsx';

const sections = [['foundations', 'Fondations'], ['forms', 'Formulaires'], ['navigation', 'Navigation'], ['cards', 'Cartes et statuts'], ['planning', 'Planning'], ['sheets', 'Sheets et dialogues']];
function Specimen({ title, source, children }) {
  return <article className="kit-specimen"><header><h3>{title}</h3><code>{source}</code></header><div className="kit-preview">{children}</div></article>;
}
export default function UIKit() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [authStep, setAuthStep] = useState('email');
  const [date, setDate] = useState('wed');
  const [slot, setSlot] = useState('14:30');
  const [enabled, setEnabled] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [sheet, setSheet] = useState(null);
  const [notice, setNotice] = useState('');
  const patientNav = [{ to: '/accueil', label: 'Accueil', icon: House }, { to: '/rendez-vous', label: 'Rendez-vous', icon: CalendarDays }, { to: '/profil', label: 'Profil', icon: UserRound }];
  return <div className="kit-layout">
    <aside className="kit-sidebar"><Brand /><p>Design system</p><nav aria-label="Sections du UI kit">{sections.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}</nav><Link to="/connexion">Ouvrir l’application</Link></aside>
    <main className="kit-main"><header className="kit-heading"><h1>Le UI kit MediTime</h1><p>Catalogue développeur local. Composants des maquettes, exemples interactifs et imports. Les données sont fictives : aucune action ne contacte l’API.</p></header>
      <section id="foundations" className="kit-section"><h2>Fondations</h2><p>Surfaces blanches, texte bleu nuit, violet MediTime et icônes Lucide.</p>
        <div className="kit-swatches">{[['Primaire', '#6528ff'], ['Texte', '#100d3e'], ['Secondaire', '#f6f5fb'], ['Bordure', '#e5e6f3']].map(([name, color]) => <div key={name}><span style={{ background: color }} /><strong>{name}</strong><code>{color}</code></div>)}</div>
        <div className="kit-grid"><Specimen title="Identité et typographie" source="Brand.jsx · styles.css"><Brand /><h3 className="type-sample">Bonjour Claire !</h3><p className="page-intro">Texte secondaire et informations utiles.</p></Specimen><Specimen title="Boutons et états" source="AuthUI.jsx · ui/button.jsx"><AuthButton onClick={() => setNotice('Aperçu : aucune requête envoyée.')}>Continuer</AuthButton><AuthButton variant="outline">Décliner</AuthButton><AuthButton disabled>Vérification…</AuthButton><Button variant="ghost">Voir tout</Button></Specimen></div>
      </section>
      <section id="forms" className="kit-section"><h2>Formulaires</h2><p>Le login réel comporte deux écrans distincts. Labels, erreurs et descriptions restent associés au contrôle.</p><div className="kit-grid">
        <Specimen title="Email / OTP : étapes distinctes" source="AuthUI.jsx"><Tabs value={authStep} onValueChange={setAuthStep}><TabsList><TabsTrigger value="email">Écran email</TabsTrigger><TabsTrigger value="otp">Écran OTP</TabsTrigger></TabsList><TabsContent value="email"><EmailField value={email} onChange={e => setEmail(e.target.value)} /><AuthButton onClick={() => setAuthStep('otp')}>Continuer</AuthButton></TabsContent><TabsContent value="otp"><CodeField value={code} onChange={setCode} /><AuthButton disabled={code.length !== 6} onClick={() => setNotice('Code de démonstration uniquement.')}>Continuer</AuthButton></TabsContent></Tabs></Specimen>
        <Specimen title="Profil et motif" source="FormsUI.jsx"><FormField label="Prénom" icon={UserRound} placeholder="Claire" /><FormField label="Téléphone (facultatif)" icon={Phone} type="tel" placeholder="+242…" /><FormField label="Motif (facultatif)" multiline placeholder="Décrivez votre demande…" /><FormField label="Nom" error="Renseignez votre nom." /></Specimen>
        <Specimen title="Sélection et photo" source="FormsUI.jsx · ui/checkbox.jsx"><SelectField label="Spécialité" options={[{ value: 'general', label: 'Médecine générale' }, { value: 'cardiology', label: 'Cardiologie' }]} /><FormField label="Photo de profil" type="file" accept="image/png,image/jpeg" hint="JPG ou PNG ; validation de taille côté serveur." /><div className="kit-check"><Checkbox id="kit-checkbox" /><Label htmlFor="kit-checkbox">Avec disponibilité uniquement</Label></div></Specimen>
      </div></section>
      <section id="navigation" className="kit-section"><h2>Navigation</h2><p>Aucune tab bar sur les écrans email et OTP.</p><div className="kit-grid">
        <Specimen title="En-tête et progression" source="NavigationUI.jsx"><AppHeader user={{ firstName: 'Claire', lastName: 'Martin' }} /><PageHeader title="Mon planning" onBack={() => setNotice('Retour de démonstration.')} /><StepIndicator current={2} total={2} /></Specimen>
        <Specimen title="Navigation patient" source="NavigationUI.jsx · TabBar"><div className="kit-tab-preview"><TabBar items={patientNav} /></div></Specimen>
        <Specimen title="Navigation médecin" source="NavigationUI.jsx · TabBar"><div className="kit-tab-preview"><TabBar items={[patientNav[0], { to: '/planning', label: 'Planning', icon: CalendarDays }, { to: '/demandes', label: 'Demandes', icon: Stethoscope, count: 2 }, patientNav[2]]} /></div></Specimen>
      </div></section>
      <section id="cards" className="kit-section"><h2>Cartes et statuts</h2><p>Personnes, résumés de rendez-vous, paramètres et retours.</p><div className="kit-grid">
        <Specimen title="Identité et rendez-vous" source="CardsUI.jsx"><PersonCard name="Dr Claire Martin · exemple" subtitle="Médecine générale" onClick={() => setNotice('Fiche de démonstration.')} /><PersonCard name="Thomas Dupont · exemple" subtitle="Mercredi à 14:30" status="pending"><p>Cabinet · Brazzaville</p></PersonCard></Specimen>
        <Specimen title="Paramètres" source="CardsUI.jsx · SettingsRow"><SettingsRow icon={UserRound} title="Mes informations" description="Nom, email, téléphone" onClick={() => setSheet('mode')} /><SettingsRow icon={Shield} title="Confidentialité" description="Visibilité du profil" onClick={() => setNotice('Paramètre de démonstration.')} /></Specimen>
        <Specimen title="Statuts et retours" source="SchedulingUI.jsx · AuthUI.jsx"><div className="kit-badges">{['pending', 'confirmed', 'declined', 'past', 'available'].map(status => <StatusBadge key={status} status={status} />)}</div><AuthNotice error>Le service ne répond pas. Réessayez.</AuthNotice><LoadingState /><EmptyState title="Aucune demande" description="Vos demandes apparaîtront ici." /></Specimen>
      </div></section>
      <section id="planning" className="kit-section"><h2>Planning</h2><p>La page contrôle les valeurs ; le serveur contrôle les disponibilités.</p><div className="kit-grid">
        <Specimen title="Dates et créneaux" source="SchedulingUI.jsx"><DateStrip dates={[{ value: 'mon', day: 'Lun.', date: '12 mai', label: 'Lundi 12 mai' }, { value: 'tue', day: 'Mar.', date: '13 mai', label: 'Mardi 13 mai' }, { value: 'wed', day: 'Mer.', date: '14 mai', label: 'Mercredi 14 mai' }]} value={date} onChange={setDate} /><SlotPicker slots={[{ value: '09:00', label: '09:00', disabled: true }, { value: '09:30', label: '09:30' }, { value: '14:30', label: '14:30' }, { value: '15:00', label: '15:00' }]} value={slot} onChange={setSlot} /></Specimen>
        <Specimen title="Horaires récurrents" source="SchedulingUI.jsx · ScheduleDay"><ScheduleDay day="Lundi" enabled={enabled} onEnabledChange={setEnabled}><span className="schedule-time">09:00 – 12:00</span></ScheduleDay><Button variant="outline" onClick={() => setSheet('planning')}>Modifier pour aujourd’hui</Button></Specimen>
        <Specimen title="Agenda et filtres" source="SchedulingUI.jsx · AgendaList / FilterChips"><FilterChips options={[{ value: 'pending', label: 'En attente' }, { value: 'confirmed', label: 'Confirmés' }]} value={filter} onChange={setFilter} /><AgendaList entries={[{ id: 'free', time: '09:00', title: 'Créneau disponible', available: true }, { id: 'demo', time: '09:30', title: 'Patient · exemple', description: 'Consultation générale' }]} onSelect={() => setNotice('Créneau de démonstration.')} /></Specimen>
      </div></section>
      <section id="sheets" className="kit-section"><h2>Sheets et dialogues</h2><p>Panneaux du bas avec titre, description, contenu et action finale. Fermeture par Échap et retour du focus.</p><div className="kit-grid"><Specimen title="Panneaux contextuels" source="BottomSheet.jsx · ui/sheet.jsx"><AuthButton onClick={() => setSheet('mode')}>Changer de mode</AuthButton><AuthButton variant="outline" onClick={() => setSheet('planning')}>Modifier le planning</AuthButton></Specimen><Specimen title="Confirmation" source="ui/dialog.jsx"><Dialog><DialogTrigger asChild><Button variant="outline">Ouvrir la confirmation</Button></DialogTrigger><DialogContent><DialogTitle>Décliner cette demande ?</DialogTitle><DialogDescription>Aucune demande réelle ne sera modifiée dans cet exemple.</DialogDescription><DialogClose asChild><Button onClick={() => setNotice('Confirmation de démonstration uniquement.')}>Confirmer l’exemple</Button></DialogClose></DialogContent></Dialog></Specimen></div></section>
      {notice && <p className="kit-toast" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Fermer le message">Fermer</button></p>}
    </main>
    <BottomSheet open={Boolean(sheet)} onOpenChange={open => { if (!open) setSheet(null); }} title={sheet === 'mode' ? 'Changer de mode' : 'Modifier pour aujourd’hui'} description={sheet === 'mode' ? 'Le même compte, deux expériences.' : 'Aperçu des modifications ponctuelles.'} footer={<AuthButton onClick={() => { setSheet(null); setNotice('Aperçu uniquement : aucune modification serveur.'); }}>Fermer l’aperçu</AuthButton>}>
      {sheet === 'mode' ? <div className="mode-options"><button type="button" onClick={() => setNotice('Mode patient : aperçu uniquement.')}><UserRound /><span><strong>Mode Patient</strong><small>Prenez rendez-vous et suivez vos demandes.</small></span></button><button type="button" onClick={() => setNotice('Le mode médecin nécessite une habilitation serveur.')}><Stethoscope /><span><strong>Mode Médecin</strong><small>Gérez votre planning et vos demandes.</small></span></button></div> : <><fieldset className="sheet-options"><legend>Modification</legend>{['Rendre la journée indisponible', 'Ajouter un créneau exceptionnel', 'Supprimer un créneau'].map((label, i) => <label key={label}><input type="radio" name="kit-planning-change" defaultChecked={i === 1} />{label}</label>)}</fieldset><div className="kit-grid"><FormField label="Heure de début" type="time" defaultValue="17:30" /><FormField label="Heure de fin" type="time" defaultValue="19:00" /></div><SelectField label="Durée des consultations" defaultValue="30" options={[{ value: '15', label: '15 minutes' }, { value: '30', label: '30 minutes' }]} /></>}
    </BottomSheet>
  </div>;
}
