import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { AdminProvider } from "../context/adminContext";
import { ReactQueryProvider } from "@/providers/tanstack.query";
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
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <AdminProvider>
          <ReactQueryProvider>
            <body className={arimo.className}>
              <Toaster position="top-right" />
              {children}
            </body>
          </ReactQueryProvider>
        </AdminProvider>
      </ClerkProvider>
    </html>
  );
}
