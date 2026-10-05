// src/components/States.jsx
// États d'interface partagés : chargement, aucun résultat, erreur.

import { AlertCircle, SearchX } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import { AuthButton } from './AuthUI.jsx';

export function LoadingState({ label = 'Chargement', layout }) {
  return <LoadingSkeleton label={label} layout={layout} />;
}

export function EmptyState({
  title = 'Aucun résultat',
  description,
  icon: Icon = SearchX,
}) {
  return (
    <div className="state-block" role="status">
      <Icon size={32} aria-hidden="true" />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

export function ErrorState({
  message = 'Une erreur est survenue.',
  onRetry,
}) {
  return (
    <div className="state-block state-block--error" role="alert">
      <AlertCircle size={32} aria-hidden="true" />
      <h3>Impossible de charger les données</h3>
      <p>{message}</p>
      {onRetry && (
        <AuthButton variant="outline" onClick={onRetry}>
          Réessayer
        </AuthButton>
      )}
    </div>
  );
}
