"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TrendingUp } from "lucide-react";

interface Service {
  id: number;
  name: string;
  bookings: number;
}

interface TopServicesCardProps {
  services: Service[];
}

export default function TopServicesCard({
  services,
}: TopServicesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Services</CardTitle>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-3">
              {/* RANK */}
              <span className="text-xs font-bold text-muted-foreground w-5">
                #{index + 1}
              </span>

              <span className="font-medium">{service.name}</span>
            </div>

            <span className="font-semibold">
              {service.bookings}
            </span>
          </div>
        ))}

        {services.length === 0 && (
          <span className="text-sm text-muted-foreground">
            No service data available
          </span>
        )}
      </CardContent>
    </Card>
  );
}