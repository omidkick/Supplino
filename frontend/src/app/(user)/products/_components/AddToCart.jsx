"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState, useEffect } from "react"; // Add useEffect

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
  
  // Add state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper functions
  const isInCart = (user, product) => {
    if (!user || !user.cart?.products) return false;
    return user.cart.products.some((p) => p.productId === product._id);
  };

  const getCartItemQuantity = (user, product) => {
    if (!user || !user.cart?.products) return 0;
    const cartItem = user.cart.products.find(
      (p) => p.productId === product._id
    );
    return cartItem ? cartItem.quantity : 0;
  };

  // Event handlers
  const handleAddToCart = (e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling

    if (!user) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید !");
      router.push("/auth");
      return;
    }

    if (isOutOfStock) {
      toast.error("این محصول ناموجود است!");
      return;
    }

    addToCart(product._id);
  };

  const handleRemoveFromCart = (e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    removeFromCart(product._id);
  };

  // State calculations
  const isProductInCart = isInCart(user, product);
  const cartQuantity = getCartItemQuantity(user, product);
  const isOutOfStock = product.countInStock === 0;
  const isDisabled = disabled || isOutOfStock;
  const isMaxQuantityReached = cartQuantity >= product.countInStock;

  // Don't render anything until component is mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className={className}>
        <Button
          variant="primary"
          className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-bold"
          disabled={true}
        >
          <MiniLoading width="50" height="25" color="#ffffff" />
        </Button>
      </div>
    );
  }

  // If product is in cart, show quantity controls and cart link
  if (isProductInCart) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Quantity Selector */}
        {showQuantityControls && (
          <div
            className={`flex items-center gap-3 sm:gap-4 ${quantitySelectorClassName}`}
          >
            <span className="text-secondary-700 font-medium text-sm sm:text-base">
              تعداد:
            </span>
            <div className="flex items-center border border-secondary-200 rounded-lg">
              {/* Increase quantity button */}
              <button
                onClick={handleAddToCart}
                className="p-1.5 sm:p-2 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMaxQuantityReached || isAdding || isOutOfStock}
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
                onClick={handleRemoveFromCart}
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
          </div>
        )}

        {/* Go to Cart Link */}
        <Link
          href="/cart"
          className={`block ${linkClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-bold"
          >
            مشاهده سبد خرید
          </Button>
        </Link>
      </div>
    );
  }

  // If product is not in cart, show add to cart button
  return (
    <motion.div
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      className={className}
    >
      {isAdding ? (
        <Button
          variant="primary"
          className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-bold"
          disabled={true}
        >
          <MiniLoading width="50" height="25" color="#ffffff" />
        </Button>
      ) : (
        <Button
          variant={isOutOfStock ? "secondary" : "primary"}
          className={`w-full py-2.5 sm:py-3 text-sm sm:text-base font-bold !shadow-md transition-all duration-200 ${
            isOutOfStock ? "!bg-gray-300 !text-gray-600 cursor-not-allowed" : ""
          }`}
          onClick={handleAddToCart}
          disabled={isDisabled}
        >
          {isOutOfStock ? "ناموجود" : "افزودن به سبد خرید"}
        </Button>
      )}
    </motion.div>
  );
}