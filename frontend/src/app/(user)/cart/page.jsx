"use client";

// Imports
import { useGetUser } from "@/hooks/useAuth";
import Loading from "@/ui/Loading";
import Link from "next/link";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";
import EmptyCart from "./_components/EmptyCart";
import { toPersianNumbers } from "@/utils/toPersianNumbers";
import GuestCart from "./_components/GuestCart";

function Cart() {
  const { data, isLoading } = useGetUser();
  const { user, cart } = data || {};
  const orderItems = cart?.payDetail.orderItems || 0;

  if (isLoading) return <Loading />;

  if (!user || !data) return <GuestCart />;

  if (!user.cart?.products || user.cart?.products.length === 0)
    return <EmptyCart user={user} />;

  return (
    <div className="">
      <h2 className="text-primary-900 text-lg lg:text-2xl px-2 py-3 font-extrabold mb-2">
        <span className="border-b-4 border-primary-900 pb-3 rounded-sm">
          سبد خرید{" "}
          <span className="badge badge--primary !text-sm py-0.5 md:py-1 md:!text-base px-2 rounded-md !font-medium">
            {toPersianNumbers(orderItems.length)}
          </span>
        </span>
      </h2>
      <div className="grid grid-cols-5 xl:grid-cols-4 gap-6 py-4">
        <div className="col-span-5 lg:col-span-3 space-y-5 xl:col-span-3">
          {cart &&
            cart.productDetail.map((item) => {
              return <CartItem key={item._id} cartItem={item} />;
            })}
        </div>
        <div className="col-span-5 lg:col-span-2 xl:col-span-1">
          <CartSummary payDetail={cart.payDetail} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
