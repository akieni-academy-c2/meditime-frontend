import BottomSheet from './BottomSheet.jsx';
import { AuthButton } from './AuthUI.jsx';

export default function ConfirmationSheet({ open, onOpenChange, title, description, confirmLabel, cancelLabel = 'Revenir', busy, onConfirm, destructive = false }) {
  return <BottomSheet className="business-sheet confirmation-sheet" open={open} onOpenChange={value => { if (!busy) onOpenChange(value); }} title={title} description={description} footer={<div className="confirmation-actions"><AuthButton className={destructive ? 'destructive-button' : ''} disabled={busy} onClick={onConfirm}>{busy ? 'En cours…' : confirmLabel}</AuthButton><AuthButton variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>{cancelLabel}</AuthButton></div>} />;
}
