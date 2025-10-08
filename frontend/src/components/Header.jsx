"use client";

// Imports
import NavLink from "@/components/NavLink";
import { useGetUser } from "@/hooks/useAuth";
import DarkModeToggle from "@/ui/DarkModeToggle";
import UserDropdown from "@/ui/UserDropdown";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  HiHome,
  HiShoppingBag,
  HiInformationCircle,
  HiShoppingCart,
  HiArrowLeftOnRectangle,
} from "react-icons/hi2";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";
import { toPersianDigits } from "@/utils/numberFormatter";
import { useState, useEffect } from "react";

// Navigation Links
export const navLinks = [
  { id: 1, children: "خانه", path: "/home", icon: HiHome },
  { id: 2, children: "محصولات", path: "/products", icon: HiShoppingBag },
  { id: 3, children: "درباره ما", path: "/about", icon: HiInformationCircle },
];

function Header() {
  const { data, error, isLoading } = useGetUser();
  const { user, cart } = data || {};
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to toggle glass effect and border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemsCount = cart ? cart.payDetail.productIds.length : 0;

  const headerClasses = `sticky top-0 z-40 transition-all duration-300 backdrop-blur-sm ${
    isLoading ? "blur-sm opacity-70" : "opacity-100 blur-0"
  } ${isScrolled ? "bg-secondary-100/80 shadow-sm" : "bg-secondary-100"}`;

  return (
    <>
      {/* Mobile Top Header */}
      <header className={`md:hidden ${headerClasses}`}>
        <nav className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-x-3">
              <DarkModeToggle />
              <UserSection user={user} router={router} />
            </div>
          </div>
        </nav>
      </header>

      {/* Desktop Header */}
      <header className={`hidden md:block mb-10 ${headerClasses}`}>
        <nav className="container xl:max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <Logo />
            <MainNavigation />
            <DesktopActions
              cartItemsCount={cartItemsCount}
              user={user}
              router={router}
            />
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        user={user}
        cartItemsCount={cartItemsCount}
        navLinks={navLinks}
        isLoading={isLoading}
      />

      {/* Mobile Spacers */}
      <div className="md:hidden mb-20" />
    </>
  );
}
// Logo Component
const Logo = () => (
  <NavLink path="/home">
    <img src="/images/logo.png" alt="logo" className="w-28 max-h-24 hidden md:block" />
    <img src="/images/logo (1).png" alt="logo" className="w-auto max-h-8 md:hidden " />
  </NavLink>
);

// User Section Component
const UserSection = ({ user, router }) =>
  user ? (
    <UserDropdown user={user} />
  ) : (
    <Button
      onClick={() => router.push("/auth")}
      className="btn btn--primary flex items-center gap-1 py-2.5 text-xs"
    >
      <HiArrowLeftOnRectangle className="w-5 h-5 hidden md:block" />
      ورود | ثبت نام
    </Button>
  );

// Main Navigation Component
const MainNavigation = () => (
  <div className="flex items-center">
    <ul className="flex items-center gap-x-8">
      {navLinks.map((navLink) => (
        <li key={navLink.id}>
          <NavLink
            path={navLink.path}
            className="flex items-center gap-2 px-3 py-2"
          >
            <navLink.icon className="w-5 h-5 " />
            {navLink.children}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

// Desktop Actions Component
const DesktopActions = ({ cartItemsCount, user, router }) => (
  <div className="flex items-center gap-x-4">
    {/* Shopping Cart */}
    <NavLink
      path="/cart"
      className="relative p-2 !text-primary-900 !hover:text-primary-800 transition-colors"
    >
      <HiShoppingCart className="w-7 h-7" />
      {cartItemsCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {toPersianDigits(cartItemsCount)}
        </span>
      )}
    </NavLink>

    <DarkModeToggle />

    <div className="border-r border-secondary-300 pr-4">
      {user ? (
        <UserDropdown user={user} />
      ) : (
        <Button
          onClick={() => router.push("/auth")}
          className="btn btn--primary flex items-center gap-2 text-xs"
        >
          <HiArrowLeftOnRectangle className="w-5 h-5" />
          ورود | ثبت نام
        </Button>
      )}
    </div>
  </div>
);

export default Header;
