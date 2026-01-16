"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-card hover:bg-accent transition-colors">
        <Sun className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="w-5 h-5" />;
      case "light":
        return <Sun className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
      title="Click to change"
    >
      <span className="text-foreground">{getIcon()}</span>
    </button>
  );
}
