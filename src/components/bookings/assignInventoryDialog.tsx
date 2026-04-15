"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Package, Plus, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useInventoryQuery } from "@/queries/inventoryQueries";
import { IItemQuantity } from "@/types/booking";
import { IInventoryItem, ItemType } from "@/types/inventory";

interface AssignInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: ItemType;
  onSubmitEquipment: (items: IItemQuantity[]) => Promise<void>;
  onSubmitResources: (items: IItemQuantity[]) => Promise<void>;
  isSubmittingEquipment?: boolean;
  isSubmittingResources?: boolean;
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

interface InventoryItemRowProps {
  item: IInventoryItem;
  selected?: IItemQuantity;
  isSubmitting: boolean;
  onAdd: (item: IInventoryItem) => void;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

function InventoryItemRow({
  item,
  selected,
  isSubmitting,
  onAdd,
  onRemove,
  onQuantityChange,
}: InventoryItemRowProps) {
  const status = statusConfig[item.status] ?? {
    label: item.status,
    className: "bg-muted text-muted-foreground border",
  };
  const quantity = selected?.quantity ?? 1;
  const isSelected = !!selected;

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

      <div className="flex items-center gap-1.5">
        {isSelected ? (
          <div className="flex items-center gap-1 rounded-md border bg-background px-1 py-0.5">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              disabled={isSubmitting || quantity <= 1}
              onClick={() => onQuantityChange(item.id, quantity - 1)}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="min-w-6 text-center text-xs font-semibold">
              {quantity}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              disabled={isSubmitting || quantity >= item.quantity}
              onClick={() => onQuantityChange(item.id, quantity + 1)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : null}

        {isSelected ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 shrink-0 px-2.5 text-xs"
            onClick={() => onRemove(item.id)}
            disabled={isSubmitting}
          >
            Remove
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-7 shrink-0 px-2.5 text-xs"
            disabled={!item.is_available || item.quantity < 1 || isSubmitting}
            onClick={() => onAdd(item)}
          >
            Assign
          </Button>
        )}
      </div>
    </div>
  );
}

interface ItemListProps {
  type: ItemType;
  search: string;
  selectedItems: IItemQuantity[];
  isSubmitting: boolean;
  onAdd: (item: IInventoryItem) => void;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

function ItemList({
  type,
  search,
  selectedItems,
  isSubmitting,
  onAdd,
  onRemove,
  onQuantityChange,
}: ItemListProps) {
  const { data, isLoading } = useInventoryQuery(0, 50, type);
  const selectedMap = React.useMemo(
    () => new Map(selectedItems.map((item) => [item.itemId, item])),
    [selectedItems],
  );

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
        <InventoryItemRow
          key={item.id}
          item={item}
          selected={selectedMap.get(item.id)}
          isSubmitting={isSubmitting}
          onAdd={onAdd}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
}

export function AssignInventoryDialog({
  open,
  onClose,
  defaultTab = "EQUIPMENT",
  onSubmitEquipment,
  onSubmitResources,
  isSubmittingEquipment = false,
  isSubmittingResources = false,
}: AssignInventoryDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selectedEquipment, setSelectedEquipment] = React.useState<
    IItemQuantity[]
  >([]);
  const [selectedResources, setSelectedResources] = React.useState<
    IItemQuantity[]
  >([]);

  const activeTab = defaultTab;

  const isSubmitting =
    activeTab === "EQUIPMENT" ? isSubmittingEquipment : isSubmittingResources;

  const selectedItems =
    activeTab === "EQUIPMENT" ? selectedEquipment : selectedResources;

  const addSelectedItem = React.useCallback(
    (type: ItemType, item: IInventoryItem) => {
      const quantity = 1;
      const setter =
        type === "EQUIPMENT" ? setSelectedEquipment : setSelectedResources;

      setter((prev) => {
        const existing = prev.find((entry) => entry.itemId === item.id);
        if (existing) {
          return prev.map((entry) =>
            entry.itemId === item.id
              ? {
                  ...entry,
                  quantity: Math.min(entry.quantity + 1, item.quantity),
                }
              : entry,
          );
        }

        return [...prev, { itemId: item.id, quantity }];
      });
    },
    [],
  );

  const removeSelectedItem = React.useCallback(
    (type: ItemType, itemId: string) => {
      const setter =
        type === "EQUIPMENT" ? setSelectedEquipment : setSelectedResources;
      setter((prev) => prev.filter((entry) => entry.itemId !== itemId));
    },
    [],
  );

  const updateSelectedQuantity = React.useCallback(
    (type: ItemType, itemId: string, quantity: number) => {
      const setter =
        type === "EQUIPMENT" ? setSelectedEquipment : setSelectedResources;
      const safeQuantity = Math.max(1, quantity);

      setter((prev) =>
        prev.map((entry) =>
          entry.itemId === itemId
            ? { ...entry, quantity: safeQuantity }
            : entry,
        ),
      );
    },
    [],
  );

  const handleSubmit = React.useCallback(async () => {
    if (!selectedItems.length) return;

    if (activeTab === "EQUIPMENT") {
      await onSubmitEquipment(selectedItems);
      return;
    }

    await onSubmitResources(selectedItems);
  }, [activeTab, onSubmitEquipment, onSubmitResources, selectedItems]);

  // Reset selection and search whenever the dialog is closed.
  React.useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedEquipment([]);
      setSelectedResources([]);
    }
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
          <DialogTitle>
            {activeTab === "EQUIPMENT"
              ? "Assign equipment to booking"
              : "Assign resources to booking"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mt-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8 text-sm"
            placeholder={`Search ${activeTab === "EQUIPMENT" ? "equipment" : "resources"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-3 max-h-95 overflow-y-auto pr-0.5">
          {activeTab === "EQUIPMENT" ? (
            <ItemList
              type="EQUIPMENT"
              search={search}
              selectedItems={selectedEquipment}
              isSubmitting={isSubmittingEquipment}
              onAdd={(item) => addSelectedItem("EQUIPMENT", item)}
              onRemove={(itemId) => removeSelectedItem("EQUIPMENT", itemId)}
              onQuantityChange={(itemId, quantity) =>
                updateSelectedQuantity("EQUIPMENT", itemId, quantity)
              }
            />
          ) : (
            <ItemList
              type="RESOURCE"
              search={search}
              selectedItems={selectedResources}
              isSubmitting={isSubmittingResources}
              onAdd={(item) => addSelectedItem("RESOURCE", item)}
              onRemove={(itemId) => removeSelectedItem("RESOURCE", itemId)}
              onQuantityChange={(itemId, quantity) =>
                updateSelectedQuantity("RESOURCE", itemId, quantity)
              }
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedItems.length || isSubmitting}
          >
            {isSubmitting
              ? "Assigning..."
              : `Assign selected (${selectedItems.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
