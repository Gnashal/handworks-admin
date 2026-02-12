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
import type { PaginationState } from "@tanstack/react-table";
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

  // keep the search callback if you like the UI
  enableDateFilter?: boolean;
  onDateSearchClick?: (from: Date | undefined, to: Date | undefined) => void;

  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  enableDateFilter = false,
  onPaginationChange,
  onDateSearchClick,
}: DataTableProps<TData, TValue>) {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    onPaginationChange?.(pagination.pageIndex, pagination.pageSize);
  }, [pagination, onPaginationChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="bg-white p-4 m-auto rounded-md border space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {enableDateFilter && (
          <div className="flex flex-wrap items-center gap-2">
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
                  onDateSearchClick?.(undefined, undefined);
                }}
              >
                Clear
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => onDateSearchClick?.(fromDate, toDate)}
              disabled={!onDateSearchClick}
            >
              Search
            </Button>
          </div>
        )}

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
          Page <span className="font-medium">{pagination.pageIndex + 1}</span>{" "}
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
