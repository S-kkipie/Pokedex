import React from "react";
interface PokemonProps {
  imgSrc: string;
  id: number;
  name: string;
  types: string[];
}

const Pokemon: React.FC<PokemonProps> = ({ imgSrc, id, name, types }) => {
  const listOfTypes = types.map((value, index) => <li key={index}>{value}</li>);

  return (
    <div>
      <img src={imgSrc} alt="img" />
      <p>{id}</p>
      <h1>{name}</h1>
      <div className="types">
        <ul>{listOfTypes}</ul>
      </div>
    </div>
  );
};
export default Pokemon;
