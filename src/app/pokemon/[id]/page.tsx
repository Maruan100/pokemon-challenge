import { PokemonData } from "@/app/models/pokemon";
import { getPokemon } from "@/app/services/pokemon";
import { getEvolutionChain } from "@/app/utils/evolution";
import PokemonStats from "@/app/components/pokemon-stats";
import EvolutionSection from "@/app/components/evolution-section";

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
            #{pokemon.id.toString().padStart(3, "0")} {pokemon.name.toUpperCase()}
          </h1>

          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <span key={index} className={`type-badge type-${type.type.name}`}>
                {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
              </span>
            ))}
          </div>

          <PokemonStats pokemon={pokemon} />
        </div>
      </div>

      <EvolutionSection evolutions={otherEvolutions} />
    </div>
  );
}
