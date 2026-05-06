import { IRegisterRequest, IVerifyEmailRequest } from "@/types/account";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

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
        unsafeMetadata: { role: "admin" },
      });
      const clerkId = clerkRes.createdUserId as string;
      if (clerkRes.unverifiedFields?.includes("email_address")) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        toast.success("Verification email sent. Please check your inbox.");
        return { verificationRequired: true, clerkUserId: clerkId };
      }
      console.error("Clerk signup incomplete:", clerkRes.status);
      toast.error(`Clerk signup not complete. Status: ${clerkRes.status}`);
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
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
        router.push("/home");
        toast.success("Email verified! Welcome aboard.");
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

  return { register, handleVerify, handleResend };
}
