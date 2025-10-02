"use client";

import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function DarkModeToggle() {
  const {  setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const isDark = resolvedTheme === "dark";

  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? (
        <HiOutlineSun className="w-7 h-7 text-primary-900" />
      ) : (
        <HiOutlineMoon className="w-7 h-7 text-primary-900" />
      )}
    </button>
  );
}

export default DarkModeToggle;