"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";

import { DataTable } from "@/components/dataTable";
import { columns } from "./columns";
import { IEmployee } from "@/types/account";
import { Button } from "@/components/ui/button";
import { AddEmployeeDialog } from "@/components/employee/addEmployeeDialogue";
import { useEmployeesQuery } from "@/queries/employeeQueries";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type EmployeeStatusFilter = "ALL" | "ACTIVE" | "INACTIVE" | "SUSPENDED";

const statusFilterOptions: {
  label: string;
  value: EmployeeStatusFilter;
}[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

function getEmployeeName(employee: IEmployee) {
  const firstName = employee.account.first_name?.trim() ?? "";
  const lastName = employee.account.last_name?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unnamed Employee";
}

function normalizeStatus(status: string) {
  return status.trim().toUpperCase();
}

function getSearchableEmployeeText(employee: IEmployee) {
  return [
    employee.id,
    employee.account.id,
    employee.account.clerkId,
    employee.account.first_name,
    employee.account.last_name,
    employee.account.email,
    employee.position,
    employee.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function EmployeesPage() {
  const router = useRouter();

  const [addOpen, setAddOpen] = React.useState(false);
  const [localEmployees, setLocalEmployees] = React.useState<IEmployee[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<EmployeeStatusFilter>("ALL");
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  const employeeColumns = React.useMemo(
    () =>
      columns((employee) => {
        router.push(`/employees/${employee.id}`);
      }),
    [router],
  );

  const { data, isLoading, isError } = useEmployeesQuery(page, limit);

  const fetchedEmployees = React.useMemo(() => {
    return data?.employees ?? [];
  }, [data?.employees]);

  const employees = React.useMemo(() => {
    const employeeMap = new Map<string, IEmployee>();

    localEmployees.forEach((employee) => {
      employeeMap.set(employee.id, employee);
    });

    fetchedEmployees.forEach((employee) => {
      employeeMap.set(employee.id, employee);
    });

    return Array.from(employeeMap.values());
  }, [fetchedEmployees, localEmployees]);

  const filteredEmployees = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        getSearchableEmployeeText(employee).includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(employee.status) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const activeEmployees = React.useMemo(() => {
    return employees.filter(
      (employee) => normalizeStatus(employee.status) === "ACTIVE",
    ).length;
  }, [employees]);

  const inactiveEmployees = React.useMemo(() => {
    return employees.filter(
      (employee) => normalizeStatus(employee.status) === "INACTIVE",
    ).length;
  }, [employees]);

  const averageRating = React.useMemo(() => {
    if (employees.length === 0) return 0;

    const total = employees.reduce(
      (sum, employee) => sum + Number(employee.performance_score || 0),
      0,
    );

    return total / employees.length;
  }, [employees]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || statusFilter !== "ALL";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-linear-to-b from-slate-50 via-background to-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-8 w-44 animate-pulse rounded-md bg-slate-200" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-slate-100" />
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-200" />
                </CardContent>
              </Card>
            ))}
          </div>

          <DataTableSkeleton
            columnCount={employeeColumns.length}
            rowCount={10}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-b from-slate-50 via-background to-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Employees
                </h1>

                <Badge variant="outline" className="bg-slate-50">
                  Workforce Management
                </Badge>
              </div>

              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Manage cleaners, review performance, check employment status,
                and open each employee&apos;s work history.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-2 bg-white"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                onClick={() => setAddOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-200 bg-slate-50/80 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, email, position, employee ID..."
                className="h-10 rounded-xl bg-white pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {statusFilterOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={statusFilter === option.value ? "default" : "outline"}
                  onClick={() => setStatusFilter(option.value)}
                  className={
                    statusFilter === option.value ? "" : "bg-white"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Loaded Employees
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {employees.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {activeEmployees}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inactive
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {inactiveEmployees}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Activity className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Rating
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {averageRating.toFixed(1)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
                <Star className="h-5 w-5 fill-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {isError && (
          <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Failed to load employees.</p>
              <p className="text-red-700/80">
                Check the employee API or try refreshing the page.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Employee Directory
            </h2>
            <p className="text-sm text-muted-foreground">
              Click a row to open assigned cleanings and timesheet records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {statusFilter !== "ALL" && (
              <Badge variant="outline" className="bg-slate-50">
                Status: {statusFilter}
              </Badge>
            )}

            {searchQuery.trim().length > 0 && (
              <Badge variant="outline" className="bg-slate-50">
                Search: {searchQuery.trim()}
              </Badge>
            )}

            <Badge variant="outline" className="bg-white">
              Visible: {filteredEmployees.length}
            </Badge>
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white/80 shadow-sm">
            <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                No employees found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                No employee records match the current filters. Try clearing the
                search or changing the status filter.
              </p>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-4 bg-white"
                >
                  Reset filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <DataTable<IEmployee, unknown>
            columns={employeeColumns}
            data={filteredEmployees}
            onRowClick={(employee) => {
              router.push(`/employees/${employee.id}`);
            }}
            onPaginationChange={(pageIndex, pageSize) => {
              setPage(pageIndex);
              setLimit(pageSize);
            }}
          />
        )}

        <AddEmployeeDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onCreate={(newEmployee) => {
            setLocalEmployees((prev) => [
              newEmployee,
              ...prev.filter((employee) => employee.id !== newEmployee.id),
            ]);
          }}
        />
      </div>
    </section>
  );
}