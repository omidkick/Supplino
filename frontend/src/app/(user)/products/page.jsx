export const metadata = {
  title: "محصولات | ساپلینو",
  description: "",
};

// Imports
import { Suspense } from "react";
import { getAllCategories } from "@/services/categoryService";
import ProductsList from "./_components/ProductsList";
import Fallback from "@/ui/Fallback";
import Search from "@/ui/Search";
import TypeFilter from "./_components/TypeFilter";
import CategoryFilter from "./_components/CategoryFilter";
import SortProducts from "./_components/SortProducts";
import MobileFilterButtons from "./_components/MobileFilterButtons";
import { getAllProducts } from "@/services/productService";
import queryString from "query-string";
import ClearFilters from "./_components/ClearFilters";
import { cookies } from "next/headers";
import { toStringCookies } from "@/utils/toStringCookies";
import Pagination from "@/ui/Pagination";
import Loader from "@/ui/Loader";

export const dynamic = "force-dynamic";

async function Products({ searchParams }) {
  const cookieStore = await cookies();
  const strCookies = toStringCookies(cookieStore);
  
  // Await searchParams first
  const resolvedSearchParams = await searchParams;

  const queries = queryString.stringify(resolvedSearchParams);
  const { products, totalPages, currentPage, itemsPerPage, totalCount } = await getAllProducts(queries, strCookies);

  // Only fetch categories synchronously since CategoryFilter needs them immediately
  const { categories } = await getAllCategories();

  // Results count
  const resultsCount = products.length;

  return (
    <div className="lg:p-1 mb-8">
      {/* Title Page + Search Input */}
      <div className="flex flex-col md:flex-row items-center justify-between text-secondary-800 gap-y-6 mb-6 md:mb-12 mt-8 md:mt-2">
        <h1 className="font-extrabold text-xl md:text-2xl">صفحه محصولات</h1>
        <Search />
      </div>

      {/* Mobile Filter Buttons */}
      <MobileFilterButtons
        TypeFilter={TypeFilter}
        CategoryFilter={CategoryFilter}
        SortProducts={SortProducts}
        categories={categories}
        resultsCount={resultsCount}
      />

      <div className="grid grid-cols-12 gap-8">
        {/* Desktop Sidebar Container */}
        <div className="col-span-12 lg:col-span-3 lg:pl-8 space-y-4 flex-col hidden lg:flex">
          <ClearFilters />
          <div className="flex-shrink-0 w-full">
            <TypeFilter />
          </div>
          <div className="flex-shrink-0 w-full">
            <CategoryFilter categories={categories} />
          </div>
          <div className="flex-shrink-0 w-full">
            <SortProducts />
          </div>
        </div>

        {/* ProductsList + Pagination */}
        <div className="col-span-12 lg:col-span-9 text-secondary-500">
          <Suspense
            fallback={<Loader />}
            key={JSON.stringify(resolvedSearchParams)}
          >
            <ProductsList
              searchParams={resolvedSearchParams}
              products={products}
              categories={categories}
              totalCount={totalCount}
            />
          </Suspense>

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
      </div>
    </div>
  );
}

export default Products;