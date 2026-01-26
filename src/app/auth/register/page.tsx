"use client";

import { Suspense, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { SignUpForm } from "@/components/auth/signUpForm";

export default function SignUpPage() {
  const { isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
  }, [isLoaded]);

  return (
    <div className="w-full flex items-center justify-center">
      <Suspense fallback={<div>Loading signup...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
