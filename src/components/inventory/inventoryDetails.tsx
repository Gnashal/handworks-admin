/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  ImagePlus,
  Package,
  Pencil,
  Save,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IInventoryItem, ItemCategory, ItemType } from "@/types/inventory";

interface Props {
  open: boolean;
  item: IInventoryItem | null;
  onClose: () => void;
  onSave: (updated: IInventoryItem, imageFile?: File | null) => void;
}

type ComputedStockStatus = "HIGH" | "LOW" | "DANGER" | "OUT_OF_STOCK";

const UNIT_OPTIONS = [
  "Pcs",
  "Units",
  "Bottles",
  "Sets",
  "Packs",
  "Boxes",
  "Liters",
  "Rolls",
  "Pairs",
];

const statusStyles: Record<
  ComputedStockStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
    iconClassName: string;
    progressClassName: string;
    panelClassName: string;
  }
> = {
  HIGH: {
    label: "High Stock",
    description: "Sufficient supply",
    badgeClassName:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    iconClassName: "bg-emerald-100 text-emerald-700",
    progressClassName: "bg-emerald-500",
    panelClassName: "border-emerald-200 bg-emerald-50/60",
  },
  LOW: {
    label: "Low Stock",
    description: "Restock soon",
    badgeClassName:
      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
    iconClassName: "bg-amber-100 text-amber-700",
    progressClassName: "bg-amber-500",
    panelClassName: "border-amber-200 bg-amber-50/60",
  },
  DANGER: {
    label: "Critical",
    description: "Immediate action needed",
    badgeClassName: "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
    iconClassName: "bg-red-100 text-red-700",
    progressClassName: "bg-red-500",
    panelClassName: "border-red-200 bg-red-50/60",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    description: "No available units",
    badgeClassName:
      "border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-100",
    iconClassName: "bg-zinc-100 text-zinc-700",
    progressClassName: "bg-zinc-400",
    panelClassName: "border-zinc-200 bg-zinc-50",
  },
};

const typeStyles: Record<
  IInventoryItem["type"],
  {
    label: string;
    className: string;
  }
> = {
  RESOURCE: {
    label: "Resource",
    className: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  },
  EQUIPMENT: {
    label: "Equipment",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-50",
  },
};

