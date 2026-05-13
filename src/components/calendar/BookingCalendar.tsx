"use client";

import { useMemo, useState, type ReactNode } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Loader2,
  MapPin,
  Package,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";

import {
  normalizeServiceNameFromValue,
  normalizeServiceType,
} from "@/lib/normalize";
import {
  useBookingsTodayQuery,
  useCalendarBookingsQuery,
} from "@/queries/bookingQueries";
import type { ICalendarBooking, IMainServiceType } from "@/types/booking";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIME_SLOTS = ["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_OPTIONS = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

type CalendarDay = {
  day: number;
  current: boolean;
  date: Date;
};

type ServiceFilter = IMainServiceType | "ALL";

type TodayBooking = {
  id?: string;
  bookingId?: string;
  service: string;
  time: string;
  client: string;
};

type ExtraCalendarBooking = ICalendarBooking & {
  status?: string;
  reviewStatus?: string;
  paymentStatus?: string;
  totalPrice?: number;
  dirtyScale?: number;
  address?: string;
  cleaners?: unknown[];
  resources?: unknown[];
  equipments?: unknown[];
  equipment?: unknown[];
};

const SERVICE_OPTIONS: { value: ServiceFilter; label: string }[] = [
  { value: "ALL", label: "All Services" },
  { value: "GENERAL_CLEANING", label: "General Cleaning" },
  { value: "COUCH", label: "Couch Cleaning" },
  { value: "MATTRESS", label: "Mattress Cleaning" },
  { value: "CAR", label: "Car Interior Cleaning" },
  { value: "POST", label: "Post Construction" },
];

const SERVICE_STYLES: Record<
  IMainServiceType,
  {
    event: string;
    panel: string;
    dot: string;
  }
> = {
  GENERAL_CLEANING: {
    event: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
    dot: "bg-emerald-500",
  },
  COUCH: {
    event: "border-amber-200 bg-amber-50 text-amber-700",
    panel: "border-amber-200 bg-amber-50/90 text-amber-900",
    dot: "bg-amber-500",
  },
  MATTRESS: {
    event: "border-violet-200 bg-violet-50 text-violet-700",
    panel: "border-violet-200 bg-violet-50/90 text-violet-900",
    dot: "bg-violet-500",
  },
  CAR: {
    event: "border-sky-200 bg-sky-50 text-sky-700",
    panel: "border-sky-200 bg-sky-50/90 text-sky-900",
    dot: "bg-sky-500",
  },
  POST: {
    event: "border-orange-200 bg-orange-50 text-orange-700",
    panel: "border-orange-200 bg-orange-50/90 text-orange-900",
    dot: "bg-orange-500",
  },
  SERVICE_TYPE_UNSPECIFIED: {
    event: "border-slate-200 bg-slate-50 text-slate-700",
    panel: "border-slate-200 bg-slate-50/90 text-slate-900",
    dot: "bg-slate-500",
  },
};

const parseTimeToMinutes = (time: string) => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  const normalizedHours = (hours % 12) + (period === "PM" ? 12 : 0);

  return normalizedHours * 60 + minutes;
};

const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

