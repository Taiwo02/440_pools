"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RequestQuoteForm } from "@/components/requestForQuot";

/** Landing experience: RFQ modal open immediately (e.g. /request-quote/, /rfq/). */
export default function RfqLandingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm md:p-4"
          role="presentation"
          onClick={() => close()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-dvh w-full max-w-4xl overflow-y-auto md:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <RequestQuoteForm handleRfqPopup={close} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
