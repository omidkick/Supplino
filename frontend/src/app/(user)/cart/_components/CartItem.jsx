"use client";
import useCartActions from "@/hooks/useCartActions";
import { useProductActions } from "@/hooks/useProducts";
import MiniLoading from "@/ui/MiniLoading";
import { toPersianDigits } from "@/utils/numberFormatter";
import {
  toPersianNumbers,
  toPersianNumbersWithComma,
} from "@/utils/toPersianNumbers";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

function CartItem({ cartItem }) {
  const { addToCart, isAdding, isRemoving, removeFromCart } = useCartActions();
  // console.log(cartItem);

  const { product, isLoadingSingleProduct } = useProductActions(cartItem._id);
  // console.log(product);

  const addToCartHandler = () => {
    addToCart(cartItem._id);
  };

  const decrementHandler = () => {
    removeFromCart(cartItem._id);
  };

  // Calculate cart quantity and max quantity check
  const cartQuantity = cartItem.quantity;
  const isMaxQuantityReached = cartQuantity >= cartItem.countInStock;

  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-secondary-0 rounded-lg border border-secondary-200 shadow-sm">
      {/* Product Image */}
      <div className="col-span-3 lg:col-span-2">
        <div className="w-full h-24 lg:h-32 rounded-lg overflow-hidden ">
          <img
            src={product?.coverImageUrl}
            alt={cartItem.title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="col-span-9 flex flex-col justify-between">
        {/* Product Title */}
        <div>
          <h3 className="text-sm lg:text-base font-bold text-secondary-900 mb-2 line-clamp-2">
            {cartItem.title}
          </h3>

          {/* Product Features */}
          <div className="flex flex-col gap-1 text-xs lg:text-sm text-secondary-600">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-4 h-4 text-green-500" />
              <span>ارسال رایگان برای بالای ۳۰۰ هزار تومان</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
              <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-yellow-500" />
              <span>امکان بازگشت کالا تا ۱۴ روز پس از دریافت</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity and Price Controls */}
      <div className="col-span-12 md:col-span-9 flex items-center  lg:justify-normal gap-x-8">
        {/* Quantity Controls */}
        <div className="flex items-center border border-secondary-200 rounded-lg">
          {/* Increase quantity button */}
          <button
            onClick={addToCartHandler}
            className="p-1.5 sm:p-2 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isMaxQuantityReached || isAdding}
            title={isMaxQuantityReached ? "حداکثر موجودی" : "افزایش تعداد"}
          >
            <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Quantity display */}
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-secondary-200 min-w-[40px] sm:min-w-[50px] text-center text-sm sm:text-base">
            {isAdding || isRemoving ? (
              <MiniLoading color="#3860cc" />
            ) : (
              toPersianDigits(cartQuantity)
            )}
          </span>

          {/* Decrease quantity button */}
          <button
            onClick={decrementHandler}
            className="p-1.5 sm:p-2 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isRemoving}
            title={cartQuantity === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
          >
            {cartQuantity === 1 ? (
              <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            ) : (
              <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>

        {/* Price */}
        <div className="flex flex-col items-center">
          <div>
            <span
              className={`${
                cartItem.discount
                  ? "line-through text-secondary-500"
                  : "font-bold"
              }`}
            >
              {toPersianNumbersWithComma(cartItem.price * cartQuantity)}
            </span>
          </div>
          {!!cartItem.discount && (
            <div className="flex items-center gap-x-2 mt-2">
              <p className="font-bold lg:text-lg text-primary-600">
                {" "}
                {toPersianNumbersWithComma(cartItem.offPrice * cartQuantity)}
              </p>
              <div className="bg-rose-500 px-2 py-0.5 rounded-xl text-white text-sm">
                {toPersianNumbers(cartItem.discount)} %
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartItem;
