// src/components/SearchBar.jsx
// Barre de recherche pour les médecins.

import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Médecin, spécialité, ville…' }) {
  return (
    <div className="search-bar">
      <Search size={20} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher un médecin"
        autoComplete="off"
      />
    </div>
  );
}