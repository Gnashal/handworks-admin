"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number; // percentage
  trend?: "up" | "down";
}
export default function MetricCard({
  data,
  icon,
  className,
}: {
  data: MetricCardData;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className ? className : "w-full h-45"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{data.title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{data.value}</div>
          {data.change !== undefined && (
            <p className="mt-1 flex items-center gap-1 text-xs">
              {data.trend === "down" ? (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              ) : (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              )}
              <span
                className={
                  (data.trend === "down" ? "text-red-500" : "text-green-500") +
                  " text-md"
                }
              >
                {data.change}%
              </span>
              <span className="text-muted-foreground"> since last month</span>
            </p>
          )}
        </div>

        {["Bookings", "Employees"].includes(data.title) && (
          <Link
            href={data.title === "Bookings" ? "/bookings" : "/employees"}
            className="text-blue-500 hover:underline text-sm flex items-center gap-1"
          >
            <span>
              {data.title === "Bookings" ? "View Bookings" : "View Employees"}
            </span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
