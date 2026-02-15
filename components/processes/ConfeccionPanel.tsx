"use client";

import { useState } from "react";
import type { Order, ConfeccionData } from "@/lib/types";
import { createEmptyConfeccion } from "@/lib/types";
import { useOrders } from "@/lib/orders-context";

interface Props {
  order: Order;
}

export default function ConfeccionPanel({ order }: Props) {
  const { updateOrderProcess } = useOrders();
  const initial: ConfeccionData = order.confeccion ?? createEmptyConfeccion();
  const [form, setForm] = useState<ConfeccionData>(initial);

  const handleSave = () => {
    updateOrderProcess(order.id, "confeccion", form);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Confección</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Confección (quién)
          </label>
          <input
            type="text"
            value={form.confeccion}
            onChange={(e) => setForm((prev) => ({ ...prev, confeccion: e.target.value }))}
            placeholder="Ej: Julio, Daniel, s/conf."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Costo Confección
          </label>
          <input
            type="number"
            value={form.costoConfeccion ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                costoConfeccion: e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            step="0.01"
            placeholder="Ej: 66600"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Guardar Confección
        </button>
      </div>
    </div>
  );
}
