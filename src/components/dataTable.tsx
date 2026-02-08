/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;

  enableDateFilter?: boolean;
  getStartDate?: (row: TData) => Date | null;
  getEndDate?: (row: TData) => Date | null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  enableDateFilter = false,
  getStartDate,
  getEndDate,
}: DataTableProps<TData, TValue>) {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();

  const filteredData = React.useMemo(() => {
    if (!enableDateFilter) return data;
    if (!fromDate && !toDate) return data;
    if (!getStartDate && !getEndDate) return data;

    return data.filter((row) => {
      const start = getStartDate?.(row) ?? getEndDate?.(row);
      const end = getEndDate?.(row) ?? getStartDate?.(row);

      if (!start && !end) return true;

      const startTime = start?.getTime();
      const endTime = end?.getTime();

      const fromTime = fromDate?.setHours(0, 0, 0, 0);
      const toTime = toDate?.setHours(23, 59, 59, 999);

      if (fromTime && startTime && startTime < fromTime) return false;
      if (toTime && endTime && endTime > toTime) return false;

      return true;
    });
  }, [data, fromDate, toDate, getStartDate, getEndDate, enableDateFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white p-4 m-auto rounded-md border space-y-4">
      {/* Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left side */}
        {enableDateFilter && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Date range:</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-none w-30 justify-start text-left font-normal"
                >
                  {fromDate ? format(fromDate, "yyyy-MM-dd") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => setFromDate(date ?? undefined)}
                  autoFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-sm">to</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-none w-30 justify-start text-left font-normal"
                >
                  {toDate ? format(toDate, "yyyy-MM-dd") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => setToDate(date ?? undefined)}
                  autoFocus
                />
              </PopoverContent>
            </Popover>

            {(fromDate || toDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFromDate(undefined);
                  setToDate(undefined);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Right side*/}
        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page:</span>
          <input
            type="number"
            min={1}
            className="w-16 h-8 rounded border px-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              const size = Number(e.target.value) || 1;
              table.setPageSize(size);
            }}
          />
        </div>
      </div>
      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex items-center justify-between pt-2 text-sm">
        <div>
          Page{" "}
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          of <span className="font-medium">{table.getPageCount() || 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
