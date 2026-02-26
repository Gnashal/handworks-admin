/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { mapAddonDetails, mapServiceDetails } from "@/lib/factory";
import { IBooking, IMainServiceType } from "@/types/booking";

import { BookingServiceDetails } from "@/components/bookings/bookingServiceDetails";
import { BookingAddons } from "@/components/bookings/bookingAddons";
import { BookingOperationalDetails } from "@/components/bookings/operationalDetails";
import { useBookingDetailsQuery } from "@/queries/bookingQueries";
import Loader from "@/components/loader";

interface BookingDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BookingDetailsPage(props: BookingDetailsPageProps) {
  const { id } = use(props.params);

  const { data, isLoading, error } = useBookingDetailsQuery(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
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
  const hasAddons = addons && addons.length > 0;

  const paymentVariant =
    booking.base.paymentStatus === "PAID" ? "default" : "outline";

  const reviewVariant =
    booking.base.reviewStatus === "COMPLETED" ? "outline" : "secondary";

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-muted/40 to-background p-4">
      {/* Back link */}
      <Link
        href="/bookings"
        className="inline-flex items-center p-4 text-md font-medium text-muted-foreground hover:text-foreground"
      >
        Back to bookings
      </Link>

      {/* Booking card */}
      <Card className="w-full max-w-7xl mx-auto mb-6">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pb-3">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">
              Booking #{booking.id}
            </CardTitle>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Customer:{" "}
                <span className="font-medium text-foreground">
                  {booking.base.customerFirstName}{" "}
                  {booking.base.customerLastName}
                </span>
              </p>
              <p>
                Scheduled:{" "}
                {format(
                  new Date(booking.base.startSched),
                  "MMM dd, yyyy · hh:mm a",
                )}{" "}
                – {format(new Date(booking.base.endSched), "hh:mm a")}
              </p>
              <p className="text-xs">
                Created: {format(new Date(booking.base.createdAt), "PPp")} ·
                Updated:{" "}
                {booking.base.updatedAt
                  ? format(new Date(booking.base.updatedAt), "PPp")
                  : "N/A"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">
                Service: {booking.mainService.serviceType.replace("_", " ")}
              </Badge>
              <Badge variant={paymentVariant}>
                Payment: {booking.base.paymentStatus}
              </Badge>
              <Badge variant={reviewVariant}>
                Review: {booking.base.reviewStatus}
              </Badge>
              <Badge variant="outline">
                Dirty scale: {booking.base.dirtyScale}/5
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Edit booking
            </Button>
            {booking.base.reviewStatus === "PENDING" ? (
              <Button
                className="bg-green-500 hover:bg-green-500/80"
                variant="default"
                size="sm"
              >
                Approve booking
              </Button>
            ) : (
              <Button variant="destructive" size="sm">
                Cancel booking
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <div className="space-y-1">
            <p>
              <span className="font-semibold text-foreground">
                Customer ID:
              </span>{" "}
              {booking.base.custId}
            </p>
            <p className="leading-snug">
              <span className="font-semibold text-foreground">Address:</span>{" "}
              {booking.base.address.addressHuman}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <span className="font-semibold text-foreground">Lat/Lng:</span>{" "}
              <span className="font-mono text-[11px]">
                {booking.base.address.addressLat.toFixed(5)},{" "}
                {booking.base.address.addressLng.toFixed(5)}
              </span>
            </p>
            <p>
              <span className="font-semibold text-foreground">Quote ID:</span>{" "}
              <span className="font-mono text-[11px]">
                {booking.base.quoteId}
              </span>
            </p>
            <p>
              <span className="font-semibold text-foreground">Total:</span> ₱
              {booking.totalPrice.toLocaleString("en-PH")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main content */}
      <main className="flex w-full max-w-7xl mx-auto flex-1 flex-col gap-4">
        {/* Summary row */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 border-dashed">
            <CardHeader className="flex items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customer & location
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm md:grid-cols-2">
              <div className="space-y-1.5">
                <p className="font-medium">
                  {booking.base.customerFirstName}{" "}
                  {booking.base.customerLastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Customer ID: {booking.base.custId}
                </p>
                <p className="mt-2 text-sm leading-snug">
                  {booking.base.address.addressHuman}
                </p>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Lat/Lng:{" "}
                  <span className="font-mono text-[11px]">
                    {booking.base.address.addressLat.toFixed(5)},{" "}
                    {booking.base.address.addressLng.toFixed(5)}
                  </span>
                </p>
                <p>
                  Quote ID:{" "}
                  <span className="font-mono text-[11px]">
                    {booking.base.quoteId}
                  </span>
                </p>
                <p>
                  Created: {format(new Date(booking.base.createdAt), "PPp")}
                </p>
                <p>
                  Updated:{" "}
                  {booking.base.updatedAt
                    ? format(new Date(booking.base.updatedAt), "PPp")
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total price
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-2xl font-semibold tracking-tight">
                ₱{booking.totalPrice.toLocaleString("en-PH")}
              </p>
              <p className="text-xs text-muted-foreground">
                Base service {hasAddons ? "+ add-ons" : ""}.
              </p>
              {hasAddons && (
                <p className="text-xs text-muted-foreground">
                  Add-ons:{" "}
                  <span className="font-medium">
                    ₱
                    {addons!
                      .reduce((sum, a) => sum + (a.price ?? 0), 0)
                      .toLocaleString("en-PH")}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Main layout */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
          <div className="space-y-4">
            {/* Schedule & flags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Schedule & status
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Window
                  </p>
                  <p className="leading-snug">
                    {format(
                      new Date(booking.base.startSched),
                      "MMM dd, yyyy · hh:mm a",
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ends at {format(new Date(booking.base.endSched), "hh:mm a")}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Flags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-[11px]">
                      Dirty scale {booking.base.dirtyScale}/5
                    </Badge>
                    <Badge variant={paymentVariant} className="text-[11px]">
                      {booking.base.paymentStatus}
                    </Badge>
                    <Badge variant={reviewVariant} className="text-[11px]">
                      {booking.base.reviewStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <BookingServiceDetails
              mainService={mainService as any}
              rawServiceType={
                booking.mainService.serviceType as IMainServiceType
              }
              mainServiceId={booking.mainService.id}
            />

            <BookingAddons addons={addons as any} />
          </div>

          <div className="space-y-4">
            <BookingOperationalDetails
              equipments={booking.equipments}
              resources={booking.resources}
              cleaners={booking.cleaners}
              photos={booking.base.photos}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
