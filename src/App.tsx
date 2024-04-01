import "./App.css";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/ui/mode-togle";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import Pokemon from "./components/pokemon/pokemon";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence } from "framer-motion";
import PokeList from "./components/PokeList/PokeList";
Object.defineProperty(String.prototype, "mayusculaPrimeraLetra", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  writable: true,
  configurable: true,
});

// let anchoVentana = window.innerWidth;
//var mobile = anchoVentana < 400;

function App() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  function pokemonClickHandler() {
    fetch("https://pokeapi.co/api/v2/pokemon/" + inputValue.toLowerCase())
      .then((response) => response.json())
      .then((data) => {
        navigate("/Pokedex/pokemon/" + data.id);
        setError(false);
      })
      .catch(() => {
        setError(true);
      });
  }
  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    navigate("/Pokedex/0");
  });
  function changeHandler(e: any) {
    setInputValue(e.target.value);
  }
  return (
    <main style={{ overflowX: "hidden" }}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <nav className="topNav">
          <Link
            onClick={() => {
              setError(false);
            }}
            className="logoImg"
            to={"/Pokedex/0 "}
          >
            <img src="/Pokedex/pokemon-logo.svg" alt="Pokemon" width={150} />
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
                  {!error ? (
                    <Pokemon />
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        No se encontraron resultados para tu busqueda
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              }
            />
            <Route
              path="/Pokedex/:offset"
              element={
                <>
                  {!error ? (
                    <PokeList />
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        No se encontraron resultados para tu busqueda
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              }
            ></Route>
            <Route
              path="/Pokedex"
              element={<Navigate to="/Pokedex/0" />}
            ></Route>
          </Routes>
        </AnimatePresence>
      </ThemeProvider>
    </main>
  );
}
export default App;
