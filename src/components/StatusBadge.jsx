// src/components/StatusBadge.jsx
// Badge coloré pour afficher le statut d'une demande.

import { CheckCircle2, Clock, XCircle, Calendar, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  EN_ATTENTE: {
    label: 'En attente',
    icon: Clock,
    variant: 'waiting',
  },
  CONFIRMEE: {
    label: 'Confirmé',
    icon: CheckCircle2,
    variant: 'success',
  },
  REFUSEE: {
    label: 'Refusé',
    icon: XCircle,
    variant: 'danger',
  },
  ANNULEE: {
    label: 'Annulé',
    icon: AlertCircle,
    variant: 'cancelled',
  },
  PASSE: {
    label: 'Passé',
    icon: Calendar,
    variant: 'muted',
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.EN_ATTENTE;
  const Icon = config.icon;

  return (
    <span className="status-badge" data-variant={config.variant}>
      <Icon size={14} aria-hidden="true" />
      {config.label}
    </span>
  );
}