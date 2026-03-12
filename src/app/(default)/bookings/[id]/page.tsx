/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  Clock,
  ShieldCheck,
  User2Icon,
  PinIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { mapAddonDetails, mapServiceDetails } from "@/lib/factory";
import { IBooking, IMainServiceType } from "@/types/booking";
import { normalizeServiceName } from "@/lib/normalize";

import { BookingServiceDetails } from "@/components/bookings/bookingServiceDetails";
import { BookingAddons } from "@/components/bookings/bookingAddons";
import { BookingOperationalDetails } from "@/components/bookings/operationalDetails";
import { useBookingDetailsQuery } from "@/queries/bookingQueries";
import Loader from "@/components/loader";
import useBooking from "@/hooks/bookingHook";

interface BookingDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const bookingStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    className: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  },
  ONGOING: {
    label: "Ongoing",
    className:
      "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-blue-500/15 text-blue-600 border border-blue-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/15 text-red-600 border border-red-500/30",
  },
};

const reviewStatusConfig: Record<string, { label: string; className: string }> =
  {
    PENDING: {
      label: "Review Pending",
      className: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
    },
    COMPLETED: {
      label: "Reviewed",
      className: "bg-green-500/15 text-green-600 border border-green-500/30",
    },
  };

function StatusPill({ status }: { status: string }) {
  const c = bookingStatusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.className}`}
    >
      {c.label}
    </span>
  );
}

function ReviewPill({ status }: { status: string }) {
  const c = reviewStatusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export default function BookingDetailsPage(props: BookingDetailsPageProps) {
  const { id } = use(props.params);
  const { data, isLoading, error } = useBookingDetailsQuery(id);
  const { loading: approveLoading, handleApproveBooking } = useBooking();
  const [localReviewStatus, setLocalReviewStatus] = useState<string | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    notFound();
  }

  const booking: IBooking = data;

  const mainService = mapServiceDetails(
    booking.mainService.serviceType as IMainServiceType,
    booking.mainService,
  );

  const addons = booking.addons?.map((addon) => mapAddonDetails(addon));
  const hasAddons = !!addons?.length;
  const addonTotal = addons?.reduce((sum, a) => sum + (a.price ?? 0), 0) ?? 0;
  const effectiveReviewStatus = localReviewStatus ?? booking.base.reviewStatus;

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/40 to-background">
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-8 space-y-6">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        {/* Booking header card */}
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-3xl font-bold">
                    Booking{" "}
                    <span className="font-mono text-muted-foreground">
                      #{booking.id}
                    </span>
                  </CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={booking.base.status} />
                  <ReviewPill status={effectiveReviewStatus} />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 pt-1">
                  <div className="flex flex-row items-center gap-3">
                    <User2Icon />
                    <div className="flex flex-col">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Customer
                      </p>
                      <p className="text-xl font-semibold">
                        {booking.base.customerFirstName}{" "}
                        {booking.base.customerLastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <PinIcon />
                    <div className="flex flex-col">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Address
                      </p>
                      <p className="text-xl font-medium leading-snug">
                        {booking.base.address.addressHuman}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Button variant="outline">Edit booking</Button>
                {effectiveReviewStatus === "PENDING" ? (
                  <Button
                    disabled={approveLoading}
                    onClick={async () => {
                      const res = await handleApproveBooking(booking.id);
                      if (res?.status) {
                        setLocalReviewStatus(res.status);
                      }
                    }}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <ShieldCheck className="mr-1.5 h-4 w-4" />
                    Approve booking
                  </Button>
                ) : (
                  <Button variant="destructive">Cancel booking</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid gap-6 grid-cols-2">
          <Card>
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Total Price
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                ₱{booking.totalPrice.toLocaleString("en-PH")}
              </p>
              {hasAddons && (
                <p className="mt-1 text-sm text-muted-foreground">
                  incl. ₱{addonTotal.toLocaleString("en-PH")} in add-ons
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Dirty Scale
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {booking.base.dirtyScale}
                <span className="text-2xl font-semibold text-muted-foreground">
                  /5
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Customer-reported
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Service
              </p>
              <p className="mt-2 text-2xl font-bold">
                {normalizeServiceName(
                  booking.mainService.serviceType as IMainServiceType,
                )}
              </p>
              {hasAddons ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  +{addons!.length} add-on{addons!.length > 1 ? "s" : ""}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">No add-ons</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Extra Hours
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {booking.base.extraHours}
                <span className="text-2xl font-semibold text-muted-foreground">
                  {" "}
                  h
                </span>
              </p>
              {booking.base.extraHourCost > 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  ₱{booking.base.extraHourCost.toLocaleString("en-PH")} extra
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  No extra cost
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main two-column grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Schedule */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 text-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Start
                    </p>
                    <p className="mt-0.5 font-semibold">
                      {format(
                        new Date(booking.base.startSched),
                        "MMM dd, yyyy",
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {format(new Date(booking.base.startSched), "hh:mm a")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      End
                    </p>
                    <p className="mt-0.5 font-semibold">
                      {format(new Date(booking.base.endSched), "MMM dd, yyyy")}
                    </p>
                    <p className="text-muted-foreground">
                      {format(new Date(booking.base.endSched), "hh:mm a")}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Order ID
                    </p>
                    <p className="mt-0.5 font-mono text-xs font-medium">
                      {booking.base.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Created
                    </p>
                    <p className="mt-0.5">
                      {format(new Date(booking.base.createdAt), "PPp")}
                    </p>
                  </div>
                  {booking.base.updatedAt && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="mt-0.5">
                        {format(new Date(booking.base.updatedAt), "PPp")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Customer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Name
                    </p>
                    <p className="mt-0.5 text-base font-semibold">
                      {booking.base.customerFirstName}{" "}
                      {booking.base.customerLastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Customer ID
                    </p>
                    <p className="mt-0.5 font-mono text-xs">
                      {booking.base.custId}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Address
                    </p>
                    <p className="mt-0.5 leading-relaxed">
                      {booking.base.address.addressHuman}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Coordinates
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {booking.base.address.addressLat.toFixed(5)},{" "}
                      {booking.base.address.addressLng.toFixed(5)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <BookingServiceDetails
              mainService={mainService as any}
              rawServiceType={
                booking.mainService.serviceType as IMainServiceType
              }
              mainServiceId={booking.mainService.id}
            />

            <BookingAddons addons={addons as any} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <BookingOperationalDetails
              equipments={booking.equipments}
              resources={booking.resources}
              cleaners={booking.cleaners}
              photos={booking.base.photos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
