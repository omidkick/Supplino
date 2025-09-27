"use client";

import { generatePagination } from "@/utils/generatePagination";
import { toPersianDigits } from "@/utils/numberFormatter";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pagination({
  totalPages,
  currentPage: serverCurrentPage,
  itemsPerPage: serverItemsPerPage,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use client-side values when available, fallback to server props
  const [currentPage, setCurrentPage] = useState(serverCurrentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(serverItemsPerPage || 9);

  // Sync with URL changes
  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlLimit = Number(searchParams.get("limit")) || 9;

    setCurrentPage(urlPage);
    setItemsPerPage(urlLimit);
  }, [searchParams]);

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    params.set("limit", itemsPerPage.toString());
    return `${pathname}${params.toString() ? "?" + params.toString() : ""}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  // Don't show pagination if only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-300">


      {/* info */}
      <div className="flex items-center text-sm md:text-base text-secondary-600">
        صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* Previous Page */}
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
          aria-label="صفحه قبلی"
        />

        {/* Page Numbers */}
        <div className="flex items-center gap-x-1">
          {allPages.map((page, index) => {
            let position;
            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        {/* Next Page */}
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
          aria-label="صفحه بعدی"
        />
      </div>
    </div>
  );
}

function PaginationNumber({ page, href, isActive, position }) {
  const className = classNames(
    "flex h-8 w-8 items-center justify-center text-sm font-medium transition-all duration-200 rounded-full",
    {
      "bg-primary-900 text-white shadow-lg transform scale-110 shadow-primary-200": 
        isActive,
      " text-secondary-600 hover:bg-secondary-200 hover:text-secondary-800":
        !isActive && position !== "middle",
      "text-secondary-400 cursor-default":
        position === "middle",
      "text-xs": typeof page === "number" && page > 99,
    }
  );

  return isActive || position === "middle" ? (
    <div className={className} aria-current="page">
      {typeof page === "number" ? toPersianDigits(page) : page}
    </div>
  ) : (
    <Link
      href={href}
      className={className}
      aria-label={`برو به صفحه ${page}`}

    >
      {typeof page === "number" ? toPersianDigits(page) : page}
    </Link>
  );
}

function PaginationArrow({ href, direction, isDisabled, ariaLabel }) {
  const className = classNames(
    "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
    {
      "text-secondary-300 cursor-not-allowed": isDisabled,
      "text-secondary-600 hover:bg-secondary-200 hover:text-secondary-800": !isDisabled,
    }
  );

  const icon = direction === "left" ? (
    <ChevronLeftIcon className="w-4 h-4" />
  ) : (
    <ChevronRightIcon className="w-4 h-4" />
  );

  return isDisabled ? (
    <div className={className} aria-disabled="true">
      {icon}
    </div>
  ) : (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      scroll={false}
    >
      {icon}
    </Link>
  );
}