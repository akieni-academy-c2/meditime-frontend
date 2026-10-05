import { Button } from './ui/button.jsx';

export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.total <= pagination.limit) return null;
  const { page, total, limit } = pagination;
  return <nav className="pagination" aria-label="Pages de résultats"><Button variant="outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>Précédent</Button><span>Page {page} / {Math.ceil(total / limit)}</span><Button variant="outline" disabled={page * limit >= total} onClick={() => onPage(page + 1)}>Suivant</Button></nav>;
}
