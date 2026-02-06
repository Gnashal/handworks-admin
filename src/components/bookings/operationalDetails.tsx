"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { BookingMediaDialog } from "./mediaDalogue";

interface BookingOperationalDetailsProps {
  equipments: {
    id: string;
    name: string;
    type: string;
    photoUrl: string;
  }[];
  resources: {
    id: string;
    name: string;
    type: string;
    photoUrl: string;
  }[];
  cleaners: {
    id: string;
    cleanerFirstName: string;
    cleanerLastName: string;
    pfpUrl: string;
  }[];
  photos: string[];
}

export function BookingOperationalDetails({
  equipments,
  resources,
  cleaners,
  photos,
}: BookingOperationalDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <CardTitle className="text-sm font-medium">
          Operational details
        </CardTitle>
        <BookingMediaDialog photos={photos} />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cleaners */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Assigned cleaners
          </p>
          {cleaners.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No cleaners assigned.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {cleaners.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={c.pfpUrl}
                      alt={`${c.cleanerFirstName} ${c.cleanerLastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium">
                    {c.cleanerFirstName} {c.cleanerLastName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equipment */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Equipment
          </p>
          {equipments.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No equipment assigned.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {equipments.map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center gap-2 rounded-md border bg-muted/40 p-2"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={eq.photoUrl}
                      alt={eq.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">{eq.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {eq.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Resources
          </p>
          {resources.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No resources assigned.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center gap-2 rounded-md border bg-muted/40 p-2"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={res.photoUrl}
                      alt={res.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">{res.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {res.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
