export async function getPokemonEvolutionChain(pokemonName: string) {
  const baseURL = 'https://pokeapi.co/api/v2';

  try {
    const name = pokemonName.toLowerCase().trim();
    const pokemonRes = await fetch(`${baseURL}/pokemon/${name}`);
    if (!pokemonRes.ok) throw new Error('Pokémon no encontrado');
    const pokemonData = await pokemonRes.json();

    const speciesRes = await fetch(pokemonData.species.url);
    const speciesData = await speciesRes.json();

    const evoChainRes = await fetch(speciesData.evolution_chain.url);
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
    console.error(error);
    return [];
  }
}
