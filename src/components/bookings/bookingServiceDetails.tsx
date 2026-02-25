/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeServiceName } from "@/lib/normalize";
import { IMainServiceType } from "@/types/booking";

type MainServiceFromFactory = ReturnType<
  typeof import("@/lib/factory").mapServiceDetails
>;

interface BookingServiceDetailsProps {
  mainService: MainServiceFromFactory;
  rawServiceType: IMainServiceType;
  mainServiceId: string;
}

export function BookingServiceDetails({
  mainService,
  rawServiceType,
  mainServiceId,
}: BookingServiceDetailsProps) {
  const details = mainService.details as any;

  const renderByType = () => {
    switch (rawServiceType) {
      case "GENERAL_CLEANING":
        return (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Home type
              </p>
              <p>{details.homeType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Area (sqm)
              </p>
              <p>{details.sqm}</p>
            </div>
          </div>
        );
      case "COUCH":
        return (
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Couch specs
            </p>
            <div className="space-y-2">
              {details.cleaningSpecs?.map((spec: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 p-2 text-xs"
                >
                  <Badge variant="outline" className="text-[11px]">
                    {spec.couchType}
                  </Badge>
                  <p>
                    {spec.widthCm}×{spec.depthCm}×{spec.heightCm} cm
                  </p>
                  <p className="text-muted-foreground">Qty: {spec.quantity}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Bed pillows: {details.bedPillows ?? 0}
            </p>
          </div>
        );
      case "MATTRESS":
        return (
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Mattress specs
            </p>
            <div className="space-y-2">
              {details.cleaningSpecs?.map((spec: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 p-2 text-xs"
                >
                  <Badge variant="outline" className="text-[11px]">
                    {spec.bedType}
                  </Badge>
                  <p>
                    {spec.widthCm}×{spec.depthCm}×{spec.heightCm} cm
                  </p>
                  <p className="text-muted-foreground">Qty: {spec.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "CAR":
        return (
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Car specs
            </p>
            <div className="space-y-2">
              {details.cleaningSpecs?.map((spec: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 p-2 text-xs"
                >
                  <Badge variant="outline" className="text-[11px]">
                    {spec.carType}
                  </Badge>
                  <p className="text-muted-foreground">Qty: {spec.quantity}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Child seats: {details.childSeats ?? 0}
            </p>
          </div>
        );
      case "POST":
        return (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Area (sqm)
              </p>
              <p>{details.sqm}</p>
            </div>
          </div>
        );
      default:
        return (
          <p className="text-xs text-muted-foreground">
            No renderer configured for this service yet.
          </p>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Main service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[11px] uppercase">
            {normalizeServiceName(mainService.serviceType)}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Service ID:{" "}
            <span className="font-mono text-[11px]">{mainServiceId}</span>
          </p>
        </div>
        {renderByType()}
      </CardContent>
    </Card>
  );
}
