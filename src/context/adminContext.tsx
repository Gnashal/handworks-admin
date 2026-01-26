"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();

  const isAdmin = Boolean(user?.publicMetadata?.adminId);

  return (
    <AdminContext.Provider
      value={{
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
