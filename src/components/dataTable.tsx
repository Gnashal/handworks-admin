/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  // getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { PaginationState, SortingState } from "@tanstack/react-table";
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

  // optional date filter UI
  enableDateFilter?: boolean;
  onDateSearchClick?: (from: Date | undefined, to: Date | undefined) => void;

  // generic search handler (works even without dates)
  onSearchClick?: (opts: {
    from?: Date;
    to?: Date;
    pageIndex: number;
    pageSize: number;
  }) => void;

  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  onPreviousPageClick?: (pageIndex: number, pageSize: number) => void;
  onNextPageClick?: (pageIndex: number, pageSize: number) => void;
  pageCount?: number;
  canNextPage?: boolean;
  canPreviousPage?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  enableDateFilter = false,
  onPaginationChange,
  onDateSearchClick,
  onSearchClick,
  onNextPageClick,
  onPreviousPageClick,
  pageCount,
  canNextPage,
  canPreviousPage,
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

  // const [sorting, setSorting] = React.useState<SortingState>([
  //   { id: "cleaningDate", desc: false },
  //   { id: "reviewStatus", desc: false },
  //   { id: "paymentStatus", desc: false },
  // ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      // sorting,
    },
    onPaginationChange: setPagination,
    // onSortingChange: setSorting,
    // getSortedRowModel: getSortedRowModel(),
  });

  const handlePreviousPage = () => {
    if (!canPreviousPage) return;
    table.previousPage();
    const { pageIndex, pageSize } = table.getState().pagination;
    onPreviousPageClick?.(pageIndex, pageSize);
  };

  const handleNextPage = () => {
    if (!canNextPage) return;
    table.nextPage();
    const { pageIndex, pageSize } = table.getState().pagination;
    onNextPageClick?.(pageIndex, pageSize);
  };

  const handleSearch = () => {
    const { pageIndex, pageSize } = table.getState().pagination;
    // legacy date-specific callback (for bookings)
    if (onDateSearchClick) {
      onDateSearchClick(fromDate, toDate);
    }
    // generic search callback (for inventory / anything)
    if (onSearchClick) {
      onSearchClick({
        from: fromDate,
        to: toDate,
        pageIndex,
        pageSize,
      });
    }
  };

  return (
    <div className="bg-white p-4 m-auto rounded-md border space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {enableDateFilter && (
            <>
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
            </>
          )}

          {/* Unified Search button: always available if onSearchClick or onDateSearchClick exist */}
          <div className="flex items-center gap-2 text-sm">
            <span>Rows:</span>
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
            {(onSearchClick || onDateSearchClick) && (
              <Button
                size="sm"
                onClick={handleSearch}
                disabled={!onSearchClick && !onDateSearchClick}
              >
                Search
              </Button>
            )}
          </div>
        </div>

        {/* <div className="flex items-center gap-2 text-sm">
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
        </div> */}
      </div>

      {/* Table */}
      <div className="max-h-[60vh] overflow-y-auto rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-row justify-between">
        <div>
          Page <span className="font-small">{pagination.pageIndex + 1}</span> of{" "}
          <span className="font-small">
            {pageCount && pageCount > 0 ? pageCount : 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
