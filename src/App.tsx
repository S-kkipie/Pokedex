import "./App.css";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/ui/mode-togle";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import Pokemon from "./components/pokemon/pokemon";
import { useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PokemonItems from "./components/pokemon/pokemonItem";
Object.defineProperty(String.prototype, "mayusculaPrimeraLetra", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  writable: true,
  configurable: true,
});
let anchoVentana = window.innerWidth;
//var mobile = anchoVentana < 400;
const valores = window.location.search;
const urlParams = new URLSearchParams(valores);
var offset = urlParams.get("offset");
var offsetValue = offset !== null ? parseInt(offset) : 0;
function App() {
  const navigate = useNavigate();
  const [showPagination, setShowPagination] = useState(true);
  const [pokeList, setPokeList] = useState<JSX.Element[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [reloadPage, setReloadPage] = useState(true);
  function setAllVariables() {
    setPokeList([]);
    setLoadingData(false);
    setShowPagination(true);
    setError(false);
  }
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=12&offset=" + offsetValue)
      .then((response) => response.json())
      .then((data) => {
        const fetchPromises = data.results.map((value: any) => {
          return fetch(value.url)
            .then((response) => response.json())
            .then((data) => {
              return (
                <Link to={"/Pokedex/pokemon/" + data.id}>
                  <PokemonItems
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
                </Link>
              );
            });
        });
        Promise.all(fetchPromises).then((pokemonComponents) => {
          setPokeList(pokemonComponents);
          setLoadingData(false);
          setShowPagination(true);
        });
      });
  }, [reloadPage]);
  function logoClickHandler() {
    setAllVariables();
    setReloadPage(!reloadPage);
  }
  function pokemonClickHandler() {
    fetch("https://pokeapi.co/api/v2/pokemon/" + inputValue.toLowerCase())
      .then((response) => response.json())
      .then((data) => {
        navigate("/Pokedex/pokemon/" + data.id);
      })
      .catch(() => {
        setShowPagination(false);
        setError(true);
        setLoadingData(false);
        setPokeList([]);
      });
  }
  function changeHandler(e: any) {
    setInputValue(e.target.value);
  }
  return (
    <main style={{ overflowX: "hidden" }}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <nav className="topNav">
          <Link className="logoImg" to={"/Pokedex/"}>
            <img
              onClick={logoClickHandler}
              src="/Pokedex/pokemon-logo.svg"
              alt="Pokemon"
              width={150}
            />
          </Link>
          <div className="search">
            <Input
              onChange={changeHandler}
              value={inputValue}
              placeholder="Comienza a buscar por el nombre o el id de la Pokedex Nacional"
            />
            <Button onClick={pokemonClickHandler}>Buscar</Button>
          </div>
          <div className="options">
            {/* <Button variant="outline">Movimientos</Button>
            <Button variant="outline">Habilidades</Button>
            <Button variant="outline">Items</Button>
            <Button variant="outline">Button</Button> */}
            <ModeToggle />
          </div>
        </nav>
        <AnimatePresence>
          <Routes>
            <Route
              path="/Pokedex/pokemon/:id"
              element={
                <>
                  <Pokemon />
                </>
              }
            />
            <Route
              path="/Pokedex"
              element={
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ease: "easeIn", duration: 1 }}
                    className="pokedexContainer"
                  >
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
                              <PaginationNext
                                href={"?offset=" + (offsetValue + 12)}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      ) : (
                        <hr />
                      )}
                    </div>
                  </motion.div>
                </>
              }
            ></Route>
          </Routes>
        </AnimatePresence>
      </ThemeProvider>
    </main>
  );
}
export default App;
