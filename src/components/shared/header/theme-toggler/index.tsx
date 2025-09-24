"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { enTheme } from "@/enums/themes.enum";

//methods
function getThemeIcon(theme: enTheme | undefined): React.ReactNode {
  if (theme == enTheme.eDark) {
    return <MoonIcon />;
  } else if (theme == enTheme.eLight) {
    return <SunIcon />;
  }

  return <SunMoonIcon />;
}

const ThemeToggler = () => {
  //hooks
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="focus-visible:ring-0">
            {getThemeIcon(theme as enTheme)}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-background z-50">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={theme == enTheme.eSystem}
            onClick={() => setTheme(enTheme.eSystem)}
          >
            System
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme == enTheme.eLight}
            onClick={() => setTheme(enTheme.eLight)}
          >
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme == enTheme.eDark}
            onClick={() => setTheme(enTheme.eDark)}
          >
            Dark
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ThemeToggler;
