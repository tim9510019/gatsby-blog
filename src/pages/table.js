import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TbArrowsSort } from "react-icons/tb";
import { BsSortUp, BsSortDown } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Data from "../bubbles/bubbles.json";
import TableInput from "../components/TableInput";
import TableSelect from "../components/TableSelect";
import TableFilter from "../components/TableFilter";

const dates = Object.keys(Data).sort((a, b) => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return dateA - dateB;
});
const columns = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: (props) => <TableInput {...props} />,
  },
  {
    accessorKey: "PP80",
    header: "PP80",
    cell: (props) => <TableSelect {...props} />,
  },
  {
    accessorKey: "PP100",
    header: "PP100",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "D1",
    header: "D1",
    cell: (props) => <p>{Math.round(props.getValue() * 10000) / 100 + "%"}</p>,
  },
  {
    accessorKey: "D7",
    header: "D7",
    cell: (props) => <p>{Math.round(props.getValue() * 10000) / 100 + "%"}</p>,
  },
  {
    accessorKey: "D14",
    header: "D14",
    cell: (props) => <p>{Math.round(props.getValue() * 10000) / 100 + "%"}</p>,
  },
  {
    accessorKey: "D30",
    header: "D30",
    cell: (props) => <p>{Math.round(props.getValue() * 10000) / 100 + "%"}</p>,
  },
  {
    accessorKey: "LD1",
    header: "LD1",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "LD7",
    header: "LD7",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "LD14",
    header: "LD14",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "LD30",
    header: "LD30",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];

const Table = () => {
  const [date, setDate] = useState(dates[0]);
  const [bubble, setBubble] = useState(Data[dates[0]]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: bubble,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiSorting: true,
    autoResetPageIndex: true,
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setBubble((prev) => {
          return prev.map((row, index) => {
            if (index === rowIndex) {
              return { ...row, [columnId]: value };
            } else return row;
          });
        });
      },
      filterData: () => {},
    },
  });
  const handleChangeDate = (e) => {
    setDate(e.target.value);
    setBubble(Data[e.target.value]);
  };
  return (
    <div className="mx-auto max-w-[1000px]">
      <select name="date" id="date" onChange={handleChangeDate}>
        {dates.map((date) => (
          <option key={date}>{date}</option>
        ))}
      </select>
      <TableFilter
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <table className="border-collapse border border-slate-300 text-sm touch-none">
        <caption className="text-lg font-semibold mb-4">{date}泡沫圖</caption>
        <thead style={{ width: table.getTotalSize() }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-slate-300 relative py-2"
                  style={{ width: header.getSize() }}
                >
                  <div className="flex items-center gap-1 justify-center">
                    {header.column.columnDef.header}
                    {header.column.getCanSort() && (
                      <button onClick={header.column.getToggleSortingHandler()}>
                        <TbArrowsSort />
                      </button>
                    )}
                    {
                      { asc: <BsSortUp />, desc: <BsSortDown /> }[
                        header.column.getIsSorted()
                      ]
                    }
                  </div>
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`touch-none absolute top-0 right-0 w-2 h-full bg-slate-400 cursor-col-resize opacity-0 ${
                      header.column.getIsResizing() && "isResizing"
                    }`}
                  ></div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-slate-300 text-slate-700 py-1 text-right"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div>{`Page ${
          table.getState().pagination.pageIndex + 1
        } of ${table.getPageCount()}`}</div>
      </div>
      <div>
        <button className="px-2 py-1 border-2" onClick={table.previousPage}>
          <FaAngleLeft />
        </button>
        <button className="px-2 py-1 border-2" onClick={table.nextPage}>
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default Table;
