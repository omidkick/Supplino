import React from "react";
import HeroSection from "./components/HeroSection";
import BestSellingProducts from "./components/BestSellingProducts";
import CategorySliderWrapper from "./components/CategorySliderWrapper";
import PackageSection from "./components/PackageSection";
import MostDiscountedProducts from "./components/MostDiscountedProducts";
import WorkoutPlanSection from "./components/WorkoutPlanSection";
import MostFamousBrands from "./components/MostFamousBrands";
import FeatureSection from "./components/FeatureSection";
import SupplementFAQSection from "./components/SupplementFAQSection";
import NutritionPlanSection from "./components/NutritionPlanSection";
import BackToTop from "./components/BackToTop";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";

// Revalidate every 30 seconds for fresh data
export const revalidate = 30;

async function HomePage() {
  // Fetch all data
  const [productsData, categoriesData] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  // Process data
  const bestSellingProducts =
    productsData.products
      ?.filter((product) => product?.saleCount > 0)
      .sort((a, b) => b.saleCount - a.saleCount)
      .slice(0, 7) || [];

  const mostDiscountedProducts =
    productsData.products
      ?.filter((product) => product.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 7) || [];

  return (
    <>
      <HeroSection />
      <BestSellingProducts products={bestSellingProducts} />
      <CategorySliderWrapper categories={categoriesData.categories || []} />
      <PackageSection />
      <FeatureSection />
      <MostDiscountedProducts products={mostDiscountedProducts} />
      <WorkoutPlanSection />
      <MostFamousBrands />
      <NutritionPlanSection />
      <SupplementFAQSection />
      <BackToTop />
    </>
  );
}

export default HomePage;
