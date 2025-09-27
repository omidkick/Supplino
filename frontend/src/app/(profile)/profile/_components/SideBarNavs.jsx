"use client";

// imports
import {
  DocumentTextIcon,
  RectangleGroupIcon,
  UserCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineSupportAgent } from "react-icons/md";
import { useSupportActions } from "@/hooks/useSupports";
import { calculateUserUnreadCount } from "@/utils/ticketUtils";
import { toPersianDigits } from "@/utils/numberFormatter";

const sidebarNavs = [
  {
    id: 1,
    title: "صفحه اصلی",
    icon: <HomeIcon className="w-5 h-5" />,
    href: "/home",
  },
  {
    id: 2,
    title: "داشبورد",
    icon: <RectangleGroupIcon className="w-5 h-5" />,
    href: "/profile",
  },
  {
    id: 3,
    title: "اطلاعات کاربری",
    icon: <UserCircleIcon className="w-5 h-5" />,
    href: "/profile/me",
  },
  {
    id: 4,
    title: "سفارشات",
    icon: <DocumentTextIcon className="w-5 h-5" />,
    href: "/profile/payments",
  },
  {
    id: 5,
    title: "پشتیبانی",
    icon: <MdOutlineSupportAgent className="w-5 h-5" />,
    href: "/profile/support",
  },
];

export default function SideBarNavs({ onClose }) {
  const pathname = usePathname();
  const { userTickets } = useSupportActions();

  // Use utility function to count unread messages for user
  const unreadCount = calculateUserUnreadCount(userTickets);

  // find match link
  const activeHref =
    sidebarNavs
      .slice()
      .sort((a, b) => b.href.length - a.href.length)
      .find(
        (nav) => pathname === nav.href || pathname.startsWith(nav.href + "/")
      )?.href || "";

  return (
    <ul className="space-y-2">
      {sidebarNavs.map(({ id, href, icon, title }) => {
        const isActive = href === activeHref;

        return (
          <li key={id}>
            <Link
              onClick={onClose}
              href={href}
              className={classNames(
                "flex items-center justify-between rounded-xl font-medium hover:text-primary-900 transition-all duration-200 text-secondary-700 py-3 px-4",
                {
                  "!font-extrabold !text-primary-900 !bg-secondary-100":
                    isActive,
                }
              )}
            >
              <div className="flex items-center gap-x-2">
                {icon}
                {title}
              </div>
              {/* Show unread count badge only for support link */}
              {unreadCount > 0 && href === "/profile/support" && (
                <span className="badge badge--error text-xs flex items-center justify-center w-5 h-5 min-w-[1.25rem]">
                  {toPersianDigits(unreadCount)}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
