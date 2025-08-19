"use client";
import { useCallback, useMemo, useEffect } from "react";
import PokemonCard from "./pokemon-card";
import SearchBar from "./search-bar";
import GenerationDropdown from "./drop-down";
import TypeFilter from "./type-filter";
import Pagination from "./pagination";
import { getPokemonEvolutionChain } from "../utils/getEvolution";
import Link from "next/link";
import { usePokemonFilters } from "../contexts/PokemonFilterContext";
import { usePagination } from "../hooks/usePagination";

interface PokemonListProps {
  initialPokemons: any[];
}

const ITEMS_PER_PAGE = 30;

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const {
    searchTerm, 
    setSearchTerm,
    selectedGeneration, 
    setSelectedGeneration,
    selectedTypes, 
    setSelectedTypes,
    evolutionNames, 
    setEvolutionNames
  } = usePokemonFilters();

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  const filteredPokemons = useMemo(() => {
    return initialPokemons.filter((pokemon) => {
      const name = pokemon.name.toLowerCase();
      const query = searchTerm.toLowerCase();

      const nameMatch =
        !query || name.includes(query) || evolutionNames.includes(name);

      const generationMatch =
        selectedGeneration === "all" ||
        pokemon.generation === `generation-${selectedGeneration.toLowerCase()}`;

      const typeMatch =
        selectedTypes.length === 0 ||
        selectedTypes.every((type) => pokemon.types.includes(type));

      return nameMatch && generationMatch && typeMatch;
    });
  }, [
    initialPokemons,
    searchTerm,
    selectedGeneration,
    selectedTypes,
    evolutionNames,
  ]);

  // Use pagination hook with reset triggers
  const {
    currentPage,
    paginatedData: paginatedPokemons,
    goToPage,
    totalItems,
  } = usePagination({
    data: filteredPokemons,
    itemsPerPage: ITEMS_PER_PAGE,
    resetTriggers: [searchTerm, selectedGeneration, selectedTypes],
  });

  const handleSearch = useCallback(
    async (search: string) => {
      setSearchTerm(search);

      if (!search.trim()) {
        setEvolutionNames([]);
        return;
      }

      try {
        // Primero filtramos los Pokémon que coinciden con el término de búsqueda
        const matchingPokemons = initialPokemons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

        if (matchingPokemons.length === 0) {
          setEvolutionNames([]);
          return; // No hay coincidencias, no necesitamos buscar evoluciones
        }

        // Limitamos el número de peticiones para evitar saturar la API
        const pokemonsToProcess = matchingPokemons.slice(0, 5);
        
        const evolutionResults = await Promise.all(
          pokemonsToProcess.map(async (pokemon) => {
            try {
              return await getPokemonEvolutionChain(pokemon.name.toLowerCase());
            } catch (e) {
              console.error(`Error procesando evolución de ${pokemon.name}:`, e);
              return [];
            }
          })
        );

        setEvolutionNames([...new Set(evolutionResults.flat())]);
      } catch (error) {
        console.error("Error obteniendo cadenas evolutivas:", error);
        setEvolutionNames([]);
      }
    },
    [initialPokemons, setSearchTerm, setEvolutionNames]
  );

  const handleGenerationChange = (generation: string) => {
    setSelectedGeneration(generation);
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
  };

  return (
    <>
      <div className="wrapper">
        <h1>Pokedex</h1>
        <div className="filters">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <GenerationDropdown 
            onGenerationChange={handleGenerationChange} 
            initialValue={selectedGeneration}
          />
          <TypeFilter 
            onTypeChange={handleTypeChange} 
            initialTypes={selectedTypes}
          />
        </div>
      </div>

      <div className="list">
        {paginatedPokemons.map((pokemon) => (
          <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={goToPage}
        showInfo={true}
      />
    </>
  );
}
