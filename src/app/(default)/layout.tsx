"use client";

import DefaultLayout from "@/components/layouts/defaultLayout";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, orgId, orgRole, userId } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/auth");
      return;
    }
    if (!orgId || !orgRole || orgRole !== "org:admin") {
      (async () => {
        await signOut();
        toast.warning(
          "You do not have access to this application. Please contact your administrator.",
        );
        router.replace("/auth");
      })();
      return;
    }
  }, [isLoaded, isSignedIn, orgId, orgRole, userId, router, signOut]);

  if (!isLoaded) return null;

  return <DefaultLayout>{children}</DefaultLayout>;
}
