import { EvolutionPokemon, PokemonData } from "@/app/models/pokemon";
import PokemonCard from "../../components/pokemon-card";
import Link from "next/link";
import { getPokemon } from "@/app/services/pokemon";

async function getEvolutionChain(speciesUrl: string) {
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
        generation: `Gen ${speciesData.generation.name
          .split("-")[1]
          .toUpperCase()}`,
      });

      if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evolution: any) =>
          extractEvolutions(evolution)
        );
      }
    }

    extractEvolutions(evolutionData.chain);

    for (let pokemon of evolutionChain) {
      const pokemonRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
      );
      const pokemonData = await pokemonRes.json();
      pokemon.types = pokemonData.types.map((type: any) => type.type.name);
    }

    return evolutionChain;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return [];
  }
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemon: PokemonData = await getPokemon(id);

  const evolutionChain = await getEvolutionChain(pokemon.species.url);

  const otherEvolutions = evolutionChain.filter((evo) => evo.id !== pokemon.id);

  return (
    <div className="pokemon-detail-container">
      <div className="pokemon-main-card">
        <div className="pokemon-image-section">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="pokemon-main-image"
          />
          <img
            src={pokemon.sprites.front_shiny}
            alt={`${pokemon.name} shiny`}
            className="pokemon-shiny-image"
          />
        </div>

        <div className="pokemon-info-section">
          <h1 className="pokemon-main-name">
            #{pokemon.id.toString().padStart(3, "0")}{" "}
            {pokemon.name.toUpperCase()}
          </h1>

          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <span key={index} className={`type-badge type-${type.type.name}`}>
                {type.type.name.charAt(0).toUpperCase() +
                  type.type.name.slice(1)}
              </span>
            ))}
          </div>

          <div className="pokemon-measurements">
            <div className="measurement">
              <span className="measurement-label">Altura:</span>
              <span className="measurement-value">{pokemon.height / 10} m</span>
            </div>
            <div className="measurement">
              <span className="measurement-label">Peso:</span>
              <span className="measurement-value">
                {pokemon.weight / 10} kg
              </span>
            </div>
          </div>

          <div className="pokemon-stats">
            <h3>Estadísticas Base</h3>
            {pokemon.stats.map((stat, index) => (
              <div key={index} className="stat-row">
                <span className="stat-name">
                  {stat.stat.name.charAt(0).toUpperCase() +
                    stat.stat.name.slice(1)}
                  :
                </span>
                <span className="stat-value">{stat.base_stat}</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {otherEvolutions.length > 0 && (
        <div className="evolution-section">
          <h2>Cadena Evolutiva</h2>
          <div className="evolution-cards">
            {otherEvolutions.map((evolution) => (
              <Link key={evolution.id} href={`/pokemon/${evolution.id}`}>
                <PokemonCard key={evolution.id} pokemon={evolution} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