const formatMoney = (value?: number) => {
  if (typeof value !== "number") return "Not provided";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatStatusLabel = (value?: string) => {
  if (!value) return "Not provided";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getCustomerName = (booking: ICalendarBooking) => {
  if (!booking.customer) return "Unknown customer";

  return `${booking.customer.firstName} ${booking.customer.lastName}`.trim();
};

const getNormalizedServiceType = (service: string): IMainServiceType => {
  return normalizeServiceType(service) ?? "SERVICE_TYPE_UNSPECIFIED";
};

const getServiceStyle = (service: string) => {
  return SERVICE_STYLES[getNormalizedServiceType(service)];
};

const getShortBookingId = (bookingId?: string) => {
  if (!bookingId) return "No ID";

  if (bookingId.length <= 10) return bookingId;

  return `${bookingId.slice(0, 6)}...${bookingId.slice(-4)}`;
};

const getRiskLabel = (count: number, capacity: number) => {
  if (count >= capacity) return "Full";
  if (count >= capacity - 1) return "Almost Full";
  if (count >= 3) return "Busy";
  if (count > 0) return "Available";
  return "Open";
};

const getRiskClass = (count: number, capacity: number) => {
  if (count >= capacity) return "border-red-200 bg-red-50 text-red-700";
  if (count >= capacity - 1)
    return "border-orange-200 bg-orange-50 text-orange-700";
  if (count >= 3) return "border-amber-200 bg-amber-50 text-amber-700";
  if (count > 0) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
};

const getDayNumberClass = ({
  isSelected,
  isToday,
  isCurrentMonth,
}: {
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
}) => {
  const baseClass =
    "absolute left-2 top-2 inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-bold transition";

  if (!isCurrentMonth) {
    return `${baseClass} text-slate-300`;
  }

  if (isSelected) {
    return `${baseClass} bg-slate-950 text-white shadow-sm ring-2 ring-white`;
  }

  if (isToday) {
    return `${baseClass} bg-blue-50 text-blue-700 ring-1 ring-blue-200`;
  }

  return `${baseClass} text-slate-800 hover:bg-slate-100`;
};

const getOptionalCount = (items?: unknown[]) => {
  if (!items) return "Not assigned";

  return items.length;
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs">
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-500">{label}</p>
        <div className="mt-0.5 truncate font-semibold text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}

function AdminMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="mb-1 flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

export default function BookingCalendar() {
  const router = useRouter();
  const today = new Date();
  const todayKey = formatDateKey(today);

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("ALL");

  const { data: bookingsTodayData, isLoading: isLoadingBookingsToday } =
    useBookingsTodayQuery();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const yearOptions = useMemo(() => {
    const nowYear = new Date().getFullYear();
    const years = new Set<number>();

    for (
      let optionYear = nowYear - 5;
      optionYear <= nowYear + 10;
      optionYear++
    ) {
      years.add(optionYear);
    }

    years.add(year);

    return Array.from(years).sort((a, b) => a - b);
  }, [year]);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const {
    data: calendarBookingsData,
    isLoading: isLoadingCalendarBookings,
    error: calendarBookingsError,
  } = useCalendarBookingsQuery(monthKey);

  const bookings: ExtraCalendarBooking[] = useMemo(() => {
    const rawBookings = (calendarBookingsData?.bookings ??
      []) as ExtraCalendarBooking[];

    if (serviceFilter === "ALL") {
      return rawBookings;
    }

    return rawBookings.filter((booking) => {
      return getNormalizedServiceType(booking.service) === serviceFilter;
    });
  }, [calendarBookingsData?.bookings, serviceFilter]);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const days: CalendarDay[] = [];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        current: false,
        date: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        current: true,
        date: new Date(year, month, i),
      });
    }

    while (days.length < 42) {
      const nextDay = days.length - (firstDay + daysInMonth) + 1;

      days.push({
        day: nextDay,
        current: false,
        date: new Date(year, month + 1, nextDay),
      });
    }

    return days;
  }, [year, month]);

  const getDayBookings = (date: string) => {
    return bookings
      .filter((booking) => booking.schedule?.date === date)
      .sort((a, b) => {
        const aTime = a.schedule?.time ?? "";
        const bTime = b.schedule?.time ?? "";

        return parseTimeToMinutes(aTime) - parseTimeToMinutes(bTime);
      });
  };

  const getDayInfo = (date: string) => {
    const count = getDayBookings(date).length;
    const capacity = 5;

    return {
      count,
      capacity,
      isFull: count >= capacity,
      isBusy: count > 0,
      remaining: Math.max(capacity - count, 0),
    };
  };

  const todayBookingsRaw = bookingsTodayData?.bookings as
    | TodayBooking[]
    | TodayBooking
    | undefined;

  const todayBookings = Array.isArray(todayBookingsRaw)
    ? todayBookingsRaw
    : todayBookingsRaw
      ? [todayBookingsRaw]
      : [];

  const scheduleSlots = Array.from(
    new Set([
      ...TIME_SLOTS,
      ...todayBookings
        .map((booking) => booking.time)
        .filter((time): time is string => Boolean(time)),
    ]),
  ).sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));

  const groupedTodayBookings = scheduleSlots.map((slot) => ({
    slot,
    items: todayBookings.filter((booking) => booking.time === slot),
  }));

  const selectedDayBookings = getDayBookings(selectedDate);
  const selectedDayInfo = getDayInfo(selectedDate);
  const selectedDateLabel = format(
    new Date(`${selectedDate}T00:00:00`),
    "MMMM dd, yyyy",
  );

  const monthBookingsCount = bookings.length;
  const fullDaysCount = calendarDays.filter((day) => {
    const date = formatDateKey(day.date);
    return day.current && getDayInfo(date).isFull;
  }).length;

  const busyDaysCount = calendarDays.filter((day) => {
    const date = formatDateKey(day.date);
    return day.current && getDayInfo(date).isBusy;
  }).length;

  const selectedServiceMix = selectedDayBookings.reduce(
    (acc, booking) => {
      const serviceName = normalizeServiceNameFromValue(booking.service);
      acc[serviceName] = (acc[serviceName] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const mostCommonSelectedService =
    Object.entries(selectedServiceMix).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "None";

  const goToPreviousMonth = () => {
    const nextDate = new Date(year, month - 1, 1);

    setCurrentDate(nextDate);
    setSelectedDate(formatDateKey(nextDate));
  };

  const goToNextMonth = () => {
    const nextDate = new Date(year, month + 1, 1);

    setCurrentDate(nextDate);
    setSelectedDate(formatDateKey(nextDate));
  };

  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  };

  const handleMonthChange = (value: string) => {
    const nextMonth = Number(value);

    if (Number.isNaN(nextMonth)) return;

    const nextDate = new Date(year, nextMonth, 1);

    setCurrentDate(nextDate);
    setSelectedDate(formatDateKey(nextDate));
  };

  const handleYearChange = (value: string) => {
    const nextYear = Number(value);

    if (Number.isNaN(nextYear)) return;

    const nextDate = new Date(nextYear, month, 1);

    setCurrentDate(nextDate);
    setSelectedDate(formatDateKey(nextDate));
  };

  const handleJumpToDate = (value: string) => {
    if (!value) return;

    const nextDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(nextDate.getTime())) return;

    setSelectedDate(value);
    setCurrentDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  };

  const openBooking = (bookingId?: string) => {
    if (!bookingId) return;

    router.push(`/bookings/${bookingId}`);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-3 sm:p-4 lg:p-5">
      <div className="flex w-full max-w-none flex-col gap-5">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-5 py-5 text-white sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Calendar Management
                </div>

                <h1 className="text-3xl font-semibold tracking-tight">
                  Calendar
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-slate-300">
                  Track booking schedules, daily slot capacity, and service
                  workload across the month.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={serviceFilter}
                  onValueChange={(value) =>
                    setServiceFilter(value as ServiceFilter)
                  }
                >
                  <SelectTrigger className="h-10 w-48 rounded-xl border-white/15 bg-white/10 text-white">
                    <SelectValue placeholder="Filter service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_OPTIONS.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={goToToday}
                  className="h-10 rounded-xl bg-white text-slate-950 hover:bg-slate-100"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Today
                </Button>

                <Button
                  type="button"
                  onClick={() => router.push("/bookings/create")}
                  className="h-10 rounded-xl bg-white text-slate-950 hover:bg-slate-100"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Booking
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Month Bookings
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {isLoadingCalendarBookings ? "..." : monthBookingsCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Busy Days
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {busyDaysCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Full Days
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {fullDaysCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Selected Day
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {selectedDayInfo.count}/{selectedDayInfo.capacity}
              </p>
            </div>
          </div>
        </header>

        {calendarBookingsError && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4" />
            Failed to load calendar bookings.
          </div>
        )}

        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[1220px] grid-cols-[220px_minmax(660px,1fr)_320px] gap-4 2xl:min-w-0 2xl:grid-cols-[240px_minmax(760px,1fr)_340px]">
            <Card className="flex max-h-[720px] flex-col overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardHeader className="shrink-0 border-b border-slate-200 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      Today&apos;s Timeline
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Bookings scheduled for today.
                    </CardDescription>
                  </div>

                  <Badge variant="outline">{todayBookings.length}</Badge>
                </div>
              </CardHeader>

              <CardContent className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
                {isLoadingBookingsToday && (
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading today&apos;s bookings...
                  </div>
                )}

                {!isLoadingBookingsToday && todayBookings.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No bookings scheduled for today.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Timeline is clear for now.
                    </p>
                  </div>
                )}

                {!isLoadingBookingsToday &&
                  groupedTodayBookings.map(({ slot, items }) => {
                    const slotCapacity = 2;
                    const slotRemaining = Math.max(
                      slotCapacity - items.length,
                      0,
                    );

                    return (
                      <div key={slot} className="rounded-2xl border p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              {slot}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {slotRemaining} open capacity
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className={getRiskClass(items.length, slotCapacity)}
                          >
                            {items.length}/{slotCapacity}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {items.length > 0 ? (
                            items.map((booking, index) => {
                              const style = getServiceStyle(booking.service);
                              const bookingId = booking.bookingId ?? booking.id;

                              return (
                                <button
                                  key={`${booking.client}-${booking.time}-${index}`}
                                  type="button"
                                  onClick={() => openBooking(bookingId)}
                                  className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition hover:shadow-sm ${style.panel}`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="truncate font-semibold">
                                        {normalizeServiceNameFromValue(
                                          booking.service,
                                        )}
                                      </p>
                                      <p className="mt-1 truncate opacity-80">
                                        Client: {booking.client}
                                      </p>
                                      <p className="mt-1 truncate opacity-70">
                                        ID: {getShortBookingId(bookingId)}
                                      </p>
                                    </div>

                                    <span
                                      className={`mt-1 h-2.5 w-2.5 rounded-full ${style.dot}`}
                                    />
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-400">
                              No booking in this slot.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-lg font-semibold text-slate-950">
                      {currentDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-sm">
                      Pick a month, year, or exact day.
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    <Select
                      value={String(month)}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger
                        aria-label="Select month"
                        className="h-9 w-32 rounded-lg bg-white text-sm"
                      >
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTH_OPTIONS.map((monthOption) => (
                          <SelectItem
                            key={monthOption.value}
                            value={monthOption.value}
                          >
                            {monthOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(year)}
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger
                        aria-label="Select year"
                        className="h-9 w-24 rounded-lg bg-white text-sm"
                      >
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((yearOption) => (
                          <SelectItem
                            key={yearOption}
                            value={String(yearOption)}
                          >
                            {yearOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(event) => handleJumpToDate(event.target.value)}
                      className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                      aria-label="Jump to day"
                    />

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={goToPreviousMonth}
                        className="h-9 w-9 rounded-lg bg-white"
                        title="Previous month"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={goToNextMonth}
                        className="h-9 w-9 rounded-lg bg-white"
                        title="Next month"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="min-w-[660px]">
                  <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {calendarDays.map((calendarDay) => {
                      const dateKey = formatDateKey(calendarDay.date);
                      const dayBookings = getDayBookings(dateKey);
                      const info = getDayInfo(dateKey);
                      const isToday = dateKey === todayKey;
                      const isSelected = dateKey === selectedDate;

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => setSelectedDate(dateKey)}
                          className={`relative min-h-28 border-b border-r border-slate-200 p-2 pt-10 text-left transition ${
                            calendarDay.current
                              ? "bg-white hover:bg-slate-50"
                              : "bg-slate-50/70 text-slate-300"
                          } ${
                            isSelected
                              ? "bg-blue-50 ring-2 ring-inset ring-blue-500"
                              : ""
                          }`}
                        >
                          <span
                            className={getDayNumberClass({
                              isSelected,
                              isToday,
                              isCurrentMonth: calendarDay.current,
                            })}
                          >
                            {calendarDay.day}
                          </span>

                          {calendarDay.current && (
                            <span
                              className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRiskClass(
                                info.count,
                                info.capacity,
                              )}`}
                            >
                              {info.count}/{info.capacity}
                            </span>
                          )}

                          <div className="space-y-1 overflow-hidden">
                            {isLoadingCalendarBookings &&
                            calendarDay.current ? (
                              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-400">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Loading
                              </div>
                            ) : (
                              dayBookings.slice(0, 2).map((booking) => {
                                const style = getServiceStyle(booking.service);

                                return (
                                  <div
                                    key={booking.id}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openBooking(booking.id);
                                    }}
                                    className={`truncate rounded-lg border px-2 py-1 text-[10px] font-medium ${style.event}`}
                                  >
                                    {booking.schedule?.time ?? "--"}{" "}
                                    {normalizeServiceNameFromValue(
                                      booking.service,
                                    )}
                                  </div>
                                );
                              })
                            )}

                            {dayBookings.length > 2 && (
                              <div className="px-1 text-[10px] font-medium text-slate-400">
                                +{dayBookings.length - 2} more
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <aside className="min-w-0">
              <Card className="flex max-h-[720px] flex-col overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="shrink-0 bg-slate-950 px-4 py-4 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardDescription className="text-slate-300">
                        Selected Schedule
                      </CardDescription>
                      <CardTitle className="mt-1 text-lg">
                        {selectedDateLabel}
                      </CardTitle>
                    </div>

                    <Badge
                      variant="outline"
                      className="border-white/20 bg-white/10 text-white"
                    >
                      {selectedDayInfo.count}/{selectedDayInfo.capacity}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-3">
                  <div className="grid shrink-0 grid-cols-2 gap-2">
                    <AdminMetric
                      icon={<CalendarDays className="h-3.5 w-3.5" />}
                      label="Bookings"
                      value={selectedDayInfo.count}
                    />

                    <AdminMetric
                      icon={<ShieldCheck className="h-3.5 w-3.5" />}
                      label="Capacity"
                      value={`${selectedDayInfo.remaining} open`}
                    />

                    <AdminMetric
                      icon={<Wrench className="h-3.5 w-3.5" />}
                      label="Workload"
                      value={getRiskLabel(
                        selectedDayInfo.count,
                        selectedDayInfo.capacity,
                      )}
                    />

                    <AdminMetric
                      icon={<Sparkles className="h-3.5 w-3.5" />}
                      label="Top Service"
                      value={mostCommonSelectedService}
                    />
                  </div>

                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                    {selectedDayBookings.length > 0 ? (
                      selectedDayBookings.map((booking, index) => {
                        const style = getServiceStyle(booking.service);
                        const slotPosition = index + 1;
                        const cleanersCount = getOptionalCount(
                          booking.cleaners,
                        );
                        const equipmentCount = getOptionalCount(
                          booking.equipments ?? booking.equipment,
                        );
                        const resourceCount = getOptionalCount(
                          booking.resources,
                        );

                        return (
                          <div
                            key={booking.id}
                            className={`rounded-2xl border p-3 text-left shadow-sm ${style.panel}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold">
                                  {normalizeServiceNameFromValue(
                                    booking.service,
                                  )}
                                </h3>
                                <p className="mt-1 text-xs opacity-80">
                                  Booking ID: {getShortBookingId(booking.id)}
                                </p>
                              </div>

                              <span
                                className={`mt-1 h-2.5 w-2.5 rounded-full ${style.dot}`}
                              />
                            </div>

                            <div className="mt-3 grid gap-2">
                              <DetailRow
                                icon={<Clock3 className="h-3.5 w-3.5" />}
                                label="Schedule"
                                value={`${booking.schedule?.time ?? "--"} · Slot ${slotPosition}/${selectedDayInfo.count}`}
                              />

                              <DetailRow
                                icon={<UserRound className="h-3.5 w-3.5" />}
                                label="Customer"
                                value={getCustomerName(booking)}
                              />

                              <DetailRow
                                icon={<MapPin className="h-3.5 w-3.5" />}
                                label="Address"
                                value={booking.address ?? "Not provided"}
                              />

                              <DetailRow
                                icon={
                                  <CircleDollarSign className="h-3.5 w-3.5" />
                                }
                                label="Estimated Total"
                                value={formatMoney(booking.totalPrice)}
                              />
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-white/70 px-3 py-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Booking Status
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-950">
                                  {formatStatusLabel(booking.status)}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white/70 px-3 py-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Review Status
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-950">
                                  {formatStatusLabel(booking.reviewStatus)}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white/70 px-3 py-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Payment
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-950">
                                  {formatStatusLabel(booking.paymentStatus)}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white/70 px-3 py-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Dirty Scale
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-950">
                                  {booking.dirtyScale
                                    ? `${booking.dirtyScale}/5`
                                    : "Not provided"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2">
                              <div className="rounded-xl border bg-white/70 px-2 py-2 text-center">
                                <UsersRound className="mx-auto h-4 w-4 text-slate-500" />
                                <p className="mt-1 text-[10px] text-slate-500">
                                  Cleaners
                                </p>
                                <p className="text-xs font-bold text-slate-950">
                                  {cleanersCount}
                                </p>
                              </div>

                              <div className="rounded-xl border bg-white/70 px-2 py-2 text-center">
                                <Wrench className="mx-auto h-4 w-4 text-slate-500" />
                                <p className="mt-1 text-[10px] text-slate-500">
                                  Equipment
                                </p>
                                <p className="text-xs font-bold text-slate-950">
                                  {equipmentCount}
                                </p>
                              </div>

                              <div className="rounded-xl border bg-white/70 px-2 py-2 text-center">
                                <Package className="mx-auto h-4 w-4 text-slate-500" />
                                <p className="mt-1 text-[10px] text-slate-500">
                                  Resources
                                </p>
                                <p className="text-xs font-bold text-slate-950">
                                  {resourceCount}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => openBooking(booking.id)}
                                className="h-9 flex-1 rounded-xl bg-slate-950 text-xs text-white hover:bg-slate-800"
                              >
                                View Details
                              </Button>

                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openBooking(booking.id)}
                                className="h-9 flex-1 rounded-xl bg-white text-xs"
                              >
                                Manage
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <Sparkles className="mx-auto h-7 w-7 text-slate-400" />
                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No bookings on this day.
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Select another day or create a new booking.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}