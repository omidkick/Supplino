"use client";

import ButtonIcon from "@/ui/ButtonIcon";
import { toPersianDigits } from "@/utils/numberFormatter";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProductActions } from "@/hooks/useProducts";

import { 
  HeartIcon, 
  BookmarkIcon, 
  ShareIcon 
} from "@heroicons/react/24/outline";
import {
  HeartIcon as SolidHeartIcon,
  BookmarkIcon as SolidBookmarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { Spinner } from "@/ui/Spinner";

function ProductInteraction({
  product,
  showBookmark = true,
  showShare = false,
  className = "",
  iconSize = "w-5 h-5",
  showCounts = true,
  onShare
}) {
  const router = useRouter();
  const { mutateLikeProduct, mutateToggleBookmark } = useProductActions(product?._id);
  const [isProcessing, setIsProcessing] = useState(false);

  const likeHandler = async (productId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      await mutateLikeProduct(productId, {
        onSuccess: (data) => {
          router.refresh();
        },
        onError: (error) => {
    
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const bookmarkHandler = async (productId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      await mutateToggleBookmark(productId, {
        onSuccess: (data) => {
          router.refresh();
        },
        onError: (error) => {
        
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare();
    }
  };

  if (!product) return null;

  return (
    <div className={`flex items-center gap-x-4 ${className}`}>
      {/* Like Button */}
      <ButtonIcon
        variant="red"
        onClick={(e) => {
          e.stopPropagation();
          likeHandler(product._id);
        }}
        disabled={isProcessing}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="loading"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Spinner size={iconSize} />
            </motion.div>
          ) : product.isLiked ? (
            <motion.div
              key="like-solid"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SolidHeartIcon className={iconSize} />
            </motion.div>
          ) : (
            <motion.div
              key="like-outline"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HeartIcon className={iconSize} />
            </motion.div>
          )}
        </AnimatePresence>
        {showCounts && (
          <span className="mr-1 font-bold">
            {toPersianDigits(product.likesCount || 0)}
          </span>
        )}
      </ButtonIcon>

      {/* Bookmark Button */}
      {showBookmark && (
        <ButtonIcon
          variant="blue"
          onClick={(e) => {
            e.stopPropagation();
            bookmarkHandler(product._id);
          }}
          disabled={isProcessing}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="loading"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Spinner size={iconSize} />
              </motion.div>
            ) : product.isBookmarked ? (
              <motion.div
                key="bookmark-solid"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SolidBookmarkIcon className={iconSize} />
              </motion.div>
            ) : (
              <motion.div
                key="bookmark-outline"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BookmarkIcon className={iconSize} />
              </motion.div>
            )}
          </AnimatePresence>
          {showCounts && (
            <span className="mr-1 font-bold">
              {toPersianDigits(product.bookmarksCount || 0)}
            </span>
          )}
        </ButtonIcon>
      )}

      {/* Share Button */}
      {showShare && (
        <ButtonIcon
          variant="secondary"
          onClick={handleShare}
          title="اشتراک گذاری"
        >
          <ShareIcon className={iconSize} />
        </ButtonIcon>
      )}
    </div>
  );
}

export default ProductInteraction;