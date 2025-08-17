interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase()
    onSearch(searchTerm)
  }

  return (
    <input
      className="form__input half"
      type="text"
      placeholder="Buscar..."
      onChange={handleSearch}
    />
  )
}