"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowRightIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import CountUp from "react-countup";
import { Badge } from "@/components/ui/badge";

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  todayStat?: string;
}

type Variant = "default" | "info" | "success" | "warning" | "danger";

const variantStyles: Record<
  Variant,
  {
    card: string;
    icon: string;
    accent: string;
    badge: string;
  }
> = {
  default: {
    card: "border-slate-200 bg-white",
    icon: "bg-slate-100 text-slate-700",
    accent: "from-slate-500 to-slate-700",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
  },
  info: {
    card: "border-blue-200/80 bg-linear-to-br from-blue-50/90 via-white to-white",
    icon: "bg-blue-500/10 text-blue-700",
    accent: "from-blue-500 to-sky-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
  },
  success: {
    card: "border-emerald-200/80 bg-linear-to-br from-emerald-50/90 via-white to-white",
    icon: "bg-emerald-500/10 text-emerald-700",
    accent: "from-emerald-500 to-green-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  warning: {
    card: "border-amber-200/80 bg-linear-to-br from-amber-50/90 via-white to-white",
    icon: "bg-amber-500/10 text-amber-700",
    accent: "from-amber-500 to-orange-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  danger: {
    card: "border-red-200/80 bg-linear-to-br from-red-50/90 via-white to-white",
    icon: "bg-red-500/10 text-red-700",
    accent: "from-red-500 to-rose-500",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
};

const AnimatedMetricValue = ({ value }: { value: string | number }) => {
  if (typeof value !== "number") {
    return <>{value}</>;
  }

  const decimalPlaces = Number.isInteger(value) ? 0 : 2;

  return (
    <CountUp
      start={0}
      end={value}
      duration={1.5}
      separator=","
      decimals={decimalPlaces}
      preserveValue
    />
  );
};

export default function MetricCard({
  data,
  icon,
  className,
  href,
  showAlertDot,
  variant = "default",
}: {
  data: MetricCardData;
  icon: React.ReactNode;
  className?: string;
  href?: string;
  showAlertDot?: boolean;
  variant?: Variant;
}) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={clsx(
        "group relative min-h-[170px] overflow-hidden rounded-3xl border shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        styles.card,
        className,
      )}
    >
      <div
        className={clsx(
          "absolute inset-x-0 top-0 h-1 bg-linear-to-r",
          styles.accent,
        )}
      />

      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2 pt-5">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {data.title}
          {showAlertDot ? (
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"
              aria-label="New booking alert"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
            </span>
          ) : null}
        </CardTitle>

        <div
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-105 [&>svg]:h-5 [&>svg]:w-5",
            styles.icon,
          )}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-0">
        <div>
          <div className="text-3xl font-bold tracking-tight text-slate-950">
            <AnimatedMetricValue value={data.value} />
          </div>

          {data.todayStat ? (
            <div className="mt-3">
              <Badge
                variant="outline"
                className={clsx("rounded-full px-2.5 py-1 text-[11px]", styles.badge)}
              >
                <span className="uppercase tracking-wide">{data.todayStat}</span>
              </Badge>
            </div>
          ) : null}

          <div className="mt-3 h-5">
            {data.change !== undefined ? (
              <p className="flex items-center gap-1.5 text-xs">
                {data.trend === "down" && (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
                {data.trend === "up" && (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                )}

                <span
                  className={
                    data.trend === "down"
                      ? "font-semibold text-red-500"
                      : data.trend === "up"
                        ? "font-semibold text-emerald-500"
                        : "font-semibold text-muted-foreground"
                  }
                >
                  {Math.abs(data.change)}%
                </span>

                <span className="text-muted-foreground">since last month</span>
              </p>
            ) : (
              <span className="opacity-0">placeholder</span>
            )}
          </div>
        </div>

        {href ? (
          <Link
            href={href}
            className="inline-flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground transition hover:text-slate-950"
          >
            <span>View details</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}