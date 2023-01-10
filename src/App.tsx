import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Search from './components/Search';
import Table from './components/Table';
import axios from "axios";
import './styles/app.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await axios("https://www.balldontlie.io/api/v1/teams");
      setData(result.data.data);
    })();
  }, []);

  // console.log(data);

  const columns = useMemo(
    () => [
      {
        Header: 'Team Name',
        accessor: 'full_name',
      },
      {
        Header: 'City',
        accessor: 'city',
      },
      {
        Header: 'Abbreviation',
        accessor: 'abbreviation',
      },
      {
        Header: 'Conference',
        accessor: 'conference',
      },
      {
        Header: 'Division',
        accessor: 'division',
      },
    ],[]
  );
  
  return (
    <div className="App">
      <Header></Header>
      {/* <Search></Search> */}
      <Table columns={columns} data={data} rowsPerPage={5} />
    </div>
  );
}

export default App;