"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  SmileIcon as Tooth,
  Smile,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Sidebar({
  activeModel,
  setActiveModel,
  activeTreatment,
  setActiveTreatment,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleModelSelect = (model) => {
    setActiveModel(model);
  };

  const handleTreatmentSelect = (treatment) => {
    if (activeTreatment?.type === treatment) {
      setActiveTreatment(null);
    } else {
      setActiveTreatment({ type: treatment });
    }
  };

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center gap-4 p-2">
          <Button
            variant="ghost"
            size="icon"
            className={
              activeModel === "overbite" ? "bg-gray-200 dark:bg-gray-700" : ""
            }
            onClick={() => handleModelSelect("overbite")}
          >
            <Tooth className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={
              activeModel === "underbite" ? "bg-gray-200 dark:bg-gray-700" : ""
            }
            onClick={() => handleModelSelect("underbite")}
          >
            <Tooth className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={
              activeModel === "crossbite" ? "bg-gray-200 dark:bg-gray-700" : ""
            }
            onClick={() => handleModelSelect("crossbite")}
          >
            <Tooth className="h-5 w-5" />
          </Button>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-2" />

          <Button
            variant="ghost"
            size="icon"
            className={
              activeTreatment?.type === "invisalign"
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            }
            onClick={() => handleTreatmentSelect("invisalign")}
          >
            <Layers className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={
              activeTreatment?.type === "veneer-hollywood"
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            }
            onClick={() => handleTreatmentSelect("veneer-hollywood")}
          >
            <Sparkles className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-3">Teeth Models</h3>

              <Button
                variant="outline"
                className={`w-full justify-start ${
                  activeModel === "overbite"
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() => handleModelSelect("overbite")}
              >
                <Tooth className="mr-2 h-4 w-4" />
                Overbite
              </Button>

              <Button
                variant="outline"
                className={`w-full justify-start ${
                  activeModel === "underbite"
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() => handleModelSelect("underbite")}
              >
                <Tooth className="mr-2 h-4 w-4" />
                Underbite
              </Button>

              <Button
                variant="outline"
                className={`w-full justify-start ${
                  activeModel === "crossbite"
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() => handleModelSelect("crossbite")}
              >
                <Tooth className="mr-2 h-4 w-4" />
                Crossbite
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="treatments" className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Invisalign</h3>
                <Button
                  variant="outline"
                  className={`w-full justify-start ${
                    activeTreatment?.type === "invisalign"
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => handleTreatmentSelect("invisalign")}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Invisalign Treatment
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Veneers</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      activeTreatment?.type === "veneer-hollywood"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleTreatmentSelect("veneer-hollywood")}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Hollywood Style
                  </Button>

                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      activeTreatment?.type === "veneer-dominant"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleTreatmentSelect("veneer-dominant")}
                  >
                    <Smile className="mr-2 h-4 w-4" />
                    Dominant Style
                  </Button>

                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      activeTreatment?.type === "veneer-porcelain"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleTreatmentSelect("veneer-porcelain")}
                  >
                    <Smile className="mr-2 h-4 w-4" />
                    Porcelain
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
