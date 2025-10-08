import { toPersianDigits } from "@/utils/numberFormatter";
import {
  UsersIcon,
  ShoppingCartIcon,
  CubeIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { comment } from "postcss";
import { FaRegComments } from "react-icons/fa6";
import { HiTicket } from "react-icons/hi2";

const iconMap = {
  users: UsersIcon,
  payments: ShoppingCartIcon,
  products: CubeIcon,
  categories: FolderIcon,
  tickets: HiTicket,
  comments: FaRegComments,
};

const colorMap = {
  users: {
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
    text: "text-blue-700",
  },
  payments: {
    iconBg: "bg-green-100",
    icon: "text-green-600",
    text: "text-green-700",
  },
  products: {
    iconBg: "bg-purple-100",
    icon: "text-purple-600",
    text: "text-purple-700",
  },
  categories: {
    iconBg: "bg-yellow-100",
    icon: "text-yellow-600",
    text: "text-yellow-700",
  },

  tickets: {
    iconBg: "bg-red-100",
    icon: "text-red-600",
    text: "text-red-700",
  },
  comments: {
    iconBg: "bg-orange-100",
    icon: "text-orange-600",
    text: "text-orange-700",
  },
};

export default function Card({ title, value, type }) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div className="group rounded-2xl bg-secondary-0 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.03] p-6">
      <div className="flex items-center gap-2 md:gap-4">
        <div
          className={`p-3 rounded-xl ${colors.iconBg} flex items-center justify-center`}
        >
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-secondary-500">{title}</h3>
          <p className={`text-lg font-bold ${colors.text}`}>
            {toPersianDigits(value || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
