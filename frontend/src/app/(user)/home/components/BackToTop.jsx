"use client";

import { useState, useEffect, useCallback } from "react";
import { FaChevronUp } from "react-icons/fa6";

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(
    debounce(() => {
      setIsVisible(window.scrollY > 300);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-4 z-50 bg-primary-900 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-800 hover:scale-110 ${
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <FaChevronUp className="w-5 h-5" />
    </button>
  );
}

export default BackToTop;
