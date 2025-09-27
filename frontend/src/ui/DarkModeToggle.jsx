"use client";

import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const isDark = resolvedTheme === "dark";

  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? (
        <HiOutlineSun className="w-6 h-6 md:w-7 md:h-7 text-primary-900" />
      ) : (
        <HiOutlineMoon className="w-6 h-6 md:w-7 md:h-7 text-primary-900" />
      )}
    </button>
  );
}

export default DarkModeToggle;