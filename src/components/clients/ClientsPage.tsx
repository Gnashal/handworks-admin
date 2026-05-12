"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Search,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";

import { DataTable } from "@/components/dataTable";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";
import { clientColumns } from "@/components/clients/ClientsColumns";
import { useCustomersQuery } from "@/queries/customerQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { ICustomer } from "@/types/account";

const WATCH_LIST_STORAGE_KEY = "watchList";

function loadWatchList(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(WATCH_LIST_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function getSearchableClientText(client: ICustomer) {
  return [
    client.id,
    client.account.id,
    client.account.clerkId,
    client.account.first_name,
    client.account.last_name,
    client.account.email,
    client.account.role,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function ClientsPage() {
  const router = useRouter();

  const [watchList, setWatchList] = React.useState<string[]>(loadWatchList);
  const [showWatchedOnly, setShowWatchedOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        WATCH_LIST_STORAGE_KEY,
        JSON.stringify(watchList),
      );
    } catch {
      // Ignore localStorage write failures.
    }
  }, [watchList]);

  const { data, isLoading, isError } = useCustomersQuery(page, limit);

  const allClients = React.useMemo(() => {
    return data?.customers ?? [];
  }, [data?.customers]);

  const filteredClients = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return allClients.filter((client) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        getSearchableClientText(client).includes(normalizedSearch);

      const matchesWatchFilter =
        !showWatchedOnly || watchList.includes(client.id);

      return matchesSearch && matchesWatchFilter;
    });
  }, [allClients, searchQuery, showWatchedOnly, watchList]);

  const watchedLoadedClients = React.useMemo(() => {
    return allClients.filter((client) => watchList.includes(client.id)).length;
  }, [allClients, watchList]);

  const hasActiveFilters = showWatchedOnly || searchQuery.trim().length > 0;

  const handleClearFilters = () => {
    setSearchQuery("");
    setShowWatchedOnly(false);
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-linear-to-b from-slate-50 via-background to-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-8 w-40 animate-pulse rounded-md bg-slate-200" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-slate-100" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-200" />
                </CardContent>
              </Card>
            ))}
          </div>

          <DataTableSkeleton columnCount={6} rowCount={10} />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-b from-slate-50 via-background to-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Clients
                </h1>
                <Badge variant="outline" className="bg-slate-50">
                  Customer Management
                </Badge>
              </div>

              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                View customer accounts, monitor watched clients, and open each
                client&apos;s booking history.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-2 bg-white"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}

              <Button
                type="button"
                variant={showWatchedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowWatchedOnly((prev) => !prev)}
                className="gap-2"
              >
                <Star
                  className={
                    showWatchedOnly
                      ? "h-4 w-4 fill-amber-300 text-amber-300"
                      : "h-4 w-4"
                  }
                />
                {showWatchedOnly ? "Showing Watched" : "Show Watched Only"}
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/80 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, email, customer ID, account ID..."
                className="h-10 rounded-xl bg-white pl-9"
              />
            </div>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Loaded Clients
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {allClients.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Watched Loaded
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {watchedLoadedClients}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Star className="h-5 w-5 fill-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Visible Records
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {filteredClients.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {isError && (
          <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Failed to load clients.</p>
              <p className="text-red-700/80">
                Check the customer API or try refreshing the page.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Client Directory
            </h2>
            <p className="text-sm text-muted-foreground">
              Click a row to open the customer booking history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showWatchedOnly && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                Watched filter active
              </Badge>
            )}

            {searchQuery.trim().length > 0 && (
              <Badge variant="outline" className="bg-slate-50">
                Search: {searchQuery.trim()}
              </Badge>
            )}
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white/80 shadow-sm">
            <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                No clients found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                No customer records match the current filters. Try clearing the
                search or showing all clients again.
              </p>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-4 bg-white"
                >
                  Reset filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <DataTable<ICustomer, unknown>
            columns={clientColumns(
              watchList,
              setWatchList,
              (customer) => router.push(`/clients/${customer.id}`),
            )}
            data={filteredClients}
            onRowClick={(row) => router.push(`/clients/${row.id}`)}
            onPaginationChange={(pageIndex, pageSize) => {
              setPage(pageIndex);
              setLimit(pageSize);
            }}
          />
        )}
      </div>
    </section>
  );
}