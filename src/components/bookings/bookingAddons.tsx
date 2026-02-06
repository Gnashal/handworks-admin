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

interface BookingAddonsProps {
  addons: ITypedAddon<IServiceDetailConcrete>[] | undefined;
}

export function BookingAddons({ addons }: BookingAddonsProps) {
  const hasAddons = addons && addons.length > 0;

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
            No add-ons selected for this booking.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {addons!.map((addon) => (
              <div
                key={addon.id}
                className="flex flex-col rounded-lg border bg-card/60 p-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[11px] uppercase">
                    {addon.serviceType}
                  </Badge>
                  <p className="text-sm font-medium">
                    ₱{addon.price.toLocaleString("en-PH")}
                  </p>
                </div>
                <div className="mt-2">{renderAddonDetails(addon)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
