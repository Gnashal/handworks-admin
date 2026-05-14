"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";

interface Service {
  id: number;
  name: string;
  bookings: number;
}

interface TopServicesCardProps {
  services: Service[];
}

export default function TopServicesCard({ services }: TopServicesCardProps) {
  const maxBookings = Math.max(
    ...services.map((service) => service.bookings),
    1,
  );

  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Top Services
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Highest booked services for the current period.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
          <TrendingUp className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {services.map((service, index) => {
          const width = Math.max((service.bookings / maxBookings) * 100, 8);

          return (
            <div key={service.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    #{index + 1}
                  </span>

                  <span className="truncate font-medium text-slate-900">
                    {service.name}
                  </span>
                </div>

                <span className="shrink-0 font-semibold text-slate-950">
                  {service.bookings}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 to-green-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}

        {services.length === 0 && (
          <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-sm text-muted-foreground">
            No service data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}