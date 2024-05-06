import { useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import dataJSON from "./data.json";
import "./table.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";

const TanTable = () => {
  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Athlete", accessorKey: "athlete" },
    { header: "Country", accessorKey: "country" },
    { header: "Age", accessorKey: "age" },
    { header: "Year", accessorKey: "year" },
  ];

  const [editRowId, setEditRowId] = useState(null);
  const [editColumnId, setEditColumnId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const handleCellClick = (rowGroup, cellEl) => {
    const rowId = rowGroup.id;
    const columnId = cellEl.column.id;
    const cellValue = cellEl.renderValue(cellEl.column.id);

    console.log("Clicked cell:", rowId, columnId, cellValue);

    if (rowId != null && columnId != null && cellValue != null) {
      setEditRowId(rowId);
      setEditColumnId(columnId);
      setEditValue(cellValue.toString());
    } else {
      console.error(
        "Invalid parameters in handleCellClick:",
        rowId,
        columnId,
        cellValue
      );
    }
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = () => {
    // Handle editing logic here
    console.log("Editing value:", editValue);
    setEditRowId(null);
    setEditColumnId(null);
  };

  const table = useReactTable({
    columns: columns,
    data: dataJSON,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChanged: setFiltering,
  });

  return (
    <>
      <div className="filter-container">
        <TextField
          placeholder="search"
          variant="standard"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
        />
      </div>
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {
                        { asc: " -UP", desc: " -DOWN" }[
                          header.column.getIsSorted() ?? null
                        ]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((rowGroup) => (
                <TableRow key={rowGroup.id}>
                  {rowGroup.getVisibleCells().map((cellEl) => {
                    console.log("rowGroup:", rowGroup);
                    console.log("cellEl:", cellEl);
                    const columnId = cellEl.column.id;
                    const cellValue = cellEl.renderValue(cellEl.column.id);
                    if (
                      typeof columnId === "undefined" ||
                      typeof cellValue === "undefined"
                    ) {
                      console.error(
                        "Invalid parameters in handleCellClick:",
                        rowGroup.id,
                        columnId,
                        cellValue
                      );
                      return null;
                    }
                    const isEditing =
                      editRowId === rowGroup.id && editColumnId === columnId;
                    return (
                      <TableCell key={cellEl.id}>
                        {isEditing ? (
                          <TextField
                            type="text"
                            value={editValue}
                            onChange={handleEditChange}
                            onBlur={handleEditSave}
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => handleCellClick(rowGroup, cellEl)}
                          >
                            {flexRender(
                              cellEl.column.columnDef.cell,
                              cellEl.getContext()
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="button">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous Page
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next Page
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
    </>
  );
};

export default TanTable;
