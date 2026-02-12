import { z } from "zod";

export const createEmployeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
