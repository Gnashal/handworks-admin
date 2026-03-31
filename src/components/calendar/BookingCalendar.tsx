"use client";

import { useState } from "react";
import { mockBookings } from "@/data/mockBookings";

const TIME_SLOTS = [
  "08:00 AM",
  "10:00 AM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarDay = {
  day: number;
  current: boolean;
  date: Date;
};

// ✅ NEW TYPE (fixes all 'any' errors)
type CalendarBooking = {
  id: string;
  service: string;
  schedule?: {
    date: string;
    time: string;
  };
  customer?: {
    firstName: string;
    lastName: string;
  };
};

const SERVICE_COLORS: Record<string, string> = {
  "General Cleaning": "bg-green-100 text-green-800 border-green-200",
  "Deep Cleaning": "bg-blue-100 text-blue-800 border-blue-200",
  "Sofa Cleaning": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Mattress Cleaning": "bg-purple-100 text-purple-800 border-purple-200",
};

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2));
  const [selectedDate, setSelectedDate] = useState("2026-03-24");

  // ✅ typed bookings
  const bookings: CalendarBooking[] = mockBookings;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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
      const nextDay: number =
        days.length - (firstDay + daysInMonth) + 1;

      days.push({
        day: nextDay,
        current: false,
        date: new Date(year, month + 1, nextDay),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  const getDayBookings = (date: string) => {
    return bookings.filter(
      (b: CalendarBooking) => b.schedule?.date === date
    );
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
    return (
      SERVICE_COLORS[service] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const selectedDayBookings = bookings.filter(
    (b: CalendarBooking) => b.schedule?.date === selectedDate
  );

  const grouped = TIME_SLOTS.map((slot) => ({
    slot,
    items: selectedDayBookings.filter(
      (b: CalendarBooking) => b.schedule?.time === slot
    ),
  }));

  return (
    <div className="p-6 flex gap-6">
      {/* MAIN */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Calendar</h2>
            <p className="text-sm text-gray-400">
              Dashboard / Calendar
            </p>
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
              onClick={() =>
                setCurrentDate(new Date(year, month - 1))
              }
              className="px-3 py-1 border rounded-md"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentDate(new Date(year, month + 1))
              }
              className="px-3 py-1 border rounded-md"
            >
              ›
            </button>
          </div>
        </div>

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

              const isDisabled =
                !d.current || info.isFull;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedDate(dateString);
                    }
                  }}
                  className={`h-28 p-2 border-r border-b last:border-r-0
                    ${
                      selectedDate === dateString
                        ? "bg-blue-50"
                        : ""
                    }
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
                        d.current
                          ? "text-gray-800"
                          : "text-gray-300"
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
                  <div className="space-y-[2px] overflow-hidden">
                    {dayBookings.slice(0, 2).map((b: CalendarBooking) => (
                      <div
                        key={b.id}
                        className={`text-[10px] px-1 py-[2px] rounded border truncate ${getServiceColor(
                          b.service
                        )}`}
                      >
                        {b.schedule?.time} {b.service}
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
          <p className="text-sm text-gray-400">
            Details Schedule
          </p>
          <h2 className="text-sm font-semibold">
            {selectedDate}
          </h2>
        </div>

        <div className="space-y-4">
          {grouped.map(({ slot, items }) =>
            items.length > 0
              ? items.map((booking, index) => (
                  <div
                    key={booking.id + index}
                    className={`rounded-xl p-4 border ${getServiceColor(
                      booking.service
                    )}`}
                  >
                    <h3 className="text-sm font-semibold">
                      {booking.service}
                    </h3>

                    <div className="mt-2 text-xs space-y-1">
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {slot}
                      </p>
                      <p>
                        <span className="font-medium">Client:</span>{" "}
                        {booking.customer?.firstName}{" "}
                        {booking.customer?.lastName}
                      </p>
                    </div>
                  </div>
                ))
              : null
          )}
        </div>
      </div>
    </div>
  );
}