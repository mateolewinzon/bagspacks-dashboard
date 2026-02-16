"use client";

import { useState, useMemo } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import {
  createEmptyExtrusion,
  createEmptyImpresion,
  createEmptyLaminacion,
  createEmptyConfeccion,
} from "@/lib/types";
import {
  parseMeasures,
  formatMeasures,
  computeWeightKg,
} from "@/lib/measures";

interface FormState {
  orderNumber: number;
  date: string;
  clientName: string;
  description: string;
  quantity: number;
  ancho: number | null;
  largo: number | null;
  espesor: number | null;
  measuresLegacy: string;
  weightKgManual: number;
  precioVenta: number | null;
  estado: OrderStatus;
  // process responsibles
  extrusor: string;
  imprenta: string;
  responsableLaminacion: string;
  confeccionResponsable: string;
}

interface OrderBasicFormProps {
  initialData?: Partial<Order>;
  onSubmit: (data: Omit<Order, "id">) => void | Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

export default function OrderBasicForm({
  initialData,
  onSubmit,
  onCancel,
  error: submitError,
}: OrderBasicFormProps) {
  const parsed = initialData?.measures
    ? parseMeasures(initialData.measures)
    : null;

  const [form, setForm] = useState<FormState>({
    orderNumber: initialData?.orderNumber ?? 0,
    date: initialData?.date ?? new Date().toISOString().split("T")[0],
    clientName: initialData?.clientName ?? "",
    description: initialData?.description ?? "",
    quantity: initialData?.quantity ?? 0,
    ancho: parsed?.ancho ?? null,
    largo: parsed?.largo ?? null,
    espesor: parsed?.espesor ?? null,
    measuresLegacy: parsed ? "" : (initialData?.measures ?? ""),
    weightKgManual: initialData?.weightKg ?? 0,
    precioVenta: initialData?.precioVenta ?? null,
    estado: initialData?.estado ?? "extrusion",
    extrusor: initialData?.extrusion?.extrusor ?? "",
    imprenta: initialData?.impresion?.imprenta ?? "",
    responsableLaminacion: initialData?.laminacion?.responsable ?? "",
    confeccionResponsable: initialData?.confeccion?.confeccion ?? "",
  });

  const hasMeasures =
    form.ancho != null &&
    form.ancho > 0 &&
    form.largo != null &&
    form.largo > 0 &&
    form.espesor != null &&
    form.espesor > 0;

  const calculatedKg = useMemo(() => {
    if (!hasMeasures || !form.quantity) return null;
    return computeWeightKg(form.ancho!, form.largo!, form.espesor!, form.quantity);
  }, [hasMeasures, form.ancho, form.largo, form.espesor, form.quantity]);

  const nullableNumberFields = new Set([
    "precioVenta",
    "ancho",
    "largo",
    "espesor",
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? nullableNumberFields.has(name)
              ? null
              : 0
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const measures =
      hasMeasures
        ? formatMeasures(form.ancho!, form.largo!, form.espesor!)
        : form.measuresLegacy;

    const weightKg = calculatedKg ?? form.weightKgManual;

    const orderData: Omit<Order, "id"> = {
      orderNumber: form.orderNumber,
      date: form.date,
      clientName: form.clientName,
      description: form.description,
      quantity: form.quantity,
      measures,
      weightKg,
      precioVenta: form.precioVenta,
      estado: form.estado,
    };

    // Build process objects — preserve existing cost data from initialData
    if (form.extrusor || initialData?.extrusion) {
      orderData.extrusion = {
        ...(initialData?.extrusion || createEmptyExtrusion()),
        extrusor: form.extrusor,
      };
    }

    if (form.imprenta || initialData?.impresion) {
      orderData.impresion = {
        ...(initialData?.impresion || createEmptyImpresion()),
        imprenta: form.imprenta,
      };
    }

    if (form.responsableLaminacion || initialData?.laminacion) {
      orderData.laminacion = {
        ...(initialData?.laminacion || createEmptyLaminacion()),
        responsable: form.responsableLaminacion,
      };
    }

    if (form.confeccionResponsable || initialData?.confeccion) {
      orderData.confeccion = {
        ...(initialData?.confeccion || createEmptyConfeccion()),
        confeccion: form.confeccionResponsable,
      };
    }

    // Preserve costoExtra if it existed
    if (initialData?.costoExtra) {
      orderData.costoExtra = initialData.costoExtra;
    }

    await onSubmit(orderData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {initialData?.orderNumber ? "Editar Pedido" : "Nuevo Pedido"}
      </h2>
      {submitError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="orderNumber"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Nro de Pedido
          </label>
          <input
            type="number"
            id="orderNumber"
            name="orderNumber"
            value={form.orderNumber || ""}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="clientName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Cliente
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="quantity"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={form.quantity || ""}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="ancho"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Ancho (cm)
          </label>
          <input
            type="number"
            id="ancho"
            name="ancho"
            value={form.ancho ?? ""}
            onChange={handleChange}
            step="0.1"
            placeholder="cm"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="largo"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Largo (cm)
          </label>
          <input
            type="number"
            id="largo"
            name="largo"
            value={form.largo ?? ""}
            onChange={handleChange}
            step="0.1"
            placeholder="cm"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="espesor"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Espesor (micrones)
          </label>
          <input
            type="number"
            id="espesor"
            name="espesor"
            value={form.espesor ?? ""}
            onChange={handleChange}
            step="1"
            placeholder="µm"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="weightKg"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Peso (kg)
          </label>
          {calculatedKg != null ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="weightKg"
                value={calculatedKg}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-sm"
              />
              <span className="whitespace-nowrap text-xs text-gray-400">auto</span>
            </div>
          ) : (
            <input
              type="number"
              id="weightKg"
              name="weightKgManual"
              value={form.weightKgManual || ""}
              onChange={handleChange}
              step="0.1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}
        </div>
        <div>
          <label
            htmlFor="precioVenta"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Precio Venta
          </label>
          <input
            type="number"
            id="precioVenta"
            name="precioVenta"
            value={form.precioVenta ?? ""}
            onChange={handleChange}
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ── Responsables de procesos ── */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Responsables de Procesos
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="extrusor"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Extrusión
            </label>
            <input
              type="text"
              id="extrusor"
              name="extrusor"
              value={form.extrusor}
              onChange={handleChange}
              placeholder="Ej: Julian, P.Online"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="imprenta"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Impresión
            </label>
            <input
              type="text"
              id="imprenta"
              name="imprenta"
              value={form.imprenta}
              onChange={handleChange}
              placeholder="Ej: Juanka, Julio"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="responsableLaminacion"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Laminación
            </label>
            <input
              type="text"
              id="responsableLaminacion"
              name="responsableLaminacion"
              value={form.responsableLaminacion}
              onChange={handleChange}
              placeholder="Responsable"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confeccionResponsable"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confección
            </label>
            <input
              type="text"
              id="confeccionResponsable"
              name="confeccionResponsable"
              value={form.confeccionResponsable}
              onChange={handleChange}
              placeholder="Ej: Julio, Daniel"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData?.orderNumber ? "Guardar cambios" : "Crear pedido"}
        </button>
      </div>
    </form>
  );
}
