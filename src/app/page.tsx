import PokemonList from "./components/pokemon-list";
import { getPokemons } from "./services/pokemon";
import "./styles/globals.css";

export default async function Home() {
  const pokemons = await getPokemons();  
  
  return (
    <div className="container">
    <PokemonList initialPokemons={pokemons} />
    </div>
  );
}
