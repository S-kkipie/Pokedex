import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PokemonItems from "../pokemon/pokemonItem";

import { JSX } from "react/jsx-runtime";

import { motion, useAnimate } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function PokeList() {
  const [scope, animate] = useAnimate();

  var param = useParams().offset;
  console.log(param);
  var id: number = 15;
  if (param !== undefined) {
    id = parseInt(param);
  }
  let widhtItem = Math.floor(window.innerWidth / 200 - 1) * 3;

  const [showPagination, setShowPagination] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [pokeList, setPokeList] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const enterAnimation = async () => {
      await animate("*", { opacity: 0 }, { ease: "easeOut", duration: 0.1 });
      await animate(
        "*",
        { opacity: 1, x: 0 },
        { ease: "easeIn", duration: 0.5 }
      );
    };
    enterAnimation();
    fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=" + widhtItem + "&offset=" + id
    )
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
  }, [id]);
  return (
    <>
      <motion.div ref={scope} className="pokedexContainer">
        <div className="defaultPokemons">
          {loadingData ? <h2>Cargando...</h2> : pokeList}
        </div>
        <div className="Paginations">
          {showPagination ? (
            <Pagination>
              <PaginationContent>
                {id === 0 ? (
                  <></>
                ) : (
                  <PaginationItem>
                    <Link to={"/Pokedex/" + (id - widhtItem)}>
                      <PaginationPrevious />
                    </Link>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <Link to={"/Pokedex/" + (id + widhtItem)}>
                    <PaginationNext />
                  </Link>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : (
            <hr />
          )}
        </div>
      </motion.div>
    </>
  );
}
export default PokeList;
