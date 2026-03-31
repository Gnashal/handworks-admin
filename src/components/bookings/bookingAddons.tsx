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
          <p className="text-xs text-muted-foreground">
            {d.homeType} · {d.sqm} sqm
          </p>
        );
      }
      case "COUCH": {
        const d = addon.details as ICouchCleaningDetails;
        const count = d.cleaningSpecs.reduce(
          (sum, spec) => sum + spec.quantity,
          0,
        );
        return (
          <p className="text-xs text-muted-foreground">
            {count} couch{count > 1 ? "es" : ""} · pillows {d.bedPillows}
          </p>
        );
      }
      case "MATTRESS": {
        const d = addon.details as IMattressCleaningDetails;
        const count = d.cleaningSpecs.reduce(
          (sum, spec) => sum + spec.quantity,
          0,
        );
        return (
          <p className="text-xs text-muted-foreground">
            {count} mattress{count > 1 ? "es" : ""}
          </p>
        );
      }
      case "CAR": {
        const d = addon.details as ICarCleaningDetails;
        const count = d.cleaningSpecs.reduce(
          (sum, spec) => sum + spec.quantity,
          0,
        );
        return (
          <p className="text-xs text-muted-foreground">
            {count} car{count > 1 ? "s" : ""} · child seats {d.childSeats}
          </p>
        );
      }
      case "POST": {
        const d = addon.details as IPostConstructionDetails;
        return (
          <p className="text-xs text-muted-foreground">
            Post-construction · {d.sqm} sqm
          </p>
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
                      : "bg-card/60"
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