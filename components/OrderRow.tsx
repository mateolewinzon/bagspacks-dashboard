"use client";

import { useState } from "react";
import type { Order, ProcessKey } from "@/lib/types";
import { getCostoTotal, hasProcessCost } from "@/lib/types";
import { useOrders } from "@/lib/orders-context";
import ProcessTabs from "./ProcessTabs";
import OrderBasicForm from "./OrderBasicForm";

interface OrderRowProps {
  order: Order;
}

const PROCESS_KEYS: ProcessKey[] = [
  "extrusion",
  "impresion",
  "laminacion",
  "confeccion",
  "costoExtra",
];

function getProcessesWithCost(order: Order): ProcessKey[] {
  return PROCESS_KEYS.filter((key) => hasProcessCost(order, key));
}

export default function OrderRow({ order }: OrderRowProps) {
  const { deleteOrder, updateOrder } = useOrders();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  const processesWithCost = getProcessesWithCost(order);
  const costoTotal = getCostoTotal(order);

  return (
    <>
      <tr
        className="transition-colors hover:bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-3 text-gray-400">
          <svg
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
          {order.orderNumber}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
          {order.date}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
          {order.clientName}
        </td>
        <td className="max-w-[200px] truncate px-3 py-3 text-sm text-gray-600">
          {order.description}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
          {order.quantity.toLocaleString()}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
          {order.measures}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
          {order.weightKg}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-center">
          {(() => {
            const count = processesWithCost.length;
            const total = PROCESS_KEYS.length;
            const bg =
              count === 0
                ? "bg-gray-100 text-gray-500"
                : count === total
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700";
            return (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bg}`}
              >
                {count}/{total}
              </span>
            );
          })()}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-medium text-gray-900">
          {costoTotal != null
            ? `$${costoTotal.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
            : <span className="text-gray-400">—</span>}
        </td>
        <td className="px-3 py-3">
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setEditing(true)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Editar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => deleteOrder(order.id)}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Eliminar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {editing && (
        <tr>
          <td colSpan={11} className="bg-gray-50 px-6 py-4">
            <OrderBasicForm
              initialData={order}
              onSubmit={(data) => {
                updateOrder(order.id, data);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          </td>
        </tr>
      )}

      {expanded && !editing && (
        <tr>
          <td colSpan={11} className="bg-gray-50/50 px-6 py-4">
            <ProcessTabs order={order} />
          </td>
        </tr>
      )}
    </>
  );
}
