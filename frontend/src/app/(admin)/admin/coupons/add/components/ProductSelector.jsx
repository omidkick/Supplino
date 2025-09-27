"use client";

import { useState } from "react";
import { toPersianNumbers } from "@/utils/toPersianNumbers";
import { XMarkIcon, TagIcon } from "@heroicons/react/24/outline";

function ProductSelector({
  control,
  errors,
  products,
  isLoadingProducts,
  selectedProducts,
  onProductsChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts =
    products?.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleProductToggle = (productId) => {
    const isSelected = selectedProducts.includes(productId);
    let newSelectedProducts;

    if (isSelected) {
      newSelectedProducts = selectedProducts.filter((id) => id !== productId);
    } else {
      newSelectedProducts = [...selectedProducts, productId];
    }

    onProductsChange(newSelectedProducts);
  };

  const getSelectedProductsInfo = () => {
    return (
      products?.filter((product) => selectedProducts.includes(product._id)) ||
      []
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <label
        htmlFor="product-search"
        className="block text-sm font-semibold text-secondary-400"
      >
        محصولات مشمول تخفیف (اختیاری)
      </label>

      {/* Selected Products Display */}
      {selectedProducts.length > 0 && (
        <div className="bg-secondary-0 border border-secondary-200 rounded-lg p-3 sm:p-4">
          <h4 className="text-sm font-medium text-secondary-900 mb-2">
            محصولات انتخاب شده ({toPersianNumbers(selectedProducts.length)})
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {getSelectedProductsInfo().map((product) => (
              <div
                key={product._id}
                className="bg-primary-100 text-primary-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
              >
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {product.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleProductToggle(product._id)}
                  className="hover:bg-primary-300 rounded-full p-0.5 flex-shrink-0"
                  aria-label={`حذف ${product.title}`}
                >
                  <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Search */}
      <div className="relative">
        <input
          id="product-search"
          type="text"
          placeholder="جستجو در محصولات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 sm:px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors rhf-focus-ring text-sm sm:text-base"
          aria-describedby="product-search-help"
        />
        <TagIcon className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-secondary-400" />
      </div>

      {/* Products List */}
      <div className="border-2 border-secondary-200 rounded-lg max-h-48 sm:max-h-60 overflow-y-auto">
        {isLoadingProducts ? (
          <div className="p-4 text-center text-secondary-500 text-sm">
            در حال بارگذاری محصولات...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="divide-y divide-secondary-100">
            {filteredProducts.map((product) => {
              const isSelected = selectedProducts.includes(product._id);
              const checkboxId = `product-checkbox-${product._id}`; // Unique ID for each checkbox
              return (
                <label
                  key={product._id}
                  htmlFor={checkboxId} // Associate label with checkbox ID
                  className={`flex items-center p-3 hover:bg-secondary-100 cursor-pointer transition-colors
                    ${isSelected ? "bg-primary-100" : ""}`}
                >
                  <input
                    type="checkbox"
                    id={checkboxId} // Unique ID
                    name={`product-${product._id}`} // Unique name for autofill
                    checked={isSelected}
                    onChange={() => handleProductToggle(product._id)}
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 rhf-focus-ring"
                  />
                  <span
                    className={`mr-3 text-sm ${
                      isSelected
                        ? "text-primary-900 font-medium"
                        : "text-secondary-700"
                    }`}
                  >
                    {product.title}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-secondary-500 text-sm">
            {searchTerm ? "محصولی یافت نشد" : "محصولی موجود نیست"}
          </div>
        )}
      </div>

      <p id="product-search-help" className="text-xs text-secondary-500">
        در صورت عدم انتخاب محصول، کد تخفیف برای تمام محصولات اعمال می‌شود
      </p>
    </div>
  );
}

export default ProductSelector;