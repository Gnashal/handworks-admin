"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarPlus,
  UserPlus,
  Users,
  PackagePlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4 shadow-sm">
      <h3 className="text-sm font-semibold">Quick Actions</h3>

      {/* PRIMARY ACTION */}
      <Button
        className="w-full flex items-center gap-2"
        onClick={() => router.push("/bookings")}
      >
        <CalendarPlus className="h-4 w-4" />
        Add Booking
      </Button>

      {/* SECONDARY ACTIONS */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 justify-center"
          onClick={() => router.push("/clients")}
        >
          <UserPlus className="h-4 w-4" />
          Client
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 justify-center"
          onClick={() => router.push("/employees")}
        >
          <Users className="h-4 w-4" />
          Employee
        </Button>
      </div>

      {/* FULL WIDTH ACTION */}
      <Button
        variant="outline"
        className="w-full flex items-center gap-2 justify-center"
        onClick={() => router.push("/inventory")}
      >
        <PackagePlus className="h-4 w-4" />
        Inventory Item
      </Button>
    </div>
  );
}