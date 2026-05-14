"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, ArrowRightIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface AlertItem {
  id: number;
  name: string;
  stock: number;
}

interface InventoryAlertsCardProps {
  items: AlertItem[];
}

export default function InventoryAlertsCard({
  items,
}: InventoryAlertsCardProps) {
  const hasAlerts = items.length > 0;

  return (
    <Card className="rounded-3xl border-amber-200/80 bg-linear-to-br from-amber-50/80 via-white to-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Inventory Alerts
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Items that may affect upcoming service operations.
          </p>
        </div>

        <div
          className={
            hasAlerts
              ? "flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700"
              : "flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700"
          }
        >
          {hasAlerts ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {hasAlerts ? (
          items.map((item) => {
            const isOut = item.stock <= 0;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white/70 p-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requires inventory review
                  </p>
                </div>

                <span
                  className={
                    isOut
                      ? "shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"
                      : "shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                  }
                >
                  {item.stock} left
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed bg-white/70 text-center text-sm text-muted-foreground">
            All items are sufficiently stocked.
          </div>
        )}

        <Link
          href="/inventory"
          className="flex items-center justify-end gap-1 pt-1 text-xs font-medium text-muted-foreground transition hover:text-slate-950"
        >
          <span>View inventory</span>
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}