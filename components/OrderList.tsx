"use client";

import { useState } from "react";
import { useOrders } from "@/lib/orders-context";
import OrderRow from "./OrderRow";
import OrderBasicForm from "./OrderBasicForm";

export default function OrderList() {
  const { orders, addOrder, loading, error } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: Parameters<typeof addOrder>[0]) => {
    setSubmitError(null);
    try {
      await addOrder(data);
      setShowForm(false);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Error al crear pedido");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Costos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Agregar pedido
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <OrderBasicForm
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setSubmitError(null); }}
          error={submitError}
        />
      )}

      {loading ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Cargando pedidos...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">
            No hay pedidos todavía. Hacé clic en &quot;Agregar pedido&quot; para
            crear el primero.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-3 py-3"></th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Nro
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Fecha
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Cliente
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Descripción
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Cantidad
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Medidas
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Peso (kg)
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Procesos
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Costo Total
                </th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
