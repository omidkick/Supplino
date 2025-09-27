import Card from "./Card";
import { toPersianDigits } from "@/utils/numberFormatter";

function CardsWrapper({
  users,
  payments,
  products,
  categories,
  tickets,
  comments,
}) {
  const stats = [
    {
      title: "تعداد کاربران",
      value: users?.length,
      type: "users",
    },
    {
      title: "تعداد سفارشات",
      value: payments,
      type: "payments",
    },
    {
      title: "تعداد محصولات",
      value: products,
      type: "products",
    },
    {
      title: "تعداد دسته‌بندی‌ها",
      value: categories?.length,
      type: "categories",
    },
    {
      title: "تعداد تیکت‌ها",
      value: tickets,
      type: "tickets",
    },
    {
      title: "تعداد نظرات",
      value: comments,
      type: "comments",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {stats.map((item) => (
        <Card
          key={item.type}
          title={item.title}
          value={item.value}
          type={item.type}
        />
      ))}
    </div>
  );
}

export default CardsWrapper;
