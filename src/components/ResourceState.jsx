import { AuthButton, AuthNotice } from './AuthUI.jsx';
import { LoadingState } from './CardsUI.jsx';

export default function ResourceState({ resource, layout }) {
  if (resource.loading) return <LoadingState layout={layout} />;
  if (resource.error) return <div className="resource-error"><AuthNotice error>{resource.error}</AuthNotice><AuthButton variant="outline" onClick={resource.reload}>Réessayer</AuthButton></div>;
  return null;
}
