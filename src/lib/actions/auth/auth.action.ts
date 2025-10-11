"use server";

import { signIn, signOut } from "@/auth";
import { GenericResponse } from "@/types/shared/generic-response.type";
import { SignInValidation } from "@/validations/auth/sign-in.validation";
import { SignUpValidation } from "@/validations/auth/sign-up.validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ZodError } from "zod";
import { prisma } from "../../../../db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function SignUpServerAction(
  prevState: GenericResponse<any>,
  formData: FormData
) {
  try {
    const parsedData = SignUpValidation.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = parsedData.password;

    const hashedPassword = hashSync(parsedData.password, 10);

    await prisma.user.create({
      data: {
        name: parsedData.name,
        password: hashedPassword,
        email: parsedData.email,
      },
    });

    await signIn("credentials", {
      email: parsedData.email,
      password: plainPassword,
    });

    const response: GenericResponse<any> = {
      success: true,
      message: "Sign up successfully!",
    };

    return response;
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((e) => e.message).join(", "),
        data: {
          name: formData.get("name"),
          email: formData.get("email"),
        },
      };
    }

    const response: GenericResponse<any> = {
      success: false,
      message: "Sign up failed",
      data: {
        name: formData.get("name"),
        email: formData.get("email"),
      },
    };
    return response;
  }
}

export async function SignInServerAction(
  prevState: GenericResponse<null>,
  formData: FormData
) {
  try {
    const signInData = SignInValidation.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", signInData);

    const response: GenericResponse<null> = {
      success: true,
      message: "Signed in successfully!",
    };

    return response;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues.map((e) => e.message).join(", "),
      };
    }

    const response: GenericResponse<null> = {
      success: false,
      message: "Invalid email or password",
    };
    return response;
  }
}

export async function SignOutServerAction() {
  await signOut();
}
