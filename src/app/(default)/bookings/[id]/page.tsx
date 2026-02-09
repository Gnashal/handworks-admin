/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { mockBookings } from "@/data/mockBookings";
import { mapAddonDetails, mapServiceDetails } from "@/lib/factory";
import { IMainServiceType } from "@/types/booking";

import { BookingServiceDetails } from "@/components/bookings/bookingServiceDetails";
import { BookingAddons } from "@/components/bookings/bookingAddons";
import { BookingOperationalDetails } from "@/components/bookings/operationalDetails";

interface BookingDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function BookingDetailsPage(
  params: BookingDetailsPageProps,
) {
  const { id } = await params.params;

  const booking = mockBookings.bookings.find((b) => b.id === id);

  if (!booking) notFound();

  const mainService = mapServiceDetails(
    booking.mainService.serviceType as IMainServiceType,
    booking.mainService,
  );

  const addons = booking.addons?.map((addon) => mapAddonDetails(addon));

  const paymentVariant =
    booking.base.paymentStatus === "PAID" ? "default" : "outline";

  const reviewVariant =
    booking.base.reviewStatus === "COMPLETED" ? "outline" : "secondary";

  const hasAddons = addons && addons.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-muted/40 to-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b bg-grey-500 backdrop-blur">
        <div className="flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <Link
              href="/bookings"
              className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Back to bookings
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Booking #{booking.id}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
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
            <p className="text-xs text-muted-foreground sm:text-sm">
              Scheduled for{" "}
              {format(
                new Date(booking.base.startSched),
                "MMM dd, yyyy · hh:mm a",
              )}{" "}
              – {format(new Date(booking.base.endSched), "hh:mm a")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Edit Booking
            </Button>
            <Button variant="destructive" size="sm">
              Cancel booking
            </Button>
          </div>
        </div>
      </header>

      <main className="flex justify-center w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {/* Summary row */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customer & location
              </CardTitle>
              <Badge
                variant="outline"
                className="text-[11px] uppercase tracking-wide"
              >
                {booking.mainService.serviceType}
              </Badge>
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
                  Updated: {format(new Date(booking.base.updatedAt), "PPp")}
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
            {/* Schedule & status */}
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
