import { Suspense } from 'react';
import PokemonList from "./components/pokemon-list";
import { getPokemons } from "./services/pokemon";
import "./styles/globals.css";

function LoadingPokemon() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando Pokémon...</p>
    </div>
  );
}

export default async function Home() {
  const pokemons = await getPokemons();
  
  return (
    <div className="container">
      <Suspense fallback={<LoadingPokemon />}>
        <PokemonList initialPokemons={pokemons} />
      </Suspense>
    </div>
  );
}
