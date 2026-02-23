/* eslint-disable react-hooks/incompatible-library */
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
import { toast } from "sonner";
import useEmployee from "@/hooks/onboardingHook";

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
      position: "cleaner",
    },
  });
  const { loading, handleOnboardEmployee } = useEmployee();
  const positionValue = watch("position");

  const onSubmit = async (data: CreateEmployeeInput) => {
    try {
      const newEmployee = await handleOnboardEmployee(
        data.firstName,
        data.lastName,
        data.email,
        data.position,
      );
      if (!newEmployee) {
        toast.error("Failed to onboard employee.");
        return;
      }
      onCreate(newEmployee);

      reset();
      onClose();
      toast.success("Employee onboarded succesfully!");
    } catch (err) {
      console.error("Failed to onboard employee:", err);
      toast.error("Failed to onboard employee.");
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
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
              <Select
                value={positionValue}
                onValueChange={(value) =>
                  setValue("position", value as any, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaner">Cleaner</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-sm text-destructive mt-1">
                  {errors.position.message}
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
    </>
  );
}
