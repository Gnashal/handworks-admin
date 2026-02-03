"use client";
import DashboardOverview from "@/components/dashboard/overview";

export default function Dashboard() {
  return (
    <div className="block w-full h-screen p-6">
      <DashboardOverview
        weeklySales={{
          title: "Weekly Sales",
          value: 75,
          change: 8.2,
          trend: "up",
        }}
        bookings={{ title: "Bookings", value: 15, change: 3.4, trend: "up" }}
        clients={{ title: "Clients", value: 6 }}
        activeSessions={{
          title: "Active Sessions",
          value: 3,
          change: 1.2,
          trend: "down",
        }}
        activeWorkers={{ title: "Employees", value: 7 }}
        clientBreakdown={[
          { label: "New", value: 62 },
          { label: "Returning", value: 26 },
          { label: "Inactive", value: 12 },
        ]}
        bookingSeries={[
          { label: "Jan", value: 40 },
          { label: "Feb", value: 55 },
          { label: "Mar", value: 48 },
        ]}
        paidInvoices={{ label: "Paid Invoices", amount: 80465.23 }}
        fundReceived={{ label: "Fund Received", amount: 153355 }}
      />
    </div>
  );
}
