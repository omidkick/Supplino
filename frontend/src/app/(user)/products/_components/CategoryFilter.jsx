"use client";

// Imports
import CheckBox from "@/ui/CheckBox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react"; // Add useEffect
import { HiViewGrid, HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

function CategoryFilter({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category")?.split(",") || []
  );

  // Sync selectedCategories with URL when it changes
  useEffect(() => {
    const categoriesFromUrl = searchParams.get("category")?.split(",") || [];
    setSelectedCategories(categoriesFromUrl);

    // Close dropdown when category filter is cleared
    if (categoriesFromUrl.length === 0) {
      setIsOpen(false);
    }
  }, [searchParams]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      if (value.length > 0) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const categoryHandler = (e) => {
    const value = e.target.value;
    let newCategories;

    if (selectedCategories.includes(value)) {
      newCategories = selectedCategories.filter((c) => c !== value);
    } else {
      newCategories = [...selectedCategories, value];
    }

    setSelectedCategories(newCategories);

    const queryString = createQueryString("category", newCategories);
    router.push(pathname + (queryString ? "?" + queryString : ""));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Animation variants
  const dropdownVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.4,
          ease: [0.04, 0.62, 0.23, 0.98],
        },
        opacity: {
          duration: 0.3,
          delay: 0.1,
        },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.4,
          ease: [0.04, 0.62, 0.23, 0.98],
        },
        opacity: {
          duration: 0.25,
        },
      },
    },
  };

  const chevronVariants = {
    open: {
      rotate: 180,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    closed: {
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  return (
    <div>
      {/* Category Section */}
      <div className="w-full bg-secondary-0 rounded-xl">
        {/* Header */}
        <div
          className="p-4 cursor-pointer select-none"
          onClick={toggleDropdown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiViewGrid className="w-5 h-5 text-secondary-500" />
              <span className="font-medium text-secondary-900">
                دسته بندی ها
              </span>
            </div>
            <motion.div
              variants={chevronVariants}
              animate={isOpen ? "open" : "closed"}
              className="text-secondary-500"
            >
              <HiChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* Dropdown Content */}
        <motion.div
          variants={dropdownVariants}
          animate={isOpen ? "open" : "closed"}
          initial="closed"
          className="overflow-hidden px-4"
        >
          <div
            className={`py-4 space-y-3 ${
              isOpen ? "border-t-2 border-secondary-200" : ""
            }`}
          >
            <AnimatePresence>
              {isOpen &&
                categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.05,
                        duration: 0.3,
                      },
                    }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <CheckBox
                      id={category._id}
                      value={category.englishTitle}
                      name="product-type"
                      label={category.title}
                      onChange={categoryHandler}
                      checked={selectedCategories.includes(
                        category.englishTitle
                      )}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CategoryFilter;
