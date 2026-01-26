import Header from "../header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}
