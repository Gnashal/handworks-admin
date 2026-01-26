import AuthLayout from "../../components/layouts/authLayout";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthLayout>{children}</AuthLayout>
    </>
  );
}
