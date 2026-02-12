"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/registerHook";
import { IVerifyEmailRequest } from "@/types/account";
export function PopupEmailVerify({
  onClose,
  pendingUserData,
}: {
  onClose: () => void;
  pendingUserData: IVerifyEmailRequest | null;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleVerify, handleResend } = useRegister();

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const status = await handleVerify(pendingUserData, code);

    if (status === "complete") {
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <form onSubmit={onVerify} className="space-y-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold">Verify Your Email</h2>
          <p>Enter the code sent to your email to complete your signup.</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification code"
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-highlight text-black p-2 rounded-md"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="w-full mt-2 text-sm  underline"
          >
            Resend Code
          </button>
        </form>
      </div>
    </div>
  );
}
