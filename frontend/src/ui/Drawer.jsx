"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

function Drawer({ open, onClose, children }) {
  // Skip SSR to avoid 'document' error
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 w-[250px] h-full bg-secondary-0 shadow-xl z-50 p-4"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: [0.5, 0, 1, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Drawer;
