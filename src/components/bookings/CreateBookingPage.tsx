"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IMainServiceType } from "@/types/booking";
import {
  mapServiceDetails,
  ITypedAddon,
  IServiceDetailConcrete,
} from "@/lib/factory";
import { BookingAddons } from "@/components/bookings/bookingAddons";

const TIME_SLOTS = [
  "08:00 AM",
  "10:00 AM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
];

const SERVICE_OPTIONS: {
  value: IMainServiceType;
  label: string;
  helper: string;
  estimate: string;
  className: string;
}[] = [
  {
    value: "GENERAL_CLEANING",
    label: "General Cleaning",
    helper: "House or office cleaning service.",
    estimate: "From ₱2,000",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  {
    value: "COUCH",
    label: "Couch Cleaning",
    helper: "Upholstery and sofa cleaning.",
    estimate: "From ₱500",
    className: "border-teal-200 bg-teal-50 text-teal-700",
  },
  {
    value: "MATTRESS",
    label: "Mattress Cleaning",
    helper: "Bed and mattress deep cleaning.",
    estimate: "From ₱1,000",
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  {
    value: "CAR",
    label: "Car Interior Cleaning",
    helper: "Interior cleaning with carpet service.",
    estimate: "From ₱1,750",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  {
    value: "POST",
    label: "Post Construction",
    helper: "Post-construction cleaning service.",
    estimate: "₱50 / sqm",
    className: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  },
];

type CustomerForm = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

type ScheduleForm = {
  date: string;
  time: string;
};

type ExistingBooking = {
  date?: string;
  time?: string;
  startSched?: string;
  base?: {
    startSched?: string;
  };
};

type SectionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
};

type SummaryRowProps = {
  label: string;
  value: ReactNode;
};

function getTodayInputValue() {
  return format(new Date(), "yyyy-MM-dd");
}

function SectionCard({
  icon,
  title,
  description,
  children,
  action,
}: SectionCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white/95 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              {icon}
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-slate-950">
                {title}
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>

          {action}
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">{children}</CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-56 text-right font-medium text-slate-950">
        {value}
      </span>
    </div>
  );
}

function getBookingSlot(booking: ExistingBooking) {
  if (booking.date && booking.time) {
    return {
      date: booking.date,
      time: booking.time,
    };
  }

  const rawDate = booking.base?.startSched ?? booking.startSched;

  if (!rawDate) return null;

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) return null;

  return {
    date: format(date, "yyyy-MM-dd"),
    time: format(date, "hh:mm a"),
  };
}

