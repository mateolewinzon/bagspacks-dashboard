"use client";

import { useState } from "react";
import type { Order, ImpresionData } from "@/lib/types";
import { createEmptyImpresion } from "@/lib/types";
import { useOrders } from "@/lib/orders-context";

interface Props {
  order: Order;
}

export default function ImpresionPanel({ order }: Props) {
  const { updateOrderProcess } = useOrders();
  const initial: ImpresionData = order.impresion ?? createEmptyImpresion();
  const [form, setForm] = useState<ImpresionData>(initial);

  const handleSave = () => {
    updateOrderProcess(order.id, "impresion", form);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Impresión</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Imprenta (quién)
          </label>
          <input
            type="text"
            value={form.imprenta}
            onChange={(e) => setForm((prev) => ({ ...prev, imprenta: e.target.value }))}
            placeholder="Ej: Juanka, Julio, s/imp."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Costo Impresión
          </label>
          <input
            type="number"
            value={form.costoImpresion ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                costoImpresion: e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            step="0.01"
            placeholder="Ej: 24200"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Guardar Impresión
        </button>
      </div>
    </div>
  );
}
