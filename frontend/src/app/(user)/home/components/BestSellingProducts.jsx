import BestSellingSlider from "./BestSellingSlider";
import { MdChevronLeft } from "react-icons/md";
import { RiShoppingCartFill } from "react-icons/ri";
import SectionHeader from "@/ui/SectionHeader";

function BestSellingProducts({ products }) {
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
      <BestSellingSlider products={products} />
    </div>
  );
}

export default BestSellingProducts;
