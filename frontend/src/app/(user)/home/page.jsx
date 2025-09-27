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

async function HomePage() {
  return (
    <>
      <HeroSection />

      <BestSellingProducts />

      <CategorySliderWrapper />

      <PackageSection />

      <FeatureSection />

      <MostDiscountedProducts />

      <WorkoutPlanSection />

      <MostFamousBrands />

      <NutritionPlanSection />

      <SupplementFAQSection />

       <BackToTop />
      
    </>
  );
}

export default HomePage;
