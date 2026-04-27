/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  User,
  Clock,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  User2Icon,
  Wallet,
  PinIcon,
  Images,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { mapAddonDetails, mapServiceDetails } from "@/lib/factory";
import { IBooking, IMainServiceType } from "@/types/booking";
import { normalizeServiceName } from "@/lib/normalize";

import { BookingServiceDetails } from "@/components/bookings/bookingServiceDetails";
import { BookingOperationalDetails } from "@/components/bookings/operationalDetails";
import { BookingAddressMap } from "@/components/bookings/bookingAddressMap";
import { useBookingDetailsQuery } from "@/queries/bookingQueries";
import { useOrderQuery } from "@/queries/paymentQueries";
import { normalizeStatus, formatMoney } from "@/lib/normalize";
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
    SCHEDULED: {
      label: "Scheduled",
      className: "bg-sky-500/15 text-sky-600 border border-sky-500/30",
    },
    PENDING: {
      label: "Review Pending",
      className: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
    },
    COMPLETED: {
      label: "Reviewed",
      className: "bg-green-500/15 text-green-600 border border-green-500/30",
    },
  };

const paymentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  PENDING_DOWNPAYMENT: {
    label: "Pending downpayment",
    className: "bg-amber-500/20 text-amber-700 border border-amber-500/40",
  },
  PENDING_FULLPAYMENT: {
    label: "Pending full payment",
    className: "bg-orange-500/20 text-orange-700 border border-orange-500/40",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-emerald-500/20 text-emerald-700 border border-emerald-500/40",
  },
};

const serviceHeroThemeConfig: Record<
  IMainServiceType,
  {
    cardClass: string;
    chipClass: string;
    subtleTextClass: string;
    glassPanelClass: string;
    secondaryButtonClass: string;
    urgencyCardClass: string;
  }
> = {
  GENERAL_CLEANING: {
    cardClass:
      "border-sky-400/35 bg-linear-to-r from-sky-300/45 via-sky-200/35 to-sky-100/15 text-zinc-900",
    chipClass: "border-sky-500/25 bg-white/75 text-sky-900",
    subtleTextClass: "text-sky-900/75",
    glassPanelClass: "border-white/75 bg-white/60",
    secondaryButtonClass:
      "border-sky-700/20 bg-white/85 text-zinc-900 hover:bg-white",
    urgencyCardClass: "border-white/75 bg-white/55",
  },
  COUCH: {
    cardClass:
      "border-teal-400/35 bg-linear-to-r from-teal-300/45 via-teal-200/35 to-teal-100/15 text-zinc-900",
    chipClass: "border-teal-500/25 bg-white/75 text-teal-900",
    subtleTextClass: "text-teal-900/75",
    glassPanelClass: "border-white/75 bg-white/60",
    secondaryButtonClass:
      "border-teal-700/20 bg-white/85 text-zinc-900 hover:bg-white",
    urgencyCardClass: "border-white/75 bg-white/55",
  },
  MATTRESS: {
    cardClass:
      "border-indigo-400/35 bg-linear-to-r from-indigo-300/45 via-indigo-200/35 to-indigo-100/15 text-zinc-900",
    chipClass: "border-indigo-500/25 bg-white/75 text-indigo-900",
    subtleTextClass: "text-indigo-900/75",
    glassPanelClass: "border-white/75 bg-white/60",
    secondaryButtonClass:
      "border-indigo-700/20 bg-white/85 text-zinc-900 hover:bg-white",
    urgencyCardClass: "border-white/75 bg-white/55",
  },
  CAR: {
    cardClass:
      "border-orange-400/35 bg-linear-to-r from-orange-300/45 via-orange-200/35 to-orange-100/15 text-zinc-900",
    chipClass: "border-orange-500/25 bg-white/75 text-orange-900",
    subtleTextClass: "text-orange-900/75",
    glassPanelClass: "border-white/75 bg-white/60",
    secondaryButtonClass:
      "border-orange-700/20 bg-white/85 text-zinc-900 hover:bg-white",
    urgencyCardClass: "border-white/75 bg-white/55",
  },
  POST: {
    cardClass:
      "border-fuchsia-400/35 bg-linear-to-r from-fuchsia-300/45 via-fuchsia-200/35 to-fuchsia-100/15 text-zinc-900",
    chipClass: "border-fuchsia-500/25 bg-white/75 text-fuchsia-900",
    subtleTextClass: "text-fuchsia-900/75",
    glassPanelClass: "border-white/75 bg-white/60",
    secondaryButtonClass:
      "border-fuchsia-700/20 bg-white/85 text-zinc-900 hover:bg-white",
    urgencyCardClass: "border-white/75 bg-white/55",
  },
  SERVICE_TYPE_UNSPECIFIED: {
    cardClass:
      "border-slate-400/35 bg-linear-to-r from-slate-300/45 via-slate-200/35 to-slate-100/15 text-zinc-900",
    chipClass: "border-slate-500/25 bg-white/75 text-slate-900",
    subtleTextClass: "text-slate-900/75",
    glassPanelClass: "border-white/75 bg-white/60",
    secondaryButtonClass:
      "border-slate-700/20 bg-white/85 text-zinc-900 hover:bg-white",
    urgencyCardClass: "border-white/75 bg-white/55",
  },
};

