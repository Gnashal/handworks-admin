"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, WalletCards } from "lucide-react";
import Link from "next/link";
import CountUp from "react-countup";
import clsx from "clsx";

export interface FinancialStat {
  label: string;
  amount: number;
  secondaryAmount?: number;
  secondaryLabel?: string;
  breakdowns?: Array<{
    label: string;
    amount: number;
  }>;
  currency?: string;
  className?: string;
  href?: string;
}

export default function FinancialCard({ data }: { data: FinancialStat }) {
  const currency = data.currency ?? "₱";
  const paidBreakdown = data.breakdowns?.find(
    (item) => item.label.toLowerCase() === "paid",
  );

  const paidPercentage =
    data.amount > 0
      ? Math.min(100, Math.round(((paidBreakdown?.amount ?? 0) / data.amount) * 100))
      : 0;

  const renderAmount = (amount: number) => (
    <>
      {currency}
      <CountUp
        start={0}
        end={amount}
        duration={1.5}
        separator=","
        decimals={2}
        decimal="."
        preserveValue
      />
    </>
  );

  return (
    <Card
      className={clsx(
        "relative overflow-hidden rounded-3xl",
        data.className ?? "min-h-[170px] border border-slate-200 bg-white shadow-sm",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-slate-900 via-emerald-500 to-blue-500" />

      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2 pt-5">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-700">
            {data.label}
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Current financial period
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
          <WalletCards className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="text-2xl font-bold tracking-tight text-slate-950">
          {renderAmount(data.amount)}
        </div>

        {data.secondaryAmount !== undefined ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{data.secondaryLabel}</span>
            <span className="font-semibold text-slate-900">
              {renderAmount(data.secondaryAmount)}
            </span>
          </div>
        ) : null}

        {data.breakdowns?.length ? (
          <div className="space-y-2">
            {data.breakdowns.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-slate-900">
                  {renderAmount(item.amount)}
                </span>
              </div>
            ))}

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-500 to-green-500"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>
          </div>
        ) : null}

        {data.href ? (
          <Link
            href={data.href}
            className="flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground transition hover:text-slate-950"
          >
            <span>View details</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}