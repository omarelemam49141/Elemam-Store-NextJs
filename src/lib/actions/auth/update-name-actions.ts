"use server";

import { AuthService } from "@/services/auth/auth.service";
import { auth } from "@/auth";

export async function updateUserNameFromEmail() {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session?.user?.email) {
      return { success: false, error: "No active session" };
    }

    // Only update if the user doesn't have a name
    if (!session.user.name) {
      await AuthService.updateUserNameFromEmail(session.user.id, session.user.email);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user name:", error);
    return { success: false, error: "Failed to update user name" };
  }
}
