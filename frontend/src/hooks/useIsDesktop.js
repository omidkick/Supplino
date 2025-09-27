import { useEffect, useState } from "react";

export const useIsDesktop = (minWidth = 1024) => { // 1024px matches Tailwind's lg breakpoint
  // Default to desktop for better UX (most users on desktop won't see flash)
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(window.innerWidth >= minWidth);
    };

    updateMedia(); // This will correct the state immediately after mount
    
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, [minWidth]);

  return isDesktop;
};