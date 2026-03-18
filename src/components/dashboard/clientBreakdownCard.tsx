"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Users } from "lucide-react";
import Link from "next/link";

export interface ClientBreakdown {
  label: string;
  value: number;
  count?: number;
}

interface ClientBreakdownCardProps {
  clients: ClientBreakdown[];
  total: number;
}

const COLORS = [
  "hsl(210, 100%, 50%)",
  "hsl(120, 100%, 40%)",
  "hsl(0, 100%, 50%)",
];

export default function ClientBreakdownCard({
  clients,
  total,
}: ClientBreakdownCardProps) {
  return (
    <Card className="h-full flex flex-col">
      {/* HEADER */}
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold">Clients</CardTitle>
          <span className="text-2xl font-bold">{total}</span>
        </div>
        <Users className="w-6 h-6" />
      </CardHeader>

      {/* TREND */}
      <div className="px-6 text-xs text-muted-foreground">
        +12% new clients this period
      </div>

      {/* CONTENT */}
      <CardContent className="flex flex-col items-center gap-6">
        {/* PIE */}
        <div className="relative">
          <PieChart width={180} height={180}>
            <Pie
              data={clients}
              dataKey="value"
              nameKey="label"
              innerRadius={55}
              outerRadius={75}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {clients.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>

          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold">{total}</span>
            <span className="text-xs text-muted-foreground">Clients</span>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex flex-col w-full gap-2">
          {clients.map((item, index) => (
            <Link
              key={item.label}
              href={`/clients?filter=${item.label.toLowerCase()}`}
              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/20 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {item.count !== undefined && (
                  <span className="text-muted-foreground">
                    {item.count}
                  </span>
                )}

                <span className="font-semibold">
                  {item.value}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}