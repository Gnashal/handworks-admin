"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/adminContext";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function AuthPageUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const { isSignedIn, isLoaded } = useAuth();
  //   const { isAdmin, loading } = useAdmin();
  //   const router = useRouter();
  //   useEffect(() => {
  //     if (!isLoaded || loading) return;
  //     if (isSignedIn && !isAdmin) {
  //       router.push("/");
  //     }
  //   }, [isLoaded, loading, isSignedIn, isAdmin, router]);
  return (
    <Card className="flex w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white"
          />
        </div>

        <Button className="w-full py-2 mt-2" type="submit">
          Sign In
        </Button>
      </CardContent>
    </Card>
  );
}
