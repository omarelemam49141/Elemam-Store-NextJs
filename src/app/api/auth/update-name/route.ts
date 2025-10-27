import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { AuthService } from "@/services/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await AuthService.updateUserName(session.user.id, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user name:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
