// filepath: /pokemon-challenge/pokemon-challenge/src/app/components/search-bar.tsx
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Buscar Pokémon..."
      value={searchTerm}
      onChange={handleChange}
    />
  );
}