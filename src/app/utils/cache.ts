const POKEMON_CACHE_KEY = 'pokemon_data_cache';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;

const isBrowser = typeof window !== 'undefined';

export const getFromCache = () => {
  if (!isBrowser) return null;

  try {
    const cachedData = localStorage.getItem(POKEMON_CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
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

export const saveToCache = (data: any) => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(
      POKEMON_CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.error('Error al guardar en caché:', e);
  }
};