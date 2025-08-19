export const API_URL = 'https://pokeapi.co/api/v2';

const POKEMON_CACHE_KEY = 'pokemon_data_cache';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;

const isBrowser = typeof window !== 'undefined';

const getFromCache = () => {
  if (!isBrowser) return null;
  
  try {
    const cachedData = localStorage.getItem(POKEMON_CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      // Verificar si el caché sigue siendo válido
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY_TIME) {
        console.log('Datos recuperados del caché local');
        return parsed.data;
      }
    }
  } catch (e) {
    console.error('Error al leer el caché:', e);
  }
  return null;
};

const saveToCache = (data) => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Error al guardar en caché:', e);
  }
};

export const getPokemons = async () => {
  try {
    // Intentar recuperar del caché (solo funcionará en el cliente)
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
            generation: speciesDetails.generation.name
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
        const cachedData = localStorage.getItem(POKEMON_CACHE_KEY);
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
