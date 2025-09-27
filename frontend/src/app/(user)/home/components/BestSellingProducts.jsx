import { Suspense } from "react";
import { getAllProducts } from "@/services/productService";
import BestSellingSlider from "./BestSellingSlider";
import Loader from "@/ui/Loader";
import { MdChevronLeft } from "react-icons/md";
import { RiShoppingCartFill } from "react-icons/ri";
import SectionHeader from "@/ui/SectionHeader";

// This component only handles the data fetching
async function BestSellingProductsContent() {
  const data = await getAllProducts();
  const { products } = data || {};

  const bestSellingProducts =
    products
      ?.filter((product) => product.saleCount > 0)
      .sort((a, b) => b.saleCount - a.saleCount)
      .slice(0, 7) || [];

  return <BestSellingSlider products={bestSellingProducts} />;
}

// The main component
function BestSellingProducts() {
  return (
    <div className="max-w-screen-xl mx-auto my-8 md:px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 lg:px-0 gap-y-2">
        <SectionHeader icon={RiShoppingCartFill} title="پرفروش‌ترین محصولات" />

        <a
          href="/products?sort=popular"
          className="text-primary-700 hover:text-primary-800 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          مشاهده همه
          <MdChevronLeft className="w-5 h-5 " />
        </a>
      </div>

      {/* Slider */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64 bg-secondary-100 rounded-3xl lg:mx-12">
            <Loader message="در حال بارگذاری پرفروش‌ترین محصولات..." />
          </div>
        }
      >
        <BestSellingProductsContent />
      </Suspense>
    </div>
  );
}

export default BestSellingProducts;
