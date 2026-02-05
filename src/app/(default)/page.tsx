"use client";
import DatePicker from "@/components/dashboard/dateFilter";
import DashboardOverview from "@/components/dashboard/overview";

export default function Dashboard() {
  return (
    <div className="block w-full h-screen p-6">
      <div className="flex flex-row items-center justify-between p-4">
        <h1 className="text-3xl text-bold">Overview</h1>
        <DatePicker />
      </div>
      <DashboardOverview
        weeklySales={{
          title: "Sales",
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
