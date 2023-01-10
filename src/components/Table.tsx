import React, { useCallback, useEffect, useState } from "react";
import { Row, useFilters, usePagination, useSortBy, useTable } from "react-table";
import Modal from "@mui/material/Modal";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";

const Table = ({ columns, data, rowsPerPage }: any) => {
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    page, // rows for the table based on the data passed
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state,
    setFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 7 },
    },
    useFilters,
    useSortBy,
    usePagination,
  );

    const [gameData, setGameData] = useState<any>([]);
    const [totalGames, setTotalGames] = useState<any>([]);
    const [teamData, setTeamData] = useState<any>([]);
    const [homeTeam,setHomeTeam] = useState<any>([]);
    const [awayTeam,setAwayTeam] = useState<any>([]);




  const [filterInput, setFilterInput] = useState("");
  const handleFilterChange = (e: any) => {
    const value = e.target.value || undefined;
    setFilter("full_name", value); 
    setFilterInput(value);
  };

  const getGameData = async (id:any) => {
    const result = await axios(`https://www.balldontlie.io/api/v1/games?seasons[]=2018&team_ids[]=${id}`);
    // console.log(result);
    setGameData(result.data.data[0]);
    setHomeTeam(result.data.data[0].home_team.full_name);
    setAwayTeam(result.data.data[0].visitor_team.full_name);
    setTotalGames(result.data.meta);
    setTeamData(data[id]);
  };

  // useEffect(() => {
  //   (async () => {
  //     const result = await axios(" https://www.balldontlie.io/api/v1/games?seasons[]=2018&team_ids[]=1");
  //     setGameData(result.data);
  //   })();
  // }, []);
  // console.log(gameData);
  // console.log(homeTeam);

  const { pageIndex, pageSize } = state;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => setOpen(false);


  return (
    <>
    <input className="search-bar" placeholder="Search Name" value={filterInput}
  onChange={handleFilterChange} />
      <table {...getTableProps()}>
        <thead className="table-head">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className={`table-head-cell ${column.isSorted
                  ? column.isSortedDesc
                    ? "sort-desc"
                    : "sort-asc"
                  : ""}`}>
                  {column.render("Header")} 
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: Row<{}>, i: any) => {
            prepareRow(row);
            return (
              <div className="table-row">
                <div>
                  <Modal open={open} onClose={handleClose}>
                    <Box className="modal">
                      <div className="modal-header">
                        <div>{teamData.city}</div>
                      </div>
                      <div className="modal-body">
                        <div className="item-1">Team Full Name</div>
                        <div className="item-2">{teamData.full_name}</div>
                      </div>
                      <div className="modal-body">
                        <div className="item-1">Team games in 2021</div>
                        <div className="item-2">{totalGames.total_count}</div>
                      </div>
                      <br></br>
                      <div className="game-details">
                        <div>Random Game Details : </div>
                        <div className="modal-body">
                          <div className="item-1">Date</div>
                          <div className="item-2">{gameData.date}</div>
                        </div>
                        <div className="modal-body">
                          <div className="item-1">Home Team</div>
                          <div className="item-2">{homeTeam}</div>
                        </div>
                        <div className="modal-body">
                          <div className="item-1">Home Team Score</div>
                          <div className="item-2">{gameData.home_team_score}</div>
                        </div>
                        <div className="modal-body">
                          <div className="item-1">Visitor Team</div>
                          <div className="item-2">{awayTeam}</div>
                        </div>
                        <div className="modal-body">
                          <div className="item-1">Visitor Team Score</div>
                          <div className="item-2">{gameData.visitor_team_score}</div>
                        </div>
                      </div>
                    </Box>
                  </Modal>
                </div>
                <tr {...row.getRowProps()} onClick={() => {handleOpen();getGameData(row.id)}}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="table-row-cell">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              </div>
            );
          })}
        </tbody>
      </table>

      <div className="table-footer">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        {/* <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "} */}
        {/* <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>
    </>
  );
};

export default Table;
