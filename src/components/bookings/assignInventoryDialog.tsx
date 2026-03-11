"use client";

import * as React from "react";
import Image from "next/image";
import { Package, Wrench, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useInventoryQuery } from "@/queries/inventoryQueries";
import { IInventoryItem, ItemType } from "@/types/inventory";

interface AssignInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: ItemType;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  HIGH: {
    label: "High",
    className:
      "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30",
  },
  LOW: {
    label: "Low",
    className: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  },
  DANGER: {
    label: "Danger",
    className: "bg-red-500/15 text-red-600 border border-red-500/30",
  },
  OUT_OF_STOCK: {
    label: "Out of stock",
    className: "bg-red-500/15 text-red-700 border border-red-500/30",
  },
};

function InventoryItemRow({ item }: { item: IInventoryItem }) {
  const status = statusConfig[item.status] ?? {
    label: item.status,
    className: "bg-muted text-muted-foreground border",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Package className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.className}`}
          >
            {status.label}
          </span>
          <span className="inline-flex items-center rounded-full border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {item.category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {item.quantity} {item.unit} available
        </p>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="h-7 shrink-0 px-2.5 text-xs"
        disabled={!item.is_available}
      >
        Assign
      </Button>
    </div>
  );
}

function ItemList({ type, search }: { type: ItemType; search: string }) {
  const { data, isLoading } = useInventoryQuery(0, 50, type);

  const filtered = React.useMemo(() => {
    if (!data?.items) return [];
    if (!search.trim()) return data.items;
    return data.items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-18 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
        <Package className="mb-2 h-8 w-8 opacity-30" />
        <p className="text-sm font-medium">No items found</p>
        <p className="text-xs">
          {search
            ? "Try a different search term."
            : `No ${type.toLowerCase()} items in inventory.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((item) => (
        <InventoryItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}

export function AssignInventoryDialog({
  open,
  onClose,
  defaultTab = "EQUIPMENT",
}: AssignInventoryDialogProps) {
  const [search, setSearch] = React.useState("");

  // Reset search when dialog opens/closes
  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign inventory to booking</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} key={defaultTab}>
          <TabsList className="w-full">
            <TabsTrigger value="EQUIPMENT" className="flex-1 gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="RESOURCE" className="flex-1 gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Resources
            </TabsTrigger>
          </TabsList>

          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8 text-sm"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <TabsContent
            value="EQUIPMENT"
            className="mt-3 max-h-95 overflow-y-auto pr-0.5"
          >
            <ItemList type="EQUIPMENT" search={search} />
          </TabsContent>

          <TabsContent
            value="RESOURCE"
            className="mt-3 max-h-95 overflow-y-auto pr-0.5"
          >
            <ItemList type="RESOURCE" search={search} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
