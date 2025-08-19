import { getFromCache, saveToCache } from "../utils/cache";

export const API_URL = 'https://pokeapi.co/api/v2';

export const getPokemons = async () => {
  try {
    const cachedData = getFromCache();
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${API_URL}/pokemon?limit=1010`);
    const { results } = await response.json();

    const batchSize = 50;
    let allPokemon = [];

    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);

      const batchData = await Promise.all(
        batch.map(async (pokemon) => {
          const detailsResponse = await fetch(pokemon.url);
          const pokemonDetails = await detailsResponse.json();

          const speciesResponse = await fetch(pokemonDetails.species.url);
          const speciesDetails = await speciesResponse.json();

          return {
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            types: pokemonDetails.types.map((type) => type.type.name),
            generation: speciesDetails.generation.name,
          };
        })
      );

      allPokemon = [...allPokemon, ...batchData];

      saveToCache(allPokemon);
    }

    return allPokemon;
  } catch (error) {
    console.error('Error fetching pokemon:', error);

    if (isBrowser) {
      try {
        const cachedData = localStorage.getItem('pokemon_data_cache');
        if (cachedData) {
          const { data } = JSON.parse(cachedData);
          console.log('Usando datos en caché debido a error');
          return data;
        }
      } catch (e) {
        console.error('Error al leer el caché de respaldo:', e);
      }
    }

    return [];
  }
};

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
};
