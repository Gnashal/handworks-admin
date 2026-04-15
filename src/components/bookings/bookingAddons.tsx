"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  IGeneralCleaningDetails,
  ICouchCleaningDetails,
  IMattressCleaningDetails,
  ICarCleaningDetails,
  IPostConstructionDetails,
} from "@/types/booking";

import { ITypedAddon, IServiceDetailConcrete } from "@/lib/factory";
import { normalizeServiceName } from "@/lib/normalize";

interface BookingAddonsProps {
  addons: ITypedAddon<IServiceDetailConcrete>[] | undefined;

  // NEW (optional for create page)
  selectable?: boolean;
  selectedAddons?: ITypedAddon<IServiceDetailConcrete>[];
  onChange?: (addons: ITypedAddon<IServiceDetailConcrete>[]) => void;
}

export function BookingAddons({
  addons,
  selectable = false,
  selectedAddons = [],
  onChange,
}: BookingAddonsProps) {
  const hasAddons = addons && addons.length > 0;

  const normalizeLabel = (value: string | undefined) => {
    if (!value) {
      return "Unspecified";
    }

    return value
      .replace(/[_-]+/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  const formatDimension = (value: number | undefined) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "0";
    }

    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };

  const renderSpecGrid = (
    specs: Array<{
      typeLabel: string;
      quantity?: number;
      dimensions?: {
        widthCm?: number;
        depthCm?: number;
        heightCm?: number;
      };
    }>,
  ) => {
    if (!specs.length) {
      return (
        <p className="text-xs italic text-muted-foreground">
          No item specs captured.
        </p>
      );
    }

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {specs.map((spec, idx) => (
          <div
            key={`${spec.typeLabel}-${idx}`}
            className="space-y-2 rounded-md border bg-muted/25 p-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="text-[11px]">
                {normalizeLabel(spec.typeLabel)}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Qty: {spec.quantity ?? 0}
              </p>
            </div>
            {spec.dimensions ? (
              <p className="text-xs text-muted-foreground">
                {formatDimension(spec.dimensions.widthCm)} x{" "}
                {formatDimension(spec.dimensions.depthCm)} x{" "}
                {formatDimension(spec.dimensions.heightCm)} cm
              </p>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  const isSelected = (addon: ITypedAddon<IServiceDetailConcrete>) =>
    selectedAddons.some((a) => a.id === addon.id);

  const toggleAddon = (addon: ITypedAddon<IServiceDetailConcrete>) => {
    if (!onChange) return;

    const exists = isSelected(addon);

    if (exists) {
      onChange(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      onChange([...selectedAddons, addon]);
    }
  };

  const renderAddonDetails = (addon: ITypedAddon<IServiceDetailConcrete>) => {
    switch (addon.serviceType) {
      case "GENERAL_CLEANING": {
        const d = addon.details as IGeneralCleaningDetails;
        return (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-md border bg-muted/25 p-2.5">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                Home type
              </p>
              <p className="mt-1 text-xs font-medium">
                {normalizeLabel(d.homeType)}
              </p>
            </div>
            <div className="rounded-md border bg-muted/25 p-2.5">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                Area
              </p>
              <p className="mt-1 text-xs font-medium">{d.sqm ?? 0} sqm</p>
            </div>
          </div>
        );
      }
      case "COUCH": {
        const d = addon.details as ICouchCleaningDetails;
        const specs =
          d.cleaningSpecs?.map((spec) => ({
            typeLabel: spec.couchType,
            quantity: spec.quantity,
            dimensions: {
              widthCm: spec.widthCm,
              depthCm: spec.depthCm,
              heightCm: spec.heightCm,
            },
          })) ?? [];

        return (
          <div className="space-y-2.5">
            {renderSpecGrid(specs)}
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Bed pillows: {d.bedPillows ?? 0}
            </p>
          </div>
        );
      }
      case "MATTRESS": {
        const d = addon.details as IMattressCleaningDetails;
        const specs =
          d.cleaningSpecs?.map((spec) => ({
            typeLabel: spec.bedType,
            quantity: spec.quantity,
            dimensions: {
              widthCm: spec.widthCm,
              depthCm: spec.depthCm,
              heightCm: spec.heightCm,
            },
          })) ?? [];
        return <div className="space-y-2.5">{renderSpecGrid(specs)}</div>;
      }
      case "CAR": {
        const d = addon.details as ICarCleaningDetails;
        const specs =
          d.cleaningSpecs?.map((spec) => ({
            typeLabel: spec.carType,
            quantity: spec.quantity,
          })) ?? [];

        return (
          <div className="space-y-2.5">
            {renderSpecGrid(specs)}
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Child seats: {d.childSeats ?? 0}
            </p>
          </div>
        );
      }
      case "POST": {
        const d = addon.details as IPostConstructionDetails;
        return (
          <div className="rounded-md border bg-muted/25 p-2.5 text-sm">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              Area
            </p>
            <p className="mt-1 text-xs font-medium">{d.sqm ?? 0} sqm</p>
          </div>
        );
      }
      default:
        return (
          <p className="text-xs text-muted-foreground">
            No renderer configured for this add-on yet.
          </p>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Add-ons</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {!hasAddons ? (
          <p className="text-xs italic text-muted-foreground">
            No add-ons available.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {addons!.map((addon) => {
              const checked = isSelected(addon);

              return (
                <div
                  key={addon.id}
                  className={`flex flex-col rounded-lg border p-3 shadow-sm transition ${
                    selectable && checked
                      ? "border-primary bg-primary/5"
                      : "bg-card/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {selectable && (
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddon(addon)}
                          className="h-4 w-4"
                        />
                      )}

                      <Badge
                        variant="outline"
                        className="text-[11px] uppercase"
                      >
                        {normalizeServiceName(addon.serviceType)}
                      </Badge>
                    </div>

                    <p className="text-sm font-medium">
                      ₱{addon.price.toLocaleString("en-PH")}
                    </p>
                  </div>

                  <div className="mt-2">{renderAddonDetails(addon)}</div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
