"use client";

import { motion } from "framer-motion";

export default function TreatmentTimeline({
  treatmentData,
  progress,
  textSize = "medium",
}) {
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

  // Format date to readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Calculate which checkpoints are complete based on progress
  const checkpoints = treatmentData.checkpoints.map((checkpoint, index) => {
    const checkpointProgress =
      (index / (treatmentData.checkpoints.length - 1)) * 100;
    return {
      ...checkpoint,
      complete: progress >= checkpointProgress,
    };
  });

  return (
    <motion.div
      className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-11/12 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3
        className={`font-medium mb-3 text-center ${
          textSize === "large" ? "text-lg" : "text-base"
        }`}
      >
        Treatment Timeline
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"></div>

        {/* Timeline points */}
        <div className="flex justify-between relative">
          {checkpoints.map((checkpoint, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full z-10 ${
                  checkpoint.complete
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <p
                className={`${getTextSizeClass()} mt-2 text-center max-w-[80px]`}
              >
                {checkpoint.label}
              </p>
              <p
                className={`${
                  textSize === "small" ? "text-xs" : "text-xs"
                } text-gray-500 dark:text-gray-400`}
              >
                {formatDate(checkpoint.date)}
              </p>
            </div>
          ))}
        </div>

        {/* Progress overlay */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </motion.div>
  );
}
