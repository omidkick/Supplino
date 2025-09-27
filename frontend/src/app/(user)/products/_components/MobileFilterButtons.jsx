"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineFilter, HiOutlineSortAscending } from "react-icons/hi";
import Modal from "@/ui/Modal";
import Button from "@/ui/Button";
import ClearFilters from "./ClearFilters";

function MobileFilterButtons({
  TypeFilter,
  CategoryFilter,
  SortProducts,
  categories,
  resultsCount,
}) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const router = useRouter();

  const handleClearFilters = () => {
    // Handle clearing filters on the client side
    router.push("/products", { scroll: false });
    setIsFilterModalOpen(false);
  };

  const handleShowResults = () => {
    setIsFilterModalOpen(false);
  };

  const handleSortApply = () => {
    setIsSortModalOpen(false);
  };

  return (
    <>
      {/* Mobile Filter Buttons */}
      <div className="flex flex-col">
        <div className="flex gap-4 w-full lg:hidden mb-4">
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary-0 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            <HiOutlineFilter className="w-5 h-5" />
            <span className="font-medium">فیلتر دوره ها</span>
          </button>

          {/* Sort Button */}
          <button
            onClick={() => setIsSortModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary-0 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            <HiOutlineSortAscending className="w-5 h-5" />
            <span className="font-medium">مرتب سازی</span>
          </button>
        </div>
        <div className="mb-4 lg:hidden">
          <ClearFilters />
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="فیلتر دوره ها"
      >
        <div className="space-y-6">
          {/* Type Filter */}
          <TypeFilter />

          {/* Category Filter */}
          <CategoryFilter categories={categories} />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-secondary-200">
            <Button
              variant="primary"
              onClick={handleShowResults}
              className="flex-1 shadow-sm"
            >
              مشاهده {resultsCount} محصول
            </Button>

            <Button
              variant="danger"
              onClick={handleClearFilters}
              className="flex-1"
            >
              حذف فیلتر
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sort Modal */}
      <Modal
        open={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        title="مرتب سازی"
      >
        <div className="space-y-6">
          {/* Sort Options */}
          <div>
            <SortProducts />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-secondary-200">
            <Button
              variant="primary"
              onClick={handleSortApply}
              className="flex-1 shadow-sm"
            >
              اعمال
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsSortModalOpen(false)}
              className="flex-1"
            >
              انصراف
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default MobileFilterButtons;
