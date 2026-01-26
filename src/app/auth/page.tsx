"use client";

import { Suspense, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Login from "@/components/auth/loginForm";

export default function LoginPage() {
  const { isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
  }, [isLoaded]);

  return (
    <div className="w-full flex items-center justify-center">
      <Suspense fallback={<div>Loading login...</div>}>
        <Login />
      </Suspense>
    </div>
  );
}
