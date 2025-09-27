"use client";

// Imports
import {
  ArrowLeftStartOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import ButtonIcon from "@/ui/ButtonIcon";
import { useRouter } from "next/navigation";
import useLogout from "@/hooks/useLogout";
import SideBarNavs from "./SideBarNavs";

function AdminSideBar({ onClose }) {
  const { isLoggingOut, logoutFn } = useLogout();
  const router = useRouter();

  // Logout
  const logoutHandler = () => {
    logoutFn();
    router.push("/home");
  };

  return (
    <div className="overflow-y-auto flex flex-col p-2 lg:p-3 h-screen pt-6 lg:pt-8">
      {/* Drawer header */}
      <div className="flex items-center justify-between w-full mb-5 pb-2 border-b-2 border-b-secondary-200">
        {/* logo */}
        <Link href="/home">
          <img src="/images/logo.png" alt="logo" className="w-28 max-h-24" />
        </Link>
        {/* Close button */}
        <ButtonIcon
          onClick={onClose}
          className="block lg:hidden border-none"
          variant="outline"
        >
          <XMarkIcon />
        </ButtonIcon>
      </div>

      {/* Drawer content */}
      <div className="overflow-y-auto flex-auto">
        <SideBarNavs onClose={onClose} />
        {/* Logout */}
        <div
          onClick={logoutHandler}
          className="flex items-center gap-x-2 rounded-2xl font-medium transition-all duration-200 text-secondary-700 py-3 px-4 hover:text-red-400 cursor-pointer"
        >
          <ArrowLeftStartOnRectangleIcon className=" h-5 w-5" />
          <span>خروج</span>
        </div>
      </div>
    </div>
  );
}
export default AdminSideBar;
