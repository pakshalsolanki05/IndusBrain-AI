"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl border
        bg-white
        hover:bg-slate-100
        dark:bg-slate-800
        dark:border-slate-700
        dark:hover:bg-slate-700
        transition-all
      "
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}
    </button>
  );
}