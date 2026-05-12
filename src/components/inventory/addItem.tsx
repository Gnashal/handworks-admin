"use client";

import * as React from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  PackagePlus,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

type FieldErrors = Partial<Record<keyof IAddInventoryFormData, string>>;

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

const CATEGORY_OPTIONS: Array<{
  value: ItemCategory;
  label: string;
  description: string;
}> = [
  {
    value: "GENERAL",
    label: "General",
    description: "Cleaning solutions, detergents, rugs, and basic supplies",
  },
  {
    value: "ELECTRONICS",
    label: "Electronics",
    description: "Electronic equipment and powered cleaning tools",
  },
  {
    value: "FURNITURE",
    label: "Furniture",
    description: "Furniture-related equipment or cleaning items",
  },
  {
    value: "APPLIANCES",
    label: "Appliances",
    description: "Machines, appliances, and larger cleaning devices",
  },
  {
    value: "VEHICLES",
    label: "Vehicles",
    description: "Vehicle-related cleaning supplies and tools",
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Items that do not fit the existing categories",
  },
];

const TYPE_OPTIONS: Array<{
  value: ItemType;
  label: string;
  description: string;
}> = [
  {
    value: "RESOURCE",
    label: "Resource",
    description: "Consumable stock used during cleaning operations",
  },
  {
    value: "EQUIPMENT",
    label: "Equipment",
    description: "Reusable tools, machines, or operational assets",
  },
];

const CATEGORY_DEFAULT_UNIT: Record<ItemCategory, string> = {
  GENERAL: "Bottles",
  ELECTRONICS: "Pcs",
  FURNITURE: "Units",
  APPLIANCES: "Units",
  VEHICLES: "Sets",
  OTHER: "Pcs",
};

const initialFormState: IAddInventoryFormData = {
  name: "",
  quantity: 0,
  unit: "Bottles",
  type: "RESOURCE",
  category: "GENERAL",
  image_file: null,
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;

  const megabytes = kilobytes / 1024;
  return `${megabytes.toFixed(1)} MB`;
};

const getRecommendedUnit = (type: ItemType, category: ItemCategory) => {
  if (type === "EQUIPMENT") return "Units";

  return CATEGORY_DEFAULT_UNIT[category];
};

const detectUnitFromName = (name: string) => {
  const normalizedName = name.toLowerCase();

  if (
    normalizedName.includes("soap") ||
    normalizedName.includes("liquid") ||
    normalizedName.includes("solution") ||
    normalizedName.includes("detergent") ||
    normalizedName.includes("disinfectant") ||
    normalizedName.includes("descaler") ||
    normalizedName.includes("fragrance") ||
    normalizedName.includes("wax")
  ) {
    return "Bottles";
  }

  if (
    normalizedName.includes("cloth") ||
    normalizedName.includes("rug") ||
    normalizedName.includes("brush") ||
    normalizedName.includes("scraper") ||
    normalizedName.includes("scrapper") ||
    normalizedName.includes("pillow")
  ) {
    return "Pcs";
  }

  if (
    normalizedName.includes("vacuum") ||
    normalizedName.includes("machine") ||
    normalizedName.includes("cabinet") ||
    normalizedName.includes("shelf") ||
    normalizedName.includes("ladder") ||
    normalizedName.includes("mop") ||
    normalizedName.includes("steamer")
  ) {
    return "Units";
  }

  if (
    normalizedName.includes("set") ||
    normalizedName.includes("kit") ||
    normalizedName.includes("tire")
  ) {
    return "Sets";
  }

  return null;
};

const validateForm = (form: IAddInventoryFormData): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.name.trim()) {
    errors.name = "Item name is required.";
  }

  if (!Number.isFinite(form.quantity) || form.quantity < 0) {
    errors.quantity = "Quantity must be 0 or higher.";
  }

  if (!form.unit.trim()) {
    errors.unit = "Unit is required.";
  }

  if (form.image_file) {
    const isImage = form.image_file.type.startsWith("image/");
    const maxSize = 5 * 1024 * 1024;

    if (!isImage) {
      errors.image_file = "Only image files are allowed.";
    }

    if (form.image_file.size > maxSize) {
      errors.image_file = "Image must be 5 MB or smaller.";
    }
  }

  return errors;
};

const getCategoryDescription = (category: ItemCategory) => {
  return (
    CATEGORY_OPTIONS.find((option) => option.value === category)?.description ??
    "Inventory category"
  );
};

const getTypeDescription = (type: ItemType) => {
  return (
    TYPE_OPTIONS.find((option) => option.value === type)?.description ??
    "Inventory type"
  );
};

