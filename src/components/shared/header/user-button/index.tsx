import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutServerAction } from "@/lib/actions/auth/auth-actions";
import { User } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button
        asChild
        className="cart nav-item flex justify-center w-fit mx-auto"
      >
        <Link href="/sign-in">
          <User />
          <span>Sign In</span>
        </Link>
      </Button>
    );
  }

  const userFirstNameLetter = session.user?.name?.charAt(0).toUpperCase();
  const userName = session.user?.name;
  const userEmail = session.user?.email;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="bg-gray-200 flex-center w-8 h-8 rounded-full cursor-pointer"
          >
            {userFirstNameLetter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent forceMount>
          <DropdownMenuLabel>
            <div className="font-medium text-md">{userName}</div>
            <p className="text-muted-foreground">{userEmail}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={SignOutServerAction}>
              <Button className="w-full" variant="ghost">
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
