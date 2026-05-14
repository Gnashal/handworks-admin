"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  isSameDay,
} from "date-fns";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCcw,
  Route,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OccupiedSlot = {
  bookingID?: string;
  bookingId?: string;
  cleanersNeeded?: number;
  durationHours?: number;
  endSched: string;
  isFullyOccupied?: boolean;
  startSched: string;
  usedCleaners?: number;
};

type BookingSlotsResponse = {
  message?: string;
  notEnoughCleaners?: boolean;
  occupiedSlots?: OccupiedSlot[];
  totalActiveCleaners?: number;
};

type NormalizedBookingSlotsResponse = {
  message: string;
  notEnoughCleaners: boolean;
  occupiedSlots: OccupiedSlot[];
  totalActiveCleaners: number;
};

type SelectedSchedule = {
  newStartSched: string;
  newEndSched: string;
};

type SlotStatus =
  | "available"
  | "selected"
  | "current"
  | "occupied"
  | "padding"
  | "past"
  | "outside-hours";

interface RescheduleBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  customerId: string;
  quoteId?: string;
  currentStartSched: string;
  currentEndSched: string;
  onRescheduled?: (schedule: SelectedSchedule) => void;
}

const SLOT_INTERVAL_MINUTES = 30;
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 20;

function normalizeSlotsData(
  data: BookingSlotsResponse | null,
): NormalizedBookingSlotsResponse {
  return {
    message: data?.message ?? "",
    notEnoughCleaners: Boolean(data?.notEnoughCleaners),
    occupiedSlots: Array.isArray(data?.occupiedSlots)
      ? data.occupiedSlots
      : [],
    totalActiveCleaners:
      typeof data?.totalActiveCleaners === "number"
        ? data.totalActiveCleaners
        : 0,
  };
}

function toDateInputValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return format(new Date(), "yyyy-MM-dd");
  }

  return format(date, "yyyy-MM-dd");
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function buildDateTime(dateValue: string, hours: number, minutes: number) {
  const date = parseDateInput(dateValue);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatSlotLabel(date: Date) {
  return format(date, "h:mm a");
}

function getSlotKey(date: Date) {
  return format(date, "HH:mm");
}

function generateTimeSlots(dateValue: string) {
  const slots: Date[] = [];

  const start = buildDateTime(dateValue, BUSINESS_START_HOUR, 0);
  const end = buildDateTime(dateValue, BUSINESS_END_HOUR, 0);

  let cursor = start;

  while (cursor <= end) {
    slots.push(cursor);
    cursor = addMinutes(cursor, SLOT_INTERVAL_MINUTES);
  }

  return slots;
}

function getSlotBookingId(slot: OccupiedSlot) {
  return slot.bookingID || slot.bookingId || "";
}

function isTravelPaddingSlot(slot: OccupiedSlot) {
  return !getSlotBookingId(slot);
}

function isValidDate(value: Date) {
  return !Number.isNaN(value.getTime());
}

function intervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
) {
  return startA < endB && endA > startB;
}

function getOccupiedSlotRange(slot: OccupiedSlot) {
  const start = new Date(slot.startSched);
  const end = new Date(slot.endSched);

  if (!isValidDate(start) || !isValidDate(end)) {
    return null;
  }

  return { start, end };
}

function getDurationMinutes(startSched: string, endSched: string) {
  const start = new Date(startSched);
  const end = new Date(endSched);

  if (!isValidDate(start) || !isValidDate(end)) {
    return 240;
  }

  const duration = differenceInMinutes(end, start);

  return duration > 0 ? duration : 240;
}

function getDurationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) {
    return `${remainingMinutes} minutes`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function getMinimumBookableDateValue(now: Date) {
  const todayEnd = new Date(now);
  todayEnd.setHours(BUSINESS_END_HOUR, 0, 0, 0);

  if (now >= todayEnd) {
    return format(addDays(now, 1), "yyyy-MM-dd");
  }

  return format(now, "yyyy-MM-dd");
}

function isDateBeforeMinimum(dateValue: string, minimumDateValue: string) {
  const selectedDate = parseDateInput(dateValue);
  const minimumDate = parseDateInput(minimumDateValue);

  selectedDate.setHours(0, 0, 0, 0);
  minimumDate.setHours(0, 0, 0, 0);

  return selectedDate < minimumDate;
}

function isPastTimeSlot(slotStart: Date, now: Date) {
  return isSameDay(slotStart, now) && slotStart <= now;
}

function isSlotInsideRange(slotStart: Date, rangeStart: Date, rangeEnd: Date) {
  return slotStart >= rangeStart && slotStart < rangeEnd;
}

function getSlotStatusClass(status: SlotStatus) {
  switch (status) {
    case "selected":
      return "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-500";
    case "current":
      return "cursor-not-allowed border-violet-500 bg-violet-500 text-white opacity-90";
    case "occupied":
      return "cursor-not-allowed border-red-200 bg-red-50 text-red-700 opacity-80";
    case "padding":
      return "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-700 opacity-80";
    case "past":
      return "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-75";
    case "outside-hours":
      return "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-75";
    case "available":
    default:
      return "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50";
  }
}

function getSlotStatusLabel(status: SlotStatus) {
  switch (status) {
    case "selected":
      return "Selected";
    case "current":
      return "Current";
    case "occupied":
      return "Occupied";
    case "padding":
      return "Travel Padding";
    case "past":
      return "Unavailable";
    case "outside-hours":
      return "Unavailable";
    case "available":
    default:
      return "Available";
  }
}

function getSlotBadgeClass(status: SlotStatus) {
  switch (status) {
    case "selected":
      return "text-white";
    case "current":
      return "text-white";
    case "occupied":
      return "text-red-700";
    case "padding":
      return "text-amber-700";
    case "past":
      return "text-slate-400";
    case "outside-hours":
      return "text-slate-400";
    case "available":
    default:
      return "text-green-700";
  }
}

export function RescheduleBookingDialog({
  open,
  onOpenChange,
  bookingId,
  customerId,
  quoteId,
  currentStartSched,
  currentEndSched,
  onRescheduled,
}: RescheduleBookingDialogProps) {
  const { getToken } = useAuth();

  const durationMinutes = React.useMemo(
    () => getDurationMinutes(currentStartSched, currentEndSched),
    [currentStartSched, currentEndSched],
  );

  const [nowSnapshot, setNowSnapshot] = React.useState(() => new Date());

  const minimumDateValue = React.useMemo(
    () => getMinimumBookableDateValue(nowSnapshot),
    [nowSnapshot],
  );

  const [dateValue, setDateValue] = React.useState(() => {
    const currentDateValue = toDateInputValue(currentStartSched);
    const minimumValue = getMinimumBookableDateValue(new Date());

    return isDateBeforeMinimum(currentDateValue, minimumValue)
      ? minimumValue
      : currentDateValue;
  });

  const [selectedStart, setSelectedStart] = React.useState<Date | null>(null);
  const [slotsData, setSlotsData] =
    React.useState<NormalizedBookingSlotsResponse>(() =>
      normalizeSlotsData(null),
    );
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const currentStart = React.useMemo(
    () => new Date(currentStartSched),
    [currentStartSched],
  );
  const currentEnd = React.useMemo(
    () => new Date(currentEndSched),
    [currentEndSched],
  );

  const slots = React.useMemo(() => generateTimeSlots(dateValue), [dateValue]);

  const selectedEnd = React.useMemo(() => {
    if (!selectedStart) return null;

    return addMinutes(selectedStart, durationMinutes);
  }, [durationMinutes, selectedStart]);

  React.useEffect(() => {
    if (!open) return;

    const now = new Date();
    const minimumValue = getMinimumBookableDateValue(now);
    const currentDateValue = toDateInputValue(currentStartSched);

    setNowSnapshot(now);
    setSlotsData(normalizeSlotsData(null));
    setSlotsError(null);
    setDateValue(
      isDateBeforeMinimum(currentDateValue, minimumValue)
        ? minimumValue
        : currentDateValue,
    );
    setSelectedStart(null);
  }, [currentStartSched, open]);

  React.useEffect(() => {
    if (!open) return;

    if (isDateBeforeMinimum(dateValue, minimumDateValue)) {
      setDateValue(minimumDateValue);
      setSelectedStart(null);
    }
  }, [dateValue, minimumDateValue, open]);

  React.useEffect(() => {
    if (!open || !customerId || !dateValue) return;

    const controller = new AbortController();
    let ignore = false;

    async function fetchSlots() {
      setIsLoadingSlots(true);
      setSlotsError(null);

      try {
        const token = await getToken();

        const params = new URLSearchParams({
          date: dateValue,
          customerId,
        });

        if (quoteId) {
          params.append("quoteId", quoteId);
        }

        const res = await fetch(`/api/booking/fetchSlots?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load booking slots");
        }

        if (!ignore) {
          setSlotsData(normalizeSlotsData(data));
        }
      } catch (error) {
        if (controller.signal.aborted || ignore) {
          return;
        }

        setSlotsData(normalizeSlotsData(null));
        setSlotsError(
          error instanceof Error
            ? error.message
            : "Failed to load booking slots",
        );
      } finally {
        if (!controller.signal.aborted && !ignore) {
          setIsLoadingSlots(false);
        }
      }
    }

    fetchSlots();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [customerId, dateValue, getToken, open, quoteId]);

  const getSlotMeta = React.useCallback(
    (slotStart: Date) => {
      const slotEnd = addMinutes(slotStart, durationMinutes);
      const businessEnd = buildDateTime(dateValue, BUSINESS_END_HOUR, 0);
      const occupiedSlots = Array.isArray(slotsData.occupiedSlots)
        ? slotsData.occupiedSlots
        : [];

      if (
        isValidDate(currentStart) &&
        isValidDate(currentEnd) &&
        isSameDay(slotStart, currentStart) &&
        isSlotInsideRange(slotStart, currentStart, currentEnd)
      ) {
        return {
          disabled: true,
          status: "current" as SlotStatus,
          blockingSlot: null as OccupiedSlot | null,
        };
      }

      if (slotEnd > businessEnd) {
        return {
          disabled: true,
          status: "outside-hours" as SlotStatus,
          blockingSlot: null as OccupiedSlot | null,
        };
      }

      if (isPastTimeSlot(slotStart, nowSnapshot)) {
        return {
          disabled: true,
          status: "past" as SlotStatus,
          blockingSlot: null as OccupiedSlot | null,
        };
      }

      const blockingSlot =
        occupiedSlots.find((occupiedSlot) => {
          const range = getOccupiedSlotRange(occupiedSlot);

          if (!range) return false;

          const occupiedBookingId = getSlotBookingId(occupiedSlot);

          if (occupiedBookingId && occupiedBookingId === bookingId) {
            return false;
          }

          return intervalsOverlap(slotStart, slotEnd, range.start, range.end);
        }) ?? null;

      if (blockingSlot) {
        return {
          disabled: true,
          status: isTravelPaddingSlot(blockingSlot)
            ? ("padding" as SlotStatus)
            : ("occupied" as SlotStatus),
          blockingSlot,
        };
      }

      if (
        selectedStart &&
        selectedEnd &&
        isSlotInsideRange(slotStart, selectedStart, selectedEnd)
      ) {
        return {
          disabled: false,
          status: "selected" as SlotStatus,
          blockingSlot: null as OccupiedSlot | null,
        };
      }

      return {
        disabled: false,
        status: "available" as SlotStatus,
        blockingSlot: null as OccupiedSlot | null,
      };
    },
    [
      bookingId,
      currentEnd,
      currentStart,
      dateValue,
      durationMinutes,
      nowSnapshot,
      selectedEnd,
      selectedStart,
      slotsData.occupiedSlots,
    ],
  );

  const canSubmit = !!selectedStart && !!selectedEnd && !isSubmitting;

  const handleSubmit = async () => {
    if (!selectedStart || !selectedEnd) {
      toast.error("Select an available schedule first.");
      return;
    }

    const businessEnd = buildDateTime(dateValue, BUSINESS_END_HOUR, 0);

    if (selectedEnd > businessEnd) {
      toast.error("Selected schedule cannot end past 8:00 PM.");
      return;
    }

    if (isDateBeforeMinimum(dateValue, minimumDateValue)) {
      toast.error("You cannot reschedule to a past date.");
      return;
    }

    if (isPastTimeSlot(selectedStart, nowSnapshot)) {
      toast.error("You cannot reschedule to a time that has already passed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getToken();

      const payload = {
        bookingId,
        newStartSched: selectedStart.toISOString(),
        newEndSched: selectedEnd.toISOString(),
      };

      const res = await fetch("/api/booking/reschedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to reschedule booking");
      }

      toast.success("Booking rescheduled successfully.");

      onRescheduled?.({
        newStartSched: payload.newStartSched,
        newEndSched: payload.newEndSched,
      });

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reschedule booking",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!flex h-[92vh] !w-[96vw] !max-w-[1280px] flex-col overflow-hidden p-0 sm:!max-w-[1280px]">
        <DialogHeader className="shrink-0 border-b bg-linear-to-r from-sky-50 via-white to-blue-50 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <RefreshCcw className="h-5 w-5 text-blue-600" />
                Reschedule Booking
              </DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a new date and available start time for this booking.
              </p>
            </div>

            <Badge
              variant="outline"
              className="border-blue-200 bg-white text-blue-700"
            >
              {getDurationLabel(durationMinutes)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-5 overflow-y-auto border-b bg-slate-50/70 p-6 md:border-b-0 md:border-r">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                Select Date
              </div>

              <Label htmlFor="reschedule-date" className="text-xs">
                Date
              </Label>
              <Input
                id="reschedule-date"
                type="date"
                value={dateValue}
                min={minimumDateValue}
                onChange={(event) => {
                  const nextDateValue = event.target.value;

                  if (isDateBeforeMinimum(nextDateValue, minimumDateValue)) {
                    setDateValue(minimumDateValue);
                    setSelectedStart(null);
                    toast.error("You cannot select a past date.");
                    return;
                  }

                  setDateValue(nextDateValue);
                  setSelectedStart(null);
                }}
                className="mt-1 bg-white"
              />
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-blue-600" />
                Current Schedule
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Start
                  </p>
                  <p className="mt-0.5 font-semibold">
                    {format(currentStart, "MMM dd, yyyy")}
                  </p>
                  <p className="text-muted-foreground">
                    {format(currentStart, "hh:mm a")}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    End
                  </p>
                  <p className="mt-0.5 font-semibold">
                    {format(currentEnd, "MMM dd, yyyy")}
                  </p>
                  <p className="text-muted-foreground">
                    {format(currentEnd, "hh:mm a")}
                  </p>
                </div>
              </div>
            </div>

            {selectedStart && selectedEnd ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold">New Schedule</p>
                <p className="mt-2">
                  {format(selectedStart, "MMM dd, yyyy")} ·{" "}
                  {format(selectedStart, "hh:mm a")} -{" "}
                  {format(selectedEnd, "hh:mm a")}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 border-b px-6 py-4">
              <div>
                <h3 className="text-base font-semibold">
                  Select Schedule ({getDurationLabel(durationMinutes)})
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Occupied and travel-padded slots cannot be selected.
                </p>
              </div>

              {slotsData.notEnoughCleaners ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Cleaner availability may be limited for this date. The
                    backend will still validate the final reschedule request.
                  </p>
                </div>
              ) : null}

              {slotsError ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{slotsError}</p>
                </div>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              {isLoadingSlots ? (
                <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading booking slots...
                </div>
              ) : (
                <div className="divide-y overflow-hidden rounded-2xl border bg-white">
                  {slots.map((slot) => {
                    const meta = getSlotMeta(slot);
                    const slotKey = getSlotKey(slot);
                    const slotEnd = addMinutes(slot, durationMinutes);
                    const status = meta.status;
                    const isSelectedBlock = status === "selected";
                    const isCurrentBlock = status === "current";
                    const isSelectedStart =
                      !!selectedStart &&
                      slot.getTime() === selectedStart.getTime();
                    const isCurrentStart =
                      isValidDate(currentStart) &&
                      slot.getTime() === currentStart.getTime();

                    const helperText =
                      isSelectedBlock && selectedEnd
                        ? isSelectedStart
                          ? `Ends ${formatSlotLabel(selectedEnd)}`
                          : "Part of selected schedule"
                        : isCurrentBlock
                          ? isCurrentStart
                            ? `Ends ${formatSlotLabel(currentEnd)}`
                            : "Current booking schedule"
                          : status === "outside-hours"
                            ? "Ends past 8:00 PM"
                            : `Ends ${formatSlotLabel(slotEnd)}`;

                    return (
                      <button
                        key={slotKey}
                        type="button"
                        disabled={meta.disabled}
                        onClick={() => {
                          if (meta.disabled) return;
                          setSelectedStart(slot);
                        }}
                        className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition ${getSlotStatusClass(
                          status,
                        )}`}
                      >
                        <div>
                          <p className="font-medium">{formatSlotLabel(slot)}</p>
                          <p className="mt-0.5 text-xs opacity-80">
                            {helperText}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {status === "padding" ? (
                            <Route className="h-3.5 w-3.5 text-amber-600" />
                          ) : null}

                          {status === "selected" || status === "current" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          ) : null}

                          <span
                            className={`text-xs font-semibold ${getSlotBadgeClass(
                              status,
                            )}`}
                          >
                            {getSlotStatusLabel(status)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t bg-white px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-xs text-muted-foreground">
                  The selected slot will keep the same booking duration and
                  update both start and end schedule.
                </p>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                    Save Reschedule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}