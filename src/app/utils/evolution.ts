import { EvolutionPokemon } from "@/app/models/pokemon";

export async function getEvolutionChain(speciesUrl: string): Promise<EvolutionPokemon[]> {
  try {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();

    const evolutionRes = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionRes.json();

    const evolutionChain: EvolutionPokemon[] = [];

    function extractEvolutions(chain: any) {
      const pokemonName = chain.species.name;
      const pokemonId = chain.species.url.split("/").slice(-2, -1)[0];

      evolutionChain.push({
        id: parseInt(pokemonId),
        name: pokemonName,
        types: [],
        generation: `Gen ${speciesData.generation.name.split("-")[1].toUpperCase()}`,
      });

      if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evolution: any) => extractEvolutions(evolution));
      }
    }

    extractEvolutions(evolutionData.chain);

    for (let pokemon of evolutionChain) {
      const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const pokemonData = await pokemonRes.json();
      pokemon.types = pokemonData.types.map((type: any) => type.type.name);
    }

    return evolutionChain;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return [];
  }
}