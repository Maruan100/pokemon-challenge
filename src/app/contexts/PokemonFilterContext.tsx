"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FilterContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGeneration: string;
  setSelectedGeneration: (generation: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  evolutionNames: string[];
  setEvolutionNames: (names: string[]) => void;
}

const defaultValues: FilterContextType = {
  searchTerm: "",
  setSearchTerm: () => {},
  selectedGeneration: "all",
  setSelectedGeneration: () => {},
  selectedTypes: [],
  setSelectedTypes: () => {},
  evolutionNames: [],
  setEvolutionNames: () => {},
};

const PokemonFilterContext = createContext<FilterContextType>(defaultValues);

export const usePokemonFilters = () => useContext(PokemonFilterContext);

export const PokemonFilterProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [evolutionNames, setEvolutionNames] = useState<string[]>([]);

  return (
    <PokemonFilterContext.Provider value={{
      searchTerm,
      setSearchTerm,
      selectedGeneration,
      setSelectedGeneration,
      selectedTypes,
      setSelectedTypes,
      evolutionNames,
      setEvolutionNames
    }}>
      {children}
    </PokemonFilterContext.Provider>
  );
};