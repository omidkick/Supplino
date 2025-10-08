"use client";

import NavLink from "@/components/NavLink";
import { toPersianDigits } from "@/utils/numberFormatter";
import { HiShoppingCart } from "react-icons/hi2";

const MobileBottomNav = ({ user, cartItemsCount, navLinks, isLoading }) => {
  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-50 bg-secondary-100 dark:bg-secondary-50 rounded-t-2xl border-t dark:border-secondary-200 border-secondary-300 shadow-sm md:hidden ${
        isLoading ? "blur-sm opacity-70" : "opacity-100 blur-0"
      }`}
    >
      <ul className="flex justify-around items-center px-4 py-2">
        {navLinks.map((link) => (
          <li key={link.id}>
            <NavLink
              path={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-sm transition-all duration-150 ${
                  isActive
                    ? "text-primary-600 scale-105 font-medium"
                    : "text-secondary-700 hover:scale-105"
                }`
              }
            >
              <link.icon className="w-6 h-6 mb-0.5" />
              {link.children}
            </NavLink>
          </li>
        ))}

        {/* Cart Link */}
        <li>
          <NavLink
            path="/cart"
            className={({ isActive }) =>
              `relative flex flex-col items-center text-sm transition-all duration-150 ${
                isActive
                  ? "text-primary-600 scale-105 font-medium"
                  : "text-secondary-700 hover:scale-105"
              }`
            }
          >
            <HiShoppingCart className="w-6 h-6 mb-0.5" />
            سبد
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {toPersianDigits(cartItemsCount)}
              </span>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
