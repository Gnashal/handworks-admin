"use client";
import { useAdmin } from "@/context/adminContext";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  useEffect(() => {
    if (!isLoaded || loading) return;
    if (!isSignedIn || !isAdmin) {
      router.push("/auth");
    }
  }, [isLoaded, loading, isSignedIn, isAdmin, router]);
  return <div>Dashboard Page</div>;
}
