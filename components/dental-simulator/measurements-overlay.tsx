"use client";

import { motion } from "framer-motion";

export default function MeasurementsOverlay({
  treatmentData,
  activeModel,
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

  // Get measurements based on treatment type
  const getMeasurements = () => {
    if (treatmentData.type === "invisalign") {
      return [
        { label: "Treatment Duration", value: "18-24 months" },
        { label: "Number of Aligners", value: "20-30 sets" },
        { label: "Wear Time", value: "22 hours/day" },
        { label: "Change Frequency", value: "1-2 weeks" },
        { label: "Check-ups", value: "Every 6-8 weeks" },
      ];
    } else if (treatmentData.type === "veneer") {
      const thickness =
        treatmentData.veneerType === "hollywood"
          ? "0.5-0.7mm"
          : treatmentData.veneerType === "dominant"
          ? "0.4-0.6mm"
          : "0.3-0.5mm";

      const lifespan =
        treatmentData.veneerType === "hollywood"
          ? "10-15 years"
          : treatmentData.veneerType === "dominant"
          ? "10-20 years"
          : "15-20 years";

      return [
        {
          label: "Veneer Type",
          value:
            treatmentData.veneerType.charAt(0).toUpperCase() +
            treatmentData.veneerType.slice(1),
        },
        { label: "Thickness", value: thickness },
        { label: "Material", value: "Porcelain" },
        { label: "Lifespan", value: lifespan },
        { label: "Procedure Time", value: treatmentData.duration },
      ];
    }

    return [];
  };

  const measurements = getMeasurements();

  return (
    <motion.div
      className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3
        className={`font-medium mb-2 ${
          textSize === "large" ? "text-lg" : "text-base"
        }`}
      >
        Measurements
      </h3>
      <div className="space-y-1">
        {measurements.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span
              className={`${getTextSizeClass()} text-gray-600 dark:text-gray-300`}
            >
              {item.label}:
            </span>
            <span className={`${getTextSizeClass()} font-medium`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
