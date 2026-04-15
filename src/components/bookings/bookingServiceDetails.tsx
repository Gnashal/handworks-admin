"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IServiceDetailConcrete, ITypedAddon } from "@/lib/factory";
import { normalizeServiceName } from "@/lib/normalize";
import {
  ICarCleaningDetails,
  ICouchCleaningDetails,
  IGeneralCleaningDetails,
  IMainServiceType,
  IMattressCleaningDetails,
  IPostConstructionDetails,
} from "@/types/booking";

type MainServiceFromFactory = ReturnType<
  typeof import("@/lib/factory").mapServiceDetails
>;

interface BookingServiceDetailsProps {
  mainService: MainServiceFromFactory;
  rawServiceType: IMainServiceType;
  addons?: ITypedAddon<IServiceDetailConcrete>[];
  extraHours: number;
  extraHourCost: number;
  formattedExtraHourCost: string;
}

export function BookingServiceDetails({
  mainService,
  rawServiceType,
  addons,
  extraHours,
  extraHourCost,
  formattedExtraHourCost,
}: BookingServiceDetailsProps) {
  const formatDimension = (value: number | undefined) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "0";
    }

    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };

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

  const renderSpecs = (
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
            className="space-y-2 rounded-lg border bg-muted/30 p-3"
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

  const renderByType = () => {
    switch (rawServiceType) {
      case "GENERAL_CLEANING": {
        const details = mainService.details as IGeneralCleaningDetails;
        return (
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Home Type
              </p>
              <p className="mt-1 font-medium">
                {normalizeLabel(details.homeType)}
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Area
              </p>
              <p className="mt-1 font-medium">{details.sqm ?? 0} sqm</p>
            </div>
          </div>
        );
      }
      case "COUCH": {
        const details = mainService.details as ICouchCleaningDetails;
        const specs =
          details.cleaningSpecs?.map((spec) => ({
            typeLabel: spec.couchType,
            quantity: spec.quantity,
            dimensions: {
              widthCm: spec.widthCm,
              depthCm: spec.depthCm,
              heightCm: spec.heightCm,
            },
          })) ?? [];

        return (
          <div className="space-y-3 text-sm">
            {renderSpecs(specs)}
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Bed pillows: {details.bedPillows ?? 0}
            </p>
          </div>
        );
      }
      case "MATTRESS": {
        const details = mainService.details as IMattressCleaningDetails;
        const specs =
          details.cleaningSpecs?.map((spec) => ({
            typeLabel: spec.bedType,
            quantity: spec.quantity,
            dimensions: {
              widthCm: spec.widthCm,
              depthCm: spec.depthCm,
              heightCm: spec.heightCm,
            },
          })) ?? [];

        return <div className="space-y-3 text-sm">{renderSpecs(specs)}</div>;
      }
      case "CAR": {
        const details = mainService.details as ICarCleaningDetails;
        const specs =
          details.cleaningSpecs?.map((spec) => ({
            typeLabel: spec.carType,
            quantity: spec.quantity,
          })) ?? [];

        return (
          <div className="space-y-3 text-sm">
            {renderSpecs(specs)}
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Child seats: {details.childSeats ?? 0}
            </p>
          </div>
        );
      }
      case "POST": {
        const details = mainService.details as IPostConstructionDetails;

        return (
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Area
              </p>
              <p className="mt-1 font-medium">{details.sqm ?? 0} sqm</p>
            </div>
          </div>
        );
      }
      default:
        return (
          <p className="text-xs text-muted-foreground">
            No renderer configured for this service yet.
          </p>
        );
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
            {renderSpecs(specs)}
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

        return <div className="space-y-2.5">{renderSpecs(specs)}</div>;
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
            {renderSpecs(specs)}
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Service specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-xl border bg-muted/25 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Service
              </p>
              <p className="mt-1 text-xl font-bold sm:text-2xl">
                {normalizeServiceName(rawServiceType)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {addons?.length ?? 0} add-on
                {(addons?.length ?? 0) === 1 ? "" : "s"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Extra Hours
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {extraHours}
                <span className="ml-1 text-lg font-semibold text-muted-foreground">
                  h
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {extraHourCost > 0
                  ? `${formattedExtraHourCost} extra`
                  : "No extra cost"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Main service specs
          </p>
          {renderByType()}
        </div>

        <div className="pt-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Add-ons
          </p>
          {!addons?.length ? (
            <p className="text-xs italic text-muted-foreground">
              No add-ons available.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex flex-col rounded-lg border bg-card/50 p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[11px] uppercase">
                      {normalizeServiceName(addon.serviceType)}
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
        </div>
      </CardContent>
    </Card>
  );
}
