import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import DefaultLayoutWrapper from "@/components/layouts/layoutWrapper";
import { AdminProvider } from "@/context/adminContext";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-Arimo",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Handworks Admin",
  description: "Admin dashboard for Handworks Cleaning Services",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AdminProvider>
        <html lang="en">
          <body className={arimo.className}>
            <Toaster position="top-right" />
            <DefaultLayoutWrapper>{children}</DefaultLayoutWrapper>
          </body>
        </html>
      </AdminProvider>
    </ClerkProvider>
  );
}
