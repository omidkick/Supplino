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
      title: " کاربران",
      value: users?.length,
      type: "users",
    },
    {
      title: " سفارشات",
      value: payments,
      type: "payments",
    },
    {
      title: " محصولات",
      value: products,
      type: "products",
    },
    {
      title: " دسته‌بندی‌ها",
      value: categories?.length,
      type: "categories",
    },
    {
      title: " تیکت‌ها",
      value: tickets,
      type: "tickets",
    },
    {
      title: " نظرات",
      value: comments,
      type: "comments",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
