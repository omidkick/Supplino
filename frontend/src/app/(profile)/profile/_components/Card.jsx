import { toPersianDigits } from "@/utils/numberFormatter";
import {
  CalendarDaysIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const iconMap = {
  payments: ShoppingCartIcon,
  createdAt: CalendarDaysIcon,
  likedProducts: HeartIcon,
};

const colorMap = {
  payments: {
    iconBg: "bg-blue-500",
    text: "text-blue-600",
    icon: "text-white"
  },
  createdAt: {
    iconBg: "bg-green-500",
    text: "text-green-600",
    icon: "text-white"
  },
  likedProducts: {
    iconBg: "bg-purple-500",
    text: "text-purple-600",
    icon: "text-white"
  }
};

export default function Card({ title, value, type }) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div className={`group rounded-2xl bg-secondary-50 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.03] p-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-3 rounded-xl ${colors.iconBg} transition-transform `}>
              <Icon className={`h-6 w-6 ${colors.icon}`} />
            </div>
          )}
          <div>
            <h3 className={`text-sm font-medium text-secondary-400 mb-2`}>{title}</h3>
            <p className="text-sm font-bold text-secondary-900">
              {toPersianDigits(value)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}