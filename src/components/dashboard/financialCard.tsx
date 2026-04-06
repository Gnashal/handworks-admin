"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountUp from "react-countup";

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
}

export default function FinancialCard({ data }: { data: FinancialStat }) {
  const currency = data.currency ?? "₱";

  const renderAmount = (amount: number) => (
    <>
      {currency}
      <CountUp
        start={0}
        end={amount}
        duration={2}
        separator=","
        decimals={2}
        decimal="."
        preserveValue
      />
    </>
  );

  return (
    <Card className={data.className ? data.className : "w-full h-50"}>
      <CardHeader>
        <CardTitle className="text-xl">{data.label}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {/* Primary Amount */}
        <div className="text-xl font-semibold">{renderAmount(data.amount)}</div>

        {/* Secondary (optional) */}
        {data.secondaryAmount !== undefined && (
          <div className="text-sm text-muted-foreground">
            {data.secondaryLabel}:{" "}
            <span className="font-medium">
              {renderAmount(data.secondaryAmount)}
            </span>
          </div>
        )}

        {/* Breakdown rows (optional) */}
        {data.breakdowns?.map((item) => (
          <div key={item.label} className="text-sm text-muted-foreground">
            {item.label}:{" "}
            <span className="font-medium">{renderAmount(item.amount)}</span>
          </div>
        ))}

        <p className="text-xs text-muted-foreground">
          Current Financial Period
        </p>
      </CardContent>
    </Card>
  );
}
