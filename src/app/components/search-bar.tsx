interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = "" }: SearchBarProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    localStorage.setItem('pokemonSearchTerm', searchTerm);
    onSearch(searchTerm);
  };

  return (
    <input
      className="form__input half"
      type="text"
      placeholder="Search..."
      onChange={handleSearch}
      defaultValue={initialValue}
    />
  );
}