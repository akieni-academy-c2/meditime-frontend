import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, UserRound } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { FormField } from '../components/FormsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { Brand } from '../components/Brand.jsx';
import { PageHeader, StepIndicator } from '../components/NavigationUI.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import BottomSheet from '../components/BottomSheet.jsx';

export default function ProfileForm({ onboarding = false, embedded = false, onSaved, onBusyChange }) {
  const { account, acceptSession } = useAuth();
  const user = account.user;
  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Gestion de la photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [photoSheet, setPhotoSheet] = useState(false);

  const hasPhoto = Boolean(photoPreview || user.avatarUrl);

  const field = (key) => ({
    value: values[key],
    onChange: (event) => setValues({ ...values, [key]: event.target.value }),
  });

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    setPhotoError('');

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2 Mo

    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Format non autorisé. Utilisez JPG, PNG ou WebP.');
      setPhotoSheet(false);
      return;
    }

    if (file.size > maxSize) {
      setPhotoError('L’image dépasse la taille maximale autorisée (2 Mo).');
      setPhotoSheet(false);
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoSheet(false);
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError('');
    setPhotoSheet(false);
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    onBusyChange?.(true);
    setError('');

    try {
      acceptSession(
        await api('/me', {
          method: 'PATCH',
          body: {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            phone: values.phone.trim() || null,
          },
        })
      );

      if (embedded) {
        onSaved?.();
      } else {
        navigate(onboarding ? '/accueil' : '/profil', { replace: onboarding });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }

  return (
    <section className={onboarding ? 'auth-screen onboarding-screen' : 'profile-form'}>
      {onboarding ? (
        <>
          <StepIndicator current={2} total={2} />
          <Brand />
          <div className="auth-heading">
            <h1>Créer votre profil</h1>
            <p className="auth-intro">Quelques informations pour personnaliser votre expérience.</p>
          </div>
        </>
      ) : (
        <>
          {!embedded && <PageHeader title="Mes informations" fallback="/profil" />}

          <div className="profile-identity">
            <div className="profile-avatar-wrapper">
              <button
                type="button"
                className="profile-avatar-button"
                onClick={() => setPhotoSheet(true)}
              >
                <PersonAvatar
                  name={`${user.firstName || ''} ${user.lastName || ''}`}
                  avatarUrl={photoPreview || user.avatarUrl}
                />
              </button>
              <p className="profile-photo-hint">Appuyer pour modifier</p>
            </div>

            <p>{user.email}</p>

            {photoError && <AuthNotice error>{photoError}</AuthNotice>}

            {photoFile && (
              <p className="profile-photo-notice">
                Aperçu local uniquement. L’enregistrement de la photo n’est pas encore disponible.
              </p>
            )}
          </div>
        </>
      )}

      <form onSubmit={save} className="profile-fields">
        <FormField
          label="Prénom"
          icon={UserRound}
          required
          maxLength={80}
          autoComplete="given-name"
          {...field('firstName')}
        />
        <FormField
          label="Nom"
          icon={UserRound}
          required
          maxLength={80}
          autoComplete="family-name"
          {...field('lastName')}
        />
        <FormField
          label="Téléphone (facultatif)"
          icon={Phone}
          type="tel"
          maxLength={30}
          autoComplete="tel"
          {...field('phone')}
        />

        {error && <AuthNotice error>{error}</AuthNotice>}

        <AuthButton type="submit" disabled={busy}>
          {busy ? 'Enregistrement…' : onboarding ? 'Terminer' : 'Enregistrer les modifications'}
        </AuthButton>
      </form>

      {/* Menu photo */}
<BottomSheet
  open={photoSheet}
  onOpenChange={setPhotoSheet}
  title="Photo de profil"
  description={hasPhoto ? 'Que souhaitez-vous faire ?' : 'Ajoutez une photo de profil'}
>
  <div className="photo-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
    
    {/* Action 1 : Modifier / Ajouter */}
    <label
      className="photo-action-button"
      style={{
        display: 'block',
        width: '100%',
        padding: '14px 16px',
        background: '#f4f4f5',
        borderRadius: '12px',
        textAlign: 'center',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {hasPhoto ? 'Modifier la photo' : 'Ajouter une photo'}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoChange}
        hidden
      />
    </label>

    {/* Action 2 : Supprimer */}
    {hasPhoto && (
      <button
        type="button"
        className="photo-action-button danger"
        onClick={removePhoto}
        style={{
          display: 'block',
          width: '100%',
          padding: '14px 16px',
          background: '#fef2f2',
          color: '#dc2626',
          border: 'none',
          borderRadius: '12px',
          textAlign: 'center',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Supprimer la photo
      </button>
    )}
  </div>
</BottomSheet>
    </section>
  );
}