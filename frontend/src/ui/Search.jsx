"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [searchValue, setSearchValue] = useState("");

  // Initialize search value from URL params
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchValue(currentSearch);
  }, [searchParams]);

  const formSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set("page", "1"); // Reset to first page on new search

    if (searchValue.trim()) {
      newParams.set("search", searchValue.trim());
    } else {
      newParams.delete("search");
    }
    // navigate to a new URL
    router.push(`${pathName}?${newParams.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    setSearchValue("");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("search");
    // newParams.set("page", "1");
    router.push(`${pathName}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <form className="relative w-full md:w-fit" onSubmit={formSubmit}>
      <input
        type="text"
        name="search"
        placeholder="جستجو ..."
        autoComplete="off"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="!bg-secondary-0 textField__input py-3 text-xs  pl-12"
      />

      {/* Search and Clear buttons container */}
      <div className="absolute left-0 top-0 flex h-full items-center ml-3 gap-1">
        {/* Clear button - only show when there's text */}
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="flex items-center hover:text-secondary-600 transition-colors"
          >
            <XMarkIcon className="h-4 text-secondary-400" />
          </button>
        )}

        {/* Search button */}
        <button type="submit" className="flex items-center">
          <MagnifyingGlassIcon className="h-4 text-secondary-400" />
        </button>
      </div>
    </form>
  );
}
