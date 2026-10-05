import { AuthButton, AuthNotice } from './AuthUI.jsx';
import { LoadingState } from './CardsUI.jsx';

export default function ResourceState({ resource }) {
  if (resource.loading) return <LoadingState />;
  if (resource.error) return <div className="resource-error"><AuthNotice error>{resource.error}</AuthNotice><AuthButton variant="outline" onClick={resource.reload}>Réessayer</AuthButton></div>;
  return null;
}
