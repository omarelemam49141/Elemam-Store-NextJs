"use server";

import { signIn, signOut } from "@/auth";
import { GenericResponse } from "@/types/shared/generic-response.type";
import { SignInValidation } from "@/validations/auth/sign-in.validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ZodError } from "zod";

export async function SignInServerAction(
  prevState: unknown,
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
