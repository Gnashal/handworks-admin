"use client";
import { useAuth } from "@clerk/nextjs";
import { useAdmin } from "@/context/adminContext";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/layouts/defaultLayout";
import AuthLayout from "@/components/layouts/authLayout";

export default function DefaultLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoaded && !loading) {
      setReady(true);
    }
  }, [isLoaded, loading]);

  if (!ready) return <div>Loading...</div>;

  if (!isSignedIn || !isAdmin) return <AuthLayout>{children}</AuthLayout>;

  return <DefaultLayout>{children}</DefaultLayout>;
}
