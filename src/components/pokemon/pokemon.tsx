import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import "./Pokemon.css";
import "./pokemonTypes.css";
import ReactApexChart from "react-apexcharts";
Object.defineProperty(String.prototype, "mayusculaPrimeraLetra", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  writable: true,
  configurable: true,
});
//Codigo de pokemon
const Pokemon = () => {
  var param = useParams().id;
  var id: number = 0;
  if (param !== undefined) {
    id = parseInt(param);
  }
  const [dataReceived, setDataReceived] = useState<any>(null);
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
      .then((response) => response.json())
      .then((data: any) => {
        let dataReceived = data;
        fetch(data.species.url)
          .then((response) => response.json())
          .then((data2) => setDataReceived({ ...dataReceived, ...data2 }));
      });
  }, [id]);

  if (!dataReceived) {
    return <div>Cargando...</div>;
  }

  const types = dataReceived.types.map((types: any) => types.type.name);
  const listOfTypes = types.map((value: any, index: any) => (
    <li className={"type" + " " + value} key={index}>
      {value.mayusculaPrimeraLetra()}
    </li>
  ));

  const dataStats = [
    {
      name: dataReceived.stats[0].stat.name.mayusculaPrimeraLetra(),
      stat: dataReceived.stats[0].base_stat,
    },
    {
      name: dataReceived.stats[1].stat.name.mayusculaPrimeraLetra(),
      stat: dataReceived.stats[1].base_stat,
    },
    {
      name: dataReceived.stats[2].stat.name.mayusculaPrimeraLetra(),
      stat: dataReceived.stats[2].base_stat,
    },
    {
      name: dataReceived.stats[3].stat.name.mayusculaPrimeraLetra(),
      stat: dataReceived.stats[3].base_stat,
    },
    {
      name: dataReceived.stats[4].stat.name.mayusculaPrimeraLetra(),
      stat: dataReceived.stats[4].base_stat,
    },
    {
      name: dataReceived.stats[5].stat.name.mayusculaPrimeraLetra(),
      stat: dataReceived.stats[5].base_stat,
    },
  ];
  console.log(dataReceived);
  return (
    <>
      <div className="pokemonContainer">
        <PokePagination id={id} />
        <div className="pokemonData">
          <div className="pokemonTitle">
            <h2>{"N.º " + dataReceived.id}</h2>
            <h1 className="name">
              {dataReceived.name.mayusculaPrimeraLetra()}
            </h1>
            <img
              className="pokemonImg"
              src={
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
                id +
                ".png"
              }
              alt="img"
            />
          </div>
          <div className="pokemonInfo">
            <SelectPokedexInfo data={dataReceived} />
            <PokemonInfoTable data={dataReceived} />
            <p style={{ marginTop: 5 }}>Types: </p>
            <ul>{listOfTypes}</ul>
            <DiagramaDeStats data={dataStats} />
          </div>
          <div className="evolutionChain">
            <EvolutionChain
              id={id}
              url={dataReceived.evolution_chain.url}
              currentData={dataReceived}
            />
          </div>
        </div>
      </div>
    </>
  );
};
function EvolutionChain({ url }: any) {
  const [items, setItems] = useState<JSX.Element[]>([]);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let array: any[] = [];
      array.push(
        <div className="firstLine">
          <img
            className="evolutionImg"
            src={
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
              data.chain.species.url.split("/")[
                data.chain.species.url.split("/").length - 2
              ] +
              ".png"
            }
            alt=""
          />
          <p>{data.chain.species.name.mayusculaPrimeraLetra()}</p>
        </div>
      );
      data.chain.evolves_to.forEach((value: any) => {
        array.push(
          <div className="secondLine">
            <img
              className="evolutionImg"
              src={
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
                value.species.url.split("/")[
                  value.species.url.split("/").length - 2
                ] +
                ".png"
              }
              alt=""
            />
            <p>{value.species.name.mayusculaPrimeraLetra()}</p>
          </div>
        );
        if (value.evolves_to.length > 0) {
          value.evolves_to.forEach((value2: any) => {
            array.push(
              <div className="thirdLine">
                <img
                  className="evolutionImg"
                  src={
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
                    value2.species.url.split("/")[
                      value2.species.url.split("/").length - 2
                    ] +
                    ".png"
                  }
                  alt=""
                />
                <p>{value2.species.name.mayusculaPrimeraLetra()}</p>
              </div>
            );
          });
        }
      });
      setItems(array);
    });

  return <div className="evolutionContainer">{items}</div>;
}
function PokemonInfoTable({ data }: any) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Height</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Ability</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{data.height / 10.0 + " " + "m"}</TableCell>
          <TableCell>{data.weight / 10.0 + " " + "kg"}</TableCell>
          <TableCell>{data.genera[7].genus}</TableCell>
          <TableCell>
            {data.abilities[0].ability.name.mayusculaPrimeraLetra()}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
