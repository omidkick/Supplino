"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { FaArrowRight } from "react-icons/fa";

import useMoveBack from "@/hooks/useMoveBack";

export default function BackButton({ arrowClassName }) {
  const moveBack = useMoveBack();

  return (
    <button
      onClick={moveBack}
      aria-label="بازگشت"
      className="group transition-all duration-200 hover:text-primary-800 text-primary-900"
    >
      <FaArrowRight
        className={`w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ${arrowClassName}`}
      />
    </button>
  );
}
