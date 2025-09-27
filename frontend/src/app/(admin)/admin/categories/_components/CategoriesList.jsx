import { cookies } from "next/headers";
import { toStringCookies } from "@/utils/toStringCookies";
import queryString from "query-string";
import Empty from "@/ui/Empty";
import { toPersianNumbers } from "@/utils/toPersianNumbers";
import { FiSearch } from "react-icons/fi";
// import ProductsTable from "./ProductsTable";
import { getAllCategories } from "@/services/categoryService";
import CategoryTable from "./CategoryTable";

async function CategoriesList({ searchParams }) {
  const cookieStore = await cookies();
  const strCookies = toStringCookies(cookieStore);
  // Await searchParams first
  const resolvedSearchParams = await searchParams;

  const queries = queryString.stringify(resolvedSearchParams);
  const { categories } = await getAllCategories(queries,strCookies);


  // Handle search results
  const hasSearchQuery = Object.keys(searchParams).length > 0;
  const searchTerm = searchParams.search || "";

  return (
    <div>
      {/* Search Results Info */}
      {hasSearchQuery && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-0 px-4 py-3 text-secondary-700 shadow-sm transition-all duration-300">
          <FiSearch className="mt-1 h-5 w-5 text-primary-600 shrink-0" />
          <div>
            {searchTerm && (
              <p className="text-base font-medium">
                نتایج جستجو برای:{" "}
                <span className="text-primary-600">"{searchTerm}"</span>
              </p>
            )}
            <p className="mt-1 text-sm text-secondary-500">
              {toPersianNumbers(categories.length)} دسته بندی یافت شد
            </p>
          </div>
        </div>
      )}

      {/* category Table or Empty State */}
      {categories.length > 0 ? (
        <CategoryTable categories={categories} />
      ) : (
        <Empty resourceName="دسته بندی با این مشخصات" />
      )}
    </div>
  );
}

export default CategoriesList;