function DiagramaDeStats({ data }: any) {
  const series = [
    {
      data: data.map((value: any) => value.stat),
    },
  ];

  const options = {
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
        colors: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: "hsl(var(--primary))",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["hsl(var(--foreground))"],
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        return (
          '<div class="arrow_box">' +
          "<span>" +
          w.globals.labels[dataPointIndex] +
          ": " +
          series[seriesIndex][dataPointIndex] +
          "</span>" +
          "</div>"
        );
      },
    },
    xaxis: {
      categories: data.map((value: any) => value.name),
      labels: {
        style: {
          colors: "hsl(var(--foreground))",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 255,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}
function SelectPokedexInfo({ data }: any) {
  function firstLanguageVersion(val: string) {
    for (let i = 0; i < 60; i++) {
      if (pokeInfoArray[i].language.name === val) {
        return i;
      }
    }
    return -1;
  }
  var pokeInfoArray: any[] = [];
  for (let i = 0; i < data.flavor_text_entries.length; i++) {
    if (
      data.flavor_text_entries[i].language.name === "es" ||
      data.flavor_text_entries[i].language.name === "en"
    ) {
      pokeInfoArray.push(data.flavor_text_entries[i]);
    }
  }
  const [version, setVersion] = useState(0);
  useEffect(() => {
    return () => {
      setVersion(firstLanguageVersion(language));
    };
  }, []);
  const [language, setLanguage] = useState("en");
  function LanguageChangeHandler(val: any) {
    setLanguage(val);
    setVersion(firstLanguageVersion(val));
  }
  function VersionChangeHandler(val: any) {
    setVersion(val);
    console.log(val);
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <Select
            value={version.toString()}
            onValueChange={VersionChangeHandler}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Version" />
            </SelectTrigger>
            <SelectContent>
              {pokeInfoArray.map((value: any, index: any) => {
                return (
                  value.language.name === language && (
                    <SelectItem value={index.toString()}>
                      {value.version.name.mayusculaPrimeraLetra()}
                    </SelectItem>
                  )
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={language} onValueChange={LanguageChangeHandler}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">Ingles</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="dsp">
        {pokeInfoArray[version].flavor_text ? (
          pokeInfoArray[version].flavor_text.replace(/[\n\f]/g, " ")
        ) : (
          <p>Error</p>
        )}
      </p>
    </>
  );
}
function PokePagination({ id }: any) {
  return (
    <Pagination>
      <PaginationContent>
        {id === 1 ? (
          <></>
        ) : (
          <PaginationItem>
            <Link to={"/Pokedex/pokemon/" + (id - 1)}>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                <span>Previous</span>
              </button>
            </Link>
          </PaginationItem>
        )}
        <PaginationItem>
          <Link to={"/Pokedex/pokemon/" + (id + 1)}>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5">
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right h-4 w-4"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
export default Pokemon;
