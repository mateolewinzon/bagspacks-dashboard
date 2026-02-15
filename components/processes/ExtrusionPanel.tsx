"use client";

import { useState } from "react";
import type { Order, ExtrusionData } from "@/lib/types";
import { createEmptyExtrusion } from "@/lib/types";
import { useOrders } from "@/lib/orders-context";

interface Props {
  order: Order;
}

export default function ExtrusionPanel({ order }: Props) {
  const { updateOrderProcess } = useOrders();
  const initial: ExtrusionData = order.extrusion ?? createEmptyExtrusion();
  const [form, setForm] = useState<ExtrusionData>(initial);

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? null : Number(value),
    }));
  };

  const handleSave = () => {
    updateOrderProcess(order.id, "extrusion", form);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Extrusión</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Extrusor */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Extrusión (quién)
          </label>
          <input
            type="text"
            name="extrusor"
            value={form.extrusor}
            onChange={handleText}
            placeholder="Ej: P.Online, Julian"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Material */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Material
          </label>
          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleText}
            placeholder="Ej: PEBD, PEBD coex, PEAD"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Cantidad Mts */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Cantidad Mts
          </label>
          <input
            type="text"
            name="cantidadMts"
            value={form.cantidadMts}
            onChange={handleText}
            placeholder="Ej: 1100 mts"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Ancho */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Ancho (cm)
          </label>
          <input
            type="number"
            name="ancho"
            value={form.ancho ?? ""}
            onChange={handleNumber}
            placeholder="Ej: 55"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Micrones */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Micrones
          </label>
          <input
            type="number"
            name="micrones"
            value={form.micrones ?? ""}
            onChange={handleNumber}
            placeholder="Ej: 60"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Tipo */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Tipo
          </label>
          <input
            type="text"
            name="tipo"
            value={form.tipo}
            onChange={handleText}
            placeholder="Ej: Tubo, Lamina, F 7"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Color */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleText}
            placeholder="Ej: Cristal, Blanco, B/N"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Kilos */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Kilos
          </label>
          <input
            type="number"
            name="kilos"
            value={form.kilos ?? ""}
            onChange={handleNumber}
            step="0.1"
            placeholder="Ej: 55"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Precio Unitario */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Pr. Unitario
          </label>
          <input
            type="number"
            name="precioUnitario"
            value={form.precioUnitario ?? ""}
            onChange={handleNumber}
            step="0.01"
            placeholder="Ej: 4736"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Costo */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Costo
          </label>
          <input
            type="number"
            name="costo"
            value={form.costo ?? ""}
            onChange={handleNumber}
            step="0.01"
            placeholder="Ej: 260480"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Guardar Extrusión
        </button>
      </div>
    </div>
  );
}
