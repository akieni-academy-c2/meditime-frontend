// src/components/PageHeader.jsx
// Header des pages internes : bouton retour + titre centré.

import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PageHeader({ title, showActions = false }) {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <button
        type="button"
        className="page-header-back"
        onClick={() => navigate(-1)}
        aria-label="Retour"
      >
        <ArrowLeft size={22} aria-hidden="true" />
      </button>

      {title && <h1 className="page-header-title">{title}</h1>}

      {showActions ? (
        <div className="page-header-actions">
          <button type="button" aria-label="Ajouter aux favoris">
            <Heart size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Partager">
            <Share2 size={20} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <span className="page-header-spacer" aria-hidden="true" />
      )}
    </header>
  );
}