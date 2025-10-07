"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

// UI Components
import Button from "@/ui/Button";
import MiniLoading from "@/ui/MiniLoading";

// Icons
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

// Utils
import { toPersianDigits } from "@/utils/numberFormatter";

// Hooks
import useCartActions from "@/hooks/useCartActions";
import { useGetUser } from "@/hooks/useAuth";

// Custom hook for cart state management
function useCartState(product) {
  const { data } = useGetUser();
  const { user } = data || {};

  return useMemo(() => {
    if (!user || !user.cart?.products) {
      return { isInCart: false, quantity: 0 };
    }

    const cartItem = user.cart.products.find(
      (p) => p.productId === product._id
    );
    return {
      isInCart: !!cartItem,
      quantity: cartItem?.quantity || 0,
    };
  }, [user, product._id]);
}

export default function AddToCart({
  product,
  className = "",
  quantitySelectorClassName = "",
  linkClassName = "",
  showQuantityControls = true,
  disabled = false,
}) {
  const { addToCart, removeFromCart, isAdding, isRemoving } = useCartActions();
  const router = useRouter();
  const { data } = useGetUser();
  const { user } = data || {};

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { isInCart, quantity } = useCartState(product);

  // Derived states
  const isOutOfStock = product.countInStock === 0;
  const isDisabled = disabled || isOutOfStock || isAdding;
  const isMaxQuantityReached = quantity >= product.countInStock;

  // Event handlers
  const handleAddToCart = (e) => {
    e?.stopPropagation();

    if (!user) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید !");
      router.push("/auth");
      return;
    }

    if (isOutOfStock) {
      toast.error("این محصول ناموجود است!");
      return;
    }

    if (isAdding) return;

    addToCart(product._id);
  };

  const handleRemoveFromCart = (e) => {
    e?.stopPropagation();
    if (isRemoving) return;
    removeFromCart(product._id);
  };

  if (!isClient) {
    return (
      <div className={className}>
        <div className="w-full py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  // Loading state component
  const LoadingState = () => (
    <Button
      variant="primary"
      className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-bold flex items-center justify-center"
      disabled
    >
      <MiniLoading size="sm" className="border-primary-700" />
    </Button>
  );

  // Quantity Selector Component
  const QuantitySelector = () => (
    <div
      className={`flex items-center gap-3 sm:gap-4 ${quantitySelectorClassName}`}
    >
      <span className="text-secondary-700 font-medium text-sm sm:text-base">
        تعداد:
      </span>
      <div className="flex items-center border border-secondary-200 rounded-lg">
        <button
          onClick={handleAddToCart}
          className="p-1.5 sm:p-2 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            isMaxQuantityReached || isAdding || isOutOfStock || isRemoving
          }
          title={isMaxQuantityReached ? "حداکثر موجودی" : "افزایش تعداد"}
        >
          <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-secondary-200 min-w-[40px] sm:min-w-[50px] text-center text-sm sm:text-base">
          {isAdding || isRemoving ? (
            <MiniLoading size="sm" className="border-primary-600 mx-auto" />
          ) : (
            toPersianDigits(quantity)
          )}
        </span>

        <button
          onClick={handleRemoveFromCart}
          className="p-1.5 sm:p-2 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRemoving || isAdding}
          title={quantity === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
        >
          {quantity === 1 ? (
            <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
          ) : (
            <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>
    </div>
  );

  // Cart Link Component
  const CartLink = () => (
    <Link
      href="/cart"
      className={`block ${linkClassName}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="outline"
        className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-bold"
        disabled={isAdding || isRemoving}
      >
        مشاهده سبد خرید
      </Button>
    </Link>
  );

  // Add to Cart Button Component
  const AddToCartButton = () => (
    <motion.div
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
    >
      <Button
        variant={isOutOfStock ? "secondary" : "primary"}
        className={`w-full py-2.5 sm:py-3 text-sm sm:text-base font-bold !shadow-md transition-all duration-200 ${
          isOutOfStock ? "!bg-gray-300 !text-gray-600 cursor-not-allowed" : ""
        } ${isAdding ? "opacity-70 cursor-not-allowed" : ""}`}
        onClick={handleAddToCart}
        disabled={isDisabled || isAdding}
      >
        {isAdding ? (
          <div className="flex items-center justify-center gap-2">
            <MiniLoading size="sm" className="border-white" />
            <span>در حال افزودن...</span>
          </div>
        ) : isOutOfStock ? (
          "ناموجود"
        ) : (
          "افزودن به سبد خرید"
        )}
      </Button>
    </motion.div>
  );

  // Main render logic
  if (isAdding && !isInCart) {
    return (
      <div className={className}>
        <LoadingState />
      </div>
    );
  }

  if (isInCart) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showQuantityControls && <QuantitySelector />}
        <CartLink />
      </div>
    );
  }

  return (
    <div className={className}>
      <AddToCartButton />
    </div>
  );
}
