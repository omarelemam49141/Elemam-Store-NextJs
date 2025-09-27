import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import NavBarMenu from "./navbar-menu";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <nav className="shadow-lg dark:border-b-grey-50 dark:border-b-1">
        <div className="wrapper flex-between ">
          <Link href={"/"}>
            <div className="flex-center gap-4">
              <Image
                alt={APP_NAME + " logo"}
                src="/images/logo.svg"
                width="40"
                height="40"
                suppressHydrationWarning
              ></Image>

              <h1 className="hidden lg:block font-bold text-xl">
                Elemam Store
              </h1>
            </div>
          </Link>

          <div className="flex gap-4">
            <NavBarMenu />
          </div>
        </div>
      </nav>
    </>
  );
}
