"use client";
import Sidebar from "../navigation/sideNav";
import { useAuth } from "@clerk/nextjs";
import Loader from "../loader";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <Loader />;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-cover bg-center bg-no-repeat">
        {children}
      </div>
    </div>
  );
}
