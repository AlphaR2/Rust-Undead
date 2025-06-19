"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationProps {
  message: string;
  status: "error" | "success";
  switchShowOff: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  status,
  switchShowOff,
}) => {
  const router = useRouter();

  // Configure status-based styles
  const statusConfig = {
    error: {
      bgColor: "bg-red-500",
      icon: "bx bxs-error-circle",
      hoverBg: "hover:bg-red-600",
    },
    success: {
      bgColor: "bg-green-500",
      icon: "bx bxs-check-circle",
      hoverBg: "hover:bg-green-600",
    },
  };

  const currentStatus = statusConfig[status];

  useEffect(() => {
    const timer = setTimeout(switchShowOff, 500);
    return () => clearTimeout(timer);
  }, [switchShowOff]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 min-w-[320px] max-w-md"
      >
        <div
          className={`
            ${currentStatus.bgColor} 
            ${currentStatus.hoverBg}
            flex items-center gap-3 p-4 rounded-lg shadow-lg
            transform transition-all duration-300 ease-in-out
            cursor-pointer
          `}
          onClick={switchShowOff}
          role="alert"
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            <i className={`${currentStatus.icon} text-white text-xl`} />
          </div>

          {/* Message */}
          <p className="text-white font-medium flex-grow">{message}</p>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              switchShowOff();
            }}
            className="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <i className="bx bx-x text-xl" />
          </button>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 origin-left"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
