"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellIcon } from "@heroicons/react/24/outline";
import { useSupportActions } from "@/hooks/useSupports";
import { calculateAdminUnreadCount, calculateUserUnreadCount } from "@/utils/ticketUtils";
import { toPersianDigits } from "@/utils/numberFormatter";
import useOutsideClick from "@/hooks/useOutsideClick"; 

const NotificationBell = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { allTickets, userTickets, isLoadingAllTickets, isLoadingUserTickets } = useSupportActions();

  // Use the outside click hook
  const ref = useOutsideClick(() => {
    if (isOpen) setIsOpen(false);
  });

  // Calculate unread count based on user type
  useEffect(() => {
    if (isAdmin) {
      const count = calculateAdminUnreadCount(allTickets);
      setUnreadCount(count);
    } else {
      const count = calculateUserUnreadCount(userTickets);
      setUnreadCount(count);
    }
  }, [isAdmin, allTickets, userTickets]);

  // Animation variants
  const bellVariants = {
    initial: { rotate: 0 },
    ring: { 
      rotate: [0, -15, 15, -15, 15, 0],
      transition: { 
        duration: 0.5,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    }
  };

  const badgeVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 15 }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Notification Bell Button */}
      <motion.button
        variants={bellVariants}
        initial="initial"
        animate={unreadCount > 0 ? "ring" : "initial"}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center transition-colors duration-200"
        whileTap={{ scale: 0.95 }}
      >
        <BellIcon className="w-6 h-6 md:w-7 md:h-7 text-primary-900" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.span
            variants={badgeVariants}
            initial="initial"
            animate={["animate", "pulse"]}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] md:text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-secondary-0"
          >
            {toPersianDigits(unreadCount > 9 ? "9+" : unreadCount)}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute mt-2 left-0  w-56 md:w-72 lg:w-80 bg-secondary-50 rounded-lg shadow-lg border border-secondary-200 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-secondary-100">
              <h3 className="font-bold text-secondary-800">اعلان‌ها</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {unreadCount > 0 ? (
                <div className="p-4">
                  <div className="text-center py-8">
                    <BellIcon className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                    <p className="text-secondary-700 font-medium">
                      {toPersianDigits(unreadCount)} پیام خوانده نشده
                    </p>
                    <p className="text-sm text-secondary-500 mt-1">
                      {isAdmin ? "تیکت جدید از کاربران" : "پاسخ جدید از پشتیبانی"}
                    </p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <a
                      href={isAdmin ? "/admin/support" : "/profile/support"}
                      className="block w-full text-center bg-primary-900 text-white py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      مشاهده {isAdmin ? "تیکت‌ها" : "پاسخ‌ها"}
                    </a>
                  </motion.div>
                </div>
              ) : (
                <div className="p-4 text-center py-8">
                  <BellIcon className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-secondary-500">اعلانی وجود ندارد</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;