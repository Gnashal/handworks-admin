import { onboardEmployee } from "@/service";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

export default function useEmployee() {
  const [loading, setIsLoading] = useState(false);
  const { getToken, orgId } = useAuth();

  const handleOnboardEmployee = async (
    firstName: string,
    lastName: string,
    email: string,
    position: string,
  ) => {
    const token = await getToken();
    if (!token) {
      toast.error("Not authenticated.");
      return;
    }
    if (!orgId) {
      toast.error("No active organization selected.");
      return;
    }
    try {
      setIsLoading(true);
      const res = await onboardEmployee(token, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        position: position,
        organizationId: orgId,
        role: "employee",
        hireDate: new Date().toISOString(),
      });
      return res.employee;
    } catch (err) {
      console.error("Failed to onboard employee:", err);
      toast.error("Failed to onboard employee.");
    } finally {
      setIsLoading(false);
    }
  };
  return { handleOnboardEmployee, loading };
}