function StatusPill({ status }: { status: string }) {
  const c = bookingStatusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${c.className}`}
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
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${c.className}`}
    >
      {c.label}
    </span>
  );
}

function PaymentPill({ status }: { status: string }) {
  const normalized = normalizeStatus(status);
  const c = paymentStatusConfig[normalized] ?? {
    label: status.replace(/_/g, " ").toLowerCase(),
    className: "bg-muted text-muted-foreground border",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${c.className}`}
    >
      {c.label}
    </span>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export default function BookingDetailsPage(props: BookingDetailsPageProps) {
  const { id } = use(props.params);
  const { data, isLoading, error } = useBookingDetailsQuery(id);
  const { loading: approveLoading, handleApproveBooking } = useBooking();
  const [localReviewStatus, setLocalReviewStatus] = useState<string | null>(
    null,
  );
  const [mediaIndex, setMediaIndex] = useState(0);
  const orderId = data?.base.orderId ?? "";
  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useOrderQuery(orderId);

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

  if (orderLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (orderError || !order) {
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
  const paymentStatus = order.payment_status;
  const normalizedReviewStatus = normalizeStatus(effectiveReviewStatus);
  // const normalizedBookingStatus = normalizeStatus(booking.base.status);
  const normalizedPaymentStatus = normalizeStatus(paymentStatus);
  const canApproveBooking = normalizedReviewStatus === "PENDING";
  const canCompleteBooking = normalizedReviewStatus === "SCHEDULED";
  const showDownpaymentPaidPill =
    normalizedPaymentStatus === "PENDING_FULLPAYMENT" ||
    normalizedPaymentStatus === "COMPLETED";
  const showFullpaymentPaidPill = normalizedPaymentStatus === "COMPLETED";
  const serviceType = booking.mainService.serviceType as IMainServiceType;
  const heroTheme =
    serviceHeroThemeConfig[serviceType] ??
    serviceHeroThemeConfig.SERVICE_TYPE_UNSPECIFIED;
  const photos = booking.base.photos ?? [];
  const activeMediaIndex =
    photos.length > 0 ? Math.min(mediaIndex, photos.length - 1) : 0;

  const handlePrevMedia = () => {
    if (!photos.length) return;

    setMediaIndex((current) =>
      current === 0 ? photos.length - 1 : current - 1,
    );
  };

  const handleNextMedia = () => {
    if (!photos.length) return;

    setMediaIndex((current) =>
      current === photos.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-4 px-4 pt-5 pb-8 sm:px-6 lg:px-8">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        <Card
          className={`border shadow-sm backdrop-blur-sm ${heroTheme.cardClass}`}
        >
          <CardContent className="py-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="space-y-3">
                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${heroTheme.chipClass}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Booking intelligence
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Booking #{booking.id}
                  </CardTitle>
                  <p
                    className={`text-sm font-medium ${heroTheme.subtleTextClass}`}
                  >
                    {normalizeServiceName(
                      booking.mainService.serviceType as IMainServiceType,
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusPill status={booking.base.status} />
                  <ReviewPill status={effectiveReviewStatus} />
                  <PaymentPill status={paymentStatus} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    className={`rounded-lg border p-3 ${heroTheme.glassPanelClass}`}
                  >
                    <div
                      className={`mb-2 flex items-center gap-2 ${heroTheme.subtleTextClass}`}
                    >
                      <User2Icon className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Customer
                      </p>
                    </div>
                    <p className="text-lg font-semibold sm:text-xl">
                      {booking.base.customerFirstName}{" "}
                      {booking.base.customerLastName}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg border p-3 ${heroTheme.glassPanelClass}`}
                  >
                    <div
                      className={`mb-2 flex items-center gap-2 ${heroTheme.subtleTextClass}`}
                    >
                      <PinIcon className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Service address
                      </p>
                    </div>
                    <p className="line-clamp-2 text-sm sm:text-base">
                      {booking.base.address.addressHuman}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2.5 lg:min-w-55 lg:justify-end">
                <Button
                  disabled={approveLoading || !canApproveBooking}
                  onClick={async () => {
                    if (!canApproveBooking) return;

                    const res = await handleApproveBooking(booking.id);
                    if (res?.status) {
                      setLocalReviewStatus(res.status);
                    }
                  }}
                  className="bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  <ShieldCheck className="mr-1.5 h-4 w-4" />
                  Approve booking
                </Button>

                <Button
                  disabled={!canCompleteBooking}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  Complete booking
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-2 border-t border-white/60 pt-4 sm:grid-cols-2 xl:grid-cols-4">
              <div
                className={`rounded-lg border p-3 ${heroTheme.glassPanelClass}`}
              >
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700">
                  <Banknote className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Booking Total
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {formatMoney(booking.totalPrice, order.currency)}
                </p>
              </div>

              <div
                className={`rounded-lg border p-3 ${heroTheme.glassPanelClass}`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-700">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  {showDownpaymentPaidPill ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Paid
                    </span>
                  ) : null}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Downpayment
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {formatMoney(order.downpayment_required, order.currency)}
                </p>
              </div>

              <div
                className={`rounded-lg border p-3 ${heroTheme.glassPanelClass}`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-700">
                    <Wallet className="h-4 w-4" />
                  </div>
                  {showFullpaymentPaidPill ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Paid
                    </span>
                  ) : null}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Remaining Balance
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {formatMoney(order.remaining_balance, order.currency)}
                </p>
              </div>

              <div
                className={`rounded-lg border p-3 ${heroTheme.glassPanelClass}`}
              >
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10 text-violet-700">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dirty Scale
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {booking.base.dirtyScale}
                  <span className="text-base font-semibold text-muted-foreground">
                    /5
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-3">
          <TabsList
            variant="line"
            className="h-auto w-full flex-wrap justify-start"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <SectionHeading
              title="Overview"
              description="Core booking context, service specifications, and customer schedule data."
            />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Schedule</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                    <div className="space-y-3">
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
                          {format(
                            new Date(booking.base.endSched),
                            "MMM dd, yyyy",
                          )}
                        </p>
                        <p className="text-muted-foreground">
                          {format(new Date(booking.base.endSched), "hh:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Payment Method
                        </p>
                        <p className="mt-0.5 font-medium capitalize">
                          {order.payment_method.toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Service
                        </p>
                        <p className="mt-0.5 font-medium">
                          {normalizeServiceName(
                            booking.mainService.serviceType as IMainServiceType,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Add-ons
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          {hasAddons
                            ? `+${addons!.length} add-on${addons!.length > 1 ? "s" : ""}`
                            : "No add-ons"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Customer</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
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

                    <div className="sm:col-span-2">
                      <BookingAddressMap
                        latitude={booking.base.address.addressLat}
                        longitude={booking.base.address.addressLng}
                        address={booking.base.address.addressHuman}
                      />
                    </div>
                  </CardContent>
                </Card>

                <BookingServiceDetails
                  mainService={mainService as any}
                  rawServiceType={
                    booking.mainService.serviceType as IMainServiceType
                  }
                  addons={addons as any}
                  extraHours={booking.base.extraHours}
                  extraHourCost={booking.base.extraHourCost}
                  formattedExtraHourCost={formatMoney(
                    booking.base.extraHourCost,
                    order.currency,
                  )}
                />
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Booking metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Booking ID</span>
                      <span className="font-mono text-xs">{booking.id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        Review Status
                      </span>
                      <ReviewPill status={effectiveReviewStatus} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        Payment Status
                      </span>
                      <PaymentPill status={paymentStatus} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        Order Created
                      </span>
                      <span>{format(new Date(order.created_at), "PPp")}</span>
                    </div>
                    {order.updated_at ? (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Order Updated
                        </span>
                        <span>{format(new Date(order.updated_at), "PPp")}</span>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Extra effort</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-end justify-between gap-2">
                      <span className="text-muted-foreground">Extra Hours</span>
                      <p className="text-3xl font-bold tracking-tight">
                        {booking.base.extraHours}
                        <span className="text-base font-semibold text-muted-foreground">
                          {" "}
                          h
                        </span>
                      </p>
                    </div>
                    <p className="text-muted-foreground">
                      {booking.base.extraHourCost > 0
                        ? `Additional charge: ${formatMoney(booking.base.extraHourCost, order.currency)}`
                        : "No extra-hour charge"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <SectionHeading
              title="Operations"
              description="Cleaner assignments, equipment provisioning, and fulfillment readiness."
            />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <BookingOperationalDetails
                bookingId={booking.id}
                equipments={booking.equipments}
                resources={booking.resources}
                cleaners={booking.cleaners}
              />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Operational snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dirty Scale</span>
                    <span className="font-semibold">
                      {booking.base.dirtyScale}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Extra Hours</span>
                    <span className="font-semibold">
                      {booking.base.extraHours} h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Booking Status
                    </span>
                    <StatusPill status={booking.base.status} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financials" className="space-y-4">
            <SectionHeading
              title="Financials"
              description="Order records, totals, downpayment progress, and balance snapshots."
            />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <Card className="border-emerald-500/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Order & Payment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-5 text-sm lg:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Order Number
                      </p>
                      <p className="mt-0.5 text-base font-semibold">
                        {order.order_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Order ID
                      </p>
                      <p className="mt-0.5 break-all font-mono text-xs">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Linked Booking Order ID
                      </p>
                      <p className="mt-0.5 break-all font-mono text-xs">
                        {booking.base.orderId}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl border bg-muted/35 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        {formatMoney(order.subtotal, order.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Add-ons</span>
                      <span className="font-semibold">
                        {formatMoney(order.addon_total, order.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-base font-bold">
                        {formatMoney(order.total_amount, order.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Downpayment</span>
                      <span className="font-semibold">
                        {formatMoney(
                          order.downpayment_required,
                          order.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-semibold">
                        {formatMoney(order.remaining_balance, order.currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">
                        Payment Snapshot
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <PaymentPill status={paymentStatus} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-semibold">
                        {formatMoney(order.total_amount, order.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-semibold">
                        {formatMoney(order.remaining_balance, order.currency)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Payment method</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="font-medium capitalize">
                      {order.payment_method.toLowerCase()} payment method
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {hasAddons
                        ? `Includes ${formatMoney(addonTotal, order.currency)} in add-ons.`
                        : "No add-on charges on this booking."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <SectionHeading
              title="Media"
              description="Customer-uploaded files linked to this booking."
            />
            <Card className="border-2 border-sky-500/25 bg-linear-to-br from-sky-500/6 via-background to-sky-500/12">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Images className="h-4 w-4 text-sky-700" />
                    <CardTitle className="text-base">Media uploads</CardTitle>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-700">
                    {photos.length} file{photos.length === 1 ? "" : "s"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!photos.length ? (
                  <p className="text-sm italic text-muted-foreground">
                    Customer has not uploaded media for this booking.
                  </p>
                ) : (
                  <>
                    <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                      <Image
                        src={photos[activeMediaIndex]}
                        alt={`Booking upload ${activeMediaIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 900px, 100vw"
                      />

                      {photos.length > 1 ? (
                        <>
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={handlePrevMedia}
                            className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 border bg-background/90"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={handleNextMedia}
                            className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 border bg-background/90"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                            {activeMediaIndex + 1} / {photos.length}
                          </div>
                        </>
                      ) : null}
                    </div>

                    {photos.length > 1 ? (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {photos.map((photo, index) => (
                          <button
                            key={`${photo}-${index}`}
                            type="button"
                            onClick={() => setMediaIndex(index)}
                            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition ${
                              index === activeMediaIndex
                                ? "ring-2 ring-primary"
                                : "opacity-80"
                            }`}
                          >
                            <Image
                              src={photo}
                              alt={`Media thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
