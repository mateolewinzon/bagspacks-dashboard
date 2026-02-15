"use client";

import { useState } from "react";
import type { Order, CostoExtraData } from "@/lib/types";
import { createEmptyCostoExtra } from "@/lib/types";
import { useOrders } from "@/lib/orders-context";

interface Props {
  order: Order;
}

export default function CostoExtraPanel({ order }: Props) {
  const { updateOrderProcess } = useOrders();
  const initial: CostoExtraData = order.costoExtra ?? createEmptyCostoExtra();
  const [form, setForm] = useState<CostoExtraData>(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOrderProcess(order.id, "costoExtra", form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Costo Extra</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Costo Extra
          </label>
          <input
            type="number"
            value={form.costoExtra ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                costoExtra: e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            step="0.01"
            placeholder="Ej: 42900"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Descripción
          </label>
          <input
            type="text"
            value={form.descripcion}
            onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Detalle del costo extra"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando…
            </>
          ) : (
            "Guardar Costo Extra"
          )}
        </button>
      </div>
    </div>
  );
}
