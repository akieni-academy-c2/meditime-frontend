import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brand, SecurityArtwork } from '../components/Brand.jsx';
import { AuthButton, AuthNotice, CodeField, EmailField } from '../components/AuthUI.jsx';

export default function UIKit() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  return <section className="ui-kit"><Link to="/connexion">Voir la connexion</Link><Brand /><h1>UI kit · Authentification</h1>
    <h2>Champs</h2><EmailField value={email} onChange={(e) => setEmail(e.target.value)} /><CodeField value={code} onChange={setCode} />
    <h2>Boutons</h2><AuthButton>Continuer</AuthButton><AuthButton disabled>Vérification…</AuthButton><AuthButton variant="outline">Retour</AuthButton>
    <h2>Messages</h2><AuthNotice error>Code invalide ou expiré.</AuthNotice><AuthNotice>Un nouveau code a été envoyé.</AuthNotice>
    <h2>Illustrations</h2><SecurityArtwork /><SecurityArtwork email />
  </section>;
}
