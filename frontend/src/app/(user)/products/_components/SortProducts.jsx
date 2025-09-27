"use client";

// Imports
import RadioInput from "@/ui/RadioInput";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react"; 
import { HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { LuArrowUpDown } from "react-icons/lu";

function SortProducts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "latest"
  );

  // Sync selectedSort with URL when it changes
  useEffect(() => {
    const sortFromUrl = searchParams.get("sort") || "latest";
    setSelectedSort(sortFromUrl);

    // Close dropdown when sort is reset to default
    if (sortFromUrl === "latest") {
      setIsOpen(false);
    }
  }, [searchParams]);

  // Available sort options
  const sortOptions = [
    {
      id: 1,
      value: "latest",
      label: "جدید ترین",
    },
    {
      id: 2,
      value: "earliest",
      label: "قدیمی ترین",
    },
    {
      id: 3,
      value: "popular",
      label: "محبوب ترین",
    },
    {
      id: 4,
      value: "price-low",
      label: "ارزان ترین",
    },
    {
      id: 5,
      value: "price-high",
      label: "گران ترین",
    },
    {
      id: 6,
      value: "rating",
      label: "بالاترین امتیاز",
    },
    {
      id: 7,
      value: "discount",
      label: "بیشترین تخفیف",
    },
  ];
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const sortHandler = (e) => {
    const value = e.target.value;
    setSelectedSort(value);

    const queryString = createQueryString("sort", value);
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
    <div className="w-full bg-secondary-0 rounded-xl">
      {/* Header */}
      <div className="p-4 cursor-pointer select-none" onClick={toggleDropdown}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LuArrowUpDown className="w-5 h-5 text-secondary-500" />
            <span className="font-medium text-secondary-900">مرتب سازی</span>
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
              sortOptions.map((option, index) => (
                <motion.div
                  key={option.value}
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
                  <RadioInput
                    id={option.value}
                    value={option.value}
                    name="product-sort"
                    label={option.label}
                    onChange={sortHandler}
                    checked={selectedSort === option.value}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default SortProducts;
