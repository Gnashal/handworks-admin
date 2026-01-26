"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface AdminContextType {
  adminId?: string;
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  adminId: undefined,
  isAdmin: false,
  loading: true,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const adminId = user?.publicMetadata?.adminId as string | undefined;
  const isAdmin = Boolean(adminId);

  return (
    <AdminContext.Provider
      value={{
        adminId,
        isAdmin,
        loading: !isLoaded,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
