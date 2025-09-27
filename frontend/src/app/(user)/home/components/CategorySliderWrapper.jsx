import { Suspense } from "react";
import { getAllCategories } from "@/services/categoryService";
import CategorySlider from "./CategorySlider";
import Loader from "@/ui/Loader";
import SectionHeader from "@/ui/SectionHeader";
import { MdChevronLeft } from "react-icons/md";
import { RiFolderOpenFill } from "react-icons/ri";
import { CiGrid42 } from "react-icons/ci";


// This component only handles the data fetching
async function CategorySliderContent() {
  const { categories } = await getAllCategories();

  return <CategorySlider categories={categories || []} />;
}

// The main wrapper component
function CategorySliderWrapper() {
  return (
    <div className="max-w-screen-xl mx-auto my-8 md:px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:px-4 lg:px-0 gap-y-2">
        <SectionHeader icon={CiGrid42 } title=" بر اساس دسته بندی" />
      </div>

      {/* Slider */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-40 bg-secondary-100 rounded-xl">
            <Loader message="در حال بارگذاری دسته‌بندی‌ها..." />
          </div>
        }
      >
        <CategorySliderContent />
      </Suspense>
    </div>
  );
}

export default CategorySliderWrapper;
