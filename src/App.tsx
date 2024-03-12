import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/ui/mode-togle";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import Pokemon from "./components/pokemon/pokemon";
import { useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
Object.defineProperty(String.prototype, "mayusculaPrimeraLetra", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  writable: true,
  configurable: true,
});

function App() {
  const [pokeList, setPokeList] = useState<JSX.Element[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        const fetchPromises = data.results.map((value: any) => {
          return fetch(value.url)
            .then((response) => response.json())
            .then((data) => {
              return (
                <Pokemon
                  key={data.id}
                  imgSrc={data.sprites.front_default}
                  id={data.id}
                  name={data.name.mayusculaPrimeraLetra()}
                  types={data.types.map(
                    (types: {
                      type: { name: { mayusculaPrimeraLetra: () => any } };
                    }) => types.type.name.mayusculaPrimeraLetra()
                  )}
                />
              );
            });
        });
        Promise.all(fetchPromises).then((pokemonComponents) => {
          setPokeList(pokemonComponents);
          setLoadingData(false);
        });
      });
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <nav>
          <img src="./pokemon-logo.svg" alt="Pokemon" width={150} />
          <div className="options">
            <ModeToggle />
          </div>
        </nav>
        <div className="pokedexContainer">
          <div className="search">
            <Input placeholder="Comienza a buscar por el nombre o el id de la Pokedex Nacional" />
            <Button>Buscar</Button>
          </div>
          <div className="results"></div>
          <div className="defaultPokemons">
            {loadingData ? <h2>Cargando...</h2> : pokeList}
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
