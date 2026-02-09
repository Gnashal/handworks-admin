/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function AddInventoryDialog({ open, onClose, onCreate }: Props) {
  const [form, setForm] = React.useState({
    name: "",
    quantity: 0,
    max_quantity: 0,
    unit: "",
    image_file: null as File | null,
  });

  const update = (k: string, v: any) => setForm({ ...form, [k]: v });

  const imagePreview = React.useMemo(() => {
    if (!form.image_file) return null;
    return URL.createObjectURL(form.image_file);
  }, [form.image_file]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                value={form.quantity}
                onChange={(e) => update("quantity", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Max Quantity</Label>
              <Input
                type="number"
                value={form.max_quantity}
                onChange={(e) => update("max_quantity", Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Unit</Label>
            <Input
              value={form.unit}
              onChange={(e) => update("unit", e.target.value)}
            />
          </div>

          {/* Image Upload */}
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

            {imagePreview && (
              <div className="relative h-32 w-full overflow-hidden rounded-md border">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onCreate(form);
              onClose();
            }}
          >
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
