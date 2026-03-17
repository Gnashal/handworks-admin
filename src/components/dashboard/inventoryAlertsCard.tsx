"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AlertItem {
  id: number;
  name: string;
  stock: number;
}

interface InventoryAlertsCardProps {
  items: AlertItem[];
}

export default function InventoryAlertsCard({
  items,
}: InventoryAlertsCardProps) {
  return (
    <Card className="border-yellow-200 bg-yellow-50/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Alerts</CardTitle>
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-red-500">
                {item.stock} left
              </span>
            </div>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">
            All items are sufficiently stocked
          </span>
        )}

        {/* VIEW ALL */}
        <Link
          href="/inventory"
          className="text-xs text-muted-foreground hover:text-primary pt-2"
        >
          View Inventory →
        </Link>
      </CardContent>
    </Card>
  );
}