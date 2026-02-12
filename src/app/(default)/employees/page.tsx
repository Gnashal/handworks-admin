"use client";

import { useState } from "react";
import { DataTable } from "@/components/dataTable";
import { columns } from "@/components/employee/columns";
import { mockEmployees } from "@/data/mockEmployees";
import { IEmployee } from "@/types/account";
import { Button } from "@/components/ui/button";
import { AddEmployeeDialog } from "@/components/employee/addEmployeeDialogue";
import { useRouter } from "next/navigation";
import { useEmployeesQuery } from "@/queries/employeeQueries";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";

export default function EmployeesPage() {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [employees, setEmployees] = useState(mockEmployees.employees);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useEmployeesQuery(page, limit);

  if (isLoading) {
    return (
      <div className="w-full h-screen p-6 space-y-4">
        <DataTableSkeleton columnCount={columns.length} rowCount={10} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Employees</h2>

      <Button
        variant="ghost"
        className="bg-white border rounded-md"
        onClick={() => setAddOpen(true)}
      >
        Add Employee
      </Button>

      <DataTable<IEmployee, unknown>
        columns={columns}
        data={data?.employees ?? []}
        onRowClick={(employee) => {
          router.push(`/employees/${employee.id}`);
        }}
        onPaginationChange={(pageIndex, limitIndex) => {
          setPage(pageIndex);
          setLimit(limitIndex);
        }}
      />

      <AddEmployeeDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(newEmployee) =>
          setEmployees((prev) => [...prev, newEmployee])
        }
      />
    </div>
  );
}
