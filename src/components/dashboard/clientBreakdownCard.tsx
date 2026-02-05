"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Users } from "lucide-react";

export interface ClientBreakdown {
  label: string;
  value: number; // percentage
}

interface ClientBreakdownCardProps {
  clients: ClientBreakdown[];
  total: number | string;
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
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold">Clients</CardTitle>
          <span className="text-2xl font-bold">{total}</span>
        </div>
        <Users className="w-6 h-6" />
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6">
        <PieChart width={160} height={160}>
          <Pie
            data={clients}
            dataKey="value"
            nameKey="label"
            innerRadius={50}
            outerRadius={70}
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

        <div className="flex flex-col w-full gap-2">
          {clients.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/10"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <span className="font-medium text-sm">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
