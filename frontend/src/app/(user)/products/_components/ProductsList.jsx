import { toPersianDigits } from "@/utils/numberFormatter";
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import ProductCard from "./ProductCard";

async function ProductsList({
  searchParams,
  products,
  categories,
  totalCount,
}) {
  // console.log(products);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check if any filters are active (excluding pagination params)
  const hasActiveFilters =
    searchParams &&
    Object.keys(searchParams).some(
      (key) =>
        key !== "page" &&
        key !== "limit" &&
        searchParams[key] &&
        searchParams[key].toString().trim() !== ""
    );

  // Get active filter information
  const getActiveFiltersInfo = () => {
    if (!searchParams || !hasActiveFilters) return [];

    const filters = [];

    // Exclude pagination parameters from active filters
    if (searchParams.search && searchParams.search.trim() !== "") {
      filters.push({ label: "جستجو", value: `"${searchParams.search}"` });
    }

    if (searchParams.category && searchParams.category.trim() !== "") {
      // Handle multiple category values (comma-separated)
      const categoryValues = searchParams.category.split(",");

      const categoryTitles = categoryValues.map((englishTitle) => {
        const category = categories.find(
          (cat) => cat.englishTitle === englishTitle
        );
        return category ? category.title : englishTitle;
      });

      filters.push({
        label: "دسته بندی ها",
        value: categoryTitles.join("، "),
      });
    }

    if (searchParams.type && searchParams.type.trim() !== "") {
      const typeLabels = {
        discounted: "تخفیف دار",
        "no-discount": "بدون تخفیف",
        "in-stock": "موجود",
        "out-of-stock": "ناموجود",
        "high-rated": "امتیاز بالا",
        "new-arrivals": "جدیدترین",
      };

      // Handle multiple type values (comma-separated)
      const typeValues = searchParams.type.split(",");
      const typeLabelsArray = typeValues.map(
        (type) => typeLabels[type] || type
      );

      filters.push({
        label: "نوع محصولات",
        value: typeLabelsArray.join("، "),
      });
    }

    if (searchParams.sort && searchParams.sort.trim() !== "") {
      const sortLabels = {
        latest: "جدید ترین",
        earliest: "قدیمی ترین",
        popular: "محبوب ترین",
        "price-low": "ارزان ترین",
        "price-high": "گران ترین",
        rating: "بالاترین امتیاز",
        discount: "بیشترین تخفیف",
      };
      filters.push({
        label: "مرتب سازی",
        value: sortLabels[searchParams.sort] || searchParams.sort,
      });
    }

    return filters;
  };

  const activeFilters = getActiveFiltersInfo();

  return (
    <div className="space-y-6">
      {/* Results Summary - ONLY show when filters are active */}
      {hasActiveFilters && (
        <div className="border-r-4 border-primary-400 bg-primary-50/50 rounded-lg p-4">
          {products.length === 0 ? (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                <HiOutlineExclamationCircle className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-1">
                  هیچ محصولی یافت نشد
                </h3>
                <p className="text-sm text-secondary-600 mb-3">
                  متاسفانه محصولی با مشخصات درخواستی پیدا نشد
                </p>
                {activeFilters.length > 0 && (
                  <div className="text-xs text-secondary-500">
                    <span className="font-medium">فیلترهای اعمال شده: </span>
                    {activeFilters.map((filter, index) => (
                      <span key={index}>
                        {filter.label}: {filter.value}
                        {index < activeFilters.length - 1 && " • "}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <HiOutlineCheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-secondary-800">
                    {/* Show TOTAL count of matching products, not just current page */}
                    {toPersianDigits(totalCount)} محصول
                  </h3>
                  {hasActiveFilters && (
                    <span className="text-sm text-secondary-600">
                      با فیلترهای اعمال شده
                    </span>
                  )}
                </div>

                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary-100 border border-primary-200 rounded-full text-primary-700"
                      >
                        <span className="text-secondary-400">
                          {filter.label}:
                        </span>
                        <span className="font-medium">{filter.value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Cards */}
      {products.length > 0 && (
        <div className="grid grid-cols-12 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="col-span-12 sm:col-span-6 lg:col-span-4 border border-secondary-300 rounded-lg hover:shadow-md transition-shadow"
            >
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsList;
