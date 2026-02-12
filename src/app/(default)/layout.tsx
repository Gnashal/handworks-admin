"use client";
import DefaultLayout from "@/components/layouts/defaultLayout";
import { useAdmin } from "@/context/adminContext";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !isAdmin) {
      router.replace("/auth");
    }
  }, [isLoaded, isSignedIn, router, isAdmin]);

  if (!isLoaded) return null;
  return (
    <>
      <DefaultLayout>{children}</DefaultLayout>
    </>
  );
}
