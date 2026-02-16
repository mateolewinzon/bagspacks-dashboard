"use client";

import { useState, useRef, useEffect } from "react";
import { useOrders } from "@/lib/orders-context";
import type { Order, OrderStatus } from "@/lib/types";
import {
  ORDER_STATUS_OPTIONS,
  getResponsableForEstado,
} from "@/lib/types";
import OrderBasicForm from "./OrderBasicForm";

// ── Status badge styling ───────────────────────────────────
const STATUS_STYLES: Record<OrderStatus, string> = {
  extrusion: "bg-orange-100 text-orange-700 border-orange-200",
  impresion: "bg-purple-100 text-purple-700 border-purple-200",
  confeccion: "bg-blue-100 text-blue-700 border-blue-200",
  terminado: "bg-green-100 text-green-700 border-green-200",
  entregado: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  extrusion: "Extrusión",
  impresion: "Impresión",
  confeccion: "Confección",
  terminado: "Terminado",
  entregado: "Entregado",
};

// ── Main component ─────────────────────────────────────────
export default function SeguimientoList() {
  const { orders, addOrder, updateOrder, deleteOrder, loading, error } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter out "entregado" orders
  const visibleOrders = orders.filter((o) => o.estado !== "entregado");

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seguimiento</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Agregar pedido
        </button>
      </div>

      {showForm && (
        <OrderBasicForm
          onSubmit={async (data) => {
            try {
              await addOrder(data);
              setShowForm(false);
            } catch {
              // Error could be shown via context or local state
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Cargando pedidos...
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">
            No hay pedidos en seguimiento. Hacé clic en &quot;Agregar
            pedido&quot; para crear el primero.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Precio Venta
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Precio/Kg
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Estado
                </th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {visibleOrders.map((order) => (
                <SeguimientoRow
                  key={order.id}
                  order={order}
                  isEditing={editingId === order.id}
                  onEdit={() => setEditingId(order.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onSave={(data) => {
                    updateOrder(order.id, data);
                    setEditingId(null);
                  }}
                  onDelete={() => deleteOrder(order.id)}
                  onChangeStatus={(status) =>
                    updateOrder(order.id, {
                      estado: status,
                      estadoFecha: new Date().toISOString(),
                    })
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Row component ──────────────────────────────────────────
interface SeguimientoRowProps {
  order: Order;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (data: Partial<Order>) => void;
  onDelete: () => void;
  onChangeStatus: (status: OrderStatus) => void;
}

function SeguimientoRow({
  order,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onChangeStatus,
}: SeguimientoRowProps) {
  if (isEditing) {
    return (
      <tr>
        <td colSpan={11} className="bg-gray-50 px-6 py-4">
          <OrderBasicForm
            initialData={order}
            onSubmit={(data) => onSave(data)}
            onCancel={onCancelEdit}
          />
        </td>
      </tr>
    );
  }

  const responsable = getResponsableForEstado(order);

  return (
    <tr className="transition-colors hover:bg-gray-50">
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
      <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-medium text-gray-900">
        {order.precioVenta != null ? (
          `$${order.precioVenta.toLocaleString("es-AR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}`
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
        {order.precioVenta != null && order.weightKg > 0 ? (
          `$${(order.precioVenta / order.weightKg).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}/kg`
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <StatusBadge
          order={order}
          responsable={responsable}
          onChangeStatus={onChangeStatus}
        />
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Editar"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Eliminar"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Status badge with dropdown ─────────────────────────────
interface StatusBadgeProps {
  order: Order;
  responsable: string | null;
  onChangeStatus: (status: OrderStatus) => void;
}

function StatusBadge({ order, responsable, onChangeStatus }: StatusBadgeProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        btnRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on scroll / resize
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(!open);
  };

  const style = STATUS_STYLES[order.estado];
  const label = STATUS_LABELS[order.estado];

  const fechaStr = order.estadoFecha
    ? new Date(order.estadoFecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
      })
    : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:opacity-80 ${style}`}
      >
        <span>{label}</span>
        {responsable && (
          <span className="font-normal opacity-75">· {responsable}</span>
        )}
        {fechaStr && (
          <span className="font-normal opacity-60">({fechaStr})</span>
        )}
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-50 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          style={{ top: pos.top, left: pos.left }}
        >
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChangeStatus(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                order.estado === opt.value
                  ? "font-semibold text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${STATUS_STYLES[opt.value].split(" ")[0]}`}
              />
              {opt.label}
              {order.estado === opt.value && (
                <svg
                  className="ml-auto h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
