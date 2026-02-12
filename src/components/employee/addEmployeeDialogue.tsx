/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmployeeSchema,
  CreateEmployeeInput,
} from "@/validators/employee.schema";

import { IEmployee } from "@/types/account";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (employee: IEmployee) => void;
}

export function AddEmployeeDialog({ open, onClose, onCreate }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    mode: "onChange",
    defaultValues: {
      status: "ACTIVE",
    },
  });

  const statusValue = watch("status");

  const onSubmit = (data: CreateEmployeeInput) => {
    const newEmployee: IEmployee = {
      id: `emp_${crypto.randomUUID()}`,
      account: {
        id: `acc_${crypto.randomUUID()}`,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        clerkId: `mock_clerk_${crypto.randomUUID()}`,
        role: "EMPLOYEE",
      },
      position: data.position,
      status: data.status,
      performance_score: 0,
      hire_date: new Date().toISOString(),
      num_ratings: 0,
    };

    onCreate(newEmployee);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* First Name */}
          <div>
            <Input placeholder="First Name" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-destructive mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Input placeholder="Last Name" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-destructive mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <Input placeholder="Position" {...register("position")} />
            {errors.position && (
              <p className="text-sm text-destructive mt-1">
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("status", value as any, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
