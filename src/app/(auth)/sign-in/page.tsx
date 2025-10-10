import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import SignInForm from "./sign-in-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

const SignIn = () => {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <Card>
        <CardHeader className="text-center space-y-2">
          <Link href={"/"}>
            <Image
              src={"/images/logo.svg"}
              alt={`${APP_NAME} logo`}
              width={100}
              height={100}
              priority={true}
              className="mx-auto"
            ></Image>
          </Link>

          <CardTitle>Sign In</CardTitle>

          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <SignInForm></SignInForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
