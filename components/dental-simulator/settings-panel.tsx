"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimulationSettings } from "@/hooks/use-simulation-settings";

export default function SettingsPanel() {
  const { simulationSettings, updateSettings } = useSimulationSettings();

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <h3 className="font-medium text-sm">Display Settings</h3>

        <div className="grid gap-2">
          <Label htmlFor="quality">Render Quality</Label>
          <Select
            value={simulationSettings.renderQuality}
            onValueChange={(value) => updateSettings({ renderQuality: value })}
          >
            <SelectTrigger id="quality">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="ultra">Ultra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="shadows">Shadows</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="shadows"
              checked={simulationSettings.shadows}
              onCheckedChange={(checked) =>
                updateSettings({ shadows: checked })
              }
            />
            <Label htmlFor="shadows">Enable</Label>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ambient-occlusion">Ambient Occlusion</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="ambient-occlusion"
              checked={simulationSettings.ambientOcclusion}
              onCheckedChange={(checked) =>
                updateSettings({ ambientOcclusion: checked })
              }
            />
            <Label htmlFor="ambient-occlusion">Enable</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-sm">Simulation Settings</h3>

        <div className="grid gap-2">
          <Label htmlFor="animation-speed">Animation Speed</Label>
          <Slider
            id="animation-speed"
            defaultValue={[simulationSettings.animationSpeed]}
            max={100}
            step={1}
            onValueChange={(value) =>
              updateSettings({ animationSpeed: value[0] })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="detail-level">Detail Level</Label>
          <Slider
            id="detail-level"
            defaultValue={[simulationSettings.detailLevel]}
            max={100}
            step={1}
            onValueChange={(value) => updateSettings({ detailLevel: value[0] })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="auto-rotate">Auto Rotate</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-rotate"
              checked={simulationSettings.autoRotate}
              onCheckedChange={(checked) =>
                updateSettings({ autoRotate: checked })
              }
            />
            <Label htmlFor="auto-rotate">Enable</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-sm">Information Display</h3>

        <div className="grid gap-2">
          <Label htmlFor="show-measurements">Show Measurements</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-measurements"
              checked={simulationSettings.showMeasurements}
              onCheckedChange={(checked) =>
                updateSettings({ showMeasurements: checked })
              }
            />
            <Label htmlFor="show-measurements">Enable</Label>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="show-timeline">Show Treatment Timeline</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-timeline"
              checked={simulationSettings.showTimeline}
              onCheckedChange={(checked) =>
                updateSettings({ showTimeline: checked })
              }
            />
            <Label htmlFor="show-timeline">Enable</Label>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="text-size">Text Size</Label>
          <Select
            value={simulationSettings.textSize}
            onValueChange={(value) => updateSettings({ textSize: value })}
          >
            <SelectTrigger id="text-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
