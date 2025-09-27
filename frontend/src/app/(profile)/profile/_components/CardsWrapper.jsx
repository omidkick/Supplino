import Card from "./Card";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { toPersianDigits } from "@/utils/numberFormatter";

function CardsWrapper({ data }) {
  const { user, cart, payments } = data || {};

  const joinDate = toLocalDateShort(user.createdAt);
  const numOfPayments = toPersianDigits(payments.length);
  const numLikedProducts = toPersianDigits(user.likedProducts.length);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card title="تاریخ پیوستن" value={joinDate} type="createdAt" />
      <Card title="تعداد سفارشات" value={numOfPayments} type="payments" />
      <Card
        title="تعداد لایک ها"
        value={numLikedProducts}
        type="likedProducts"
      />
    </div>
  );
}

export default CardsWrapper;
