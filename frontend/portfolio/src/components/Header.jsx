"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <a href="#hero" className="font-bold tracking-tight text-lg">
          <span className="text-primary">DevOps</span> Portfolio
        </a>
        <div className="flex items-center space-x-2">
          <SunIcon />
          <Switch
            id="theme-switch"
            checked={theme === "dark"}
            onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          />
          <MoonIcon />
        </div>
      </div>
    </header>
  );
}

export default Header;