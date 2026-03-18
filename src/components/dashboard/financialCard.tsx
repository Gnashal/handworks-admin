"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FinancialStat {
  label: string;
  amount: number;
  secondaryAmount?: number;
  secondaryLabel?: string;  
  currency?: string;
  className?: string;
}

export default function FinancialCard({ data }: { data: FinancialStat }) {
  const currency = data.currency ?? "₱";

  return (
    <Card className={data.className ? data.className : "w-full h-50"}>
      <CardHeader>
        <CardTitle className="text-xl">{data.label}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {/* Primary Amount */}
        <div className="text-xl font-semibold">
          {currency}
          {data.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        {/* Secondary (optional) */}
        {data.secondaryAmount !== undefined && (
          <div className="text-sm text-muted-foreground">
            {data.secondaryLabel}:{" "}
            <span className="font-medium">
              {currency}
              {data.secondaryAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Current Financial Period
        </p>
      </CardContent>
    </Card>
  );
}