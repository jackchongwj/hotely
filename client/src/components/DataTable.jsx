import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TableSortLabel } from "@mui/material";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const DataTable = ({ columns, rows }) => {
  const classes = useStyles();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(columns[0].id);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(currentPage || 0);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === "asc";
    setSortBy(columnId);
    setSortDirection(isAsc ? "desc" : "asc");
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedRows = filteredRows.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (aValue === bValue) {
      return 0;
    }
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TextField
        label="Search"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />

      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={sortBy === column.id ? sortDirection : false}
                >
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortDirection}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{row[column.id]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
    );
  };
  
  export default DataTable;