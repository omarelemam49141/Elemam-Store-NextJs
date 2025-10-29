"use server";

import { signIn, signOut } from "@/auth";
import { GenericResponse } from "@/types/shared/generic-response-type";
import { SignInValidation } from "@/validations/auth/sign-in-validation";
import { SignUpValidation } from "@/validations/auth/sign-up-validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ZodError } from "zod";
import { prisma } from "../../db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { MigrateSessionCartToUserAction, RollbackCartMigrationAction } from "../cart/cart-actions";
import { cookies } from "next/headers";
import { CART_ID_SESSION } from "@/lib/constants";
import { redirect } from "next/navigation";

export async function SignUpServerAction(
  prevState: GenericResponse<unknown>,
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

    const user = await prisma.user.create({
      data: {
        name: parsedData.name,
        password: hashedPassword,
        email: parsedData.email,
      },
    });

    // Store original cart state for potential rollback
    const sessionCartId = (await cookies()).get(CART_ID_SESSION)?.value;
    let originalCart = null;
    if (sessionCartId) {
      originalCart = await prisma.cart.findFirst({
        where: { sessionCartId: sessionCartId }
      });
    }

    try {
      // Migrate session cart to user cart before signIn
      await MigrateSessionCartToUserAction(user.id);

      await signIn("credentials", {
        email: parsedData.email,
        password: plainPassword,
      });
    } catch (signInError) {
      // Check if it's a redirect error (successful authentication)
      if (isRedirectError(signInError)) {
        // Authentication succeeded, keep the cart migrated
        throw signInError;
      }
      
      // If it's a real error, rollback the cart migration
      if (originalCart && sessionCartId) {
        await RollbackCartMigrationAction(originalCart.id, sessionCartId);
      }
      throw signInError;
    }

    const response: GenericResponse<unknown> = {
      success: true,
      message: "Sign up successfully!",
    };

    return response;
  } catch (error: unknown) {
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

    const response: GenericResponse<unknown> = {
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

    // Get user ID from the database before signIn (since signIn redirects)
    const user = await prisma.user.findFirst({
      where: { email: signInData.email }
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Store original cart state for potential rollback
    const sessionCartId = (await cookies()).get(CART_ID_SESSION)?.value;
    let originalCart = null;
    if (sessionCartId) {
      originalCart = await prisma.cart.findFirst({
        where: { sessionCartId: sessionCartId }
      });
    }

    try {
      // Migrate session cart to user cart before signIn
      await MigrateSessionCartToUserAction(user.id);

      await signIn("credentials", signInData);
    } catch (signInError) {
      // Check if it's a redirect error (successful authentication)
      if (isRedirectError(signInError)) {
        // Authentication succeeded, keep the cart migrated
        throw signInError;
      }
      
      // If it's a real error, rollback the cart migration
      if (originalCart && sessionCartId) {
        await RollbackCartMigrationAction(originalCart.id, sessionCartId);
      }
      throw signInError;
    }

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
  redirect("/sign-in");
}
