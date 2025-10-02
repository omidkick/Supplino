import CategorySlider from "./CategorySlider";
import SectionHeader from "@/ui/SectionHeader";
import { CiGrid42 } from "react-icons/ci";

function CategorySliderWrapper({ categories }) {
  return (
    <div className="max-w-screen-xl mx-auto my-8 md:px-4">
      {/* Header */}
      <div className="mb-4 md:mb-6 px-4 lg:px-0">
        <SectionHeader icon={CiGrid42} title=" بر اساس دسته بندی" />
      </div>

      {/* Slider */}
      <CategorySlider categories={categories} />
    </div>
  );
}

export default CategorySliderWrapper;
