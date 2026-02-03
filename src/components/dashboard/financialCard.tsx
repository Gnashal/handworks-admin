"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export interface FinancialStat {
  label: string;
  amount: number;
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
      <CardContent>
        <div className="text-xl font-semibold">
          {currency}
          {data.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <p className="text-xs text-muted-foreground">Current Financial Year</p>
      </CardContent>
    </Card>
  );
}
