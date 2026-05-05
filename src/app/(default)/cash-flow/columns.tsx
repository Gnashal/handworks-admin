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
  const payments = entry.payments ?? [];
  return payments.reduce((acc, payment) => {
    const amount = Number(payment.amount) || 0;
    if (payment.type === "REFUND") return acc - amount;
    return acc + amount;
  }, 0);
};

const paymentTypes = (entry: ICashFlowEntry): string => {
  const payments = entry.payments ?? [];
  const uniqueTypes = Array.from(new Set(payments.map((p) => p.type)));
  return uniqueTypes.length ? uniqueTypes.join(", ") : "No payment";
};

// map raw status -> label + optional tailwind color
const formatPaymentStatus = (status: string | undefined) => {
  if (!status) {
    return { label: "Pending", className: "text-slate-700" };
  }

  switch (status) {
    case "paid":
      return { label: "Paid", className: "text-emerald-700" };
    case "awaiting_payment_method":
      return { label: "Awaiting Payment Method", className: "text-amber-700" };
    case "processing":
      return { label: "Processing", className: "text-blue-700" };
    case "failed":
      return { label: "Failed", className: "text-red-700" };
    default:
      return {
        label: status
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        className: "text-slate-700",
      };
  }
};

const paymentStatus = (entry: ICashFlowEntry): string => {
  const payments = entry.payments ?? [];
  const statuses = Array.from(new Set(payments.map((p) => p.status)));

  if (!statuses.length) return "Pending";

  return statuses.map((s) => formatPaymentStatus(s).label).join(", ");
};

export const cashFlowColumns: CashFlowColumn[] = [
  {
    key: "customer",
    header: "Customer",
    render: (entry) => (
      <div className="min-w-48">
        <p className="font-medium text-slate-900">
          {entry.customer.firstName} {entry.customer.lastName}
        </p>
        <p className="text-xs text-slate-500">{entry.customer.email}</p>
      </div>
    ),
  },
  {
    key: "order",
    header: "Order",
    render: (entry) => (
      <div>
        <p className="font-medium text-slate-800">{entry.order.order_number}</p>
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
    render: (entry) => {
      const payments = entry.payments ?? [];
      const rawStatus = payments[0]?.status;
      const { label, className } = formatPaymentStatus(rawStatus);

      return <p className={`text-sm font-medium ${className}`}>{label}</p>;
    },
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
