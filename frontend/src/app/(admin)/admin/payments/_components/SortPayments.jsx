"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function SortPayments() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "latest";

  const sortOptions = [
    { value: "latest", label: "جدید ترین" },
    { value: "earliest", label: "قدیمی ترین" },
    { value: "amount-high", label: "بیشترین مبلغ" },
    { value: "amount-low", label: "کمترین مبلغ" },
  ];

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1"); 

      if (value && value !== "latest") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (e) => {
    const value = e.target.value;
    const queryString = createQueryString("sort", value);
    router.push(pathname + (queryString ? "?" + queryString : ""));
  };

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="payment-sort"
        className="text-sm font-medium text-secondary-700"
      >
        مرتب سازی:
      </label>
      <select
        id="payment-sort"
        value={currentSort}
        onChange={handleSortChange}
        className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortPayments;
