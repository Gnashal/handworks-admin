"use client";

import { useState } from "react";
import {
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { IFetchBookingTrendsResponse } from "@/types/admin";

interface ServiceDynamicsProps {
  bookingTrendsData: IFetchBookingTrendsResponse;
}

export default function ServiceDynamics({
  bookingTrendsData: { weeklyData, monthlyData },
}: ServiceDynamicsProps) {
  const [mode, setMode] = useState<"week" | "month">("week");

  const data = mode === "week" ? weeklyData : monthlyData;

  return (
    <Card className="w-full shadow-sm border col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bookings Trend</CardTitle>

        {/* TOGGLE */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === "week" ? "default" : "outline"}
            onClick={() => setMode("week")}
          >
            Week
          </Button>

          <Button
            size="sm"
            variant={mode === "month" ? "default" : "outline"}
            onClick={() => setMode("month")}
          >
            Month
          </Button>
        </div>
      </CardHeader>

      <CardContent className="h-72 pt-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value} bookings`, ""]}
            />

            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fill="url(#colorBookings)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
