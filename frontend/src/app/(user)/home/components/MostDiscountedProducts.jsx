import { Suspense } from "react";
import { getAllProducts } from "@/services/productService";
import MostDiscountedSlider from "./MostDiscountedSlider";
import Loader from "@/ui/Loader";

// This component only handles the data fetching
async function MostDiscountedProductsContent() {
  const data = await getAllProducts();
  const { products } = data || {};

  const mostDiscountedProducts =
    products
      ?.filter((product) => product.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 7) || [];

  return <MostDiscountedSlider products={mostDiscountedProducts} />;
}

// The main component
function MostDiscountedProducts() {
  return (
    <div className="max-w-screen-xl mx-auto my-8 md:px-4">
      {/* Slider */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64 bg-secondary-100 rounded-3xl lg:mx-12">
            <Loader message="در حال بارگذاری پر تخفیف‌ترین محصولات..." />
          </div>
        }
      >
        <MostDiscountedProductsContent />
      </Suspense>
    </div>
  );
}

export default MostDiscountedProducts;
