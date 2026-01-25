"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const adminId = user?.publicMetadata?.adminId;
    setIsAdmin(Boolean(adminId));
    console.log("Admin status:", isAdmin);
  }, [isAdmin, isLoaded, user]);

  return (
    <AdminContext.Provider value={{ isAdmin, loading: !isLoaded }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
