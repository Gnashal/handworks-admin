"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { IFetchBookingTrendsResponse } from "@/types/admin";

interface ServiceDynamicsProps {
  bookingTrendsData: IFetchBookingTrendsResponse;
}

type ChartPoint = {
  label: string;
  value: number;
};

type DatePreset =
  | "last7"
  | "businessDays"
  | "weekend"
  | "monthly"
  | "last3Months"
  | "last6Months"
  | "year";

const WEEK_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DATE_PRESETS: Array<{
  label: string;
  value: DatePreset;
  helper: string;
}> = [
  {
    label: "Last 7 Days",
    value: "last7",
    helper: "Daily booking movement",
  },
  {
    label: "Business Days",
    value: "businessDays",
    helper: "Monday to Friday only",
  },
  {
    label: "Weekend",
    value: "weekend",
    helper: "Saturday and Sunday only",
  },
  {
    label: "Monthly",
    value: "monthly",
    helper: "Month-by-month view",
  },
  {
    label: "Last 3 Months",
    value: "last3Months",
    helper: "Recent quarter view",
  },
  {
    label: "Last 6 Months",
    value: "last6Months",
    helper: "Half-year movement",
  },
  {
    label: "Year View",
    value: "year",
    helper: "Full available monthly data",
  },
];

const normalizeLabel = (label: string) => {
  const trimmed = label.trim();

  if (!trimmed) return trimmed;

  return trimmed.slice(0, 3);
};

const sortWeeklyData = (data: ChartPoint[]) => {
  return [...data].sort((a, b) => {
    const aIndex = WEEK_ORDER.indexOf(normalizeLabel(a.label));
    const bIndex = WEEK_ORDER.indexOf(normalizeLabel(b.label));

    if (aIndex === -1 || bIndex === -1) {
      return 0;
    }

    return aIndex - bIndex;
  });
};

const getPeakPoint = (data: ChartPoint[]) => {
  if (!data.length) return null;

  return data.reduce((peak, item) => (item.value > peak.value ? item : peak));
};

const getLowestPoint = (data: ChartPoint[]) => {
  if (!data.length) return null;

  return data.reduce((lowest, item) =>
    item.value < lowest.value ? item : lowest,
  );
};

const getMomentum = (data: ChartPoint[]) => {
  if (data.length < 2) {
    return {
      label: "Not enough data",
      value: 0,
      trend: "neutral" as const,
    };
  }

  const half = Math.ceil(data.length / 2);
  const firstHalf = data.slice(0, half);
  const secondHalf = data.slice(half);

  const firstTotal = firstHalf.reduce((sum, item) => sum + item.value, 0);
  const secondTotal = secondHalf.reduce((sum, item) => sum + item.value, 0);

  if (firstTotal === 0 && secondTotal === 0) {
    return {
      label: "No movement",
      value: 0,
      trend: "neutral" as const,
    };
  }

  if (firstTotal === 0 && secondTotal > 0) {
    return {
      label: "Improving",
      value: 100,
      trend: "up" as const,
    };
  }

  const percentage = Math.round(((secondTotal - firstTotal) / firstTotal) * 100);

  if (percentage > 0) {
    return {
      label: "Improving",
      value: percentage,
      trend: "up" as const,
    };
  }

  if (percentage < 0) {
    return {
      label: "Slowing down",
      value: Math.abs(percentage),
      trend: "down" as const,
    };
  }

  return {
    label: "Stable",
    value: 0,
    trend: "neutral" as const,
  };
};

const getPresetData = ({
  preset,
  weeklyData,
  monthlyData,
}: {
  preset: DatePreset;
  weeklyData: ChartPoint[];
  monthlyData: ChartPoint[];
}) => {
  switch (preset) {
    case "businessDays":
      return weeklyData.filter((item) =>
        ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(normalizeLabel(item.label)),
      );

    case "weekend":
      return weeklyData.filter((item) =>
        ["Sat", "Sun"].includes(normalizeLabel(item.label)),
      );

    case "monthly":
      return monthlyData;

    case "last3Months":
      return monthlyData.slice(-3);

    case "last6Months":
      return monthlyData.slice(-6);

    case "year":
      return monthlyData;

    case "last7":
    default:
      return weeklyData;
  }
};

const getInsightMessage = ({
  totalBookings,
  average,
  peak,
  lowest,
  momentum,
  presetLabel,
}: {
  totalBookings: number;
  average: number;
  peak: ChartPoint | null;
  lowest: ChartPoint | null;
  momentum: ReturnType<typeof getMomentum>;
  presetLabel: string;
}) => {
  if (!totalBookings || !peak || !lowest) {
    return `No booking trend data available for ${presetLabel.toLowerCase()} yet.`;
  }

  if (momentum.trend === "up") {
    return `Bookings are improving for ${presetLabel.toLowerCase()}. ${peak.label} has the strongest demand, so prepare cleaner availability around similar peak periods.`;
  }

  if (momentum.trend === "down") {
    return `Bookings are slowing down for ${presetLabel.toLowerCase()}. ${lowest.label} is the weakest point, so review pending bookings, promos, or client follow-ups.`;
  }

  if (peak.value > average * 1.8) {
    return `${peak.label} has a noticeably higher booking load than average. Check cleaner assignments and inventory readiness.`;
  }

  return `Booking volume is fairly stable for ${presetLabel.toLowerCase()}. Keep monitoring peak periods and cleaner capacity.`;
};

