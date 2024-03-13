import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/ui/mode-togle";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import Pokemon from "./components/pokemon/pokemon";
import { useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
Object.defineProperty(String.prototype, "mayusculaPrimeraLetra", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  writable: true,
  configurable: true,
});
const valores = window.location.search;
const urlParams = new URLSearchParams(valores);
var offset = urlParams.get("offset");
var offsetValue = offset !== null ? parseInt(offset) : 0;
function App() {
  const [pokeList, setPokeList] = useState<JSX.Element[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=12&offset=" + offsetValue)
      .then((response) => response.json())
      .then((data) => {
        const fetchPromises = data.results.map((value: any) => {
          return fetch(value.url)
            .then((response) => response.json())
            .then((data) => {
              return (
                <Pokemon
                  stats={data.stats}
                  key={data.id}
                  imgSrc={
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
                    data.id +
                    ".png"
                  }
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
            <Pagination>
              <PaginationContent>
                {offsetValue === 0 ? (
                  <></>
                ) : (
                  <PaginationItem>
                    <PaginationPrevious
                      href={"?offset=" + (offsetValue - 12)}
                    />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext href={"?offset=" + (offsetValue + 12)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
