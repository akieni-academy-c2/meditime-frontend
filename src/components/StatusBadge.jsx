import { CheckCircle2, Clock, XCircle, Calendar, AlertCircle } from 'lucide-react';
const statuses = {
  pending: { label: 'En attente', icon: Clock, variant: 'waiting' },
  confirmed: { label: 'Confirmé', icon: CheckCircle2, variant: 'success' },
  declined: { label: 'Décliné', icon: XCircle, variant: 'danger' },
  cancelled: { label: 'Annulé', icon: AlertCircle, variant: 'cancelled' },
};
export function StatusBadge({ status, isPast = false }) {
  const config = isPast && status === 'confirmed' ? { label: 'Passé', icon: Calendar, variant: 'muted' } : statuses[status];
  if (!config) return <span className="status-badge" data-variant="muted">Statut non reconnu</span>;
  const Icon = config.icon;
  return <span className="status-badge" data-variant={config.variant}><Icon size={14} aria-hidden="true" />{config.label}</span>;
}
