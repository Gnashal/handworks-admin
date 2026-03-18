"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
}

type Variant = "default" | "info" | "success" | "warning" | "danger";

export default function MetricCard({
  data,
  icon,
  className,
  href,
  variant = "default",
}: {
  data: MetricCardData;
  icon: React.ReactNode;
  className?: string;
  href?: string;
  variant?: Variant;
}) {
  return (
    <Card
      className={clsx(
        "w-full min-h-[140px] flex flex-col justify-between border transition hover:shadow-md",
        {
          "border-blue-200 bg-blue-50/40": variant === "info",
          "border-green-200 bg-green-50/40": variant === "success",
          "border-yellow-200 bg-yellow-50/40": variant === "warning",
          "border-red-200 bg-red-50/40": variant === "danger",
        },
        className
      )}
    >
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-sm font-semibold">
          {data.title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex flex-col justify-between flex-1 pt-2">
        <div>
          {/* VALUE */}
          <div className="text-2xl font-bold">{data.value}</div>

          {/* TREND (fixed height to prevent shifting) */}
          <div className="mt-2 h-5">
            {data.change !== undefined ? (
              <p className="flex items-center gap-1 text-xs">
                {data.trend === "down" && (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                {data.trend === "up" && (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                )}

                <span
                  className={
                    data.trend === "down"
                      ? "text-red-500"
                      : data.trend === "up"
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }
                >
                  {data.change}%
                </span>

                <span className="text-muted-foreground">
                  since last month
                </span>
              </p>
            ) : (
              <span className="opacity-0">placeholder</span>
            )}
          </div>
        </div>

        {/* LINK */}
        {href && (
          <Link
            href={href}
            className="text-muted-foreground hover:text-primary text-xs flex items-center justify-end gap-1 mt-2"
          >
            <span>View</span>
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}