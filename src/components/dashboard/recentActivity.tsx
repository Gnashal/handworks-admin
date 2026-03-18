"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  CalendarCheck,
  UserPlus,
  XCircle,
} from "lucide-react";

interface Activity {
  id: number;
  type: "booking" | "client" | "cancel";
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "booking":
        return <CalendarCheck className="w-4 h-4 text-green-500" />;
      case "client":
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "cancel":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 h-fit">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {getIcon(activity.type)}

              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {activity.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <span className="text-sm text-muted-foreground">
            No recent activity
          </span>
        )}
      </CardContent>
    </Card>
  );
}