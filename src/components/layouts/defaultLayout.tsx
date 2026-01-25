export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <div className="w-full">{children}</div>
    </div>
  );
}
