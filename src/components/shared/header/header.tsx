import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { BaggageClaim } from "lucide-react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeToggler from "./theme-toggler/theme.toggler";

export default function Header() {
  return (
    <>
      <nav className="shadow-lg dark:border-b-grey-50 dark:border-b-1">
        <div className="wrapper flex-between ">
          <div className="flex-center gap-4">
            <Image
              alt={APP_NAME + " logo"}
              src="/images/logo.svg"
              width="40"
              height="40"
              suppressHydrationWarning
            ></Image>

            <h1 className="hidden lg:block font-bold text-xl">Elemam Store</h1>
          </div>

          <div className="flex gap-4">
            <ThemeToggler />

            <Button variant="ghost" asChild className="cart nav-item flex">
              <Link href="/cart">
                <BaggageClaim />
                <span>Cart</span>
              </Link>
            </Button>

            <Button asChild className="cart nav-item flex">
              <Link href="/login">
                <User />
                <span>Sign In</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
