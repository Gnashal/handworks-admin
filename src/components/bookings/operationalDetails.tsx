"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Wrench, Package } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ItemType } from "@/types/inventory";
import { BookingMediaDialog } from "./mediaDalogue";
import { AssignInventoryDialog } from "./assignInventoryDialog";

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

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
}

export function BookingOperationalDetails({
  equipments,
  resources,
  cleaners,
  photos,
}: BookingOperationalDetailsProps) {
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    type: ItemType;
  }>({ open: false, type: "EQUIPMENT" });

  return (
    <>
      <AssignInventoryDialog
        open={assignDialog.open}
        onClose={() => setAssignDialog((prev) => ({ ...prev, open: false }))}
        defaultTab={assignDialog.type}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
          <CardTitle className="text-base">Operational details</CardTitle>
          <BookingMediaDialog photos={photos} />
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Cleaners */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Assigned cleaners
            </p>
            {!cleaners?.length ? (
              <p className="text-xs italic text-muted-foreground">
                No cleaners assigned.
              </p>
            ) : (
              <div className="space-y-2">
                {cleaners.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2.5 rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      {c.pfpUrl ? (
                        <AvatarImage
                          src={c.pfpUrl}
                          alt={`${c.cleanerFirstName} ${c.cleanerLastName}`}
                        />
                      ) : null}
                      <AvatarFallback className="text-[11px] font-semibold">
                        {getInitials(c.cleanerFirstName, c.cleanerLastName)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">
                      {c.cleanerFirstName} {c.cleanerLastName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Equipment */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Equipment
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs"
                onClick={() =>
                  setAssignDialog({ open: true, type: "EQUIPMENT" })
                }
              >
                <Plus className="h-3 w-3" />
                Assign
              </Button>
            </div>
            {!equipments?.length ? (
              <p className="text-xs italic text-muted-foreground">
                No equipment assigned.
              </p>
            ) : (
              <div className="space-y-2">
                {equipments.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center gap-2.5 rounded-lg border bg-muted/30 p-2"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {eq.photoUrl ? (
                        <Image
                          src={eq.photoUrl}
                          alt={eq.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Wrench className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{eq.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {eq.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Resources */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Resources
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs"
                onClick={() =>
                  setAssignDialog({ open: true, type: "RESOURCE" })
                }
              >
                <Plus className="h-3 w-3" />
                Assign
              </Button>
            </div>
            {!resources?.length ? (
              <p className="text-xs italic text-muted-foreground">
                No resources assigned.
              </p>
            ) : (
              <div className="space-y-2">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center gap-2.5 rounded-lg border bg-muted/30 p-2"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {res.photoUrl ? (
                        <Image
                          src={res.photoUrl}
                          alt={res.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{res.name}</p>
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
    </>
  );
}
