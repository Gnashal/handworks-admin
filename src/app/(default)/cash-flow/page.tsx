"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { addMonths, format } from "date-fns";
import { Download } from "lucide-react";

import { useCashFlowQuery } from "@/queries/paymentQueries";
import type { ICashFlowEntry } from "@/types/payment";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cashFlowColumns, cashFlowMoney } from "./columns";

const today = new Date();
const defaultStart = addMonths(today, -3);
const defaultEnd = today;

const getPaymentTypes = (entry: ICashFlowEntry): string => {
  const uniqueTypes = Array.from(new Set(entry.payments.map((p) => p.type)));
  return uniqueTypes.length ? uniqueTypes.join(", ") : "No payment";
};

const getPaymentStatus = (entry: ICashFlowEntry): string => {
  const statuses = Array.from(new Set(entry.payments.map((p) => p.status)));
  return statuses.length ? statuses.join(", ") : "Pending";
};

export default function CashFlowPage() {
  const { getToken } = useAuth();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const [startDate, setStartDate] = useState(
    format(defaultStart, "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(defaultEnd, "yyyy-MM-dd"));
  const [draftStartDate, setDraftStartDate] = useState(startDate);
  const [draftEndDate, setDraftEndDate] = useState(endDate);

  const { data, isLoading, isError } = useCashFlowQuery(
    startDate,
    endDate,
    page,
    limit,
  );

  const entries = useMemo(() => data?.entries ?? [], [data?.entries]);
  const totalEntries = data?.totalEntries ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / limit));
  const canPreviousPage = page > 0;
  const canNextPage = page + 1 < totalPages;

  const totalNetCashFlow = useMemo(() => {
    return entries.reduce(
      (acc, entry) => acc + cashFlowMoney.sumPayments(entry),
      0,
    );
  }, [entries]);

  const reportMeta = `Range: ${format(new Date(startDate), "MMM dd, yyyy")} - ${format(
    new Date(endDate),
    "MMM dd, yyyy",
  )}`;

  const onSearch = () => {
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setPage(0);
  };

  const onResetDate = () => {
    const start = format(defaultStart, "yyyy-MM-dd");
    const end = format(defaultEnd, "yyyy-MM-dd");

    setDraftStartDate(start);
    setDraftEndDate(end);
    setStartDate(start);
    setEndDate(end);
    setPage(0);
  };

  const onExportPdf = async () => {
    setIsExporting(true);

    try {
      const token = await getToken();
      if (!token) return;

      const params = new URLSearchParams({
        page: "0",
        limit: String(Math.max(totalEntries, limit, 1)),
        startDate,
        endDate,
      });

      const res = await fetch(`/api/fetchCashFlow?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!res.ok) return;

      const exportData = (await res.json()) as {
        entries?: ICashFlowEntry[];
        totalEntries?: number;
      };
      const exportEntries = exportData.entries ?? [];
      const exportTotalEntries =
        exportData.totalEntries ?? exportEntries.length;

      if (!exportEntries.length) return;

      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const generatedAt = format(new Date(), "MMM dd, yyyy hh:mm a");
      const reportRange = `${format(new Date(startDate), "MMM dd, yyyy")} - ${format(
        new Date(endDate),
        "MMM dd, yyyy",
      )}`;
      const exportNetCashFlow = exportEntries.reduce(
        (acc, entry) => acc + cashFlowMoney.sumPayments(entry),
        0,
      );

      doc.setFontSize(18);
      doc.text("Handworks Admin - Cash Flow Report", 40, 46);
      doc.setFontSize(11);
      doc.setTextColor(80);
      doc.text(`Report Range: ${reportRange}`, 40, 66);
      doc.text(`Generated: ${generatedAt}`, 40, 82);
      doc.text(`Total Entries: ${exportTotalEntries.toLocaleString()}`, 40, 98);
      doc.text(
        `Net Cash Flow: ${cashFlowMoney.currencyFormatter.format(exportNetCashFlow)}`,
        40,
        114,
      );

      const rows = exportEntries.map((entry) => [
        `${entry.customer.firstName} ${entry.customer.lastName}`,
        entry.customer.email,
        entry.order.order_number,
        entry.order.payment_method,
        getPaymentTypes(entry),
        getPaymentStatus(entry),
        cashFlowMoney.currencyFormatter.format(
          cashFlowMoney.sumPayments(entry),
        ),
        format(new Date(entry.order.created_at), "MMM dd, yyyy"),
      ]);

      autoTable(doc, {
        startY: 134,
        head: [
          [
            "Customer",
            "Email",
            "Order #",
            "Payment Method",
            "Payment Type(s)",
            "Status",
            "Net Cash Flow",
            "Created",
          ],
        ],
        body: rows,
        styles: {
          fontSize: 9,
          cellPadding: 6,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
        },
        columnStyles: {
          6: { halign: "right" },
        },
        margin: { left: 28, right: 28 },
      });

      const fileStart = format(new Date(startDate), "yyyyMMdd");
      const fileEnd = format(new Date(endDate), "yyyyMMdd");
      doc.save(`cash-flow-report-${fileStart}-to-${fileEnd}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="cashflow-report-page min-h-screen bg-linear-to-b from-slate-50 via-slate-100/80 to-white p-6 md:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 bg-primary p-6 text-white md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
                Financial Overview
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Cash Flow Report
              </h1>
              <p className="mt-1 text-sm text-slate-200">{reportMeta}</p>
            </div>

            <div className="cashflow-toolbar flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                className="gap-2 bg-white text-slate-900 hover:bg-slate-100"
                onClick={onExportPdf}
                disabled={isLoading || isExporting || totalEntries === 0}
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>

          <div className="cashflow-toolbar grid grid-cols-1 gap-3 border-t border-slate-200 bg-white p-4 md:grid-cols-[repeat(2,minmax(0,220px))_auto_auto] md:items-end">
            <label className="text-sm text-slate-700">
              Start date
              <input
                type="date"
                value={draftStartDate}
                onChange={(e) => setDraftStartDate(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none ring-emerald-300 transition focus:ring"
              />
            </label>

            <label className="text-sm text-slate-700">
              End date
              <input
                type="date"
                value={draftEndDate}
                onChange={(e) => setDraftEndDate(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none ring-emerald-300 transition focus:ring"
              />
            </label>

            <Button
              className="h-10 rounded-xl bg-slate-900 hover:bg-slate-800"
              onClick={onSearch}
            >
              Apply Filters
            </Button>

            <Button
              variant="outline"
              className="h-10 rounded-xl"
              onClick={onResetDate}
            >
              Reset
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-0 bg-white/90 shadow-sm backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Net Cash Flow (Page)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-700">
                {cashFlowMoney.currencyFormatter.format(totalNetCashFlow)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 shadow-sm backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">
                {totalEntries.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 shadow-sm backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Current Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">
                {page + 1}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 shadow-sm backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Rows Per Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="number"
                min={1}
                value={limit}
                onChange={(e) => {
                  const nextLimit = Math.max(1, Number(e.target.value) || 1);
                  setLimit(nextLimit);
                  setPage(0);
                }}
                className="h-10 w-24 rounded-xl border border-slate-300 px-3 text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm print:border-none print:shadow-none">
          <div className="cashflow-print-only mb-4">
            <h2 className="text-xl font-semibold">
              Handworks Admin - Cash Flow Report
            </h2>
            <p className="text-sm text-slate-600">{reportMeta}</p>
            <p className="text-xs text-slate-500">
              Generated: {format(new Date(), "MMM dd, yyyy hh:mm a")}
            </p>
          </div>

          {isLoading && (
            <DataTableSkeleton
              columnCount={cashFlowColumns.length}
              rowCount={10}
            />
          )}
          {isError && (
            <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              Failed to load cash flow data.
            </p>
          )}

          <div className="cashflow-table-wrap max-h-[65vh] overflow-auto rounded-2xl border border-slate-200">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-50">
                <TableRow>
                  {cashFlowColumns.map((column) => (
                    <TableHead key={column.key} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <TableRow key={entry.order.id}>
                      {cashFlowColumns.map((column) => (
                        <TableCell
                          key={`${entry.order.id}-${column.key}`}
                          className={column.className}
                        >
                          {column.render(entry)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={cashFlowColumns.length}
                      className="h-24 text-center text-slate-500"
                    >
                      No cash flow entries found for this date range.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="cashflow-toolbar mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Page{" "}
              <span className="font-semibold text-slate-900">{page + 1}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={!canPreviousPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!canNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