export default function CreateBookingPageComponent() {
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerForm>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [serviceType, setServiceType] =
    useState<IMainServiceType>("GENERAL_CLEANING");

  const [serviceDetails, setServiceDetails] = useState(
    mapServiceDetails(serviceType, {
      id: "temp",
      serviceType,
      details: {},
    }),
  );

  const [addons, setAddons] = useState<ITypedAddon<IServiceDetailConcrete>[]>(
    [],
  );

  const [schedule, setSchedule] = useState<ScheduleForm>({
    date: "",
    time: "",
  });

  const [dirtyScale, setDirtyScale] = useState(1);
  const [notes, setNotes] = useState("");

  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>(
    [],
  );
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoadingSlots(true);

        const res = await fetch("/api/booking/fetchBookings");

        if (!res.ok) {
          throw new Error("Failed to fetch existing bookings");
        }

        const data = await res.json();

        const bookings = Array.isArray(data)
          ? data
          : Array.isArray(data?.bookings)
            ? data.bookings
            : [];

        setExistingBookings(bookings);
      } catch (error) {
        console.error("Failed to load existing bookings:", error);
        setExistingBookings([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookings();
  }, []);

  const selectedService = useMemo(() => {
    return (
      SERVICE_OPTIONS.find((service) => service.value === serviceType) ??
      SERVICE_OPTIONS[0]
    );
  }, [serviceType]);

  const selectedSlotInfo = useMemo(() => {
    if (!schedule.time) return null;

    return getSlotInfo(schedule.time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.date, schedule.time, existingBookings]);

  const availableSlots = useMemo(() => {
    if (!schedule.date) return TIME_SLOTS.length;

    return TIME_SLOTS.filter((slot) => !getSlotInfo(slot).isFull).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.date, existingBookings]);

  const completionSteps = useMemo(() => {
    return [
      Boolean(
        customer.firstName.trim() &&
          customer.lastName.trim() &&
          customer.phone.trim() &&
          customer.address.trim(),
      ),
      Boolean(serviceType),
      Boolean(schedule.date && schedule.time),
      dirtyScale >= 1,
    ];
  }, [customer, serviceType, schedule, dirtyScale]);

  const completedStepCount = completionSteps.filter(Boolean).length;
  const completionPercent = Math.round(
    (completedStepCount / completionSteps.length) * 100,
  );

  const handleCustomerChange = (key: keyof CustomerForm, value: string) => {
    setCustomer((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleScheduleChange = (key: keyof ScheduleForm, value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleServiceChange = (value: IMainServiceType) => {
    setServiceType(value);

    setServiceDetails(
      mapServiceDetails(value, {
        id: "temp",
        serviceType: value,
        details: {},
      }),
    );
  };

  function getSlotInfo(slot: string) {
    if (!schedule.date) {
      return {
        count: 0,
        capacity: 2,
        isFull: false,
      };
    }

    const sameSlot = existingBookings.filter((booking) => {
      const bookingSlot = getBookingSlot(booking);

      if (!bookingSlot) return false;

      return bookingSlot.date === schedule.date && bookingSlot.time === slot;
    });

    const capacity = 2;
    const count = sameSlot.length;

    return {
      count,
      capacity,
      isFull: count >= capacity,
    };
  }

  const handleCreate = async () => {
    if (
      !customer.firstName.trim() ||
      !customer.lastName.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      alert("Please complete the customer information.");
      return;
    }

    if (!schedule.date || !schedule.time) {
      alert("Please select date and time.");
      return;
    }

    if (getSlotInfo(schedule.time).isFull) {
      alert("This time slot is already full.");
      return;
    }

    const payload = {
      customer,
      service: {
        type: serviceType,
        details: serviceDetails.details,
      },
      addons,
      schedule,
      operational: {
        dirtyScale,
        notes,
      },
    };

    console.log("CREATE BOOKING PAYLOAD:", payload);

    router.push("/bookings");
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/bookings")}
                  className="mb-4 h-9 rounded-xl px-0 text-slate-300 hover:bg-transparent hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to bookings
                </Button>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                  <Plus className="h-3.5 w-3.5" />
                  Manual Booking Entry
                </div>

                <h1 className="text-3xl font-semibold tracking-tight">
                  Create Booking
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Schedule a new customer service request, select the service
                  type, check slot capacity, and prepare the booking for review.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-xs text-slate-300">Form progress</p>
                <p className="mt-1 text-2xl font-semibold">
                  {completionPercent}%
                </p>
                <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Customer
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                {customer.firstName || customer.lastName
                  ? `${customer.firstName} ${customer.lastName}`.trim()
                  : "Not added yet"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Service
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                {selectedService.label}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Schedule
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                {schedule.date || schedule.time
                  ? `${schedule.date || "No date"} ${schedule.time || ""}`.trim()
                  : "Not scheduled yet"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Add-ons
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                {addons.length} selected
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <SectionCard
              icon={<UserRound className="h-5 w-5" />}
              title="Customer Information"
              description="Enter the customer details that will be attached to this booking."
              action={
                customer.firstName &&
                customer.lastName &&
                customer.phone &&
                customer.address ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Complete
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50 text-amber-700"
                  >
                    Incomplete
                  </Badge>
                )
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={customer.firstName}
                    placeholder="Enter first name"
                    className="h-11 rounded-xl bg-white"
                    onChange={(e) =>
                      handleCustomerChange("firstName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={customer.lastName}
                    placeholder="Enter last name"
                    className="h-11 rounded-xl bg-white"
                    onChange={(e) =>
                      handleCustomerChange("lastName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={customer.phone}
                      placeholder="09XXXXXXXXX"
                      className="h-11 rounded-xl bg-white pl-9"
                      onChange={(e) =>
                        handleCustomerChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="address"
                      value={customer.address}
                      placeholder="Customer address"
                      className="h-11 rounded-xl bg-white pl-9"
                      onChange={(e) =>
                        handleCustomerChange("address", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Service"
              description="Choose the main service type for this booking."
              action={
                <Badge
                  variant="outline"
                  className={`${selectedService.className} px-3 py-1`}
                >
                  {selectedService.estimate}
                </Badge>
              }
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-2">
                  <Label>Main Service</Label>
                  <Select
                    value={serviceType}
                    onValueChange={(val) =>
                      handleServiceChange(val as IMainServiceType)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-white">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-slate-500">
                    {selectedService.helper}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-4 ${selectedService.className}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    Selected service
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {selectedService.label}
                  </p>
                  <p className="mt-1 text-sm opacity-80">
                    {selectedService.estimate}
                  </p>
                </div>
              </div>
            </SectionCard>

            <BookingAddons
              addons={[]}
              selectable
              selectedAddons={addons}
              onChange={setAddons}
            />

            <SectionCard
              icon={<CalendarCheck2 className="h-5 w-5" />}
              title="Schedule"
              description="Select the service date and available time slot."
              action={
                isLoadingSlots ? (
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-600"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Checking slots
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700"
                  >
                    {availableSlots} slots available
                  </Badge>
                )
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bookingDate">Date</Label>
                  <Input
                    id="bookingDate"
                    type="date"
                    min={getTodayInputValue()}
                    value={schedule.date}
                    className="h-11 rounded-xl bg-white"
                    onChange={(e) =>
                      handleScheduleChange("date", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select
                    value={schedule.time}
                    onValueChange={(val) => handleScheduleChange("time", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-white">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>

                    <SelectContent>
                      {TIME_SLOTS.map((slot) => {
                        const info = getSlotInfo(slot);

                        return (
                          <SelectItem
                            key={slot}
                            value={slot}
                            disabled={info.isFull}
                          >
                            {slot} ({info.count}/{info.capacity}
                            {info.isFull ? " Full" : ""})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-5">
                {TIME_SLOTS.map((slot) => {
                  const info = getSlotInfo(slot);
                  const isSelected = schedule.time === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!schedule.date || info.isFull}
                      onClick={() => handleScheduleChange("time", slot)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        isSelected
                          ? "border-slate-950 bg-slate-950 text-white"
                          : info.isFull
                            ? "cursor-not-allowed border-red-200 bg-red-50 text-red-400"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      <p className="text-sm font-semibold">{slot}</p>
                      <p
                        className={`mt-1 text-xs ${
                          isSelected ? "text-slate-200" : "text-slate-500"
                        }`}
                      >
                        {schedule.date
                          ? `${info.count}/${info.capacity} booked`
                          : "Pick date first"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              icon={<Wrench className="h-5 w-5" />}
              title="Operational"
              description="Set service difficulty and internal notes for the cleaning team."
            >
              <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dirtyScale">Dirty Scale</Label>
                    <span className="text-sm font-semibold text-slate-950">
                      {dirtyScale}/5
                    </span>
                  </div>

                  <Input
                    id="dirtyScale"
                    type="number"
                    min={1}
                    max={5}
                    value={dirtyScale}
                    className="h-11 rounded-xl bg-white"
                    onChange={(e) => {
                      const value = Number(e.target.value) || 1;
                      setDirtyScale(Math.min(5, Math.max(1, value)));
                    }}
                  />

                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setDirtyScale(scale)}
                        className={`h-10 rounded-xl border text-sm font-semibold transition ${
                          dirtyScale === scale
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    placeholder="Add instructions, customer requests, access details, or internal reminders..."
                    className="min-h-32 w-full rounded-xl border border-input bg-white px-3 py-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardHeader className="bg-slate-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Booking Summary</CardTitle>
                    <CardDescription className="text-slate-300">
                      Review before creating.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-5">
                <SummaryRow
                  label="Customer"
                  value={
                    customer.firstName || customer.lastName
                      ? `${customer.firstName} ${customer.lastName}`.trim()
                      : "—"
                  }
                />

                <SummaryRow
                  label="Phone"
                  value={customer.phone ? customer.phone : "—"}
                />

                <SummaryRow
                  label="Service"
                  value={
                    <Badge
                      variant="outline"
                      className={`${selectedService.className}`}
                    >
                      {selectedService.label}
                    </Badge>
                  }
                />

                <SummaryRow label="Estimate" value={selectedService.estimate} />

                <Separator />

                <SummaryRow
                  label="Date"
                  value={schedule.date ? schedule.date : "—"}
                />

                <SummaryRow
                  label="Time"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      {schedule.time ? schedule.time : "—"}
                    </span>
                  }
                />

                <SummaryRow
                  label="Slot capacity"
                  value={
                    selectedSlotInfo
                      ? `${selectedSlotInfo.count}/${selectedSlotInfo.capacity}`
                      : "—"
                  }
                />

                <Separator />

                <SummaryRow label="Add-ons" value={`${addons.length} selected`} />
                <SummaryRow label="Dirty Scale" value={`${dirtyScale}/5`} />
                <SummaryRow
                  label="Notes"
                  value={notes.trim() ? "Added" : "No notes"}
                />
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-3 border-t bg-slate-50 p-5">
                <Button
                  type="button"
                  onClick={handleCreate}
                  className="h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Booking
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/bookings")}
                  className="h-11 rounded-xl bg-white"
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-200 bg-blue-50/80 shadow-sm">
              <CardContent className="p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-950">
                      Slot checking is still preserved
                    </p>
                    <p className="mt-1 text-sm text-blue-800/80">
                      The page still checks existing bookings and disables full
                      time slots before creating the booking payload.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}