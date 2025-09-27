import { cookies } from "next/headers";
import { toStringCookies } from "@/utils/toStringCookies";
import queryString from "query-string";
import Empty from "@/ui/Empty";
import { toPersianNumbers } from "@/utils/toPersianNumbers";
import { FiSearch } from "react-icons/fi";
import ProductsTable from "./ProductsTable";
import { getAllProducts } from "@/services/productService";
import Pagination from "@/ui/Pagination";

async function ProductsList({ searchParams }) {
  const cookieStore = await cookies();
  const strCookies = toStringCookies(cookieStore);
  // Await searchParams first
  const resolvedSearchParams = await searchParams;

  const queries = queryString.stringify(resolvedSearchParams);
  const { products, totalPages, currentPage, itemsPerPage, totalCount } =
    await getAllProducts(queries, strCookies);

  // Filter out pagination parameters
  const getFilteredSearchParams = () => {
    if (!resolvedSearchParams) return {};
    
    const filtered = { ...resolvedSearchParams };
    
    // Remove pagination parameters
    delete filtered.page;
    delete filtered.limit;
    
    return filtered;
  };

  const filteredSearchParams = getFilteredSearchParams();
  
  // Check if any non-pagination filters are active
  const hasSearchQuery = Object.keys(filteredSearchParams).length > 0;
  const searchTerm = filteredSearchParams.search || "";

  // Get active filter information (excluding pagination)
  const getActiveFiltersInfo = () => {
    if (!filteredSearchParams || Object.keys(filteredSearchParams).length === 0) 
      return [];

    const filters = [];

    if (filteredSearchParams.search && filteredSearchParams.search.trim() !== "") {
      filters.push({ 
        label: "جستجو", 
        value: `"${filteredSearchParams.search}"` 
      });
    }

    if (filteredSearchParams.category && filteredSearchParams.category.trim() !== "") {
      filters.push({ 
        label: "دسته بندی", 
        value: filteredSearchParams.category 
      });
    }

    if (filteredSearchParams.type && filteredSearchParams.type.trim() !== "") {
      filters.push({ 
        label: "نوع", 
        value: filteredSearchParams.type 
      });
    }

    if (filteredSearchParams.sort && filteredSearchParams.sort.trim() !== "") {
      filters.push({ 
        label: "مرتب سازی", 
        value: filteredSearchParams.sort 
      });
    }

    // Add any other filter parameters you have
    return filters;
  };

  const activeFilters = getActiveFiltersInfo();

  return (
    <div>
      {/* Search Results Info */}
      {hasSearchQuery && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-0 px-4 py-3 text-secondary-700 shadow-sm transition-all duration-300">
          <FiSearch className="mt-1 h-5 w-5 text-primary-600 shrink-0" />
          <div>
            {/* Show search term if available */}
            {searchTerm && (
              <p className="text-base font-medium">
                نتایج جستجو برای:{" "}
                <span className="text-primary-600">"{searchTerm}"</span>
              </p>
            )}
            
            {/* Show other active filters */}
            {activeFilters.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    <span className="text-secondary-400">{filter.label}:</span>
                    {filter.value}
                  </span>
                ))}
              </div>
            )}
            
            <p className="mt-2 text-sm text-secondary-500">
              {toPersianNumbers(totalCount || products.length)} محصول یافت شد
            </p>
          </div>
        </div>
      )}

      {/* Products Table or Empty State */}
      {products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <Empty resourceName="محصولی با این مشخصات" />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}

export default ProductsList;