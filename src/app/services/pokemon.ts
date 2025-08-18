export const API_URL = 'https://pokeapi.co/api/v2';

interface PokemonDetails {
  id: number;
  name: string;
  types: string[];
  generation: string;
}

export const getPokemons = async (): Promise<PokemonDetails[]> => {
  try {
    const response = await fetch(`${API_URL}/pokemon?limit=200`);
    const { results } = await response.json();
    
    const detailedPokemon = await Promise.all(
      results.map(async (pokemon: { url: string }) => {
        const detailResponse = await fetch(pokemon.url);
        const details = await detailResponse.json();
        
        const speciesResponse = await fetch(details.species.url);
        const speciesData = await speciesResponse.json();
        
        return {
          id: details.id,
          name: details.name,
          types: details.types.map((type: { type: { name: string } }) => type.type.name),
          generation: speciesData.generation.name
        };
      })
    );

    return detailedPokemon;
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    return [];
  }
}

export const getPokemon = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Pokemon with ID ${id} not found`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    return null;
  }
}
