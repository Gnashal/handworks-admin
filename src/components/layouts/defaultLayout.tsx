import Sidebar from "../navigation/sideNav";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen w-full">
      <Sidebar />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
