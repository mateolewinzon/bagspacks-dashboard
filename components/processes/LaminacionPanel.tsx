"use client";

import { useState } from "react";
import type { Order, LaminacionData } from "@/lib/types";
import { createEmptyLaminacion } from "@/lib/types";
import { useOrders } from "@/lib/orders-context";

interface Props {
  order: Order;
}

export default function LaminacionPanel({ order }: Props) {
  const { updateOrderProcess } = useOrders();
  const initial: LaminacionData = order.laminacion ?? createEmptyLaminacion();
  const [form, setForm] = useState<LaminacionData>(initial);

  const handleSave = () => {
    updateOrderProcess(order.id, "laminacion", form);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Laminación</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Responsable
          </label>
          <input
            type="text"
            value={form.responsable}
            onChange={(e) => setForm((prev) => ({ ...prev, responsable: e.target.value }))}
            placeholder="Responsable del proceso"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Notas
          </label>
          <input
            type="text"
            value={form.notas}
            onChange={(e) => setForm((prev) => ({ ...prev, notas: e.target.value }))}
            placeholder="Observaciones"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Guardar Laminación
        </button>
      </div>
    </div>
  );
}
