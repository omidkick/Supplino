"use client";

// imports
import {
  HomeIcon,
  Squares2X2Icon,
  UsersIcon,
  CubeIcon,
  FolderOpenIcon,
  ShoppingBagIcon,
  TagIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineSupportAgent } from "react-icons/md";
import { toPersianDigits } from "@/utils/numberFormatter";
import { calculateAdminUnreadCount } from "@/utils/ticketUtils";
import { useSupportActions } from "@/hooks/useSupports";

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
    icon: <Squares2X2Icon className="w-5 h-5" />,
    href: "/admin",
  },
  {
    id: 3,
    title: "کاربران",
    icon: <UsersIcon className="w-5 h-5" />,
    href: "/admin/users",
  },
  {
    id: 4,
    title: "محصولات",
    icon: <CubeIcon className="w-5 h-5" />,
    href: "/admin/products",
  },
  {
    id: 5,
    title: "دسته بندی",
    icon: <FolderOpenIcon className="w-5 h-5" />,
    href: "/admin/categories",
  },
  {
    id: 6,
    title: "سفارشات",
    icon: <ShoppingBagIcon className="w-5 h-5" />,
    href: "/admin/payments",
  },
  {
    id: 7,
    title: "کد تخفیف",
    icon: <TagIcon className="w-5 h-5" />,
    href: "/admin/coupons",
  },
  {
    id: 8,
    title: "نظرات",
    icon: <ChatBubbleLeftIcon className="w-5 h-5" />,
    href: "/admin/comments",
  },
  {
    id: 9,
    title: "پشتیبانی",
    icon: <MdOutlineSupportAgent className="w-5 h-5" />,
    href: "/admin/support",
  },
];

export default function SideBarNavs({ onClose }) {
  const pathname = usePathname();
  const { allTickets, isLoadingAllTickets } = useSupportActions();
  const unreadCount = calculateAdminUnreadCount(allTickets);

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
              {unreadCount > 0 && href === "/admin/support" ? (
                <span className="badge badge--error text-sm flex items-center rounded-full">
                  {toPersianDigits(unreadCount)}
                </span>
              ) : (
                ""
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
