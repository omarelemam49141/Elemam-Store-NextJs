import { auth } from "@/auth";
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
import Link from "next/link";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

const SignUpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const { callbackUrl } = await searchParams;

  const session = await auth();
  if (session) {
    return redirect(callbackUrl || "/");
  }

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

          <CardTitle>Sign Up</CardTitle>

          <CardDescription>Register a new account</CardDescription>
        </CardHeader>

        <CardContent>
          <SignUpForm></SignUpForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
