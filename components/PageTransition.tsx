"use client";

import { motion } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
