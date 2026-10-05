import { Skeleton } from './ui/skeleton.jsx';

export default function LoadingSkeleton({ layout = 'cards', label = 'Chargement' }) {
  return <div className={`loading-skeleton skeleton-${layout}`} role="status" aria-label={label} aria-busy="true"><div aria-hidden="true">
    {layout === 'slots' ? <div className="skeleton-slot-grid">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="skeleton-slot" />)}</div>
      : layout === 'tiles' ? <div className="skeleton-tiles">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="skeleton-tile" />)}</div>
      : layout === 'form' ? <>{Array.from({ length: 3 }, (_, i) => <div className="skeleton-field" key={i}><Skeleton className="skeleton-label" /><Skeleton className="skeleton-input" /></div>)}</>
      : <>{layout === 'screen' && <><Skeleton className="skeleton-brand" /><Skeleton className="skeleton-title" /></>}{Array.from({ length: layout === 'profile' ? 1 : 3 }, (_, i) => <div className="skeleton-card" key={i}><Skeleton className="skeleton-avatar" /><div className="skeleton-copy"><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line short" /><Skeleton className="skeleton-line" /></div></div>)}</>}
  </div></div>;
}
