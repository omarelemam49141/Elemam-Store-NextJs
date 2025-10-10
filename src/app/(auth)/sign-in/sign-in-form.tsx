import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const SignInForm = () => {
  return (
    <form className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email"></Input>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password"></Input>
      </div>

      <Button className="w-full">Sign in</Button>

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
