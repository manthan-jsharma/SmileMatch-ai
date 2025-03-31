"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function InfoPanel({
  text,
  progress,
  isActive,
  textSize = "medium",
}: {
  text: string;
  progress: number; // or any other type that makes sense for your progress prop
  isActive: boolean;
  textSize: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Text size classes
  const getTextSizeClass = () => {
    switch (textSize) {
      case "small":
        return "text-xs";
      case "medium":
        return "text-sm";
      case "large":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-11/12 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className={`${getTextSizeClass()} text-center mb-3`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>

          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Treatment Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