const formatText = (value: string) => {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStockPercentage = (quantity: number, maxQuantity: number) => {
  if (!Number.isFinite(maxQuantity) || maxQuantity <= 0) return 0;

  const percentage = Math.round((quantity / maxQuantity) * 100);

  return Math.min(100, Math.max(0, percentage));
};

const getComputedStockStatus = (
  quantity: number,
  maxQuantity: number,
): ComputedStockStatus => {
  const percentage = getStockPercentage(quantity, maxQuantity);

  if (quantity <= 0) return "OUT_OF_STOCK";
  if (percentage <= 25) return "DANGER";
  if (percentage <= 50) return "LOW";

  return "HIGH";
};

export function InventoryDetailsDialog({ open, item, onClose, onSave }: Props) {
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState<IInventoryItem | null>(item);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm(item);
    setEditMode(false);
    setImageFile(null);
    setPreview(null);
  }, [item]);

  React.useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!form) return null;

  const unitOptions =
    form.unit && !UNIT_OPTIONS.includes(form.unit)
      ? [form.unit, ...UNIT_OPTIONS]
      : UNIT_OPTIONS;

  const stockPercentage = getStockPercentage(form.quantity, form.max_quantity);
  const computedStatus = getComputedStockStatus(
    form.quantity,
    form.max_quantity,
  );
  const status = statusStyles[computedStatus];
  const type = typeStyles[form.type] ?? {
    label: formatText(form.type),
    className: "border-slate-200 bg-slate-50 text-slate-700",
  };
  const imageSource = preview ?? form.image_url;

  const update = <K extends keyof IInventoryItem>(
    key: K,
    value: IInventoryItem[K],
  ) => {
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);

    if (!file) {
      setPreview(null);
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleCancelEdit = () => {
    setForm(item);
    setImageFile(null);
    setPreview(null);
    setEditMode(false);
  };

  const handleSave = () => {
    const updatedItem: IInventoryItem = {
      ...form,
      status: computedStatus as IInventoryItem["status"],
    };

    onSave(updatedItem, imageFile);
    setEditMode(false);
    onClose();
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[calc(100vw-2rem)] !max-w-4xl overflow-hidden rounded-2xl border-slate-200 p-0 shadow-2xl">
        <DialogHeader className="border-b border-slate-200 bg-linear-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
          <div className="flex items-start gap-4 pr-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
              <Package className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {editMode ? "Edit Inventory Item" : "Inventory Details"}
              </DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {editMode
                  ? "Update stock information, classification, and optional item image."
                  : "Review item stock level, category, type, and operational readiness."}
              </p>
            </div>

            <Badge variant="outline" className={type.className}>
              {type.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <section className="space-y-5">
              {editMode ? (
                <>
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.quantity}
                        onChange={(event) =>
                          update("quantity", Number(event.target.value))
                        }
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Quantity</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.max_quantity}
                        onChange={(event) =>
                          update("max_quantity", Number(event.target.value))
                        }
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select
                        value={form.unit}
                        onValueChange={(value) => update("unit", value)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={form.type}
                        onValueChange={(value) =>
                          update("type", value as ItemType)
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RESOURCE">Resource</SelectItem>
                          <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={form.category}
                        onValueChange={(value) =>
                          update("category", value as ItemCategory)
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="ELECTRONICS">
                            Electronics
                          </SelectItem>
                          <SelectItem value="FURNITURE">Furniture</SelectItem>
                          <SelectItem value="APPLIANCES">
                            Appliances
                          </SelectItem>
                          <SelectItem value="VEHICLES">Vehicles</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ImagePlus className="h-4 w-4 text-muted-foreground" />
                      Replace image
                    </div>

                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-3 cursor-pointer bg-white"
                      onChange={(event) =>
                        handleFileChange(event.target.files?.[0] ?? null)
                      }
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      Accepted: image files only.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Item Name
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                      {form.name}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className={type.className}>
                        {type.label}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {formatText(form.category)}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={status.badgeClassName}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Stock Level
                        </p>
                        <p className="mt-1 text-4xl font-bold tracking-tight">
                          {form.quantity}
                          <span className="ml-1 text-lg font-semibold text-muted-foreground">
                            / {form.max_quantity} {form.unit}
                          </span>
                        </p>
                      </div>

                      <Badge variant="outline" className={status.badgeClassName}>
                        {stockPercentage}% available
                      </Badge>
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${status.progressClassName}`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{status.description}</span>
                      <span>
                        {form.quantity} of {form.max_quantity} {form.unit}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className={`rounded-2xl border p-4 ${status.panelClassName}`}>
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${status.iconClassName}`}
                  >
                    {computedStatus === "HIGH" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-950">
                      {status.description}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {computedStatus === "HIGH"
                        ? "This item is currently ready for service operations."
                        : "This item may affect upcoming service operations if not restocked soon."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4 border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                {imageSource ? (
                  <Image
                    src={imageSource}
                    alt={form.name}
                    fill
                    className="object-contain p-4"
                    sizes="300px"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Package className="h-10 w-10" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="font-semibold">Item Summary</h4>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-semibold">
                      {form.quantity} {form.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Max Quantity
                    </p>
                    <p className="font-semibold">
                      {form.max_quantity} {form.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-semibold">{formatText(form.category)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-semibold">{status.label}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Validation
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Name</span>
                    <Badge
                      variant="outline"
                      className={
                        form.name.trim()
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }
                    >
                      {form.name.trim() ? "Complete" : "Missing"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Stock</span>
                    <Badge
                      variant="outline"
                      className={
                        form.max_quantity > 0
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }
                    >
                      {form.max_quantity > 0 ? "Valid" : "Invalid"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Image</span>
                    <Badge variant="outline" className="bg-slate-50">
                      {imageSource ? "Available" : "Optional"}
                    </Badge>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={
                  !form.name.trim() ||
                  !form.unit.trim() ||
                  form.max_quantity <= 0
                }
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>

              <Button
                onClick={() => setEditMode(true)}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
                Edit Item
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}