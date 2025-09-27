"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { HiOutlineX } from "react-icons/hi";

function ClearFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Define which parameters to keep (pagination parameters)
  const parametersToKeep = ["page", "limit"];

  // Check if any filter parameters are active (excluding pagination params)
  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key]) => !parametersToKeep.includes(key)
  );

  if (!hasActiveFilters) {
    return null;
  }

  const clearAllFilters = () => {
    // Create new URLSearchParams with only pagination parameters
    const newParams = new URLSearchParams();

    // Keep only page and limit parameters
    parametersToKeep.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        newParams.set(param, value);
      }
    });

    // Navigate to the new URL with only pagination parameters
    const queryString = newParams.toString();
    router.push(`${pathname}${queryString ? "?" + queryString : ""}`);
  };

  return (
    <div className="mb-1">
      <button
        onClick={clearAllFilters}
        className="flex items-center gap-2 px-2 py-1 text-[10px] lg:text-xs font-medium text-error border border-error rounded-lg hover:bg-error hover:text-white transition-colors"
      >
        <HiOutlineX className="w-4 h-4" />
        پاک کردن همه فیلترها
      </button>
    </div>
  );
}

export default ClearFilters;
