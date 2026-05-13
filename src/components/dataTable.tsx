/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

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
  onDateSearchClick?: (from: Date | undefined, to: Date | undefined) => void;

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
  emptyMessage?: string;
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
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    onPaginationChange?.(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize, onPaginationChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    },
  });

  const resolvedPageCount = pageCount && pageCount > 0 ? pageCount : 1;
  const resolvedCanPreviousPage = canPreviousPage ?? pagination.pageIndex > 0;
  const resolvedCanNextPage = canNextPage ?? false;
  const hasDateFilter = Boolean(fromDate || toDate);

  const handlePreviousPage = () => {
    if (!resolvedCanPreviousPage) return;

    const nextPageIndex = Math.max(0, pagination.pageIndex - 1);

    setPagination((prev) => ({
      ...prev,
      pageIndex: nextPageIndex,
    }));

    onPreviousPageClick?.(nextPageIndex, pagination.pageSize);
  };

  const handleNextPage = () => {
    if (!resolvedCanNextPage) return;

    const nextPageIndex = pagination.pageIndex + 1;

    setPagination((prev) => ({
      ...prev,
      pageIndex: nextPageIndex,
    }));

    onNextPageClick?.(nextPageIndex, pagination.pageSize);
  };

  const handlePageSizeChange = (value: string) => {
    const size = Math.max(1, Number(value) || 1);

    setPagination({
      pageIndex: 0,
      pageSize: size,
    });
  };

  const handleSearch = () => {
    const nextPageIndex = 0;

    setPagination((prev) => ({
      ...prev,
      pageIndex: nextPageIndex,
    }));

    if (onDateSearchClick) {
      onDateSearchClick(fromDate, toDate);
    }

    if (onSearchClick) {
      onSearchClick({
        from: fromDate,
        to: toDate,
        pageIndex: nextPageIndex,
        pageSize: pagination.pageSize,
      });
    }
  };

  const handleClearDateFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);

    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));

    onDateSearchClick?.(undefined, undefined);

    if (onSearchClick) {
      onSearchClick({
        from: undefined,
        to: undefined,
        pageIndex: 0,
        pageSize: pagination.pageSize,
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              Table Controls
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Filter records, adjust rows, sort columns, and move between pages.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {enableDateFilter && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date range
                </span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 min-w-36 justify-start rounded-xl border-slate-200 bg-white px-3 text-left text-sm font-normal text-slate-700 shadow-sm"
                    >
                      <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                      {fromDate ? format(fromDate, "yyyy-MM-dd") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => setFromDate(date ?? undefined)}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>

                <span className="hidden text-sm text-slate-400 sm:inline">
                  to
                </span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 min-w-36 justify-start rounded-xl border-slate-200 bg-white px-3 text-left text-sm font-normal text-slate-700 shadow-sm"
                    >
                      <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                      {toDate ? format(toDate, "yyyy-MM-dd") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => setToDate(date ?? undefined)}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>

                {hasDateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearDateFilter}
                    className="h-10 rounded-xl text-slate-500 hover:text-slate-950"
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Rows
                </span>
                <input
                  type="number"
                  min={1}
                  className="h-7 w-16 rounded-md border border-slate-200 px-2 text-sm outline-none transition focus:border-slate-400"
                  value={table.getState().pagination.pageSize}
                  onChange={(event) => handlePageSizeChange(event.target.value)}
                />
              </label>

              {(onSearchClick || onDateSearchClick) && (
                <Button
                  size="sm"
                  onClick={handleSearch}
                  disabled={!onSearchClick && !onDateSearchClick}
                  className="h-10 rounded-xl bg-slate-950 px-4 text-white hover:bg-slate-800"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[62vh] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgb(226,232,240)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-slate-200 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 whitespace-nowrap px-5 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="group flex w-full items-center gap-1.5 text-left transition hover:text-slate-950"
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>

                          {sorted === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-slate-950" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5 text-slate-950" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-50 transition group-hover:opacity-100" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`border-b border-slate-100 transition ${
                    onRowClick
                      ? "cursor-pointer hover:bg-slate-50"
                      : "hover:bg-slate-50/70"
                  }`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap px-5 py-4 align-middle text-sm"
                    >
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
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Search className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-slate-500">
                      Try changing the date range or rows per page.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600">
          Page{" "}
          <span className="font-semibold text-slate-950">
            {pagination.pageIndex + 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-950">
            {resolvedPageCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!resolvedCanPreviousPage}
            className="h-9 rounded-xl border-slate-200"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!resolvedCanNextPage}
            className="h-9 rounded-xl border-slate-200"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}