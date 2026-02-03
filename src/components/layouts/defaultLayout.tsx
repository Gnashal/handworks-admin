"use client";
import Sidebar from "../navigation/sideNav";
import bgImage from "../../../public/assets/bg/rm222-mind-26.jpg";
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
    <div className="flex h-screen w-full">
      <Sidebar />

      <div
        className="flex flex-1 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage.src})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
