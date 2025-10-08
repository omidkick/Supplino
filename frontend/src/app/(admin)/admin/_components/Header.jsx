"use client";

import Link from "next/link";
import DarkModeToggle from "@/ui/DarkModeToggle";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Drawer from "@/ui/Drawer";
import GreetingMessage from "@/ui/GreetingMessage";
import { useGetUser } from "@/hooks/useAuth";
import ButtonIcon from "@/ui/ButtonIcon";
import AdminSideBar from "./AdminSideBar";
import Avatar from "@/ui/Avatar";
import NotificationBell from "@/ui/NotificationBell";

function Header({}) {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { data, error, isLoading } = useGetUser();
  const { user, cart } = data || {};
  return (
    <header
      className={`bg-secondary-0 ${isLoading ? "bg-opacity-30 blur-md" : ""}`}
    >
      <div className="flex items-center justify-between py-3 lg:px-8 container xl:max-w-screen-xl">
        {/* SidebarButton + HelloUser */}
        <div className="flex items-center gap-x-4">
          {/* SidebarButton  */}
          <ButtonIcon
            className="block lg:hidden border-none"
            variant="outline"
            onClick={() => setIsOpenDrawer(!isOpenDrawer)}
          >
            {isOpenDrawer ? (
              <XMarkIcon className="!w-7 !h-7" />
            ) : (
              <Bars3Icon className="!w-7 !h-7" />
            )}
          </ButtonIcon>

          {/* Say Hello */}
          <span className="hidden md:flex flex-col lg:flex-row lg:items-center">
            <span className="text-sm lg:text-lg font-bold text-secondary-700">
              سلام؛ {user?.name}
            </span>
            <span className="hidden lg:block h-4 w-[2px] bg-secondary-300 mx-2"></span>
            <span className="mt-1 lg:mt-0">
              <GreetingMessage />
            </span>
          </span>
        </div>

        {/* DarkMode + Notification + UserAvatar */}
        <div className="flex items-center gap-x-4 md:gap-x-5">
          <NotificationBell isAdmin={true} />
          <DarkModeToggle />
          <Link href="/admin" className="mr-3">
            <Avatar src={user?.avatarUrl} width={43} mobileWidth={38} />
          </Link>
        </div>

        {/* Drawer */}
        <Drawer open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
          <AdminSideBar onClose={() => setIsOpenDrawer(false)} />
        </Drawer>
      </div>
    </header>
  );
}
export default Header;
