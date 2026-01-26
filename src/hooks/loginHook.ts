import { ILoginRequest } from "@/types/account";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  const { isLoaded, setActive, signIn } = useSignIn();
  const router = useRouter();

  async function login({ email, password }: ILoginRequest) {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      console.error("Error logging in:", err);
    }
  }

  const forgotPassword = async (email: string) => {
    if (!isLoaded) return;
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  };

  async function resetPassword(code: string, newPassword: string) {
    if (!isLoaded) return;
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (attempt.status === "complete") {
        console.log("Password reset success!");
        toast.success(
          "Password reset successful! You can now log in with your new password.",
        );
        router.push("/auth/signin");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }
  return { login, forgotPassword, resetPassword };
}
