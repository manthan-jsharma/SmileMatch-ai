"use client";

import { useState } from "react";
import DentalSimulation from "@/components/dental-simulator/dental-simulation";
import Sidebar from "@/components/dental-simulator/sidebar";
import Toolbar from "@/components/dental-simulator/toolbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimulationSettingsProvider } from "@/hooks/use-simulation-settings";

export default function Home() {
  const [activeModel, setActiveModel] = useState("overbite");
  const [activeTreatment, setActiveTreatment] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <SimulationSettingsProvider>
      <main className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
        <TooltipProvider>
          <Toolbar
            showSettings={showSettings}
            setShowSettings={setShowSettings}
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeModel={activeModel}
              setActiveModel={setActiveModel}
              activeTreatment={activeTreatment}
              setActiveTreatment={setActiveTreatment}
            />
            <div className="flex-1 relative">
              <DentalSimulation
                activeModel={activeModel}
                activeTreatment={activeTreatment}
              />
            </div>
          </div>
        </TooltipProvider>
      </main>
    </SimulationSettingsProvider>
  );
}
