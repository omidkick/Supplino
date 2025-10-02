"use client";

import useOutsideClick from "@/hooks/useOutsideClick";
import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";

function Modal({ open, onClose, title, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Manage visibility and closing transition
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      const timeout = setTimeout(onClose, 700);
      return () => clearTimeout(timeout);
    }
  }, [open, onClose]);

  // Outside click detection
  const ref = useOutsideClick(() => {
    setIsVisible(false);
    setTimeout(onClose, 700);
  });

  if (!open && !isVisible) return null;

  return (
    <>
      {/* Desktop Modal */}
      {!isMobile && (
        <div
          className={`fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-sm bg-secondary-800 bg-opacity-30 transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            ref={ref}
            className={`fixed top-1/2 left-1/2 w-[calc(100vw-2rem)] md:max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto
              -translate-x-1/2 -translate-y-1/2 rounded-lg bg-secondary-0 p-4 shadow-lg transition-all duration-400 ease-out
              ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div className="flex items-center justify-between border-b border-b-secondary-300 pb-2 mb-6">
              <p className="text-secondary-700 font-bold text-base">{title}</p>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 400);
                }}
              >
                <HiOutlineX className="w-5 h-5 text-secondary-500 hover:text-error" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}

      {/* Mobile Modal (Bottom Sheet style) */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 bg-secondary-800 bg-opacity-50 transition-opacity duration-700 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            ref={ref}
            className={`fixed inset-x-0 bottom-0  bg-secondary-0 rounded-t-2xl p-4 shadow-lg transform transition-all duration-700 ease-out 
              ${
                isVisible ? "translate-y-0" : "translate-y-full"
              } max-h-[calc(100vh-7rem)] overflow-y-auto mt-10`}
          >
            <div className="flex justify-between items-center mb-8 border-b border-b-secondary-300 pb-4 ">
              <p className="text-secondary-700 font-bold text-base ">{title}</p>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 400);
                }}
              >
                <HiOutlineX className="w-5 h-5 text-secondary-500 hover:text-error" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
