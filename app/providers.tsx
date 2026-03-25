"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { AuthModalProvider } from "@/components/AuthModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthModalProvider>
      <AnimatePresence mode="wait">
        <div key={pathname}>{children}</div>
      </AnimatePresence>
    </AuthModalProvider>
  );
}
