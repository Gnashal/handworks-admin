"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLogin } from "@/hooks/loginHook";

interface ResetEmployeePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

export function VerifyEmployeeDialogue({
  open,
  onClose,
  email,
}: ResetEmployeePasswordDialogProps) {
  const { forgotPassword, resetPassword } = useLogin();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"send" | "reset">("send");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await forgotPassword(email);
      setStage("reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await resetPassword(code, password);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Employee Password</DialogTitle>
        </DialogHeader>

        {stage === "send" ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Send a password reset email to{" "}
              <span className="font-medium">{email}</span>. They will receive a
              code to set their password.
            </p>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSendCode} disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enter the code from the email and the new password for this
              employee.
            </p>
            <div>
              <Input
                placeholder="Reset code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleResetPassword}
                disabled={loading || !code || !password}
              >
                {loading ? "Saving..." : "Set Password"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
