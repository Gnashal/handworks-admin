/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { DataTable } from "@/components/dataTable";
import { columns } from "./columns";
import {
  ItemCategory,
  ItemStatus,
  ItemType,
  IInventoryItem,
} from "@/types/inventory";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { InventoryDetailsDialog } from "@/components/inventory/inventoryDetails";
import { AddInventoryDialog } from "@/components/inventory/addItem";
import { useInventoryQuery } from "@/queries/inventoryQueries";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";

export default function InventoryPage() {
  const [type, setType] = useState<ItemType | "ALL">("ALL");
  const [status, setStatus] = useState<ItemStatus | "ALL">("ALL");
  const [category, setCategory] = useState<ItemCategory | "ALL">("ALL");

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [selectedItem, setSelectedItem] = useState<IInventoryItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const typeFilter = type === "ALL" ? undefined : type;
  const statusFilter = status === "ALL" ? undefined : status;
  const categoryFilter = category === "ALL" ? undefined : category;

  const { data, isLoading, isError } = useInventoryQuery(
    page,
    limit,
    typeFilter,
    statusFilter,
    categoryFilter,
  );

  const items: IInventoryItem[] = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const canNextPage = page + 1 < totalPages;
  const canPreviousPage = page > 0;

  return (
    <div className="w-full h-screen p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>

      {/* TYPE TABS */}
      <Tabs
        value={type}
        onValueChange={(v) => {
          setType(v as any);
          setPage(0);
        }}
      >
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="RESOURCE">Resources</TabsTrigger>
          <TabsTrigger value="EQUIPMENT">Equipment</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* FILTER SELECTORS */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as any);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="DANGER">Danger</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v as any);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="GENERAL">General</SelectItem>
            <SelectItem value="ELECTRONICS">Electronics</SelectItem>
            <SelectItem value="FURNITURE">Furniture</SelectItem>
            <SelectItem value="APPLIANCES">Appliances</SelectItem>
            <SelectItem value="VEHICLES">Vehicles</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          className="bg-white border rounded-md"
          onClick={() => setAddOpen(true)}
        >
          Add Item
        </Button>
      </div>

      {isLoading && (
        <div className="w-full h-screen p-6 space-y-4">
          <DataTableSkeleton columnCount={columns.length} rowCount={10} />
        </div>
      )}
      {isError && (
        <p className="text-xs text-destructive">
          Failed to load inventory items.
        </p>
      )}

      {/* TABLE */}
      <DataTable<IInventoryItem, unknown>
        columns={columns}
        data={items}
        onRowClick={setSelectedItem}
        onPaginationChange={(pageIndex, pageSize) => {
          setPage(pageIndex);
          setLimit(pageSize);
        }}
        pageCount={totalPages}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
      />

      <InventoryDetailsDialog
        open={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSave={(updated) => console.log("save", updated)}
      />

      <AddInventoryDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(data) => console.log("create", data)}
      />
    </div>
  );
}
