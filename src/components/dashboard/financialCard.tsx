"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const currency = data.currency ?? "₱";
  const paidBreakdown = data.breakdowns?.find(
    (item) => item.label.toLowerCase() === "paid",
  );

  const paidPercentage =
    data.amount > 0
      ? Math.min(
          100,
          Math.round(((paidBreakdown?.amount ?? 0) / data.amount) * 100),
        )
      : 0;

  const isClickable = Boolean(data.href);

  const handleCardClick = () => {
    if (!data.href) return;
    router.push(data.href);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!data.href) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(data.href);
    }
  };

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
      role={isClickable ? "link" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={clsx(
        "group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-3xl outline-none",
        isClickable
          ? "cursor-pointer transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-[0.99]"
          : "transition hover:-translate-y-0.5 hover:shadow-md",
        data.className ?? "border border-slate-200 bg-white shadow-sm",
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

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 transition group-hover:scale-105">
          <WalletCards className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="text-2xl font-bold tracking-tight text-slate-950">
          {renderAmount(data.amount)}
        </div>

        {data.secondaryAmount !== undefined ? (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{data.secondaryLabel}</span>
            <span className="font-semibold text-slate-900">
              {renderAmount(data.secondaryAmount)}
            </span>
          </div>
        ) : null}

        {data.breakdowns?.length ? (
          <div className="mt-4 space-y-2">
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
          <div className="mt-auto flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground transition group-hover:text-slate-950">
            <span>View details</span>
            <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}