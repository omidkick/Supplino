// components/PackageSection.jsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "@/ui/SectionHeader";
import { CiGrid42 } from "react-icons/ci";
import { HiChevronLeft } from "react-icons/hi";
import { MdChecklistRtl } from "react-icons/md";

// Package data - name is now an array to support multiple categories
const packages = [
  {
    id: 1,
    name: ["wheyProtein", "creatine", "massGainer"],
    image: "/images/mm-KB-01-3-768x286.png.webp",
  },
  {
    id: 2,
    name: ["fatBurner", "L-Arginine"],
    image: "/images/mm-KB-02.png",
  },
  {
    id: 3,
    name: ["weight-gain", "mass-gainer"],
    image: "/images/mm-KB-03.png",
  },
  {
    id: 4,
    name: ["pre-workout", "energy"],
    image: "/images/mm-KB-04.png",
  },
  {
    id: 5,
    name: ["mass-builders", "creatine"],
    image: "/images/mm-KB-05.webp",
  },
  {
    id: 6,
    name: ["performance", "test-booster"],
    image: "/images/mm-KB-07.webp",
  },
  {
    id: 7,
    name: ["vitamins", "minerals"],
    image: "/images/mm-KB-08.webp",
  },
];

function PackageSection() {
  const router = useRouter();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handlePackageClick = (categoryNames) => {
    // Create URL parameter with multiple categories
    const categoryParam = categoryNames.join(",");
    router.push(`/products?category=${categoryParam}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Split packages into rows for desktop layout
  const row1Packages = packages.slice(0, 2);
  const row2Packages = packages.slice(2, 5);
  const row3Packages = packages.slice(5, 7);

  return (
    <section className="max-w-screen-xl mx-auto my-12 md:px-4 mb-20 lg:mb-28">
      {/* Header */}
      <div className="mb-4 md:mb-6 px-4 lg:px-0">
        <SectionHeader icon={MdChecklistRtl} title=" بر اساس هدف " />
      </div>

      {/* Packages Container */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="flex flex-col gap-4 md:gap-6"
      >
        {/* Row 1 - 2 images */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          {row1Packages.map((pkg) => (
            <div key={pkg.id} className="flex-1 min-w-0">
              <PackageItem
                pkg={pkg}
                variants={itemVariants}
                onClick={handlePackageClick}
              />
            </div>
          ))}
        </div>

        {/* Row 2 - 3 images */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          {row2Packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex-1 min-w-0 sm:max-w-[calc(33.333%-1rem)]"
            >
              <PackageItem
                pkg={pkg}
                variants={itemVariants}
                onClick={handlePackageClick}
              />
            </div>
          ))}
        </div>

        {/* Row 3 - 2 images */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          {row3Packages.map((pkg) => (
            <div key={pkg.id} className="flex-1 min-w-0">
              <PackageItem
                pkg={pkg}
                variants={itemVariants}
                onClick={handlePackageClick}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

//  package item
const PackageItem = ({ pkg, variants, onClick }) => (
  <motion.div
    variants={variants}
    whileHover={{
      y: -4,
      transition: { duration: 0.2 },
    }}
    className="relative group transition-all duration-300 cursor-pointer flex justify-center"
    onClick={() => onClick(pkg.name)}
  >
    <div className="relative w-full" style={{ height: "auto" }}>
      <Image
        src={pkg.image}
        alt={pkg.name.join(", ")}
        width={400}
        height={300}
        className="object-contain w-full h-auto"
      />

      {/* Click indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-primary-700/90 rounded-full p-2">
          <HiChevronLeft className="text-white w-8 h-8" />
        </div>
      </div>
    </div>
  </motion.div>
);

export default PackageSection;
