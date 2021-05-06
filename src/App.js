import React, { useState, useEffect } from "react";

import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";

import Button from "muicss/lib/react/button";
import Panel from "muicss/lib/react/panel";
import Container from "muicss/lib/react/container";
import "./App.css";

function App() {
  const [animals, setAnimals] = useState([]);
  const [filter, setFilter] = useState("all"); //cat, dog
  const [sortKey, setSortKey] = useState("age"); //name, desc, type, age
  const [sortDirection, setSortDirection] = useState("asc"); //asc, desc

  function parseData(data) {
    const nextAnimals = data.map((ani) => {
      //"Mia the black cat",
      const [name, , desc, type] = ani.fullname.split(" ");
      return {
        name,
        desc,
        type,
        age: ani.age,
      };
    });
    setAnimals(nextAnimals);
  }

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    setSortKey(key);
  }

  useEffect(() => {
    fetch("animals.json")
      .then((r) => r.json())
      .then(parseData);
  }, []);

  let filteredAnimals = animals;
  if (filter !== "all") {
    filteredAnimals = animals.filter((ani) => ani.type === filter);
  }

  filteredAnimals = filteredAnimals.sort((a, b) => {
    if (a[sortKey] > b[sortKey]) {
      return sortDirection === "asc" ? 1 : -1;
    } else {
      return sortDirection === "asc" ? -1 : 1;
    }
  });

  return (
    <div className="App">
      <Container>
        <Panel>
          <Button
            variant="raised"
            color="primary"
            onClick={() => setFilter("cat")}
            disabled={filter === "cat" ? true : false}
          >
            Cats
          </Button>
          <Button
            variant="raised"
            color="primary"
            onClick={() => setFilter("dog")}
            disabled={filter === "dog" ? true : false}
          >
            Dogs
          </Button>
          <Button
            variant="raised"
            color="primary"
            onClick={() => setFilter("all")}
            disabled={filter === "all" ? true : false}
          >
            All
          </Button>
        </Panel>
        <Panel>
          <table>
            <TableHead
              sortDirection={sortDirection}
              sortKey={sortKey}
              toggleSort={toggleSort}
            />
            <tbody>
              {filteredAnimals.map((ani) => {
                return (
                  <tr key={ani.name}>
                    <td> {ani.name} </td> <td> {ani.desc} </td>
                    <td> {ani.type} </td> <td> {ani.age} </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </Container>
    </div>
  );
}

function TableHead(props) {
  return (
    <thead>
      <tr>
        <TableHeader property="name" {...props} />
        <TableHeader property="desc" {...props} />
        <TableHeader property="type" {...props} />
        <TableHeader property="age" {...props} />
      </tr>
    </thead>
  );
}

function TableHeader(props) {
  const icon =
    props.sortDirection === "asc" ? (
      <FcAlphabeticalSortingAz />
    ) : (
      <FcAlphabeticalSortingZa />
    );
  return (
    <th onClick={() => props.toggleSort(props.property)}>
      {props.property} {props.sortKey === props.property && icon}
    </th>
  );
}
export default App;
