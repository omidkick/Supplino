"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ path, children, icon: Icon, className = "", onClick }) {
  const pathname = usePathname();
  const isActive = pathname === path;

  // Handle both string and function className
  const getClassName = () => {
    const baseClasses = `flex items-center gap-2 py-2 lg:hover:text-primary-800 transition-all ease-out text-lg 
      ${isActive ? "text-primary-900 font-semibold" : "text-secondary-400"}`;
    
    if (typeof className === 'function') {
      return `${baseClasses} ${className({ isActive })}`;
    }
    
    return `${baseClasses} ${className}`;
  };

  return (
    <Link
      href={path}
      onClick={onClick}
      className={getClassName()}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </Link>
  );
}

export default NavLink;