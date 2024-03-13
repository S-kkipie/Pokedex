import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/ui/mode-togle";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import Pokemon from "./components/pokemon/pokemon";
import { useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const [showPagination, setShowPagination] = useState(true);
  const [pokeList, setPokeList] = useState<JSX.Element[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
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
          setShowPagination(true);
        });
      });
  }, []);
  function clickHandler() {
    setLoadingData(true);
    fetch("https://pokeapi.co/api/v2/pokemon/" + inputValue.toLowerCase())
      .then((response) => response.json())
      .then((data) => {
        setShowPagination(false);
        setLoadingData(false);
        setError(false);
        setPokeList([
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
          />,
        ]);
      })
      .catch(() => {
        setShowPagination(false);
        setPokeList([]);
        setLoadingData(false);
        setError(true);
      });
  }
  function changeHandler(e: any) {
    setInputValue(e.target.value);
  }
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <nav>
          <a href="">
            <img src="./pokemon-logo.svg" alt="Pokemon" width={150} />
          </a>

          <div className="options">
            <ModeToggle />
          </div>
        </nav>
        <div className="pokedexContainer">
          <div className="search">
            <Input
              onChange={changeHandler}
              value={inputValue}
              placeholder="Comienza a buscar por el nombre o el id de la Pokedex Nacional"
            />
            <Button onClick={clickHandler}>Buscar</Button>
          </div>
          {!error ? (
            <></>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se encontraron resultados para tu busqueda
              </AlertDescription>
            </Alert>
          )}

          <div className="results"></div>
          <div className="defaultPokemons">
            {loadingData ? <h2>Cargando...</h2> : pokeList}
          </div>
          <div className="Paginations">
            {showPagination ? (
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
            ) : (
              <hr />
            )}
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
