"use client";

import LandingLayout from "@/components/layouts/defaultLayout";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingLayout>{children}</LandingLayout>
    </>
  );
}
