"use client";

import * as React from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ItemCategory, ItemType } from "@/types/inventory";

export interface IAddInventoryFormData {
  name: string;
  quantity: number;
  unit: string;
  type: ItemType;
  category: ItemCategory;
  image_file: File | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: IAddInventoryFormData) => Promise<void>;
  submitting?: boolean;
}

const initialFormState: IAddInventoryFormData = {
  name: "",
  quantity: 0,
  unit: "",
  type: "RESOURCE",
  category: "GENERAL",
  image_file: null,
};

export function AddInventoryDialog({
  open,
  onClose,
  onCreate,
  submitting,
}: Props) {
  const [form, setForm] =
    React.useState<IAddInventoryFormData>(initialFormState);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const update = <K extends keyof IAddInventoryFormData>(
    key: K,
    value: IAddInventoryFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const canSubmit =
    form.name.trim().length > 0 &&
    form.unit.trim().length > 0 &&
    Number.isFinite(form.quantity) &&
    form.quantity >= 0;

  const resetForm = () => {
    setForm(initialFormState);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    await onCreate(form);
    resetForm();
    onClose();
  };

  const handleDialogStateChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
      onClose();
    }
  };

  React.useEffect(() => {
    if (!form.image_file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(form.image_file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [form.image_file]);

  return (
    <Dialog open={open} onOpenChange={handleDialogStateChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => update("quantity", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Unit</Label>
              <Input
                value={form.unit}
                onChange={(e) => update("unit", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) => update("type", value as ItemType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESOURCE">Resource</SelectItem>
                  <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  update("category", value as ItemCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="ELECTRONICS">Electronics</SelectItem>
                  <SelectItem value="FURNITURE">Furniture</SelectItem>
                  <SelectItem value="APPLIANCES">Appliances</SelectItem>
                  <SelectItem value="VEHICLES">Vehicles</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <Input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              onChange={(e) =>
                update("image_file", e.target.files?.[0] ?? null)
              }
            />

            {previewUrl && (
              <div className="relative h-32 w-full overflow-hidden rounded-md border">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? "Adding..." : "Add Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
