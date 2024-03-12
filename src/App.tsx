import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/ui/mode-togle";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import Pokemon from "./components/pokemon";
import { useEffect, useState } from "react";
interface Sprite {
  front_default: string;
}

interface Type {
  name: string;
}

interface PokemonData {
  sprites: Sprite;
  id: number;
  name: string;
  types: Type[];
}
function App() {
  const [pokeData, setPokeData] = useState<PokemonData | null>(null);
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/ditto")
      .then((response) => response.json())
      .then((data) => {
        setPokeData(data);
      });
  }, []);

  return (
    <>
      <nav>
        <img src="./pokemon-logo.svg" alt="Pokemon" width={150} />
        <div className="options">
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle />
          </ThemeProvider>
        </div>
      </nav>
      <div className="pokedexContainer">
        <div className="search">
          <Input placeholder="Comienza a buscar por el nombre o el id de la Pokedex Nacional" />
          <Button>Buscar</Button>
        </div>
        <div className="results"></div>
        <div className="defaultPokemons">
          {pokeData !== null ? (
            <Pokemon
              imgSrc={pokeData.sprites.front_default}
              id={pokeData.id}
              name={pokeData.name}
              types={pokeData.types.map((type) => type.name)}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default App;
