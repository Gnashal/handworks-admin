"use client";
import { ArrowUpRight, Package, Clock, Briefcase } from "lucide-react";
import MetricCard from "./metricCard";
import FinancialCard from "./financialCard";
import ClientBreakdownCard from "./clientBreakdownCard";
import ServiceDynamics from "./serviceDynamics";

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number; // percentage
  trend?: "up" | "down";
}

export interface ClientBreakdown {
  label: string;
  value: number; // percentage
}

export interface FinancialStat {
  label: string;
  amount: number;
  currency?: string;
}

export interface DashboardOverviewProps {
  weeklySales: MetricCardData;
  bookings: MetricCardData;
  clients: MetricCardData;
  activeSessions: MetricCardData;
  activeWorkers: MetricCardData;
  clientBreakdown: ClientBreakdown[];
  bookingSeries: { label: string; value: number }[];
  paidInvoices: FinancialStat;
  fundReceived: FinancialStat;
}

export default function DashboardOverview(props: DashboardOverviewProps) {
  const {
    weeklySales,
    bookings,
    clients,
    activeSessions,
    activeWorkers,
    clientBreakdown,
    bookingSeries,
    paidInvoices,
    fundReceived,
  } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="grid grid-cols-2 grid-rows-[repeat(3,minmax(0,auto))] gap-4 flex-2">
          <MetricCard icon={<ArrowUpRight />} data={weeklySales} />
          <MetricCard icon={<Package />} data={bookings} />
          <MetricCard icon={<Clock />} data={activeSessions} />
          <MetricCard icon={<Briefcase />} data={activeWorkers} />

          <FinancialCard data={paidInvoices} />
          <FinancialCard data={fundReceived} />

          <div className="col-span-2">
            <ServiceDynamics bookingSeries={bookingSeries} />
          </div>
        </div>

        <div className="flex-1">
          <ClientBreakdownCard
            clients={clientBreakdown}
            total={clients.value}
          />
        </div>
      </div>
    </div>
  );
}
