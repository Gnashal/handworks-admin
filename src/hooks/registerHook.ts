import { signUpAdmin } from "@/service";
import {
  IDbRegisterRequest,
  IRegisterRequest,
  IVerifyEmailRequest,
} from "@/types/account";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  const { getToken } = useAuth();

  async function register({
    firstName,
    lastName,
    email,
    password,
  }: IRegisterRequest) {
    if (!isLoaded) return;
    try {
      const clerkRes = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });
      const clerkId = clerkRes.createdUserId as string;
      if (clerkRes.unverifiedFields?.includes("email_address")) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        toast.success("Verification email sent. Please check your inbox.");
        return { verificationRequired: true, clerkUserId: clerkId };
      }
      if (clerkRes.status === "complete" && clerkRes.createdSessionId) {
        await dbRegister({
          email: email,
          firstName: firstName,
          lastName: lastName,
          provider: "email/password",
          clerkId: clerkId,
        }).finally(() => setActive({ session: clerkRes.createdSessionId }));
        return { verificationRequired: false, clerkUserId: clerkId };
      }
      console.error("Clerk signup incomplete:", clerkRes.status);
      toast.error(`Clerk signup not complete. Status: ${clerkRes.status}`);
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }
  async function dbRegister({
    email,
    firstName,
    lastName,
    provider,
    clerkId,
  }: IDbRegisterRequest) {
    const token = await getToken();
    if (!token) {
      console.error("No active session token found");
      toast.error("No active session token found");
      return;
    }
    await signUpAdmin(clerkId, email, firstName, lastName, provider, "admin");
    toast.success("Signed up successfully");
    router.push("/home");
  }
  const handleVerify = async (
    pendingUserData: IVerifyEmailRequest | null,
    code: string,
  ) => {
    if (!isLoaded || !pendingUserData) return;

    try {
      const verificationRes = await signUp.attemptEmailAddressVerification({
        code,
      });
      console.log("Verification response:", verificationRes);

      pendingUserData.clerkUserId = verificationRes.createdUserId as string;

      if (
        verificationRes.status === "complete" &&
        verificationRes.createdSessionId
      ) {
        await setActive({ session: verificationRes.createdSessionId });
        toast.success("Email verified! Welcome aboard.");

        await dbRegister({
          email: pendingUserData.email,
          firstName: pendingUserData.firstName,
          lastName: pendingUserData.lastName,
          provider: "email/password",
          clerkId: pendingUserData.clerkUserId,
        });
        return verificationRes.status;
      } else {
        toast.error(
          "Verification failed. Please check your code and try again.",
        );
        return verificationRes.status;
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return null;
    }
  };
  const handleResend = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("Verification code resent! Check your inbox.");
    } catch (err) {
      console.error("Resend error:", err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return { register, dbRegister, handleVerify, handleResend };
}
