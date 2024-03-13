import "./Pokemon.css";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
interface PokemonProps {
  imgSrc: string;
  id: number;
  name: string;
  types: string[];
  stats: any;
}

const Pokemon: React.FC<PokemonProps> = ({
  imgSrc,
  id,
  name,
  types,
  stats,
}) => {
  const listOfTypes = types.map((value, index) => <li key={index}>{value}</li>);
  const data = [
    {
      name: "Ps",
      stat: stats[0].base_stat,
    },
    {
      name: "Ataque",
      stat: stats[1].base_stat,
    },
    {
      name: "Defensa",
      stat: stats[2].base_stat,
    },
    {
      name: "Ataque especial",
      stat: stats[3].base_stat,
    },
    {
      name: "Defensa especial",
      stat: stats[4].base_stat,
    },
    {
      name: "Velocidad",
      stat: stats[5].base_stat,
    },
  ];
  return (
    <div className="pokemonItem shadow">
      <img className="pokemonImg" src={imgSrc} alt="img" />
      <div className="pokemonData">
        <p className="id">N.º {id}</p>
        <AlertDialog>
          <AlertDialogTrigger className="name">{name}</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{name}</AlertDialogTitle>
              <AlertDialogDescription className="pokemonInformationContainer">
                <img
                  width={180}
                  className="pokemonImg"
                  src={imgSrc}
                  alt="img"
                />
                <p className="id">N.º {id}</p>
                <h1 className="name">{name}</h1>
                <hr />
                <h1 style={{ marginTop: 5 }}>Types: </h1>
                <div style={{ marginBottom: 5 }} className="types">
                  <ul>{listOfTypes}</ul>
                </div>
                <hr />
                <h1 style={{ marginTop: 24 }}>STATS:</h1>
                <div className="mt-3 h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <XAxis hide={true} dataKey="name" />
                      <YAxis dataKey={"stat"} />
                      <Tooltip />
                      <Bar
                        dataKey="stat"
                        style={
                          {
                            fill: "hsl(var(--primary))",
                            opacity: 0.9,
                          } as React.CSSProperties
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="types">
          <ul>{listOfTypes}</ul>
        </div>
      </div>
    </div>
  );
};
export default Pokemon;
