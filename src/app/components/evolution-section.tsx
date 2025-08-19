import Link from "next/link";
import PokemonCard from "./pokemon-card";
import { EvolutionPokemon } from "../models/pokemon";

interface EvolutionSectionProps {
  evolutions: EvolutionPokemon[];
}

export default function EvolutionSection({ evolutions }: EvolutionSectionProps) {
  if (evolutions.length === 0) return null;

  return (
    <div className="evolution-section">
      <h2>Evolution Chain</h2>
      <div className="evolution-cards">
        {evolutions.map((evolution) => (
          <Link key={evolution.id} href={`/pokemon/${evolution.id}`}>
            <PokemonCard pokemon={evolution} />
          </Link>
        ))}
      </div>
    </div>
  );
}