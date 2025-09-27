"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChevronDown,
  HiUserCircle,
  HiBookmark,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import useOutsideClick from "@/hooks/useOutsideClick";
import NavLink from "@/components/NavLink";
import useLogout from "@/hooks/useLogout";
import { toPersianDigits } from "@/utils/numberFormatter";
import { HiShoppingCart } from "react-icons/hi";

function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));
  const profilePath = user?.role === "ADMIN" ? "/admin" : "/profile";

  const { isLoggingOut, logoutFn } = useLogout();
  const logoutHandler = () => {
    logoutFn();
    setIsOpen(false);
  };

  // Create a function that handles the click and closes the dropdown
  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  if (!user) return null;

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -15, scale: 0.7 },
  };

  const chevronVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <div className="relative" ref={ref}>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 p-2 rounded-lg text-secondary-500 hover:text-primary-700 hover:bg-secondary-200 transition md:text-base text-sm"
      >
        <HiUserCircle className="w-7 h-7" />
        <motion.div
          variants={chevronVariants}
          animate={isOpen ? "open" : "closed"}
        >
          <HiChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 md:-left-2 top-11 mt-2 w-52 bg-secondary-50 border border-secondary-200 rounded-xl shadow-lg p-4 z-20"
          >
            {/* User Personal Info */}
            <div className="flex items-center gap-3 border-b border-secondary-200 pb-3 mb-3">
              <img
                src={user.avatarUrl || "/images/avatar.png"}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full object-cover border border-secondary-300"
              />
              <div className="flex flex-col overflow-hidden gap-y-1">
                <span className="font-bold text-secondary-900 truncate">
                  {user.name}
                </span>
                <span className="text-sm text-secondary-500 font-semibold truncate">
                  {toPersianDigits(user.phoneNumber)}
                </span>
              </div>
            </div>

            {/* User Links */}
            <div className="flex flex-col gap-2 md:gap-3">
              <NavLink
                path={profilePath}
                icon={HiUserCircle}
                className="text-sm font-semibold hover:!text-primary-800"
                onClick={handleNavLinkClick}
              >
                حساب کاربری
              </NavLink>

              <NavLink
                path="/profile/payments"
                icon={CreditCardIcon}
                className="text-sm font-semibold hover:!text-primary-800"
                onClick={handleNavLinkClick}
              >
                سفارش های من
              </NavLink>

              <NavLink
                path="/cart"
                icon={HiShoppingCart}
                className="text-sm font-semibold hover:!text-primary-800"
                onClick={handleNavLinkClick}
              >
                سبد خرید من
              </NavLink>

              <NavLink
                path="/products/bookmarks"
                icon={HiBookmark}
                className="text-sm font-semibold hover:!text-primary-800"
                onClick={handleNavLinkClick}
              >
                محصولات نشان شده
              </NavLink>

              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 font-semibold text-sm text-error hover:translate-x-1 transition duration-300"
                disabled={isLoggingOut}
              >
                <HiArrowRightOnRectangle className="w-5 h-5" /> خروج
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserDropdown;