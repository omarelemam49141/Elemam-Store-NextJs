"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInServerAction } from "@/lib/actions/auth/auth-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const SignInForm = () => {
  //hooks
  const [actionState, action, isPending] = useActionState(SignInServerAction, {
    success: false,
    message: "",
  });

  const callbackUrl = useSearchParams().get("callbackUrl");

  return (
    <form className="space-y-5" action={action}>
      {
        callbackUrl && (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        )
      }

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email"></Input>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password"></Input>
      </div>

      {actionState && !actionState.success && (
        <div className="text-destructive">{actionState.message}</div>
      )}

      <Button className="w-full">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?
        <Link className="ml-1" href={"/sign-up"}>
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;
