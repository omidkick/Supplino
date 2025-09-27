import Loader from "@/ui/Loader";
import Search from "@/ui/Search";
import { Suspense } from "react";
import CategoriesList from "./_components/CategoriesList";
import { AddNewCategory } from "./_components/CategoryActionButtons";

async function CategoriesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  return (
    <div>
      {/* Title and Search*/}
      <div className="flex flex-col md:flex-row items-center justify-between text-secondary-800 gap-y-6 mb-6 md:mb-12 mt-8 md:mt-2">
        <h1 className="font-extrabold text-xl md:text-2xl order-1">
          لیست دسته بندی ها
        </h1>
        <div className="order-3 md:order-2">
          <Search />
        </div>
        <div className="order-2 md:order-3">
          <AddNewCategory />
        </div>
      </div>

      <Suspense
        fallback={<Loader />}
        key={JSON.stringify(resolvedSearchParams)}
      >
        <CategoriesList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}

export default CategoriesPage;
