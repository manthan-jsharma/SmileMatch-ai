"use client";

import { createContext, useContext, useState } from "react";

// Create context for simulation settings
const SimulationSettingsContext = createContext({
  simulationSettings: {
    // Simulation settings
    animationSpeed: 50,
    detailLevel: 75,
    autoRotate: false,

    // Display settings
    renderQuality: "high",
    shadows: true,
    ambientOcclusion: true,

    // Information display
    showMeasurements: true,
    showTimeline: true,
    textSize: "medium",
  },
  updateSettings: (settings) => {},
});

// Provider component
export function SimulationSettingsProvider({ children }) {
  const [simulationSettings, setSimulationSettings] = useState({
    // Simulation settings
    animationSpeed: 50,
    detailLevel: 75,
    autoRotate: false,

    // Display settings
    renderQuality: "high",
    shadows: true,
    ambientOcclusion: true,

    // Information display
    showMeasurements: true,
    showTimeline: true,
    textSize: "medium",
  });

  const updateSettings = (newSettings) => {
    setSimulationSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <SimulationSettingsContext.Provider
      value={{ simulationSettings, updateSettings }}
    >
      {children}
    </SimulationSettingsContext.Provider>
  );
}

// Hook to use the settings
export function useSimulationSettings() {
  const context = useContext(SimulationSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSimulationSettings must be used within a SimulationSettingsProvider"
    );
  }
  return context;
}
