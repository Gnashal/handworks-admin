"use client";

import { Button } from "@/components/ui/button";
import { CalendarPlus, PackagePlus, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    label: "New Booking",
    description: "Create booking",
    href: "/bookings/create",
    icon: CalendarPlus,
    primary: true,
  },
  {
    label: "Client",
    description: "Manage clients",
    href: "/clients",
    icon: UserPlus,
    primary: false,
  },
  {
    label: "Employee",
    description: "Manage staff",
    href: "/employees",
    icon: Users,
    primary: false,
  },
  {
    label: "Inventory Items",
    description: "Stock control",
    href: "/inventory",
    icon: PackagePlus,
    primary: false,
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight">
          Quick Actions
        </h3>
        <p className="text-xs text-muted-foreground">
          Jump to the most common admin tasks.
        </p>
      </div>

      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.href}
              variant={action.primary ? "default" : "outline"}
              className={
                action.primary
                  ? "h-auto w-full justify-start gap-3 rounded-2xl p-3"
                  : "h-auto w-full justify-start gap-3 rounded-2xl border-slate-200 bg-white p-3 hover:bg-slate-50"
              }
              onClick={() => router.push(action.href)}
            >
              <span
                className={
                  action.primary
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
                }
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold">{action.label}</span>
                <span
                  className={
                    action.primary
                      ? "text-xs font-normal text-white/75"
                      : "text-xs font-normal text-muted-foreground"
                  }
                >
                  {action.description}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}