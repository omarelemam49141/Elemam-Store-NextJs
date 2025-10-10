import { Button } from "@/components/ui/button";
import ThemeToggler from "../theme-toggler";
import Link from "next/link";
import { BaggageClaim, User, EllipsisVerticalIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavBarMenu = () => {
  return (
    <>
      {/* start medium screen navbar menu */}
      <div className="hidden md:flex gap-3">
        <ThemeToggler />

        <Button variant="ghost" asChild className="cart nav-item flex">
          <Link href="/cart">
            <BaggageClaim />
            <span>Cart</span>
          </Link>
        </Button>

        <Button asChild className="cart nav-item flex">
          <Link href="/sign-in">
            <User />
            <span>Sign In</span>
          </Link>
        </Button>
      </div>
      {/* end medium screen navbar menu */}

      {/* start small screen navbar menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <EllipsisVerticalIcon />
          </SheetTrigger>
          <SheetContent className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-2 px-4">
              <ThemeToggler />

              <Button variant="ghost" asChild className="cart nav-item flex">
                <Link href="/cart">
                  <BaggageClaim />
                  <span>Cart</span>
                </Link>
              </Button>

              <Button
                asChild
                className="cart nav-item flex justify-center w-fit mx-auto"
              >
                <Link href="/login">
                  <User />
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      {/* end small screen navbar menu */}
    </>
  );
};

export default NavBarMenu;
