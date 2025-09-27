// import { useProductActions } from "@/hooks/useProducts";
import Loader from "@/ui/Loader";
import Search from "@/ui/Search";
import { Suspense } from "react";
import ProductsList from "./_components/ProductsList";
import { AddNewProduct } from "./_components/ProductActionButtons";

async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;


  return (
    <div>
      {/* Title and Search*/}
      <div className="flex flex-col md:flex-row items-center justify-between text-secondary-800 gap-y-6 mb-6 md:mb-12 mt-8 md:mt-2">
        <h1 className="font-extrabold text-xl md:text-2xl order-1">
          لیست محصولات
        </h1>
        <div className="order-3 md:order-2">
          <Search />
        </div>
        <div className="order-2 md:order-3">
          <AddNewProduct />
        </div>
      </div>

      <Suspense
        fallback={<Loader />}
        key={JSON.stringify(resolvedSearchParams)}
      >
        <ProductsList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}

export default ProductsPage;
