"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRightIcon,
  CheckCircle2,
  PackageSearch,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface AlertItem {
  id: number;
  name: string;
  stock: number;
}

interface InventoryAlertsCardProps {
  items: AlertItem[];
  variant?: "default" | "compact";
}

const getStockLabel = (stock: number) => {
  if (stock <= 0) {
    return {
      label: "Out of stock",
      helper: "No available units",
      pill: "border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-500",
    };
  }

  if (stock <= 3) {
    return {
      label: "Critical",
      helper: "Restock immediately",
      pill: "border-orange-200 bg-orange-50 text-orange-700",
      dot: "bg-orange-500",
    };
  }

  return {
    label: "Low stock",
    helper: "Restock soon",
    pill: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  };
};

export default function InventoryAlertsCard({
  items,
  variant = "default",
}: InventoryAlertsCardProps) {
  const hasAlerts = items.length > 0;
  const outOfStockCount = items.filter((item) => item.stock <= 0).length;
  const criticalCount = items.filter(
    (item) => item.stock > 0 && item.stock <= 3,
  ).length;

  const firstAlert = items[0];
  const firstAlertState = firstAlert ? getStockLabel(firstAlert.stock) : null;

  if (variant === "compact") {
    return (
      <Link
        href="/inventory"
        className="block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        aria-label="Open inventory alerts"
      >
        <Card className="group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-3xl border border-amber-200/80 bg-linear-to-br from-amber-50/90 via-white to-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99]">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-orange-400 to-red-400" />

          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2 pt-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  Inventory Alerts
                </CardTitle>

                {hasAlerts ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    {items.length}
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Stock issues
              </p>
            </div>

            <div
              className={
                hasAlerts
                  ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 transition group-hover:scale-105"
                  : "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 transition group-hover:scale-105"
              }
            >
              {hasAlerts ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col pt-0">
            {hasAlerts && firstAlert && firstAlertState ? (
              <>
                <div className="text-3xl font-bold tracking-tight text-slate-950">
                  {items.length}
                </div>

                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide ${firstAlertState.pill}`}
                  >
                    {outOfStockCount > 0
                      ? `${outOfStockCount} out of stock`
                      : `${criticalCount} critical`}
                  </Badge>
                </div>

                <div className="mt-4 rounded-2xl border border-amber-100 bg-white/75 p-3">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${firstAlertState.dot}`}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {firstAlert.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {firstAlertState.helper}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight text-slate-950">
                  0
                </div>

                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className="rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] uppercase tracking-wide text-emerald-700"
                  >
                    All stocked
                  </Badge>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-100 bg-white/75 p-3">
                  <div className="flex items-start gap-2">
                    <PackageSearch className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        Inventory healthy
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        No low-stock items
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-auto flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground transition group-hover:text-slate-950">
              <span>View inventory</span>
              <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  const visibleItems = items.slice(0, 4);
  const remainingItems = Math.max(items.length - visibleItems.length, 0);

  return (
    <Link
      href="/inventory"
      className="block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      aria-label="Open inventory alerts"
    >
      <Card className="group relative h-full min-h-[260px] overflow-hidden rounded-3xl border-amber-200/80 bg-linear-to-br from-amber-50/90 via-white to-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99]">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-orange-400 to-red-400" />

        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-slate-950">
                Inventory Alerts
              </CardTitle>

              {hasAlerts ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {items.length}
                </span>
              ) : null}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Items that may affect upcoming service operations.
            </p>
          </div>

          <div
            className={
              hasAlerts
                ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 transition group-hover:scale-105"
                : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 transition group-hover:scale-105"
            }
          >
            {hasAlerts ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col space-y-4">
          {hasAlerts ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-red-100 bg-white/80 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Out of Stock
                  </p>
                  <p className="mt-1 text-xl font-bold leading-none text-red-700">
                    {outOfStockCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white/80 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Critical
                  </p>
                  <p className="mt-1 text-xl font-bold leading-none text-orange-700">
                    {criticalCount}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {visibleItems.map((item) => {
                  const stockState = getStockLabel(item.stock);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white/80 p-3 transition group-hover:border-amber-200"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${stockState.dot}`}
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stockState.helper}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stockState.pill}`}
                        >
                          {item.stock} left
                        </span>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {stockState.label}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {remainingItems > 0 ? (
                  <div className="rounded-2xl border border-dashed border-amber-200 bg-white/60 p-3 text-center text-xs font-medium text-amber-700">
                    +{remainingItems} more item
                    {remainingItems === 1 ? "" : "s"} need attention
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed bg-white/70 p-5 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                <PackageSearch className="h-5 w-5" />
              </div>

              <p className="text-sm font-semibold text-slate-950">
                Inventory looks healthy
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                No low-stock or out-of-stock items right now.
              </p>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Review stock levels
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 transition group-hover:gap-1.5">
              View inventory
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}