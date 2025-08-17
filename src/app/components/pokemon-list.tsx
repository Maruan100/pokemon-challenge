'use client'

import { useState } from 'react'
import PokemonCard from './pokemon-card'
import SearchBar from './search-bar'
import GenerationDropdown from './drop-down'
import TypeFilter from './type-filter'

interface PokemonListProps {
  initialPokemons: any[]
}

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const [filteredPokemons, setFilteredPokemons] = useState(initialPokemons)
  const [selectedGeneration, setSelectedGeneration] = useState('all')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const handleSearch = (searchTerm: string) => {
    const filtered = initialPokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm) &&
      (selectedGeneration === 'all' || pokemon.generation === parseInt(selectedGeneration))
    )
    setFilteredPokemons(filtered)
  }

  const handleGenerationChange = (generation: string) => {
    setSelectedGeneration(generation)
    const searchTerm = document.querySelector('input')?.value.toLowerCase() || ''
    
    const filtered = initialPokemons.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchTerm)
      const generationMatch = generation === 'all' || 
                            pokemon.generation === `generation-${generation.toLowerCase()}`
      return nameMatch && generationMatch
    })
    
    setFilteredPokemons(filtered)
  }

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types)
    const searchTerm = document.querySelector('input')?.value.toLowerCase() || ''
    
    const filtered = initialPokemons.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchTerm)
      const generationMatch = selectedGeneration === 'all' || 
                            pokemon.generation === `generation-${selectedGeneration.toLowerCase()}`
      const typeMatch = types.length === 0 || 
                       types.every(type => pokemon.types.includes(type))
      
      return nameMatch && generationMatch && typeMatch
    })
    
    setFilteredPokemons(filtered)
  }

  return (
    <>
      <div className="wrapper">
        <h1>Pokedex</h1>
        <div className="filters">
          <SearchBar onSearch={handleSearch} />
          <GenerationDropdown onGenerationChange={handleGenerationChange} />
          <TypeFilter onTypeChange={handleTypeChange} />
        </div>
      </div>

      <div className="list">
        {filteredPokemons.map((pokemon: any) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </>
  )
}