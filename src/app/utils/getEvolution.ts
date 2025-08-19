export async function getPokemonEvolutionChain(pokemonName: string) {
  const baseURL = 'https://pokeapi.co/api/v2';

  try {
    const name = pokemonName.toLowerCase().trim();
    const pokemonRes = await fetch(`${baseURL}/pokemon/${name}`);
    if (!pokemonRes.ok) return []; // Si no encuentra el Pokémon, devolvemos un array vacío
    
    const pokemonData = await pokemonRes.json();
    
    if (!pokemonData.species?.url) {
      console.error('Datos de especies no disponibles para:', pokemonName);
      return []; // Verificación adicional para asegurarnos de que species.url existe
    }

    const speciesRes = await fetch(pokemonData.species.url);
    if (!speciesRes.ok) return [];
    
    const speciesData = await speciesRes.json();
    
    if (!speciesData.evolution_chain?.url) {
      return [pokemonName]; // Si no tiene cadena evolutiva, devolvemos solo este Pokémon
    }

    const evoChainRes = await fetch(speciesData.evolution_chain.url);
    if (!evoChainRes.ok) return [pokemonName];
    
    const evoChainData = await evoChainRes.json();

    const evolutionNames = new Set<string>();
    const traverse = (node: any) => {
      if (!node) return;
      evolutionNames.add(node.species.name);
      if (Array.isArray(node.evolves_to)) {
        node.evolves_to.forEach(traverse);
      }
    };

    traverse(evoChainData.chain);

    return Array.from(evolutionNames);
  } catch (error) {
    console.error("Error obteniendo evolución para:", pokemonName, error);
    return [];
  }
}