function StatPill({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-xs">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold leading-none text-slate-950">
        {value}
      </p>
      {helper ? (
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}

export default function ServiceDynamics({
  bookingTrendsData,
}: ServiceDynamicsProps) {
  const [preset, setPreset] = useState<DatePreset>("last7");
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const weeklyData = sortWeeklyData(bookingTrendsData.weeklyData ?? []);
  const monthlyData = bookingTrendsData.monthlyData ?? [];

  const selectedPreset =
    DATE_PRESETS.find((item) => item.value === preset) ?? DATE_PRESETS[0];

  const data = getPresetData({
    preset,
    weeklyData,
    monthlyData,
  });

  const totalBookings = data.reduce((sum, item) => sum + item.value, 0);
  const average = data.length ? totalBookings / data.length : 0;
  const roundedAverage = Math.round(average * 10) / 10;
  const peak = getPeakPoint(data);
  const lowest = getLowestPoint(data);
  const momentum = getMomentum(data);

  const insightMessage = getInsightMessage({
    totalBookings,
    average,
    peak,
    lowest,
    momentum,
    presetLabel: selectedPreset.label,
  });

  return (
    <Card className="rounded-3xl border-0 bg-transparent shadow-none">
      <CardHeader className="flex flex-col gap-4 px-2 pb-4 pt-1 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-1">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-lg font-semibold">
                Bookings Trend
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {totalBookings.toLocaleString()} total bookings ·{" "}
                {selectedPreset.label}
                {peak ? (
                  <>
                    {" "}
                    · peak at{" "}
                    <span className="font-semibold text-slate-800">
                      {peak.label}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </div>

        <div className="relative shrink-0">
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-[190px] justify-between rounded-xl border-slate-200 bg-white px-4 shadow-sm"
            onClick={() => setShowPresetMenu((prev) => !prev)}
          >
            <span className="text-sm font-medium">{selectedPreset.label}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>

          {showPresetMenu ? (
            <div className="absolute right-0 z-20 mt-2 w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
              {DATE_PRESETS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setPreset(item.value);
                    setShowPresetMenu(false);
                  }}
                  className={
                    preset === item.value
                      ? "flex w-full flex-col items-start rounded-xl bg-slate-950 px-3 py-2.5 text-left text-white"
                      : "flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left hover:bg-slate-50"
                  }
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span
                    className={
                      preset === item.value
                        ? "text-xs text-slate-300"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {item.helper}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-2 pb-2 pt-0">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatPill
            label="Peak"
            value={peak ? peak.label : "--"}
            helper={peak ? `${peak.value} bookings` : "No data"}
          />

          <StatPill
            label="Lowest"
            value={lowest ? lowest.label : "--"}
            helper={lowest ? `${lowest.value} bookings` : "No data"}
          />

          <StatPill
            label="Average"
            value={`${roundedAverage}`}
            helper="bookings / point"
          />

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-xs">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Momentum
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              {momentum.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              ) : momentum.trend === "down" ? (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-slate-500" />
              )}

              <p
                className={
                  momentum.trend === "up"
                    ? "text-lg font-bold leading-none text-emerald-700"
                    : momentum.trend === "down"
                      ? "text-lg font-bold leading-none text-red-700"
                      : "text-lg font-bold leading-none text-slate-950"
                }
              >
                {momentum.label}
              </p>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {momentum.trend === "neutral"
                ? "Compared within this view"
                : `${momentum.value}% compared within this view`}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700">
            <CalendarClock className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">
              Admin Insight
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {insightMessage}
            </p>
          </div>
        </div>

        <div className="h-[285px] w-full">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-sm text-muted-foreground">
              No booking trend data available for {selectedPreset.label}.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 18,
                  right: 24,
                  left: 0,
                  bottom: 4,
                }}
              >
                <defs>
                  <linearGradient
                    id={`bookingTrendGradient-${preset}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  dy={10}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  allowDecimals={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                />

                {average > 0 ? (
                  <ReferenceLine
                    y={roundedAverage}
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                    label={{
                      value: `Avg ${roundedAverage}`,
                      position: "insideTopRight",
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />
                ) : null}

                <Tooltip
                  cursor={{
                    stroke: "#94a3b8",
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `${Number(value).toLocaleString()} bookings`,
                    "Bookings",
                  ]}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill={`url(#bookingTrendGradient-${preset})`}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#2563eb",
                    fill: "#ffffff",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: "#ffffff",
                    fill: "#2563eb",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}