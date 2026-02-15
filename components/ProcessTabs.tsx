"use client";

import { useState } from "react";
import type { Order, ProcessKey } from "@/lib/types";
import { PROCESS_LABELS, hasProcessCost } from "@/lib/types";
import ExtrusionPanel from "./processes/ExtrusionPanel";
import ImpresionPanel from "./processes/ImpresionPanel";
import LaminacionPanel from "./processes/LaminacionPanel";
import ConfeccionPanel from "./processes/ConfeccionPanel";
import CostoExtraPanel from "./processes/CostoExtraPanel";

interface ProcessTabsProps {
  order: Order;
}

const PROCESS_KEYS: ProcessKey[] = [
  "extrusion",
  "impresion",
  "laminacion",
  "confeccion",
  "costoExtra",
];

const PANEL_MAP: Record<ProcessKey, React.ComponentType<{ order: Order }>> = {
  extrusion: ExtrusionPanel,
  impresion: ImpresionPanel,
  laminacion: LaminacionPanel,
  confeccion: ConfeccionPanel,
  costoExtra: CostoExtraPanel,
};

export default function ProcessTabs({ order }: ProcessTabsProps) {
  const [activeTab, setActiveTab] = useState<ProcessKey | null>(null);

  const ActivePanel = activeTab ? PANEL_MAP[activeTab] : null;

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200">
        {PROCESS_KEYS.map((key) => {
          const isActive = activeTab === key;
          const hasData = hasProcessCost(order, key);
          return (
            <button
              key={key}
              onClick={() => setActiveTab(isActive ? null : key)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-t-md ${
                isActive
                  ? "bg-white text-blue-600 border border-gray-200 border-b-white -mb-px"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {PROCESS_LABELS[key]}
              {hasData && (
                <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>
      {ActivePanel && activeTab && (
        <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-5">
          <ActivePanel order={order} />
        </div>
      )}
    </div>
  );
}
