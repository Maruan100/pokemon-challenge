interface PokemonProps {
  pokemon: {
    id: number;
    name: string;
    types: string[];
    generation: string;
  };
}

export default function PokemonCard({ pokemon }: PokemonProps) {
  return (
    <div>
      <li className="pokemons-list">
        <img
          className="pokemons-list__img"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
          alt={pokemon.name}
        />

        <div className="pokemons-list__info">
          <div>
            <span className="pokemon-name">#{pokemon.id} {pokemon.name}</span>
          </div>
          {pokemon.types.map((type, index) => (
            <span key={index} className="pokemon-type">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
          <span className="pokemon-id">{pokemon.generation}</span>
        </div>
      </li>
    </div>
  );
}
