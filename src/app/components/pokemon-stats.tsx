import { PokemonData } from "@/app/models/pokemon";

interface PokemonStatsProps {
  pokemon: PokemonData;
}

export default function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <div className="pokemon-stats">
      <h3>Estadísticas Base</h3>
      {pokemon.stats.map((stat, index) => (
        <div key={index} className="stat-row">
          <span className="stat-name">
            {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:
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
  );
}