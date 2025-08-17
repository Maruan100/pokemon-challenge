import { useState } from 'react'

interface TypeFilterProps {
  onTypeChange: (selectedTypes: string[]) => void
}

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

export default function TypeFilter({ onTypeChange }: TypeFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleTypeChange = (type: string) => {
    let newSelectedTypes: string[]
    
    if (selectedTypes.includes(type)) {
      newSelectedTypes = selectedTypes.filter(t => t !== type)
    } else {
      if (selectedTypes.length >= 2) {
        newSelectedTypes = [selectedTypes[1], type]
      } else {
        newSelectedTypes = [...selectedTypes, type]
      }
    }
    
    setSelectedTypes(newSelectedTypes)
    onTypeChange(newSelectedTypes)
  }

  return (
    <div className="type-filter quarter">
      <button 
        className="type-filter__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTypes.length > 0 ? selectedTypes.join(', ') : 'Select types'}
      </button>
      
      {isOpen && (
        <div className="type-filter__options">
          {POKEMON_TYPES.map(type => (
            <button
              key={type}
              className={`type-btn ${selectedTypes.includes(type) ? 'type-btn--selected' : ''}`}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}