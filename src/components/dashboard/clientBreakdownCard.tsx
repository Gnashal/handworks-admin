"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

const COLORS = ["#2563eb", "#16a34a", "#ef4444"];

export default function ClientBreakdownCard({
  clients,
  total,
}: ClientBreakdownCardProps) {
  const hasClients = total > 0;

  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Clients</CardTitle>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {total}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Client distribution for this period.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700">
          <Users className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasClients ? (
          <div className="relative h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clients}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={58}
                  outerRadius={82}
                  strokeWidth={3}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                >
                  {clients.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${Number(value)}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight text-slate-950">
                {total}
              </span>
              <span className="text-xs text-muted-foreground">Clients</span>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-sm text-muted-foreground">
            No client data available.
          </div>
        )}

        <div className="space-y-2">
          {clients.map((item, index) => (
            <Link
              key={item.label}
              href={`/clients?filter=${item.label.toLowerCase()}`}
              className="flex items-center justify-between rounded-2xl border border-transparent px-3 py-2 transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <span className="text-sm font-medium text-slate-900">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                {item.count !== undefined ? (
                  <span className="text-muted-foreground">{item.count}</span>
                ) : null}

                <span className="font-semibold text-slate-950">
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