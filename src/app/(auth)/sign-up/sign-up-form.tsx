"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpServerAction } from "@/lib/actions/auth/auth.action";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const SignUpForm = () => {
  //hooks
  const [actionState, action, isPending] = useActionState(SignUpServerAction, {
    success: false,
    message: "",
    data: {
      name: "",
      email: "",
    },
  });

  const callbackUrl = useSearchParams().get("callbackUrl");

  return (
    <form className="space-y-5" action={action}>
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={actionState.data?.name}
        ></Input>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={actionState.data?.email}
        ></Input>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password"></Input>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
        ></Input>
      </div>

      {actionState && !actionState.success && (
        <div className="text-destructive">{actionState.message}</div>
      )}

      <Button className="w-full">
        {isPending ? "Signing up..." : "Sign up"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?
        <Link className="ml-1" href={"/sign-in"}>
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
