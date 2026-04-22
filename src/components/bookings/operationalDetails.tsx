"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Wrench, Package, UserPlus, UserMinus } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { IItemQuantity } from "@/types/booking";
import { ItemType } from "@/types/inventory";
import {
  useAttachEquipmentToBookingMutation,
  useAttachResourcesToBookingMutation,
} from "@/queries/bookingQueries";
import {
  useAssignEmployeeToBookingMutation,
  useAvailableCleanersQuery,
} from "@/queries/employeeQueries";
import { AssignInventoryDialog } from "./assignInventoryDialog";

interface BookingOperationalDetailsProps {
  bookingId: string;
  equipments: {
    id: string;
    name: string;
    type: string;
    photoUrl: string;
    quantityUsed: number;
  }[];
  resources: {
    id: string;
    name: string;
    type: string;
    photoUrl: string;
    quantityUsed: number;
  }[];
  cleaners: {
    id: string;
    cleanerFirstName: string;
    cleanerLastName: string;
    pfpUrl: string;
  }[];
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
}

export function BookingOperationalDetails({
  bookingId,
  equipments,
  resources,
  cleaners,
}: BookingOperationalDetailsProps) {
  const attachEquipmentMutation = useAttachEquipmentToBookingMutation();
  const attachResourcesMutation = useAttachResourcesToBookingMutation();
  const { data: availableCleaners, isLoading: availableCleanersLoading } =
    useAvailableCleanersQuery(bookingId);
  const assignCleanerMutation = useAssignEmployeeToBookingMutation();

  const assignedCleanerIds = new Set(cleaners.map((cleaner) => cleaner.id));
  const availableCleanerList =
    availableCleaners?.cleaners?.filter(
      (cleaner) => !assignedCleanerIds.has(cleaner.employeeId),
    ) ?? [];

  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    type: ItemType;
  }>({ open: false, type: "EQUIPMENT" });

  const closeAssignDialog = () => {
    setAssignDialog((prev) => ({ ...prev, open: false }));
  };

  const handleAssignEquipment = async (items: IItemQuantity[]) => {
    await attachEquipmentMutation.mutateAsync({ bookingId, items });
    closeAssignDialog();
  };

  const handleAssignResources = async (items: IItemQuantity[]) => {
    await attachResourcesMutation.mutateAsync({ bookingId, items });
    closeAssignDialog();
  };

  const handleAddCleaner = async (employeeId: string) => {
    await assignCleanerMutation.mutateAsync({
      bookingId,
      employeeId,
      action: "ADD",
    });
  };

  const handleRemoveCleaner = async (employeeId: string) => {
    await assignCleanerMutation.mutateAsync({
      bookingId,
      employeeId,
      action: "REMOVE",
    });
  };

  return (
    <>
      <AssignInventoryDialog
        open={assignDialog.open}
        onClose={closeAssignDialog}
        defaultTab={assignDialog.type}
        onSubmitEquipment={handleAssignEquipment}
        onSubmitResources={handleAssignResources}
        isSubmittingEquipment={attachEquipmentMutation.isPending}
        isSubmittingResources={attachResourcesMutation.isPending}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Operational details</CardTitle>
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
                    className="flex items-center justify-between gap-2.5 rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2.5">
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

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => handleRemoveCleaner(c.id)}
                      disabled={assignCleanerMutation.isPending}
                    >
                      <UserMinus className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Available cleaners
            </p>
            {availableCleanersLoading ? (
              <p className="text-xs italic text-muted-foreground">
                Loading available cleaners...
              </p>
            ) : !availableCleanerList.length ? (
              <p className="text-xs italic text-muted-foreground">
                No available cleaners found.
              </p>
            ) : (
              <div className="space-y-2">
                {availableCleanerList.map((c) => (
                  <div
                    key={c.employeeId}
                    className="flex items-center justify-between gap-2.5 rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 shrink-0">
                        {c.pfpUrl ? (
                          <AvatarImage
                            src={c.pfpUrl}
                            alt={`${c.firstName} ${c.lastName}`}
                          />
                        ) : null}
                        <AvatarFallback className="text-[11px] font-semibold">
                          {getInitials(c.firstName, c.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">
                        {c.firstName} {c.lastName}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => handleAddCleaner(c.employeeId)}
                      disabled={assignCleanerMutation.isPending}
                    >
                      <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                      Add
                    </Button>
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
                    <div className="flex items-center justify-between w-full px-2">
                      <div>
                        <p className="text-sm font-medium">{eq.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {eq.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{eq.quantityUsed}</p>
                      </div>
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
