"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import PokemonCard from "./pokemon-card";
import SearchBar from "./search-bar";
import GenerationDropdown from "./drop-down";
import TypeFilter from "./type-filter";
import { getPokemonEvolutionChain } from "../utils/getEvolution";
import Link from "next/link";

interface PokemonListProps {
  initialPokemons: any[];
}

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [evolutionNames, setEvolutionNames] = useState<string[]>([]);

  // Cargar valores iniciales del localStorage
  useEffect(() => {
    const savedSearch = localStorage.getItem('pokemonSearchTerm');
    const savedGeneration = localStorage.getItem('pokemonGeneration');
    const savedTypes = localStorage.getItem('pokemonTypes');

    if (savedSearch) setSearchTerm(savedSearch);
    if (savedGeneration) setSelectedGeneration(savedGeneration);
    if (savedTypes) setSelectedTypes(JSON.parse(savedTypes));
  }, []);

  // Efecto para la búsqueda inicial
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

  const handleSearch = useCallback(
    async (search: string) => {
      setSearchTerm(search);

      if (!search.trim()) {
        setEvolutionNames([]);
        return;
      }

      try {
        const matchingPokemons = initialPokemons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

        const evolutionResults = await Promise.all(
          matchingPokemons.map((pokemon) =>
            getPokemonEvolutionChain(pokemon.name.toLowerCase())
          )
        );

        setEvolutionNames([...new Set(evolutionResults.flat())]);
      } catch (error) {
        console.error("Error obteniendo cadenas evolutivas:", error);
        setEvolutionNames([]);
      }
    },
    [initialPokemons]
  );

  const handleGenerationChange = (generation: string) => {
    localStorage.setItem('pokemonGeneration', generation);
    setSelectedGeneration(generation);
  };

  const handleTypeChange = (types: string[]) => {
    localStorage.setItem('pokemonTypes', JSON.stringify(types));
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
        {filteredPokemons.map((pokemon) => (
          <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          </Link>
        ))}
      </div>
    </>
  );
}
