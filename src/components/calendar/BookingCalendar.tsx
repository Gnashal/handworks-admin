"use client";

import { useState } from "react";
import {
  normalizeServiceNameFromValue,
  normalizeServiceType,
} from "@/lib/normalize";
import {
  useBookingsTodayQuery,
  useCalendarBookingsQuery,
} from "@/queries/bookingQueries";
import type { ICalendarBooking, IMainServiceType } from "@/types/booking";

const TIME_SLOTS = ["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarDay = {
  day: number;
  current: boolean;
  date: Date;
};

const SERVICE_COLORS: Record<IMainServiceType, string> = {
  GENERAL_CLEANING: "bg-emerald-100 text-emerald-800 border-emerald-200",
  COUCH: "bg-amber-100 text-amber-800 border-amber-200",
  MATTRESS: "bg-violet-100 text-violet-800 border-violet-200",
  CAR: "bg-sky-100 text-sky-800 border-sky-200",
  POST: "bg-orange-100 text-orange-800 border-orange-200",
  SERVICE_TYPE_UNSPECIFIED: "bg-slate-100 text-slate-700 border-slate-200",
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

export default function BookingCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0],
  );
  const { data: bookingsTodayData, isLoading: isLoadingBookingsToday } =
    useBookingsTodayQuery();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const {
    data: calendarBookingsData,
    isLoading: isLoadingCalendarBookings,
    error: calendarBookingsError,
  } = useCalendarBookingsQuery(monthKey);

  const bookings: ICalendarBooking[] = calendarBookingsData?.bookings ?? [];

  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        current: false,
        date: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        current: true,
        date: new Date(year, month, i),
      });
    }

    // next month
    while (days.length < 42) {
      const nextDay: number = days.length - (firstDay + daysInMonth) + 1;

      days.push({
        day: nextDay,
        current: false,
        date: new Date(year, month + 1, nextDay),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const getDayBookings = (date: string) => {
    return bookings.filter((b: ICalendarBooking) => b.schedule?.date === date);
  };

  const getDayInfo = (date: string) => {
    const count = getDayBookings(date).length;
    const capacity = 5;

    return {
      count,
      capacity,
      isFull: count >= capacity,
    };
  };

  const getServiceColor = (service: string) => {
    const normalizedType = normalizeServiceType(service);

    if (normalizedType) {
      return SERVICE_COLORS[normalizedType];
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const todayBookingsRaw = bookingsTodayData?.bookings;
  const todayBookings = Array.isArray(todayBookingsRaw)
    ? todayBookingsRaw
    : todayBookingsRaw
      ? [todayBookingsRaw]
      : [];

  const scheduleSlots = Array.from(
    new Set([...TIME_SLOTS, ...todayBookings.map((booking) => booking.time)]),
  ).sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));

  const grouped = scheduleSlots.map((slot) => ({
    slot,
    items: todayBookings.filter((booking) => booking.time === slot),
  }));

  return (
    <div className="p-6 flex gap-6">
      {/* MAIN */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Calendar</h2>
            <p className="text-sm text-gray-400">Dashboard / Calendar</p>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100">
              Filter
            </button>
            <button className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100">
              Month
            </button>
            <button className="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
              + New Booking
            </button>
          </div>
        </div>

        {/* MONTH */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="px-3 py-1 border rounded-md"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="px-3 py-1 border rounded-md"
            >
              ›
            </button>
          </div>
        </div>

        {calendarBookingsError && (
          <p className="mb-4 text-xs text-red-500">
            Failed to load calendar bookings.
          </p>
        )}

        {isLoadingCalendarBookings && (
          <p className="mb-4 text-xs text-gray-500">Loading calendar...</p>
        )}

        {/* CALENDAR */}
        <div className="border rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm text-gray-500 py-2 border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((d, index) => {
              const dateString = formatDate(d.date);
              const info = getDayInfo(dateString);
              const dayBookings = getDayBookings(dateString);

              const isDisabled = !d.current || info.isFull;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedDate(dateString);
                    }
                  }}
                  className={`h-28 p-2 border-r border-b last:border-r-0
                    ${selectedDate === dateString ? "bg-blue-50" : ""}
                    ${
                      isDisabled
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    }
                  `}
                >
                  {/* HEADER */}
                  <div className="flex justify-between text-xs mb-1">
                    <span
                      className={`font-medium ${
                        d.current ? "text-gray-800" : "text-gray-300"
                      }`}
                    >
                      {d.day}
                    </span>

                    {d.current && (
                      <span
                        className={`text-[11px] ${
                          info.isFull
                            ? "text-red-500"
                            : info.count > 0
                              ? "text-yellow-500"
                              : "text-gray-400"
                        }`}
                      >
                        {info.count}/{info.capacity}
                      </span>
                    )}
                  </div>

                  {/* MINI BOOKINGS */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayBookings.slice(0, 2).map((b: ICalendarBooking) => (
                      <div
                        key={b.id}
                        className={`text-[10px] px-1 py-0.5 rounded border truncate ${getServiceColor(
                          b.service,
                        )}`}
                      >
                        {b.schedule?.time}{" "}
                        {normalizeServiceNameFromValue(b.service)}
                      </div>
                    ))}

                    {dayBookings.length > 2 && (
                      <div className="text-[10px] text-gray-400">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[320px] bg-white rounded-xl shadow-sm border p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-400">Details Schedule</p>
          <h2 className="text-sm font-semibold">
            {new Date().toLocaleDateString("default", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
        </div>

        <div className="space-y-4">
          {isLoadingBookingsToday && (
            <p className="text-xs text-gray-500">
              Loading today&apos;s bookings...
            </p>
          )}

          {grouped.map(({ slot, items }) =>
            items.length > 0
              ? items.map((booking, index) => (
                  <div
                    key={`${booking.client}-${booking.time}-${index}`}
                    className={`rounded-xl p-4 border ${getServiceColor(
                      booking.service,
                    )}`}
                  >
                    <h3 className="text-sm font-semibold">
                      {normalizeServiceNameFromValue(booking.service)}
                    </h3>

                    <div className="mt-2 text-xs space-y-1">
                      <p>
                        <span className="font-medium">Time:</span> {slot}
                      </p>
                      <p>
                        <span className="font-medium">Client:</span>{" "}
                        {booking.client}
                      </p>
                    </div>
                  </div>
                ))
              : null,
          )}

          {!isLoadingBookingsToday && todayBookings.length === 0 && (
            <p className="text-xs text-gray-500">
              No bookings scheduled for today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
