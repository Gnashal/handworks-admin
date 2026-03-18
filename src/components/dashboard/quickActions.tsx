"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, UserPlus, Users, Package } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-2">
        {/* PRIMARY ACTION */}
        <Button className="w-full justify-start gap-2">
          <CalendarPlus className="h-4 w-4" />
          Add Booking
        </Button>

        {/* SECONDARY ACTIONS */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="justify-start gap-2">
            <UserPlus className="h-4 w-4" />
            Client
          </Button>

          <Button variant="outline" className="justify-start gap-2">
            <Users className="h-4 w-4" />
            Employee
          </Button>

          <Button variant="outline" className="col-span-2 justify-start gap-2">
            <Package className="h-4 w-4" />
            Inventory Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}