import React from "react";
import "./Pokemon.css";
interface PokemonProps {
  imgSrc: string;
  id: number;
  name: string;
  types: string[];
}

const Pokemon: React.FC<PokemonProps> = ({ imgSrc, id, name, types }) => {
  const listOfTypes = types.map((value, index) => <li key={index}>{value}</li>);

  return (
    <div className="pokemonItem">
      <img className="pokemonImg" src={imgSrc} alt="img" />
      <div className="pokemonData">
        <p className="id">N.º {id}</p>
        <h1 className="name">{name}</h1>
        <div className="types">
          <ul>{listOfTypes}</ul>
        </div>
      </div>
    </div>
  );
};
export default Pokemon;
