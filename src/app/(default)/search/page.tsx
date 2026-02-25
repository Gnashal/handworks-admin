"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type SearchType =
  | "quoteId"
  | "bookingId"
  | "customerId"
  | "employeeId"
  | "inventoryId";

const SEARCH_OPTIONS: { label: string; value: SearchType }[] = [
  { label: "Quote ID", value: "quoteId" },
  { label: "Booking ID", value: "bookingId" },
  { label: "Customer ID", value: "customerId" },
  { label: "Employee ID", value: "employeeId" },
  { label: "Inventory ID", value: "inventoryId" },
];

export default function Search() {
  const [searchType, setSearchType] = React.useState<SearchType>("bookingId");
  const [query, setQuery] = React.useState("");
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = () => {
    // wire this up later
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/40 to-background p-4">
      {/* Simple header bar */}
      <header className="mb-4 flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
          <div className="w-full md:w-56">
            <Select
              value={searchType}
              onValueChange={(v) => setSearchType(v as SearchType)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Search by</SelectLabel>
                  {SEARCH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full gap-2 md:max-w-md">
            <Input
              className="bg-white"
              placeholder="Enter ID value…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={!query.trim()}>
              Search
            </Button>
          </div>
        </div>
      </header>

      {/* Results area: empty until you wire it up */}
      <section className="space-y-2">
        {hasSearched && (
          <p className="text-sm text-muted-foreground">
            Results for{" "}
            <span className="font-semibold">
              {SEARCH_OPTIONS.find((o) => o.value === searchType)?.label}
            </span>{" "}
            matching{" "}
            <span className="font-mono text-xs text-foreground">{query}</span>.
          </p>
        )}

        {/* Future: render tables/cards/lists here when you have real results */}
      </section>
    </div>
  );
}