export function AddInventoryDialog({
  open,
  onClose,
  onCreate,
  submitting,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [form, setForm] =
    React.useState<IAddInventoryFormData>(initialFormState);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [unitTouched, setUnitTouched] = React.useState(false);

  const recommendedUnit = getRecommendedUnit(form.type, form.category);
  const formErrors = validateForm(form);
  const canSubmit = Object.keys(formErrors).length === 0;

  const resetForm = () => {
    setForm(initialFormState);
    setPreviewUrl(null);
    setErrors({});
    setUnitTouched(false);
  };

  const update = <K extends keyof IAddInventoryFormData>(
    key: K,
    value: IAddInventoryFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleNameChange = (value: string) => {
    const detectedUnit = detectUnitFromName(value);

    setForm((prev) => ({
      ...prev,
      name: value,
      unit: !unitTouched && detectedUnit ? detectedUnit : prev.unit,
    }));

    setErrors((prev) => ({ ...prev, name: undefined, unit: undefined }));
  };

  const handleQuantityChange = (value: string) => {
    const parsedValue = Number(value);

    update("quantity", Number.isFinite(parsedValue) ? parsedValue : 0);
  };

  const handleTypeChange = (value: ItemType) => {
    setForm((prev) => ({
      ...prev,
      type: value,
      unit: unitTouched ? prev.unit : getRecommendedUnit(value, prev.category),
    }));
  };

  const handleCategoryChange = (value: ItemCategory) => {
    setForm((prev) => ({
      ...prev,
      category: value,
      unit: unitTouched ? prev.unit : getRecommendedUnit(prev.type, value),
    }));
  };

  const handleUnitChange = (value: string) => {
    setUnitTouched(true);
    update("unit", value);
  };

  const handleImageChange = (file: File | null) => {
    update("image_file", file);
  };

  const handleRemoveImage = () => {
    update("image_file", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || submitting) return;

    await onCreate({
      ...form,
      name: form.name.trim(),
      unit: form.unit.trim(),
    });

    resetForm();
    onClose();
  };

  const handleDialogStateChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleClose();
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
      <DialogContent className="w-[1180px] max-w-[95vw] sm:max-w-[95vw] overflow-hidden p-0">
        <DialogHeader className="border-b bg-muted/30 px-7 py-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PackagePlus className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-xl">Add Inventory Item</DialogTitle>
              <DialogDescription className="max-w-3xl">
                Register resources and equipment with standardized stock units,
                proper classification, and optional item image preview.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4 px-7 py-5">
            <div className="grid grid-cols-[minmax(0,1.5fr)_180px_180px] gap-5">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="inventory-name">Item Name</Label>
                <Input
                  id="inventory-name"
                  value={form.name}
                  placeholder="Example: Multipurpose Cleaning Solution"
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={submitting}
                />
                {errors.name ? (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.name}
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    Unit can auto-fill based on item names.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventory-quantity">Initial Quantity</Label>
                <Input
                  id="inventory-quantity"
                  type="number"
                  min={0}
                  value={form.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  disabled={submitting}
                />
                {errors.quantity ? (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.quantity}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Starting stock count.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={form.unit}
                  onValueChange={handleUnitChange}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_OPTIONS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.unit ? (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.unit}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Suggested:{" "}
                    <span className="font-medium">{recommendedUnit}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={handleTypeChange}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {getTypeDescription(form.type)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={handleCategoryChange}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {getCategoryDescription(form.category)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/25 p-4">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Item Summary</p>
                  <p className="text-xs text-muted-foreground">
                    Quick review before adding the item.
                  </p>
                </div>

                <Badge variant="outline" className="bg-background">
                  {form.type === "RESOURCE" ? "Resource" : "Equipment"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Quantity
                  </p>
                  <p className="font-semibold">
                    {form.quantity} {form.unit || "unit"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Category
                  </p>
                  <p className="font-semibold">
                    {
                      CATEGORY_OPTIONS.find(
                        (option) => option.value === form.category,
                      )?.label
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Validation
                  </p>
                  {canSubmit ? (
                    <p className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Ready
                    </p>
                  ) : (
                    <p className="flex items-center gap-1.5 font-semibold text-amber-700">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Incomplete
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-l bg-muted/20 px-7 py-5">
            <div className="space-y-3">
              <Label>Item Image</Label>

              <div className="rounded-xl border border-dashed bg-background p-4">
                {previewUrl ? (
                  <div className="relative h-44 w-full overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={previewUrl}
                      alt="Inventory item preview"
                      fill
                      className="object-cover"
                      sizes="340px"
                    />

                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/90"
                      onClick={handleRemoveImage}
                      disabled={submitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="flex h-44 w-full flex-col items-center justify-center rounded-lg border bg-muted/20 px-6 text-center transition hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ImagePlus className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-semibold">Upload item image</p>
                    <p className="mt-2 max-w-56 text-xs leading-relaxed text-muted-foreground">
                      Use a clear product or equipment photo.
                    </p>
                  </button>
                )}

                <Input
                  ref={fileInputRef}
                  className="mt-4 cursor-pointer bg-background"
                  type="file"
                  accept="image/*"
                  disabled={submitting}
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0] ?? null)
                  }
                />

                {form.image_file ? (
                  <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {form.image_file.name}
                        </p>
                        <p className="text-muted-foreground">
                          {formatFileSize(form.image_file.size)}
                        </p>
                      </div>

                      <UploadCloud className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </div>
                ) : null}

                {errors.image_file ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.image_file}
                  </p>
                ) : (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Accepted: image files only, up to 5 MB.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t bg-background px-7 py-4">
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? "Adding Item..." : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}