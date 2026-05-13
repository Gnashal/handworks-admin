/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  BadgeCheck,
  Briefcase,
  Check,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import {
  createEmployeeSchema,
  CreateEmployeeInput,
} from "@/validators/employee.schema";
import { IEmployee } from "@/types/account";
import useEmployee from "@/hooks/onboardingHook";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (employee: IEmployee) => void;
}

type PositionOption = {
  value: CreateEmployeeInput["position"];
  label: string;
  description: string;
  helper: string;
};

const positionOptions: PositionOption[] = [
  {
    value: "cleaner",
    label: "Cleaner",
    description: "Assigned cleaning sessions and service tasks.",
    helper: "Best for field cleaning staff.",
  },
  {
    value: "driver",
    label: "Driver",
    description: "Transport support for staff and equipment.",
    helper: "Best for logistics support.",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Oversees schedules and employee coordination.",
    helper: "Best for admin-level staff.",
  },
];

function getPositionLabel(position: CreateEmployeeInput["position"]) {
  return (
    positionOptions.find((option) => option.value === position)?.label ??
    "Cleaner"
  );
}

function getInitials(firstName?: string, lastName?: string) {
  const firstInitial = firstName?.trim().charAt(0) ?? "";
  const lastInitial = lastName?.trim().charAt(0) ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  return initials || "E";
}

export function AddEmployeeDialog({ open, onClose, onCreate }: Props) {
  const { handleOnboardEmployee, loading } = useEmployee();

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
      firstName: "",
      lastName: "",
      email: "",
      position: "cleaner",
    },
  });

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const emailValue = watch("email");
  const positionValue = watch("position");

  const isSaving = loading || isSubmitting;

  const handleClose = () => {
    if (isSaving) return;

    reset({
      firstName: "",
      lastName: "",
      email: "",
      position: "cleaner",
    });

    onClose();
  };

  const onSubmit = async (data: CreateEmployeeInput) => {
    try {
      const newEmployee = await handleOnboardEmployee(
        data.firstName.trim(),
        data.lastName.trim(),
        data.email.trim(),
        data.position,
      );

      if (!newEmployee) {
        toast.error("Failed to onboard employee.");
        return;
      }

      onCreate(newEmployee);

      reset({
        firstName: "",
        lastName: "",
        email: "",
        position: "cleaner",
      });

      onClose();
      toast.success("Employee onboarded successfully!");
    } catch (err) {
      console.error("Failed to onboard employee:", err);
      toast.error("Failed to onboard employee.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent className="max-h-[88vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-3xl border-slate-200 p-0 shadow-2xl sm:!max-w-[1040px]">
        <div className="border-b bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <UserPlus className="h-5 w-5" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  Add Employee
                </DialogTitle>
                <p className="mt-1 text-sm text-slate-300">
                  Create a staff account and assign their starting role.
                </p>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs font-medium text-slate-300">Status</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  New Account
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs font-medium text-slate-300">Default</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-sky-300" />
                  Active Staff
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs font-medium text-slate-300">Position</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <Briefcase className="h-4 w-4 text-amber-300" />
                  {getPositionLabel(positionValue)}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-slate-700"
                  >
                    First Name
                  </label>

                  <Input
                    id="firstName"
                    placeholder="e.g. Clarence"
                    autoComplete="given-name"
                    disabled={isSaving}
                    className="h-11 rounded-xl bg-white"
                    {...register("firstName")}
                  />

                  {errors.firstName && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-slate-700"
                  >
                    Last Name
                  </label>

                  <Input
                    id="lastName"
                    placeholder="e.g. Diangco"
                    autoComplete="family-name"
                    disabled={isSaving}
                    className="h-11 rounded-xl bg-white"
                    {...register("lastName")}
                  />

                  {errors.lastName && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="employee@email.com"
                      autoComplete="email"
                      disabled={isSaving}
                      className="h-11 rounded-xl bg-white pl-9"
                      {...register("email")}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Position
                  </label>

                  <Select
                    value={positionValue}
                    disabled={isSaving}
                    onValueChange={(value) =>
                      setValue(
                        "position",
                        value as CreateEmployeeInput["position"],
                        {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        },
                      )
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-white">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>

                    <SelectContent>
                      {positionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.position && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.position.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {positionOptions.map((option) => {
                  const selected = option.value === positionValue;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={isSaving}
                      onClick={() =>
                        setValue("position", option.value, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                      className={`min-h-28 rounded-2xl border p-3 text-left transition ${
                        selected
                          ? "border-slate-900 bg-slate-950 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex h-full flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold">
                              {option.label}
                            </p>

                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-emerald-300 bg-emerald-400 text-slate-950"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {selected && <Check className="h-3.5 w-3.5" />}
                            </span>
                          </div>

                          <p
                            className={`mt-1 text-xs leading-relaxed ${
                              selected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {option.description}
                          </p>
                        </div>

                        <p
                          className={`text-[11px] font-medium ${
                            selected ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {option.helper}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Employee Preview
              </div>

              <div className="mt-4 flex flex-col items-center rounded-2xl border bg-white p-4 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-xl font-bold text-slate-700 ring-1 ring-slate-200">
                  {getInitials(firstNameValue, lastNameValue)}
                </div>

                <p className="mt-3 max-w-full truncate text-base font-semibold text-slate-950">
                  {`${firstNameValue || "First"} ${lastNameValue || "Last"}`}
                </p>

                <p className="mt-1 max-w-full truncate text-xs text-muted-foreground">
                  {emailValue || "employee@email.com"}
                </p>

                <div className="mt-3 rounded-full border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {getPositionLabel(positionValue)}
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-xs text-muted-foreground">
                <div className="rounded-2xl border bg-white p-3">
                  <p className="font-semibold text-slate-800">Account note</p>
                  <p className="mt-1">
                    The employee will be onboarded under the current active
                    organization.
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-3">
                  <p className="font-semibold text-slate-800">Selected role</p>
                  <p className="mt-1">
                    {
                      positionOptions.find(
                        (option) => option.value === positionValue,
                      )?.helper
                    }
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <DialogFooter className="border-t px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
              className="rounded-xl bg-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!isValid || isSaving}
              className="rounded-xl"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Employee
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}