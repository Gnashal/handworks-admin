"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { endOfMonth, startOfMonth } from "date-fns";

import { DataTable } from "@/components/dataTable";
import { Button } from "@/components/ui/button";

import { DataTableSkeleton } from "@/components/dataTableSkeleton";
import { useQuotesQuery } from "@/queries/paymentQueries";
import { IQuote } from "@/types/payment";
import { quoteColumns } from "./columns";

export default function Quotes() {
  const router = useRouter();

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  const [searchParams, setSearchParams] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  React.useEffect(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    setSearchParams({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }, []);

  const { data, isLoading, isError } = useQuotesQuery(
    searchParams.startDate ?? "",
    searchParams.endDate ?? "",
    page,
    limit,
  );

  const quotes: IQuote[] = data?.quotes ?? [];
  const totalBookings = data?.totalQuotes ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalBookings / limit));
  const canNextPage = page + 1 < totalPages;
  const canPreviousPage = page > 0;

  return (
    <div className="block w-full h-screen p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quotes</h2>
        <Button disabled>Create Quote</Button>
      </div>

      {isLoading && (
        <div className="w-full h-screen p-6 space-y-4">
          <DataTableSkeleton columnCount={quoteColumns.length} rowCount={10} />
        </div>
      )}
      {isError && (
        <p className="text-xs text-destructive">Failed to load quotes data.</p>
      )}

      <DataTable<IQuote, unknown>
        columns={quoteColumns}
        data={quotes}
        enableDateFilter
        onPaginationChange={(pageIndex, pageSize) => {
          setPage(pageIndex);
          setLimit(pageSize);
        }}
        onRowClick={(quotes) => router.replace(`/quotes/${quotes.id}`)}
        onDateSearchClick={(from, to) => {
          setSearchParams({
            startDate: from ? from.toISOString() : undefined,
            endDate: to ? to.toISOString() : undefined,
          });
          setPage(0);
        }}
        pageCount={totalPages}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
      />
    </div>
  );
}
