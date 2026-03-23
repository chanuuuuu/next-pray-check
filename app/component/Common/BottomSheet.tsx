"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  id?: string;
};

export function BottomSheet({ isOpen, onClose, children, id }: BottomSheetProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const vv = window.visualViewport;

    const handleViewportChange = () => {
      const kbHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardHeight(kbHeight);
    };

    vv.addEventListener("resize", handleViewportChange);
    vv.addEventListener("scroll", handleViewportChange);

    return () => {
      vv.removeEventListener("resize", handleViewportChange);
      vv.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            style={{
              background: "hsl(var(--foreground) / 0.2)",
              backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 z-[60] p-4 overflow-y-auto"
            style={{
              bottom: keyboardHeight,
              paddingBottom: keyboardHeight > 0 ? "1rem" : "5rem",
              maxHeight: `min(85dvh, calc(100dvh - ${keyboardHeight}px))`,
            }}
            id={id}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
