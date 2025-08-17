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
  const [searchTerm, setSearchTerm] = useState('')

  // Función unificada para aplicar todos los filtros
  const applyFilters = (search: string, generation: string, types: string[]) => {
    const filtered = initialPokemons.filter(pokemon => {
      // Filtro de búsqueda
      const nameMatch = pokemon.name.toLowerCase().includes(search.toLowerCase())
      
      // Filtro de generación
      const generationMatch = generation === 'all' || 
                            pokemon.generation === `generation-${generation.toLowerCase()}`
      
      // Filtro de tipos
      const typeMatch = types.length === 0 || 
                      types.every(type => pokemon.types.includes(type))
      
      return nameMatch && generationMatch && typeMatch
    })
    
    setFilteredPokemons(filtered)
  }

  const handleSearch = (search: string) => {
    setSearchTerm(search)
    applyFilters(search, selectedGeneration, selectedTypes)
  }

  const handleGenerationChange = (generation: string) => {
    setSelectedGeneration(generation)
    applyFilters(searchTerm, generation, selectedTypes)
  }

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types)
    applyFilters(searchTerm, selectedGeneration, types)
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