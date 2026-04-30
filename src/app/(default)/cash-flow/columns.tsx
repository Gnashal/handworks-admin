"use client";

import { format } from "date-fns";

import type { ICashFlowEntry } from "@/types/payment";

export type CashFlowColumn = {
  key: string;
  header: string;
  render: (entry: ICashFlowEntry) => React.ReactNode;
  className?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const sumPayments = (entry: ICashFlowEntry): number => {
  return entry.Payments.reduce((acc, payment) => {
    const amount = Number(payment.amount) || 0;
    if (payment.type === "REFUND") return acc - amount;
    return acc + amount;
  }, 0);
};

const paymentTypes = (entry: ICashFlowEntry): string => {
  const uniqueTypes = Array.from(new Set(entry.Payments.map((p) => p.type)));
  return uniqueTypes.length ? uniqueTypes.join(", ") : "No payment";
};

const paymentStatus = (entry: ICashFlowEntry): string => {
  const statuses = Array.from(new Set(entry.Payments.map((p) => p.status)));
  return statuses.length ? statuses.join(", ") : "Pending";
};

export const cashFlowColumns: CashFlowColumn[] = [
  {
    key: "customer",
    header: "Customer",
    render: (entry) => (
      <div className="min-w-48">
        <p className="font-medium text-slate-900">
          {entry.Customer.firstName} {entry.Customer.lastName}
        </p>
        <p className="text-xs text-slate-500">{entry.Customer.email}</p>
      </div>
    ),
  },
  {
    key: "order",
    header: "Order",
    render: (entry) => (
      <div>
        <p className="font-medium text-slate-800">{entry.order.order_number}</p>
        <p className="text-xs text-slate-500">{entry.order.id}</p>
      </div>
    ),
  },
  {
    key: "method",
    header: "Payment Method",
    render: (entry) => (
      <p className="text-sm uppercase tracking-wide text-slate-700">
        {entry.order.payment_method}
      </p>
    ),
  },
  {
    key: "types",
    header: "Payment Type(s)",
    render: (entry) => (
      <p className="text-sm text-slate-700">{paymentTypes(entry)}</p>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (entry) => (
      <p className="text-sm font-medium text-slate-800">
        {paymentStatus(entry)}
      </p>
    ),
  },
  {
    key: "total",
    header: "Net Cash Flow",
    className: "text-right",
    render: (entry) => (
      <p className="text-sm font-semibold text-emerald-700">
        {currencyFormatter.format(sumPayments(entry))}
      </p>
    ),
  },
  {
    key: "created",
    header: "Created",
    render: (entry) => (
      <p className="text-sm text-slate-600">
        {format(new Date(entry.order.created_at), "MMM dd, yyyy")}
      </p>
    ),
  },
];

export const cashFlowMoney = {
  currencyFormatter,
  sumPayments,
};
