export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  species: {
    url: string;
  };
}

export interface EvolutionPokemon {
  id: number;
  name: string;
  types: string[];
  generation: string;
}
