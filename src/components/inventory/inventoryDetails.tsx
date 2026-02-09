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
import { IInventoryItem } from "@/types/inventory";

interface Props {
  open: boolean;
  item: IInventoryItem | null;
  onClose: () => void;
  onSave: (updated: IInventoryItem, imageFile?: File | null) => void;
}

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

  if (!form) return null;

  const update = (key: keyof IInventoryItem, value: any) =>
    setForm({ ...form, [key]: value });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Inventory Item" : "Inventory Details"}
          </DialogTitle>
        </DialogHeader>

        {/* Image */}
        <div className="flex gap-4 items-start">
          <div className="relative h-32 w-32 shrink-0 rounded border overflow-hidden">
            <Image
              src={preview ?? form.image_url}
              alt={form.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>

          {editMode && (
            <div className="flex-1 space-y-1">
              <Label htmlFor="image">Replace image</Label>
              <Input
                className="cursor-pointer"
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Upload a new image (optional)
              </p>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            {editMode ? (
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            ) : (
              <p className="text-sm">{form.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Quantity</Label>
              {editMode ? (
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => update("quantity", Number(e.target.value))}
                />
              ) : (
                <p className="text-sm">
                  {form.quantity} {form.unit}
                </p>
              )}
            </div>

            <div>
              <Label>Max Quantity</Label>
              {editMode ? (
                <Input
                  type="number"
                  value={form.max_quantity}
                  onChange={(e) =>
                    update("max_quantity", Number(e.target.value))
                  }
                />
              ) : (
                <p className="text-sm">{form.max_quantity}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4">
          {editMode ? (
            <>
              <Button variant="ghost" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSave(form, imageFile);
                  setEditMode(false);
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setEditMode(true)}>Edit Item</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
