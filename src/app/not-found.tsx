import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex-col gap-3 flex-center min-h-screen w-screen">
      <Image
        src="/images/logo.svg"
        alt={APP_NAME + " logo"}
        height={70}
        width={70}
        priority
      ></Image>

      <div className="shadow-lg p-5 flex-center flex-col gap-4 rounded-md border-0">
        <p className="text-destructive">This page was not found</p>

        <Button asChild variant={"outline"}>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
