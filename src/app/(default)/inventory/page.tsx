/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dataTable";
import { columns } from "@/components/inventory/columns";
import { mockInventory } from "@/data/mockInventory";
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

export default function InventoryPage() {
  const [type, setType] = useState<ItemType | "ALL">("ALL");
  const [status, setStatus] = useState<ItemStatus | "ALL">("ALL");
  const [category, setCategory] = useState<ItemCategory | "ALL">("ALL");

  const filteredData = useMemo(() => {
    return mockInventory.items.filter((item) => {
      if (type !== "ALL" && item.type !== type) return false;
      if (status !== "ALL" && item.status !== status) return false;
      if (category !== "ALL" && item.category !== category) return false;
      return true;
    });
  }, [type, status, category]);

  return (
    <div className="w-full h-screen p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>

      {/* TYPE TABS */}
      <Tabs value={type} onValueChange={(v) => setType(v as any)}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="RESOURCE">Resources</TabsTrigger>
          <TabsTrigger value="EQUIPMENT">Equipment</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* FILTER SELECTORS */}
      <div className="flex flex-wrap gap-4">
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
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

        <Select value={category} onValueChange={(v) => setCategory(v as any)}>
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
      </div>

      {/* TABLE */}
      <DataTable<IInventoryItem, unknown>
        columns={columns}
        data={filteredData}
        onRowClick={(item) => {
          console.log("clicked inventory:", item.id);
        }}
      />
    </div>
  );
}
