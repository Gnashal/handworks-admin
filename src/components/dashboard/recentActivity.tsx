"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarCheck, UserPlus, XCircle } from "lucide-react";

interface Activity {
  id: number;
  type: "booking" | "client" | "cancel";
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityConfig = {
  booking: {
    icon: CalendarCheck,
    className: "bg-emerald-500/10 text-emerald-700",
  },
  client: {
    icon: UserPlus,
    className: "bg-blue-500/10 text-blue-700",
  },
  cancel: {
    icon: XCircle,
    className: "bg-red-500/10 text-red-700",
  },
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Recent Activity
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Latest movement across bookings and clients.
          </p>
        </div>
      </CardHeader>

      <CardContent className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-50"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.className}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-slate-900">
                  {activity.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-center text-sm text-muted-foreground">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}