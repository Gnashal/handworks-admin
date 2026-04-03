/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  User,
  Clock,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  User2Icon,
  Wallet,
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
import { useOrderQuery } from "@/queries/paymentQueries";
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

function normalizeStatus(status: string) {
  return status.trim().replace(/\s+/g, "_").toUpperCase();
}

function formatMoney(amount: number, currency?: string) {
  const normalizedCurrency = currency?.toUpperCase();

  if (normalizedCurrency && /^[A-Z]{3}$/.test(normalizedCurrency)) {
    try {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: normalizedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback to peso format when backend sends an invalid currency code.
    }
  }

  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

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

export default function BookingDetailsPage(props: BookingDetailsPageProps) {
  const { id } = use(props.params);
  const { data, isLoading, error } = useBookingDetailsQuery(id);
  const { loading: approveLoading, handleApproveBooking } = useBooking();
  const [localReviewStatus, setLocalReviewStatus] = useState<string | null>(
    null,
  );

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
  const isPaymentCompleted = normalizeStatus(paymentStatus) === "COMPLETED";
  const serviceType = booking.mainService.serviceType as IMainServiceType;
  const heroTheme =
    serviceHeroThemeConfig[serviceType] ??
    serviceHeroThemeConfig.SERVICE_TYPE_UNSPECIFIED;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_45%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_40%)] bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-10 space-y-6 sm:px-6 lg:px-8">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        <Card
          className={`border bg-linear-to-r shadow-xl backdrop-blur-sm ${heroTheme.cardClass}`}
        >
          <CardContent className="pt-7 pb-7">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="space-y-5">
                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${heroTheme.chipClass}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Booking intelligence
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Booking overview
                  </CardTitle>
                  <p
                    className={`font-mono text-sm ${heroTheme.subtleTextClass}`}
                  >
                    #{booking.id}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusPill status={booking.base.status} />
                  <ReviewPill status={effectiveReviewStatus} />
                  <PaymentPill status={paymentStatus} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div
                    className={`rounded-xl border p-4 backdrop-blur-sm ${heroTheme.glassPanelClass}`}
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
                    className={`rounded-xl border p-4 backdrop-blur-sm ${heroTheme.glassPanelClass}`}
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

              <div className="flex shrink-0 flex-col gap-2.5 lg:min-w-55">
                <Button
                  variant="secondary"
                  className={`border ${heroTheme.secondaryButtonClass}`}
                >
                  Edit booking
                </Button>
                {effectiveReviewStatus === "PENDING" ? (
                  <Button
                    disabled={approveLoading}
                    onClick={async () => {
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
                ) : (
                  <Button variant="destructive">Cancel booking</Button>
                )}

                <div
                  className={`mt-2 rounded-xl border p-4 ${heroTheme.urgencyCardClass}`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${heroTheme.subtleTextClass}`}
                  >
                    Payment urgency
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {isPaymentCompleted ? "Settled" : "Action Needed"}
                  </p>
                  <p className={`mt-1 text-xs ${heroTheme.subtleTextClass}`}>
                    Status updates here in real time as transactions are posted.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                <Banknote className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Booking Total
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {formatMoney(booking.totalPrice, order.currency)}
              </p>
              {hasAddons && (
                <p className="mt-1 text-sm text-muted-foreground">
                  incl. {formatMoney(addonTotal, order.currency)} in add-ons
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700">
                <CreditCard className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Downpayment Required
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {formatMoney(order.downpayment_required, order.currency)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                {order.payment_method.toLowerCase()} payment method
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700">
                <Wallet className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Remaining Balance
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {formatMoney(order.remaining_balance, order.currency)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pending after posted payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Dirty Scale
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {booking.base.dirtyScale}
                <span className="text-xl font-semibold text-muted-foreground">
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card className="border-emerald-500/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Order & Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2 text-sm">
                <div className="space-y-4">
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
                      {formatMoney(order.downpayment_required, order.currency)}
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

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
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
                      Payment Method
                    </p>
                    <p className="mt-0.5 font-medium capitalize">
                      {order.payment_method.toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Order Created
                    </p>
                    <p className="mt-0.5">
                      {format(new Date(order.created_at), "PPp")}
                    </p>
                  </div>
                  {order.updated_at && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Order Updated
                      </p>
                      <p className="mt-0.5">
                        {format(new Date(order.updated_at), "PPp")}
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

            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Service
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {normalizeServiceName(
                        booking.mainService.serviceType as IMainServiceType,
                      )}
                    </p>
                    {hasAddons ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        +{addons!.length} add-on{addons!.length > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        No add-ons
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Extra Hours
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {booking.base.extraHours}
                      <span className="text-lg font-semibold text-muted-foreground">
                        h
                      </span>
                    </p>
                    {booking.base.extraHourCost > 0 ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatMoney(
                          booking.base.extraHourCost,
                          order.currency,
                        )}{" "}
                        extra
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        No extra cost
                      </p>
                    )}
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

          <div className="space-y-6">
            <BookingOperationalDetails
              equipments={booking.equipments}
              resources={booking.resources}
              cleaners={booking.cleaners}
              photos={booking.base.photos}
            />

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Payment Snapshot</CardTitle>
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
          </div>
        </div>
      </div>
    </div>
  );
}
